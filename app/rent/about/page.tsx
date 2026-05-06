import type { Metadata } from 'next';
import AboutClient from '@/app/about/about-client';

export const metadata: Metadata = {
  title: 'About — Your local rental partner in Lombok',
  description:
    'RumahYa is a local point of contact for expatriates seeking long-term rentals in Lombok. We verify properties, coordinate with owners, and support tenants from first inquiry to key handover.',
  alternates: {
    canonical: 'https://rentals.rumahya.com/about',
  },
  openGraph: {
    title: 'About RumahYa Rentals — Lombok rental specialists',
    description:
      'Based in Lombok. Local partners, verified listings, tenant coordination. Contact us for long-term rental enquiries.',
    url: 'https://rentals.rumahya.com/about',
    type: 'website',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa Rentals — Local Lombok rental specialists',
      },
    ],
  },
};

export default function RentalsAboutPage() {
  return <AboutClient />;
}
