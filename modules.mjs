// The ES modules (src/) and the built bundle draw the same artwork for every suite part, card preview and
// fuzz case, and the vars token mode changes colours only: same sizes, pins and overlap verdicts.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';

const ctx = { console }; ctx.window = ctx; vm.runInNewContext(readFileSync('project/generators/bundle.js', 'utf8'), ctx);
const bundle = ctx.PartsKit, esm = {};
// Every entry point's exports, as the bundle carries them on one object.
const entries = ['index', 'templates', 'primitives', 'check', 'mount', 'dom', 'element', 'controls', 'catalog', ...readdirSync('src/families').filter(f => f.endsWith('.js')).map(f => 'families/' + f.slice(0, -3))];
const byEntry = {};
for (const name of entries) if (existsSync(`src/${name}.js`)) Object.assign(esm, (byEntry[name] = await import(pathToFileURL(`src/${name}.js`).href)));
delete esm.default;
const suiteSrc = readFileSync('suite.cjs', 'utf8').match(/const S = \{[\s\S]*?\n\};/)[0].replace('const S =', 'return');
const fuzz = readFileSync('fuzz.cjs', 'utf8').split('\n'); const fuzzSrc = fuzz.slice(1, fuzz.findIndex(l => l.startsWith('let total'))).join('\n') + '\nreturn cases;';

function draw(K) {
  const out = new Map(), put = (name, art) => out.set(out.has(name) ? name + ' #' + out.size : name, art);
  for (const [n, a] of Object.entries(new Function('K', suiteSrc)(K))) put('suite · ' + n, a);
  const mount = K.mount; K.mount = (target, art, o) => { put(target.card + ' · ' + ((o && o.caption) || ''), art); return null; };
  for (const d of readdirSync('project/generators', { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    let html; try { html = readFileSync(`project/generators/${d.name}/preview.html`, 'utf8'); } catch { continue; }
    const m = /<script>\s*([\s\S]*?)\s*<\/script>/.exec(html); if (!m) continue;
    vm.runInNewContext(m[1], { window: { PartsKit: K }, PartsKit: K, document: { getElementById: () => ({ card: d.name }), querySelector: () => ({ card: d.name }) }, console });
  }
  K.mount = mount;
  new Function('K', fuzzSrc)(K).forEach(([n, make], i) => { let a; try { a = make(); } catch (e) { a = { threw: e.message }; } put('fuzz ' + i + ' · ' + n, a); });
  return out;
}

const fromBundle = draw(bundle), fromModules = draw(esm);
const problems = [];
if (Object.keys(bundle).sort().join() !== Object.keys(esm).sort().join()) problems.push('the bundle and the entry points expose different names');
if (fromModules.size !== fromBundle.size) problems.push(`artwork count ${fromModules.size} vs ${fromBundle.size}`);
for (const [k, a] of fromBundle) if (JSON.stringify(fromModules.get(k)) !== JSON.stringify(a)) problems.push('differs: ' + k);
esm.setTokenMode('vars', { prefix: 'kit-' });
const vars = draw(esm); esm.setTokenMode('live');
let tokenised = 0;
for (const [k, a] of fromBundle) {
  const b = vars.get(k); if (!a || a.threw || !b) continue;
  if (a.width !== b.width || a.height !== b.height || JSON.stringify(a.pins) !== JSON.stringify(b.pins)) problems.push('vars mode moves geometry: ' + k);
  if (JSON.stringify(bundle.check(a)) !== JSON.stringify(esm.check(b))) problems.push('vars mode changes the overlap check: ' + k);
  if (b.svg.includes('var(--kit-')) tokenised++;
}
problems.slice(0, 12).forEach(p => console.log(p));
console.log(`${fromBundle.size} artworks: ${problems.length ? problems.length + ' problems' : 'the ES modules match the bundle'}; vars mode tokenises ${tokenised}`);
process.exitCode = problems.length ? 1 : 0;
