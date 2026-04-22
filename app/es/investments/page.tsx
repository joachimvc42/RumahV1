import type { Metadata } from 'next';
import InvestmentsClient from '../../investments/investments-client';

export const metadata: Metadata = {
  title: 'Oportunidades de inversión en Lombok — terrenos y villas',
  description:
    'Terrenos en freehold y villas seleccionadas en Lombok, Indonesia. Títulos verificados, rendimientos realistas, coordinación local desde la búsqueda a la entrega.',
  alternates: { canonical: 'https://rumahya.com/es/investments' },
  openGraph: {
    title: 'Invertir en Lombok — RumahYa',
    description: 'Terrenos en freehold y villas seleccionadas en Lombok. Documentos verificados, rendimientos realistas, equipo local.',
    url: 'https://rumahya.com/es/investments',
    type: 'website',
    locale: 'es_ES',
  },
};

export default function InvestmentsPageES() {
  return <InvestmentsClient locale="es" />;
}
