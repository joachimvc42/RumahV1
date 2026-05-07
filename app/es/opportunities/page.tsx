import type { Metadata } from 'next';
import InvestmentsClient from '../../investments/investments-client';

export const metadata: Metadata = {
  title: 'Oportunidades de inversión en Lombok — terrenos y villas',
  description:
    'Terrenos y villas de inversión verificados en Lombok, Indonesia. Títulos comprobados, rendimientos realistas, coordinación local desde el descubrimiento hasta la entrega.',
  alternates: {
    canonical: 'https://rumahya.com/es/opportunities',
    languages: {
      'en': 'https://rumahya.com/opportunities',
      'fr': 'https://rumahya.com/fr/opportunities',
      'es': 'https://rumahya.com/es/opportunities',
      'x-default': 'https://rumahya.com/opportunities',
    },
  },
  openGraph: {
    title: 'Oportunidades en Lombok — RumahYa',
    description: 'Terrenos y villas en Lombok. Documentos verificados, rendimientos realistas, equipo local.',
    url: 'https://rumahya.com/es/opportunities',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Inversión inmobiliaria en Lombok, Indonesia',
      },
    ],
  },
};

export default function OpportunitiesPageES() {
  return <InvestmentsClient locale="es" />;
}
