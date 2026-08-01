import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Comment un étranger peut posséder un terrain en Indonésie (PT PMA & leasehold) — RumahYa',
  description:
    'Un étranger peut-il acheter un terrain en Indonésie ? Oui — via une PT PMA (freehold/HGB) ou un leasehold. RumahYa explique les structures conformes, la due diligence et la démarche pour Lombok.',
  alternates: {
    canonical: 'https://rumahya.com/fr/guide',
    languages: {
      en: 'https://rumahya.com/guide',
      fr: 'https://rumahya.com/fr/guide',
      es: 'https://rumahya.com/es/guide',
      id: 'https://rumahya.com/id/guide',
    },
  },
  openGraph: {
    title: 'Comment un étranger peut posséder un terrain en Indonésie — guide RumahYa',
    description:
      'PT PMA, HGB, leasehold : les voies légales et conformes pour investir dans la terre indonésienne, expliquées étape par étape.',
    url: 'https://rumahya.com/fr/guide',
    type: 'article',
    locale: 'fr_FR',
    images: [
      { url: 'https://rumahya.com/og-image.jpg', width: 1200, height: 630, alt: 'RumahYa — Guide immobilier Indonésie pour étrangers' },
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Comment un étranger peut posséder un terrain en Indonésie (PT PMA & leasehold)',
  description:
    'Les structures légales et conformes permettant aux étrangers d’investir dans la terre indonésienne — PT PMA (HGB freehold) et leasehold — avec la due diligence et la démarche RumahYa.',
  author: { '@type': 'Organization', name: 'RumahYa', url: 'https://rumahya.com' },
  publisher: { '@type': 'Organization', name: 'RumahYa' },
  inLanguage: 'fr',
  mainEntityOfPage: 'https://rumahya.com/fr/guide',
};

export default function GuidePageFR() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="guide-page">
        <section className="container guide-hero">
          <p className="eyebrow">Guide investisseur · Lombok, Indonésie</p>
          <h1>Un étranger peut-il posséder un terrain en Indonésie ? Oui — voici comment.</h1>
          <p className="guide-lead">
            L&apos;Indonésie n&apos;autorise pas la propriété en freehold directe pour les étrangers —
            mais elle permet deux voies entièrement légales de contrôler une terre : une{' '}
            <strong>PT PMA</strong> détenant un titre <strong>HGB</strong> (freehold effectif), ou un{' '}
            <strong>leasehold</strong> (généralement 25–30 ans, renouvelable). Ce guide explique les
            deux, la due diligence qui vous protège, et comment RumahYa vous mène de l&apos;intérêt à
            la remise des clés.
          </p>
        </section>

        <section className="container guide-section">
          <h2>Voie 1 — PT PMA (freehold via HGB)</h2>
          <p>
            Une PT PMA est une entité légale indonésienne à capitaux étrangers. Elle peut détenir un
            titre <strong>Hak Guna Bangunan (HGB)</strong> — l&apos;équivalent pratique du freehold à
            des fins d&apos;investissement, renouvelable sur des dizaines d&apos;années. Vous contrôlez
            la société, et la société contrôle la terre. C&apos;est la structure utilisée par la
            plupart des investisseurs étrangers sérieux pour les villas et le land banking à Lombok.
          </p>
          <ul>
            <li>Société à capitaux étrangers (vous êtes l&apos;actionnaire)</li>
            <li>Détient le titre HGB sur la terre — bancable, renouvelable, transférable</li>
            <li>Conforme à la loi indonésienne sur l&apos;investissement</li>
            <li>Idéal pour les détentions long terme et le développement</li>
          </ul>
        </section>

        <section className="container guide-section">
          <h2>Voie 2 — Leasehold</h2>
          <p>
            Le leasehold est l&apos;entrée la plus simple. Vous louez la terre (et toute villa
            éventuelle) pour une durée fixe — généralement 25 à 30 ans, souvent avec options de
            prolongation. Aucune création de société requise, coût initial plus faible, et le titre
            reste chez le propriétaire indonésien. Beaucoup d&apos;acheteurs commencent par un bail
            puis passent ensuite à une structure PT PMA.
          </p>
          <ul>
            <li>Pas de création d&apos;entité — clôture plus rapide</li>
            <li>Capital initial inférieur à la structure freehold</li>
            <li>Conditions de sortie et de prolongation claires et fixes</li>
          </ul>
        </section>

        <section className="container guide-section">
          <h2>Pourquoi la due diligence est essentielle</h2>
          <p>
            En Indonésie, le risque n&apos;est rarement pas le prix — c&apos;est le <strong>titre</strong>.
            Une chaîne de propriété propre, des permis vérifiés et un notaire confirmant que le
            vendeur peut légalement transférer le bien sont non négociables. Chaque annonce sur
            RumahYa est vérifiée sur le titre avant de vous parvenir. Nous ne vous montrerions pas
            une parcelle que nous n&apos;achèterions pas nous-mêmes.
          </p>
          <ul>
            <li>Vérification du titre et de la chaîne de propriété</li>
            <li>Confirmation des permis et du zonage</li>
            <li>Coordination notariale pour un transfert propre</li>
            <li>Visite sur le terrain, photos et arpentage</li>
          </ul>
        </section>

        <section className="container guide-section">
          <h2>La démarche RumahYa</h2>
          <ol>
            <li>Consultation initiale pour comprendre votre budget et vos objectifs</li>
            <li>Shortlist d&apos;opportunités vérifiées correspondant à vos critères</li>
            <li>Visites sur site coordonnées par notre équipe de Lombok</li>
            <li>Due diligence juridique : vérification des titres, permis, notaire</li>
            <li>Accompagnement de la transaction jusqu&apos;à la remise des clés</li>
          </ol>
        </section>

        <section className="container guide-cta">
          <h2>Prêt à regarder des terrains vérifiés ?</h2>
          <p>Parcourez les opportunités actuelles, ou parlez à notre équipe de Lombok — sans engagement.</p>
          <div className="guide-cta-buttons">
            <Link href="/fr/opportunities" className="lc2-btn-wa">Voir les opportunités</Link>
            <a
              href="https://wa.me/6287873487940?text=Bonjour%20RumahYa%2C%20je%20souhaite%20comprendre%20comment%20acheter%20un%20terrain%20%C3%A0%20Lombok%20en%20tant%20qu%27%C3%A9tranger"
              target="_blank"
              rel="noopener noreferrer"
              className="lc2-btn-wa"
            >
              WhatsApp
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
