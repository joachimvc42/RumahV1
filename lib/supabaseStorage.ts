import { supabase } from './supabaseClient';

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