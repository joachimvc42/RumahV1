import type { Metadata } from 'next';
import { faqs } from '@/lib/faq';
import FaqClient from './faq-client';

export const metadata: Metadata = {
  title: 'FAQ — Buying Property in Lombok as a European | RumahYa',
  description:
    'Leasehold vs freehold, PT PMA setup, taxes, purchase process — an honest guide to foreign property investment in Lombok, Indonesia. For European buyers.',
  alternates: {
    canonical: 'https://rumahya.com/faq',
  },
  openGraph: {
    title: 'Lombok Property FAQ for European Investors | RumahYa',
    description:
      'Can foreigners buy in Lombok? How does leasehold work? Do I need a PT PMA? Clear, practical answers for European property investors.',
    url: 'https://rumahya.com/faq',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaqClient />
    </>
  );
}
