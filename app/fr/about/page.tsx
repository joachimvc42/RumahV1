import type { Metadata } from 'next';
import AboutClient from '../../about/about-client';

export const metadata: Metadata = {
  title: 'À propos — Un partenaire local pour vivre et investir à Lombok',
  description:
    "RumahYa est un point de contact local pour expatriés et investisseurs à Lombok. Nous vérifions les biens, coordonnons avec les propriétaires et accompagnons les projets long terme.",
  alternates: {
    canonical: 'https://rumahya.com/fr/about',
    languages: {
      'en': 'https://rumahya.com/about',
      'fr': 'https://rumahya.com/fr/about',
      'es': 'https://rumahya.com/es/about',
      'x-default': 'https://rumahya.com/about',
    },
  },
  openGraph: {
    title: 'À propos RumahYa — Experts immobilier à Lombok',
    description:
      'Basés à Lombok. Partenaires locaux, informations vérifiées, coordination long terme. Contactez-nous pour locations ou investissements.',
    url: 'https://rumahya.com/fr/about',
    type: 'website',
    locale: 'fr_FR',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Experts immobiliers locaux à Lombok',
      },
    ],
  },
};

export default function AboutPageFR() {
  return <AboutClient locale="fr" />;
}
