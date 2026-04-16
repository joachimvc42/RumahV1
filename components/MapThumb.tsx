'use client';

export type MapThumbProps = {
  lat: number;
  lng: number;
  size?: number;
};

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function MapThumb({ lat, lng, size = 320 }: MapThumbProps) {
  if (!API_KEY || lat == null || lng == null) return null;

  const src = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=${size}x160&markers=color:red|${lat},${lng}&key=${API_KEY}`;

  return (
    <div style={s.wrapper}>
      <img
        src={src}
        alt="Map"
        style={s.img}
        loading="lazy"
      />
    </div>
  );
}

const s: { [k: string]: React.CSSProperties } = {
  wrapper: {
    width: '100%', height: 160,
    borderRadius: 10, overflow: 'hidden',
    border: '1px solid #e5e7eb',
    background: '#f3f4f6',
  },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
};
