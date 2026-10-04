# Hai Luong — VFX Portfolio

Production source for Hai Luong’s VFX portfolio, built with React, TypeScript, Vite, GSAP and Lenis.

The approved portfolio is the homepage at `/`. Project pages use `/project/:id`. Previous `/concepts/motion-gallery` URLs redirect to the equivalent production pages.

## Local development

Requires Node.js 22.12 or later and npm.

```sh
npm ci
npm run dev
```

## Production checks

```sh
npm run typecheck
npm run lint
npm run build
npm run preview -- --port 5174
```

## Deployment

Publish the generated `dist` directory. For Vercel, use the Vite framework preset, `npm run build` as the build command and `dist` as the output directory. The included `vercel.json` supports direct project-page navigation with an SPA fallback.

A GitHub push publishes source code; a hosting integration must be configured separately to publish the website. GitHub Pages is not configured by this repository.

## Approved design and content

- Preserve the locked header wordmark and its typography, colours, proportions and dark backing. See `AGENTS.md` and `reports/logo-approved-before.png`.
- Keep the owner-supplied About portrait and original project-to-media associations.
- Use black backgrounds and upright sans-serif typography.
- Full Motion is the default; Reduced Motion remains available.
- Work Index provides three layouts, with Editions (B) selected initially.
- The three hero frames start with the approved images on every refresh, then fade between high-resolution frames from their own projects. Pause/Play, hover/focus, offscreen and background-tab handling are included.
- Individual project pages present the available original film first. Missing footage must be supplied by the owner, not replaced with unrelated footage.
- Breakdowns and SPICE fx — Studio Showreel 2026 remain separate from individual project credits.
- Navigation links directly to Work Index, Breakdowns, Showreel and About. The studio showreel appears before Selected Work.
- The archive contains 43 projects after removal of the duplicate WARRIOR MV entry. NMAX uses the owner-approved YouTube film and its thumbnail; additional full-HD frames remain associated with their original jobs.
- Project publication dates and archive years follow the linked YouTube/Vimeo upload dates, as confirmed by the owner. Work Index and adjacent-project navigation run newest first; original job titles are preserved even when they contain a different campaign year.
- Production credits use the owner's supplied personnel ranges, evaluated against the video publication month. Month boundaries are inclusive; the supplied Nhi Truong cutoff is interpreted as April 2026. These are owner-directed credits, not independently verified attendance records.
- Viet Nguyen is included from May 2021 through May 2024, excluded from June 2024 through August 2025, and included again from September 2025.
- Nguyen Viet Hoang is included from January 2021 through March 2023, correcting the previously supplied March 2022 cutoff.
- Tuan Binh is included in VFX Artists from August 2022 through April 2024, inclusive.

## Media maintenance

Original media associations are stored in `src/data/projects.ts` and `src/data/media-manifest.json`. Optimized images are committed in `public/media`; the production build does not need to download source images.

```sh
npm run media:sync
npm run media:prepare
node scripts/audit-image-quality.mjs
```
