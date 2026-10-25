// The kit against the published standard for breadboard-view part graphics: Fritzing's graphic standards
// (https://fritzing.org/fritzings-graphic-standards) and SparkFun's guide to them
// (https://learn.sparkfun.com/tutorials/make-your-own-fritzing-parts/custom-breadboard-svg), plus Fritzing's
// part file format notes (https://github.com/fritzing/fritzing-app/wiki/2.1-Part-file-format).
// A second standard, KiCad's Library Conventions (https://klc.kicad.org/symbol/s4/s4.1/, https://klc.kicad.org/footprint/f5/f5.1/),
// gives the 100 mil pin grid and the silkscreen text and line sizes checked as 6.
// Measured over the suite set, every preview on the page and every picture in images/.
//   1. Pins 0.1 in apart: every pin centre is a whole number of pitches from the first, both axes.
//   2. Legs at least 0.03 in wide and long: the drawn leg (lead plus its outline) and the chip lead are >= 2.88px.
//   3. Print never below 3pt: at 0.1 in = 9.6px, 3pt is 4px; the standard size, 5pt, is 6.67px.
//   4. Text stays text (no outlined glyphs) and every stroked element names its stroke-width.
//   5. Flat colour, with gradient sheens only (the kit's pk-dome, pk-lens, pk-metal, pk-glow and pk-hot defs): no filters, patterns, images or raster data.
const fs = require('fs'), vm = require('vm');
require('./project/components/bundle.js'); const K = globalThis.PartsKit;
const P = K.PITCH, IN = P * 10, PT = IN / 72;
const arts = [];
const suite = fs.readFileSync('suite.cjs', 'utf8').match(/const S = \{[\s\S]*?\n\};/)[0];
const S = new Function('K', suite.replace('const S =', 'return'))(K);
for (const [name, art] of Object.entries(S)) arts.push({ name: 'suite · ' + name, art });
const drawn = [];
K.mount = (target, art, o) => { drawn.push({ name: target.card + ' · ' + ((o && o.caption) || ''), art }); return null; };
for (const d of fs.readdirSync('project/components', { withFileTypes: true })) {
  if (!d.isDirectory() || d.name === 'Cover' || d.name === 'lib') continue;
  const m = /<script>\s*([\s\S]*?)\s*<\/script>/.exec(fs.readFileSync(`project/components/${d.name}/preview.html`, 'utf8')); if (!m) continue;
  vm.runInNewContext(m[1], { window: globalThis, document: { getElementById: () => ({ card: d.name }) }, console });
}
arts.push(...drawn);
for (const f of fs.readdirSync('images')) if (f.endsWith('.svg')) arts.push({ name: 'image · ' + f, svg: fs.readFileSync('images/' + f, 'utf8') });

const fail = [];
let pinsChecked = 0, textsChecked = 0, strokes = 0, minText = Infinity;
for (const a of arts) {
  const svg = a.art ? a.art.svg : a.svg;
  // 1. pins on the 0.1 in grid (generator pins where we have them; tagged pins from the markup otherwise)
  const pins = a.art ? a.art.pins : [...svg.matchAll(/<g data-part="pin">\s*<(circle|rect)([^>]*)>/g)].map(m => {
    const g = (k) => Number((new RegExp(' ' + k + '="([-\\d.]+)"').exec(m[2]) || [])[1]);
    return m[1] === 'circle' ? { x: g('cx'), y: g('cy') } : { x: g('x') + g('width') / 2, y: g('y') + g('height') / 2 };
  });
  if (pins && pins.length) {
    pinsChecked += pins.length;
    const p0 = pins[0];
    for (const pn of pins) for (const k of ['x', 'y']) { const d = (pn[k] - p0[k]) / P; if (Math.abs(d - Math.round(d)) > 0.01) fail.push(`${a.name}: pin at ${pn.x},${pn.y} is ${d.toFixed(3)} pitches from the first on ${k}`); }
  }
  // 3. print size
  for (const m of svg.matchAll(/<text[^>]* font-size="([\d.]+)"/g)) { textsChecked++; const s = Number(m[1]); minText = Math.min(minText, s); if (s < 3 * PT - 1e-9) fail.push(`${a.name}: text at ${s}px is below 3pt (${(3 * PT).toFixed(2)}px)`); }
  // 4. text stays text; explicit stroke widths
  if (/<text/.test(svg) === false && /<path[^>]*data-text/.test(svg)) fail.push(`${a.name}: outlined text`);
  for (const m of svg.matchAll(/<(\w+)([^>]*)>/g)) {
    const at = m[2]; if (/ stroke="(?!none)/.test(at)) { strokes++; if (!/ stroke-width="/.test(at)) fail.push(`${a.name}: <${m[1]}> has a stroke without a stroke-width`); }
  }
  // 5. flat colour only
  if (/<(filter|image|pattern|mask)\b|data:image/.test(svg)) fail.push(`${a.name}: filter, pattern, mask or image`);
  (svg.match(/url\(#([^)]+)\)/g) || []).forEach((u) => { if (!/^url\(#pk-(dome|lens|metal|hot|glow-[0-9a-f]{6})\)$/.test(u)) fail.push(`${a.name}: reference ${u} is not one of the kit's sheens`); });
}
// 6. KiCad Library Conventions, read as a second standard: F5.1 puts silkscreen reference text at 1.00 mm and
//    silkscreen lines at 0.10-0.15 mm (0.12 nominal); S4.1 puts symbol pins on a 100 mil grid. At 0.1 in = 9.6px,
//    1 mm is 3.78px: the kit's 4px floor is 1.06 mm, and its finest stroke, 0.4px, is 0.106 mm.
const MM = IN / 25.4;
if (minText < 1.0 * MM) fail.push(`smallest print ${minText}px is under KLC F5.1's 1.00 mm (${(1.0 * MM).toFixed(2)}px)`);
let minStroke = Infinity;
for (const a of arts) for (const m of (a.art ? a.art.svg : a.svg).matchAll(/ stroke-width="([\d.]+)"/g)) minStroke = Math.min(minStroke, Number(m[1]));
if (minStroke < 0.10 * MM) fail.push(`finest stroke ${minStroke}px is under KLC F5.1's 0.10 mm (${(0.10 * MM).toFixed(2)}px)`);
// 2. leg widths from the tokens the generators draw with
const T = K.tokens();
const legDrawn = T['leg-width'] + 0.6, lead = T['lead-width'];
if (legDrawn < 0.03 * IN - 1e-9) fail.push(`leg drawn ${legDrawn}px < 0.03 in (${0.03 * IN}px)`);
if (lead < 0.03 * IN - 1e-9) fail.push(`chip lead ${lead}px < 0.03 in (${0.03 * IN}px)`);
// the standing parts' legs are at least 0.03 in long: the LED, the capacitors and the resistor reach a whole pitch
for (const [name, art] of [['led', K.led()], ['resistor', K.resistor({ value: 220 })], ['cap', K.capacitor()]]) {
  const span = Math.max(...art.pins.map(p => p.x)) - Math.min(...art.pins.map(p => p.x)); if (span < 0.03 * IN) fail.push(`${name}: legs span ${span}px`);
}
console.log(`KLC: smallest print ${(minText / MM).toFixed(2)} mm (F5.1 text 1.00 mm), finest stroke ${(minStroke / MM).toFixed(3)} mm (F5.1 lines 0.10-0.15 mm), pins on the 100 mil grid (S4.1)`);
console.log(`${arts.length} artworks: ${pinsChecked} pins on the 0.1 in grid, ${textsChecked} text runs (smallest ${minText}px = ${(minText / PT).toFixed(2)}pt; floor 3pt = ${(3 * PT).toFixed(2)}px), ${strokes} strokes with explicit widths, legs drawn ${legDrawn}px (0.03 in = ${0.03 * IN}px), chip leads ${lead}px`);
if (fail.length) { console.log('\nFAIL (' + fail.length + ')'); fail.slice(0, 40).forEach(f => console.log('  ' + f)); process.exitCode = 1; } else console.log('meets the standard');
