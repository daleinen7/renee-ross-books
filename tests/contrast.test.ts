import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { contrast } from '../src/lib/contrast.ts';

const tokensPath = new URL('../src/styles/tokens.css', import.meta.url);
const css = existsSync(tokensPath) ? readFileSync(tokensPath, 'utf8') : '';

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
