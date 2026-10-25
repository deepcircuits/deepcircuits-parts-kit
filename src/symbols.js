/** Symbols drawn in currentColor: logic gates, the multiplexer, flip-flops, the clock generator, supply and note symbols. */
import { PIN_LABEL, art, circle, line, path, r2, rect, text, tokens } from './core.js';

const INVERTED = { nand: 1, nor: 1, xnor: 1, not: 1 };
const GATE_NAMES = {
  and: 'AND',
  nand: 'NAND',
  or: 'OR',
  nor: 'NOR',
  xor: 'XOR',
  xnor: 'XNOR',
  not: 'NOT',
  buffer: 'Buffer',
};
/** An IEEE distinctive-shape logic gate in currentColor: inputs two pitches apart, the output on the grid. Output leads carry data-level-pin. */
export function logicSymbol(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const gate = props.gate || 'and';
  const single = gate === 'not' || gate === 'buffer';
  const n = single ? 1 : Math.max(2, Math.min(8, props.inputs || 2));
  const height = (single ? 2 : n * 2) * p;
  const inputY = function (i) {
    return single ? p : p * (1 + 2 * i);
  };
  const outY = single ? p : n * p;
  const width = 6 * p;
  const x0 = 1.2 * p;
  const x1 = 4.6 * p;
  const y0 = 0.3 * p;
  const y1 = height - 0.3 * p;
  const cy = outY;
  const hh = (y1 - y0) / 2;
  const bubble = INVERTED[gate] ? 2.6 : 0;
  let orFamily = /or$/.test(gate) && gate !== 'xor' && gate !== 'xnor' ? true : gate === 'or' || gate === 'nor';
  const exclusive = gate === 'xor' || gate === 'xnor';
  orFamily = gate === 'or' || gate === 'nor' || exclusive;
  const st = {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': T['stroke-symbol'],
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round',
  };
  let s = '';
  let body;
  if (single) body = path(`M${r2(x0)} ${r2(y0)}L${r2(x1 - bubble * 2)} ${r2(cy)}L${r2(x0)} ${r2(y1)}z`, 'none', st);
  else if (orFamily) {
    const inX = x0 + (exclusive ? 0.5 * p : 0);
    const bodyEnd = x1 - bubble * 2;
    body = path(
      `M${r2(inX)} ${r2(y0)}Q${r2(inX + hh * 0.5)} ${r2(cy)} ${r2(inX)} ${r2(y1)}Q${r2(inX + hh * 1.2)} ${r2(y1)} ${r2(bodyEnd)} ${r2(cy)}Q${r2(inX + hh * 1.2)} ${r2(y0)} ${r2(inX)} ${r2(y0)}z`,
      'none',
      st,
    );
    if (exclusive) body += path(`M${r2(x0)} ${r2(y0)}Q${r2(x0 + hh * 0.5)} ${r2(cy)} ${r2(x0)} ${r2(y1)}`, 'none', st);
  } else
    body = path(
      `M${r2(x0)} ${r2(y0)}H${r2(x1 - bubble * 2 - hh)}A${r2(hh)} ${r2(hh)} 0 0 1 ${r2(x1 - bubble * 2 - hh)} ${r2(y1)}H${r2(x0)}z`,
      'none',
      st,
    );
  const pins = [];
  for (let i = 0; i < n; i++) {
    const y = inputY(i);
    const lx = orFamily ? x0 + (exclusive ? 0.5 * p : 0) + hh * 0.5 * (1 - Math.pow((y - cy) / hh, 2)) : x0;
    s += line(0, y, Math.max(x0, lx), y, 'currentColor', T['stroke-symbol']);
    pins.push({ name: (props.inputNames || [])[i] || (single ? 'IN' : String.fromCharCode(65 + i)), x: 0, y });
  }
  s += body;
  if (bubble) s += circle(x1 - bubble, cy, bubble, 'none', st);
  s += line(x1, cy, width, cy, 'currentColor', T['stroke-symbol'], { 'data-level-pin': n });
  pins.push({ name: props.outputName || 'OUT', x: width, y: cy });
  return art(width, height, `${GATE_NAMES[gate]} gate`, s, pins);
}

const SYM = function (T) {
  return {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': T['stroke-symbol'],
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round',
  };
};
const symText = function (x, y, s, size, more) {
  return text(x, y, s, size || PIN_LABEL, 'currentColor', more);
};

/** The 2-input multiplexer in currentColor: A (0) and B (1) on the left, SEL below, OUT on the right (data-level-pin 3). */
export function muxSymbol(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const w = 6 * p;
  const h = 4 * p;
  const x0 = 1.6 * p;
  const x1 = 4.4 * p;
  const inset = 0.6 * p;
  const st = SYM(T);
  let s = '';
  const selTop = h - 0.3 * p - (inset * (3 * p - x0)) / (x1 - x0);
  s +=
    line(0, p, x0, p, 'currentColor', T['stroke-symbol']) +
    line(0, 3 * p, x0, 3 * p, 'currentColor', T['stroke-symbol']);
  s += line(3 * p, h, 3 * p, selTop, 'currentColor', T['stroke-symbol']);
  s += line(x1, 2 * p, w, 2 * p, 'currentColor', T['stroke-symbol'], { 'data-level-pin': 3 });
  s += path(
    `M${r2(x0)} ${r2(0.3 * p)}L${r2(x1)} ${r2(0.3 * p + inset)}L${r2(x1)} ${r2(h - 0.3 * p - inset)}L${r2(x0)} ${r2(h - 0.3 * p)}Z`,
    'none',
    st,
  );
  s += symText(x0 + 4.2, p + 1.5, '0') + symText(x0 + 4.2, 3 * p + 1.5, '1');
  const names = props.pins || ['A', 'B', 'SEL', 'OUT'];
  return art(w, h, '2-input multiplexer', s, [
    { name: names[0], x: 0, y: p },
    { name: names[1], x: 0, y: 3 * p },
    { name: names[2], x: 3 * p, y: h },
    { name: names[3], x: w, y: 2 * p },
  ]);
}

/** The D flip-flop box: D and the clock wedge on the left, Q and Q-bar on the right (data-level-pin), S above and R below when set/reset are on. */
export function flipFlopSymbol(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const w = 6 * p;
  const h = 4 * p;
  const x0 = 1.2 * p;
  const x1 = 4.8 * p;
  const y0 = 0.4 * p;
  const y1 = h - 0.4 * p;
  const st = SYM(T);
  let s = '';
  const sw = T['stroke-symbol'];
  // Pins in the catalog's handle order: S and R sit before Q on the set/reset types, after NOTQ on the plain D type (srLast).
  let pins = [
    { name: 'D', x: 0, y: p },
    { name: 'CLK', x: 0, y: 3 * p },
  ];
  const sr = [];
  if (props.set) sr.push({ name: 'S', x: 3 * p, y: 0 });
  if (props.reset) sr.push({ name: 'R', x: 3 * p, y: h });
  if (!props.srLast) pins = pins.concat(sr);
  const qIndex = pins.length;
  pins.push({ name: 'Q', x: w, y: p }, { name: 'NOTQ', x: w, y: 3 * p });
  if (props.srLast) pins = pins.concat(sr);
  s += line(0, p, x0, p, 'currentColor', sw) + line(0, 3 * p, x0, 3 * p, 'currentColor', sw);
  s +=
    line(x1, p, w, p, 'currentColor', sw, { 'data-level-pin': qIndex }) +
    line(x1, 3 * p, w, 3 * p, 'currentColor', sw, { 'data-level-pin': qIndex + 1 });
  if (props.set) s += line(3 * p, 0, 3 * p, y0, 'currentColor', sw) + symText(3 * p, y0 + PIN_LABEL + 0.6, 'S');
  if (props.reset) s += line(3 * p, h, 3 * p, y1, 'currentColor', sw) + symText(3 * p, y1 - 1.4, 'R');
  s += rect(x0, y0, x1 - x0, y1 - y0, 'none', st);
  s += path(`M${r2(x0)} ${r2(3 * p - 2.4)}L${r2(x0 + 3.2)} ${r2(3 * p)}L${r2(x0)} ${r2(3 * p + 2.4)}`, 'none', st);
  s +=
    symText(x0 + 1.6, p + 1.5, 'D', PIN_LABEL, { 'text-anchor': 'start' }) +
    symText(x1 - 1.6, p + 1.5, 'Q', PIN_LABEL, { 'text-anchor': 'end' }) +
    symText(x1 - 1.6, 3 * p + 1.5, 'Q', PIN_LABEL, { 'text-anchor': 'end' });
  s += line(x1 - 4.2, 3 * p - 2.9, x1 - 1.6, 3 * p - 2.9, 'currentColor', 0.6);
  return art(
    w,
    h,
    `D flip-flop${props.set && props.reset ? ' with set and reset' : props.reset ? ' with reset' : props.set ? ' with set' : ''}`,
    s,
    pins,
  );
}

/** The clock generator: a box with a square-wave glyph, CLK out on the right (data-level-pin 0) and GND below, both on the grid. */
export function clockGenerator(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const w = 5 * p;
  const h = 4 * p;
  const x0 = 0.4 * p;
  const x1 = 3.8 * p;
  const y0 = 0.4 * p;
  const y1 = h - 1.2 * p;
  const st = SYM(T);
  let s = '';
  const sw = T['stroke-symbol'];
  s += rect(x0, y0, x1 - x0, y1 - y0, 'none', Object.assign({ rx: 2 }, st));
  s += path(`M${r2(x0 + 4)} ${r2(2 * p + 2)}h4v-8h6v8h6v-8h6v8h4`, 'none', st);
  s += line(x1, 2 * p, w, 2 * p, 'currentColor', sw, { 'data-level-pin': 0 });
  s += line(2 * p, y1, 2 * p, h, 'currentColor', sw);
  s += symText((x0 + x1) / 2, y1 - 1.2, props.label || 'CLK');
  return art(w, h, 'Clock generator', s, [
    { name: 'CLK', x: w, y: 2 * p },
    { name: 'GND', x: 2 * p, y: h },
  ]);
}

/** The supply symbol: a bar over one pin at the bottom, captioned with its voltage. */
export function supplySymbol(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const w = 3 * p;
  const h = 3 * p;
  const sw = T['stroke-symbol'];
  let s = '';
  const v = props.voltage === undefined ? 'VCC' : `${String(props.voltage)}V`;
  s +=
    line(0.5 * p, 1.3 * p, 2.5 * p, 1.3 * p, 'currentColor', sw) +
    line(1.5 * p, 1.3 * p, 1.5 * p, h, 'currentColor', sw);
  s += symText(1.5 * p, 1.3 * p - 3.2, v, 5.5, { 'font-weight': 600 });
  return art(w, h, `Supply ${v}`, s, [{ name: 'VCC', x: 1.5 * p, y: h }]);
}

/** The library picture for a canvas note: a serif T in currentColor; the canvas draws the note's own text. */
export function noteSymbol() {
  const T = tokens();
  const st = SYM(T);
  return art(32, 32, 'Text note', path('M7 9V6h18v3M16 6v20M12 26h8', 'none', st), []);
}
