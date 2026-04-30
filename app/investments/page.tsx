import type { Metadata } from 'next';
import InvestmentsClient from './investments-client';

export const metadata: Metadata = {
  title: 'Lombok investment opportunities — land & villas',
  description:
    'Curated freehold land and villa investments in Lombok, Indonesia. Pre-checked titles, realistic yields, local coordination from discovery to delivery.',
  alternates: {
    canonical: 'https://rumahya.com/investments',
    languages: {
      'en': 'https://rumahya.com/investments',
      'fr': 'https://rumahya.com/fr/investments',
      'es': 'https://rumahya.com/es/investments',
      'x-default': 'https://rumahya.com/investments',
    },
  },
  openGraph: {
    title: 'Invest in Lombok — RumahYa',
    description:
      'Freehold land and curated villas in Lombok. Verified documents, realistic yields, local team.',
    url: 'https://rumahya.com/investments',
    type: 'website',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Land and villa investments in Lombok, Indonesia',
      },
    ],
  },
};

export default function InvestmentsPage() {
  return (
    <>
      {/* Server-rendered semantic content for SEO */}
      <div className="seo-content">
        <h1>Real estate investment opportunities in Lombok, Indonesia</h1>
        <p>
          RumahYa connects serious investors with verified land plots and villa investment
          opportunities across Lombok. Every asset has been sourced by our local team and
          undergone title checking before it reaches this page — because in Indonesia, due
          diligence is everything.
        </p>
        <h2>Why invest in Lombok real estate?</h2>
        <p>
          Lombok is one of Southeast Asia&apos;s fastest-growing tourist destinations. With the
          New Lombok International Airport now handling international flights, a new Mandalika
          circuit drawing MotoGP crowds, and growing demand for quality villa rentals, land
          and property values have been rising steadily. Investors who act now are positioning
          themselves ahead of the next wave of development.
        </p>
        <h2>Freehold land in Lombok</h2>
        <p>
          For foreign buyers, the most common structure is a leasehold arrangement (Hak Sewa)
          or a nominee arrangement with an Indonesian legal entity. RumahYa works with trusted
          notaries to ensure every transaction is structured correctly under Indonesian law.
          We list land parcels with confirmed SHM (freehold) or HGB certificates, and we
          flag any title irregularities before you ever make an offer.
        </p>
        <h2>Villa investments</h2>
        <p>
          Short-term rental yields in Lombok can reach 10–15% annually for well-located villas.
          We identify properties with strong rental potential, manage the transaction, and can
          connect you with local property management teams to handle day-to-day operations after
          purchase.
        </p>
        <h2>Our investment process</h2>
        <ul>
          <li>Initial consultation to understand your budget and objectives</li>
          <li>Curated shortlist of verified properties matching your criteria</li>
          <li>On-site visits coordinated by our Lombok team</li>
          <li>Legal due diligence: title checks, permit verification, notary coordination</li>
          <li>Transaction support through to handover</li>
        </ul>
      </div>
      <InvestmentsClient />
    </>
  );
}
