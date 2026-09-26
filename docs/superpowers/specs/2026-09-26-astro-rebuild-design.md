# Renee Ross Books: Astro rebuild design

Date: 2026-09-26
Branch: `astro-rebuild`

## Purpose

Replace the five-year-old Gatsby 3 / Bootstrap / styled-components site with an Astro
site that keeps every piece of existing content and functionality, and gives the site a
refined gothic visual system worth building on for the next five years.

Success looks like: same URLs, same DatoCMS content, same Kit and Netlify Forms signup,
same GA4, same novella downloads; a design that reads as a modern gothic romance imprint;
WCAG 2.2 AA throughout; a clean build with no warnings.

## What stays

- Content in DatoCMS (books, blog posts, homepage text, author photo).
- Routes: `/`, `/about`, `/blog`, `/[slug]` (books and posts share the root namespace as
  today), `/success`, `/404`.
- Kit subscribe endpoint and Netlify Forms backup capture, honeypot included.
- GA4 measurement via env var, respecting Do Not Track.
- Novella download files in `public/`.
- Footer copyright and credit line.
- Social links: Instagram, Amazon, email, Goodreads, Pinterest, Facebook, X.

## What goes

- Gatsby, React, react-bootstrap, Bootstrap, styled-components, SCSS, Font Awesome,
  moment, `package-lock.json`.
- Poppins, Open Sans, Raleway, Tangerine.
- The fixed full-page manor background, the Books dropdown, the `<center>` tags, the
  Gatsby starter 404.

## Stack

- Astro, static output, deployed to Netlify. No UI framework integration.
- pnpm with `packageManager` pinned. All versions pinned exactly, checked at install time.
- Content layer: `src/content.config.ts` defines four collections (`books`, `posts`,
  `homepage`, `authorPhoto`) backed by a custom loader in `src/lib/datocms.ts` that
  queries the DatoCMS GraphQL API once per collection at build time. Token from
  `DATOCMS_API_TOKEN`. Pages read collections only; they never call the API.
- Rich text: `datocms-structured-text-to-html-string` renders structured text fields to
  HTML at build time (replaces `react-datocms`).
- Remote images: DatoCMS `responsiveImage` fragment supplies `srcSet`, `sizes`, `width`,
  `height`, `alt`, `base64` placeholder. Rendered by a small `DatoImage.astro`.
  Local images (manor artwork, favicon) go through `astro:assets`.
- Styling: plain CSS with custom properties.
  - `src/styles/tokens.css`: color, type scale, spacing scale, radii, shadows, breakpoints.
  - `src/styles/global.css`: reset, base typography, focus ring, link styles, reduced
    motion, `text-wrap` defaults.
  - Component styles scoped inside each `.astro` file, referencing tokens only.
- Fonts: `@fontsource-variable/bodoni-moda` and `@fontsource-variable/newsreader`,
  self-hosted. Both SIL Open Font License 1.1, recorded in `FONTS.md`.
- Environment variables (all in `.env.example`):
  - `DATOCMS_API_TOKEN`
  - `PUBLIC_GA_MEASUREMENT_ID`
  - `PUBLIC_KIT_FORM_ACTION`

## Visual system

Voice: haunted. High contrast, old-world, dramatic without being loud.

### Color

| Token | Role |
|---|---|
| `--color-ground` | page background, near-black with a cold blue-violet undertone |
| `--color-surface` | cards, subscribe panel, slightly lifted from ground |
| `--color-ink` | primary text, bone white |
| `--color-ink-muted` | secondary text, dates, labels |
| `--color-accent` | antique gold: links, primary button, hairline rules |
| `--color-accent-hover` | lighter gold for hover and focus |
| `--color-line` | hairline borders |
| `--color-danger` | form error text |

Every text pair is verified at 4.5:1 before component work starts. Gold on ground is
verified at 3:1 for UI and used for text only at label size in uppercase with tracking,
or bold, where it also clears 4.5:1. Values are chosen in `tokens.css` and checked with a
contrast tool; the check output is recorded in a comment above the color block.

### Type

- Display and wordmark: Bodoni Moda, variable. Headings at 400, wordmark at 700.
- Body: Newsreader, variable. Body 400, emphasis 500, card titles 600, tagline italic.
- Fluid scale via `clamp`, six steps: `--step--1` through `--step-4`, with `--step-0` as
  body. Body measure capped at `65ch`.
- Uppercase labels: `letter-spacing: 0.12em`, `--step--1`.
- Headings `text-wrap: balance`, body `text-wrap: pretty`.

### Spacing

Eight-step rem scale, `--space-1` (0.25rem) through `--space-8` (8rem). Sections separated
by `--space-7` on desktop and `--space-6` on mobile.

### Imagery

- Manor artwork appears once, in the homepage hero, as a wide crop behind the wordmark and
  tagline, with a bottom gradient into `--color-ground`. Inner pages use a compact header
  with no image. No `background-attachment: fixed`.
- Book covers render at intrinsic aspect ratio with a soft shadow. Hover adds a hairline
  `--color-accent` outline. No scale transform.

### Motion

Hover and focus transitions at 150ms. Hero fade-in at 600ms, removed under
`prefers-reduced-motion: reduce`.

## Components

All in `src/components/`.

| Component | Responsibility |
|---|---|
| `Header.astro` | wordmark, optional tagline, `Nav` |
| `Nav.astro` | primary links and social icon links; mobile disclosure via `<details>` |
| `SocialLinks.astro` | inline SVG icons with visually hidden text labels |
| `Hero.astro` | homepage only: manor artwork, wordmark, tagline |
| `SectionHeading.astro` | small tracked gold label above a Bodoni heading |
| `LatestBook.astro` | newest book: cover, title, description, links |
| `BookCard.astro` | cover, title, series label |
| `BookGrid.astro` | responsive grid of `BookCard` |
| `AuthorIntro.astro` | photo, first paragraph of bio, link to About |
| `Subscribe.astro` | form markup and inline script |
| `PostCard.astro` | date, title, excerpt, link |
| `DatoImage.astro` | renders a DatoCMS `responsiveImage` |
| `Footer.astro` | copyright and credit |

Layout: `src/layouts/Base.astro` provides `<head>` (title, description, GA4, fonts,
global CSS), skip link, `Header`, `<main>`, `Footer`.

## Pages

### `/` (index)

1. `Hero` with tagline "Gothic Romance the Way You Remember It".
2. `LatestBook`: books sorted by `publishDate` desc, first item. Large cover left,
   title, description, "About this book" link and "Buy" link (from `purchaseUrl`, shown
   only when present). Stacks on mobile.
3. `Subscribe`, full width.
4. `AuthorIntro` using `homepage.landingPageText` and `authorPhoto`.
5. `BookGrid` with `id="books"`, all books newest first.

### `/[slug]`

One dynamic route. `getStaticPaths` yields every book slug and every post slug, with a
`kind` prop. Renders the book template or the post template accordingly. Build fails
loudly if a slug appears in both collections.

Book template: compact header, cover left, title, publish year label, description,
"Buy" link when `purchaseUrl` is set, back link to `/#books`.

Post template: compact header, title, date (`Intl.DateTimeFormat`, long month), featured
image, body at reading measure, back link to `/blog`.

### `/blog`

`SectionHeading` "Blog", two-column grid of `PostCard` sorted by `_firstPublishedAt`
desc. Excerpt is the first paragraph of `content`, rendered to plain text and clamped.

### `/about`

`SectionHeading` "About the Author", photo, `landingPageText` then `landingPageBody`.

### `/success`

Thank-you heading and copy carried over, three download links styled as buttons.

### `/404`

Compact header, "This page has wandered off" style heading in the site voice, link home
and link to books. Copy written for the site, not starter boilerplate.

## Data flow

```
DatoCMS GraphQL  -->  src/lib/datocms.ts (loader, one query per collection)
                 -->  Astro content collections (typed via zod schemas)
                 -->  pages via getCollection / getEntry
                 -->  components receive plain props
```

Structured text fields are converted to HTML strings inside the loader, so components
receive `descriptionHtml`, not raw DAST.

## Error handling

- Missing `DATOCMS_API_TOKEN`: loader throws with a clear message; build stops.
- GraphQL errors: loader throws with the DatoCMS error text; build stops.
- Missing `PUBLIC_KIT_FORM_ACTION`: subscribe still posts to Netlify Forms; the client
  script logs a warning in dev only.
- Subscribe request failure: inline error with `role="alert"`, button re-enabled, as today.
- JavaScript disabled: the form falls back to a native POST to Netlify Forms with
  `action="/success"`.

## Accessibility

- Skip link as first focusable element.
- One `<h1>` per page: the wordmark is an `<h1>` only on the homepage; inner pages use
  the page title as `<h1>` and the wordmark as a plain link.
- Nav disclosure uses `<details>` and `<summary>`, labelled "Menu".
- Every icon link has visually hidden text. Every image has meaningful `alt` from DatoCMS
  or a hand-written alt for local images; the hero artwork is `alt=""` with the wordmark
  carrying meaning.
- Visible focus ring using `--color-accent-hover`, `outline-offset: 2px`.
- Form controls have visible `<label>` elements; honeypot is visually hidden, not
  `display: none`, so Netlify still receives it, and carries `tabindex="-1"` and
  `aria-hidden="true"`.

## Testing and verification

1. `pnpm build` completes with zero warnings against live DatoCMS.
2. Every token color pair checked for contrast before component styling; results recorded
   in `tokens.css`.
3. Lighthouse accessibility run on `/`, one book page, `/blog`, one post, `/about`,
   `/success`, `/404`; all must score 100 or have each flagged item resolved.
4. Manual keyboard walk: skip link, nav disclosure open and close, every nav link, cover
   links, subscribe form submit, download links.
5. Subscribe form submitted in dev against the live Kit endpoint with a real address, and
   the Netlify Forms fallback verified by disabling JavaScript.
6. Screenshots of each page at 390px and 1280px widths reviewed before handoff.
7. Old Gatsby files, config, and dependencies removed; `git grep` for `bootstrap`,
   `styled-components`, `gatsby`, `Poppins`, `Tangerine` returns nothing.

## Out of scope

- Any change to DatoCMS models or content.
- New pages or features beyond parity plus the sort fix on the blog index.
- Changes to the Kit form or Netlify site configuration.
