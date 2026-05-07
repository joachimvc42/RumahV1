import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investment opportunities in Lombok — land & villas',
  description:
    'Curated freehold and leasehold investment opportunities in Lombok, Indonesia — villas and land in Kuta, Selong Belanak, Senggigi and beyond. Legal verification available.',
  openGraph: {
    title: 'Investment opportunities in Lombok — Villas & Land | RumahYa',
    description:
      'Freehold and leasehold land and villa investment opportunities across Lombok. Verified listings with estimated yields.',
    url: 'https://rumahya.com/opportunities',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://rumahya.com/opportunities' },
};

export default function OpportunitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
