import type { Metadata } from 'next';
import InvestmentDetailClient from '../../../investments/[id]/investment-detail-client';
import { investmentMetadata } from '../../../../lib/detailMetadata';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  return investmentMetadata(id, 'fr');
}

export default function InvestmentDetailPageFR() {
  return <InvestmentDetailClient locale="fr" />;
}
