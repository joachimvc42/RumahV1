import type { Metadata } from 'next';
import InvestmentsClient from '../../investments/investments-client';
import { getInvestments, investmentsItemListJsonLd } from '../../../lib/getInvestments';

export const metadata: Metadata = {
  title: "Opportunités d'investissement à Lombok — terrains & villas",
  description:
    'Terrains en freehold et villas sélectionnés à Lombok, Indonésie. Titres vérifiés, rendements réalistes, coordination locale de la découverte à la livraison.',
  alternates: {
    canonical: 'https://rumahya.com/fr/opportunities',
    languages: {
      'en': 'https://rumahya.com/opportunities',
      'fr': 'https://rumahya.com/fr/opportunities',
      'es': 'https://rumahya.com/es/opportunities',
      'id': 'https://rumahya.com/id/opportunities',
      'x-default': 'https://rumahya.com/opportunities',
    },
  },
  openGraph: {
    title: 'Opportunités à Lombok — RumahYa',
    description: 'Terrains en freehold et villas sélectionnées à Lombok. Documents vérifiés, rendements réalistes, équipe locale.',
    url: 'https://rumahya.com/fr/opportunities',
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

export default async function OpportunitiesPageFR() {
  const items = await getInvestments('fr');
  const itemListJsonLd = investmentsItemListJsonLd(items, 'fr');
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <InvestmentsClient locale="fr" initialItems={items} />
    </>
  );
}
