import type { Metadata } from 'next';
import MapClient from '../../map/map-client';

export const metadata: Metadata = {
  title: 'Peta properti — Investasi di Lombok',
  description:
    'Peta interaktif semua properti terverifikasi RumahYa di Lombok. Vila dijual dan peluang tanah — filter berdasarkan jenis, kepemilikan, anggaran, dan lainnya.',
  alternates: {
    canonical: 'https://rumahya.com/id/map',
    languages: {
      'en': 'https://rumahya.com/map',
      'fr': 'https://rumahya.com/fr/map',
      'es': 'https://rumahya.com/es/map',
      'id': 'https://rumahya.com/id/map',
      'x-default': 'https://rumahya.com/map',
    },
  },
  openGraph: {
    title: 'Peta properti — RumahYa Lombok',
    description: 'Jelajahi vila dan tanah terverifikasi di Lombok pada peta interaktif.',
    url: 'https://rumahya.com/id/map',
    type: 'website',
    locale: 'id_ID',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Peta properti di Lombok',
      },
    ],
  },
};

export default function MapPageID() {
  return <MapClient locale="id" mode="invest" />;
}
