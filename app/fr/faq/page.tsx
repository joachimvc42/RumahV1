import type { Metadata } from 'next';
import { getFaqs } from '@/lib/faq';
import FaqClient from '../../faq/faq-client';

export const metadata: Metadata = {
  title: 'FAQ — Acheter un bien à Lombok en tant qu\'Européen | RumahYa',
  description:
    'Leasehold vs freehold, création de PT PMA, taxes, processus d\'achat — un guide honnête sur l\'investissement immobilier étranger à Lombok, en Indonésie. Pour les acheteurs européens.',
  alternates: {
    canonical: 'https://rumahya.com/fr/faq',
    languages: {
      en: 'https://rumahya.com/faq',
      fr: 'https://rumahya.com/fr/faq',
      es: 'https://rumahya.com/es/faq',
      'x-default': 'https://rumahya.com/faq',
    },
  },
  openGraph: {
    title: 'FAQ immobilière à Lombok pour investisseurs européens | RumahYa',
    description:
      'Un étranger peut-il acheter à Lombok ? Comment fonctionne le leasehold ? Ai-je besoin d\'une PT PMA ? Des réponses claires et concrètes pour les investisseurs immobiliers européens.',
    url: 'https://rumahya.com/fr/faq',
    type: 'website',
    locale: 'fr_FR',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — FAQ immobilière à Lombok pour investisseurs européens',
      },
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: getFaqs('fr').map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    },
  })),
};

export default function FaqPageFR() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaqClient locale="fr" />
    </>
  );
}
