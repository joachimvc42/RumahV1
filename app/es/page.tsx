import type { Metadata } from 'next';
import HomeClient from '../home-client';

export const metadata: Metadata = {
  title: 'Alquileres de larga duración de villas en Lombok',
  description:
    'Alquileres de larga duración de villas verificadas en Lombok, Indonesia. Condiciones honestas de 1 mes a 10 años, verificación legal y coordinación local sobre el terreno.',
  alternates: {
    canonical: 'https://rumahya.com/es',
    languages: {
      'en': 'https://rumahya.com/',
      'fr': 'https://rumahya.com/fr',
      'es': 'https://rumahya.com/es',
      'x-default': 'https://rumahya.com/',
    },
  },
  openGraph: {
    title: 'Alquileres de larga duración en Lombok — RumahYa',
    description: 'Villas verificadas, condiciones claras, coordinación local. Tu alquiler en Lombok, bien hecho.',
    url: 'https://rumahya.com/es',
    type: 'website',
    locale: 'es_ES',
  },
};

export default function HomePageES() {
  return <HomeClient locale="es" />;
}
