import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cómo puede un extranjero ser dueño de terrenos en Indonesia (PT PMA y leasehold) — RumahYa',
  description:
    '¿Puede un extranjero comprar terrenos en Indonesia? Sí — mediante una PT PMA (freehold/HGB) o un leasehold. RumahYa explica las estructuras legales, la debida diligencia y el proceso para Lombok.',
  alternates: {
    canonical: 'https://rumahya.com/es/guide',
    languages: {
      en: 'https://rumahya.com/guide',
      fr: 'https://rumahya.com/fr/guide',
      es: 'https://rumahya.com/es/guide',
      id: 'https://rumahya.com/id/guide',
    },
  },
  openGraph: {
    title: 'Cómo puede un extranjero ser dueño de terrenos en Indonesia — guía RumahYa',
    description:
      'PT PMA, HGB, leasehold: las vías legales y conformes para invertir en tierra indonesia, explicadas paso a paso.',
    url: 'https://rumahya.com/es/guide',
    type: 'article',
    locale: 'es_ES',
    images: [
      { url: 'https://rumahya.com/og-image.jpg', width: 1200, height: 630, alt: 'RumahYa — Guía inmobiliaria Indonesia para extranjeros' },
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cómo puede un extranjero ser dueño de terrenos en Indonesia (PT PMA y leasehold)',
  description:
    'Las estructuras legales y conformes que usan los extranjeros para invertir en tierra indonesia — PT PMA (HGB freehold) y leasehold — con la debida diligencia y el proceso RumahYa.',
  author: { '@type': 'Organization', name: 'RumahYa', url: 'https://rumahya.com' },
  publisher: { '@type': 'Organization', name: 'RumahYa' },
  inLanguage: 'es',
  mainEntityOfPage: 'https://rumahya.com/es/guide',
};

export default function GuidePageES() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="guide-page">
        <section className="container guide-hero">
          <p className="eyebrow">Guía para inversores · Lombok, Indonesia</p>
          <h1>¿Puede un extranjero ser dueño de terrenos en Indonesia? Sí — así es.</h1>
          <p className="guide-lead">
            Indonesia no permite la propiedad freehold directa a extranjeros — pero sí permite dos
            vías totalmente legales para controlar tierra: una <strong>PT PMA</strong> que posee un
            título <strong>HGB</strong> (freehold efectivo), o un <strong>leasehold</strong>
            (normalmente 25–30 años, prorrogable). Esta guía explica ambas, la debida diligencia que
            lo protege y cómo RumahYa lo lleva del interés a la entrega.
          </p>
        </section>

        <section className="container guide-section">
          <h2>Vía 1 — PT PMA (freehold vía HGB)</h2>
          <p>
            Una PT PMA es una entidad legal indonesia de capital extranjero. Puede poseer un título{' '}
            <strong>Hak Guna Bangunan (HGB)</strong> — el equivalente práctico del freehold para
            inversión, renovable por décadas. Usted controla la empresa, y la empresa controla la
            tierra. Es la estructura que usan la mayoría de los inversores extranjeros serios para
            villas y acumulación de terrenos en Lombok.
          </p>
          <ul>
            <li>Empresa de capital extranjero (usted es el accionista)</li>
            <li>Posee el título HGB sobre la tierra — bancable, renovable, transferible</li>
            <li>Totalmente conforme con la ley de inversión indonesia</li>
            <li>Ideal para mantener a largo plazo y desarrollar</li>
          </ul>
        </section>

        <section className="container guide-section">
          <h2>Vía 2 — Leasehold</h2>
          <p>
            El leasehold es la entrada más simple. Usted arrienda la tierra (y cualquier villa sobre
            ella) por un plazo fijo — típicamente 25 a 30 años, a menudo con opciones de prórroga.
            No se requiere crear una empresa, menor capital inicial, y el título queda con el
            propietario indonesio. Muchos compradores empiezan con un arriendo y luego pasan a una
            estructura PT PMA.
          </p>
          <ul>
            <li>Sin constitución de entidad — cierre más rápido</li>
            <li>Menor desembolso inicial que la estructura freehold</li>
            <li>Condiciones de salida y prórroga claras y fijas</li>
          </ul>
        </section>

        <section className="container guide-section">
          <h2>Por qué la debida diligencia es todo</h2>
          <p>
            En Indonesia, el riesgo rara vez es el precio — es el <strong>título</strong>. Una cadena
            de propiedad limpia, permisos verificados y un notario que confirme que el vendedor puede
            transferir legalmente el bien son innegociables. Cada listado en RumahYa se verifica el
            título antes de llegarle. No le mostraríamos una parcela que no compraríamos nosotros
            mismos.
          </p>
          <ul>
            <li>Verificación de título y cadena de propiedad</li>
            <li>Confirmación de permisos y zonificación</li>
            <li>Coordinación notarial para una transferencia limpia</li>
            <li>Visita en terreno, fotos y levantamiento</li>
          </ul>
        </section>

        <section className="container guide-section">
          <h2>El proceso RumahYa</h2>
          <ol>
            <li>Consulta inicial para entender su presupuesto y objetivos</li>
            <li>Lista corta de propiedades verificadas según sus criterios</li>
            <li>Visitas en sitio coordinadas por nuestro equipo de Lombok</li>
            <li>Debida diligencia legal: verificación de títulos, permisos, notario</li>
            <li>Soporte de transacción hasta la entrega</li>
          </ol>
        </section>

        <section className="container guide-cta">
          <h2>¿Listo para ver terrenos verificados?</h2>
          <p>Explore las oportunidades actuales, o hable con nuestro equipo de Lombok — sin compromiso.</p>
          <div className="guide-cta-buttons">
            <Link href="/es/opportunities" className="lc2-btn-wa">Ver oportunidades</Link>
            <a
              href="https://wa.me/6287873487940?text=Hola%20RumahYa%2C%20quisiera%20entender%20c%C3%B3mo%20comprar%20terreno%20en%20Lombok%20como%20extranjero"
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
