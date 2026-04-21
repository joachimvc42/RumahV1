import type { Metadata } from 'next';
import InvestmentsClient from './investments-client';

export const metadata: Metadata = {
  title: 'Lombok investment opportunities — land & villas',
  description:
    'Curated freehold land and villa investments in Lombok, Indonesia. Pre-checked titles, realistic yields, local coordination from discovery to delivery.',
  alternates: { canonical: 'https://rumahya.com/investments' },
  openGraph: {
    title: 'Invest in Lombok — RumahYa',
    description:
      'Freehold land and curated villas in Lombok. Verified documents, realistic yields, local team.',
    url: 'https://rumahya.com/investments',
    type: 'website',
  },
};

export default function InvestmentsPage() {
  return <InvestmentsClient />;
}
