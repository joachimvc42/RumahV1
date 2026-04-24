import type { Metadata } from 'next';
import RentalDetailClient from '../../../rentals/[id]/rental-detail-client';
import { rentalMetadata } from '../../../../lib/detailMetadata';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  return rentalMetadata(id, 'es');
}

export default function RentalDetailPageES() {
  return <RentalDetailClient locale="es" />;
}
