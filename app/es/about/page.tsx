import type { Metadata } from 'next';
import AboutClient from '../../about/about-client';

export const metadata: Metadata = {
  title: 'Quiénes somos — Un socio local para vivir e invertir en Lombok',
  description:
    'RumahYa es un punto de contacto local para expatriados e inversores en Lombok. Verificamos propiedades, coordinamos con propietarios y acompañamos proyectos a largo plazo.',
  alternates: {
    canonical: 'https://rumahya.com/es/about',
    languages: {
      'en': 'https://rumahya.com/about',
      'fr': 'https://rumahya.com/fr/about',
      'es': 'https://rumahya.com/es/about',
      'x-default': 'https://rumahya.com/about',
    },
  },
  openGraph: {
    title: 'Sobre RumahYa — Especialistas inmobiliarios en Lombok',
    description:
      'Basados en Lombok. Socios locales, información verificada, coordinación a largo plazo. Contáctanos para alquileres o inversiones.',
    url: 'https://rumahya.com/es/about',
    type: 'website',
    locale: 'es_ES',
  },
};

export default function AboutPageES() {
  return <AboutClient locale="es" />;
}
