import type { Metadata } from 'next';
import HomeClient from '../home-client';

export const metadata: Metadata = {
  title: 'Locations longue durée de villas à Lombok',
  description:
    'Locations longue durée de villas vérifiées à Lombok, Indonésie. Conditions honnêtes de 1 mois à 10 ans, vérification juridique et coordination locale sur le terrain.',
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
    title: 'Locations longue durée à Lombok — RumahYa',
    description: 'Des villas vérifiées, des conditions claires, une coordination locale. Votre location à Lombok, bien faite.',
    url: 'https://rumahya.com/fr',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function HomePageFR() {
  return <HomeClient locale="fr" />;
}
