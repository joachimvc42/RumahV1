# Journal d'audit SEO — RumahYa

> Audit & amélioration SEO technique hebdomadaire (dimanche 20h). Aucune modification du contenu visible : uniquement metadata, données structurées, hreflang, sitemap, robots, attributs alt, assets OG et indices de performance/indexation.

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
