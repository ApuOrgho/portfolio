# Apu Das — Portfolio

Personal portfolio of **Apu Das** (Apu Orgho) — Associate Software Engineer at
Cefalo Bangladesh Ltd. and competitive programmer. Live at
[apuorgho.com](https://apuorgho.com). Competitive-programming standings live at
[cp-standings.apuorgho.com](https://cp-standings.apuorgho.com).

A dynamic, animated, multilingual rebuild of the original static site — modern
stack, 3D hero, light/dark theme, and three languages.

## Stack

- **Next.js 16** (App Router, TypeScript, standalone output)
- **Tailwind CSS v4** for styling and design tokens
- **Framer Motion** for scroll reveals and micro-interactions
- **React Three Fiber / drei / three.js** for the animated 3D hero
- **next-themes** for light/dark mode (respects system preference)
- **next-intl** for i18n — English, বাংলা (Bangla) and Norsk (Norwegian), at
  `/en`, `/bn`, `/no`
- **Docker** (multi-stage build, non-root runtime) for containerized deploys

## Project structure

```
src/
  app/[locale]/       Route segment per locale (layout, page, metadata)
  components/
    layout/            Navbar, Footer, theme + locale switchers
    three/              React Three Fiber hero scene
    ui/                 Reveal, SectionHeading, Container primitives
    sections/           Hero, About, Experience, Skills, Projects,
                         CompetitiveProgramming, Awards, Contact
  data/                 Language-neutral content (profile, experience,
                         projects, skills, awards, contest history)
  i18n/                 next-intl routing/navigation/request config
  lib/                  cn() and date-formatting helpers
messages/                en.json / bn.json / no.json translation catalogs
legacy-static-site/      Archived original HTML/CSS/JS site (reference only)
```

Translatable copy lives in `messages/*.json`; structured facts (dates, links,
tech lists, the full contest history) live in `src/data/*.ts` so they don't
have to be duplicated per language.

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm run start
npm run lint
```

## Docker

```bash
docker compose up --build
# or
docker build -t apu-portfolio .
docker run -p 3000:3000 apu-portfolio
```

The image uses Next's `standalone` output, so the runtime container only
ships the compiled server, `public/`, and `.next/static` — no `node_modules`
or source.

> **Hosting note:** this app runs a Node server (SSR + locale middleware), so
> it needs a Node-capable host (a VPS/container platform, Railway, Render,
> Fly.io, etc.) — it can no longer be served as static files from GitHub
> Pages the way the previous version was. `apuorgho.com`'s DNS/CNAME will
> need to point at wherever this container ends up running.

## Content

- The original static site is preserved under `legacy-static-site/` for
  reference and is excluded from linting.
- Contest history in `src/data/contests.ts` mirrors the national contest
  profile; the Competitive Programming section links out to
  [cp-standings.apuorgho.com](https://cp-standings.apuorgho.com) for the full,
  live standings.
