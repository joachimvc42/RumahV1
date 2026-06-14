import type { Metadata } from 'next';
import InvestmentDetailClient from '../../investments/[id]/investment-detail-client';
import { investmentMetadata } from '../../../lib/detailMetadata';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  // investmentMetadata already canonicalizes to /opportunities/[id] and supplies
  // the EN/FR/ES + x-default hreflang block, so return it unmodified (overriding
  // alternates here previously stripped the hreflang links).
  return investmentMetadata(id, 'en');
}

export default function OpportunityDetailPage() {
  return <InvestmentDetailClient locale="en" />;
}
