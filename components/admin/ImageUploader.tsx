'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

type ImageUploaderProps = {
  bucket: string;
  entityId: string;
  onUpload: (url: string) => void;
};

export default function ImageUploader({ bucket, entityId, onUpload }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${entityId}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    onUpload(publicUrl);
    setUploading(false);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <span style={{ marginLeft: 8 }}>Uploading…</span>}
    </div>
  );
}
