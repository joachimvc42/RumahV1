import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions d\'utilisation',
  description:
    'Conditions régissant votre utilisation de rumahya.com — annonces de location et d\'investissement immobilier à Lombok, Indonésie.',
  alternates: {
    canonical: 'https://rumahya.com/fr/terms',
    languages: {
      en: 'https://rumahya.com/terms',
      fr: 'https://rumahya.com/fr/terms',
      es: 'https://rumahya.com/es/terms',
      'x-default': 'https://rumahya.com/terms',
    },
  },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = '2026-05-04';

export default function TermsPageFR() {
  return (
    <article className="legal-page">
      <h1>Conditions d&apos;utilisation</h1>
      <p className="legal-meta">Dernière mise à jour : {LAST_UPDATED}</p>

      <p>
        Bienvenue sur <strong>RumahYa</strong>. Les présentes conditions d&apos;utilisation
        (« Conditions ») régissent votre accès et votre utilisation de{' '}
        <a href="https://rumahya.com">rumahya.com</a> (le « Site »). En accédant au Site, vous
        acceptez ces Conditions. Si vous n&apos;acceptez pas, n&apos;utilisez pas le Site.
      </p>

      <h2>1. Qui nous sommes</h2>
      <p>
        RumahYa est exploité par <strong>[COMPANY_LEGAL_NAME]</strong>, immatriculé au{' '}
        <strong>[COMPANY_ADDRESS]</strong> sous le numéro{' '}
        <strong>[COMPANY_REGISTRATION_NUMBER]</strong>. Contact :{' '}
        <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
      </p>

      <h2>2. Nature du service</h2>
      <p>
        Le Site présente des opportunités de location longue durée et d&apos;investissement à Lombok,
        Indonésie. Nous agissons comme <strong>intermédiaire local et plateforme
        d&apos;information</strong> mettant en relation propriétaires, locataires et investisseurs.
        Nous ne sommes ni agent immobilier licencié dans votre juridiction, ni conseiller
        juridique ou financier. Les annonces sont informatives et ne constituent pas une offre
        de contracter.
      </p>

      <h2>3. Éligibilité</h2>
      <p>
        Vous devez avoir au moins 18 ans et être capable de conclure un contrat selon le droit
        de votre juridiction. En utilisant le Site, vous le confirmez.
      </p>

      <h2>4. Comptes utilisateurs et zones admin</h2>
      <p>
        La consultation ne nécessite pas de compte. Les zones administratives (sous{' '}
        <code>/admin</code>) sont réservées au personnel autorisé. Toute tentative d&apos;accès non
        autorisée est journalisée et peut être signalée aux autorités.
      </p>

      <h2>5. Exactitude du contenu</h2>
      <p>Nous faisons des efforts raisonnables pour maintenir les annonces à jour. Cependant :</p>
      <ul>
        <li>Les photos peuvent ne pas refléter l&apos;état actuel du bien.</li>
        <li>Les prix sont indicatifs et peuvent changer sans préavis.</li>
        <li>La disponibilité est sous réserve de confirmation par le propriétaire ou notre équipe locale.</li>
        <li>
          Le régime foncier indonésien (Hak Milik, Hak Guna Bangunan, leasehold) est complexe.
          Confirmez toujours le titre auprès d&apos;un notaire indonésien licencié avant tout
          engagement.
        </li>
      </ul>

      <h2>6. Absence de garantie / pas de conseil</h2>
      <p>
        Le Site est fourni « en l&apos;état » et « selon disponibilité ». Dans la mesure permise par
        la loi, nous excluons toute garantie expresse ou implicite (qualité marchande, adéquation
        à un usage particulier, non-contrefaçon). Rien sur le Site ne constitue un conseil
        juridique, financier, fiscal ou d&apos;investissement. Consultez toujours un professionnel
        qualifié avant toute décision impliquant l&apos;immobilier ou un capital.
      </p>

      <h2>7. Limitation de responsabilité</h2>
      <p>
        Dans la mesure permise par la loi applicable, RumahYa, ses dirigeants, employés et
        partenaires ne sauraient être responsables des dommages indirects, accessoires, spéciaux,
        consécutifs ou punitifs, y compris perte de profit, de données ou d&apos;image, découlant de
        l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser le Site, de toute transaction avec un
        propriétaire, ou de la confiance accordée aux informations publiées.
      </p>
      <p>
        Notre responsabilité globale pour des dommages directs n&apos;excédera pas le plus élevé
        entre (i) les frais que vous nous avez payés au cours des 12 mois précédant la
        réclamation, ou (ii) cent euros (100 EUR).
      </p>

      <h2>8. Transactions avec des tiers</h2>
      <p>
        Toute transaction de location, vente ou investissement a lieu directement entre vous et
        le propriétaire ou vendeur. RumahYa n&apos;est pas partie à ce contrat. Nous pouvons
        faciliter mises en relation, traductions et orientation vers un notaire, mais ne
        collectons pas de loyers, dépôts ou fonds d&apos;achat sauf accord écrit séparé.
      </p>

      <h2>9. Conduite</h2>
      <p>Vous vous engagez à ne pas :</p>
      <ul>
        <li>Soumettre des informations fausses, trompeuses ou frauduleuses.</li>
        <li>Utiliser le Site pour harceler, diffamer ou usurper l&apos;identité d&apos;autrui.</li>
        <li>Scraper, crawler ou extraire des données par moyens automatisés au-delà de robots.txt.</li>
        <li>Tenter de contourner l&apos;authentification, le rate limiting ou les contrôles de sécurité.</li>
        <li>Téléverser virus, malware ou code nuisible.</li>
        <li>Utiliser le Site à des fins contraires à la loi applicable.</li>
      </ul>
      <p>Nous pouvons suspendre ou bloquer l&apos;accès en cas d&apos;abus.</p>

      <h2>10. Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble du contenu du Site (textes, images, logos, code, design) est la propriété de
        RumahYa ou nous est concédé sous licence. Vous pouvez consulter le Site et partager des
        liens à des fins personnelles non commerciales. Toute autre utilisation — copie,
        reproduction, modification, distribution, affichage public — requiert notre accord
        écrit préalable.
      </p>
      <p>
        Les photos de biens peuvent être fournies par les propriétaires ; nous les utilisons avec
        leur autorisation. Si vous estimez qu&apos;un contenu enfreint vos droits, contactez{' '}
        <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
      </p>

      <h2>11. Liens externes</h2>
      <p>
        Le Site peut contenir des liens vers des sites tiers (Google Maps, réseaux sociaux,
        prestataires de paiement). Nous ne sommes pas responsables du contenu, des politiques
        ou des pratiques de ces sites.
      </p>

      <h2>12. Vie privée</h2>
      <p>
        Notre traitement des données personnelles est décrit dans notre{' '}
        <a href="/fr/privacy">politique de confidentialité</a>, qui fait partie intégrante des
        présentes Conditions.
      </p>

      <h2>13. Modifications des Conditions</h2>
      <p>
        Nous pouvons mettre à jour ces Conditions. Les modifications substantielles seront
        annoncées au moins 30 jours à l&apos;avance via une notification sur le Site. L&apos;utilisation
        continue après la date d&apos;effet vaut acceptation des nouvelles Conditions.
      </p>

      <h2>14. Loi applicable et juridiction</h2>
      <p>
        Les présentes Conditions sont régies par le droit de <strong>[GOVERNING_LAW_COUNTRY]</strong>.
        Tout litige né des présentes ou de votre utilisation du Site relèvera de la compétence
        exclusive des tribunaux de <strong>[COURT_LOCATION]</strong>, sans préjudice des règles
        impératives de protection des consommateurs de votre pays de résidence.
      </p>

      <h2>15. Divisibilité</h2>
      <p>
        Si une disposition est jugée invalide ou inapplicable, les autres restent pleinement en
        vigueur.
      </p>

      <h2>16. Contact</h2>
      <p>
        Questions sur les Conditions : <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
      </p>
    </article>
  );
}
