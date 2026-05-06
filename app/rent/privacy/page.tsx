import type { Metadata } from 'next';
// Reuse the EN privacy content — only canonical changes
import PrivacyPageEN from '@/app/privacy/page';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How RumahYa collects, uses, stores, and protects your personal data. Compliant with GDPR, UK GDPR, CCPA, and Indonesian PDP Law.',
  alternates: {
    canonical: 'https://rentals.rumahya.com/privacy',
  },
  robots: { index: true, follow: true },
};

export default PrivacyPageEN;
