'use client';

import { useRef, useCallback, useState } from 'react';
import { GoogleMap, Marker, Autocomplete, useJsApiLoader } from '@react-google-maps/api';

const LOMBOK_CENTER = { lat: -8.65, lng: 116.32 };
const LIBRARIES: ('places')[] = ['places'];

/** Bounding box that covers all of Lombok island */
const LOMBOK_BOUNDS = {
  south: -9.07,
  west: 115.72,
  north: -8.07,
  east: 116.72,
};

export type MapPickerProps = {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  onClear: () => void;
};

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function MapPicker({ lat, lng, onChange, onClear }: MapPickerProps) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [outOfBounds, setOutOfBounds] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY ?? '',
    libraries: LIBRARIES,
  });

  const onAutocompleteLoad = useCallback((ac: google.maps.places.Autocomplete) => {
    autocompleteRef.current = ac;
    ac.setOptions({
      componentRestrictions: { country: 'id' },
      bounds: new google.maps.LatLngBounds(
        { lat: LOMBOK_BOUNDS.south, lng: LOMBOK_BOUNDS.west },
        { lat: LOMBOK_BOUNDS.north, lng: LOMBOK_BOUNDS.east },
      ),
      strictBounds: true,
    });
  }, []);

  const onPlaceChanged = useCallback(() => {
    const ac = autocompleteRef.current;
    if (!ac) return;
    const place = ac.getPlace();
    const loc = place.geometry?.location;
    if (!loc) return;
    const pLat = loc.lat();
    const pLng = loc.lng();
    // Extra guard: reject anything outside Lombok bounding box
    if (
      pLat < LOMBOK_BOUNDS.south || pLat > LOMBOK_BOUNDS.north ||
      pLng < LOMBOK_BOUNDS.west  || pLng > LOMBOK_BOUNDS.east
    ) {
      setOutOfBounds(true);
      return;
    }
    setOutOfBounds(false);
    onChange(pLat, pLng);
  }, [onChange]);

  const onMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) onChange(e.latLng.lat(), e.latLng.lng());
    },
    [onChange],
  );

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        setOutOfBounds(false);
        onChange(e.latLng.lat(), e.latLng.lng());
      }
    },
    [onChange],
  );

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
      <Autocomplete
        onLoad={onAutocompleteLoad}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          placeholder="Search a place in Lombok…"
          style={{ ...s.searchInput, ...(outOfBounds ? s.searchInputError : {}) }}
          onChange={() => setOutOfBounds(false)}
        />
      </Autocomplete>

      {outOfBounds && (
        <div style={s.errorBanner}>
          ⚠️ This location is outside Lombok. Please select a place on the island.
        </div>
      )}

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
          <span style={s.hint}>Click on the map or search a place in Lombok to pin a location.</span>
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
  searchInputError: {
    borderColor: '#fca5a5',
    background: '#fef2f2',
  },
  errorBanner: {
    padding: '10px 14px',
    background: '#fef2f2',
    border: '1px solid #fca5a5',
    borderRadius: 8,
    fontSize: 13,
    color: '#b91c1c',
    fontWeight: 500,
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
