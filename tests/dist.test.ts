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

test('image classes passed into DatoImage are not scoped away', () => {
  const cssDir = join(dist, '_astro');
  const css = existsSync(cssDir)
    ? readdirSync(cssDir)
        .filter((f) => f.endsWith('.css'))
        .map((f) => readFileSync(join(cssDir, f), 'utf8'))
        .join('\n')
    : '';
  for (const cls of ['cover', 'photo', 'figure']) {
    assert.doesNotMatch(css, new RegExp(`\\.${cls}\\[data-astro-cid-`), `.${cls} is scoped to a parent cid and will not reach the img`);
  }
});

for (const file of pages) {
  const html = readFileSync(join(dist, file), 'utf8');
  test(`${file} ships primary nav links in static markup with the disclosure open`, () => {
    for (const href of ['href="/about"', 'href="/#books"', 'href="/blog"']) assert.match(html, new RegExp(href));
    assert.match(html, /<details class="menu"[^>]*\sopen/);
  });
}

test('book cards with a series carry it inside the heading link name', () => {
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.match(html, /Hawthorne House<span class="visually-hidden"[^>]*>, Book Two<\/span>/);
});

test('no unpinned check script in package.json', () => {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.scripts.check, undefined);
});
