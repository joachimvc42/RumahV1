import type { Metadata } from 'next';
import Link from 'next/link';
import { articles } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Lombok Property Investment Guide — Legal, Tax & Market Insights',
  description:
    'Honest, detailed guides for foreign investors buying land or villas in Lombok, Indonesia — leasehold vs freehold, PT PMA setup, taxes, realistic yields, and how Lombok compares to Bali.',
  alternates: {
    canonical: 'https://rumahya.com/blog',
  },
  openGraph: {
    title: 'Lombok Property Investment Guide | RumahYa',
    description: 'Legal structures, taxes, yields and market analysis for foreign investors in Lombok, Indonesia.',
    url: 'https://rumahya.com/blog',
    type: 'website',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Lombok property investment guide',
      },
    ],
  },
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BlogIndexPage() {
  const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main>
      <section className="page-title">
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: 16 }}>Investor Guide</p>
          <h1 className="page-title-h">
            Buying in <em>Lombok</em>: the honest guide
          </h1>
          <p className="blog-index-lead">
            Legal structures, real numbers, and straight answers for foreign investors — no sales pitch.
          </p>
        </div>
      </section>

      <section className="container blog-index-section">
        <div className="blog-grid">
          {sorted.map(a => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="blog-card">
              <span className="blog-card-cat">{a.category}</span>
              <h2 className="blog-card-title">{a.title}</h2>
              <p className="blog-card-desc">{a.description}</p>
              <div className="blog-card-meta">
                <span>{fmtDate(a.date)}</span>
                <span aria-hidden="true">·</span>
                <span>{a.readTime} read</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
