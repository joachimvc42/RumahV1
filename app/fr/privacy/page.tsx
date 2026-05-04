import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description:
    'Comment RumahYa collecte, utilise, conserve et protège vos données personnelles. Conforme au RGPD, UK GDPR, CCPA et UU PDP indonésienne.',
  alternates: {
    canonical: 'https://rumahya.com/fr/privacy',
    languages: {
      en: 'https://rumahya.com/privacy',
      fr: 'https://rumahya.com/fr/privacy',
      es: 'https://rumahya.com/es/privacy',
      'x-default': 'https://rumahya.com/privacy',
    },
  },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = '2026-05-04';

export default function PrivacyPageFR() {
  return (
    <article className="legal-page">
      <h1>Politique de confidentialité</h1>
      <p className="legal-meta">Dernière mise à jour : {LAST_UPDATED}</p>

      <p>
        Cette politique de confidentialité décrit comment <strong>RumahYa</strong> (« nous »)
        collecte, utilise, conserve et protège vos données personnelles lorsque vous visitez{' '}
        <a href="https://rumahya.com">rumahya.com</a> (le « Site ») ou interagissez avec nos
        services. Nous nous engageons à respecter votre vie privée et à nous conformer aux lois
        applicables en matière de protection des données : Règlement Général sur la Protection
        des Données (RGPD), UK GDPR, California Consumer Privacy Act (CCPA / CPRA) et Loi
        indonésienne n° 27 de 2022 sur la protection des données personnelles (UU PDP).
      </p>

      <div className="legal-callout">
        <strong>Responsable du traitement :</strong> RumahYa — [COMPANY_LEGAL_NAME], [COMPANY_ADDRESS],
        [COMPANY_REGISTRATION_NUMBER]. Contact :{' '}
        <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
      </div>

      <h2>1. Données collectées</h2>
      <p>Nous ne collectons que les données que vous fournissez volontairement ou nécessaires au fonctionnement du Site.</p>

      <table>
        <thead>
          <tr>
            <th>Catégorie</th>
            <th>Données</th>
            <th>Source</th>
            <th>Finalité</th>
            <th>Base légale (Art. 6 RGPD)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Formulaire de contact</td>
            <td>Nom, email, téléphone (facultatif), message, type d&apos;intérêt</td>
            <td>Vous — formulaire</td>
            <td>Répondre à votre demande, envoyer des informations sur les biens</td>
            <td>Consentement / mesures précontractuelles</td>
          </tr>
          <tr>
            <td>Demandes de bien</td>
            <td>Référence du bien, nom, email, message</td>
            <td>Vous — page de bien</td>
            <td>Coordonner les visites, partager les coordonnées du propriétaire</td>
            <td>Mesures précontractuelles</td>
          </tr>
          <tr>
            <td>Analytique</td>
            <td>
              IP anonymisée, pages vues, appareil, navigateur, pays, référent ; cookies <code>_ga</code>,{' '}
              <code>_ga_*</code>
            </td>
            <td>Google Analytics 4</td>
            <td>Comprendre l&apos;utilisation du Site et améliorer le contenu</td>
            <td>Consentement (uniquement après acceptation du bandeau)</td>
          </tr>
          <tr>
            <td>Cartes</td>
            <td>Localisation approximative, données de navigateur lors du chargement des tuiles</td>
            <td>Google Maps embarqué sur la page /map</td>
            <td>Afficher la carte interactive des biens</td>
            <td>Consentement / intérêt légitime</td>
          </tr>
          <tr>
            <td>Logs d&apos;hébergement</td>
            <td>Adresse IP, URL de requête, horodatage, user-agent</td>
            <td>Vercel (hébergeur)</td>
            <td>Sécurité du site, prévention des abus, débogage</td>
            <td>Intérêt légitime (Art. 6(1)(f))</td>
          </tr>
          <tr>
            <td>Authentification admin</td>
            <td>Email, hash du mot de passe, cookies de session</td>
            <td>Personnel interne — Supabase Auth</td>
            <td>Gestion des annonces et back-office</td>
            <td>Nécessité contractuelle</td>
          </tr>
        </tbody>
      </table>

      <p>
        Nous <strong>ne collectons pas</strong> : pièces d&apos;identité, données de paiement,
        coordonnées bancaires, données biométriques, ni données sensibles (santé, religion,
        opinions politiques, etc.).
      </p>

      <h2>2. Cookies et technologies similaires</h2>
      <p>Deux catégories strictes :</p>
      <ul>
        <li>
          <strong>Strictement nécessaires</strong> — indispensables au fonctionnement du Site
          (rendu des pages, soumission de formulaires, préférence de langue). Toujours actifs.
          Aucun consentement requis (art. 5(3) ePrivacy).
        </li>
        <li>
          <strong>Analytiques</strong> — cookies Google Analytics 4 (<code>_ga</code>, <code>_ga_*</code>).
          Désactivés par défaut. Chargés uniquement après votre clic sur « Tout accepter » dans le
          bandeau. Nous utilisons Google Consent Mode v2 avec un état par défaut <code>denied</code>.
        </li>
      </ul>
      <p>
        Vous pouvez modifier votre choix à tout moment en effaçant les données du site{' '}
        <code>rumahya.com</code> dans votre navigateur ou en nous contactant par email.
      </p>

      <h2>3. Durée de conservation</h2>
      <ul>
        <li><strong>Messages du formulaire de contact</strong> — 24 mois après le dernier contact, puis suppression.</li>
        <li><strong>Demandes en négociation active</strong> — durée de la relation + 5 ans (droit commercial indonésien).</li>
        <li><strong>Données analytiques</strong> — 14 mois dans Google Analytics, puis agrégation.</li>
        <li><strong>Logs d&apos;hébergement</strong> — jusqu&apos;à 30 jours.</li>
        <li><strong>Comptes admin</strong> — durée du contrat + 3 mois.</li>
      </ul>

      <h2>4. Destinataires des données</h2>
      <p>
        Nous partageons les données uniquement avec les sous-traitants strictement nécessaires.
        Aucun ne vend vos données.
      </p>
      <table>
        <thead>
          <tr>
            <th>Sous-traitant</th>
            <th>Rôle</th>
            <th>Localisation</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Supabase Inc.</td><td>Base de données, authentification, stockage</td><td>UE / US</td></tr>
          <tr><td>Vercel Inc.</td><td>Hébergement, edge network, déploiement</td><td>UE / US</td></tr>
          <tr><td>Resend (Plus Five Five Inc.)</td><td>Envoi d&apos;emails transactionnels</td><td>US</td></tr>
          <tr><td>Google LLC</td><td>Analytics 4, Maps, Fonts</td><td>UE / US</td></tr>
        </tbody>
      </table>
      <p>
        Nous <strong>ne vendons pas</strong>, ne louons pas et n&apos;échangeons pas vos données à des
        tiers à des fins marketing.
      </p>

      <h2>5. Transferts internationaux</h2>
      <p>
        Certains sous-traitants sont hors UE. Lorsque les données quittent l&apos;UE/EEE, nous nous
        appuyons sur les Clauses Contractuelles Types (CCT) de la Commission européenne et sur
        les garanties supplémentaires publiées par chaque sous-traitant. Vous pouvez demander
        copie des CCT par email à <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
      </p>

      <h2>6. Vos droits</h2>
      <p>Selon votre lieu de résidence, vous disposez des droits suivants :</p>
      <ul>
        <li><strong>Accès</strong> — copie des données vous concernant.</li>
        <li><strong>Rectification</strong> — correction de données inexactes ou incomplètes.</li>
        <li><strong>Effacement</strong> (« droit à l&apos;oubli »).</li>
        <li><strong>Limitation</strong> — restreindre le traitement.</li>
        <li><strong>Portabilité</strong> — recevoir vos données dans un format lisible par machine.</li>
        <li><strong>Opposition</strong> — au traitement fondé sur l&apos;intérêt légitime.</li>
        <li><strong>Retrait du consentement</strong> — à tout moment, sans effet rétroactif.</li>
        <li>
          <strong>Résidents Californie (CCPA / CPRA)</strong> — droits d&apos;accès, suppression,
          rectification, opt-out de la « vente » ou du « partage » (nous ne faisons ni l&apos;un ni
          l&apos;autre), non-discrimination.
        </li>
        <li>
          <strong>Résidents Indonésie (UU PDP)</strong> — droits équivalents d&apos;accès,
          rectification, suppression et retrait du consentement.
        </li>
      </ul>
      <p>
        Pour exercer un droit : <a href="mailto:info@rumahya.com">info@rumahya.com</a>. Nous
        répondons sous 30 jours.
      </p>

      <h2>7. Droit de réclamation</h2>
      <p>
        Si vous estimez que nous n&apos;avons pas géré vos données correctement, vous pouvez saisir
        votre autorité locale de protection des données : CNIL (France), AEPD (Espagne), ICO
        (Royaume-Uni), Personal Data Protection Agency (Indonésie).
      </p>

      <h2>8. Sécurité</h2>
      <p>
        HTTPS partout, bases de données chiffrées, mots de passe hashés, contrôle d&apos;accès basé sur
        les rôles, principe du moindre privilège. Nous révisons régulièrement notre posture de
        sécurité. Aucun système n&apos;est 100 % sûr — en cas de violation affectant vos données,
        nous vous notifierons ainsi que l&apos;autorité compétente sous 72 heures (Art. 33–34 RGPD).
      </p>

      <h2>9. Mineurs</h2>
      <p>
        Le Site n&apos;est pas destiné aux moins de 16 ans. Nous ne collectons pas sciemment de
        données de mineurs. Si vous pensez qu&apos;un mineur a soumis des données, contactez-nous —
        nous les supprimerons.
      </p>

      <h2>10. Décisions automatisées</h2>
      <p>
        Nous n&apos;utilisons pas de prise de décision automatisée, profilage ou IA produisant des
        effets juridiques ou similairement significatifs sur vous.
      </p>

      <h2>11. Modifications</h2>
      <p>
        Nous pouvons mettre à jour cette politique. Les modifications substantielles seront
        annoncées sur la page d&apos;accueil au moins 30 jours avant leur prise d&apos;effet. La date
        « Dernière mise à jour » en haut de page reflète la version en vigueur.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions, réclamations ou exercice de droits :{' '}
        <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
      </p>
    </article>
  );
}
