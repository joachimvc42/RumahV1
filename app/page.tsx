import type { Metadata } from 'next';
import HomeClient from './home-client';

export const metadata: Metadata = {
  title: 'Long-term villa rentals in Lombok',
  description:
    'Verified long-term villa rentals in Lombok, Indonesia. Honest terms from 1 month to 10 years, legal verification, and on-the-ground coordination by a local partner.',
  alternates: { canonical: 'https://rumahya.com/' },
  openGraph: {
    title: 'Long-term villa rentals in Lombok — RumahYa',
    description: 'Verified villas, clear terms, local coordination. Your Lombok rental, done right.',
    url: 'https://rumahya.com/',
    type: 'website',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
