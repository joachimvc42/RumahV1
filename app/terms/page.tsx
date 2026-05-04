import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'Terms governing your use of rumahya.com — property rental and investment listings in Lombok, Indonesia.',
  alternates: {
    canonical: 'https://rumahya.com/terms',
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

export default function TermsPageEN() {
  return (
    <article className="legal-page">
      <h1>Terms of Use</h1>
      <p className="legal-meta">Last updated: {LAST_UPDATED}</p>

      <p>
        Welcome to <strong>RumahYa</strong>. These Terms of Use (&quot;Terms&quot;) govern your access to
        and use of <a href="https://rumahya.com">rumahya.com</a> (the &quot;Site&quot;). By accessing the
        Site, you agree to these Terms. If you do not agree, do not use the Site.
      </p>

      <h2>1. Who we are</h2>
      <p>
        RumahYa is operated by <strong>[COMPANY_LEGAL_NAME]</strong>, registered at{' '}
        <strong>[COMPANY_ADDRESS]</strong> under registration number{' '}
        <strong>[COMPANY_REGISTRATION_NUMBER]</strong>. Contact:{' '}
        <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
      </p>

      <h2>2. Nature of the service</h2>
      <p>
        The Site presents long-term rental and investment opportunities in Lombok, Indonesia. We
        act as a <strong>local intermediary and information platform</strong> connecting property
        owners with renters and investors. We are not a licensed real-estate broker in your
        jurisdiction, nor a legal or financial advisor. Listings are informational only and do not
        constitute an offer to contract.
      </p>

      <h2>3. Eligibility</h2>
      <p>
        You must be at least 18 years old and able to enter into a binding contract under the laws
        of your jurisdiction. By using the Site you confirm that this is the case.
      </p>

      <h2>4. User accounts and admin areas</h2>
      <p>
        Browsing the Site does not require an account. Administrative areas (under <code>/admin</code>)
        are restricted to authorised staff. Unauthorised access attempts are logged and may be
        reported to law enforcement.
      </p>

      <h2>5. Content accuracy</h2>
      <p>
        We make reasonable efforts to keep listings, prices, and property descriptions up to date.
        However:
      </p>
      <ul>
        <li>Photos may not reflect the current state of the property.</li>
        <li>Prices are indicative and may change without notice.</li>
        <li>Availability is subject to confirmation by the owner or our local team.</li>
        <li>
          Indonesian land tenure (Hak Milik, Hak Guna Bangunan, leasehold) is complex. Always
          confirm title status with a licensed Indonesian notary before signing any agreement.
        </li>
      </ul>

      <h2>6. No warranty / no advice</h2>
      <p>
        The Site is provided &quot;as is&quot; and &quot;as available&quot;. To the maximum extent permitted by
        law, we disclaim all warranties, express or implied, including merchantability, fitness for
        a particular purpose, and non-infringement. Nothing on the Site constitutes legal,
        financial, tax, or investment advice. Always consult a qualified professional before
        making decisions involving real estate or capital.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by applicable law, RumahYa, its directors, employees, and
        partners shall not be liable for indirect, incidental, special, consequential, or punitive
        damages, including loss of profits, data, or goodwill, arising from your use of or
        inability to use the Site, any transaction with a property owner, or reliance on
        information published on the Site.
      </p>
      <p>
        Our aggregate liability for any direct damages shall not exceed the greater of (i) the
        total fees you paid us in the 12 months preceding the claim, or (ii) one hundred euros
        (EUR 100).
      </p>

      <h2>8. Third-party transactions</h2>
      <p>
        Any rental, sale, or investment transaction takes place directly between you and the
        property owner or seller. RumahYa is not a party to that contract. We may facilitate
        introductions, translations, and notary referrals, but we do not collect rent, deposits,
        or purchase funds on behalf of owners unless explicitly stated in a separate written
        agreement.
      </p>

      <h2>9. Your conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Submit false, misleading, or fraudulent information.</li>
        <li>Use the Site to harass, defame, or impersonate any person or entity.</li>
        <li>Scrape, crawl, or extract data through automated means beyond what robots.txt allows.</li>
        <li>Attempt to bypass authentication, rate limiting, or security controls.</li>
        <li>Upload viruses, malware, or any harmful code.</li>
        <li>Use the Site for any purpose contrary to applicable law.</li>
      </ul>
      <p>We may suspend or block access at our discretion in case of abuse.</p>

      <h2>10. Intellectual property</h2>
      <p>
        All content on the Site (text, images, logos, code, design) is owned by RumahYa or licensed
        to us. You may view and share links to the Site for personal, non-commercial use. Any
        other use — copying, reproduction, modification, distribution, public display — requires
        our prior written consent.
      </p>
      <p>
        Property photos may be supplied by owners; we use them with their permission. If you
        believe content on the Site infringes your rights, contact{' '}
        <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
      </p>

      <h2>11. External links</h2>
      <p>
        The Site may link to third-party websites (Google Maps, social media, payment providers).
        We are not responsible for the content, policies, or practices of those sites.
      </p>

      <h2>12. Privacy</h2>
      <p>
        Our handling of personal data is described in our{' '}
        <a href="/privacy">Privacy Policy</a>, which forms part of these Terms.
      </p>

      <h2>13. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. Material changes will be announced at least
        30 days in advance via a notice on the Site. Continued use of the Site after the effective
        date constitutes acceptance of the new Terms.
      </p>

      <h2>14. Governing law and jurisdiction</h2>
      <p>
        These Terms are governed by the laws of <strong>[GOVERNING_LAW_COUNTRY]</strong>. Any
        dispute arising from these Terms or your use of the Site shall be submitted to the
        exclusive jurisdiction of the competent courts of <strong>[COURT_LOCATION]</strong>,
        without prejudice to mandatory consumer-protection rules in your country of residence.
      </p>

      <h2>15. Severability</h2>
      <p>
        If any provision of these Terms is held to be invalid or unenforceable, the remaining
        provisions shall remain in full force and effect.
      </p>

      <h2>16. Contact</h2>
      <p>
        Questions about these Terms: <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
      </p>
    </article>
  );
}
