#!/usr/bin/env node
// The kit's tokens as CSS custom properties, with your prefix and theme selectors.
//   npx parts-kit-tokens [--prefix kit-] [--light ':root'] [--dark '[data-theme="dark"]'] [--out kit-tokens.css]
// Without --out the stylesheet goes to standard output.
import { readFileSync, writeFileSync } from 'node:fs';
import { tokensCss } from '../tokens-css.mjs';

const arg = name => { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : undefined; };
const tokens = JSON.parse(readFileSync(new URL('../project/tokens.json', import.meta.url), 'utf8'));
const css = tokensCss(tokens, { prefix: arg('prefix'), light: arg('light'), dark: arg('dark') });
const out = arg('out');
if (out) { writeFileSync(out, css); console.error(out, css.length, 'bytes'); } else process.stdout.write(css);
