# Améliorations supplémentaires — RumahYa

Liste de pistes optionnelles, classées par impact attendu et effort. À toi de cocher celles qui t'intéressent, on les implémentera ensuite proprement dans la version Next.js.

---

## 1. Design & expérience utilisateur

### A — Quick wins (faible effort, fort impact)
- **Hero vidéo silencieuse en boucle** (drone Lombok, 5–8s, .webm + .mp4 fallback) à la place du collage photo : x10 sur l'effet "wow" sans coût de chargement si bien compressée (~800 Ko).
- **Galerie photo plein écran** au clic sur une carte rental/investment — overlay noir, navigation clavier, swipe mobile.
- **Carte interactive Leaflet/Mapbox** sur la page d'accueil et sur chaque fiche, avec les pins de toutes les propriétés disponibles.
- **Mode sombre persistant** (déjà présent dans la refonte) — conservé via `localStorage` avec respect de `prefers-color-scheme`.
- **Carrousel d'images dans les cartes** avec swipe mobile + lazy loading agressif.
- **Skeleton loaders** au lieu du spinner actuel (perception de vitesse +30%).
- **Progress bar de scroll** en haut de page sur les pages longues (fiches détaillées, blog).

### B — Plus ambitieux
- **Page propriété ultra-détaillée** : galerie type Airbnb/Booking, plan 2D ou 3D simplifié, graphique des prix dans la zone, calculateur de coût total (loyer + utilities + caution).
- **Filtre par carte** : carte qui se met à jour avec les pins selon les filtres actifs (UX type Airbnb).
- **Comparateur de propriétés** : sélectionner 2–3 biens et voir les caractéristiques côte à côte.
- **"Visites virtuelles 360°"** intégrées (Matterport ou Kuula) sur les biens phares.
- **Moodboards Pinterest-like** "Mon Lombok" : utilisateur sauvegarde des biens, on lui envoie un récap.
- **Chat in-app** (Crisp / Intercom / Tidio) en plus du WhatsApp, pour les visiteurs qui ne veulent pas donner leur numéro.
- **Curseur custom magnétique** sur les CTA principaux (effet Linear / Stripe).

---

## 2. Performance

### Critiques (à faire avant tout autre chose)
- **Conversion des images en WebP/AVIF** + `<img>` avec `srcset` et `sizes` — gain typique 40–70% sur les KB.
- **`next/image`** sur toutes les images Supabase avec un loader custom qui fait du resize côté CDN.
- **Préchargement de la police critique** (Fraunces ou autre) avec `<link rel="preload">` + `font-display: swap`.
- **Code splitting agressif** sur les composants admin (Supabase client, formulaires) — qu'ils ne soient jamais chargés côté visiteur.
- **Mise en cache HTTP forte** (`Cache-Control: public, max-age=31536000, immutable`) sur tous les assets statiques + fingerprints sur les noms de fichiers.
- **CDN images** : Cloudflare Images, Bunny.net ou Cloudinary devant Supabase — réduction du temps de premier rendu de 200–500 ms.

### Plus avancé
- **Server Components Next.js 16** pour les pages de listing (rentals, investments) — actuellement côté client, qui force un round-trip avant le rendu visible.
- **Streaming SSR** + `<Suspense>` pour afficher la coque immédiatement et le contenu au fur et à mesure.
- **Service Worker** (PWA) pour cacher les pages déjà visitées et les rendre offline-friendly.
- **HTTP/3 et compression Brotli** activés au niveau Vercel/host.
- **Preconnect/dns-prefetch** sur les domaines tiers (Supabase, fonts, images CDN).

### Cibles Lighthouse réalistes
- Performance ≥ 95 / Accessibility ≥ 95 / Best Practices ≥ 95 / SEO 100
- LCP < 2.0s, CLS < 0.05, INP < 200 ms

---

## 3. SEO

### Indispensables
- **Sitemap.xml** dynamique (Next.js : `app/sitemap.ts`) qui inclut toutes les fiches propriétés.
- **Robots.txt** propre, avec lien vers le sitemap.
- **Schema.org JSON-LD** pour chaque propriété (`@type: "Accommodation"` ou `"Residence"`) avec prix, adresse, équipements, note.
- **OpenGraph + Twitter Card** dynamiques par page (déjà commencé dans la refonte) — permet aux liens partagés sur WhatsApp/LinkedIn d'avoir une jolie preview.
- **Balises `hreflang`** si vous lancez l'anglais + français + indonésien.
- **URLs canoniques** (`<link rel="canonical">`) sur les pages de filtre pour éviter le contenu dupliqué.
- **Données structurées Breadcrumb** + `WebSite` + `Organization` + `LocalBusiness`.
- **Alt text descriptifs** sur toutes les photos (générables semi-automatiquement avec une IA Vision si inventaire trop grand).

### Bonus différenciant
- **Pages d'atterrissage SEO par zone** : `/villas-senggigi`, `/land-kuta-lombok`, `/investment-selong-belanak`. Chaque page = 600–1000 mots de contenu local + listings de la zone. Rapidement n°1 sur les requêtes longue traîne.
- **Blog éditorial** : "How to legally buy land in Lombok as a foreigner", "Cost of living in Senggigi 2026", "Lombok vs Bali for investment". Chaque article = 2 000–3 000 mots + photos. Le SEO de l'industrie immobilière insulaire est encore très peu défendu.
- **Backlinks ciblés** : guides expat (Internations, ExpatFR), forums (LombokExpats, /r/Lombok), partenariats avec notaires et écoles internationales.

---

## 4. Conversion / acquisition

- **Capture d'email douce** : "Recevez les 5 nouveaux biens du mois" — pas de spam, lettre mensuelle. Outil : Buttondown ou Beehiiv.
- **Funnel de pré-qualification** au lieu d'un simple formulaire : 3–4 questions courtes (budget, durée, zone, statut visa) → résultat personnalisé "Voici les 3 biens qui matchent + un appel découverte".
- **Calendly / Cal.com intégré** pour réserver un appel direct, en évitant les allers-retours par WhatsApp.
- **Témoignages vidéo** (1–2 min) en plus du texte — facteur de conversion x3 dans l'immobilier.
- **Section "Statistiques transparentes"** : nombre de biens visités, % de biens refusés pour raisons légales, délai moyen de signature, taux de satisfaction. Ça crédibilise instantanément.
- **A/B testing simple** sur les CTA (Vercel ou PostHog) — souvent +15–25% de conversion en testant juste le wording.

---

## 5. Multilingue

Le marché de Lombok est triple : francophone, anglophone, et indonésien (locaux + diaspora).

- **`next-intl`** ou **next-i18next** pour basculer FR / EN / ID.
- **Détection automatique** via `Accept-Language` mais avec un sélecteur visible dans le footer.
- **URLs traduites** : `/fr/locations-longue-duree`, `/en/long-term-rentals`, `/id/sewa-jangka-panjang` — bénéfice SEO énorme.
- **Contenu écrit pour chaque langue** (pas de traduction automatique, c'est trop visible pour de l'immobilier).

---

## 6. Backend & infrastructure

- **CMS léger pour les pages éditoriales** : Sanity, Contentful, ou Notion → Next via API. Permet d'éditer FAQ, blog, témoignages sans toucher au code.
- **Base de données — index optimisés** sur Supabase : `properties.location`, `properties.bedrooms`, `long_term_rentals.monthly_price_idr` doivent être indexés pour les filtres rapides.
- **Search full-text** (Algolia gratuit jusqu'à 10k requêtes ou Meilisearch self-hosted) pour permettre aux utilisateurs de chercher "villa pool senggigi 3 chambres" en langage libre.
- **Webhooks WhatsApp Business API** : recevoir et historiser les conversations directement, plus pro qu'un wa.me classique.
- **Backups quotidiens** Supabase + monitoring Sentry pour repérer les erreurs en prod.

---

## 7. Analytics & data

- **Plausible** ou **Umami** (RGPD-friendly, pas besoin de bandeau cookie) au lieu de Google Analytics.
- **Funnels de conversion** : on suit "Vue accueil → Vue propriété → Click WhatsApp" pour mesurer ce qui marche.
- **Heatmaps Hotjar / Microsoft Clarity** (gratuit) — permet de voir où les gens s'arrêtent, scrollent, abandonnent.
- **Tableau de bord interne** côté admin : "Top 10 propriétés vues cette semaine", "% de visiteurs qui contactent", "zones les plus recherchées" → aide à orienter le sourcing.

---

## 8. Trust & légal

- **Page "Notre processus de vérification légale"** détaillée — un atout différenciant énorme dans un marché où peu d'acteurs sont transparents.
- **Avis Google Business** et **avis Trustpilot** intégrés et affichés directement.
- **Politique RGPD** + page mentions légales propres (obligatoire si vous touchez l'UE).
- **Bandeau cookie** minimal (uniquement si vous utilisez des cookies non-essentiels — sinon Plausible permet de s'en passer).
- **HTTPS partout** + en-têtes de sécurité (CSP, HSTS, X-Frame-Options) configurés via Vercel ou Cloudflare.

---

## 9. Mobile / PWA

- **Manifeste PWA** : l'utilisateur peut "installer" RumahYa sur son téléphone comme une app.
- **Notifications push** (avec consentement) pour annoncer les nouveaux biens dans la zone qu'il suit.
- **Mode hors-ligne** : les biens consultés restent accessibles dans l'avion / en zone blanche.
- **Geolocalisation opt-in** : "Voir les biens autour de moi" depuis le mobile.

---

## 10. Roadmap suggérée

Si je devais hiérarchiser, voilà comment j'ordonnerais les chantiers :

| Phase | Chantier | Effort | Impact |
|-------|----------|--------|--------|
| **1 — Cette semaine** | Refonte design + SEO de base + WebP images | 1–2j | ⭐⭐⭐⭐⭐ |
| **2 — Quinzaine suivante** | Page propriété ultra-détaillée + sitemap dynamique + JSON-LD propriétés | 2–3j | ⭐⭐⭐⭐ |
| **3 — Mois suivant** | Multilingue FR/EN/ID + 5 pages SEO par zone | 3–5j | ⭐⭐⭐⭐ |
| **4 — Trimestre** | Carte interactive + filtres avancés + comparateur | 5–7j | ⭐⭐⭐ |
| **5 — Quand tout le reste tourne** | PWA + visites virtuelles + chat in-app + analytics avancés | 7–10j | ⭐⭐ |

---

**Dis-moi ce qui t'intéresse et on attaque.**
