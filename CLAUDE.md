# CLAUDE.md

Guidance for Claude Code when working in this repository.

@AGENTS.md

## What this is

Personal portfolio for **Zephaniah Raika**, a creative photographer and amateur videographer who also does design and fitness. It's a single-page site with a dark background, bright accent colors, big display type, and heavy motion. The visual reference is https://spector.framer.website/.

## Tech stack

- **Framework:** Next.js 16 (App Router, `app/` directory, Turbopack, `cacheComponents` on)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4. Theme tokens live in `@theme` in `app/globals.css`, and there is no `tailwind.config`.
- **Animation:** [Motion](https://motion.dev) (`motion/react`) for all animation, plus [Lenis](https://lenis.darkroom.engineering) (`lenis/react`) for smooth scrolling
- **Fonts (next/font/google):** Anton (display), Inter Tight (hero / header headings), Geist (body), Geist Mono (labels)
- **Package manager:** npm
- **Linting:** ESLint flat config (`eslint-config-next`)
- **Hosting:** Vercel

## Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server at http://localhost:3000
npm run build      # production build (also type-checks)
npm run start      # serve the production build
npm run lint       # run ESLint (next build no longer lints)
```

Run `npm run lint` and `npm run build` before committing.

## Project structure

```
app/
  layout.tsx          # fonts, <SmoothScroll>, custom <Cursor>
  page.tsx            # assembles the page sections in order
  blog/page.tsx       # blog index: Notion posts grouped by topic
  blog/[slug]/page.tsx# one post, rendered from Notion blocks
  fitness/page.tsx    # fitness hub: gym / sports / recovery lanes
  fitness/gym/page.tsx# the full gym plan
  globals.css         # theme tokens, grain overlay, outline text, Lenis CSS
components/
  preloader.tsx       # 0→100% intro; exports INTRO_DELAY used by hero/header
  site-header.tsx     # logo + hamburger → full-screen menu
  hero.tsx            # Spector-style: full-bleed photo + grid, name, discipline list, big statement
  velocity-marquee.tsx# marquee whose speed follows scroll velocity
  services.tsx        # Photography / Videography / Design rows
  work-gallery.tsx    # pinned horizontal-scroll gallery
  about.tsx           # scroll-lit paragraph, counters
  journal.tsx         # Finance / Blog / Fitness tilt cards (menu targets)
  contact-footer.tsx  # lime footer with CTA
  reveal.tsx          # Reveal, MaskText, SectionLabel helpers
  notion-content.tsx  # renders Notion blocks in the site's typography
  fitness-board.tsx   # lane selector whose items sweep in from the left
  smooth-scroll.tsx, cursor.tsx
lib/
  content.ts          # ALL site copy, links, images; edit text here
  notion.ts           # Notion API reads for the blog
public/images/        # hero.jpg (landscape bg), profile.jpg, work/*.jpg (placeholders; replace freely)
```

## Blog (Notion-backed)

- The header's **Blog** link goes to `/blog`, a real route — not a section anchor.
- Posts live in the **Blog** database in Notion. `lib/notion.ts` reads it over the
  official API using `NOTION_TOKEN` and `NOTION_BLOG_DATABASE_ID` (see `.env.example`).
  Database properties: Name, Slug, Topic, Summary, Status, Published, Cover.
  Only `Status = Published` rows appear on the site.
- Reads are wrapped in `"use cache"` with `cacheLife("hours")` and the `blog` cache
  tag, so new posts appear within the hour without a redeploy.
- With the env vars unset, every read returns `[]` and `/blog` renders its empty
  state, so the build never depends on Notion being reachable.
- Each Notion topic maps to a site accent through `accentForTopic` in `lib/content.ts`.
- Pages other than the home page render `<SiteHeader onHome={false} />` so section
  links navigate to `/#section` instead of trying to scroll.

## Fitness pages

- `/fitness` is the hub the menu's **Fitness** link opens. `/fitness/gym` is the one
  lane with a page of its own; the other lanes are panels on the hub.
- The pages share the site's dark hero, then switch to a **bright `bg-paper` /
  `text-ink` body** with rounded top and bottom corners. That inversion is the whole
  theme difference — it should still read as the same site, so keep the fonts,
  accents and mono labels exactly as they are elsewhere.
- On a light section, borders are `border-ink/15` and secondary text is `text-ink/65`
  (the dark-section `border-line` / `text-paper/70` are invisible there).
- `components/fitness-board.tsx` holds the lane selector. Lane items animate in from
  the left with Motion variants (`staggerChildren`), keyed by lane inside
  `<AnimatePresence mode="wait">`.
- Copy, lanes, items, principles, the weekly split and the whole gym plan live in
  `fitness` and `gym` in `lib/content.ts`. Adding an item there is all it takes.
- Accent classes can't be built by string interpolation (Tailwind won't see them), so
  variants like `hover:border-lime` are written out in a lookup map.

## Design system

- Background is near-black `ink` (#050505), and text is off-white `paper` (#f4f4ef).
- Accents are `lime` (#d4ff3a, primary), `orange` (#ff5a1f), `pink` (#ff3d9a) and `blue` (#3d7bff). Use them as Tailwind colors (`bg-lime`, `text-orange`, …), never as raw hex values in components.
- `coral` (#f94137) is the red accent used only on the hero (`components/hero.tsx`), to match the reference site's red headline. Don't spread it to other sections — they stay on lime.
- The hero background has an interactive wireframe grid (`components/interactive-grid.tsx`) that ripples away from the pointer and flashes a short word near it on fine-pointer devices. It's a plain `<canvas>` driven by `requestAnimationFrame`, not Motion, so it can redraw every frame without React re-renders. Edit the `WORDS` list there to change the prompts.
- Headlines use `font-display` in uppercase, sized in `vw` so they span the viewport. Labels use `font-mono text-[11px] tracking-widest uppercase`.
- Hero and header headings use `font-heading` (Inter Tight, semibold/bold, tight negative tracking).
- No Japanese or other non-English accent text; the owner asked for it to be removed.
- Use `.text-outline` (or `.text-outline-ink` on light backgrounds) for outlined display text.
- Custom cursor: put `data-cursor="Label"` on any element to show a labelled cursor bubble on hover.

## Code style

- Use TypeScript everywhere and avoid `any`. Prefer `type` over `interface`.
- Function components only. Use PascalCase for component names, kebab-case filenames, and named exports. Default exports only where Next.js requires them (`page.tsx`, `layout.tsx`).
- Default to Server Components. Add `"use client"` only for components that need state, effects, Motion, or Lenis.
- Keep copy and data in `lib/content.ts`, not hardcoded in components.
- Animate with Motion (`motion.*`, `useScroll`, `useTransform`, `whileInView`). Don't add GSAP or other animation libraries.
- Use the shared easing `[0.76, 0, 0.24, 1]` for big reveals and `[0.22, 1, 0.36, 1]` for softer fades.
- Scroll programmatically with `useLenis()` and `lenis.scrollTo(...)`, not `window.scrollTo`.
- Don't call `setState` synchronously inside `useEffect`, because the lint rule `react-hooks/set-state-in-effect` blocks it. Use `useSyncExternalStore` for browser values.
- `whileInView` never fires on an element that is fully clipped by an `overflow-hidden` parent, so observe the parent and drive the child with variants (see `MaskText`).
- Use Tailwind canonical classes (`z-100`, `aspect-4/5`, not `z-[100]`, `aspect-[4/5]`).
- Use `next/image` for every image. Images live in `public/images/`.
- Accessibility: use semantic HTML, `alt` text, `aria-*` on the menu toggle, and keyboard Escape to close the menu.
- Prettier-style formatting: 2-space indent, double quotes, semicolons, trailing commas.

## Git

- Make small, focused commits with imperative messages (e.g. "Add contact form").
- Never commit `.env*` files or secrets.
