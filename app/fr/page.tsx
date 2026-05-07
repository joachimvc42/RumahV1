import type { Metadata } from 'next';
import AboutClient from '../about/about-client';

export const metadata: Metadata = {
  title: 'RumahYa — Votre partenaire local pour vivre et investir à Lombok',
  description:
    "RumahYa est votre point de contact local à Lombok. Vérification de biens, coordination avec les propriétaires et accompagnement à long terme — de la location courte à l'acquisition foncière.",
  alternates: {
    canonical: 'https://rumahya.com/fr',
    languages: {
      'en': 'https://rumahya.com/',
      'fr': 'https://rumahya.com/fr',
      'es': 'https://rumahya.com/es',
      'x-default': 'https://rumahya.com/',
    },
  },
  openGraph: {
    title: 'RumahYa — Partenaire local pour vivre et investir à Lombok',
    description: 'Basés à Lombok. Partenaires locaux, informations vérifiées, coordination à long terme.',
    url: 'https://rumahya.com/fr',
    type: 'website',
    locale: 'fr_FR',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Spécialistes immobiliers locaux à Lombok',
      },
    ],
  },
};

export default function HomePageFR() {
  return <AboutClient locale="fr" />;
}
