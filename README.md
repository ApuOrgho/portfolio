# Apu Das — Portfolio

Personal portfolio of **Apu Das** (অপু দাস) — Associate Software Engineer at
Cefalo Bangladesh Ltd. and competitive programmer. Live at
[apuorgho.com](https://apuorgho.com). Competitive-programming standings live at
[cp-standings.apuorgho.com](https://cp-standings.apuorgho.com).

A dynamic, animated, multilingual rebuild of the original static site — modern
stack, 3D hero, light/dark theme, three languages, and a verified contact form.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** for styling and design tokens
- **Framer Motion** for scroll reveals, tilt cards, magnetic buttons and other
  micro-interactions
- **React Three Fiber / drei / three.js** for the animated 3D hero
- **next-themes** for light/dark mode (respects system preference)
- **next-intl** for i18n — English, বাংলা (Bangla) and Norsk (Norwegian), at
  `/en`, `/bn`, `/no`
- **Nodemailer** for a self-verifying contact form (see below)
- **Docker** (multi-stage build, non-root runtime) for containerized deploys;
  deployed on **Vercel** in production

## Project structure

```
src/
  app/[locale]/       Route segment per locale (layout, page, metadata)
  app/api/contact/     OTP request/verify route handlers (nodejs runtime)
  components/
    layout/            Navbar (scrollspy), Footer, theme + locale switchers
    three/              React Three Fiber hero scene
    ui/                 Reveal, TiltCard, Magnetic, AnimatedCounter,
                         ScrollProgress, SectionHeading, Container
    sections/           Hero, About, Experience, Skills, Projects,
                         CompetitiveProgramming, Awards, Contact
  data/                 Language-neutral content (profile, experience,
                         projects, skills, awards, contest history)
  i18n/                 next-intl routing/navigation/request config
  lib/                  mailer, OTP token signing, email templates, utils
messages/                en.json / bn.json / no.json translation catalogs
legacy-static-site/      Archived original HTML/CSS/JS site (reference only)
```

Translatable copy lives in `messages/*.json`; structured facts (dates, links,
tech lists, the full contest history) live in `src/data/*.ts` so they don't
have to be duplicated per language.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real SMTP values, see below
npm run dev       # http://localhost:3000
npm run build
npm run start
npm run lint
```

## Contact form: email-verified, not FormSubmit

The contact form no longer posts to a third party. It's a two-step, self-hosted
flow backed by `nodemailer`:

1. **`POST /api/contact/request-otp`** — validates the message, generates a
   6-digit code, emails it to the address the visitor typed, and returns a
   short-lived signed token (HMAC, `CONTACT_TOKEN_SECRET`) that encodes a hash
   of the code — never the code itself. No database or server session is
   needed, so this works fine on serverless/Vercel.
2. **`POST /api/contact/verify-otp`** — the visitor enters the code they
   received; the server re-derives the hash and compares it to the token. A
   match proves they actually control that inbox. On success, two emails go
   out: the message itself (to `CONTACT_TO_EMAIL`, with `replyTo` set to the
   visitor) and an auto-reply confirmation back to the visitor.

Required environment variables (see `.env.example`; add the same ones in
**Vercel → Project Settings → Environment Variables** for production):

| Variable | Purpose |
|---|---|
| `SMTP_HOST`, `SMTP_PORT` | SMTP relay (Gmail: `smtp.gmail.com`, `465`) |
| `EMAIL_USER`, `EMAIL_PASS` | SMTP auth (Gmail: an App Password, not your login password) |
| `EMAIL_SENDER_NAME` | Display name on the "From" header |
| `CONTACT_TO_EMAIL` | Where verified messages are forwarded |
| `CONTACT_TOKEN_SECRET` | Random secret that signs the OTP token — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

`.env.local` is git-ignored; only `.env.example` (no real secrets) is committed.

## Docker

```bash
docker compose up --build
# or
docker build -t apu-portfolio .
docker run -p 3000:3000 apu-portfolio
```

`next.config.ts` only sets `output: "standalone"` when `process.env.VERCEL` is
unset, so the same config produces the right build for both Docker (image
ships just the compiled server, `public/`, and `.next/static`) and Vercel
(which builds without the standalone output).

## Deployment

Production deploy target is **Vercel**, connected to
[github.com/ApuOrgho/portfolio](https://github.com/ApuOrgho/portfolio) — pushes
to `main` trigger a deploy. Vercel auto-detects the Next.js app; the only setup
step is adding the contact-form environment variables above in the project's
dashboard before the first deploy. `apuorgho.com`'s DNS should point at the
Vercel deployment.

## Content

- The original static site is preserved under `legacy-static-site/` for
  reference and is excluded from linting.
- Contest history in `src/data/contests.ts` mirrors the national contest
  profile; the Competitive Programming section links out to
  [cp-standings.apuorgho.com](https://cp-standings.apuorgho.com) for the full,
  live standings.
