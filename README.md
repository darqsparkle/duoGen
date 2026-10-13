# DuoGen Tech Solutions — website

Frontend-only marketing site for DuoGen Tech Solutions, built with Next.js (App Router),
React, TypeScript, Tailwind CSS v4, Motion, and Lucide icons.

## Run locally

```bash
npm install
npm run dev            # http://localhost:3000
npm run dev -- -p 3001 # or on another port
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Configuration

Copy `.env.example` to `.env.local` and fill in what you have. Contact details and social
links stay hidden on the site until their variable is set — nothing is invented.

## Deploy on Vercel

1. Import the GitHub repo in Vercel (framework is detected as Next.js).
2. Add environment variables (Project → Settings → Environment Variables):
   - `GEMINI_API_KEY` — your Google AI Studio key (powers Genie's AI answers)
   - `NEXT_PUBLIC_SITE_URL` — your live domain, e.g. `https://duogen.example`
   - optional: `GEMINI_MODELS`, `NEXT_PUBLIC_CONTACT_*`, `NEXT_PUBLIC_SOCIAL_*` (see `.env.example`)
3. Deploy. Changing a variable later requires a redeploy.

`vercel.json` pins functions to the Mumbai region (`bom1`), gives the Genie route up to
30 seconds (it may retry backup Gemini models), and adds basic security headers.

## Structure

```
src/app/                 routes: /, /what-we-do, /how-we-do, /contact, not-found, sitemap, robots, icon
src/components/
  navigation/            Navbar, MobileMenu, Logo (DG mark)
  home/                  homepage sections (Hero, Capabilities, IndustryShowcase, FloatingEcosystem, …)
  services/              What We Do sections, mockups, sticky category nav, solution finder
  process/               scroll-driven development timeline
  contact/               enquiry form + query-string prefill
  genie/                 Genie assistant widget + robot avatar
  animations/            Reveal, ScrollScene (inward–outward motion), ScrollDrift, ScrollProgress
  visuals/               SVG sculptures (hero tower, glossy forms, glow ring, device collage)
  ui/                    Button, MagneticButton, SectionHeading, Marquee, LightHero
src/lib/                 content (services, industries, process), constants, validation, enquiry service
src/lib/genie/           Genie's ready-made questions (knowledge.ts) and reply engine (engine.ts)
```

## Notes

- **Contact form is a demo.** Validation runs in the browser, and `src/lib/enquiry.ts` is the
  service boundary: it currently sends nothing and stores nothing. Replace its body with a Route Handler or
  Server Action call when a backend is ready.
- **Motion** only reads scroll position; it never pins sections or hijacks scrolling.
  `prefers-reduced-motion` stops decorative loops and shows all content immediately.
- Dashboards, leads, and prices in mockups are illustrative sample data.
- **Genie assistant** answers locally from `src/lib/genie/knowledge.ts` (ten featured questions,
  keyword matching for typed messages). Every reply goes through `askGenie()` in
  `src/lib/genie/engine.ts` — to plug in a full AI service, call it from there via a Route
  Handler (e.g. `/api/genie`) so API keys stay on the server. Chats are kept in memory only.
