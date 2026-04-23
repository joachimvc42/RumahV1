'use client';

import { useState, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

export type MapViewProps = {
  lat: number;
  lng: number;
  title: string;
};

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
// Must match MapPicker / map-client — singleton loader throws on mismatch.
const LIBRARIES: ('places')[] = ['places'];

export default function MapView({ lat, lng, title }: MapViewProps) {
  const [infoOpen, setInfoOpen] = useState(true);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY ?? '',
    libraries: LIBRARIES,
  });

  const handleMarkerClick = useCallback(() => setInfoOpen(o => !o), []);

  if (!API_KEY) {
    return (
      <div style={s.placeholder}>
        <span style={s.icon}>📍</span>
        <div style={s.placeholderBody}>
          <span style={s.placeholderTitle}>{title}</span>
          <a
            href={`https://maps.google.com/?q=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            style={s.placeholderLink}
          >
            Open in Google Maps →
          </a>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return <div style={s.skeleton}>Loading map…</div>;
  }

  return (
    <div style={s.container}>
      <GoogleMap
        mapContainerStyle={s.mapStyle}
        center={{ lat, lng }}
        zoom={15}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        <Marker
          position={{ lat, lng }}
          onClick={handleMarkerClick}
        >
          {infoOpen && (
            <InfoWindow
              position={{ lat, lng }}
              onCloseClick={() => setInfoOpen(false)}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{title}</span>
            </InfoWindow>
          )}
        </Marker>
      </GoogleMap>
    </div>
  );
}

const s: { [k: string]: React.CSSProperties } = {
  container: {
    width: '100%', height: 280,
    borderRadius: 12, overflow: 'hidden',
    border: '2px solid #e5e7eb',
  },
  mapStyle: { width: '100%', height: '100%' },
  placeholder: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '18px 20px', background: '#f0fdf4',
    border: '2px solid #bbf7d0', borderRadius: 12,
    minHeight: 80,
  },
  icon: { fontSize: 32, flexShrink: 0 },
  placeholderBody: { display: 'flex', flexDirection: 'column', gap: 4 },
  placeholderTitle: { fontSize: 15, fontWeight: 700, color: '#111827' },
  placeholderLink: {
    fontSize: 13, color: '#2563eb', fontWeight: 600,
    textDecoration: 'none',
  },
  skeleton: {
    width: '100%', height: 280,
    borderRadius: 12, border: '2px solid #e5e7eb',
    background: '#f9fafb',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#9ca3af', fontSize: 14,
  },
};
