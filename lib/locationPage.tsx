import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ZONES, getZone, type Locale } from './locations';

export const LOCALES: Locale[] = ['en', 'fr', 'es', 'id'];
const WA_NUMBER = '6287873487940';

function locOf(s: string): Locale {
  return (LOCALES as string[]).includes(s) ? (s as Locale) : 'en';
}

const UI: Record<Locale, { opp: string; wa: string; why: string }> = {
  en: { opp: 'View opportunities', wa: 'WhatsApp us', why: 'Why invest here' },
  fr: { opp: 'Voir les opportunités', wa: 'WhatsApp', why: 'Pourquoi investir ici' },
  es: { opp: 'Ver oportunidades', wa: 'WhatsApp', why: 'Por qué invertir aquí' },
  id: { opp: 'Lihat peluang', wa: 'WhatsApp', why: 'Mengapa investasi di sini' },
};

const ZONE_SLUGS = ZONES.map((z) => z.slug);

export function locationStaticParams(): { zone: string }[] {
  return ZONE_SLUGS.map((slug) => ({ zone: slug }));
}

export function locationMetadata(locale: Locale, zone: string): Metadata {
  const z = getZone(zone);
  if (!z) return {};
  const base = 'https://rumahya.com';
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return {
    title: z.metaTitle[locale],
    description: z.metaDescription[locale],
    alternates: {
      canonical: `${base}${prefix}/locations/${z.slug}`,
      languages: {
        en: `${base}/locations/${z.slug}`,
        fr: `${base}/fr/locations/${z.slug}`,
        es: `${base}/es/locations/${z.slug}`,
        id: `${base}/id/locations/${z.slug}`,
        'x-default': `${base}/locations/${z.slug}`,
      },
    },
    openGraph: {
      title: z.metaTitle[locale],
      description: z.metaDescription[locale],
      url: `${base}${prefix}/locations/${z.slug}`,
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : locale === 'es' ? 'es_ES' : locale === 'id' ? 'id_ID' : 'en_US',
      images: [{ url: `${base}/og-image.jpg`, width: 1200, height: 630, alt: z.schemaName[locale] }],
    },
  };
}

export default function LocationPage({ locale, zone }: { locale: Locale; zone: string }) {
  const z = getZone(zone);
  if (!z) notFound();
  const l = locOf(locale);
  const t = UI[l];

  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hello RumahYa, I'm interested in land in ${z.name.en} (Lombok) as a foreign investor`
  )}`;
  const oppHref = l === 'en' ? '/opportunities' : `/${l}/opportunities`;

  const placeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: z.schemaName[l],
    description: z.metaDescription[l],
    address: {
      '@type': 'PostalAddress',
      addressLocality: z.schemaName.en,
      addressRegion: 'West Nusa Tenggara',
      addressCountry: 'ID',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd) }} />
      <main className="guide-page">
        <section className="container guide-hero">
          <p className="eyebrow">Lombok · Land investment</p>
          <h1>{z.name[l]}</h1>
          <p className="guide-lead">{z.tagline[l]}</p>
        </section>

        <section className="container guide-section">
          <p>{z.intro[l]}</p>
        </section>

        <section className="container guide-section">
          <h2>{t.why}</h2>
          <ul>
            {z.bullets[l].map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </section>

        <section className="container guide-cta">
          <h2>{z.name[l]}</h2>
          <p>{z.cta[l]}</p>
          <div className="guide-cta-buttons">
            <Link href={oppHref} className="lc2-btn-wa">{t.opp}</Link>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="lc2-btn-wa">{t.wa}</a>
          </div>
        </section>
      </main>
    </>
  );
}
