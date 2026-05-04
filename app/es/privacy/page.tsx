import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description:
    'Cómo RumahYa recopila, utiliza, conserva y protege tus datos personales. Conforme a RGPD, UK GDPR, CCPA y la Ley UU PDP de Indonesia.',
  alternates: {
    canonical: 'https://rumahya.com/es/privacy',
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

export default function PrivacyPageES() {
  return (
    <article className="legal-page">
      <h1>Política de Privacidad</h1>
      <p className="legal-meta">Última actualización: {LAST_UPDATED}</p>

      <p>
        Esta Política de Privacidad explica cómo <strong>RumahYa</strong> («nosotros») recopila,
        utiliza, conserva y protege tus datos personales cuando visitas{' '}
        <a href="https://rumahya.com">rumahya.com</a> (el «Sitio») o interactúas con nuestros
        servicios. Nos comprometemos a proteger tu privacidad y cumplir con las leyes aplicables:
        Reglamento General de Protección de Datos de la UE (RGPD), UK GDPR, California Consumer
        Privacy Act (CCPA / CPRA) y Ley n.º 27 de 2022 de Indonesia sobre protección de datos
        personales (UU PDP).
      </p>

      <div className="legal-callout">
        <strong>Responsable del tratamiento:</strong> RumahYa — [COMPANY_LEGAL_NAME], [COMPANY_ADDRESS],
        [COMPANY_REGISTRATION_NUMBER]. Contacto:{' '}
        <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
      </div>

      <h2>1. Datos que recopilamos</h2>
      <p>Solo recopilamos datos que proporcionas voluntariamente o necesarios para que el Sitio funcione.</p>

      <table>
        <thead>
          <tr>
            <th>Categoría</th>
            <th>Datos</th>
            <th>Origen</th>
            <th>Finalidad</th>
            <th>Base legal (Art. 6 RGPD)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Formulario de contacto</td>
            <td>Nombre, email, teléfono (opcional), mensaje, tipo de interés</td>
            <td>Tú — formulario</td>
            <td>Responder a tu consulta, enviar información de propiedades</td>
            <td>Consentimiento / medidas precontractuales</td>
          </tr>
          <tr>
            <td>Consultas de propiedad</td>
            <td>Referencia, nombre, email, mensaje</td>
            <td>Tú — página de listado</td>
            <td>Coordinar visitas, compartir datos del propietario</td>
            <td>Medidas precontractuales</td>
          </tr>
          <tr>
            <td>Analítica</td>
            <td>
              IP anonimizada, vistas, dispositivo, navegador, país, referente; cookies <code>_ga</code>,{' '}
              <code>_ga_*</code>
            </td>
            <td>Google Analytics 4</td>
            <td>Comprender el uso del Sitio y mejorar el contenido</td>
            <td>Consentimiento (solo tras aceptar el banner)</td>
          </tr>
          <tr>
            <td>Mapas</td>
            <td>Ubicación aproximada, datos de navegador al cargar las teselas</td>
            <td>Google Maps embebido en /map</td>
            <td>Mostrar el mapa interactivo de propiedades</td>
            <td>Consentimiento / interés legítimo</td>
          </tr>
          <tr>
            <td>Logs de hosting</td>
            <td>Dirección IP, URL de petición, marca temporal, user-agent</td>
            <td>Vercel (proveedor de hosting)</td>
            <td>Seguridad, prevención de abusos, depuración</td>
            <td>Interés legítimo (Art. 6(1)(f))</td>
          </tr>
          <tr>
            <td>Autenticación admin</td>
            <td>Email, hash de contraseña, cookies de sesión</td>
            <td>Personal interno — Supabase Auth</td>
            <td>Gestión de listados y back-office</td>
            <td>Necesidad contractual</td>
          </tr>
        </tbody>
      </table>

      <p>
        <strong>No recopilamos</strong>: documentos de identidad, datos de tarjetas, credenciales
        bancarias, datos biométricos ni categorías especiales (salud, religión, opiniones
        políticas, etc.).
      </p>

      <h2>2. Cookies y tecnologías similares</h2>
      <p>Dos categorías estrictas:</p>
      <ul>
        <li>
          <strong>Estrictamente necesarias</strong> — necesarias para que el Sitio funcione
          (renderizado, envío de formularios, preferencia de idioma). Siempre activas. No
          requieren consentimiento (art. 5(3) ePrivacy).
        </li>
        <li>
          <strong>Analíticas</strong> — cookies de Google Analytics 4 (<code>_ga</code>,{' '}
          <code>_ga_*</code>). Desactivadas por defecto. Cargadas solo tras hacer clic en
          «Aceptar todo» en nuestro banner. Usamos Google Consent Mode v2 con estado por
          defecto <code>denied</code>.
        </li>
      </ul>
      <p>
        Puedes cambiar tu elección en cualquier momento borrando los datos del sitio{' '}
        <code>rumahya.com</code> en tu navegador o contactándonos por email.
      </p>

      <h2>3. Plazos de conservación</h2>
      <ul>
        <li><strong>Mensajes del formulario</strong> — 24 meses tras el último contacto, luego eliminados.</li>
        <li><strong>Consultas en negociación activa</strong> — duración de la relación + 5 años (derecho mercantil indonesio).</li>
        <li><strong>Datos analíticos</strong> — 14 meses en Google Analytics, luego agregados.</li>
        <li><strong>Logs de hosting</strong> — hasta 30 días.</li>
        <li><strong>Cuentas admin</strong> — duración del empleo + 3 meses.</li>
      </ul>

      <h2>4. Con quién compartimos los datos</h2>
      <p>
        Solo compartimos datos con los encargados estrictamente necesarios. Ninguno vende tus datos.
      </p>
      <table>
        <thead>
          <tr>
            <th>Encargado</th>
            <th>Rol</th>
            <th>Ubicación</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Supabase Inc.</td><td>Base de datos, autenticación, almacenamiento</td><td>UE / EE. UU.</td></tr>
          <tr><td>Vercel Inc.</td><td>Hosting, edge network, despliegue</td><td>UE / EE. UU.</td></tr>
          <tr><td>Resend (Plus Five Five Inc.)</td><td>Envío de emails transaccionales</td><td>EE. UU.</td></tr>
          <tr><td>Google LLC</td><td>Analytics 4, Maps, Fonts</td><td>UE / EE. UU.</td></tr>
        </tbody>
      </table>
      <p>
        <strong>No vendemos</strong>, alquilamos ni intercambiamos tus datos con terceros para
        fines de marketing.
      </p>

      <h2>5. Transferencias internacionales</h2>
      <p>
        Algunos encargados están fuera de tu país. Cuando los datos salen de la UE/EEE, nos
        apoyamos en las Cláusulas Contractuales Tipo (CCT) de la Comisión Europea y en las
        garantías adicionales de cada encargado. Puedes solicitar copia de las CCT por email a{' '}
        <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
      </p>

      <h2>6. Tus derechos</h2>
      <p>Según tu lugar de residencia, dispones de los siguientes derechos:</p>
      <ul>
        <li><strong>Acceso</strong> — copia de los datos que tenemos.</li>
        <li><strong>Rectificación</strong> — corregir datos inexactos.</li>
        <li><strong>Supresión</strong> («derecho al olvido»).</li>
        <li><strong>Limitación</strong> del tratamiento.</li>
        <li><strong>Portabilidad</strong> — recibir tus datos en formato legible por máquina.</li>
        <li><strong>Oposición</strong> al tratamiento basado en interés legítimo.</li>
        <li><strong>Retirada del consentimiento</strong> — en cualquier momento, sin efecto retroactivo.</li>
        <li>
          <strong>Residentes en California (CCPA / CPRA)</strong> — derechos de acceso,
          eliminación, rectificación, opt-out de la «venta» o «compartición» (no realizamos
          ninguna), no discriminación.
        </li>
        <li>
          <strong>Residentes en Indonesia (UU PDP)</strong> — derechos equivalentes de acceso,
          rectificación, eliminación y retirada del consentimiento.
        </li>
      </ul>
      <p>
        Para ejercer un derecho: <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
        Respondemos en 30 días.
      </p>

      <h2>7. Derecho a presentar una reclamación</h2>
      <p>
        Si crees que no hemos gestionado correctamente tus datos, puedes reclamar ante tu
        autoridad local: AEPD (España), CNIL (Francia), ICO (Reino Unido), Personal Data
        Protection Agency (Indonesia).
      </p>

      <h2>8. Seguridad</h2>
      <p>
        HTTPS en todo el sitio, bases de datos cifradas, contraseñas hasheadas, control de
        acceso por roles, principio de mínimo privilegio. Revisamos nuestra postura de seguridad
        regularmente. Ningún sistema es 100 % seguro — en caso de violación que afecte a tus
        datos, te notificaremos a ti y a la autoridad competente en 72 horas (Art. 33–34 RGPD).
      </p>

      <h2>9. Menores</h2>
      <p>
        El Sitio no está dirigido a menores de 16 años. No recopilamos a sabiendas datos de
        menores. Si crees que un menor ha enviado datos, contáctanos y los eliminaremos.
      </p>

      <h2>10. Decisiones automatizadas</h2>
      <p>
        No utilizamos toma de decisiones automatizada, perfilado ni IA con efectos jurídicos o
        similares para ti.
      </p>

      <h2>11. Cambios</h2>
      <p>
        Podemos actualizar esta política. Los cambios sustanciales se anunciarán en la página
        principal al menos 30 días antes de su entrada en vigor. La fecha «Última actualización»
        refleja la versión vigente.
      </p>

      <h2>12. Contacto</h2>
      <p>
        Preguntas, reclamaciones o ejercicio de derechos:{' '}
        <a href="mailto:info@rumahya.com">info@rumahya.com</a>.
      </p>
    </article>
  );
}
