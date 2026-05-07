# RumahYa — Refonte Design v2

**Aucun fichier de votre site existant n'a été modifié.** Cette refonte vit dans son propre dossier (`Rumaaaa-redesign-v2/`) à côté du site actuel.

---

## Comment voir le résultat

Tout est en HTML/CSS/JS pur, **rien à installer**. Double-clique simplement sur :

| Fichier | Ce qu'il contient |
|---------|-------------------|
| **`compare.html`** | 👉 **Le point d'entrée recommandé.** Vue d'ensemble + bouton "côte à côte" pour comparer avec le site actuel |
| `index.html` | La nouvelle landing page complète (hero, paths, propriétés, why, process, témoignages, map, FAQ, contact, footer) |
| `rentals.html` | Le catalogue rentals revu (filtres, cartes, tri, chips actifs) |
| `AMELIORATIONS.md` | La liste des suggestions optionnelles à parcourir tranquillement |

> Pour la comparaison côte-à-côte avec votre site actuel : lance `npm run dev` dans le dossier `Rumaaaa/` (le projet Next.js), puis ouvre `compare.html` et clique "Côte à côte".

---

## Ce qui a changé

### Direction artistique
- **Typographie** Fraunces (serif éditorial moderne, type Apple Vision / Aimé Leon Dore) + Inter (sans-serif fonctionnel).
- **Palette** terre-volcanique cohérente avec Lombok : terracotta `#c97b50`, sauge `#7a9580`, océan `#2a5961`, papier `#f5f1ea` — au lieu du noir/gris neutre actuel.
- **Texture papier** subtile via SVG noise (~1 KB) pour casser le côté plat-écran.
- **Italique accentué** sur les mots-clés des titres (`Lombok`, `welcome you`, `do property`) — signature visuelle reconnaissable.

### Hero
- Headline éditorial massif (clamp 2.6→5.8 rem) avec accent italique terracotta.
- Collage photo trois plans avec rotations légères + parallaxe à la souris.
- Badge flottant "Legally verified" en glassmorphism.
- Stats animées au scroll (counter qui monte de 0 à la valeur cible).
- Indicateur de scroll subtil en bas.

### Sections
1. **Hero** — collage immersif + CTA + stats animées
2. **Trust strip** — liste des nationalités servies
3. **Two paths** — cartes immersives full-bleed (Live / Invest) avec hover zoom et pills features
4. **Featured properties** — grid 3 cartes éditoriales avec verified badge
5. **Why us** — split éditorial (4 raisons + photo + témoignage flottant)
6. **Process** — bloc sombre arrondi avec gradient mesh, 4 étapes timeline
7. **Testimonials** — marquee infini auto-scroll, pause au hover
8. **Map** — illustration SVG de Lombok + pins animés + liste des zones
9. **FAQ** — accordéon natif `<details>` avec icône + animation
10. **Contact** — split formulaire + carte sombre WhatsApp/Email/Office
11. **Footer** — 4 colonnes + signature géante en outline + copyright

### Interactions
- Mode sombre persistant (respecte `prefers-color-scheme`).
- Scroll reveals avec `IntersectionObserver` (perf-friendly).
- Compteurs animés.
- Parallaxe souris sur le hero.
- Marquee de témoignages avec pause au hover.
- Mobile menu fluide.
- Header sticky avec backdrop-filter au scroll.
- Toutes les transitions respectent `prefers-reduced-motion`.

### SEO & performance
- Metadata étendu (title, description, keywords, robots).
- **OpenGraph** + **Twitter Card** complets.
- **JSON-LD** structuré (`RealEstateAgent`).
- Preconnect / dns-prefetch sur fonts et CDN.
- Preload de la police critique.
- `loading="lazy"` + `decoding="async"` sur toutes les images sauf hero.
- `font-display: swap` pour éviter le FOIT.
- HTML sémantique (`<header>`, `<nav>`, `<section>`, `<article>`, `<footer>`).
- ARIA labels sur tous les boutons icôniques.
- Aucune dépendance externe au-delà des fonts Google → JS total < 5 KB.

### Accessibilité
- Contraste AA / AAA partout vérifié (palette non-décorative).
- Focus visible sur tous les éléments interactifs (héritage navigateur respecté).
- Tailles de police minimales 13.5px pour les labels secondaires.
- `prefers-reduced-motion` désactive parallax, marquee et reveals.
- Hiérarchie de titres correcte (un seul `h1` par page).

---

## Étapes suivantes proposées

1. **Tu regardes `compare.html`** et tu valides la direction artistique générale (palette, typo, ambiance).
2. **Si OK :** je porte tout ça dans ton vrai projet Next.js — composants `Header`, `Footer`, `HeroEditorial`, `PropertyCard`, etc., en gardant ta logique Supabase intacte.
3. **Tu coches dans `AMELIORATIONS.md`** ce qui t'intéresse en bonus, et on les fait par phases.

Pour toute remarque sur le design (couleurs trop chaudes, image trop dominante, italique trop voyant…) on ajuste en quelques minutes — la refonte est conçue avec des CSS variables propres pour que les changements globaux soient triviaux.
