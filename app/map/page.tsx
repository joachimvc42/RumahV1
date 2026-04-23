import type { Metadata } from 'next';
import MapClient from './map-client';

export const metadata: Metadata = {
  title: 'Property map — Lombok rentals & investments',
  description:
    'Interactive map of every verified property on RumahYa. Long-term rentals, villas for sale, and land opportunities across Lombok — filter by type, tenure, budget and more.',
  alternates: { canonical: 'https://rumahya.com/map' },
  openGraph: {
    title: 'Property map — RumahYa Lombok',
    description: 'Explore verified rentals, villas and land on an interactive Lombok map.',
    url: 'https://rumahya.com/map',
    type: 'website',
    locale: 'en_US',
  },
};

export default function MapPage() {
  return <MapClient locale="en" />;
}
