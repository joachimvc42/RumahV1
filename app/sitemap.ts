import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = 'https://rumahya.com';
const LOCALE_PREFIXES = ['', '/fr', '/es'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Static invest pages — emit every locale prefix.
  // Note: the live, internally-linked listing route is /opportunities (the
  // nav and listing cards link there and those pages self-canonicalize to it);
  // /investments is a legacy duplicate that now canonicalizes to /opportunities,
  // so the sitemap must advertise /opportunities to match every other signal.
  const staticRoutes: MetadataRoute.Sitemap = LOCALE_PREFIXES.flatMap(prefix => [
    { url: `${BASE_URL}${prefix}/`, lastModified: new Date(), changeFrequency: 'daily', priority: prefix === '' ? 1 : 0.9 },
    { url: `${BASE_URL}${prefix}/opportunities`, lastModified: new Date(), changeFrequency: 'daily', priority: prefix === '' ? 0.9 : 0.8 },
    { url: `${BASE_URL}${prefix}/map`, lastModified: new Date(), changeFrequency: 'daily', priority: prefix === '' ? 0.8 : 0.7 },
    { url: `${BASE_URL}${prefix}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: prefix === '' ? 0.7 : 0.6 },
    { url: `${BASE_URL}${prefix}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}${prefix}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]);

  // Dynamic investment detail pages — one entry per locale, published assets only.
  // Status lives on the linked asset (properties/lands), and the investments
  // table has `created_at` (not `updated_at`) — selecting a missing column would
  // error and silently drop every detail page from the sitemap.
  const { data: investments } = await supabase
    .from('investments')
    .select('id, asset_type, asset_id, created_at');

  const allInvestments = investments ?? [];
  const propIds = allInvestments.filter((i: any) => i.asset_type === 'property').map((i: any) => i.asset_id);
  const landIds = allInvestments.filter((i: any) => i.asset_type === 'land').map((i: any) => i.asset_id);
  const [{ data: pubProps }, { data: pubLands }] = await Promise.all([
    propIds.length ? supabase.from('properties').select('id').eq('status', 'published').in('id', propIds) : Promise.resolve({ data: [] as any[] }),
    landIds.length ? supabase.from('lands').select('id').eq('status', 'published').in('id', landIds) : Promise.resolve({ data: [] as any[] }),
  ]);
  const publishedProp = new Set((pubProps ?? []).map((p: any) => p.id));
  const publishedLand = new Set((pubLands ?? []).map((l: any) => l.id));
  const publishedInvestments = allInvestments.filter((i: any) =>
    (i.asset_type === 'property' && publishedProp.has(i.asset_id)) ||
    (i.asset_type === 'land' && publishedLand.has(i.asset_id))
  );

  const investmentRoutes: MetadataRoute.Sitemap = publishedInvestments.flatMap((i: any) =>
    LOCALE_PREFIXES.map(prefix => ({
      url: `${BASE_URL}${prefix}/opportunities/${i.id}`,
      lastModified: i.created_at ? new Date(i.created_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: prefix === '' ? 0.8 : 0.7,
    }))
  );

  // FAQ — one entry per locale (the FR/ES FAQ pages were missing from the sitemap)
  const faqRoute: MetadataRoute.Sitemap = LOCALE_PREFIXES.map(prefix => ({
    url: `${BASE_URL}${prefix}/faq`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: prefix === '' ? 0.8 : 0.7,
  }));

  return [...staticRoutes, ...faqRoute, ...investmentRoutes];
}
