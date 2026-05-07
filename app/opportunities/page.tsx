import type { Metadata } from 'next';
import InvestmentsClient from '../investments/investments-client';

export const metadata: Metadata = {
  title: 'Lombok investment opportunities — land & villas',
  description:
    'Curated freehold land and villa investments in Lombok, Indonesia. Pre-checked titles, realistic yields, local coordination from discovery to delivery.',
  alternates: {
    canonical: 'https://rumahya.com/opportunities',
    languages: {
      'en': 'https://rumahya.com/opportunities',
      'fr': 'https://rumahya.com/fr/opportunities',
      'es': 'https://rumahya.com/es/opportunities',
      'x-default': 'https://rumahya.com/opportunities',
    },
  },
  openGraph: {
    title: 'Investment opportunities in Lombok — RumahYa',
    description:
      'Freehold land and curated villas in Lombok. Verified documents, realistic yields, local team.',
    url: 'https://rumahya.com/opportunities',
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

export default function OpportunitiesPage() {
  return (
    <>
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
          and property values have been rising steadily.
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
      <InvestmentsClient locale="en" />
    </>
  );
}
