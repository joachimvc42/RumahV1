import type { Metadata } from 'next';
import InvestmentDetailClient from '../../../investments/[id]/investment-detail-client';
import { investmentMetadata } from '../../../../lib/detailMetadata';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const meta = await investmentMetadata(id, 'es');
  return {
    ...meta,
    alternates: {
      canonical: `https://rumahya.com/es/opportunities/${id}`,
    },
  };
}

export default function OpportunityDetailPageES() {
  return <InvestmentDetailClient locale="es" />;
}
