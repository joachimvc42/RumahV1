import type { Metadata } from 'next';
import InvestmentsClient from '../../investments/investments-client';

export const metadata: Metadata = {
  title: 'Opportunités d\'investissement à Lombok — terrains & villas',
  description:
    'Terrains en freehold et villas sélectionnés à Lombok, Indonésie. Titres vérifiés, rendements réalistes, coordination locale de la découverte à la livraison.',
  alternates: {
    canonical: 'https://rumahya.com/fr/investments',
    languages: {
      'en': 'https://rumahya.com/investments',
      'fr': 'https://rumahya.com/fr/investments',
      'es': 'https://rumahya.com/es/investments',
      'x-default': 'https://rumahya.com/investments',
    },
  },
  openGraph: {
    title: 'Investir à Lombok — RumahYa',
    description: 'Terrains en freehold et villas sélectionnées à Lombok. Documents vérifiés, rendements réalistes, équipe locale.',
    url: 'https://rumahya.com/fr/investments',
    type: 'website',
    locale: 'fr_FR',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Investir dans des terrains et villas à Lombok',
      },
    ],
  },
};

export default function InvestmentsPageFR() {
  return <InvestmentsClient locale="fr" />;
}
