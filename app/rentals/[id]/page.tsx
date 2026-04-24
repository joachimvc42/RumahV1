import type { Metadata } from 'next';
import RentalDetailClient from './rental-detail-client';
import { rentalMetadata } from '../../../lib/detailMetadata';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  return rentalMetadata(id, 'en');
}

export default function RentalDetailPage() {
  return <RentalDetailClient locale="en" />;
}
