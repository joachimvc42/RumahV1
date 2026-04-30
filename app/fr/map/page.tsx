import type { Metadata } from 'next';
import MapClient from '../../map/map-client';

export const metadata: Metadata = {
  title: 'Carte des biens — Locations & investissements à Lombok',
  description:
    "Carte interactive de tous les biens vérifiés par RumahYa. Locations longue durée, villas à la vente et opportunités foncières à Lombok — filtres par type, tenure, budget et plus.",
  alternates: {
    canonical: 'https://rumahya.com/fr/map',
    languages: {
      'en': 'https://rumahya.com/map',
      'fr': 'https://rumahya.com/fr/map',
      'es': 'https://rumahya.com/es/map',
      'x-default': 'https://rumahya.com/map',
    },
  },
  openGraph: {
    title: 'Carte des biens — RumahYa Lombok',
    description: 'Explorez sur une carte interactive les locations, villas et terrains vérifiés à Lombok.',
    url: 'https://rumahya.com/fr/map',
    type: 'website',
    locale: 'fr_FR',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Carte des biens immobiliers à Lombok',
      },
    ],
  },
};

export default function MapPageFR() {
  return <MapClient locale="fr" />;
}
