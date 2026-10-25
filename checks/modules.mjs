// The ES modules (src/) and the built bundle draw the same artwork for every suite part, card preview and fuzz case,
// and the vars token mode changes colours only: same sizes, pins and overlap verdicts.
import { readFileSync } from 'node:fs';
import { drawPreviews, fuzzCases, loadBundle, suite } from './drawings.mjs';

const bundle = loadBundle();
// Every entry point's exports (package.json "exports"), as the bundle carries them on one object.
const { exports } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const esm = {};
for (const { default: file } of Object.values(exports))
  if (file?.startsWith('./src/')) Object.assign(esm, await import(new URL(`.${file}`, import.meta.url).href));
delete esm.default;

function draw(K) {
  const out = new Map();
  const put = (name, art) => out.set(out.has(name) ? `${name} #${out.size}` : name, art);
  for (const [n, a] of Object.entries(suite(K))) put(`suite · ${n}`, a);
  for (const { name, art } of drawPreviews(K)) put(name, art);
  fuzzCases(K).forEach(([n, make], i) => {
    let a;
    try {
      a = make();
    } catch (e) {
      a = { threw: e.message };
    }
    put(`fuzz ${i} · ${n}`, a);
  });
  return out;
}

const fromBundle = draw(bundle);
const fromModules = draw(esm);
const problems = [];
if (Object.keys(bundle).sort().join() !== Object.keys(esm).sort().join())
  problems.push('the bundle and the entry points expose different names');
if (fromModules.size !== fromBundle.size) problems.push(`artwork count ${fromModules.size} vs ${fromBundle.size}`);
for (const [k, a] of fromBundle) if (JSON.stringify(fromModules.get(k)) !== JSON.stringify(a)) problems.push(`differs: ${k}`);
esm.setTokenMode('vars', { prefix: 'kit-' });
const vars = draw(esm);
esm.setTokenMode('live');
let tokenised = 0;
for (const [k, a] of fromBundle) {
  const b = vars.get(k);
  if (!a || a.threw || !b) continue;
  if (a.width !== b.width || a.height !== b.height || JSON.stringify(a.pins) !== JSON.stringify(b.pins))
    problems.push(`vars mode moves geometry: ${k}`);
  if (JSON.stringify(bundle.check(a)) !== JSON.stringify(esm.check(b))) problems.push(`vars mode changes the overlap check: ${k}`);
  if (b.svg.includes('var(--kit-')) tokenised++;
}
problems.slice(0, 12).forEach(p => console.log(p));
console.log(
  `${fromBundle.size} artworks: ${problems.length ? `${problems.length} problems` : 'the ES modules match the bundle'}; vars mode tokenises ${tokenised}`,
);
process.exitCode = problems.length ? 1 : 0;
