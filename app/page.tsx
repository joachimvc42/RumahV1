import type { Metadata } from 'next';
import AboutClient from './about/about-client';

export const metadata: Metadata = {
  title: 'RumahYa — A local partner for living & investing in Lombok',
  description:
    'RumahYa is your local point of contact in Lombok. We verify properties, coordinate with owners, and support long-term projects — from a six-month rental to a freehold land acquisition.',
  alternates: {
    canonical: 'https://rumahya.com/',
    languages: {
      'en': 'https://rumahya.com/',
      'fr': 'https://rumahya.com/fr',
      'es': 'https://rumahya.com/es',
      'x-default': 'https://rumahya.com/',
    },
  },
  openGraph: {
    title: 'RumahYa — Local partner for Lombok living & investment',
    description:
      'Based in Lombok. Local partners, verified information, long-term coordination. Contact us for rentals or investment projects.',
    url: 'https://rumahya.com/',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Local Lombok real estate specialists',
      },
    ],
  },
};

export default function HomePage() {
  return <AboutClient locale="en" />;
}
