// The catalog (src/catalog.js): every entry draws at rest with nothing overlapping and its pins on the pitch,
// ids are unique kebab-case, and every preset generator (src/presets.js) has an entry.
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const K = { ...(await import(pathToFileURL('src/index.js').href)), ...(await import(pathToFileURL('src/check.js').href)) };
const FAMILIES = ['board', 'display', 'sensor', 'input', 'output', 'module', 'chip', 'passive', 'breadboard', 'symbol'];
const problems = [], ids = new Set();
for (const e of K.CATALOG) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.id)) problems.push(`${e.id}: not a kebab-case id`);
  if (ids.has(e.id)) problems.push(`${e.id}: listed twice`);
  ids.add(e.id);
  if (!FAMILIES.includes(e.family)) problems.push(`${e.id}: unknown family ${e.family}`);
  if (typeof K[e.fn] !== 'function') { problems.push(`${e.id}: PartsKit has no ${e.fn}`); continue; }
  if (!e.name || !Array.isArray(e.state)) problems.push(`${e.id}: needs a name and a state list`);
  let art;
  try { art = K.drawPart(e.id); } catch (err) { problems.push(`${e.id}: throws ${err.message}`); continue; }
  if (!art.svg || !art.pins) problems.push(`${e.id}: not an Artwork`);
  const overlaps = K.check(art);
  if (overlaps.length) problems.push(`${e.id}: ${overlaps.length} overlaps`);
  if (art.pins.length && !K.pinsOnPitch(art.pins)) problems.push(`${e.id}: pins off the pitch`);
}
const listed = new Set(K.CATALOG.map(e => e.fn));
for (const [, name] of readFileSync('src/presets.js', 'utf8').matchAll(/^export function (\w+)/gm)) if (!listed.has(name)) problems.push(`${name}: a catalog generator with no entry`);
try { K.drawPart('no-such-part'); problems.push('drawPart accepts an unknown id'); } catch { /* expected */ }

for (const p of problems) console.log('FAIL', p);
console.log(problems.length ? `${problems.length} problems` : `catalog index ok: ${K.CATALOG.length} parts in ${new Set(K.CATALOG.map(e => e.family)).size} families`);
process.exit(problems.length ? 1 : 0);
