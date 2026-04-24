import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = 'https://rumahya.com';
const PREFIX: Record<'en' | 'fr' | 'es', string> = { en: '', fr: '/fr', es: '/es' };

function supa() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function rentalMetadata(
  id: string,
  locale: 'en' | 'fr' | 'es'
): Promise<Metadata> {
  const supabase = supa();

  let { data: prop } = await supabase
    .from('properties')
    .select('title, location, description, images')
    .eq('id', id)
    .maybeSingle();

  if (!prop) {
    const { data: rental } = await supabase
      .from('long_term_rentals')
      .select('property_id')
      .eq('id', id)
      .maybeSingle();
    if (rental?.property_id) {
      const { data } = await supabase
        .from('properties')
        .select('title, location, description, images')
        .eq('id', rental.property_id)
        .maybeSingle();
      prop = data;
    }
  }

  if (!prop) return { title: 'Rental in Lombok', robots: { index: false, follow: true } };

  const suffix = locale === 'fr'
    ? `location longue durée à ${prop.location ?? 'Lombok'}`
    : locale === 'es'
    ? `alquiler de larga duración en ${prop.location ?? 'Lombok'}`
    : `long-term rental in ${prop.location ?? 'Lombok'}`;

  const title = `${prop.title} — ${suffix}`;
  const description = (prop.description ?? '').slice(0, 160) || suffix;
  const image = Array.isArray(prop.images) && prop.images[0] ? prop.images[0] : `${BASE_URL}/og-image.jpg`;
  const canonical = `${BASE_URL}${PREFIX[locale]}/rentals/${id}`;

  return {
    title, description,
    alternates: {
      canonical,
      languages: {
        en: `${BASE_URL}/rentals/${id}`,
        fr: `${BASE_URL}/fr/rentals/${id}`,
        es: `${BASE_URL}/es/rentals/${id}`,
        'x-default': `${BASE_URL}/rentals/${id}`,
      },
    },
    openGraph: {
      type: 'website', url: canonical, title, description,
      images: [{ url: image, alt: prop.title }],
      locale: locale === 'fr' ? 'fr_FR' : locale === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export async function investmentMetadata(
  id: string,
  locale: 'en' | 'fr' | 'es'
): Promise<Metadata> {
  const supabase = supa();
  const { data: inv } = await supabase
    .from('investments')
    .select('asset_type, asset_id')
    .eq('id', id)
    .maybeSingle();

  let title = 'Investment opportunity in Lombok';
  let description = 'Verified land or villa investment in Lombok, Indonesia.';
  let image = `${BASE_URL}/og-image.jpg`;

  if (inv) {
    const table = inv.asset_type === 'property' ? 'properties' : 'lands';
    const { data: asset } = await supabase
      .from(table)
      .select('title, location, description, images')
      .eq('id', inv.asset_id)
      .maybeSingle();
    if (asset) {
      const noun = inv.asset_type === 'property'
        ? (locale === 'fr' ? 'villa' : locale === 'es' ? 'villa' : 'villa')
        : (locale === 'fr' ? 'terrain' : locale === 'es' ? 'terreno' : 'land');
      const prep = locale === 'fr' ? 'à' : locale === 'es' ? 'en' : 'in';
      title = `${asset.title} — ${noun} ${prep} ${asset.location ?? 'Lombok'}`;
      description = (asset.description ?? '').slice(0, 160) || title;
      if (Array.isArray(asset.images) && asset.images[0]) image = asset.images[0];
    }
  }

  const canonical = `${BASE_URL}${PREFIX[locale]}/investments/${id}`;

  return {
    title, description,
    alternates: {
      canonical,
      languages: {
        en: `${BASE_URL}/investments/${id}`,
        fr: `${BASE_URL}/fr/investments/${id}`,
        es: `${BASE_URL}/es/investments/${id}`,
        'x-default': `${BASE_URL}/investments/${id}`,
      },
    },
    openGraph: {
      type: 'website', url: canonical, title, description,
      images: [{ url: image, alt: title }],
      locale: locale === 'fr' ? 'fr_FR' : locale === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}
