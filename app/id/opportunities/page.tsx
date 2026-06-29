import type { Metadata } from 'next';
import InvestmentsClient from '../../investments/investments-client';

export const metadata: Metadata = {
  title: 'Peluang investasi di Lombok — tanah & vila',
  description:
    'Tanah hak milik dan vila pilihan di Lombok, Indonesia. Sertifikat diperiksa, imbal hasil realistis, koordinasi lokal dari pencarian hingga serah terima.',
  alternates: {
    canonical: 'https://rumahya.com/id/opportunities',
    languages: {
      'en': 'https://rumahya.com/opportunities',
      'fr': 'https://rumahya.com/fr/opportunities',
      'es': 'https://rumahya.com/es/opportunities',
      'id': 'https://rumahya.com/id/opportunities',
      'x-default': 'https://rumahya.com/opportunities',
    },
  },
  openGraph: {
    title: 'Peluang di Lombok — RumahYa',
    description: 'Tanah hak milik dan vila pilihan di Lombok. Dokumen terverifikasi, imbal hasil realistis, tim lokal.',
    url: 'https://rumahya.com/id/opportunities',
    type: 'website',
    locale: 'id_ID',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Investasi tanah dan vila di Lombok',
      },
    ],
  },
};

export default function OpportunitiesPageID() {
  return <InvestmentsClient locale="id" />;
}
