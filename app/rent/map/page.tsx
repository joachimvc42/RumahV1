import type { Metadata } from 'next';
import MapClient from '@/app/map/map-client';

export const metadata: Metadata = {
  title: 'Rental property map — Lombok',
  description:
    'Interactive map of verified long-term rental properties in Lombok. Filter by location, bedrooms, budget and amenities.',
  alternates: {
    canonical: 'https://rentals.rumahya.com/map',
  },
  openGraph: {
    title: 'Rental map — RumahYa Rentals',
    description: 'Explore verified long-term rentals on an interactive Lombok map.',
    url: 'https://rentals.rumahya.com/map',
    type: 'website',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa Rentals — Rental property map of Lombok, Indonesia',
      },
    ],
  },
};

export default function RentalsMapPage() {
  return <MapClient locale="en" mode="rentals" />;
}
