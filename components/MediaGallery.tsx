'use client';

import { useState } from 'react';

type MediaItem = { src: string; type: 'image' | 'video' };

function isVideoUrl(url: string) {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  return ext && ['mp4', 'mov', 'webm', 'avi', 'm4v', 'mkv'].includes(ext);
}

export function buildMediaList(images: string[], videos: string[]): MediaItem[] {
  return [
    ...(images || []).map(src => ({ src, type: 'image' as const })),
    ...(videos || []).filter(Boolean).map(src => ({
      src,
      type: isVideoUrl(src) ? 'video' as const : 'image' as const,
    })),
  ];
}

type Props = {
  images: string[];
  videos: string[];
  title: string;
};

export default function MediaGallery({ images, videos, title }: Props) {
  const media = buildMediaList(images, videos);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (media.length === 0) {
    return (
      <div style={s.noMedia}>
        <span style={{ fontSize: 64 }}>🏠</span>
        <p>No photos available</p>
      </div>
    );
  }

  const current = media[currentIndex];
  const next = () => setCurrentIndex(c => (c + 1) % media.length);
  const prev = () => setCurrentIndex(c => (c - 1 + media.length) % media.length);

  return (
    <div>
      {/* Main viewer */}
      <div style={s.mainMedia}>
        {current.type === 'video' ? (
          <video
            key={current.src}
            src={current.src}
            style={s.mainEl}
            controls
            autoPlay
            playsInline
          />
        ) : (
          <img src={current.src} alt={`${title} - ${currentIndex + 1}`} style={s.mainEl} />
        )}

        {media.length > 1 && (
          <>
            <button onClick={prev} style={{ ...s.navBtn, left: 12 }}>‹</button>
            <button onClick={next} style={{ ...s.navBtn, right: 12 }}>›</button>
            <div style={s.counter}>{currentIndex + 1} / {media.length}</div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div style={s.thumbRow}>
          {media.map((item, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                ...s.thumb,
                borderColor: i === currentIndex ? '#2563eb' : 'transparent',
              }}
            >
              {item.type === 'video' ? (
                <div style={s.videoThumb}>
                  <span style={s.playIcon}>▶</span>
                </div>
              ) : (
                <img src={item.src} alt={`Thumb ${i + 1}`} style={s.thumbImg} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const s: { [key: string]: React.CSSProperties } = {
  noMedia: { aspectRatio: '16/10', borderRadius: 20, background: '#f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#9ca3af' },
  mainMedia: { position: 'relative', aspectRatio: '16/10', borderRadius: 20, overflow: 'hidden', background: '#111827' },
  mainEl: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  navBtn: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', fontSize: 26, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  counter: { position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', padding: '7px 16px', background: 'rgba(0,0,0,0.6)', color: '#fff', borderRadius: 20, fontSize: 13, fontWeight: 600 },
  thumbRow: { display: 'flex', gap: 10, marginTop: 14, overflowX: 'auto', paddingBottom: 4 },
  thumb: { flexShrink: 0, width: 78, height: 58, borderRadius: 10, overflow: 'hidden', border: '3px solid transparent', cursor: 'pointer', padding: 0, background: '#1f2937', transition: 'border-color 0.15s' },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  videoThumb: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#374151' },
  playIcon: { fontSize: 20, color: '#fff' },
};
