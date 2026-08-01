/**
 * Location landing pages content — data-driven, 4 locales.
 * Each zone targets a specific search intent:
 *   "buy land in {zone} Lombok", "{zone} real estate investment", etc.
 * Slugs are stable, English, lowercased.
 */
export type Locale = 'en' | 'fr' | 'es' | 'id';

export type ZoneContent = {
  slug: string;
  /** Localised name shown in <h1> and title. */
  name: Record<Locale, string>;
  /** Short tagline under the H1. */
  tagline: Record<Locale, string>;
  /** 2-3 sentence intro paragraph. */
  intro: Record<Locale, string>;
  /** Why-invest bullets. */
  bullets: Record<Locale, string[]>;
  /** Closing CTA paragraph. */
  cta: Record<Locale, string>;
  /** SEO */
  metaTitle: Record<Locale, string>;
  metaDescription: Record<Locale, string>;
  /** schema.org Place name + geo hint (kept generic; refine if you have coords). */
  schemaName: Record<Locale, string>;
};

export const ZONES: ZoneContent[] = [
  {
    slug: 'kuta-mandalika',
    name: {
      en: 'Kuta & Mandalika',
      fr: 'Kuta et Mandalika',
      es: 'Kuta y Mandalika',
      id: 'Kuta & Mandalika',
    },
    tagline: {
      en: "Lombok's MotoGP growth engine",
      fr: "Le moteur de croissance MotoGP de Lombok",
      es: "El motor de crecimiento MotoGP de Lombok",
      id: "Mesin pertumbuhan MotoGP Lombok",
    },
    intro: {
      en: 'Kuta is the epicentre of Lombok’s tourism boom. With the Mandalika International Circuit hosting MotoGP, a new international airport 20 minutes away, and resort developments accelerating, land values here have appreciated faster than anywhere else on the island. RumahYa offers curated plots — from 10-are hillside splits behind the circuit to 110-are blocks a four-minute drive from the beach — each with verified road access, title check, and notary-ready paperwork.',
      fr: "Kuta est l'épicentre de l'explosion touristique de Lombok. Avec le circuit international de Mandalika accueillant la MotoGP, un nouvel aéroport international à 20 minutes et des complexes hôteliers qui s'accélèrent, les valeurs foncières ont apprécié plus vite qu'ailleurs sur l'île. RumahYa propose des parcelles sélectionnées — des splits de 10 are en coteau derrière le circuit à des blocs de 110 are à quatre minutes de la plage — chacune avec accès route vérifié, titre vérifié et papiers notariés prêts.",
      es: 'Kuta es el epicentro del auge turístico de Lombok. Con el circuito internacional de Mandalika recibiendo MotoGP, un nuevo aeropuerto internacional a 20 minutos y desarrollos turísticos acelerándose, los valores de la tierra han subido más rápido que en cualquier otro lugar de la isla. RumahYa ofrece parcelas seleccionadas — desde splits de 10 are en ladera detrás del circuito hasta bloques de 110 are a cuatro minutos de la playa — cada una con acceso por carretera verificado, título verificado y papeles notariales listos.',
      id: 'Kuta adalah episentrum ledakan pariwisata Lombok. Dengan sirkuit internasional Mandalika yang menggelar MotoGP, bandara internasional baru 20 menit jauhnya, dan pengembangan resort yang berkembang pesat, nilai tanah di sini naik lebih cepat daripada di tempat lain di pulau ini. RumahYa menawarkan petak terpilih — dari split bukit 10 are di belakang sirkuit hingga blok 110 are empat menit dari pantai — masing-masing dengan akses jalan terverifikasi, hak terverifikasi, dan dokumen notaris siap.',
    },
    bullets: {
      en: [
        'Minutes from the Mandalika MotoGP circuit and new international airport',
        'Fastest-appreciating land on Lombok',
        'Freehold (PT PMA) or leasehold — both compliant',
        'Every plot title-checked before you see it',
      ],
      fr: [
        'À quelques minutes du circuit MotoGP de Mandalika et du nouvel aéroport international',
        'Terre à plus forte appreciation de Lombok',
        'Freehold (PT PMA) ou leasehold — les deux conformes',
        'Chaque parcelle vérifiée sur le titre avant de vous parvenir',
      ],
      es: [
        'A minutos del circuito MotoGP de Mandalika y del nuevo aeropuerto internacional',
        'La tierra de más rápida apreciación en Lombok',
        'Freehold (PT PMA) o leasehold — ambos conformes',
        'Cada parcela verificada en el título antes de llegar a ti',
      ],
      id: [
        'Beberapa menit dari sirkuit MotoGP Mandalika dan bandara internasional baru',
        'Tanah dengan apresiasi tercepat di Lombok',
        'Freehold (PT PMA) atau leasehold — keduanya sesuai',
        'Setiap petak diverifikasi haknya sebelum sampai kepada Anda',
      ],
    },
    cta: {
      en: 'Browse current Kuta & Mandalika land opportunities, or talk to our Lombok team — no obligation.',
      fr: "Parcourez les opportunités de terrains actuelles à Kuta & Mandalika, ou parlez à notre équipe de Lombok — sans engagement.",
      es: 'Explore las oportunidades de terrenos actuales en Kuta y Mandalika, o hable con nuestro equipo de Lombok — sin compromiso.',
      id: 'Jelajahi peluang tanah Kuta & Mandalika saat ini, atau bicara dengan tim Lombok kami — tanpa kewajiban.',
    },
    metaTitle: {
      en: 'Land for sale in Kuta Mandalika, Lombok — Verified plots for foreign investors',
      fr: "Terrains à vendre à Kuta Mandalika, Lombok — Parcelles vérifiées pour investisseurs étrangers",
      es: 'Terrenos en venta en Kuta Mandalika, Lombok — Parcelas verificadas para inversores extranjeros',
      id: 'Tanah dijual di Kuta Mandalika, Lombok — Petak terverifikasi untuk investor asing',
    },
    metaDescription: {
      en: 'Freehold and leasehold land minutes from the Mandalika MotoGP circuit. Title-checked by our Lombok team. Invest in Lombok’s fastest-growing hub.',
      fr: "Terrains en freehold et leasehold à quelques minutes du circuit MotoGP de Mandalika. Titre vérifié par notre équipe de Lombok. Investissez dans le pôle à plus forte croissance de Lombok.",
      es: 'Terrenos freehold y leasehold a minutos del circuito MotoGP de Mandalika. Título verificado por nuestro equipo de Lombok. Invierte en el polo de mayor crecimiento de Lombok.',
      id: 'Tanah freehold dan leasehold beberapa menit dari sirkuit MotoGP Mandalika. Hak terverifikasi oleh tim Lombok kami. Investasikan di pusat pertumbuhan tercepat Lombok.',
    },
    schemaName: {
      en: 'Kuta, Mandalika, Lombok',
      fr: 'Kuta, Mandalika, Lombok',
      es: 'Kuta, Mandalika, Lombok',
      id: 'Kuta, Mandalika, Lombok',
    },
  },
  {
    slug: 'selong-belanak',
    name: {
      en: 'Selong Belanak',
      fr: 'Selong Belanak',
      es: 'Selong Belanak',
      id: 'Selong Belanak',
    },
    tagline: {
      en: 'The affordable gateway to Lombok’s south coast',
      fr: "La porte d'entrée abordable de la côte sud de Lombok",
      es: 'La puerta de entrada asequible a la costa sur de Lombok',
      id: 'Gerbang terjangkau ke pantai selatan Lombok',
    },
    intro: {
      en: 'Selong Belanak pairs a protected surf bay with rolling green hills — exactly the profile early Bali investors wish they’d bought a decade ago. Plots here start from 25 M IDR/are with sea views, a fraction of comparable Bali coastline. Our “Affordable Sea View Land in Tampah Hills” (200 are) and “A piece of paradise” (33 are, full utilities) are prime entry points for diversification-minded buyers. Every title is checked before it reaches you.',
      fr: "Selong Belanak allie une baie de surf protégée à des collines vertes ondulantes — exactement le profil que les investisseurs de Bali auraient aimé acheter il y a dix ans. Les parcelles commencent à 25 M IDR/are avec vue mer, une fraction du littoral balinais comparable. Nos « Affordable Sea View Land in Tampah Hills » (200 are) et « A piece of paradise » (33 are, tous services) sont des points d'entrée idéaux pour les acheteurs soucieux de diversification. Chaque titre est vérifié avant de vous parvenir.",
      es: 'Selong Belanak combina una bahía de surf protegida con colinas verdes onduladas — exactamente el perfil que los inversores de Bali desearían haber comprado hace una década. Los lotes aquí empiezan en 25 M IDR/are con vistas al mar, una fracción del litoral comparable de Bali. Nuestra “Affordable Sea View Land in Tampah Hills” (200 are) y “A piece of paradise” (33 are, servicios completos) son puntos de entrada ideales para compradores orientados a la diversificación. Cada título se verifica antes de llegar a ti.',
      id: 'Selong Belanak memadukan teluk surf terlindungi dengan bukit hijau berbukit — persis profil yang diinginkan investor Bali jika mereka membeli satu dekade lalu. Petak di sini mulai dari 25 M IDR/are dengan pemandangan laut, sebagian kecil dari pantai Bali yang sebanding. "Affordable Sea View Land in Tampah Hills" (200 are) dan "A piece of paradise" (33 are, utilitas lengkap) kami adalah titik masuk utama bagi pembeli yang ingin diversifikasi. Setiap hak diverifikasi sebelum sampai kepada Anda.',
    },
    bullets: {
      en: [
        'Protected surf bay + hillside sea-view plots',
        'Entry from 25 M IDR/are (~$1,400) — a fraction of Bali',
        'Freehold (PT PMA) or leasehold',
        'Title-checked, foreigner-ready structures',
      ],
      fr: [
        'Baie de surf protégée + parcelles en coteau vue mer',
        'Entrée dès 25 M IDR/are (~1 400 $) — une fraction de Bali',
        'Freehold (PT PMA) ou leasehold',
        'Titre vérifié, structures prêtes pour étrangers',
      ],
      es: [
        'Bahía de surf protegida + parcelas en ladera con vista al mar',
        'Entrada desde 25 M IDR/are (~$1.400) — una fracción de Bali',
        'Freehold (PT PMA) o leasehold',
        'Título verificado, estructuras listas para extranjeros',
      ],
      id: [
        'Teluk surf terlindungi + petak bukit pemandangan laut',
        'Mulai 25 M IDR/are (~$1.400) — sebagian kecil dari Bali',
        'Freehold (PT PMA) atau leasehold',
        'Hak terverifikasi, struktur siap untuk asing',
      ],
    },
    cta: {
      en: 'Browse current Selong Belanak land opportunities, or talk to our Lombok team — no obligation.',
      fr: "Parcourez les opportunités de terrains actuelles à Selong Belanak, ou parlez à notre équipe de Lombok — sans engagement.",
      es: 'Explore las oportunidades de terrenos actuales en Selong Belanak, o hable con nuestro equipo de Lombok — sin compromiso.',
      id: 'Jelajahi peluang tanah Selong Belanak saat ini, atau bicara dengan tim Lombok kami — tanpa kewajiban.',
    },
    metaTitle: {
      en: 'Selong Belanak land investment — Affordable sea-view plots, Lombok',
      fr: "Investissement terrains Selong Belanak — Parcelles vue mer abordables, Lombok",
      es: 'Inversión en terrenos Selong Belanak — Parcelas con vista al mar asequibles, Lombok',
      id: 'Investasi tanah Selong Belanak — Petak pemandangan laut terjangkau, Lombok',
    },
    metaDescription: {
      en: 'Own affordable beachfront and hillside land in Selong Belanak, Lombok’s surf-and-slow-life destination. Verified titles, foreigner-ready structures.',
      fr: "Possédez des terrains abordables en front de mer et en coteau à Selong Belanak, destination surf et vie lente de Lombok. Titres vérifiés, structures prêtes pour étrangers.",
      es: 'Sea dueño de tierra asequible frente a la playa y en ladera en Selong Belanak, el destino de surf y vida tranquila de Lombok. Títulos verificados, estructuras listas para extranjeros.',
      id: 'Miliki tanah tepi pantai dan bukit terjangkau di Selong Belanak, destinasi surf dan kehidupan tenang Lombok. Hak terverifikasi, struktur siap untuk asing.',
    },
    schemaName: {
      en: 'Selong Belanak, Lombok',
      fr: 'Selong Belanak, Lombok',
      es: 'Selong Belanak, Lombok',
      id: 'Selong Belanak, Lombok',
    },
  },
  {
    slug: 'mawun',
    name: {
      en: 'Mawun',
      fr: 'Mawun',
      es: 'Mawun',
      id: 'Mawun',
    },
    tagline: {
      en: '22 hectares of diversification-grade land',
      fr: '22 hectares de terre de qualité diversification',
      es: '22 hectáreas de tierra de grado diversificación',
      id: '22 hektar tanah grade diversifikasi',
    },
    intro: {
      en: 'Mawun offers something scarce in South Lombok: scale. Our 22-hectare parcel splits into 7 titled plots with road access and bay views — ideal for a fund, a villa cluster, or staged resale. At ~$2,809/are, it is the largest single opportunity on our books and the clearest play on Lombok’s long-term capital appreciation. We handle the PT PMA or leasehold structure end-to-end.',
      fr: "Mawun offre ce qui est rare dans le sud de Lombok : l'échelle. Notre parcelle de 22 hectares se divise en 7 lots titrés avec accès route et vue sur la baie — idéale pour un fonds, un cluster de villas ou une revente par étapes. À ~2 809 $/are, c'est la plus grande opportunité unique de notre catalogue et le pari le plus clair sur l'appréciation à long terme de Lombok. Nous gérons la structure PT PMA ou leasehold de bout en bout.",
      es: 'Mawun ofrece algo escaso en el sur de Lombok: escala. Nuestra parcela de 22 hectáreas se divide en 7 lotes titulados con acceso por carretera y vistas a la bahía — ideal para un fondo, un clúster de villas o una reventa por etapas. A ~$2.809/are, es la mayor oportunidad individual de nuestro catálogo y la apuesta más clara por la apreciación de capital a largo plazo de Lombok. Manejamos la estructura PT PMA o leasehold de principio a fin.',
      id: 'Mawun menawarkan sesuatu yang langka di Lombok Selatan: skala. Petak 22 hektar kami terbagi menjadi 7 petak bertitel dengan akses jalan dan pemandangan teluk — ideal untuk dana, klaster villa, atau penjualan bertahap. Pada ~$2.809/are, ini adalah peluang tunggal terbesar di buku kami dan taruhan paling jelas pada apresiasi modal jangka panjang Lombok. Kami menangani struktur PT PMA atau leasehold dari ujung ke ujung.',
    },
    bullets: {
      en: [
        '22-hectare parcel, sub-dividable into 7 titled plots',
        'Bay views, road access, development-ready',
        'Largest single opportunity on RumahYa',
        'PT PMA or leasehold — handled end-to-end',
      ],
      fr: [
        'Parcelle de 22 hectares, subdivisable en 7 lots titrés',
        'Vue baie, accès route, prête au développement',
        'Plus grande opportunité unique de RumahYa',
        'PT PMA ou leasehold — géré de bout en bout',
      ],
      es: [
        'Parcela de 22 hectáreas, subdivisible en 7 lotes titulados',
        'Vistas a la bahía, acceso por carretera, lista para desarrollo',
        'La mayor oportunidad individual en RumahYa',
        'PT PMA o leasehold — gestionado de principio a fin',
      ],
      id: [
        'Petak 22 hektar, dapat dibagi menjadi 7 petak bertitel',
        'Pemandangan teluk, akses jalan, siap kembang',
        'Peluang tunggal terbesar di RumahYa',
        'PT PMA atau leasehold — ditangani ujung ke ujung',
      ],
    },
    cta: {
      en: 'Browse current Mawun land opportunities, or talk to our Lombok team — no obligation.',
      fr: "Parcourez les opportunités de terrains actuelles à Mawun, ou parlez à notre équipe de Lombok — sans engagement.",
      es: 'Explore las oportunidades de terrenos actuales en Mawun, o hable con nuestro equipo de Lombok — sin compromiso.',
      id: 'Jelajahi peluang tanah Mawun saat ini, atau bicara dengan tim Lombok kami — tanpa kewajiban.',
    },
    metaTitle: {
      en: 'Mawun Lombok land — 22 hectares of exceptional hillside with sea view',
      fr: 'Terrain à Mawun Lombok — 22 hectares de coteau exceptionnel avec vue mer',
      es: 'Terreno en Mawun Lombok — 22 hectáreas de ladera excepcional con vista al mar',
      id: 'Tanah Mawun Lombok — 22 hektar bukit luar biasa dengan pemandangan laut',
    },
    metaDescription: {
      en: 'Rare 22-hectare (7-plot) land parcel in Mawun, Lombok. Sub-dividable investment with ocean views. Verified, foreigner-structured.',
      fr: "Rare parcelle de 22 hectares (7 lots) à Mawun, Lombok. Investissement subdivisable avec vue océan. Vérifié, structuré pour étrangers.",
      es: 'Rara parcela de 22 hectáreas (7 lotes) en Mawun, Lombok. Inversión subdivisible con vistas al océano. Verificada, estructurada para extranjeros.',
      id: 'Petak tanah langka 22 hektar (7 plot) di Mawun, Lombok. Investasi yang dapat dibagi dengan pemandangan laut. Terverifikasi, struktur asing.',
    },
    schemaName: {
      en: 'Mawun, Lombok',
      fr: 'Mawun, Lombok',
      es: 'Mawun, Lombok',
      id: 'Mawun, Lombok',
    },
  },
  {
    slug: 'are-guling',
    name: {
      en: 'Are Guling',
      fr: 'Are Guling',
      es: 'Are Guling',
      id: 'Are Guling',
    },
    tagline: {
      en: 'Quiet value between Kuta and the bay',
      fr: 'Valeur tranquille entre Kuta et la baie',
      es: 'Valor tranquilo entre Kuta y la bahía',
      id: 'Nilai tenang antara Kuta dan teluk',
    },
    intro: {
      en: 'Are Guling is the insider’s pick: close enough to Mandalika to benefit from the boom, far enough to keep entry prices sane. Our “Areguling Valley & Ocean View Land” (60 are, road + sea view) and “Exceptional view of Are Guling bay” (49 are, full utilities) suit buyers wanting a private villa site or a measured land-banking position.',
      fr: "Are Guling est le choix des initiés : assez proche de Mandalika pour profiter du boom, assez loin pour garder des prix d'entrée raisonnables. Nos « Areguling Valley & Ocean View Land » (60 are, route + vue mer) et « Exceptional view of Are Guling bay » (49 are, tous services) conviennent aux acheteurs voulant un terrain de villa privée ou une position de land banking mesurée.",
      es: 'Are Guling es la elección de los expertos: lo suficientemente cerca de Mandalika para beneficiarse del auge, lo suficientemente lejos para mantener precios de entrada razonables. Nuestra “Areguling Valley & Ocean View Land” (60 are, carretera + vista al mar) y “Exceptional view of Are Guling bay” (49 are, servicios completos) convienen a compradores que buscan un sitio de villa privada o una posición de acaparamiento de tierra medida.',
      id: 'Are Guling adalah pilihan orang dalam: cukup dekat dengan Mandalika untuk menikmati boom, cukup jauh untuk menjaga harga masuk wajar. "Areguling Valley & Ocean View Land" (60 are, jalan + pemandangan laut) dan "Exceptional view of Are Guling bay" (49 are, utilitas lengkap) kami cocok untuk pembeli yang menginginkan situs villa pribadi atau posisi land banking terukur.',
    },
    bullets: {
      en: [
        'Close to Mandalika, lower entry prices than Kuta',
        'Valley + ocean-view plots with road access',
        'Freehold (PT PMA) or leasehold',
        'Title-checked, foreigner-ready',
      ],
      fr: [
        'Proche de Mandalika, prix d’entrée plus bas que Kuta',
        'Parcelles vue vallée + mer avec accès route',
        'Freehold (PT PMA) ou leasehold',
        'Titre vérifié, prêt pour étrangers',
      ],
      es: [
        'Cerca de Mandalika, precios de entrada más bajos que Kuta',
        'Parcelas con vista a valle y mar, acceso por carretera',
        'Freehold (PT PMA) o leasehold',
        'Título verificado, listo para extranjeros',
      ],
      id: [
        'Dekat Mandalika, harga masuk lebih rendah dari Kuta',
        'Petak pemandangan lembah + laut dengan akses jalan',
        'Freehold (PT PMA) atau leasehold',
        'Hak terverifikasi, siap untuk asing',
      ],
    },
    cta: {
      en: 'Browse current Are Guling land opportunities, or talk to our Lombok team — no obligation.',
      fr: "Parcourez les opportunités de terrains actuelles à Are Guling, ou parlez à notre équipe de Lombok — sans engagement.",
      es: 'Explore las oportunidades de terrenos actuales en Are Guling, o hable con nuestro equipo de Lombok — sin compromiso.',
      id: 'Jelajahi peluang tanah Are Guling saat ini, atau bicara dengan tim Lombok kami — tanpa kewajiban.',
    },
    metaTitle: {
      en: 'Are Guling land for sale, Lombok — Valley & ocean-view plots',
      fr: 'Terrain à Are Guling à vendre, Lombok — Parcelles vue vallée et mer',
      es: 'Terrenos en venta en Are Guling, Lombok — Parcelas con vista a valle y mar',
      id: 'Tanah Are Guling dijual, Lombok — Petak pemandangan lembah & laut',
    },
    metaDescription: {
      en: 'Quiet, titled land in Are Guling with valley and ocean views. Verified by RumahYa’s local team. Foreigner-ready.',
      fr: "Terrain titré et tranquille à Are Guling avec vue vallée et mer. Vérifié par l'équipe locale de RumahYa. Prêt pour étrangers.",
      es: 'Tierra tranquila y con título en Are Guling con vistas al valle y al mar. Verificada por el equipo local de RumahYa. Lista para extranjeros.',
      id: 'Tanah tenang bertitel di Are Guling dengan pemandangan lembah dan laut. Terverifikasi oleh tim lokal RumahYa. Siap untuk asing.',
    },
    schemaName: {
      en: 'Are Guling, Lombok',
      fr: 'Are Guling, Lombok',
      es: 'Are Guling, Lombok',
      id: 'Are Guling, Lombok',
    },
  },
  {
    slug: 'tampah-hills',
    name: {
      en: 'Tampah Hills',
      fr: 'Tampah Hills',
      es: 'Tampah Hills',
      id: 'Tampah Hills',
    },
    tagline: {
      en: 'Affordable sea-view land above Selong Belanak',
      fr: 'Terrain vue mer abordable au-dessus de Selong Belanak',
      es: 'Tierra con vista al mar asequible sobre Selong Belanak',
      id: 'Tanah pemandangan laut terjangkau di atas Selong Belanak',
    },
    intro: {
      en: 'Tampah Hills sits on the green ridges above Selong Belanak, pairing elevation, breezes, and uninterrupted ocean views at entry prices well below the beachfront. Our “Affordable Sea View Land in Tampah Hills” (200 are) is the standout — a large, titled block ideal for a villa estate, a boutique resort, or staged resale. Every title is checked before it reaches you.',
      fr: "Tampah Hills surplombe Selong Belanak depuis les crêtes vertes, alliant élévation, brises et vues océan ininterrompues à des prix d'entrée bien inférieurs au front de mer. Notre « Affordable Sea View Land in Tampah Hills » (200 are) est la perle — un grand bloc titré idéal pour un domaine villa, un resort boutique ou une revente par étapes. Chaque titre est vérifié avant de vous parvenir.",
      es: 'Tampah Hills se sitúa en las crestas verdes sobre Selong Belanak, combinando elevación, brisas y vistas al océano ininterrumpidas a precios de entrada muy por debajo del frente marítimo. Nuestra “Affordable Sea View Land in Tampah Hills” (200 are) es la joya — un gran bloque titulado ideal para una finca villa, un resort boutique o una reventa por etapas. Cada título se verifica antes de llegar a ti.',
      id: 'Tampah Hills berada di punggung bukit hijau di atas Selong Belanak, memadukan ketinggian, angin sepoi, dan pemandangan laut tanpa hambatan dengan harga masuk jauh di bawah tepi pantai. "Affordable Sea View Land in Tampah Hills" (200 are) kami adalah unggulan — blok bertitel besar ideal untuk estate villa, resort butik, atau penjualan bertahap. Setiap hak diverifikasi sebelum sampai kepada Anda.',
    },
    bullets: {
      en: [
        'Elevated ridges above Selong Belanak with ocean views',
        'Entry well below beachfront pricing',
        'Large 200-are titled block — estate or resort scale',
        'Freehold (PT PMA) or leasehold, title-checked',
      ],
      fr: [
        'Crêtes surélevées au-dessus de Selong Belanak avec vue mer',
        'Entrée bien inférieure au prix du front de mer',
        'Grand bloc titré de 200 are — échelle domaine ou resort',
        'Freehold (PT PMA) ou leasehold, titre vérifié',
      ],
      es: [
        'Crestas elevadas sobre Selong Belanak con vistas al océano',
        'Entrada muy por debajo del precio del frente marítimo',
        'Gran bloque titulado de 200 are — escala finca o resort',
        'Freehold (PT PMA) o leasehold, título verificado',
      ],
      id: [
        'Punggung bukit di atas Selong Belanak dengan pemandangan laut',
        'Harga masuk jauh di bawah harga tepi pantai',
        'Blok bertitel besar 200 are — skala estate atau resort',
        'Freehold (PT PMA) atau leasehold, hak terverifikasi',
      ],
    },
    cta: {
      en: 'Browse current Tampah Hills land opportunities, or talk to our Lombok team — no obligation.',
      fr: "Parcourez les opportunités de terrains actuelles à Tampah Hills, ou parlez à notre équipe de Lombok — sans engagement.",
      es: 'Explore las oportunidades de terrenos actuales en Tampah Hills, o hable con nuestro equipo de Lombok — sin compromiso.',
      id: 'Jelajahi peluang tanah Tampah Hills saat ini, atau bicara dengan tim Lombok kami — tanpa kewajiban.',
    },
    metaTitle: {
      en: 'Tampah Hills land for sale, Lombok — Affordable sea-view plots',
      fr: 'Terrain à Tampah Hills à vendre, Lombok — Parcelles vue mer abordables',
      es: 'Terrenos en venta en Tampah Hills, Lombok — Parcelas con vista al mar asequibles',
      id: 'Tanah Tampah Hills dijual, Lombok — Petak pemandangan laut terjangkau',
    },
    metaDescription: {
      en: 'Elevated, affordable sea-view land above Selong Belanak. Large titled blocks ideal for villa estates or boutique resorts. Verified, foreigner-ready.',
      fr: "Terrain vue mer abordable et surélevé au-dessus de Selong Belanak. Grands blocs titrés idéaux pour domaines villa ou resorts boutique. Vérifié, prêt pour étrangers.",
      es: 'Tierra con vista al mar elevada y asequible sobre Selong Belanak. Bloques titulados grandes ideales para fincas villa o resorts boutique. Verificada, lista para extranjeros.',
      id: 'Tanah pemandangan laut terjangkau dan berketinggian di atas Selong Belanak. Blok bertitel besar ideal untuk estate villa atau resort butik. Terverifikasi, siap untuk asing.',
    },
    schemaName: {
      en: 'Tampah Hills, Lombok',
      fr: 'Tampah Hills, Lombok',
      es: 'Tampah Hills, Lombok',
      id: 'Tampah Hills, Lombok',
    },
  },
];

export function getZone(slug: string): ZoneContent | undefined {
  return ZONES.find((z) => z.slug === slug);
}

/**
 * Flat list of location display names (English), used by the LocationInput
 * autocomplete component in the rentals/admin forms. Derived from ZONES so
 * the two stay in sync.
 */
export const LOMBOK_LOCATIONS: string[] = ZONES.map((z) => z.name.en);

