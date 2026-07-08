import type { Metadata } from 'next';
import { getFaqs } from '@/lib/faq';
import FaqClient from './faq-client';

export const metadata: Metadata = {
  title: 'FAQ — Buying Property in Lombok as a European',
  description:
    'Leasehold vs freehold, PT PMA setup, taxes, purchase process — an honest guide to foreign property investment in Lombok, Indonesia. For European buyers.',
  alternates: {
    canonical: 'https://rumahya.com/faq',
    languages: {
      en: 'https://rumahya.com/faq',
      fr: 'https://rumahya.com/fr/faq',
      es: 'https://rumahya.com/es/faq',
      'x-default': 'https://rumahya.com/faq',
    },
  },
  openGraph: {
    title: 'Lombok Property FAQ for European Investors | RumahYa',
    description:
      'Can foreigners buy in Lombok? How does leasehold work? Do I need a PT PMA? Clear, practical answers for European property investors.',
    url: 'https://rumahya.com/faq',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Lombok property FAQ for European investors',
      },
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: getFaqs('en').map(item => ({
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
      <FaqClient locale="en" />
    </>
  );
}
