/**
 * Server-side data loader for investment/land listings.
 *
 * The listing UI (`InvestmentsClient`) fetches from Supabase in the browser,
 * which means the raw HTML Googlebot receives contains no listings. To make the
 * listings crawlable we fetch them on the server (at build / request time) and
 * hand them to the client component as `initialItems`. The client keeps its
 * existing sessionStorage cache + filter logic; it just starts with real data
 * already in the SSR output.
 *
 * Mirrors the merge logic in `app/investments/investments-client.tsx` but runs
 * on the server using the same anon Supabase client.
 */
import { supabase } from './supabaseClient';
import type { Locale } from './i18n';
import { prefixFor } from './i18n';

export type InvestmentItem = {
  id: string;
  type: 'villa' | 'land';
  title: string;
  location: string;
  reference?: string | null;
  price: number;
  currency: string;
  tenure: 'freehold' | 'leasehold';
  leaseYears?: number;
  expectedYield: number | null;
  images: string[];
  href: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  pool?: boolean;
  garden?: boolean;
  furnished?: boolean;
  seaView?: boolean;
  condition?: string;
  landSize?: number | null;
  hasWater?: boolean;
  hasElectricity?: boolean;
  hasRoad?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  whatsapp?: string | null;
};

export async function getInvestments(locale: Locale): Promise<InvestmentItem[]> {
  try {
    const { data: investments, error: invErr } = await supabase
      .from('investments')
      .select('*');
    if (invErr) {
      console.error('[getInvestments] investments query error:', invErr.message);
      return [];
    }
    if (!investments || investments.length === 0) return [];

    const pIds = investments
      .filter((i: any) => i.asset_type === 'property')
      .map((i: any) => i.asset_id);
    const lIds = investments
      .filter((i: any) => i.asset_type === 'land')
      .map((i: any) => i.asset_id);

    const [{ data: props }, { data: lands }] = await Promise.all([
      pIds.length
        ? supabase.from('properties').select('*').in('id', pIds)
        : Promise.resolve({ data: [] }),
      lIds.length
        ? supabase.from('lands').select('*').in('id', lIds)
        : Promise.resolve({ data: [] }),
    ]);

    const merged: InvestmentItem[] = [];
    for (const inv of investments) {
      if (inv.asset_type === 'property') {
        const p: any = (props as any[])?.find((x) => x.id === inv.asset_id);
        if (p && p.status === 'published') {
          merged.push({
            id: inv.id,
            type: 'villa',
            title: p.title,
            location: p.location || 'Lombok',
            reference: inv.reference,
            price: p.price || 0,
            currency: p.currency || 'USD',
            tenure: p.tenure || 'freehold',
            leaseYears: p.lease_years,
            expectedYield: inv.expected_yield,
            images: p.images || [],
            href: prefixFor(locale, `/opportunities/${inv.id}`),
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            pool: p.pool,
            garden: p.garden,
            furnished: p.furnished,
            seaView: p.sea_view,
            condition: p.condition,
            latitude: p.latitude,
            longitude: p.longitude,
            description: p.description,
            whatsapp: p.whatsapp,
          });
        }
      } else if (inv.asset_type === 'land') {
        const l: any = (lands as any[])?.find((x) => x.id === inv.asset_id);
        if (l && l.status === 'published') {
          merged.push({
            id: inv.id,
            type: 'land',
            title: l.title,
            location: l.location || 'Lombok',
            reference: inv.reference,
            price: l.price_per_are_idr ?? l.price_per_are ?? 0,
            currency: l.currency || 'IDR',
            tenure: l.tenure || 'freehold',
            leaseYears: l.lease_years,
            expectedYield: inv.expected_yield,
            images: l.images || [],
            href: prefixFor(locale, `/opportunities/${inv.id}`),
            landSize: l.land_size ? Number(l.land_size) : null,
            condition: l.condition,
            hasWater: l.has_water,
            hasElectricity: l.has_electricity,
            hasRoad: l.has_road,
            seaView: l.sea_view,
            latitude: l.latitude,
            longitude: l.longitude,
            description: l.description,
            whatsapp: l.whatsapp,
          });
        }
      }
    }
    return merged;
  } catch (e) {
    console.error('[getInvestments] unexpected error:', e);
    return [];
  }
}

/**
 * Build a schema.org ItemList JSON-LD for the listing page so search engines
 * get a crawlable, structured summary of every published opportunity.
 */
export function investmentsItemListJsonLd(
  items: InvestmentItem[],
  locale: Locale
): Record<string, unknown> {
  const base = 'https://rumahya.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name:
      locale === 'fr'
        ? 'Opportunités immobilières à Lombok'
        : locale === 'es'
          ? 'Oportunidades inmobiliarias en Lombok'
          : locale === 'id'
            ? 'Peluang properti di Lombok'
            : 'Real estate opportunities in Lombok',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: base + it.href,
      name: it.title,
    })),
  };
}
