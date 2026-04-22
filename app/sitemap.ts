import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = 'https://rumahya.com';
const LOCALE_PREFIXES = ['', '/fr', '/es'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Static pages — emit every locale prefix
  const staticRoutes: MetadataRoute.Sitemap = LOCALE_PREFIXES.flatMap(prefix => [
    { url: `${BASE_URL}${prefix}/`, lastModified: new Date(), changeFrequency: 'daily', priority: prefix === '' ? 1 : 0.9 },
    { url: `${BASE_URL}${prefix}/investments`, lastModified: new Date(), changeFrequency: 'daily', priority: prefix === '' ? 0.9 : 0.8 },
    { url: `${BASE_URL}${prefix}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: prefix === '' ? 0.7 : 0.6 },
  ]);

  // Dynamic rental detail pages — one entry per locale
  const { data: rentals } = await supabase
    .from('long_term_rentals')
    .select('id, updated_at, properties(status)')
    .eq('properties.status', 'published');

  const rentalRoutes: MetadataRoute.Sitemap = (rentals ?? [])
    .filter((r: any) => r.properties?.status === 'published')
    .flatMap((r: any) =>
      LOCALE_PREFIXES.map(prefix => ({
        url: `${BASE_URL}${prefix}/rentals/${r.id}`,
        lastModified: r.updated_at ? new Date(r.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: prefix === '' ? 0.8 : 0.7,
      }))
    );

  // Dynamic investment detail pages — one entry per locale
  const { data: investments } = await supabase
    .from('investments')
    .select('id, updated_at');

  const investmentRoutes: MetadataRoute.Sitemap = (investments ?? []).flatMap((i: any) =>
    LOCALE_PREFIXES.map(prefix => ({
      url: `${BASE_URL}${prefix}/investments/${i.id}`,
      lastModified: i.updated_at ? new Date(i.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: prefix === '' ? 0.8 : 0.7,
    }))
  );

  return [...staticRoutes, ...rentalRoutes, ...investmentRoutes];
}
