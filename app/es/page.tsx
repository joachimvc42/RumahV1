import type { Metadata } from 'next';
import InvestmentsClient from '../investments/investments-client';

export const metadata: Metadata = {
  title: 'Inversión inmobiliaria en Lombok — terrenos y villas',
  description:
    'Terrenos y villas de inversión verificados en Lombok, Indonesia. Títulos comprobados, rendimientos realistas, coordinación local desde el descubrimiento hasta la entrega.',
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
    title: 'Invertir en Lombok — RumahYa',
    description: 'Terrenos y villas en Lombok. Documentos verificados, rendimientos realistas, equipo local.',
    url: 'https://rumahya.com/es',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: 'https://rumahya.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RumahYa — Inversión inmobiliaria en Lombok, Indonesia',
      },
    ],
  },
};

export default function HomePageES() {
  return (
    <>
      <div className="seo-content">
        <h1>Inversión inmobiliaria en Lombok, Indonesia</h1>
        <p>
          RumahYa conecta a inversores serios con parcelas de terreno verificadas y oportunidades
          de inversión en villas en todo Lombok. Cada activo ha sido localizado por nuestro equipo
          local y ha pasado una verificación de títulos antes de aparecer en esta página, porque
          en Indonesia la diligencia debida lo es todo.
        </p>
        <h2>¿Por qué invertir en inmuebles en Lombok?</h2>
        <p>
          Lombok es uno de los destinos turísticos de más rápido crecimiento en el Sudeste
          Asiático. Con el nuevo Aeropuerto Internacional de Lombok operando vuelos internacionales,
          un nuevo circuito de Mandalika atrayendo al público del MotoGP y una demanda creciente
          de villas de alquiler de calidad, los valores de terrenos y propiedades han crecido de
          forma constante.
        </p>
        <h2>Nuestro proceso de inversión</h2>
        <ul>
          <li>Consulta inicial para entender tu presupuesto y objetivos</li>
          <li>Selección de propiedades verificadas que se ajusten a tus criterios</li>
          <li>Visitas al lugar coordinadas por nuestro equipo en Lombok</li>
          <li>Due diligence jurídica: verificación de títulos, permisos, coordinación notarial</li>
          <li>Acompañamiento de la transacción hasta la entrega</li>
        </ul>
      </div>
      <InvestmentsClient locale="es" />
    </>
  );
}
