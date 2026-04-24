import type { Metadata } from 'next';
import InvestmentDetailClient from './investment-detail-client';
import { investmentMetadata } from '../../../lib/detailMetadata';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  return investmentMetadata(id, 'en');
}

export default function InvestmentDetailPage() {
  return <InvestmentDetailClient locale="en" />;
}
