import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How RumahYa collects, uses, stores, and protects your personal data. Compliant with GDPR, UK GDPR, CCPA, and Indonesian PDP Law.',
  alternates: {
    canonical: 'https://rumahya.com/privacy',
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

export default function PrivacyPageEN() {
  return (
    <article className="legal-page">
      <h1>Privacy Policy</h1>
      <p className="legal-meta">Last updated: {LAST_UPDATED}</p>

      <p>
        This Privacy Policy explains how <strong>RumahYa</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
        collects, uses, stores, and protects your personal data when you visit{' '}
        <a href="https://rumahya.com">rumahya.com</a> (the &quot;Site&quot;) or interact with our
        services. We are committed to protecting your privacy and complying with applicable data
        protection laws, including the EU General Data Protection Regulation (GDPR), the United
        Kingdom GDPR, the California Consumer Privacy Act (CCPA / CPRA), and Indonesian Personal
        Data Protection Law No. 27 of 2022 (UU PDP).
      </p>

      <div className="legal-callout">
        <strong>Data controller:</strong> RumahYa — [COMPANY_LEGAL_NAME], [COMPANY_ADDRESS],
        [COMPANY_REGISTRATION_NUMBER]. Contact:{' '}
        <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
      </div>

      <h2>1. Data we collect</h2>
      <p>We only collect data you provide voluntarily or that is required for the Site to work.</p>

      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Data</th>
            <th>Source</th>
            <th>Purpose</th>
            <th>Legal basis (GDPR Art. 6)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Contact form</td>
            <td>Name, email, phone (optional), message, type of interest</td>
            <td>You — contact / lead form</td>
            <td>Reply to your enquiry, send property information</td>
            <td>Consent / pre-contractual measures</td>
          </tr>
          <tr>
            <td>Property enquiries</td>
            <td>Property reference, your name, email, message</td>
            <td>You — listing detail page</td>
            <td>Coordinate viewings, share owner details</td>
            <td>Pre-contractual measures</td>
          </tr>
          <tr>
            <td>Analytics</td>
            <td>
              Anonymised IP, page views, device, browser, country, referrer; cookies <code>_ga</code>,{' '}
              <code>_ga_*</code>
            </td>
            <td>Google Analytics 4</td>
            <td>Understand site usage and improve content</td>
            <td>Consent (only after you accept the banner)</td>
          </tr>
          <tr>
            <td>Maps</td>
            <td>Approximate location, browser data while loading map tiles</td>
            <td>Google Maps embedded on the /map page</td>
            <td>Display interactive property map</td>
            <td>Consent / legitimate interest</td>
          </tr>
          <tr>
            <td>Hosting logs</td>
            <td>IP address, request URL, timestamp, user-agent</td>
            <td>Vercel (our hosting provider)</td>
            <td>Site security, abuse prevention, debugging</td>
            <td>Legitimate interest (Art. 6(1)(f))</td>
          </tr>
          <tr>
            <td>Admin authentication</td>
            <td>Email, password hash, session cookies</td>
            <td>Internal staff only — Supabase Auth</td>
            <td>Manage listings and back-office</td>
            <td>Contractual necessity</td>
          </tr>
        </tbody>
      </table>

      <p>
        We <strong>do not</strong> collect: government IDs, payment card details, banking
        credentials, biometric data, or special-category data (health, religion, political views,
        etc.).
      </p>

      <h2>2. Cookies and similar technologies</h2>
      <p>We classify cookies in two strict categories:</p>
      <ul>
        <li>
          <strong>Strictly necessary</strong> — required for the Site to function (page rendering,
          form submission, language preference). Always on. No consent required under GDPR
          Art. 5(3) ePrivacy.
        </li>
        <li>
          <strong>Analytics</strong> — Google Analytics 4 cookies (<code>_ga</code>, <code>_ga_*</code>).
          Disabled by default. Loaded only after you click &quot;Accept all&quot; in our consent banner.
          We use Google Consent Mode v2 with a default state of <code>denied</code>.
        </li>
      </ul>
      <p>
        You can change your choice at any time by clearing your browser&apos;s site data for{' '}
        <code>rumahya.com</code> or by emailing us.
      </p>

      <h2>3. How long we keep data</h2>
      <ul>
        <li><strong>Contact form messages</strong> — 24 months from last contact, then deleted.</li>
        <li><strong>Lead enquiries (active negotiation)</strong> — duration of the relationship + 5 years (Indonesian commercial law).</li>
        <li><strong>Analytics data</strong> — 14 months in Google Analytics, then aggregated.</li>
        <li><strong>Hosting logs</strong> — up to 30 days.</li>
        <li><strong>Admin accounts</strong> — duration of employment + 3 months.</li>
      </ul>

      <h2>4. Who we share data with</h2>
      <p>
        We share data only with processors strictly necessary to operate the Site. None of our
        processors sell your data.
      </p>
      <table>
        <thead>
          <tr>
            <th>Processor</th>
            <th>Role</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Supabase Inc.</td><td>Database, authentication, file storage</td><td>EU / US</td></tr>
          <tr><td>Vercel Inc.</td><td>Hosting, edge network, deployment</td><td>EU / US</td></tr>
          <tr><td>Resend (Plus Five Five Inc.)</td><td>Transactional email delivery</td><td>US</td></tr>
          <tr><td>Google LLC</td><td>Analytics 4, Maps, Fonts</td><td>EU / US</td></tr>
        </tbody>
      </table>
      <p>
        We do <strong>not</strong> sell, rent, or trade your personal data with third parties for
        marketing purposes.
      </p>

      <h2>5. International transfers</h2>
      <p>
        Some processors are located outside your country. When data leaves the EU/EEA, we rely on
        the European Commission&apos;s Standard Contractual Clauses (SCCs) and additional safeguards
        published by each processor. You can request a copy of the SCCs by emailing{' '}
        <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
      </p>

      <h2>6. Your rights</h2>
      <p>Depending on where you live, you have the following rights:</p>
      <ul>
        <li><strong>Access</strong> — request a copy of the data we hold about you.</li>
        <li><strong>Rectification</strong> — correct inaccurate or incomplete data.</li>
        <li><strong>Erasure</strong> (&quot;right to be forgotten&quot;) — request deletion.</li>
        <li><strong>Restriction</strong> — limit how we process your data.</li>
        <li><strong>Portability</strong> — receive your data in a machine-readable format.</li>
        <li><strong>Objection</strong> — object to processing based on legitimate interest.</li>
        <li><strong>Withdraw consent</strong> — at any time, without affecting prior processing.</li>
        <li>
          <strong>California residents (CCPA / CPRA)</strong> — right to know, delete, correct, opt-out
          of &quot;sale&quot; or &quot;sharing&quot; (we do neither), and non-discrimination.
        </li>
        <li>
          <strong>Indonesian residents (UU PDP)</strong> — equivalent rights of access, rectification,
          deletion, and withdrawal of consent.
        </li>
      </ul>
      <p>
        To exercise any right, email <a href="mailto:info@rumahya.com">info@rumahya.com</a>. We
        respond within 30 days.
      </p>

      <h2>7. Right to lodge a complaint</h2>
      <p>
        If you believe we have not handled your data properly, you can complain to your local data
        protection authority. Examples: CNIL (France), AEPD (Spain), ICO (UK), Personal Data
        Protection Agency (Indonesia).
      </p>

      <h2>8. Security</h2>
      <p>
        We use HTTPS everywhere, encrypted databases, hashed passwords, role-based access control,
        and least-privilege permissions. We review our security posture regularly. No system is
        100% secure — if we ever experience a breach affecting your data, we will notify you and
        the relevant authority within 72 hours, in line with GDPR Art. 33–34.
      </p>

      <h2>9. Children</h2>
      <p>
        The Site is not directed at children under 16. We do not knowingly collect data from
        minors. If you believe a minor has submitted data, contact us and we will delete it.
      </p>

      <h2>10. Automated decision-making</h2>
      <p>
        We do not use automated decision-making, profiling, or AI systems that produce legal or
        similarly significant effects on you.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. Material changes will be announced on the Site
        homepage at least 30 days before they take effect. The &quot;Last updated&quot; date at the top of
        this page reflects the current version.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions, complaints, or rights requests:{' '}
        <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
      </p>
    </article>
  );
}
