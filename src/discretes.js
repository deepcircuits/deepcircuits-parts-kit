/** Discrete semiconductors in their through-hole packages: the transistor in TO-92 or TO-220, legs down. */
import { PIN_LABEL, art, bevel, circle, edge, lotCode, r2, rect, sheen, tag, text, textWidth, tokens } from './core.js';
import { leadPath, to92Package } from './pieces.js';

/** Each package's name, and the part and legs it draws when the caller names none. */
const PACKAGES = {
  'to-92': { name: 'TO-92', label: 'PN2222A', pins: ['E', 'B', 'C'] },
  'to-220': { name: 'TO-220', label: 'IRLZ44N', pins: ['G', 'D', 'S'] },
};

/**
 * A TO-92 part number's print in two lines, as the moulding carries it: the letters before the digits (with a
 * leading digit, as in 2N, or a letter-digit-letter series, as in P2N) above, the rest below.
 */
function printLines(label) {
  const cut = /^[A-Za-z]*\d?[A-Za-z]+(?=\d)/.exec(label);
  return cut ? [cut[0], label.slice(cut[0].length)] : [label.slice(0, 3), label.slice(3)];
}

/**
 * A TO-220AB package in front view, the printed face to the viewer, centred on cx: the metal tab with its 3.6 mm
 * hole above the 10 × 9 mm black moulding, the part number and a lot code on the moulding, and three legs 2.54 mm
 * apart, each with its wide shoulder under the moulding, trimmed to `bottom`. The `heat` hook covers the moulding.
 */
function to220Package(T, cx, bottom, label, heat) {
  const mm = T.pitch / 2.54;
  // 10 mm wide (the outline allows 9.66 to 10.67), so the edge stays inside the four-pitch box.
  const bw = 10 * mm;
  const x0 = cx - bw / 2;
  const tabTop = 0.4 * mm;
  const bodyTop = tabTop + 6.5 * mm;
  const bh = 9 * mm;
  const bodyBottom = bodyTop + bh;
  let s = '';
  // Legs first, under the body: the 1.3 mm shoulder where each leaves the moulding, then the 0.8 mm leg to the pin.
  for (let i = 0; i < 3; i++) {
    const x = cx + (i - 1) * T.pitch;
    const shoulder = bodyBottom + 2.2 * mm;
    s += tag(
      'leg',
      leadPath(T, `M${r2(x)} ${r2(shoulder - 1)}V${r2(bottom)}`) +
        rect(
          x - 0.65 * mm,
          bodyBottom - 1,
          1.3 * mm,
          shoulder - bodyBottom + 1,
          T.lead,
          Object.assign({ rx: 0.3 }, edge(T, T['lead-edge'], T['stroke-detail'])),
        ),
    );
  }
  // The tab runs on under the moulding; its hole shows the canvas through it.
  s += tag(
    'tab',
    rect(x0, tabTop, bw, bodyTop + 2 - tabTop, T.metal, Object.assign({ rx: 0.5 * mm }, edge(T, T['metal-edge']))) +
      rect(x0 + 0.8, tabTop + 0.8, bw - 1.6, bodyTop - tabTop - 0.8, sheen('metal'), {
        rx: 0.4 * mm,
        'fill-opacity': 0.7,
      }) +
      circle(cx, tabTop + 2.8 * mm, 1.8 * mm, T.hole, edge(T, T['metal-edge'], T['stroke-detail'])),
  );
  s += tag(
    'body',
    rect(x0, bodyTop, bw, bh, T['plastic-black'], Object.assign({ rx: 0.4 * mm }, edge(T, T['plastic-black-edge']))),
  );
  s += rect(x0, bodyTop, bw, bh, T['band-red'], {
    'data-hook': 'heat',
    'data-live': 'heat',
    rx: 0.4 * mm,
    'fill-opacity': r2(T['opacity-heat'] * heat),
  });
  s += bevel(T, x0, bodyTop, bw, bh, 1.4, 0.4 * mm);
  const size = Math.min(5.6, (bw - 4) / textWidth(Math.max(4, label.length), 1));
  s += text(cx, bodyTop + 0.42 * bh, label, size, T['chip-print'], {
    'dominant-baseline': 'middle',
    'font-weight': 600,
  });
  s += text(cx, bodyTop + 0.7 * bh, lotCode(label), PIN_LABEL, T['chip-print'], {
    'dominant-baseline': 'middle',
    'fill-opacity': 0.85,
  });
  return s;
}

/**
 * A transistor (or any three-leg part) standing on the bench in its package, legs down, in a 4 × 8 pitch box whose
 * legs end at the bottom edge one, two and three pitches from the left, so a TO-92 and a TO-220 put their pins in the
 * same holes. TO-92 (the default): the flat face to the viewer with the print in two lines, the legs bent out from
 * the real 1.27 mm to the pitch. TO-220: the printed face to the viewer, the tab with its hole on top. `label` is the
 * part number (PN2222A in TO-92, IRLZ44N in TO-220), `pins` the legs' names from the left (E, B, C and G, D, S), and
 * `live.heat` (0..1) warms the body.
 */
export function transistor(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const w = 4 * p;
  const h = 8 * p;
  const kind = props.package === 'to-220' ? 'to-220' : 'to-92';
  const own = PACKAGES[kind];
  const label = String(props.label || own.label);
  const names = props.pins || own.pins;
  const heat = Math.max(0, Math.min(1, Number(props.live && props.live.heat) || 0));
  const s =
    kind === 'to-220'
      ? to220Package(T, 2 * p, h, label, heat)
      : to92Package(T, 2 * p, 0.9 * p, h, printLines(label), heat);
  return art(
    w,
    h,
    `${label} in a ${own.name} package${heat > 0.8 ? ', hot' : ''}`,
    s,
    names.map((name, i) => {
      return { name, x: (i + 1) * p, y: h };
    }),
  );
}
