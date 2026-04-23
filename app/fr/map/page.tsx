import type { Metadata } from 'next';
import MapClient from '../../map/map-client';

export const metadata: Metadata = {
  title: 'Carte des biens — Locations & investissements à Lombok',
  description:
    "Carte interactive de tous les biens vérifiés par RumahYa. Locations longue durée, villas à la vente et opportunités foncières à Lombok — filtres par type, tenure, budget et plus.",
  alternates: { canonical: 'https://rumahya.com/fr/map' },
  openGraph: {
    title: 'Carte des biens — RumahYa Lombok',
    description: 'Explorez sur une carte interactive les locations, villas et terrains vérifiés à Lombok.',
    url: 'https://rumahya.com/fr/map',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function MapPageFR() {
  return <MapClient locale="fr" />;
}
