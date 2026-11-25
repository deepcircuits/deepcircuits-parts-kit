// The brand book's contrast claims (Theme, forced colours and contrast), by WCAG 2 relative luminance.
import { BREADBOARD_COLORS } from '../src/index.js';
import { breadboardPaint } from '../src/primitives.js';
import { FALLBACK } from '../src/tokens.js';

// Each colour token's light value.
const v = n => FALLBACK[n];
/** WCAG contrast between two #rrggbb colours. */
function contrastRatio(a, b) {
  const luminance = hex => {
    const channel = value => { const s = value / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
    const n = parseInt(hex.slice(1), 16);
    return 0.2126 * channel(n >> 16 & 255) + 0.7152 * channel(n >> 8 & 255) + 0.0722 * channel(n & 255);
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
const pairs = [['silk','pcb-blue',4.5],['silk','pcb-green',4.5],['silk','pcb-teal',4.5],['silk','pcb-black',4.5],['silk','pcb-purple',4.5],['silk-dark','pcb-white',4.5],
  ['chip-print','chip',4.5],['lcd-ink','lcd-green',4.5],['lcd-ink-light','lcd-blue',4.5],['readout-text','readout',4.5],['bread-print','bread-body',4.5],
  ['cavity','pad',3],['bread-hole','bread-body',3],['canvas-ink','canvas',4.5],['canvas-ink-muted','canvas',4.5],['signal-ink','signal',4.5],['chip-print','plastic-grey',4.5]];
// Pairs the brand book reports without a floor: colour is not their only carrier.
const reported = [['level-high','level-low','a host also writes data-level and the pin tooltip carries the voltage'],['pad','pcb-white','the plated hole centre carries it']];
let fails = 0;
for (const [a, bb, floor] of pairs) { const r = contrastRatio(v(a), v(bb)); const ok = r >= floor; if (!ok) fails++; console.log((ok ? 'ok   ' : 'FAIL ') + a + ' on ' + bb + ': ' + r.toFixed(2) + ':1 (floor ' + floor + ')'); }
// The coloured breadboards are fixed paint: holes at 3:1 and print at 4.5:1 on the body, as for white.
for (const name of BREADBOARD_COLORS.filter(n => n !== 'white')) {
  const c = breadboardPaint(name);
  for (const [part, floor] of [['hole', 3], ['print', 4.5]]) { const r = contrastRatio(c[part], c.body); const ok = r >= floor; if (!ok) fails++; console.log((ok ? 'ok   ' : 'FAIL ') + name + ' breadboard ' + part + ': ' + r.toFixed(2) + ':1 (floor ' + floor + ')'); }
}
for (const [a, bb, why] of reported) console.log('info ' + a + ' beside ' + bb + ': ' + contrastRatio(v(a), v(bb)).toFixed(2) + ':1 (' + why + ')');
console.log(fails ? fails + ' pairs below their floor' : 'every claimed pair meets its floor');
process.exitCode = fails ? 1 : 0;
