// Nothing overlaps and every pin sits on the pitch, drawn by the bundle: the suite, every card preview and the fuzz
// cases (random pin names, counts, finishes and sizes).
import { drawPreviews, fuzzCases, loadBundle, suite } from './drawings.mjs';

const K = loadBundle();
const fails = [];
let count = 0;
let overlaps = 0;
function verify(name, art) {
  count++;
  const found = K.check(art);
  overlaps += found.length;
  if (found.length)
    fails.push(`${name} (${found.length}): ${found.slice(0, 8).map(p => `${p.kind} ${p.a}${p.b ? ` x ${p.b}` : ''}`).join(' | ')}`);
  if (art.pins && art.pins.length && !K.pinsOnPitch(art.pins)) fails.push(`${name}: pins off the pitch`);
}

for (const [name, art] of Object.entries(suite(K))) verify(`suite · ${name}`, art);
for (const { name, art } of drawPreviews(K)) verify(name, art);
for (const [name, make] of fuzzCases(K)) {
  let art;
  try {
    art = make();
  } catch (e) {
    fails.push(`fuzz · ${name}: threw ${e.message}`);
    continue;
  }
  verify(`fuzz · ${name}`, art);
}

for (const f of fails) console.log(f);
console.log(`${count} artworks: ${overlaps} overlaps, ${fails.length} failing`);
process.exitCode = fails.length ? 1 : 0;
