import type { Metadata } from 'next';
import InvestmentDetailClient from '../../../investments/[id]/investment-detail-client';
import { investmentMetadata } from '../../../../lib/detailMetadata';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const meta = await investmentMetadata(id, 'fr');
  return {
    ...meta,
    alternates: {
      canonical: `https://rumahya.com/fr/opportunities/${id}`,
    },
  };
}

export default function OpportunityDetailPageFR() {
  return <InvestmentDetailClient locale="fr" />;
}
