import type { Metadata } from 'next';
import InvestmentDetailClient from '../../../investments/[id]/investment-detail-client';
import { investmentMetadata } from '../../../../lib/detailMetadata';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  return investmentMetadata(id, 'es');
}

export default function InvestmentDetailPageES() {
  return <InvestmentDetailClient locale="es" />;
}
