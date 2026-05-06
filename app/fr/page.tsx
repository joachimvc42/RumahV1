import type { Metadata } from 'next';
import InvestmentsClient from '../investments/investments-client';

export const metadata: Metadata = {
  title: 'Investissement immobilier à Lombok — terrains & villas',
  description:
    "Terrains et villas d'investissement vérifiés à Lombok, Indonésie. Titres contrôlés, rendements réalistes, coordination locale de la découverte à la livraison.",
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
    title: "Investir à Lombok — RumahYa",
    description: "Terrains et villas à Lombok. Documents vérifiés, rendements réalistes, équipe locale.",
    url: 'https://rumahya.com/fr',
    type: 'website',
    locale: 'fr_FR',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Investissement immobilier à Lombok, Indonésie',
      },
    ],
  },
};

export default function HomePageFR() {
  return (
    <>
      <div className="seo-content">
        <h1>Investissement immobilier à Lombok, Indonésie</h1>
        <p>
          RumahYa met en relation des investisseurs sérieux avec des terrains vérifiés et des
          opportunités d&apos;investissement en villas à travers Lombok. Chaque actif a été sourcé
          par notre équipe locale et a fait l&apos;objet d&apos;une vérification des titres avant
          d&apos;être publié sur cette page — car en Indonésie, la due diligence est essentielle.
        </p>
        <h2>Pourquoi investir dans l&apos;immobilier à Lombok ?</h2>
        <p>
          Lombok est l&apos;une des destinations touristiques à la croissance la plus rapide
          d&apos;Asie du Sud-Est. Avec le nouvel aéroport international de Lombok accueillant des
          vols internationaux, un nouveau circuit de Mandalika attirant les fans de MotoGP, et
          une demande croissante pour des locations de villas de qualité, les valeurs des
          terrains et des propriétés sont en hausse constante.
        </p>
        <h2>Notre processus d&apos;investissement</h2>
        <ul>
          <li>Consultation initiale pour comprendre votre budget et vos objectifs</li>
          <li>Sélection de biens vérifiés correspondant à vos critères</li>
          <li>Visites sur site coordonnées par notre équipe à Lombok</li>
          <li>Due diligence juridique : vérification des titres, permis, coordination notariale</li>
          <li>Accompagnement de la transaction jusqu&apos;à la livraison</li>
        </ul>
      </div>
      <InvestmentsClient locale="fr" />
    </>
  );
}
