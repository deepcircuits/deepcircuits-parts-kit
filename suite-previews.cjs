// Run every component preview's script with mount stubbed, and check each artwork it draws.
const fs = require('fs'), vm = require('vm');
require('./project/components/bundle.js'); const K = globalThis.PartsKit;
const arts = [];
K.mount = (target, art, o) => { arts.push({ card: target.card, caption: (o && o.caption) || '', art }); return null; };
const names = fs.readdirSync('project/components', { withFileTypes: true }).filter(d => d.isDirectory() && d.name !== 'Cover' && d.name !== 'lib').map(d => d.name);
let total = 0, count = 0;
for (const name of names) {
  const html = fs.readFileSync(`project/components/${name}/preview.html`, 'utf8');
  const m = /<script>\s*([\s\S]*?)\s*<\/script>/.exec(html); if (!m) continue;
  arts.length = 0;
  const ctx = { window: globalThis, document: { getElementById: () => ({ card: name }) }, console };
  vm.runInNewContext(m[1], ctx);
  for (const { caption, art } of arts) {
    count++;
    const pr = K.check(art); total += pr.length;
    if (pr.length) { console.log(`== ${name} · ${caption} (${pr.length})`); pr.slice(0, 8).forEach(p => console.log('  ' + p.kind + ': ' + p.a + (p.b ? '  x  ' + p.b : ''))); }
    if (art.pins && art.pins.length && !K.pinsOnPitch(art.pins)) { console.log(`== ${name} · ${caption}: OFF PITCH`); total++; }
  }
}
console.log(`\n${count} artworks from ${names.length} cards, TOTAL ${total}`);
process.exitCode = total ? 1 : 0;
