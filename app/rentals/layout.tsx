import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Long-term villa rentals in Lombok',
  description:
    'Browse verified long-term villa and house rentals in Lombok, Indonesia — from 1 month to 10 years. Kuta, Senggigi, Selong Belanak and more. All properties verified by RumahYa.',
  openGraph: {
    title: 'Long-term villa rentals in Lombok | RumahYa',
    description:
      'Verified long-term rentals across Lombok — pool villas, furnished houses, garden retreats. Direct contact, no agent fees.',
    url: 'https://rumahya.com/rentals',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://rumahya.com/rentals' },
};

export default function RentalsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
