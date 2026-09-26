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
