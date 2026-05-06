import type { Metadata } from 'next';
import RentalDetailClient from '@/app/rentals/[id]/rental-detail-client';
import { rentalMetadata } from '@/lib/detailMetadata';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const meta = await rentalMetadata(id, 'en');
  // Override canonical to rentals subdomain
  return {
    ...meta,
    alternates: {
      canonical: `https://rentals.rumahya.com/rentals/${id}`,
    },
  };
}

export default function RentalDetailPageRentals() {
  return <RentalDetailClient locale="en" />;
}
