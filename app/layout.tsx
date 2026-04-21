import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-display',
});

const BASE_URL = 'https://rumahya.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'RumahYa — Long-term rentals & investment in Lombok',
    template: '%s | RumahYa Lombok',
  },
  description:
    'RumahYa helps expatriates and investors find verified long-term villa rentals and land investments in Lombok, Indonesia. Local expertise, legal verification, on-the-ground support.',
  keywords: [
    'Lombok real estate', 'villa rental Lombok', 'land investment Lombok',
    'long-term rental Lombok', 'buy land Lombok', 'invest Lombok',
    'Kuta Lombok villa', 'Selong Belanak property', 'Indonesia property investment',
    'expat living Lombok', 'freehold land Lombok', 'leasehold villa Lombok',
  ],
  authors: [{ name: 'RumahYa', url: BASE_URL }],
  creator: 'RumahYa',
  publisher: 'RumahYa',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'RumahYa',
    title: 'RumahYa — Long-term rentals & investment in Lombok',
    description:
      'Find verified villas and land in Lombok. Long-term rentals and investment opportunities with local expertise.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Real estate in Lombok, Indonesia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RumahYa — Lombok real estate',
    description: 'Long-term villa rentals and land investments in Lombok, Indonesia.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: BASE_URL },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'RumahYa',
  url: BASE_URL,
  logo: `${BASE_URL}/og-image.jpg`,
  image: `${BASE_URL}/og-image.jpg`,
  description:
    'Long-term villa rentals and land investments in Lombok, Indonesia. Local expertise, verified titles, on-the-ground coordination.',
  areaServed: {
    '@type': 'Place',
    name: 'Lombok, Indonesia',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lombok',
    addressCountry: 'ID',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+62-878-7348-7940',
    contactType: 'customer service',
    availableLanguage: ['en', 'fr', 'id'],
  },
  sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // Next.js-safe inline JSON-LD injection
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Header />
        <div className="page-main">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
