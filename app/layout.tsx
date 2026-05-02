import type { Metadata, Viewport } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { headers } from 'next/headers';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const GA_ID = 'G-EZQZF072WR';

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

/* ─── Viewport — critical for Mobile Friendly ─── */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F6F1E9' },
    { media: '(prefers-color-scheme: dark)',  color: '#0F0E0C' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'RumahYa — Rentals & investment in Lombok',
    template: '%s | RumahYa Lombok',
  },
  description:
    'Verified long-term villa rentals and land investments in Lombok. Local expertise, legal checks, on-the-ground support.',
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
    title: 'RumahYa — Rentals & investment in Lombok',
    description:
      'Verified villas and land in Lombok. Rentals and investments with local expertise.',
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'RumahYa — Real estate in Lombok, Indonesia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rumahya',
    creator: '@rumahya',
    title: 'RumahYa — Lombok real estate',
    description: 'Long-term villa rentals and land investments in Lombok, Indonesia.',
    images: [`${BASE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en': BASE_URL,
      'fr': `${BASE_URL}/fr`,
      'es': `${BASE_URL}/es`,
      'x-default': BASE_URL,
    },
  },
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
    availableLanguage: ['en', 'fr', 'es'],
  },
  sameAs: [],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const locale = (headersList.get('x-locale') || 'en') as string;

  return (
    <html lang={locale} className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        {/* Google Analytics gtag.js — loads after hydration on every page */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>

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
