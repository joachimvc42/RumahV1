import type { Metadata } from 'next';
import AboutClient from '../about/about-client';

export const metadata: Metadata = {
  title: 'RumahYa — Tu socio local para vivir e invertir en Lombok',
  description:
    'RumahYa es tu punto de contacto local en Lombok. Verificamos propiedades, coordinamos con propietarios y apoyamos proyectos a largo plazo — desde un alquiler de seis meses hasta la adquisición de un terreno.',
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
    title: 'RumahYa — Socio local para vivir e invertir en Lombok',
    description: 'Basados en Lombok. Socios locales, información verificada, coordinación a largo plazo.',
    url: 'https://rumahya.com/es',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Especialistas inmobiliarios locales en Lombok',
      },
    ],
  },
};

export default function HomePageES() {
  return <AboutClient locale="es" />;
}
