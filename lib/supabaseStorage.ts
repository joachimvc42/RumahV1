import { supabase } from './supabaseClient';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// Kept for backward compat
export const uploadImage = uploadFile;

export type UploadProgress = { loaded: number; total: number };

/**
 * Uploads a single file to Supabase Storage via XHR so we get REAL byte-level
 * progress (the supabase-js SDK upload() resolves only at completion and reports
 * no progress, which is why large video uploads used to look "stuck" or jump to
 * 100% prematurely). Mirrors the SDK's auth: session token if signed in, else
 * the anon key — same effective permissions as supabase.storage.upload().
 */
export function uploadFileWithProgress(
  bucket: string,
  path: string,
  file: File,
  onProgress?: (p: UploadProgress) => void,
  opts?: { upsert?: boolean }
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let token = SUPABASE_ANON_KEY;
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.access_token) token = data.session.access_token;
    } catch {
      /* fall back to anon key */
    }

    const xhr = new XMLHttpRequest();
    const url = `${SUPABASE_URL}/storage/v1/object/${bucket}/${encodeURI(path)}`;
    xhr.open(opts?.upsert ? 'PUT' : 'POST', url, true);
    xhr.setRequestHeader('authorization', `Bearer ${token}`);
    xhr.setRequestHeader('apikey', SUPABASE_ANON_KEY);
    xhr.setRequestHeader('x-upsert', opts?.upsert ? 'true' : 'false');
    xhr.setRequestHeader('cache-control', 'max-age=3600');
    if (file.type) xhr.setRequestHeader('content-type', file.type);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress({ loaded: e.loaded, total: e.total });
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        resolve(data.publicUrl);
      } else {
        let msg = `Upload failed (HTTP ${xhr.status})`;
        try {
          const j = JSON.parse(xhr.responseText);
          msg = j.message || j.error || j.statusCode || msg;
        } catch {
          /* keep default */
        }
        if (xhr.status === 413) msg = 'Upload failed — file too large for the storage bucket.';
        reject(new Error(msg));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload. Check your connection and try again.'));
    xhr.onabort = () => reject(new Error('Upload aborted.'));

    xhr.send(file);
  });
}

/**
 * Tracks aggregate upload progress across many files of known total size,
 * reporting a single 0–99% value (100% is reserved for the finalize step).
 */
export function makeProgressTracker(totalBytes: number, onPercent: (pct: number) => void) {
  const total = Math.max(totalBytes, 1);
  let loaded = 0;
  const emit = () => onPercent(Math.min(99, Math.round((loaded / total) * 100)));
  return {
    /** Begin tracking one file; feed its onProgress to uploadFileWithProgress, call done() after. */
    track(fileSize: number) {
      let last = 0;
      return {
        onProgress: (p: UploadProgress) => {
          loaded += p.loaded - last;
          last = p.loaded;
          emit();
        },
        done: () => {
          loaded += fileSize - last;
          last = fileSize;
          emit();
        },
      };
    },
  };
}
