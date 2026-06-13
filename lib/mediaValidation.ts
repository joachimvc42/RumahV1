/**
 * Shared client-side validation for media uploads (admin).
 * Catches unsupported formats / oversized files BEFORE upload so the admin
 * gets an explicit message instead of a silent, never-completing save.
 */

export const MAX_IMAGE_MB = 10;
export const MAX_VIDEO_MB = 200;

const MB = 1024 * 1024;

// MIME types browsers commonly report. Some (.mov/.avi) come through empty,
// so we always fall back to the file extension.
const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/avi', 'video/x-msvideo', 'video/mov', 'video/x-m4v'];

const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const VIDEO_EXT = ['mp4', 'mov', 'webm', 'avi', 'm4v'];

function ext(name: string): string {
  return (name.split('.').pop() || '').toLowerCase();
}

function fmtMB(bytes: number): string {
  return `${(bytes / MB).toFixed(bytes >= 10 * MB ? 0 : 1)} MB`;
}

/** Returns a human-readable error string, or null when the file is valid. */
export function validateImageFile(file: File): string | null {
  const okType = IMAGE_TYPES.includes(file.type.toLowerCase()) || IMAGE_EXT.includes(ext(file.name));
  if (!okType) {
    return `“${file.name}” was rejected — unsupported image format (use JPG, PNG, WebP or GIF).`;
  }
  if (file.size > MAX_IMAGE_MB * MB) {
    return `“${file.name}” was rejected — ${fmtMB(file.size)} exceeds the ${MAX_IMAGE_MB} MB photo limit.`;
  }
  return null;
}

/** Returns a human-readable error string, or null when the file is valid. */
export function validateVideoFile(file: File): string | null {
  const okType = VIDEO_TYPES.includes(file.type.toLowerCase()) || VIDEO_EXT.includes(ext(file.name));
  if (!okType) {
    return `“${file.name}” was rejected — unsupported video format (use MP4, MOV, WebM or AVI).`;
  }
  if (file.size > MAX_VIDEO_MB * MB) {
    return `“${file.name}” was rejected — ${fmtMB(file.size)} exceeds the ${MAX_VIDEO_MB} MB video limit.`;
  }
  return null;
}

/**
 * Validates a batch of files. Returns the accepted files plus a combined
 * error message listing everything that was rejected (or null when all pass).
 */
export function partitionValidFiles(
  files: File[],
  kind: 'image' | 'video'
): { valid: File[]; error: string | null } {
  const validate = kind === 'image' ? validateImageFile : validateVideoFile;
  const valid: File[] = [];
  const errors: string[] = [];
  for (const file of files) {
    const err = validate(file);
    if (err) errors.push(err);
    else valid.push(file);
  }
  return { valid, error: errors.length ? errors.join('\n') : null };
}
