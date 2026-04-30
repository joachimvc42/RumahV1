import type { Metadata } from 'next';
import HomeClient from './home-client';

export const metadata: Metadata = {
  title: 'Long-term villa rentals in Lombok',
  description:
    'Verified long-term villa rentals in Lombok, Indonesia. Honest terms from 1 month to 10 years, legal verification, and on-the-ground coordination by a local partner.',
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
    title: 'Long-term villa rentals in Lombok — RumahYa',
    description: 'Verified villas, clear terms, local coordination. Your Lombok rental, done right.',
    url: 'https://rumahya.com/',
    type: 'website',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Long-term villa rentals in Lombok, Indonesia',
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      {/* Server-rendered semantic content for SEO — visually hidden, screen-reader accessible */}
      <div className="seo-content">
        <h1>Long-term villa rentals in Lombok, Indonesia</h1>
        <p>
          RumahYa is your trusted local partner for finding verified long-term villa rentals in Lombok.
          Whether you are looking for a beachside retreat in Kuta Lombok, a rice-field villa near
          Selong Belanak, or a serene hillside property in the north, we source and verify every
          listing so you can move in with confidence.
        </p>
        <h2>Why rent long-term in Lombok?</h2>
        <p>
          Lombok offers pristine beaches, world-class surf, and a relaxed pace of life at a fraction
          of Bali&apos;s cost. Expats and digital nomads are increasingly choosing Lombok for its
          untouched landscapes, growing international community, and affordable rental prices.
          Long-term rentals — from one month to ten years — give you the flexibility to truly
          settle in and experience island life on your own terms.
        </p>
        <h2>Our rental process</h2>
        <p>
          Every property listed on RumahYa has been personally checked by our on-the-ground team.
          We verify land certificates and building permits, translate lease agreements into clear
          English, and coordinate directly with landlords so you never have to navigate the language
          barrier alone. From your first inquiry to handing over the keys, we are with you every
          step of the way.
        </p>
        <h2>Popular rental areas in Lombok</h2>
        <ul>
          <li><strong>Kuta Lombok</strong> — Surf, white sand beaches, and a vibrant expat scene.</li>
          <li><strong>Selong Belanak</strong> — Quiet bay, spectacular sunsets, ideal for families.</li>
          <li><strong>Senggigi</strong> — Established expat area, good amenities, close to the airport.</li>
          <li><strong>Tanjung &amp; North Lombok</strong> — Off-the-beaten-path, lush jungle, near Gili Islands.</li>
        </ul>
      </div>
      <HomeClient />
    </>
  );
}
