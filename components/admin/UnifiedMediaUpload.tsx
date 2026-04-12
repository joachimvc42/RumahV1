'use client';

import { useRef } from 'react';
import type { SortableGalleryItem } from '../../lib/galleryUtils';
import { readFileAsDataURL, moveItem } from '../../lib/galleryUtils';

export type MediaGalleryItem = {
  id: string;
  previewSrc: string;
  mediaType: 'image' | 'video';
  file?: File;
  name: string;
  isExisting?: boolean;
};

type Props = {
  items: MediaGalleryItem[];
  onChange: (items: MediaGalleryItem[]) => void;
};

export async function fileToMediaItem(file: File): Promise<MediaGalleryItem> {
  const isVideo = file.type.startsWith('video/');
  return {
    id: crypto.randomUUID(),
    previewSrc: isVideo ? URL.createObjectURL(file) : await readFileAsDataURL(file),
    mediaType: isVideo ? 'video' : 'image',
    file,
    name: file.name,
    isExisting: false,
  };
}

export function urlsToMediaItems(images: string[], videos: string[]): MediaGalleryItem[] {
  const imageItems: MediaGalleryItem[] = (images || []).map((url, i) => ({
    id: `img-${i}-${url.slice(-16)}`,
    previewSrc: url,
    mediaType: 'image',
    name: url.split('/').pop() || `image_${i + 1}`,
    isExisting: true,
  }));
  const videoItems: MediaGalleryItem[] = (videos || []).filter(Boolean).map((url, i) => ({
    id: `vid-${i}-${url.slice(-16)}`,
    previewSrc: url,
    mediaType: 'video',
    name: url.split('/').pop() || `video_${i + 1}`,
    isExisting: true,
  }));
  return [...imageItems, ...videoItems];
}

export function splitMediaItems(items: MediaGalleryItem[]): { imageUrls: string[]; videoUrls: string[] } {
  return {
    imageUrls: items.filter(i => i.mediaType === 'image').map(i => i.previewSrc),
    videoUrls: items.filter(i => i.mediaType === 'video').map(i => i.previewSrc),
  };
}

export default function UnifiedMediaUpload({ items, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragFrom = useRef<number | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const added: MediaGalleryItem[] = [];
    for (const file of Array.from(files)) {
      added.push(await fileToMediaItem(file));
    }
    onChange([...items, ...added]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeAt = (index: number) => {
    const item = items[index];
    if (item && !item.isExisting && item.mediaType === 'video') {
      URL.revokeObjectURL(item.previewSrc);
    }
    onChange(items.filter((_, i) => i !== index));
  };

  const setMain = (index: number) => {
    if (index === 0) return;
    onChange(moveItem(items, index, 0));
  };

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    dragFrom.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (toIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const from = dragFrom.current;
    dragFrom.current = null;
    if (from === null || from === toIndex) return;
    onChange(moveItem(items, from, toIndex));
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        style={s.dropzone}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/mp4,video/mov,video/quicktime,video/webm,video/avi"
          multiple
          style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)}
        />
        <span style={{ fontSize: 32 }}>📁</span>
        <span style={s.dropzoneMain}>Add photos & videos</span>
        <span style={s.dropzoneHint}>JPG, PNG, WebP · MP4, MOV, WebM — click or drag & drop</span>
      </div>

      {/* Gallery */}
      {items.length > 0 && (
        <>
          <p style={s.hint}>
            Drag to reorder. First item = main display. Videos show a ▶ icon.
          </p>
          <div style={s.grid}>
            {items.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={handleDragStart(index)}
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop(index)}
                style={s.cell}
              >
                <div style={s.thumb}>
                  {item.mediaType === 'video' ? (
                    <>
                      <video src={item.previewSrc} style={s.thumbMedia} muted playsInline preload="metadata" />
                      <div style={s.videoOverlay}>▶</div>
                    </>
                  ) : (
                    <img src={item.previewSrc} alt="" style={s.thumbMedia} />
                  )}

                  <button type="button" onClick={() => removeAt(index)} style={s.removeBtn}>✕</button>

                  {index === 0 && (
                    <div style={s.mainBadge}>
                      {item.mediaType === 'video' ? '🎬 Main' : '📷 Main'}
                    </div>
                  )}

                  {item.isExisting && index !== 0 && (
                    <div style={s.savedBadge}>Saved</div>
                  )}
                </div>

                {index !== 0 && (
                  <button type="button" onClick={() => setMain(index)} style={s.setMainBtn}>
                    Set as main
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const s: { [key: string]: React.CSSProperties } = {
  dropzone: { border: '2px dashed #d1d5db', borderRadius: 14, padding: '28px 20px', textAlign: 'center', background: '#f9fafb', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 8 },
  dropzoneMain: { fontWeight: 600, color: '#374151', fontSize: 15 },
  dropzoneHint: { fontSize: 12, color: '#9ca3af' },
  hint: { fontSize: 12, color: '#9ca3af', margin: '8px 0 12px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 12 },
  cell: { display: 'flex', flexDirection: 'column', gap: 6, cursor: 'grab' },
  thumb: { position: 'relative', aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden', background: '#1f2937' },
  thumbMedia: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' },
  videoOverlay: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff', background: 'rgba(0,0,0,0.35)', pointerEvents: 'none' },
  removeBtn: { position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: '50%', background: 'rgba(0,0,0,0.65)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  mainBadge: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(135deg,#2563eb,#22c55e)', color: '#fff', fontSize: 10, fontWeight: 700, textAlign: 'center', padding: '3px 0' },
  savedBadge: { position: 'absolute', top: 6, left: 6, background: 'rgba(52,211,153,0.9)', color: '#065f46', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4 },
  setMainBtn: { width: '100%', padding: '6px 8px', fontSize: 11, fontWeight: 600, borderRadius: 7, border: '1px solid #d1d5db', background: '#fff', color: '#374151', cursor: 'pointer' },
};
