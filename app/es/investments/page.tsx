import type { Metadata } from 'next';
import InvestmentsClient from '../../investments/investments-client';

export const metadata: Metadata = {
  title: 'Oportunidades de inversión en Lombok — terrenos y villas',
  description:
    'Terrenos en freehold y villas seleccionadas en Lombok, Indonesia. Títulos verificados, rendimientos realistas, coordinación local desde la búsqueda a la entrega.',
  // Legacy duplicate of /es/opportunities — consolidate onto the primary route.
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
    title: 'Invertir en Lombok — RumahYa',
    description: 'Terrenos en freehold y villas seleccionadas en Lombok. Documentos verificados, rendimientos realistas, equipo local.',
    url: 'https://rumahya.com/es/opportunities',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Invertir en terrenos y villas en Lombok',
      },
    ],
  },
};

export default function InvestmentsPageES() {
  return <InvestmentsClient locale="es" />;
}
