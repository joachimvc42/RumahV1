import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos de Uso',
  description:
    'Términos que rigen tu uso de rumahya.com — anuncios de alquiler e inversión inmobiliaria en Lombok, Indonesia.',
  alternates: {
    canonical: 'https://rumahya.com/es/terms',
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

export default function TermsPageES() {
  return (
    <article className="legal-page">
      <h1>Términos de Uso</h1>
      <p className="legal-meta">Última actualización: {LAST_UPDATED}</p>

      <p>
        Bienvenido a <strong>RumahYa</strong>. Estos Términos de Uso («Términos») rigen tu acceso
        y uso de <a href="https://rumahya.com">rumahya.com</a> (el «Sitio»). Al acceder al Sitio,
        aceptas estos Términos. Si no estás de acuerdo, no uses el Sitio.
      </p>

      <h2>1. Quiénes somos</h2>
      <p>
        RumahYa es operado por <strong>[COMPANY_LEGAL_NAME]</strong>, registrado en{' '}
        <strong>[COMPANY_ADDRESS]</strong> con número de registro{' '}
        <strong>[COMPANY_REGISTRATION_NUMBER]</strong>. Contacto:{' '}
        <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
      </p>

      <h2>2. Naturaleza del servicio</h2>
      <p>
        El Sitio presenta oportunidades de alquiler de larga duración e inversión en Lombok,
        Indonesia. Actuamos como <strong>intermediario local y plataforma de
        información</strong> que conecta propietarios con inquilinos e inversores. No somos
        agente inmobiliario licenciado en tu jurisdicción ni asesor legal o financiero. Los
        anuncios son informativos y no constituyen una oferta de contratar.
      </p>

      <h2>3. Elegibilidad</h2>
      <p>
        Debes tener al menos 18 años y ser capaz de celebrar un contrato vinculante según las
        leyes de tu jurisdicción. Al usar el Sitio confirmas que es así.
      </p>

      <h2>4. Cuentas de usuario y áreas admin</h2>
      <p>
        Navegar por el Sitio no requiere cuenta. Las áreas administrativas (bajo{' '}
        <code>/admin</code>) están restringidas al personal autorizado. Los intentos de acceso
        no autorizado se registran y pueden denunciarse a las autoridades.
      </p>

      <h2>5. Exactitud del contenido</h2>
      <p>Hacemos esfuerzos razonables por mantener los anuncios actualizados. Sin embargo:</p>
      <ul>
        <li>Las fotos pueden no reflejar el estado actual de la propiedad.</li>
        <li>Los precios son indicativos y pueden cambiar sin previo aviso.</li>
        <li>La disponibilidad está sujeta a confirmación del propietario o nuestro equipo local.</li>
        <li>
          La tenencia de tierras en Indonesia (Hak Milik, Hak Guna Bangunan, leasehold) es
          compleja. Confirma siempre el título con un notario indonesio licenciado antes de
          firmar cualquier acuerdo.
        </li>
      </ul>

      <h2>6. Sin garantía / sin asesoramiento</h2>
      <p>
        El Sitio se proporciona «tal cual» y «según disponibilidad». En la medida permitida por
        la ley, descartamos toda garantía expresa o implícita (comerciabilidad, idoneidad para
        un fin particular, no infracción). Nada en el Sitio constituye asesoramiento legal,
        financiero, fiscal o de inversión. Consulta siempre a un profesional cualificado antes
        de decisiones que involucren inmobiliario o capital.
      </p>

      <h2>7. Limitación de responsabilidad</h2>
      <p>
        En la máxima medida permitida por la ley aplicable, RumahYa, sus directivos, empleados y
        socios no serán responsables de daños indirectos, incidentales, especiales,
        consecuentes o punitivos, incluyendo pérdida de beneficios, datos o reputación,
        derivados del uso o imposibilidad de uso del Sitio, de cualquier transacción con un
        propietario, o de la confianza en información publicada.
      </p>
      <p>
        Nuestra responsabilidad agregada por daños directos no excederá el mayor entre (i) las
        tarifas que nos hayas pagado en los 12 meses previos a la reclamación, o (ii) cien
        euros (100 EUR).
      </p>

      <h2>8. Transacciones con terceros</h2>
      <p>
        Toda transacción de alquiler, venta o inversión ocurre directamente entre tú y el
        propietario o vendedor. RumahYa no es parte de ese contrato. Podemos facilitar
        presentaciones, traducciones y referencias de notario, pero no recaudamos rentas,
        depósitos o fondos de compra salvo acuerdo escrito separado.
      </p>

      <h2>9. Conducta</h2>
      <p>Aceptas no:</p>
      <ul>
        <li>Enviar información falsa, engañosa o fraudulenta.</li>
        <li>Usar el Sitio para acosar, difamar o suplantar a otros.</li>
        <li>Hacer scraping, crawling o extracción automatizada más allá de robots.txt.</li>
        <li>Intentar eludir autenticación, rate limiting o controles de seguridad.</li>
        <li>Subir virus, malware o código dañino.</li>
        <li>Usar el Sitio para fines contrarios a la ley.</li>
      </ul>
      <p>Podemos suspender o bloquear el acceso a discreción en caso de abuso.</p>

      <h2>10. Propiedad intelectual</h2>
      <p>
        Todo el contenido del Sitio (textos, imágenes, logos, código, diseño) es propiedad de
        RumahYa o nos está cedido bajo licencia. Puedes consultar y compartir enlaces para uso
        personal no comercial. Cualquier otro uso — copia, reproducción, modificación,
        distribución, exhibición pública — requiere nuestro consentimiento escrito previo.
      </p>
      <p>
        Las fotos de propiedades pueden ser proporcionadas por los propietarios; las usamos con
        su permiso. Si crees que un contenido infringe tus derechos, contacta{' '}
        <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
      </p>

      <h2>11. Enlaces externos</h2>
      <p>
        El Sitio puede enlazar a sitios de terceros (Google Maps, redes sociales, proveedores
        de pago). No somos responsables del contenido, las políticas o las prácticas de esos
        sitios.
      </p>

      <h2>12. Privacidad</h2>
      <p>
        Nuestro tratamiento de datos personales se describe en nuestra{' '}
        <a href="/es/privacy">Política de Privacidad</a>, que forma parte de estos Términos.
      </p>

      <h2>13. Cambios en los Términos</h2>
      <p>
        Podemos actualizar estos Términos. Los cambios sustanciales se anunciarán al menos 30
        días antes de su entrada en vigor mediante un aviso en el Sitio. El uso continuado tras
        la fecha de entrada en vigor constituye aceptación.
      </p>

      <h2>14. Ley aplicable y jurisdicción</h2>
      <p>
        Estos Términos se rigen por las leyes de <strong>[GOVERNING_LAW_COUNTRY]</strong>.
        Cualquier disputa derivada de estos Términos o de tu uso del Sitio se someterá a la
        jurisdicción exclusiva de los tribunales competentes de{' '}
        <strong>[COURT_LOCATION]</strong>, sin perjuicio de las normas imperativas de
        protección al consumidor de tu país de residencia.
      </p>

      <h2>15. Divisibilidad</h2>
      <p>
        Si alguna disposición se considera inválida o inaplicable, las demás disposiciones
        permanecerán en pleno vigor.
      </p>

      <h2>16. Contacto</h2>
      <p>
        Preguntas sobre estos Términos: <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
      </p>
    </article>
  );
}
