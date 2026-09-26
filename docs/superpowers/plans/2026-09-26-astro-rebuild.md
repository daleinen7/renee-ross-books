# Astro Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Gatsby 3 site with an Astro 7 static site that keeps every route, every piece of DatoCMS content, the Kit and Netlify Forms signup, GA4, and the novella downloads, under a refined gothic visual system.

**Architecture:** Astro static output with no UI framework. A custom content-layer loader in `src/lib/datocms.ts` queries the DatoCMS GraphQL API at build time and converts structured text to HTML strings, so components receive plain props. Styling is plain CSS with custom properties defined once in `src/styles/tokens.css`; component styles are scoped in each `.astro` file and reference tokens only. Pure helpers live in `src/lib/` and are unit tested with Node's built-in test runner.

**Tech Stack:** Astro 7.3.5, pnpm 12.6.0, Node 22 (type stripping built in), `datocms-structured-text-to-html-string` 6.0.0, `datocms-structured-text-utils` 6.0.1, `@fontsource-variable/bodoni-moda` 5.3.0, `@fontsource-variable/newsreader` 5.3.0. Netlify hosting.

**Spec:** `docs/superpowers/specs/2026-09-26-astro-rebuild-design.md`

## Global Constraints

- Every dependency pinned to an exact version; versions above were checked with `npm view` on 2026-09-26. Re-check at install time and use the current stable if it moved.
- `packageManager` set to `pnpm@12.6.0`. No `package-lock.json` or `yarn.lock`.
- `rem` for font sizes, spacing, and layout. `px` only for hairline borders, outlines, and shadow offsets.
- No color, font family, spacing step, or breakpoint literal outside `src/styles/tokens.css`. Component CSS references `var(--...)` only.
- `text-wrap: balance` on headings, `text-wrap: pretty` on body copy.
- Transitions over 200ms disabled under `prefers-reduced-motion: reduce`.
- No placeholder copy of any kind. Real content from DatoCMS or hand-written site copy only.
- Credentials and endpoints from env: `DATOCMS_API_TOKEN`, `PUBLIC_GA_MEASUREMENT_ID`, `PUBLIC_KIT_FORM_ACTION`. All three in `.env.example`.
- WCAG 2.2 AA: semantic HTML, one `<h1>` per page, labels on every control, visible focus, 4.5:1 text contrast, 3:1 UI contrast, full keyboard operation.
- Routes must match the live site exactly: `/`, `/about`, `/blog`, `/[slug]`, `/success`, `/404`.
- Commit after every task with the trailer `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

## Review Focus

1. **A blog post with no featured image** (the only live post has `image: null`). The post page must render without an `<img>` and without a layout gap. Pinned in Task 8.
2. **A slug present in both books and posts.** The build must fail with a message naming the slug, not silently pick one. Pinned in Task 8.
3. **A book title with no series suffix** ("Portrait of Isabella") next to one with a suffix ("Hawthorne House, Book Two"). The card must show no empty label for the former. Pinned in Task 3.
4. **Empty `purchaseUrl`** (every book today). The buy link must not render as an empty anchor. Pinned in Task 3 and Task 7.
5. **Subscribe with Kit unconfigured or JavaScript disabled.** The form must still reach Netlify Forms and land on `/success`. Pinned in Task 9.

---

### Task 1: Remove Gatsby, scaffold Astro with pnpm

**Files:**
- Delete: `gatsby-browser.js`, `gatsby-config.js`, `package-lock.json`, `src/components/*`, `src/pages/*`, `src/styles/global.scss`, `src/downloads/*`, `.cache/`, `public/` (Gatsby build output; the novella files are already in `static/`)
- Move: `static/*.epub`, `static/*.mobi`, `static/*.pdf` to `public/`; `src/images/icon.png` to `public/favicon.png`; `src/images/HeaderwotextDark.jpg` to `src/assets/manor.jpg`. Delete `src/images/Author.jpg` (author photo comes from DatoCMS) and `static/`.
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `netlify.toml`, `public/robots.txt`, `src/pages/index.astro`, `.gitignore`, `.env.example`, `README.md`
- Modify: `.env` (rename keys locally, not committed)

**Interfaces:**
- Produces: a project where `pnpm build` succeeds and `pnpm test` runs `node --test`.

- [ ] **Step 1: Remove the Gatsby tree and relocate static assets**

```bash
cd /Users/dougleinen/code/renee-ross-books
git rm -r -q gatsby-browser.js gatsby-config.js package-lock.json src/components src/pages src/styles src/downloads src/images/Author.jpg
rm -rf .cache public node_modules
mkdir -p public src/assets src/lib src/styles src/layouts src/components src/pages tests
git mv static/Terror_at_Fairmont_Hall.epub public/
git mv static/Terror_at_Fairmont_Hall.mobi public/
git mv static/Terror_at_Fairmont_Hall.pdf public/
git mv src/images/icon.png public/favicon.png
git mv src/images/HeaderwotextDark.jpg src/assets/manor.jpg
rmdir static src/images
```

- [ ] **Step 2: Write package.json**

```json
{
  "name": "renee-ross-books",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@12.6.0",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "node --test tests/"
  },
  "dependencies": {
    "@fontsource-variable/bodoni-moda": "5.3.0",
    "@fontsource-variable/newsreader": "5.3.0",
    "astro": "7.3.5",
    "datocms-structured-text-to-html-string": "6.0.0",
    "datocms-structured-text-utils": "6.0.1"
  }
}
```

Why each dependency: Astro is the framework; the two fontsource packages self-host the faces (replace Google Fonts plugin and the four old fontsource packages); `to-html-string` renders DatoCMS rich text at build time (replaces `react-datocms`); `structured-text-utils` supplies the DAST types and node guards used for the excerpt helper.

- [ ] **Step 3: Write astro.config.mjs, tsconfig.json, netlify.toml, robots.txt**

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.reneerossbooks.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
});
```

Check the actual production domain in the Netlify dashboard or the old GA config before committing; if it differs, use that value.

`tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*", "tests/**/*"],
  "exclude": ["dist"]
}
```

`netlify.toml`:
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

`public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://www.reneerossbooks.com/sitemap-index.xml
```

Remove the `Sitemap` line if no sitemap integration is added; this plan does not add one, so omit it. Final file:
```
User-agent: *
Allow: /
```

- [ ] **Step 4: Write .gitignore, .env.example, README.md**

`.gitignore`:
```
node_modules/
dist/
.astro/
.env
.netlify/
```

`.env.example`:
```
# DatoCMS read-only Content Delivery API token
DATOCMS_API_TOKEN=
# GA4 measurement ID, e.g. G-XXXXXXX
PUBLIC_GA_MEASUREMENT_ID=
# Kit form subscription endpoint: https://app.kit.com/forms/<numeric form id>/subscriptions
PUBLIC_KIT_FORM_ACTION=
```

Update the local `.env` (not committed) by renaming `API_TOKEN` to `DATOCMS_API_TOKEN`, `GA_MEASUREMENT_ID` to `PUBLIC_GA_MEASUREMENT_ID`, and `GATSBY_KIT_FORM_ACTION` to `PUBLIC_KIT_FORM_ACTION`, keeping the values.

`README.md`:
```markdown
# Renee Ross Books

Author site for Renee Ross, gothic romance. Content lives in DatoCMS; the site is built
with Astro and deployed to Netlify.

## Develop

    pnpm install
    cp .env.example .env   # then fill in the three values
    pnpm dev

## Build and test

    pnpm build
    pnpm test

## Content

Books, blog posts, homepage text, and the author photo are edited in DatoCMS. Every build
pulls the latest published content.
```

- [ ] **Step 5: Write a minimal index page so the build has something to render**

`src/pages/index.astro`:
```astro
---
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Renee Ross Books</title>
  </head>
  <body>
    <h1>Renee Ross Books</h1>
  </body>
</html>
```

This page is replaced in Task 6.

- [ ] **Step 6: Install and build**

Run: `pnpm install && pnpm build`
Expected: `pnpm-lock.yaml` created, build completes, `dist/index.html` exists, no warnings.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Replace Gatsby scaffold with Astro 7 on pnpm

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Design tokens, global styles, fonts

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `FONTS.md`, `tests/contrast.test.ts`, `src/lib/contrast.ts`

**Interfaces:**
- Produces: CSS custom properties listed below, consumed by every component. `contrast(hexA, hexB): number` helper for the test.

Token names (exact, used throughout later tasks):
- Colors: `--color-ground`, `--color-surface`, `--color-ink`, `--color-ink-muted`, `--color-accent`, `--color-accent-hover`, `--color-line`, `--color-danger`
- Type: `--font-display`, `--font-body`, `--step--1`, `--step-0`, `--step-1`, `--step-2`, `--step-3`, `--step-4`, `--leading-tight`, `--leading-body`, `--tracking-label`, `--measure`
- Space: `--space-1` through `--space-8`
- Misc: `--radius`, `--shadow-cover`, `--ring`, `--duration-fast`, `--duration-slow`, `--content-width`

- [ ] **Step 1: Write the contrast helper**

`src/lib/contrast.ts`:
```ts
function channel(hex: string, offset: number): number {
  const v = parseInt(hex.slice(offset, offset + 2), 16) / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const h = hex.replace('#', '');
  return 0.2126 * channel(h, 0) + 0.7152 * channel(h, 2) + 0.0722 * channel(h, 4);
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
```

- [ ] **Step 2: Write the failing contrast test against the planned palette**

`tests/contrast.test.ts`:
```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { contrast } from '../src/lib/contrast.ts';

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');

function token(name: string): string {
  const m = css.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(m, `token ${name} not found as a hex color`);
  return m[1];
}

const pairs: Array<[string, string, number]> = [
  ['--color-ink', '--color-ground', 4.5],
  ['--color-ink', '--color-surface', 4.5],
  ['--color-ink-muted', '--color-ground', 4.5],
  ['--color-ink-muted', '--color-surface', 4.5],
  ['--color-accent', '--color-ground', 4.5],
  ['--color-accent', '--color-surface', 4.5],
  ['--color-accent-hover', '--color-ground', 4.5],
  ['--color-danger', '--color-surface', 4.5],
  ['--color-ground', '--color-accent', 4.5],
  ['--color-line', '--color-ground', 3],
];

for (const [fg, bg, min] of pairs) {
  test(`${fg} on ${bg} reaches ${min}:1`, () => {
    const ratio = contrast(token(fg), token(bg));
    assert.ok(ratio >= min, `${fg} on ${bg} is ${ratio.toFixed(2)}:1`);
  });
}
```

The `--color-ground` on `--color-accent` pair covers the primary button (dark text on gold).

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm test`
Expected: FAIL, `tokens.css` does not exist.

- [ ] **Step 4: Write tokens.css**

`src/styles/tokens.css`:
```css
/*
  Contrast verified by tests/contrast.test.ts (WCAG 2.2 AA):
  ink on ground, ink on surface, muted on ground, accent on ground,
  ground on accent (button) all >= 4.5:1; line on ground >= 3:1.
*/
:root {
  /* Color: moonlit ground, bone ink, antique gold accent */
  --color-ground: #0d0c12;
  --color-surface: #17161f;
  --color-ink: #ece7dc;
  --color-ink-muted: #b3ac9f;
  --color-accent: #d3b064;
  --color-accent-hover: #e8cb86;
  --color-line: #4a4757;
  --color-danger: #f3a8a0;

  /* Type */
  --font-display: 'Bodoni Moda Variable', 'Bodoni MT', 'Didot', Georgia, serif;
  --font-body: 'Newsreader Variable', Georgia, 'Times New Roman', serif;
  --step--1: clamp(0.8rem, 0.78rem + 0.1vw, 0.875rem);
  --step-0: clamp(1.05rem, 1rem + 0.25vw, 1.2rem);
  --step-1: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);
  --step-2: clamp(1.55rem, 1.35rem + 1vw, 2rem);
  --step-3: clamp(2rem, 1.6rem + 2vw, 3rem);
  --step-4: clamp(2.8rem, 2rem + 4vw, 5rem);
  --leading-tight: 1.1;
  --leading-body: 1.6;
  --tracking-label: 0.12em;
  --measure: 65ch;

  /* Space */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2.5rem;
  --space-6: 4rem;
  --space-7: 6rem;
  --space-8: 8rem;

  /* Misc */
  --radius: 0.25rem;
  --shadow-cover: 0 1rem 2.5rem rgb(0 0 0 / 0.6);
  --ring: 2px solid var(--color-accent-hover);
  --duration-fast: 150ms;
  --duration-slow: 600ms;
  --content-width: 72rem;
  --bp-md: 48rem;
}
```

Note: `--bp-md` is documentation only; CSS custom properties cannot be used inside `@media`. Every media query in the project uses `(min-width: 48rem)` and must match this value. Record that in a comment above `--bp-md`.

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test`
Expected: PASS for all ten pairs. If any fail, adjust the failing token toward higher contrast and re-run; do not lower the threshold.

- [ ] **Step 6: Write global.css**

`src/styles/global.css`:
```css
@import '@fontsource-variable/bodoni-moda';
@import '@fontsource-variable/newsreader';
@import '@fontsource-variable/newsreader/wght-italic.css';
@import './tokens.css';

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  color-scheme: dark;
  background: var(--color-ground);
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  min-height: 100dvh;
  background: var(--color-ground);
  color: var(--color-ink);
  font-family: var(--font-body);
  font-size: var(--step-0);
  line-height: var(--leading-body);
  text-wrap: pretty;
}

h1, h2, h3, h4 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  line-height: var(--leading-tight);
  text-wrap: balance;
}

h1 { font-size: var(--step-4); }
h2 { font-size: var(--step-3); }
h3 { font-size: var(--step-2); }
h4 { font-size: var(--step-1); }

p, ul, ol {
  margin: 0 0 var(--space-3);
  max-width: var(--measure);
}

a {
  color: var(--color-accent);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.15em;
  transition: color var(--duration-fast);
}

a:hover {
  color: var(--color-accent-hover);
}

:focus-visible {
  outline: var(--ring);
  outline-offset: 2px;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

.label {
  font-family: var(--font-body);
  font-size: var(--step--1);
  font-weight: 500;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--color-accent);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.prose :is(h2, h3) {
  margin-top: var(--space-5);
  margin-bottom: var(--space-3);
}

.prose a {
  text-decoration: underline;
}

.button {
  display: inline-block;
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius);
  background: var(--color-accent);
  color: var(--color-ground);
  font-family: var(--font-body);
  font-size: var(--step-0);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background var(--duration-fast), border-color var(--duration-fast);
}

.button:hover {
  background: var(--color-accent-hover);
  border-color: var(--color-accent-hover);
  color: var(--color-ground);
}

.button--ghost {
  background: transparent;
  color: var(--color-accent);
}

.button--ghost:hover {
  background: transparent;
  color: var(--color-accent-hover);
}

.button[disabled] {
  opacity: 0.6;
  cursor: progress;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 7: Record font licences**

`FONTS.md`:
```markdown
# Fonts

Both faces are self-hosted via Fontsource and licensed under the SIL Open Font License 1.1.

| Face | Package | Licence | Source |
|---|---|---|---|
| Bodoni Moda (variable) | `@fontsource-variable/bodoni-moda` | OFL 1.1 | https://github.com/indestructible-type/Bodoni |
| Newsreader (variable) | `@fontsource-variable/newsreader` | OFL 1.1 | https://github.com/productiontype/Newsreader |

Voice: haunted. Bodoni Moda for display and the wordmark, Newsreader for body and labels.
```

- [ ] **Step 8: Verify fontsource file paths exist**

Run: `ls node_modules/@fontsource-variable/newsreader/ | grep -i italic; ls node_modules/@fontsource-variable/bodoni-moda/index.css`
Expected: an italic CSS file is listed (use its exact name in the `@import` above if it differs from `wght-italic.css`), and `index.css` exists.

- [ ] **Step 9: Commit**

```bash
git add src/styles src/lib/contrast.ts tests/contrast.test.ts FONTS.md
git commit -m "Add design tokens, global styles, and self-hosted fonts

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Pure content helpers (structured text, titles, dates)

**Files:**
- Create: `src/lib/structured-text.ts`, `src/lib/books.ts`, `src/lib/dates.ts`, `tests/structured-text.test.ts`, `tests/books.test.ts`, `tests/dates.test.ts`

**Interfaces:**
- Produces:
  - `renderStructuredText(value: StructuredTextDocument): string` returns HTML.
  - `excerpt(value: StructuredTextDocument, maxChars?: number): string` returns plain text of the first paragraph, trimmed to a word boundary, default 180 chars.
  - `splitTitle(title: string): { name: string; series: string | null }`
  - `hasPurchaseUrl(url: string | null | undefined): url is string`
  - `formatDate(iso: string): string` returns e.g. "September 24, 2026".
  - `publishYear(iso: string): string` returns "2026".
  - `StructuredTextDocument` type alias exported from `structured-text.ts`.

- [ ] **Step 1: Write failing tests**

`tests/structured-text.test.ts`:
```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderStructuredText, excerpt } from '../src/lib/structured-text.ts';

const doc = {
  schema: 'dast' as const,
  document: {
    type: 'root' as const,
    children: [
      {
        type: 'paragraph' as const,
        children: [
          { type: 'span' as const, value: 'Welcome to the creepy castle. ' },
          { type: 'span' as const, marks: ['strong'], value: 'We don’t get many visitors.' },
        ],
      },
      {
        type: 'paragraph' as const,
        children: [{ type: 'span' as const, value: 'Second paragraph.' }],
      },
    ],
  },
};

test('renders paragraphs and marks to HTML', () => {
  const html = renderStructuredText(doc);
  assert.match(html, /<p>Welcome to the creepy castle\. <strong>We don’t get many visitors\.<\/strong><\/p>/);
  assert.match(html, /<p>Second paragraph\.<\/p>/);
});

test('excerpt returns only the first paragraph as plain text', () => {
  assert.equal(excerpt(doc), 'Welcome to the creepy castle. We don’t get many visitors.');
});

test('excerpt trims at a word boundary and adds an ellipsis', () => {
  assert.equal(excerpt(doc, 20), 'Welcome to the…');
});

test('excerpt of an empty document is an empty string', () => {
  const empty = { schema: 'dast' as const, document: { type: 'root' as const, children: [] } };
  assert.equal(excerpt(empty), '');
});
```

`tests/books.test.ts`:
```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitTitle, hasPurchaseUrl } from '../src/lib/books.ts';

test('title with a series suffix splits on the last comma', () => {
  assert.deepEqual(splitTitle('The Haunting of Delilah, Thornehaven One'), {
    name: 'The Haunting of Delilah',
    series: 'Thornehaven One',
  });
  assert.deepEqual(splitTitle('Hawthorne House, Book Two'), {
    name: 'Hawthorne House',
    series: 'Book Two',
  });
});

test('title without a comma has no series', () => {
  assert.deepEqual(splitTitle('Portrait of Isabella'), { name: 'Portrait of Isabella', series: null });
});

test('empty and null purchase URLs are treated as absent', () => {
  assert.equal(hasPurchaseUrl(''), false);
  assert.equal(hasPurchaseUrl(null), false);
  assert.equal(hasPurchaseUrl(undefined), false);
  assert.equal(hasPurchaseUrl('https://www.amazon.com/dp/B000'), true);
});
```

`tests/dates.test.ts`:
```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDate, publishYear } from '../src/lib/dates.ts';

test('formatDate gives a long US date', () => {
  assert.equal(formatDate('2026-09-24T19:36:22+01:00'), 'September 24, 2026');
});

test('formatDate handles a bare date without timezone drift', () => {
  assert.equal(formatDate('2026-09-06'), 'September 6, 2026');
});

test('publishYear returns the year', () => {
  assert.equal(publishYear('2014-04-26'), '2014');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test`
Expected: FAIL, modules not found.

- [ ] **Step 3: Implement structured-text.ts**

```ts
import { render } from 'datocms-structured-text-to-html-string';
import {
  isParagraph,
  isSpan,
  type Document,
  type Node,
} from 'datocms-structured-text-utils';

export type StructuredTextDocument = { schema: 'dast'; document: Document };

export function renderStructuredText(value: StructuredTextDocument): string {
  return render(value) ?? '';
}

function spanText(node: Node): string {
  if (isSpan(node)) return node.value;
  if ('children' in node && Array.isArray(node.children)) {
    return (node.children as Node[]).map(spanText).join('');
  }
  return '';
}

export function excerpt(value: StructuredTextDocument, maxChars = 180): string {
  const first = value.document.children.find(isParagraph);
  if (!first) return '';
  const text = spanText(first).replace(/\s+/g, ' ').trim();
  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxChars).trimEnd()}…`;
}
```

If `isParagraph` or `isSpan` are not exported by `datocms-structured-text-utils` 6.x, replace them with `(n) => n.type === 'paragraph'` and `(n) => n.type === 'span'`.

- [ ] **Step 4: Implement books.ts and dates.ts**

`src/lib/books.ts`:
```ts
export function splitTitle(title: string): { name: string; series: string | null } {
  const idx = title.lastIndexOf(', ');
  if (idx === -1) return { name: title, series: null };
  return { name: title.slice(0, idx), series: title.slice(idx + 2) };
}

export function hasPurchaseUrl(url: string | null | undefined): url is string {
  return typeof url === 'string' && url.trim().length > 0;
}
```

`src/lib/dates.ts`:
```ts
const long = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

function parse(iso: string): Date {
  return /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T00:00:00Z`) : new Date(iso);
}

export function formatDate(iso: string): string {
  return long.format(parse(iso));
}

export function publishYear(iso: string): string {
  return String(parse(iso).getUTCFullYear());
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm test`
Expected: PASS, all tests in three files.

- [ ] **Step 6: Commit**

```bash
git add src/lib tests
git commit -m "Add structured text, title, and date helpers

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: DatoCMS loader and content collections

**Files:**
- Create: `src/lib/datocms.ts`, `src/content.config.ts`, `src/env.d.ts`, `tests/datocms.test.ts`

**Interfaces:**
- Consumes: `renderStructuredText`, `excerpt` from Task 3.
- Produces collections and entry data shapes:

```ts
// collection 'books', id = slug
type Book = {
  title: string; slug: string; publishDate: string; purchaseUrl: string | null;
  descriptionHtml: string; cover: ResponsiveImage;
};
// collection 'posts', id = slug
type Post = {
  title: string; slug: string; publishedAt: string; contentHtml: string;
  excerpt: string; image: ResponsiveImage | null;
};
// collection 'homepage', single entry id 'homepage'
type Homepage = { introHtml: string; bodyHtml: string };
// collection 'authorPhoto', single entry id 'author-photo'
type AuthorPhoto = { photo: ResponsiveImage };

type ResponsiveImage = {
  src: string; srcSet: string; sizes: string; width: number; height: number;
  alt: string; base64: string | null;
};
```

- `datoQuery<T>(query: string, variables?: Record<string, unknown>): Promise<T>` exported for reuse; throws with DatoCMS error text.
- `booksLoader()`, `postsLoader()`, `homepageLoader()`, `authorPhotoLoader()` returning Astro `Loader` objects.

- [ ] **Step 1: Write the failing test for the query function and the mappers**

`tests/datocms.test.ts`:
```ts
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { datoQuery, mapBook, mapPost } from '../src/lib/datocms.ts';

const dast = {
  schema: 'dast' as const,
  document: {
    type: 'root' as const,
    children: [{ type: 'paragraph' as const, children: [{ type: 'span' as const, value: 'Body.' }] }],
  },
};

const image = {
  src: 'https://www.datocms-assets.com/1/a.jpg?w=800',
  srcSet: 'https://www.datocms-assets.com/1/a.jpg?w=400 400w',
  sizes: '(min-width: 48rem) 20rem, 60vw',
  width: 800,
  height: 1200,
  alt: null,
  base64: null,
};

test('datoQuery throws when the token is missing', async () => {
  await assert.rejects(
    () => datoQuery('{ site { locales } }', {}, { token: '' }),
    /DATOCMS_API_TOKEN/,
  );
});

test('datoQuery surfaces GraphQL errors', async () => {
  const fetchMock = mock.method(globalThis, 'fetch', async () =>
    new Response(JSON.stringify({ errors: [{ message: 'Field boom does not exist' }] }), { status: 200 }),
  );
  await assert.rejects(
    () => datoQuery('{ boom }', {}, { token: 'x' }),
    /Field boom does not exist/,
  );
  fetchMock.mock.restore();
});

test('mapBook renders description, falls back alt to title, and nulls empty purchaseUrl', () => {
  const book = mapBook({
    title: 'Portrait of Isabella',
    slug: 'portrait-of-isabella',
    publishDate: '2025-10-26',
    purchaseUrl: '',
    description: { value: dast },
    bookCover: { responsiveImage: image },
  });
  assert.equal(book.descriptionHtml, '<p>Body.</p>');
  assert.equal(book.cover.alt, 'Cover of Portrait of Isabella');
  assert.equal(book.purchaseUrl, null);
});

test('mapPost tolerates a missing image and produces an excerpt', () => {
  const post = mapPost({
    title: 'A Post',
    slug: 'a-post',
    _firstPublishedAt: '2026-09-24T19:36:22+01:00',
    content: { value: dast },
    image: null,
  });
  assert.equal(post.image, null);
  assert.equal(post.excerpt, 'Body.');
  assert.equal(post.contentHtml, '<p>Body.</p>');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test`
Expected: FAIL, `datocms.ts` not found.

- [ ] **Step 3: Implement datocms.ts**

```ts
import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';
import { renderStructuredText, excerpt, type StructuredTextDocument } from './structured-text.ts';

const ENDPOINT = 'https://graphql.datocms.com/';

export const responsiveImageSchema = z.object({
  src: z.string(),
  srcSet: z.string(),
  sizes: z.string(),
  width: z.number(),
  height: z.number(),
  alt: z.string(),
  base64: z.string().nullable(),
});
export type ResponsiveImage = z.infer<typeof responsiveImageSchema>;

export const bookSchema = z.object({
  title: z.string(),
  slug: z.string(),
  publishDate: z.string(),
  purchaseUrl: z.string().nullable(),
  descriptionHtml: z.string(),
  cover: responsiveImageSchema,
});
export type Book = z.infer<typeof bookSchema>;

export const postSchema = z.object({
  title: z.string(),
  slug: z.string(),
  publishedAt: z.string(),
  contentHtml: z.string(),
  excerpt: z.string(),
  image: responsiveImageSchema.nullable(),
});
export type Post = z.infer<typeof postSchema>;

export const homepageSchema = z.object({ introHtml: z.string(), bodyHtml: z.string() });
export const authorPhotoSchema = z.object({ photo: responsiveImageSchema });

type RawImage = Omit<ResponsiveImage, 'alt'> & { alt: string | null };
type RawBook = {
  title: string; slug: string; publishDate: string; purchaseUrl: string | null;
  description: { value: StructuredTextDocument };
  bookCover: { responsiveImage: RawImage };
};
type RawPost = {
  title: string; slug: string; _firstPublishedAt: string;
  content: { value: StructuredTextDocument };
  image: { responsiveImage: RawImage } | null;
};

const IMAGE_FIELDS = `src srcSet sizes width height alt base64`;

const COVER_SIZES = '(min-width: 48rem) 20rem, 60vw';
const HERO_COVER_SIZES = '(min-width: 48rem) 24rem, 80vw';
const POST_IMAGE_SIZES = '(min-width: 48rem) 40rem, 100vw';
const PHOTO_SIZES = '(min-width: 48rem) 16rem, 50vw';

export const BOOKS_QUERY = `
  query Books($sizes: String!) {
    allBooks(first: 100, orderBy: publishDate_DESC) {
      title slug publishDate purchaseUrl
      description { value }
      bookCover { responsiveImage(imgixParams: { fm: webp, w: 800 }, sizes: $sizes) { ${IMAGE_FIELDS} } }
    }
  }
`;

export const POSTS_QUERY = `
  query Posts($sizes: String!) {
    allBlogPosts(first: 100, orderBy: _firstPublishedAt_DESC) {
      title slug _firstPublishedAt
      content { value }
      image { responsiveImage(imgixParams: { fm: webp, w: 1200 }, sizes: $sizes) { ${IMAGE_FIELDS} } }
    }
  }
`;

export const HOMEPAGE_QUERY = `
  query Homepage {
    homepage { landingPageText { value } landingPageBody { value } }
  }
`;

export const AUTHOR_PHOTO_QUERY = `
  query AuthorPhoto($sizes: String!) {
    authorPhoto {
      authorPhoto { responsiveImage(imgixParams: { fm: webp, w: 600, h: 600, fit: crop }, sizes: $sizes) { ${IMAGE_FIELDS} } }
    }
  }
`;

export async function datoQuery<T>(
  query: string,
  variables: Record<string, unknown> = {},
  opts: { token?: string } = {},
): Promise<T> {
  const token = opts.token ?? import.meta.env?.DATOCMS_API_TOKEN ?? process.env.DATOCMS_API_TOKEN;
  if (!token) {
    throw new Error('DATOCMS_API_TOKEN is not set. Copy .env.example to .env and fill it in.');
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (!res.ok || json.errors?.length) {
    const detail = json.errors?.map((e) => e.message).join('; ') ?? `HTTP ${res.status}`;
    throw new Error(`DatoCMS query failed: ${detail}`);
  }
  return json.data as T;
}

function withAlt(img: RawImage, fallback: string): ResponsiveImage {
  return { ...img, alt: img.alt?.trim() || fallback };
}

export function mapBook(raw: RawBook): Book {
  return {
    title: raw.title,
    slug: raw.slug,
    publishDate: raw.publishDate,
    purchaseUrl: raw.purchaseUrl?.trim() ? raw.purchaseUrl.trim() : null,
    descriptionHtml: renderStructuredText(raw.description.value),
    cover: withAlt(raw.bookCover.responsiveImage, `Cover of ${raw.title}`),
  };
}

export function mapPost(raw: RawPost): Post {
  return {
    title: raw.title,
    slug: raw.slug,
    publishedAt: raw._firstPublishedAt,
    contentHtml: renderStructuredText(raw.content.value),
    excerpt: excerpt(raw.content.value),
    image: raw.image ? withAlt(raw.image.responsiveImage, `Illustration for ${raw.title}`) : null,
  };
}

function loader<TRaw, TData extends Record<string, unknown>>(opts: {
  name: string;
  query: string;
  variables?: Record<string, unknown>;
  pick: (data: unknown) => TRaw[];
  id: (raw: TRaw) => string;
  map: (raw: TRaw) => TData;
  schema: z.ZodType<TData>;
}): Loader {
  return {
    name: opts.name,
    schema: opts.schema,
    async load({ store, parseData, generateDigest, logger }) {
      const data = await datoQuery<unknown>(opts.query, opts.variables);
      const items = opts.pick(data);
      store.clear();
      for (const raw of items) {
        const id = opts.id(raw);
        const parsed = await parseData({ id, data: opts.map(raw) });
        store.set({ id, data: parsed, digest: generateDigest(parsed) });
      }
      logger.info(`Loaded ${items.length} ${opts.name}`);
    },
  };
}

export const booksLoader = () =>
  loader<RawBook, Book>({
    name: 'books',
    query: BOOKS_QUERY,
    variables: { sizes: COVER_SIZES },
    pick: (d) => (d as { allBooks: RawBook[] }).allBooks,
    id: (b) => b.slug,
    map: mapBook,
    schema: bookSchema,
  });

export const postsLoader = () =>
  loader<RawPost, Post>({
    name: 'posts',
    query: POSTS_QUERY,
    variables: { sizes: POST_IMAGE_SIZES },
    pick: (d) => (d as { allBlogPosts: RawPost[] }).allBlogPosts,
    id: (p) => p.slug,
    map: mapPost,
    schema: postSchema,
  });

type RawHomepage = { landingPageText: { value: StructuredTextDocument }; landingPageBody: { value: StructuredTextDocument } };
export const homepageLoader = () =>
  loader<RawHomepage, z.infer<typeof homepageSchema>>({
    name: 'homepage',
    query: HOMEPAGE_QUERY,
    pick: (d) => [(d as { homepage: RawHomepage }).homepage],
    id: () => 'homepage',
    map: (h) => ({
      introHtml: renderStructuredText(h.landingPageText.value),
      bodyHtml: renderStructuredText(h.landingPageBody.value),
    }),
    schema: homepageSchema,
  });

type RawAuthorPhoto = { authorPhoto: { responsiveImage: RawImage } };
export const authorPhotoLoader = () =>
  loader<RawAuthorPhoto, z.infer<typeof authorPhotoSchema>>({
    name: 'authorPhoto',
    query: AUTHOR_PHOTO_QUERY,
    variables: { sizes: PHOTO_SIZES },
    pick: (d) => [(d as { authorPhoto: RawAuthorPhoto }).authorPhoto],
    id: () => 'author-photo',
    map: (a) => ({ photo: withAlt(a.authorPhoto.responsiveImage, 'Author Renee Ross') }),
    schema: authorPhotoSchema,
  });

export { HERO_COVER_SIZES };
```

Note on `import.meta.env` inside `node --test`: Node leaves `import.meta.env` undefined, so the optional chain falls through to `process.env`. The test passes `token: ''` explicitly to force the missing-token branch.

- [ ] **Step 4: Write content.config.ts and env.d.ts**

`src/content.config.ts`:
```ts
import { defineCollection } from 'astro:content';
import { booksLoader, postsLoader, homepageLoader, authorPhotoLoader } from './lib/datocms.ts';

export const collections = {
  books: defineCollection({ loader: booksLoader() }),
  posts: defineCollection({ loader: postsLoader() }),
  homepage: defineCollection({ loader: homepageLoader() }),
  authorPhoto: defineCollection({ loader: authorPhotoLoader() }),
};
```

`src/env.d.ts`:
```ts
interface ImportMetaEnv {
  readonly DATOCMS_API_TOKEN: string;
  readonly PUBLIC_GA_MEASUREMENT_ID: string;
  readonly PUBLIC_KIT_FORM_ACTION: string;
}
```

- [ ] **Step 5: Run tests, then a real build**

Run: `pnpm test`
Expected: PASS.

Run: `pnpm build`
Expected: log lines `Loaded 16 books`, `Loaded 1 posts`, `Loaded 1 homepage`, `Loaded 1 authorPhoto`, build succeeds. If Astro rejects `import.meta.env?.` syntax or the `astro/zod` import path, use `import { z } from 'astro:content'` instead and re-run.

- [ ] **Step 6: Commit**

```bash
git add src/lib/datocms.ts src/content.config.ts src/env.d.ts tests/datocms.test.ts
git commit -m "Add DatoCMS content loader and collections

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Base layout, header, nav, social links, footer

**Files:**
- Create: `src/layouts/Base.astro`, `src/components/Header.astro`, `src/components/Nav.astro`, `src/components/SocialLinks.astro`, `src/components/Footer.astro`, `src/components/Analytics.astro`, `src/lib/site.ts`

**Interfaces:**
- Consumes: tokens and `.visually-hidden`, `.label` from Task 2.
- Produces: `Base` layout with props `{ title: string; description: string; home?: boolean }`. When `home` is true the wordmark renders as `<h1>` and the header is omitted in favor of the Hero (Task 6). `SITE` constant `{ name, tagline, email, social: Array<{ label, href, icon }> }`.

- [ ] **Step 1: Write site.ts**

```ts
export const SITE = {
  name: 'Renee Ross Books',
  tagline: 'Gothic Romance the Way You Remember It',
  description: 'Gothic romance novels by author Renee Ross.',
  email: 'reneerossbooks@gmail.com',
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/reneerossbooks/', icon: 'instagram' },
    { label: 'Amazon author page', href: 'https://www.amazon.com/Renee-Ross/e/B007WDCBI2', icon: 'amazon' },
    { label: 'Goodreads', href: 'https://www.goodreads.com/author/show/6037599.Renee_Ross', icon: 'goodreads' },
    { label: 'Pinterest', href: 'https://www.pinterest.com/ReneeRossBooks/', icon: 'pinterest' },
    { label: 'Facebook', href: 'https://www.facebook.com/reneerossbooks', icon: 'facebook' },
    { label: 'X', href: 'https://twitter.com/reneerossbooks', icon: 'x' },
    { label: 'Email', href: 'mailto:reneerossbooks@gmail.com', icon: 'email' },
  ],
} as const;

export type SocialIcon = (typeof SITE.social)[number]['icon'];
```

- [ ] **Step 2: Write SocialLinks.astro with inline SVG icons**

```astro
---
import { SITE, type SocialIcon } from '../lib/site.ts';

const paths: Record<SocialIcon, string> = {
  instagram:
    'M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.25-2.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z',
  amazon:
    'M13.6 13.3c-.9.5-1.7.7-2.6.7-1.3 0-2-.7-2-1.7 0-1.6 1.6-2.4 4.6-2.4v.7c0 1.2-.1 2.1 0 2.7Zm2.4 3.1c-.5.3-.9.2-1.2-.2-.3-.4-.5-.9-.7-1.4-1.1 1.2-2.3 1.7-4 1.7-2.2 0-3.7-1.3-3.7-3.5 0-1.7.9-2.9 2.5-3.5 1.4-.5 3.2-.6 4.7-.7v-.3c0-.6 0-1.3-.3-1.8-.3-.4-.9-.6-1.4-.6-1 0-1.9.5-2.1 1.5l-2.4-.3C7.9 5.1 9.9 4 12.2 4c1.2 0 2.7.3 3.6 1.2 1.2 1.1 1.1 2.5 1.1 4.1v3.7c0 1.1.5 1.6.9 2.2.2.2.2.5 0 .7l-1.8 1.5Zm3.4 1.4c-2.1 1.5-5.1 2.3-7.7 2.3-3.6 0-6.9-1.3-9.4-3.6-.2-.2 0-.4.2-.3 2.7 1.6 6 2.5 9.4 2.5 2.3 0 4.8-.5 7.2-1.5.3-.1.6.2.3.6Zm.9-1c-.3-.4-1.8-.2-2.5-.1-.2 0-.2-.2-.1-.3 1.2-.8 3.1-.6 3.4-.3.2.3-.1 2.2-1.2 3.1-.2.1-.3.1-.3-.1.3-.6.9-2 .7-2.3Z',
  goodreads:
    'M15.8 4v1.9h-.1c-.8-1.3-2.1-2.1-3.7-2.1C9 3.8 7 6.4 7 9.7s2 5.8 4.9 5.8c1.6 0 2.9-.8 3.7-2h.1v1.9c0 2.7-1.4 4.2-3.9 4.2-1.9 0-3.1-.8-3.5-2.4H6.6c.4 2.6 2.4 4 5.2 4 3.7 0 5.7-2.2 5.7-6.2V4h-1.7ZM12 13.9c-2.1 0-3.4-1.8-3.4-4.2S9.9 5.5 12 5.5s3.4 1.8 3.4 4.2-1.3 4.2-3.4 4.2Z',
  pinterest:
    'M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.8 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-1.9 3.1-4.5 0-2.4-1.7-4-4.1-4-2.8 0-4.5 2.1-4.5 4.3 0 .9.3 1.8.7 2.3.1.1.1.2.1.3l-.3 1.1c0 .2-.1.2-.3.1-1.2-.6-2-2.4-2-3.8 0-3.1 2.3-6 6.5-6 3.4 0 6.1 2.4 6.1 5.7 0 3.4-2.1 6.1-5.1 6.1-1 0-1.9-.5-2.3-1.1l-.6 2.4c-.2.9-.8 2-1.2 2.6A10 10 0 1 0 12 2Z',
  facebook:
    'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z',
  x: 'M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z',
  email:
    'M3 5.5A1.5 1.5 0 0 1 4.5 4h15A1.5 1.5 0 0 1 21 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5v-13Zm1.5.4v.6l7.5 5 7.5-5v-.6h-15Zm15 2.4-7.5 5-7.5-5v10.2h15V8.3Z',
};
---

<ul class="social">
  {SITE.social.map((s) => (
    <li>
      <a href={s.href} rel={s.href.startsWith('mailto:') ? undefined : 'me noopener'}>
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d={paths[s.icon]} />
        </svg>
        <span class="visually-hidden">{s.label}</span>
      </a>
    </li>
  ))}
</ul>

<style>
  .social {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin: 0;
    padding: 0;
    list-style: none;
    max-width: none;
  }
  a {
    display: grid;
    place-items: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: var(--radius);
    color: var(--color-ink-muted);
  }
  a:hover {
    color: var(--color-accent-hover);
  }
  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
</style>
```

- [ ] **Step 3: Write Nav.astro using a details disclosure on mobile**

```astro
---
import SocialLinks from './SocialLinks.astro';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/#books', label: 'Books' },
  { href: '/blog', label: 'Blog' },
];
const current = Astro.url.pathname;
---

<nav aria-label="Primary">
  <details class="menu">
    <summary class="label">
      <span>Menu</span>
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M4 6h16v1.5H4V6Zm0 5.25h16v1.5H4v-1.5Zm0 5.25h16V18H4v-1.5Z" />
      </svg>
    </summary>
    <div class="panel">
      <ul class="links">
        {links.map((l) => (
          <li>
            <a href={l.href} aria-current={current === l.href ? 'page' : undefined}>{l.label}</a>
          </li>
        ))}
      </ul>
      <SocialLinks />
    </div>
  </details>
</nav>

<style>
  .menu {
    position: relative;
  }
  summary {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius);
    cursor: pointer;
    list-style: none;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  .panel {
    display: grid;
    gap: var(--space-4);
    padding: var(--space-4) 0;
  }
  .links {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin: 0;
    padding: 0;
    list-style: none;
    max-width: none;
  }
  .links a {
    display: inline-block;
    padding: var(--space-2) 0;
    font-family: var(--font-body);
    font-size: var(--step-1);
    color: var(--color-ink);
    text-decoration: none;
  }
  .links a:hover,
  .links a[aria-current='page'] {
    color: var(--color-accent-hover);
  }

  @media (min-width: 48rem) {
    summary {
      display: none;
    }
    .panel {
      display: flex;
      align-items: center;
      gap: var(--space-5);
      padding: 0;
    }
    .links {
      flex-direction: row;
      gap: var(--space-4);
    }
    .links a {
      font-size: var(--step-0);
    }
  }
</style>
```

Note: at desktop width the `<summary>` is hidden and the panel is always displayed via CSS, so `<details>` being closed does not matter. Verify in Task 10 that with `summary` hidden the panel still renders when closed; if a browser hides closed-details content regardless, add the `open` attribute via a tiny inline script keyed on `matchMedia('(min-width: 48rem)')`.

- [ ] **Step 4: Write Header.astro**

```astro
---
import Nav from './Nav.astro';
import { SITE } from '../lib/site.ts';
---

<header class="site-header">
  <div class="inner">
    <a class="wordmark" href="/">{SITE.name}</a>
    <Nav />
  </div>
</header>

<style>
  .site-header {
    border-bottom: 1px solid var(--color-line);
  }
  .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    max-width: var(--content-width);
    margin: 0 auto;
    padding: var(--space-3) var(--space-3);
  }
  .wordmark {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: var(--step-1);
    color: var(--color-ink);
    text-decoration: none;
    letter-spacing: 0.01em;
  }
  .wordmark:hover {
    color: var(--color-accent-hover);
  }
  @media (min-width: 48rem) {
    .inner {
      padding: var(--space-4) var(--space-4);
    }
  }
</style>
```

- [ ] **Step 5: Write Footer.astro and Analytics.astro**

`Footer.astro`:
```astro
---
const year = new Date().getFullYear();
---

<footer class="site-footer">
  <div class="inner">
    <p>Copyright &copy; {year} Renee Ross. All rights reserved.</p>
    <p class="credit">
      Website by <a href="https://www.dougleinen.com/">Doug Leinen</a> and
      <a href="https://stephrinehart.com">Stephanie Rinehart</a>.
    </p>
  </div>
</footer>

<style>
  .site-footer {
    margin-top: var(--space-7);
    border-top: 1px solid var(--color-line);
    color: var(--color-ink-muted);
    font-size: var(--step--1);
  }
  .inner {
    max-width: var(--content-width);
    margin: 0 auto;
    padding: var(--space-5) var(--space-3);
  }
  p {
    margin: 0 0 var(--space-1);
  }
  .credit a {
    color: var(--color-ink-muted);
  }
  .credit a:hover {
    color: var(--color-accent-hover);
  }
</style>
```

The credit line wording changed from "Website Magic performed by Doug the Magnificent & The Spectacular Stephanie". Flag this to Doug at handoff; if he wants the original wording back, it is a one-line change.

`Analytics.astro`:
```astro
---
const id = import.meta.env.PUBLIC_GA_MEASUREMENT_ID;
---

{id && (
  <>
    <script is:inline define:vars={{ id }}>
      if (navigator.doNotTrack !== '1' && window.doNotTrack !== '1') {
        const s = document.createElement('script');
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', id, { anonymize_ip: true });
      }
    </script>
  </>
)}
```

- [ ] **Step 6: Write Base.astro**

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import Analytics from '../components/Analytics.astro';
import { SITE } from '../lib/site.ts';

interface Props {
  title: string;
  description: string;
  home?: boolean;
}
const { title, description, home = false } = Astro.props;
const fullTitle = home ? SITE.name : `${title} | ${SITE.name}`;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <link rel="icon" href="/favicon.png" type="image/png" />
    <link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <Analytics />
  </head>
  <body>
    <a class="skip" href="#main">Skip to content</a>
    {!home && <Header />}
    <main id="main" tabindex="-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>

<style>
  .skip {
    position: absolute;
    top: var(--space-2);
    left: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: var(--color-accent);
    color: var(--color-ground);
    border-radius: var(--radius);
    transform: translateY(-200%);
    transition: transform var(--duration-fast);
  }
  .skip:focus {
    transform: none;
  }
  main:focus {
    outline: none;
  }
</style>
```

- [ ] **Step 7: Point index.astro at the layout temporarily and build**

Replace `src/pages/index.astro` with:
```astro
---
import Base from '../layouts/Base.astro';
import { SITE } from '../lib/site.ts';
---

<Base title="Home" description={SITE.description}>
  <h1>{SITE.name}</h1>
</Base>
```

Run: `pnpm build && pnpm preview &` then `curl -s http://localhost:4321/ | grep -c 'Skip to content'`
Expected: build clean, output `1`. Stop the preview server after checking.

- [ ] **Step 8: Commit**

```bash
git add src/layouts src/components src/lib/site.ts src/pages/index.astro
git commit -m "Add base layout, header, nav, social links, footer, analytics

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Homepage: hero, latest book, author intro, book grid

**Files:**
- Create: `src/components/Hero.astro`, `src/components/DatoImage.astro`, `src/components/SectionHeading.astro`, `src/components/LatestBook.astro`, `src/components/BookCard.astro`, `src/components/BookGrid.astro`, `src/components/AuthorIntro.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `Book`, `ResponsiveImage`, `HERO_COVER_SIZES` from Task 4; `splitTitle`, `hasPurchaseUrl` from Task 3; `Base` from Task 5. `Subscribe` from Task 9 is added to this page in Task 9.
- Produces:
  - `DatoImage` props `{ image: ResponsiveImage; sizes?: string; loading?: 'lazy' | 'eager'; class?: string }`
  - `SectionHeading` props `{ label: string; title: string; id?: string; level?: 2 | 3 }`
  - `BookCard` props `{ book: Book }`
  - `BookGrid` props `{ books: Book[]; id?: string }`
  - `LatestBook` props `{ book: Book }`
  - `AuthorIntro` props `{ introHtml: string; photo: ResponsiveImage }`
  - `Hero` props `{ tagline: string }`

- [ ] **Step 1: Write DatoImage.astro**

```astro
---
import type { ResponsiveImage } from '../lib/datocms.ts';

interface Props {
  image: ResponsiveImage;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  class?: string;
}
const { image, sizes = image.sizes, loading = 'lazy', class: className } = Astro.props;
---

<img
  src={image.src}
  srcset={image.srcSet}
  sizes={sizes}
  width={image.width}
  height={image.height}
  alt={image.alt}
  loading={loading}
  decoding="async"
  class={className}
  style={image.base64 ? `background: url(${image.base64}) center / cover no-repeat` : undefined}
/>
```

The inline `style` here carries a per-image blur placeholder data URI, not a design value, so it is not a hardcoded token.

- [ ] **Step 2: Write SectionHeading.astro**

```astro
---
interface Props {
  label: string;
  title: string;
  id?: string;
  level?: 2 | 3;
}
const { label, title, id, level = 2 } = Astro.props;
const Tag = `h${level}` as 'h2' | 'h3';
---

<div class="section-heading">
  <p class="label">{label}</p>
  <Tag id={id}>{title}</Tag>
</div>

<style>
  .section-heading {
    display: grid;
    gap: var(--space-2);
    margin-bottom: var(--space-5);
  }
  .label {
    margin: 0;
  }
</style>
```

- [ ] **Step 3: Write Hero.astro**

```astro
---
import { Image } from 'astro:assets';
import manor from '../assets/manor.jpg';
import Nav from './Nav.astro';
import { SITE } from '../lib/site.ts';

interface Props {
  tagline: string;
}
const { tagline } = Astro.props;
---

<header class="hero">
  <Image
    src={manor}
    alt=""
    widths={[640, 1024, 1478]}
    sizes="100vw"
    loading="eager"
    fetchpriority="high"
    class="art"
  />
  <div class="veil" aria-hidden="true"></div>
  <div class="bar">
    <Nav />
  </div>
  <div class="title">
    <h1>{SITE.name}</h1>
    <p class="tagline">{tagline}</p>
  </div>
</header>

<style>
  .hero {
    position: relative;
    display: grid;
    grid-template-rows: auto 1fr;
    min-height: 32rem;
    overflow: hidden;
    isolation: isolate;
  }
  .art {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 30%;
    z-index: -2;
  }
  .veil {
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      linear-gradient(to bottom, rgb(13 12 18 / 0.55), rgb(13 12 18 / 0.35) 40%, var(--color-ground) 100%);
  }
  .bar {
    display: flex;
    justify-content: flex-end;
    max-width: var(--content-width);
    width: 100%;
    margin: 0 auto;
    padding: var(--space-3);
  }
  .title {
    align-self: end;
    max-width: var(--content-width);
    width: 100%;
    margin: 0 auto;
    padding: var(--space-6) var(--space-3) var(--space-5);
    animation: rise var(--duration-slow) ease-out both;
  }
  h1 {
    font-weight: 700;
    color: var(--color-ink);
  }
  .tagline {
    margin: var(--space-3) 0 0;
    font-style: italic;
    font-size: var(--step-1);
    color: var(--color-ink-muted);
    max-width: none;
  }
  @keyframes rise {
    from { opacity: 0; transform: translateY(0.5rem); }
    to { opacity: 1; transform: none; }
  }
  @media (min-width: 48rem) {
    .hero {
      min-height: 40rem;
    }
    .bar, .title {
      padding-left: var(--space-4);
      padding-right: var(--space-4);
    }
  }
</style>
```

The veil gradient uses the `--color-ground` RGB components with alpha. Add a token `--color-ground-rgb: 13 12 18;` to `tokens.css` and write the gradient as `rgb(var(--color-ground-rgb) / 0.55)` so no literal color sits in the component. Update `tokens.css` accordingly in this task.

- [ ] **Step 4: Write BookCard.astro and BookGrid.astro**

`BookCard.astro`:
```astro
---
import type { Book } from '../lib/datocms.ts';
import { splitTitle } from '../lib/books.ts';
import DatoImage from './DatoImage.astro';

interface Props {
  book: Book;
}
const { book } = Astro.props;
const { name, series } = splitTitle(book.title);
---

<article class="card">
  <a href={`/${book.slug}`} class="cover-link">
    <DatoImage image={book.cover} class="cover" />
  </a>
  <div class="meta">
    {series && <p class="label">{series}</p>}
    <h3><a href={`/${book.slug}`}>{name}</a></h3>
  </div>
</article>

<style>
  .card {
    display: grid;
    gap: var(--space-3);
  }
  .cover-link {
    display: block;
    border-radius: var(--radius);
    transition: outline-color var(--duration-fast);
    outline: 1px solid transparent;
  }
  .cover-link:hover {
    outline-color: var(--color-accent);
  }
  .cover-link:focus-visible {
    outline: var(--ring);
    outline-offset: 2px;
  }
  .cover {
    width: 100%;
    border-radius: var(--radius);
    box-shadow: var(--shadow-cover);
    aspect-ratio: 2 / 3;
    object-fit: cover;
  }
  .meta {
    display: grid;
    gap: var(--space-1);
  }
  .label {
    margin: 0;
  }
  h3 {
    font-size: var(--step-1);
  }
  h3 a {
    color: var(--color-ink);
    text-decoration: none;
  }
  h3 a:hover {
    color: var(--color-accent-hover);
  }
</style>
```

`BookGrid.astro`:
```astro
---
import type { Book } from '../lib/datocms.ts';
import BookCard from './BookCard.astro';

interface Props {
  books: Book[];
  id?: string;
}
const { books, id } = Astro.props;
---

<ul class="grid" id={id}>
  {books.map((book) => (
    <li><BookCard book={book} /></li>
  ))}
</ul>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-5) var(--space-4);
    margin: 0;
    padding: 0;
    list-style: none;
    max-width: none;
  }
  @media (min-width: 48rem) {
    .grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>
```

- [ ] **Step 5: Write LatestBook.astro**

```astro
---
import type { Book } from '../lib/datocms.ts';
import { HERO_COVER_SIZES } from '../lib/datocms.ts';
import { splitTitle, hasPurchaseUrl } from '../lib/books.ts';
import DatoImage from './DatoImage.astro';

interface Props {
  book: Book;
}
const { book } = Astro.props;
const { name, series } = splitTitle(book.title);
---

<section class="latest" aria-labelledby="latest-title">
  <a href={`/${book.slug}`} class="cover-link">
    <DatoImage image={book.cover} sizes={HERO_COVER_SIZES} loading="eager" class="cover" />
  </a>
  <div class="body">
    <p class="label">Latest release{series ? ` · ${series}` : ''}</p>
    <h2 id="latest-title">{name}</h2>
    <div class="prose" set:html={book.descriptionHtml} />
    <div class="actions">
      <a class="button button--ghost" href={`/${book.slug}`}>About this book</a>
      {hasPurchaseUrl(book.purchaseUrl) && (
        <a class="button" href={book.purchaseUrl} rel="noopener">Buy the book</a>
      )}
    </div>
  </div>
</section>

<style>
  .latest {
    display: grid;
    gap: var(--space-5);
    align-items: start;
  }
  .cover-link {
    display: block;
    justify-self: center;
    width: min(100%, 20rem);
    border-radius: var(--radius);
    outline: 1px solid transparent;
    transition: outline-color var(--duration-fast);
  }
  .cover-link:hover {
    outline-color: var(--color-accent);
  }
  .cover {
    width: 100%;
    border-radius: var(--radius);
    box-shadow: var(--shadow-cover);
  }
  .body {
    display: grid;
    gap: var(--space-3);
  }
  .label {
    margin: 0;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
  }
  @media (min-width: 48rem) {
    .latest {
      grid-template-columns: 24rem 1fr;
      gap: var(--space-6);
    }
    .cover-link {
      width: 100%;
    }
  }
</style>
```

- [ ] **Step 6: Write AuthorIntro.astro**

```astro
---
import type { ResponsiveImage } from '../lib/datocms.ts';
import DatoImage from './DatoImage.astro';
import SectionHeading from './SectionHeading.astro';

interface Props {
  introHtml: string;
  photo: ResponsiveImage;
}
const { introHtml, photo } = Astro.props;
---

<section class="author" aria-labelledby="author-title">
  <DatoImage image={photo} class="photo" />
  <div class="body">
    <SectionHeading label="About the author" title="Renee Ross" id="author-title" />
    <div class="prose" set:html={introHtml} />
    <a class="button button--ghost" href="/about">More about Renee</a>
  </div>
</section>

<style>
  .author {
    display: grid;
    gap: var(--space-5);
    align-items: start;
  }
  .photo {
    width: min(100%, 16rem);
    border-radius: 50%;
    justify-self: center;
    box-shadow: var(--shadow-cover);
  }
  .body {
    display: grid;
    gap: var(--space-3);
  }
  @media (min-width: 48rem) {
    .author {
      grid-template-columns: 16rem 1fr;
      gap: var(--space-6);
    }
  }
</style>
```

`SectionHeading` puts its `id` on the heading element, so pass `id="author-title"` to it here to satisfy `aria-labelledby`: `<SectionHeading label="About the author" title="Renee Ross" id="author-title" />`.

- [ ] **Step 7: Write index.astro**

```astro
---
import { getCollection, getEntry } from 'astro:content';
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import LatestBook from '../components/LatestBook.astro';
import AuthorIntro from '../components/AuthorIntro.astro';
import SectionHeading from '../components/SectionHeading.astro';
import BookGrid from '../components/BookGrid.astro';
import { SITE } from '../lib/site.ts';

const books = (await getCollection('books'))
  .map((e) => e.data)
  .sort((a, b) => b.publishDate.localeCompare(a.publishDate));
const latest = books[0];
const homepage = (await getEntry('homepage', 'homepage'))!.data;
const author = (await getEntry('authorPhoto', 'author-photo'))!.data;
---

<Base title="Home" description={`${SITE.tagline}. Gothic romance novels by Renee Ross.`} home>
  <Hero tagline={SITE.tagline} />

  <div class="wrap">
    <LatestBook book={latest} />
  </div>

  <div class="wrap">
    <AuthorIntro introHtml={homepage.introHtml} photo={author.photo} />
  </div>

  <div class="wrap">
    <SectionHeading label="The books" title="Every haunting, in order" id="books" />
    <BookGrid books={books} />
  </div>
</Base>

<style>
  .wrap {
    max-width: var(--content-width);
    margin: 0 auto;
    padding: var(--space-6) var(--space-3) 0;
  }
  @media (min-width: 48rem) {
    .wrap {
      padding: var(--space-7) var(--space-4) 0;
    }
  }
</style>
```

The `getEntry(...)!` non-null assertions are acceptable because the loaders throw at build time if DatoCMS returns nothing.

- [ ] **Step 8: Build and inspect**

Run: `pnpm build`
Expected: clean build.

Run: `pnpm preview &` then `curl -s http://localhost:4321/ | grep -o '<h1[^>]*>[^<]*</h1>' | wc -l` and `curl -s http://localhost:4321/ | grep -c '<h2'`
Expected: `1` h1, at least `3` h2s (latest, author, books). Stop preview.

- [ ] **Step 9: Commit**

```bash
git add src/components src/pages/index.astro src/styles/tokens.css
git commit -m "Build homepage: hero, latest release, author intro, book grid

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Book page template

**Files:**
- Create: `src/components/BookDetail.astro`, `src/components/PageIntro.astro`

**Interfaces:**
- Consumes: `Book`, `HERO_COVER_SIZES` (Task 4), `splitTitle`, `hasPurchaseUrl`, `publishYear` (Task 3), `DatoImage` (Task 6).
- Produces: `BookDetail` props `{ book: Book }`, rendering the page `<h1>`. `PageIntro` props `{ label: string; title: string }` renders a page `<h1>` with a label, used by blog, about, success, 404.

- [ ] **Step 1: Write PageIntro.astro**

```astro
---
interface Props {
  label: string;
  title: string;
}
const { label, title } = Astro.props;
---

<div class="intro">
  <p class="label">{label}</p>
  <h1>{title}</h1>
</div>

<style>
  .intro {
    display: grid;
    gap: var(--space-2);
    margin-bottom: var(--space-5);
  }
  .label {
    margin: 0;
  }
  h1 {
    font-size: var(--step-3);
  }
</style>
```

- [ ] **Step 2: Write BookDetail.astro**

```astro
---
import type { Book } from '../lib/datocms.ts';
import { HERO_COVER_SIZES } from '../lib/datocms.ts';
import { splitTitle, hasPurchaseUrl } from '../lib/books.ts';
import { publishYear } from '../lib/dates.ts';
import DatoImage from './DatoImage.astro';

interface Props {
  book: Book;
}
const { book } = Astro.props;
const { name, series } = splitTitle(book.title);
---

<article class="book">
  <DatoImage image={book.cover} sizes={HERO_COVER_SIZES} loading="eager" class="cover" />
  <div class="body">
    <p class="label">{series ?? 'A novel'} · {publishYear(book.publishDate)}</p>
    <h1>{name}</h1>
    <div class="prose" set:html={book.descriptionHtml} />
    <div class="actions">
      {hasPurchaseUrl(book.purchaseUrl) && (
        <a class="button" href={book.purchaseUrl} rel="noopener">Buy the book</a>
      )}
      <a class="button button--ghost" href="/#books">All books</a>
    </div>
  </div>
</article>

<style>
  .book {
    display: grid;
    gap: var(--space-5);
    align-items: start;
  }
  .cover {
    width: min(100%, 20rem);
    justify-self: center;
    border-radius: var(--radius);
    box-shadow: var(--shadow-cover);
  }
  .body {
    display: grid;
    gap: var(--space-3);
  }
  .label {
    margin: 0;
  }
  h1 {
    font-size: var(--step-3);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
  }
  @media (min-width: 48rem) {
    .book {
      grid-template-columns: 22rem 1fr;
      gap: var(--space-6);
    }
    .cover {
      width: 100%;
    }
  }
</style>
```

- [ ] **Step 3: Commit (route is wired in Task 8)**

```bash
git add src/components/BookDetail.astro src/components/PageIntro.astro
git commit -m "Add book detail and page intro components

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Slug route serving books and posts, blog index, post template

**Files:**
- Create: `src/pages/[slug].astro`, `src/pages/blog.astro`, `src/components/PostDetail.astro`, `src/components/PostCard.astro`, `src/lib/routes.ts`, `tests/routes.test.ts`

**Interfaces:**
- Consumes: collections (Task 4), `formatDate` (Task 3), `BookDetail`, `PageIntro` (Task 7), `DatoImage`, `SectionHeading` (Task 6).
- Produces: `buildSlugPaths(books: {slug}[], posts: {slug}[]): Array<{ params: { slug: string }; props: { kind: 'book' | 'post' } }>` which throws on a duplicate slug.

- [ ] **Step 1: Write the failing routes test**

`tests/routes.test.ts`:
```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSlugPaths } from '../src/lib/routes.ts';

test('builds one path per book and post with a kind prop', () => {
  const paths = buildSlugPaths([{ slug: 'a-book' }], [{ slug: 'a-post' }]);
  assert.deepEqual(paths, [
    { params: { slug: 'a-book' }, props: { kind: 'book' } },
    { params: { slug: 'a-post' }, props: { kind: 'post' } },
  ]);
});

test('throws naming the slug when a book and a post collide', () => {
  assert.throws(
    () => buildSlugPaths([{ slug: 'same' }], [{ slug: 'same' }]),
    /same/,
  );
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm test`
Expected: FAIL, `routes.ts` not found.

- [ ] **Step 3: Implement routes.ts**

```ts
export type SlugKind = 'book' | 'post';

export function buildSlugPaths(
  books: Array<{ slug: string }>,
  posts: Array<{ slug: string }>,
): Array<{ params: { slug: string }; props: { kind: SlugKind } }> {
  const bookSlugs = new Set(books.map((b) => b.slug));
  const clash = posts.find((p) => bookSlugs.has(p.slug));
  if (clash) {
    throw new Error(
      `Slug "${clash.slug}" is used by both a book and a blog post. Rename one in DatoCMS.`,
    );
  }
  return [
    ...books.map((b) => ({ params: { slug: b.slug }, props: { kind: 'book' as const } })),
    ...posts.map((p) => ({ params: { slug: p.slug }, props: { kind: 'post' as const } })),
  ];
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Write PostDetail.astro and PostCard.astro**

`PostDetail.astro`:
```astro
---
import type { Post } from '../lib/datocms.ts';
import { formatDate } from '../lib/dates.ts';
import DatoImage from './DatoImage.astro';

interface Props {
  post: Post;
}
const { post } = Astro.props;
---

<article class="post">
  <header class="head">
    <p class="label">
      <a href="/blog">Blog</a> · <time datetime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
    </p>
    <h1>{post.title}</h1>
  </header>
  {post.image && <DatoImage image={post.image} loading="eager" class="figure" />}
  <div class="prose" set:html={post.contentHtml} />
  <p><a href="/blog">Back to all posts</a></p>
</article>

<style>
  .post {
    display: grid;
    gap: var(--space-5);
    max-width: var(--measure);
  }
  .head {
    display: grid;
    gap: var(--space-2);
  }
  .label {
    margin: 0;
  }
  .label a {
    color: inherit;
    text-decoration: none;
  }
  .label a:hover {
    color: var(--color-accent-hover);
  }
  h1 {
    font-size: var(--step-3);
  }
  .figure {
    width: 100%;
    border-radius: var(--radius);
    box-shadow: var(--shadow-cover);
  }
</style>
```

`PostCard.astro`:
```astro
---
import type { Post } from '../lib/datocms.ts';
import { formatDate } from '../lib/dates.ts';

interface Props {
  post: Post;
}
const { post } = Astro.props;
---

<article class="post-card">
  <p class="label"><time datetime={post.publishedAt}>{formatDate(post.publishedAt)}</time></p>
  <h2><a href={`/${post.slug}`}>{post.title}</a></h2>
  <p class="excerpt">{post.excerpt}</p>
  <p class="more"><a href={`/${post.slug}`} aria-label={`Read ${post.title}`}>Read the post</a></p>
</article>

<style>
  .post-card {
    display: grid;
    gap: var(--space-2);
    padding: var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-line);
    border-radius: var(--radius);
  }
  .label {
    margin: 0;
  }
  h2 {
    font-size: var(--step-2);
  }
  h2 a {
    color: var(--color-ink);
    text-decoration: none;
  }
  h2 a:hover {
    color: var(--color-accent-hover);
  }
  .excerpt {
    margin: 0;
    color: var(--color-ink-muted);
  }
  .more {
    margin: var(--space-2) 0 0;
  }
</style>
```

- [ ] **Step 6: Write [slug].astro**

```astro
---
import { getCollection, getEntry } from 'astro:content';
import Base from '../layouts/Base.astro';
import BookDetail from '../components/BookDetail.astro';
import PostDetail from '../components/PostDetail.astro';
import { buildSlugPaths, type SlugKind } from '../lib/routes.ts';

export async function getStaticPaths() {
  const books = (await getCollection('books')).map((e) => e.data);
  const posts = (await getCollection('posts')).map((e) => e.data);
  return buildSlugPaths(books, posts);
}

interface Props {
  kind: SlugKind;
}
const { kind } = Astro.props;
const { slug } = Astro.params;

const book = kind === 'book' ? (await getEntry('books', slug!))!.data : null;
const post = kind === 'post' ? (await getEntry('posts', slug!))!.data : null;

const title = book ? book.title : post!.title;
const description = book
  ? `${book.title}, a gothic romance by Renee Ross.`
  : post!.excerpt || `${post!.title}, from the Renee Ross Books blog.`;
---

<Base title={title} description={description}>
  <div class="wrap">
    {book && <BookDetail book={book} />}
    {post && <PostDetail post={post} />}
  </div>
</Base>

<style>
  .wrap {
    max-width: var(--content-width);
    margin: 0 auto;
    padding: var(--space-6) var(--space-3) 0;
  }
  @media (min-width: 48rem) {
    .wrap {
      padding: var(--space-7) var(--space-4) 0;
    }
  }
</style>
```

- [ ] **Step 7: Write blog.astro**

```astro
---
import { getCollection } from 'astro:content';
import Base from '../layouts/Base.astro';
import PageIntro from '../components/PageIntro.astro';
import PostCard from '../components/PostCard.astro';

const posts = (await getCollection('posts'))
  .map((e) => e.data)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
---

<Base title="Blog" description="Essays and news from gothic romance author Renee Ross.">
  <div class="wrap">
    <PageIntro label="Blog" title="Notes from the castle" />
    <ul class="posts">
      {posts.map((post) => (
        <li><PostCard post={post} /></li>
      ))}
    </ul>
  </div>
</Base>

<style>
  .wrap {
    max-width: var(--content-width);
    margin: 0 auto;
    padding: var(--space-6) var(--space-3) 0;
  }
  .posts {
    display: grid;
    gap: var(--space-4);
    margin: 0;
    padding: 0;
    list-style: none;
    max-width: none;
  }
  @media (min-width: 48rem) {
    .wrap {
      padding: var(--space-7) var(--space-4) 0;
    }
    .posts {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
```

- [ ] **Step 8: Build and verify routes**

Run: `pnpm build && ls dist | head -30`
Expected: `hawthorne-house-book-two.html`, `the-gothic-motherdead-deranged-domineering-or-disgraced.html`, `blog.html`, plus the other 14 book files, no errors.

Run: `grep -c '<img' dist/the-gothic-motherdead-deranged-domineering-or-disgraced.html`
Expected: `0` (the live post has no image; confirms Review Focus item 1). If the post has since gained an image in DatoCMS, expect `1` and note it.

- [ ] **Step 9: Commit**

```bash
git add src/pages/\[slug\].astro src/pages/blog.astro src/components/PostDetail.astro src/components/PostCard.astro src/lib/routes.ts tests/routes.test.ts
git commit -m "Add slug route for books and posts, blog index

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: Subscribe form, success page

**Files:**
- Create: `src/components/Subscribe.astro`, `src/pages/success.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `Base`, `PageIntro`, `.button` styles.
- Produces: `Subscribe` with no props, placed on the homepage between `LatestBook` and `AuthorIntro`.

- [ ] **Step 1: Write Subscribe.astro**

```astro
---
const kitAction = import.meta.env.PUBLIC_KIT_FORM_ACTION ?? '';
---

<section class="subscribe" aria-labelledby="subscribe-title">
  <div class="copy">
    <p class="label">Newsletter</p>
    <h2 id="subscribe-title">Join the mailing list</h2>
    <ul class="perks">
      <li>A free novella, <em>Terror at Fairmont Hall</em></li>
      <li>News about new releases, discounts, and giveaways</li>
    </ul>
  </div>

  <form
    class="form"
    name="subscribe"
    method="POST"
    action="/success"
    data-netlify="true"
    data-netlify-honeypot="bot-field"
    data-kit-action={kitAction}
  >
    <input type="hidden" name="form-name" value="subscribe" />
    <p class="honeypot" aria-hidden="true">
      <label for="bot-field">Leave this field empty</label>
      <input id="bot-field" name="bot-field" tabindex="-1" autocomplete="off" />
    </p>
    <div class="field">
      <label for="subscribe-name">Name</label>
      <input id="subscribe-name" type="text" name="name" autocomplete="name" required />
    </div>
    <div class="field">
      <label for="subscribe-email">Email</label>
      <input id="subscribe-email" type="email" name="email" autocomplete="email" required />
    </div>
    <button class="button" type="submit">Sign up</button>
    <p class="error" role="alert" hidden></p>
  </form>
</section>

<script>
  const form = document.querySelector<HTMLFormElement>('form[name="subscribe"]');

  if (form) {
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const error = form.querySelector<HTMLParagraphElement>('.error')!;
    const kitAction = form.dataset.kitAction ?? '';
    const idle = button.textContent ?? 'Sign up';

    if (!kitAction && import.meta.env.DEV) {
      console.warn('PUBLIC_KIT_FORM_ACTION is not set; subscribe will only reach Netlify Forms.');
    }

    async function toKit(name: string, email: string): Promise<boolean> {
      if (!kitAction) return false;
      const body = new FormData();
      body.append('email_address', email);
      body.append('fields[first_name]', name);
      const res = await fetch(kitAction, { method: 'POST', headers: { Accept: 'application/json' }, body });
      const json = (await res.json()) as { status?: string };
      return res.ok && json.status !== 'failed';
    }

    async function toNetlify(): Promise<boolean> {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form!) as unknown as Record<string, string>).toString(),
      });
      return res.ok;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
      const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();

      button.disabled = true;
      button.textContent = 'Signing up…';
      error.hidden = true;

      const [kit, netlify] = await Promise.allSettled([toKit(name, email), toNetlify()]);
      const ok =
        (kit.status === 'fulfilled' && kit.value) || (netlify.status === 'fulfilled' && netlify.value);

      if (ok) {
        window.location.assign('/success');
        return;
      }
      button.disabled = false;
      button.textContent = idle;
      error.textContent = 'Something went wrong. Please try again.';
      error.hidden = false;
    });
  }
</script>

<style>
  .subscribe {
    display: grid;
    gap: var(--space-5);
    padding: var(--space-5);
    background: var(--color-surface);
    border: 1px solid var(--color-line);
    border-radius: var(--radius);
  }
  .copy {
    display: grid;
    gap: var(--space-2);
  }
  .label {
    margin: 0;
  }
  .perks {
    margin: var(--space-2) 0 0;
    padding-left: var(--space-4);
    color: var(--color-ink-muted);
  }
  .form {
    display: grid;
    gap: var(--space-3);
    align-content: start;
  }
  .field {
    display: grid;
    gap: var(--space-1);
  }
  label {
    font-weight: 500;
  }
  input:not([type='hidden']) {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    font: inherit;
    color: var(--color-ink);
    background: var(--color-ground);
    border: 1px solid var(--color-line);
    border-radius: var(--radius);
  }
  .honeypot {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
  .error {
    margin: 0;
    color: var(--color-danger);
    font-weight: 500;
  }
  @media (min-width: 48rem) {
    .subscribe {
      grid-template-columns: 1fr 1fr;
      padding: var(--space-6);
    }
  }
</style>
```

- [ ] **Step 2: Add Subscribe to index.astro**

In `src/pages/index.astro`, import `Subscribe from '../components/Subscribe.astro'` and insert between the `LatestBook` wrap and the `AuthorIntro` wrap:
```astro
  <div class="wrap">
    <Subscribe />
  </div>
```

- [ ] **Step 3: Write success.astro**

```astro
---
import Base from '../layouts/Base.astro';
import PageIntro from '../components/PageIntro.astro';

const downloads = [
  { label: 'EPUB (most e-readers)', href: '/Terror_at_Fairmont_Hall.epub' },
  { label: 'MOBI (older Kindles)', href: '/Terror_at_Fairmont_Hall.mobi' },
  { label: 'PDF', href: '/Terror_at_Fairmont_Hall.pdf' },
];
---

<Base title="You're subscribed" description="Thank you for subscribing to Renee Ross Books.">
  <div class="wrap">
    <PageIntro label="Thank you" title="You're on the list" />
    <p>
      Please enjoy your free novella, <em>Terror at Fairmont Hall</em>. You'll also hear about
      new releases, discounts, free promotions, and the occasional giveaway.
    </p>
    <ul class="downloads">
      {downloads.map((d) => (
        <li><a class="button" href={d.href} download>Download {d.label}</a></li>
      ))}
    </ul>
  </div>
</Base>

<style>
  .wrap {
    max-width: var(--content-width);
    margin: 0 auto;
    padding: var(--space-6) var(--space-3) 0;
  }
  .downloads {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin: var(--space-4) 0 0;
    padding: 0;
    list-style: none;
    max-width: none;
  }
  @media (min-width: 48rem) {
    .wrap {
      padding: var(--space-7) var(--space-4) 0;
    }
  }
</style>
```

- [ ] **Step 4: Verify the form in dev against the live Kit endpoint**

Run: `pnpm dev` in the background, open `http://localhost:4321/`, submit the form with a real address Doug controls.
Expected: redirect to `/success`, and the address appears in the Kit subscribers list. Record the result in the task notes. The Netlify Forms POST will 404 in local dev; that is expected and the Kit success alone must still redirect.

Then in browser devtools disable JavaScript, reload, submit again.
Expected: native POST to `/success` (in local dev this shows the success page; on Netlify it also records the submission).

- [ ] **Step 5: Build and commit**

Run: `pnpm build`
Expected: clean.

```bash
git add src/components/Subscribe.astro src/pages/success.astro src/pages/index.astro
git commit -m "Add subscribe form and success page

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: About page, 404 page, final verification

**Files:**
- Create: `src/pages/about.astro`, `src/pages/404.astro`, `tests/dist.test.ts`

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Write about.astro**

```astro
---
import { getEntry } from 'astro:content';
import Base from '../layouts/Base.astro';
import PageIntro from '../components/PageIntro.astro';
import DatoImage from '../components/DatoImage.astro';

const homepage = (await getEntry('homepage', 'homepage'))!.data;
const author = (await getEntry('authorPhoto', 'author-photo'))!.data;
---

<Base title="About" description="About gothic romance author Renee Ross.">
  <div class="wrap">
    <PageIntro label="About the author" title="Renee Ross" />
    <div class="about">
      <DatoImage image={author.photo} loading="eager" class="photo" />
      <div class="prose">
        <Fragment set:html={homepage.introHtml} />
        <Fragment set:html={homepage.bodyHtml} />
      </div>
    </div>
  </div>
</Base>

<style>
  .wrap {
    max-width: var(--content-width);
    margin: 0 auto;
    padding: var(--space-6) var(--space-3) 0;
  }
  .about {
    display: grid;
    gap: var(--space-5);
    align-items: start;
  }
  .photo {
    width: min(100%, 16rem);
    border-radius: 50%;
    justify-self: center;
    box-shadow: var(--shadow-cover);
  }
  @media (min-width: 48rem) {
    .wrap {
      padding: var(--space-7) var(--space-4) 0;
    }
    .about {
      grid-template-columns: 16rem 1fr;
      gap: var(--space-6);
    }
  }
</style>
```

- [ ] **Step 2: Write 404.astro**

```astro
---
import Base from '../layouts/Base.astro';
import PageIntro from '../components/PageIntro.astro';
---

<Base title="Page not found" description="This page could not be found.">
  <div class="wrap">
    <PageIntro label="404" title="This page has wandered off into the fog" />
    <p>The page you were looking for isn't here. It may have been moved, or the link may be old.</p>
    <p class="actions">
      <a class="button" href="/">Back to the front door</a>
      <a class="button button--ghost" href="/#books">Browse the books</a>
    </p>
  </div>
</Base>

<style>
  .wrap {
    max-width: var(--content-width);
    margin: 0 auto;
    padding: var(--space-6) var(--space-3) 0;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    max-width: none;
  }
  @media (min-width: 48rem) {
    .wrap {
      padding: var(--space-7) var(--space-4) 0;
    }
  }
</style>
```

- [ ] **Step 3: Write a build-output test for heading structure and leftover Gatsby markers**

`tests/dist.test.ts`:
```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;

test('dist exists (run pnpm build first)', () => {
  assert.ok(existsSync(dist), 'dist/ missing; run pnpm build');
});

const pages = existsSync(dist) ? readdirSync(dist).filter((f) => f.endsWith('.html')) : [];

for (const file of pages) {
  const html = readFileSync(join(dist, file), 'utf8');
  test(`${file} has exactly one h1`, () => {
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
  });
  test(`${file} has a skip link and a main landmark`, () => {
    assert.match(html, /href="#main"/);
    assert.match(html, /<main id="main"/);
  });
  test(`${file} has no Gatsby, Bootstrap, or old font residue`, () => {
    assert.doesNotMatch(html, /gatsby|bootstrap|styled-components|Poppins|Tangerine|Raleway|Open\+Sans/i);
  });
  test(`${file} has no empty href or placeholder marker`, () => {
    assert.doesNotMatch(html, /href=""/);
    assert.doesNotMatch(html, /TKTK|lorem ipsum/i);
  });
}
```

- [ ] **Step 4: Build, run all tests**

Run: `pnpm build && pnpm test`
Expected: build clean, every test passes across all 20 HTML files.

- [ ] **Step 5: Repo-wide residue check**

Run: `git grep -il 'gatsby\|bootstrap\|styled-components\|poppins\|tangerine\|react-helmet\|moment' -- ':!docs' ':!pnpm-lock.yaml'`
Expected: no output. If `README.md` or another file matches, fix it.

Run: `ls package-lock.json yarn.lock 2>&1`
Expected: both "No such file".

- [ ] **Step 6: Lighthouse accessibility on every page type**

Run:
```bash
pnpm preview &
sleep 2
for p in / /about /blog /success /hawthorne-house-book-two /the-gothic-motherdead-deranged-domineering-or-disgraced /404; do
  npx --yes lighthouse@latest "http://localhost:4321$p" --only-categories=accessibility --quiet --chrome-flags="--headless=new" --output=json --output-path=stdout | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const r=JSON.parse(s);console.log(r.finalDisplayedUrl, r.categories.accessibility.score*100, Object.values(r.audits).filter(a=>a.score===0).map(a=>a.id).join(","))})'
done
kill %1
```
Expected: every page scores 100 with an empty failing-audit list. Fix anything flagged before moving on.

- [ ] **Step 7: Keyboard walk and screenshots**

With `pnpm preview` running, in a browser at 1280px wide and again at 390px wide:
1. Tab from page load: skip link appears first, Enter jumps to main.
2. At 390px: Tab to "Menu", Enter opens it, Tab through all four links and seven social icons, Escape does nothing harmful, Enter on Menu closes it.
3. At 1280px: confirm the nav panel is visible without opening anything. If it is hidden, add this script to `Nav.astro` and rebuild:
   ```astro
   <script>
     const details = document.querySelector<HTMLDetailsElement>('details.menu');
     const mq = window.matchMedia('(min-width: 48rem)');
     const sync = () => { if (details) details.open = mq.matches || details.open; };
     sync();
     mq.addEventListener('change', sync);
   </script>
   ```
4. Tab through book covers on the homepage; each shows a gold focus ring.
5. Tab to the subscribe form, fill both fields, Enter submits.
6. On `/success`, Tab reaches all three download buttons.

Take a screenshot of each of the seven pages at both widths into the scratchpad directory and review them for: no horizontal scroll, headings balanced, covers not distorted, hero gradient blending cleanly into the ground color.

- [ ] **Step 8: Commit**

```bash
git add src/pages/about.astro src/pages/404.astro tests/dist.test.ts
git commit -m "Add about and 404 pages, build output checks

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

- [ ] **Step 9: Handoff notes to Doug**

Report, in one short message:
- Netlify build settings must change to `pnpm build` and publish `dist` (the `netlify.toml` sets this, but confirm the UI does not override it), and the three env var names are new.
- The footer credit wording was changed to plain names; the original playful wording is a one-line revert if preferred.
- Every book's `purchaseUrl` is empty in DatoCMS, so no buy buttons render until Renee fills them.
- Confirm the production domain used in `astro.config.mjs`.
- Any `[should]` left unmet, named.
