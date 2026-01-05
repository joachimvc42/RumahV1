import { supabase } from '@/lib/supabaseClient';

export async function uploadImage(
  bucket: string,
  path: string,
  file: File
) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
