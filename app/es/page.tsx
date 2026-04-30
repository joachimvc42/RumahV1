import type { Metadata } from 'next';
import HomeClient from '../home-client';

export const metadata: Metadata = {
  title: 'Alquileres de larga duración de villas en Lombok',
  description:
    'Alquileres de larga duración de villas verificadas en Lombok, Indonesia. Condiciones honestas de 1 mes a 10 años, verificación legal y coordinación local sobre el terreno.',
  alternates: {
    canonical: 'https://rumahya.com/es',
    languages: {
      'en': 'https://rumahya.com/',
      'fr': 'https://rumahya.com/fr',
      'es': 'https://rumahya.com/es',
      'x-default': 'https://rumahya.com/',
    },
  },
  openGraph: {
    title: 'Alquileres de larga duración en Lombok — RumahYa',
    description: 'Villas verificadas, condiciones claras, coordinación local. Tu alquiler en Lombok, bien hecho.',
    url: 'https://rumahya.com/es',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Alquileres e inversiones inmobiliarias en Lombok, Indonesia',
      },
    ],
  },
};

export default function HomePageES() {
  return (
    <>
      <div className="seo-content">
        <h1>Alquileres de larga duración de villas en Lombok, Indonesia</h1>
        <p>
          RumahYa es tu socio local de confianza para encontrar alquileres de larga duración
          verificados en Lombok. Ya sea que busques una villa frente al mar en Kuta Lombok,
          una casa entre arrozales cerca de Selong Belanak, o una propiedad serena en las
          colinas del norte, seleccionamos y verificamos cada anuncio para que puedas
          instalarte con total confianza.
        </p>
        <h2>¿Por qué alquilar a largo plazo en Lombok?</h2>
        <p>
          Lombok ofrece playas vírgenes, surf de clase mundial y un ritmo de vida relajado,
          a una fracción del coste de Bali. Expatriados y nómadas digitales eligen cada vez
          más Lombok por sus paisajes intactos, su comunidad internacional en crecimiento y
          sus alquileres asequibles. Los alquileres de larga duración — desde un mes hasta
          diez años — te dan la flexibilidad para instalarte y vivir la isla a tu manera.
        </p>
        <h2>Nuestro proceso de alquiler</h2>
        <p>
          Cada propiedad listada en RumahYa ha sido revisada personalmente por nuestro
          equipo local. Verificamos certificados de tierra y permisos de construcción,
          traducimos los contratos a español claro, y coordinamos directamente con los
          propietarios para que no tengas que enfrentar la barrera del idioma. Desde tu
          primera consulta hasta la entrega de llaves, estamos contigo en cada paso.
        </p>
        <h2>Zonas populares en Lombok</h2>
        <ul>
          <li><strong>Kuta Lombok</strong> — Surf, playas de arena blanca y comunidad expat vibrante.</li>
          <li><strong>Selong Belanak</strong> — Bahía tranquila, atardeceres espectaculares, ideal para familias.</li>
          <li><strong>Senggigi</strong> — Zona expat consolidada, buenas comodidades, cerca del aeropuerto.</li>
          <li><strong>Tanjung y norte de Lombok</strong> — Fuera de los caminos trillados, selva exuberante, cerca de las Islas Gili.</li>
        </ul>
      </div>
      <HomeClient locale="es" />
    </>
  );
}
