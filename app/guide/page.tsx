import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How foreigners can own land in Indonesia (PT PMA & leasehold) — RumahYa',
  description:
    'Can a foreigner buy land in Indonesia? Yes — via a PT PMA (freehold/HGB) or leasehold. RumahYa explains the compliant structures, due diligence, and the step-by-step process for Lombok.',
  alternates: {
    canonical: 'https://rumahya.com/guide',
    languages: {
      en: 'https://rumahya.com/guide',
      fr: 'https://rumahya.com/fr/guide',
      es: 'https://rumahya.com/es/guide',
      id: 'https://rumahya.com/id/guide',
    },
  },
  openGraph: {
    title: 'How foreigners can own land in Indonesia — RumahYa guide',
    description:
      'PT PMA, HGB, leasehold: the legal, compliant ways foreigners invest in Indonesian land, explained step by step.',
    url: 'https://rumahya.com/guide',
    type: 'article',
    images: [
      { url: 'https://rumahya.com/og-image.jpg', width: 1200, height: 630, alt: 'RumahYa — Indonesia property guide for foreigners' },
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How foreigners can own land in Indonesia (PT PMA & leasehold)',
  description:
    'The legal, compliant structures foreigners use to invest in Indonesian land — PT PMA (HGB freehold) and leasehold — plus due diligence and the RumahYa process.',
  author: { '@type': 'Organization', name: 'RumahYa', url: 'https://rumahya.com' },
  publisher: { '@type': 'Organization', name: 'RumahYa' },
  mainEntityOfPage: 'https://rumahya.com/guide',
};

export default function GuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="guide-page">
        <section className="container guide-hero">
          <p className="eyebrow">Investor guide · Lombok, Indonesia</p>
          <h1>Can a foreigner own land in Indonesia? Yes — here&apos;s how.</h1>
          <p className="guide-lead">
            Indonesia does not allow direct freehold ownership by foreigners — but it does allow
            two fully legal routes to control land: a <strong>PT PMA</strong> holding <strong>HGB
            title</strong> (effective freehold), or a <strong>leasehold</strong> (typically 25–30
            years, extendable). This guide explains both, the due diligence that protects you, and
            how RumahYa takes you from interest to handover.
          </p>
        </section>

        <section className="container guide-section">
          <h2>Route 1 — PT PMA (freehold via HGB)</h2>
          <p>
            A PT PMA is an Indonesian legal entity with foreign ownership. It can hold an{' '}
            <strong>Hak Guna Bangunan (HGB)</strong> title — the practical equivalent of freehold
            for investment purposes, renewable for decades. You control the company, and the company
            controls the land. This is the structure most serious foreign investors use for villas
            and land banking in Lombok.
          </p>
          <ul>
            <li>Foreign-owned company (you are the shareholder)</li>
            <li>Holds HGB title on the land — bankable, renewable, transferable</li>
            <li>Fully compliant with Indonesian investment law</li>
            <li>Ideal for long-term holds and development</li>
          </ul>
        </section>

        <section className="container guide-section">
          <h2>Route 2 — Leasehold</h2>
          <p>
            Leasehold is the simpler entry. You lease the land (and any villa on it) for a fixed
            term — typically 25 to 30 years, often with extension options. No company setup required,
            lower upfront cost, and the title stays with the Indonesian owner. Many buyers start with
            a lease and later convert to a PT PMA structure.
          </p>
          <ul>
            <li>No entity setup — faster to close</li>
            <li>Lower capital outlay than freehold structuring</li>
            <li>Clear, fixed-term exit and extension terms</li>
          </ul>
        </section>

        <section className="container guide-section">
          <h2>Why due diligence is everything</h2>
          <p>
            In Indonesia, the risk is rarely the price — it is the <strong>title</strong>. A clean
            chain of ownership, verified permits, and a notary who confirms the seller can legally
            transfer the asset are non-negotiable. Every listing on RumahYa is title-checked before
            it reaches you. We would not show you a plot we would not buy ourselves.
          </p>
          <ul>
            <li>Title &amp; ownership-chain verification</li>
            <li>Permit and zoning confirmation</li>
            <li>Notary coordination for a clean transfer</li>
            <li>On-the-ground visit, photos, and survey</li>
          </ul>
        </section>

        <section className="container guide-section">
          <h2>The RumahYa process</h2>
          <ol>
            <li>Initial consultation to understand your budget and objectives</li>
            <li>Curated shortlist of verified properties matching your criteria</li>
            <li>On-site visits coordinated by our Lombok team</li>
            <li>Legal due diligence: title checks, permit verification, notary coordination</li>
            <li>Transaction support through to handover</li>
          </ol>
        </section>

        <section className="container guide-cta">
          <h2>Ready to look at verified land?</h2>
          <p>Browse current opportunities, or talk to our Lombok team — no obligation.</p>
          <div className="guide-cta-buttons">
            <Link href="/opportunities" className="lc2-btn-wa">View opportunities</Link>
            <a
              href="https://wa.me/6287873487940?text=Hello%20RumahYa%2C%20I%27d%20like%20to%20understand%20how%20to%20buy%20land%20in%20Lombok%20as%20a%20foreigner"
              target="_blank"
              rel="noopener noreferrer"
              className="lc2-btn-wa"
            >
              WhatsApp us
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
