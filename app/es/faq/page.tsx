import type { Metadata } from 'next';
import { getFaqs } from '@/lib/faq';
import FaqClient from '../../faq/faq-client';

export const metadata: Metadata = {
  title: 'FAQ — Comprar una propiedad en Lombok siendo europeo | RumahYa',
  description:
    'Leasehold vs freehold, constitución de PT PMA, impuestos, proceso de compra — una guía honesta sobre la inversión inmobiliaria extranjera en Lombok, Indonesia. Para compradores europeos.',
  alternates: {
    canonical: 'https://rumahya.com/es/faq',
    languages: {
      en: 'https://rumahya.com/faq',
      fr: 'https://rumahya.com/fr/faq',
      es: 'https://rumahya.com/es/faq',
      'x-default': 'https://rumahya.com/faq',
    },
  },
  openGraph: {
    title: 'FAQ inmobiliaria de Lombok para inversores europeos | RumahYa',
    description:
      '¿Pueden los extranjeros comprar en Lombok? ¿Cómo funciona el leasehold? ¿Necesito una PT PMA? Respuestas claras y prácticas para inversores inmobiliarios europeos.',
    url: 'https://rumahya.com/es/faq',
    type: 'website',
    locale: 'es_ES',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: getFaqs('es').map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    },
  })),
};

export default function FaqPageES() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaqClient locale="es" />
    </>
  );
}
