/** Canonical list of Lombok locations used across the site.
 *  Update here and it propagates to admin autocomplete + public filters.
 *  Grouped by region (south-coast investment hotspots first, since that's
 *  where most buyer demand sits right now). */
export const LOMBOK_LOCATIONS = [
  // ── South coast — Kuta / Mandalika core ──
  'Kuta',
  'Mandalika',
  'Tanjung Aan',
  'Seger',
  'Gerupuk',
  'Bumbang',
  'Awang',
  'Serangan',
  // ── South-east — Jerowaru peninsula ──
  'Ekas',
  'Kaliantan',
  'Jerowaru',
  'Tanjung Luar',
  // ── South-west of Kuta — Selong Belanak corridor ──
  'Mawun',
  'Mawi',
  'Selong Belanak',
  'Rowok',
  'Semeti',
  'Tampah',
  'Tampah Hills',
  'Torok',
  'Lancing',
  'Are Guling',
  'Pengantap',
  'Sepi',
  'Blongas',
  // ── South-west peninsula — Sekotong ──
  'Sekotong',
  'Pelangan',
  'Mekaki',
  'Gili Gede',
  // ── Central Lombok (inland) ──
  'Praya',
  'Pujut',
  'Sengkol',
  'Rembitan',
  'Prabu',
  'Mong',
  // ── East Lombok ──
  'Selong',
  'Masbagik',
  'Lenek',
  'Labuhan Lombok',
  // ── Highlands ──
  'Tetebatu',
  'Sembalun',
  // ── North Lombok ──
  'Bayan',
  'Senaru',
  'Kayangan',
  'Gangga',
  'Tanjung',
  'Medana',
  'Sira',
  'Pemenang',
  'Bangsal',
  'Malimbu',
  'Nipah',
  // ── Gili Islands ──
  'Gili Trawangan',
  'Gili Air',
  'Gili Meno',
  // ── West Lombok / Greater Mataram ──
  'Senggigi',
  'Batulayar',
  'Ampenan',
  'Mataram',
  'Cakranegara',
  'Gerung',
  'Lembar',
] as const;

export type LombokLocation = typeof LOMBOK_LOCATIONS[number];
