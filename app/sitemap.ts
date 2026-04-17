import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = 'https://rumahya.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/rentals`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/investments`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ];

  // Dynamic rental detail pages
  const { data: rentals } = await supabase
    .from('long_term_rentals')
    .select('id, updated_at, properties(status)')
    .eq('properties.status', 'published');

  const rentalRoutes: MetadataRoute.Sitemap = (rentals ?? [])
    .filter((r: any) => r.properties?.status === 'published')
    .map((r: any) => ({
      url: `${BASE_URL}/rentals/${r.id}`,
      lastModified: r.updated_at ? new Date(r.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  // Dynamic investment detail pages
  const { data: investments } = await supabase
    .from('investments')
    .select('id, updated_at');

  const investmentRoutes: MetadataRoute.Sitemap = (investments ?? []).map((i: any) => ({
    url: `${BASE_URL}/investments/${i.id}`,
    lastModified: i.updated_at ? new Date(i.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...rentalRoutes, ...investmentRoutes];
}
