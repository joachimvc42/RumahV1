# Journal d'audit SEO — RumahYa

> Audit & amélioration SEO technique hebdomadaire (dimanche 20h). Aucune modification du contenu visible : uniquement metadata, données structurées, hreflang, sitemap, robots, attributs alt, assets OG et indices de performance/indexation.

---

## 2026-07-05 — Audit hebdomadaire

### Vérifié
- `app/layout.tsx` (metadata racine, OG/Twitter, JSON-LD `@graph` RealEstateAgent + WebSite), `app/robots.ts`, `app/sitemap.ts`.
- `lib/detailMetadata.ts` (`investmentMetadata`, `rentalMetadata`).
- Toutes les pages `opportunities` et `map` (EN/FR/ES/ID), `app/investments/*` (legacy), pages FAQ EN/FR/ES, homepage EN/FR/ES.
- `lib/i18n.ts` et `middleware.ts` pour comprendre l'étendue exacte du routing multilingue.
- Attributs `alt` de tous les `<img>` (composants + pages) : rien à corriger, déjà conformes (alt descriptifs sur photos de biens, `alt=""` sur décoratif).
- Présence des assets référencés dans `/public` (og-image.jpg, `/noir/villa-1.jpg`, `/noir/villa-10.jpg`, `/noir/land-1.jpg`) : tous présents.
- JSON-LD (Organization/RealEstateAgent + WebSite dans le layout, FAQPage sur `/faq` EN/FR/ES, Accommodation/Offer dans `investment-detail-client.tsx` et `rental-detail-client.tsx`, partagé par toutes les locales y compris `/id`).

### Problèmes trouvés
1. **Nouvelle locale `/id` (Bahasa Indonesia) absente du sitemap (CRITIQUE)** — Un commit du 29/06 a ajouté une 4ᵉ locale scoping délibérément restreint (`/id/opportunities`, `/id/opportunities/[id]`, `/id/map` — home/about/FAQ/legal restent en anglais). Ces pages sont réellement en ligne et liées depuis le sélecteur de langue (EN/FR/ES/ID) sur tout le site, mais `app/sitemap.ts` ne générait aucune URL `/id/*` : Google n'avait aucun signal de découverte pour ces pages.
2. **hreflang incomplet sur les pages `opportunities` et `map` (EN/FR/ES) (CRITIQUE)** — Ces pages ne référençaient pas la variante `id` dans leur bloc `alternates.languages`, alors que les pages `/id/opportunities` et `/id/map` elles-mêmes déclarent bien un retour vers en/fr/es/x-default. Le graphe hreflang était donc asymétrique (id → en/fr/es présent, en/fr/es → id absent), ce qui empêche Google de relier correctement les variantes linguistiques.
3. `lib/detailMetadata.ts` (`investmentMetadata`) : déjà correct — inclut `id` dans `alternates.languages` depuis son ajout, aucune correction nécessaire.

### Correctifs appliqués
- **`app/sitemap.ts`** : ajout d'un bloc `idRoutes` dédié — `/id/opportunities`, `/id/map`, et une entrée `/id/opportunities/{id}` par investissement publié — sans toucher aux routes EN/FR/ES existantes. Pas d'entrées `/id/about`, `/id/faq`, etc. car ces pages n'existent pas (éviter d'annoncer des URL 404 à Google).
- **`app/opportunities/page.tsx`, `app/fr/opportunities/page.tsx`, `app/es/opportunities/page.tsx`** : ajout de `'id': 'https://rumahya.com/id/opportunities'` dans `alternates.languages`.
- **`app/map/page.tsx`, `app/fr/map/page.tsx`, `app/es/map/page.tsx`** : ajout de `'id': 'https://rumahya.com/id/map'` dans `alternates.languages`.
- Résultat : le graphe hreflang EN/FR/ES/ID est maintenant symétrique sur les deux familles de pages concernées, et les 2 + N pages `/id` sont désormais découvrables via le sitemap.

### À surveiller
- **Comparaison live impossible cette semaine** : le `web_fetch` du sandbox refuse toujours `https://rumahya.com` (hors provenance set). Audit mené entièrement sur le code source. Après déploiement, vérifier `/sitemap.xml` en ligne pour confirmer la présence des URL `/id/*`, et vérifier via la Search Console que Google découvre bien ces pages.
- **Sélecteur de langue vers `/id` depuis des pages non traduites** — Le composant `Header.tsx` (comportement/visible, hors périmètre de cet audit) propose le switch `ID` sur *toutes* les pages, y compris `/about`, `/faq`, home — qui n'ont pas d'équivalent `/id` et redirigeraient probablement vers une page manquante/anglaise. C'est un problème de comportement de composant, pas de metadata invisible : signalé ici pour décision de l'équipe produit, non corrigé (règle « jamais toucher au comportement visible »).
- Dette de routes en double `/investments` ↔ `/opportunities` toujours présente (cf. audit du 2026-06-14) — canonical consolidés vers `/opportunities`, redirection 301 éventuelle toujours à la décision de l'équipe.
- `sameAs` de l'Organization toujours vide.

---

## 2026-06-14 — Audit hebdomadaire

### Vérifié
- `app/layout.tsx` (metadata racine, OG/Twitter, JSON-LD `@graph` RealEstateAgent + WebSite), `app/robots.ts`, `app/sitemap.ts`.
- Cohérence des deux arbres de routes investissement : `/investments` **et** `/opportunities` (EN/FR/ES, listing + détail `[id]`), `lib/detailMetadata.ts`.
- Liens internes réels : nav (`components/Header.tsx`) et cartes de listing (`investments-client.tsx`).
- Pages FAQ EN/FR/ES (OpenGraph), pages d'accueil EN/FR/ES, listings.
- Attributs `alt` des `<img>` côté public (grep global). Présence de `public/og-image.jpg`.

### Problèmes trouvés
1. **Sitemap vs liens internes incohérents (CRITIQUE)** — `app/sitemap.ts` déclarait `/investments` et `/investments/{id}` (toutes locales), alors que toute la navigation et les cartes de listing pointent vers `/opportunities/...`, et que les pages `/opportunities` se canonicalisent sur elles-mêmes. Google recevait donc dans le sitemap des URL contredites par tous les autres signaux → contenu dupliqué + signaux de ranking dispersés.
2. **hreflang perdu sur les pages de détail PRIMAIRES (CRITIQUE)** — `/opportunities/[id]` (EN/FR/ES) faisait `{ ...investmentMetadata(), alternates: { canonical } }`, ce qui écrasait tout le bloc `alternates` et **supprimait les liens hreflang EN/FR/ES + x-default**. Les pages de détail réellement indexées n'avaient donc aucun hreflang.
3. **Doublon `/investments` ↔ `/opportunities`** — les deux arbres étaient indexables avec auto-canonical, en concurrence.
4. **OG image absente des pages FAQ** — `/faq`, `/fr/faq`, `/es/faq` redéfinissaient `openGraph` sans `images` ; Next.js n'hérite pas des images OG du layout parent quand un segment redéclare `openGraph` → partages sociaux de la FAQ sans visuel.

### Correctifs appliqués
- **`app/sitemap.ts`** : listing et détail réécrits de `/investments` → `/opportunities` (toutes locales), pour aligner le sitemap sur les liens internes et les canonical.
- **`lib/detailMetadata.ts`** (`investmentMetadata`) : `canonical` + bloc `languages` (hreflang) repointés sur `/opportunities/{id}`. Consolide automatiquement les détails `/investments/[id]` (qui consomment cette fonction) vers la route primaire.
- **`app/opportunities/[id]/page.tsx`** + variantes **`fr`** et **`es`** : suppression de l'override `alternates` qui ne contenait que `canonical` → ces pages héritent désormais du canonical **et** du hreflang complets de `investmentMetadata`. Restaure le hreflang sur les pages de détail primaires.
- **`app/investments/page.tsx`**, **`app/investments/layout.tsx`**, **`app/fr/investments/page.tsx`**, **`app/es/investments/page.tsx`** : `canonical` + `languages` + `og:url` repointés sur `/opportunities` → consolidation du doublon de listing vers la route primaire.
- **`app/faq/page.tsx`**, **`app/fr/faq/page.tsx`**, **`app/es/faq/page.tsx`** : ajout explicite de `openGraph.images` (og-image.jpg 1200×630, alt localisé) + `locale` sur la version EN.

### À surveiller
- **Comparaison live impossible cette semaine** : le `web_fetch` du sandbox est restreint au « provenance set » et a refusé `https://rumahya.com`. Audit mené sur le code (arbre de travail, plus à jour que le dernier déploiement). Re-vérifier le rendu en ligne après déploiement (notamment hreflang des pages `/opportunities/[id]` et OG des FAQ).
- **Dette de routes en double** : `/investments` et `/opportunities` coexistent. Les canonical consolident désormais vers `/opportunities`, mais à terme envisager une redirection 301 `/investments(/*) → /opportunities(/*)` (changement de comportement → hors périmètre de cet audit, à décider par l'équipe).
- Galeries de détail (`investment-detail-client.tsx`, `rental-detail-client.tsx`) : `alt=""` sur les vignettes et l'image lightbox (photos de biens). Laissé tel quel (vignettes interactives), mais un `alt` descriptif serait un léger plus.
- `sameAs` de l'Organization toujours vide : ajouter les profils sociaux quand ils existeront.
- Vérifier que tout asset OG référencé existe dans `/public` (og-image.jpg présent, OK).

---

## 2026-06-13 — Passage « Run now » (validation du workflow)

### Vérifié
- Pages FAQ multilingues (`app/faq`, `app/fr/faq`, `app/es/faq`) : metadata, hreflang, JSON-LD FAQPage.
- Traitement de la FAQ dans `app/sitemap.ts`.

### Problème trouvé
- **FAQ FR/ES absentes du sitemap + doublon (CRITIQUE)** — `app/sitemap.ts` codait `/faq` en dur dans la boucle des locales, générant `/faq` en plusieurs exemplaires identiques tout en n'incluant jamais `/fr/faq` ni `/es/faq`. Ces deux pages traduites n'étaient donc pas déclarées à Google.

### Correctif appliqué
- **`app/sitemap.ts`** : suppression de l'entrée `/faq` dupliquée dans la boucle ; `faqRoute` réécrit pour émettre une entrée par locale (`/faq`, `/fr/faq`, `/es/faq`), priorité 0.8 (EN) / 0.7 (FR-ES). Chaque URL FAQ apparaît maintenant exactement une fois.

---

## 2026-06-13 — Audit initial

### Vérifié
- `app/layout.tsx` : metadata racine, viewport, OpenGraph, Twitter, robots, hreflang, JSON-LD.
- `app/sitemap.ts` / `app/robots.ts` : couverture des routes, priorités, exclusions (/admin, /api, /rent).
- `lib/detailMetadata.ts` : metadata dynamiques des pages investissement/location (EN/FR/ES).
- `app/page.tsx`, pages `/fr` et `/es`, `app/faq/page.tsx` (JSON-LD FAQPage).
- Données structurées des pages de détail (`investment-detail-client.tsx` : Accommodation/Place + Offer).
- Attributs `alt` des `<img>` côté public.

### État général
Base SEO déjà solide : metadata complète et templatée, OpenGraph/Twitter, hreflang EN/FR/ES + x-default, JSON-LD Organization + FAQPage + détail, sitemap dynamique (Supabase) multilingue, robots correct. Les `alt=""` des images décoratives sont conformes (bonne pratique).

### Problèmes trouvés
1. **`/og-image.jpg` manquant (CRITIQUE)** — référencé dans la metadata racine, la page d'accueil, l'OpenGraph, la Twitter Card et le logo/image du JSON-LD, mais absent de `/public`. Confirmé en production : l'URL renvoie un fichier vide. → aperçus de partage social et rich results cassés.
2. JSON-LD Organization : pas d'email, pas d'entité `WebSite`, `addressRegion` absent.
3. `components/MapThumb.tsx` : `alt="Map"` peu descriptif.

### Correctifs appliqués
- **Créé `public/og-image.jpg`** (1200×630) : visuel brandé généré à partir d'une photo de villa du site, avec wordmark « RumahYa » et accroche. Corrige tous les aperçus sociaux et le logo JSON-LD.
- **`app/layout.tsx`** : JSON-LD restructuré en `@graph` avec entité `RealEstateAgent` (ajout `email`, `addressRegion: West Nusa Tenggara`, `knowsLanguage`, `@id`) + nouvelle entité `WebSite` reliée au publisher.
- **`components/MapThumb.tsx`** : `alt` rendu descriptif (« Map showing the property location in Lombok »).

### À surveiller
- Le mount sandbox (bash) renvoie des lectures tronquées et le dépôt a un bruit Git CRLF préexistant : vérifier les changements via l'API fichier (Read), pas via `tsc`/build en bash.
- Envisager un JSON-LD `BreadcrumbList` sur les pages de détail.
- `sameAs` de l'Organization est vide : ajouter les profils sociaux (Instagram/Facebook) quand ils existeront.
- Vérifier régulièrement que tout asset OG référencé existe bien dans `/public`.
