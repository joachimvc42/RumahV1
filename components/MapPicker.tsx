'use client';

import { useRef, useCallback } from 'react';
import { GoogleMap, Marker, StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';

const LOMBOK_CENTER = { lat: -8.65, lng: 116.32 };
const LIBRARIES: ('places')[] = ['places'];

export type MapPickerProps = {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  onClear: () => void;
};

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function MapPicker({ lat, lng, onChange, onClear }: MapPickerProps) {
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY ?? '',
    libraries: LIBRARIES,
  });

  const onMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        onChange(e.latLng.lat(), e.latLng.lng());
      }
    },
    [onChange],
  );

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        onChange(e.latLng.lat(), e.latLng.lng());
      }
    },
    [onChange],
  );

  const onPlacesChanged = useCallback(() => {
    const sb = searchBoxRef.current;
    if (!sb) return;
    const places = sb.getPlaces();
    if (!places || places.length === 0) return;
    const loc = places[0].geometry?.location;
    if (loc) {
      onChange(loc.lat(), loc.lng());
    }
  }, [onChange]);

  if (!API_KEY) {
    return (
      <div style={s.placeholder}>
        <span style={s.placeholderIcon}>📍</span>
        <span style={s.placeholderText}>
          Map will be available once the Google Maps API key is configured.
        </span>
      </div>
    );
  }

  if (!isLoaded) {
    return <div style={s.loading}>Loading map…</div>;
  }

  const center = lat != null && lng != null ? { lat, lng } : LOMBOK_CENTER;

  return (
    <div style={s.wrapper}>
      <StandaloneSearchBox
        onLoad={ref => { searchBoxRef.current = ref; }}
        onPlacesChanged={onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Search an address or place…"
          style={s.searchInput}
        />
      </StandaloneSearchBox>

      <div style={s.mapContainer}>
        <GoogleMap
          mapContainerStyle={s.mapContainerStyle}
          center={center}
          zoom={lat != null ? 14 : 10}
          onClick={onMapClick}
          options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
        >
          {lat != null && lng != null && (
            <Marker
              position={{ lat, lng }}
              draggable
              onDragEnd={onMarkerDragEnd}
            />
          )}
        </GoogleMap>
      </div>

      <div style={s.footer}>
        {lat != null && lng != null ? (
          <>
            <span style={s.coords}>
              📍 {lat.toFixed(6)}, {lng.toFixed(6)}
            </span>
            <button type="button" onClick={onClear} style={s.clearBtn}>
              Clear location
            </button>
          </>
        ) : (
          <span style={s.hint}>Click on the map or search an address to pin a location.</span>
        )}
      </div>
    </div>
  );
}

const s: { [k: string]: React.CSSProperties } = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: 10 },
  placeholder: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '20px 24px', background: '#f9fafb',
    border: '2px dashed #e5e7eb', borderRadius: 12,
    color: '#6b7280', fontSize: 15,
  },
  placeholderIcon: { fontSize: 28, flexShrink: 0 },
  placeholderText: { fontWeight: 500 },
  loading: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: 320, background: '#f9fafb', borderRadius: 12,
    border: '2px solid #e5e7eb', color: '#9ca3af', fontSize: 14,
  },
  searchInput: {
    width: '100%', boxSizing: 'border-box' as const,
    padding: 12, border: '2px solid #e5e7eb',
    borderRadius: 10, fontSize: 15, outline: 'none',
    fontFamily: 'inherit',
  },
  mapContainer: {
    width: '100%', height: 320, borderRadius: 12,
    overflow: 'hidden', border: '2px solid #e5e7eb',
  },
  mapContainerStyle: { width: '100%', height: '100%' },
  footer: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', gap: 12, minHeight: 32,
  },
  coords: { fontSize: 14, color: '#374151', fontWeight: 600, fontFamily: 'monospace' },
  hint: { fontSize: 13, color: '#9ca3af' },
  clearBtn: {
    padding: '7px 16px', background: '#fef2f2',
    color: '#b91c1c', border: '1px solid #fca5a5',
    borderRadius: 8, fontSize: 13, fontWeight: 600,
    cursor: 'pointer',
  },
};
