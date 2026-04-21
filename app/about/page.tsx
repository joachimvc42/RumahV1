import type { Metadata } from 'next';
import AboutClient from './about-client';

export const metadata: Metadata = {
  title: 'About — A local partner for Lombok living & investment',
  description:
    'RumahYa is a local point of contact for expatriates and investors in Lombok. We verify properties, coordinate with owners, and support long-term projects from the ground up.',
  alternates: { canonical: 'https://rumahya.com/about' },
  openGraph: {
    title: 'About RumahYa — Lombok real estate specialists',
    description:
      'Based in Lombok. Local partners, verified information, long-term coordination. Contact us for rentals or investment projects.',
    url: 'https://rumahya.com/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
