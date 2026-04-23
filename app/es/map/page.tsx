import type { Metadata } from 'next';
import MapClient from '../../map/map-client';

export const metadata: Metadata = {
  title: 'Mapa de propiedades — Alquileres e inversiones en Lombok',
  description:
    'Mapa interactivo de todas las propiedades verificadas por RumahYa. Alquileres de larga duración, villas en venta y oportunidades de terrenos en Lombok — filtra por tipo, titularidad, presupuesto y más.',
  alternates: { canonical: 'https://rumahya.com/es/map' },
  openGraph: {
    title: 'Mapa de propiedades — RumahYa Lombok',
    description: 'Explora en un mapa interactivo los alquileres, villas y terrenos verificados en Lombok.',
    url: 'https://rumahya.com/es/map',
    type: 'website',
    locale: 'es_ES',
  },
};

export default function MapPageES() {
  return <MapClient locale="es" />;
}
