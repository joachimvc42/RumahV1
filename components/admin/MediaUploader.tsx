'use client';

import { useRef } from 'react';
import type { SortableGalleryItem, MediaType } from '../../lib/galleryUtils';
import { readFileAsDataURL } from '../../lib/galleryUtils';

type Props = {
  onAdd: (items: SortableGalleryItem[]) => void;
};

function detectMediaType(file: File): MediaType {
  if (file.type.startsWith('video/')) return 'video';
  return 'image';
}

export default function MediaUploader({ onAdd }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems: SortableGalleryItem[] = [];

    for (const file of Array.from(files)) {
      const mediaType = detectMediaType(file);
      let previewSrc: string;

      if (mediaType === 'video') {
        // Use a placeholder preview for videos before upload
        previewSrc = URL.createObjectURL(file);
      } else {
        previewSrc = await readFileAsDataURL(file);
      }

      newItems.push({
        id: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        previewSrc,
        mediaType,
        file,
      });
    }

    onAdd(newItems);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div
      style={{
        border: '2px dashed #d1d5db',
        borderRadius: 12,
        padding: '20px 16px',
        textAlign: 'center',
        background: '#f9fafb',
        cursor: 'pointer',
      }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div style={{ fontSize: 28, marginBottom: 8 }}>📁</div>
      <p style={{ margin: 0, fontWeight: 600, color: '#374151', fontSize: 14 }}>
        Cliquez ou glissez des fichiers ici
      </p>
      <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9ca3af' }}>
        Photos (JPG, PNG, WebP) et vidéos (MP4, MOV, WebM) acceptées
      </p>
    </div>
  );
}