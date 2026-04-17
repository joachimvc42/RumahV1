import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Land & villa investments in Lombok',
  description:
    'Curated freehold and leasehold investment opportunities in Lombok, Indonesia — villas and land in Kuta, Selong Belanak, Senggigi and beyond. Legal verification available.',
  openGraph: {
    title: 'Invest in Lombok — Villas & Land | RumahYa',
    description:
      'Freehold and leasehold land and villa investment opportunities across Lombok. Verified listings with estimated yields.',
    url: 'https://rumahya.com/investments',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://rumahya.com/investments' },
};

export default function InvestmentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
