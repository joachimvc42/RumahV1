'use client';

import { useRef } from 'react';
import type { SortableGalleryItem } from '../../lib/galleryUtils';
import { moveItem } from '../../lib/galleryUtils';

type Props = {
  items: SortableGalleryItem[];
  onChange: (items: SortableGalleryItem[]) => void;
};

export default function AdminMediaGallery({ items, onChange }: Props) {
  const dragFrom = useRef<number | null>(null);

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    dragFrom.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (toIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const from =
      dragFrom.current ??
      (() => {
        const parsed = parseInt(e.dataTransfer.getData('text/plain'), 10);
        return Number.isFinite(parsed) ? parsed : null;
      })();
    dragFrom.current = null;
    if (from === null || from === toIndex) return;
    onChange(moveItem(items, from, toIndex));
  };

  const handleDragEnd = () => { dragFrom.current = null; };

  const setMain = (index: number) => {
    if (index === 0) return;
    onChange(moveItem(items, index, 0));
  };

  const removeAt = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  if (items.length === 0) return null;

  return (
    <>
      <p style={{ marginTop: 16, marginBottom: 12, color: '#6b7280', fontSize: 13, lineHeight: 1.5 }}>
        Glissez-déposez pour réorganiser. Le premier élément est mis en avant. Les vidéos affichent une icône ▶.
      </p>
      <div style={gs.grid}>
        {items.map((item, index) => (
          <div key={item.id} style={gs.card}>
            <div style={gs.cardRow}>
              <div
                draggable
                onDragStart={handleDragStart(index)}
                onDragEnd={handleDragEnd}
                style={gs.dragHandle}
                title="Glisser pour réorganiser"
              >
                ⋮⋮
              </div>
              <div onDragOver={handleDragOver} onDrop={handleDrop(index)} style={gs.dropTarget}>
                <div style={gs.imageWrap}>
                  {item.mediaType === 'video' ? (
                    <>
                      <video
                        src={item.previewSrc}
                        style={gs.preview}
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <div style={gs.videoIcon}>▶</div>
                    </>
                  ) : (
                    <img src={item.previewSrc} alt="" style={gs.preview} />
                  )}
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    style={gs.removeBtn}
                    aria-label="Supprimer"
                  >
                    ✕
                  </button>
                  {index === 0 && (
                    <span style={gs.mainBadge}>
                      {item.mediaType === 'video' ? '🎬 Principal' : '📷 Principal'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {index !== 0 && (
              <button type="button" onClick={() => setMain(index)} style={gs.mainBtn}>
                Mettre en avant
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

const gs: { [key: string]: React.CSSProperties } = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 12,
    alignItems: 'start',
  },
  card: { display: 'flex', flexDirection: 'column', gap: 8 },
  cardRow: { display: 'flex', gap: 8, alignItems: 'stretch' },
  dropTarget: { flex: 1, minWidth: 0 },
  dragHandle: {
    cursor: 'grab',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    flexShrink: 0,
    fontSize: 16,
    letterSpacing: '-2px',
    color: '#9ca3af',
    borderRadius: 8,
    background: '#f3f4f6',
    border: '1px solid #e5e7eb',
  },
  imageWrap: {
    position: 'relative',
    aspectRatio: '4/3',
    borderRadius: 12,
    overflow: 'hidden',
    background: '#1f2937',
  },
  preview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    pointerEvents: 'none',
  },
  videoIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 24,
    color: '#fff',
    background: 'rgba(0,0,0,0.5)',
    borderRadius: '50%',
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 700,
    zIndex: 2,
  },
  mainBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(135deg, #2563eb, #22c55e)',
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    textAlign: 'center',
    padding: '4px 0',
    zIndex: 1,
  },
  mainBtn: {
    width: '100%',
    padding: '8px 10px',
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 8,
    border: '1px solid #d1d5db',
    background: '#fff',
    color: '#374151',
    cursor: 'pointer',
  },
};