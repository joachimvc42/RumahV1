import type { Metadata } from 'next';
import HomeClient from '../home-client';

export const metadata: Metadata = {
  title: 'Locations longue durée de villas à Lombok',
  description:
    'Locations longue durée de villas vérifiées à Lombok, Indonésie. Conditions honnêtes de 1 mois à 10 ans, vérification juridique et coordination locale sur le terrain.',
  alternates: {
    canonical: 'https://rumahya.com/fr',
    languages: {
      'en': 'https://rumahya.com/',
      'fr': 'https://rumahya.com/fr',
      'es': 'https://rumahya.com/es',
      'x-default': 'https://rumahya.com/',
    },
  },
  openGraph: {
    title: 'Locations longue durée à Lombok — RumahYa',
    description: 'Des villas vérifiées, des conditions claires, une coordination locale. Votre location à Lombok, bien faite.',
    url: 'https://rumahya.com/fr',
    type: 'website',
    locale: 'fr_FR',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Locations et investissements immobiliers à Lombok, Indonésie',
      },
    ],
  },
};

export default function HomePageFR() {
  return (
    <>
      <div className="seo-content">
        <h1>Locations longue durée de villas à Lombok, Indonésie</h1>
        <p>
          RumahYa est votre partenaire local de confiance pour trouver des locations longue
          durée vérifiées à Lombok. Que vous cherchiez une villa en bord de mer à Kuta Lombok,
          une maison entourée de rizières près de Selong Belanak, ou une propriété sereine sur
          les hauteurs du nord, nous sourçons et vérifions chaque bien afin que vous puissiez
          vous installer en toute confiance.
        </p>
        <h2>Pourquoi louer à long terme à Lombok ?</h2>
        <p>
          Lombok offre des plages préservées, un surf de classe mondiale et un rythme de vie
          détendu, à une fraction du coût de Bali. Expatriés et nomades digitaux choisissent
          de plus en plus Lombok pour ses paysages intacts, sa communauté internationale en
          plein essor et ses loyers abordables. Les locations longue durée — d&apos;un mois à dix
          ans — vous donnent la flexibilité de vraiment vous poser et de vivre l&apos;île à votre
          rythme.
        </p>
        <h2>Notre processus de location</h2>
        <p>
          Chaque bien listé sur RumahYa est inspecté par notre équipe sur place. Nous
          vérifions les certificats fonciers et permis de construire, traduisons les baux
          en français clair, et coordonnons directement avec les propriétaires pour vous
          éviter la barrière de la langue. De la première demande jusqu&apos;à la remise des
          clés, nous sommes à vos côtés à chaque étape.
        </p>
        <h2>Zones populaires à Lombok</h2>
        <ul>
          <li><strong>Kuta Lombok</strong> — Surf, plages de sable blanc et scène expat dynamique.</li>
          <li><strong>Selong Belanak</strong> — Baie tranquille, couchers de soleil spectaculaires, idéal pour les familles.</li>
          <li><strong>Senggigi</strong> — Zone expat établie, bonnes commodités, proche de l&apos;aéroport.</li>
          <li><strong>Tanjung &amp; nord de Lombok</strong> — Hors des sentiers battus, jungle luxuriante, près des îles Gili.</li>
        </ul>
      </div>
      <HomeClient locale="fr" />
    </>
  );
}
