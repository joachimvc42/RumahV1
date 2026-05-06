import type { Metadata } from 'next';
// Reuse the EN terms content — only canonical changes
import TermsPageEN from '@/app/terms/page';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'Terms governing your use of rentals.rumahya.com — long-term villa rental listings in Lombok, Indonesia.',
  alternates: {
    canonical: 'https://rentals.rumahya.com/terms',
  },
  robots: { index: true, follow: true },
};

export default TermsPageEN;
