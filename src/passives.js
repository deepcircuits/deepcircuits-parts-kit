/** Two- and three-leg parts in front elevation: wire legs, the resistor and its colour code, LEDs (single and RGB), capacitors and the buzzer. */
import {
  PIN_LABEL,
  art,
  circle,
  edge,
  el,
  flow,
  lensColor,
  line,
  path,
  probe,
  r2,
  rect,
  sheen,
  tag,
  text,
  tokens,
} from './core.js';

/** A tinned wire leg: a metal-edge line under a lead line, so it reads as round wire. */
export function wire(x1, y1, x2, y2) {
  const T = tokens();
  return (
    line(x1, y1, x2, y2, T['lead-edge'], T['leg-width'] + 0.6) + line(x1, y1, x2, y2, T.lead, T['leg-width'] - 0.4)
  );
}
function wirePath(d) {
  const T = tokens();
  return (
    path(d, 'none', {
      stroke: T['lead-edge'],
      'stroke-width': T['leg-width'] + 0.6,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    }) +
    path(d, 'none', {
      stroke: T.lead,
      'stroke-width': T['leg-width'] - 0.4,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    })
  );
}
/** Two translucent overlays that give a cylinder its volume: a light along the top or left, a shade along the bottom or right. */
function shadeH(x, y, w, h) {
  const T = tokens();
  return (
    rect(x + 0.6, y + h * 0.1, w - 1.2, h * 0.18, '#ffffff', { rx: h * 0.09, 'fill-opacity': T['opacity-light'] }) +
    rect(x + 0.6, y + h * 0.74, w - 1.2, h * 0.2, '#000000', { rx: h * 0.1, 'fill-opacity': T['opacity-shade'] })
  );
}
function shadeV(x, y, w, h) {
  const T = tokens();
  return (
    rect(x + w * 0.1, y + 0.8, w * 0.16, h - 1.6, '#ffffff', { rx: w * 0.08, 'fill-opacity': T['opacity-light'] }) +
    rect(x + w * 0.74, y + 0.8, w * 0.2, h - 1.6, '#000000', { rx: w * 0.1, 'fill-opacity': T['opacity-shade'] })
  );
}

const BANDS = [
  'band-black',
  'band-brown',
  'band-red',
  'band-orange',
  'band-yellow',
  'band-green',
  'band-blue',
  'band-violet',
  'band-grey',
  'band-white',
];
/** The four bands for a resistance in ohms: two digits, a multiplier and the tolerance. */
export function resistorBands(ohms, tolerance) {
  const v = Math.max(0.01, Number(ohms) || 0);
  let e = Math.floor(Math.log10(v));
  let digits = Math.round(v / Math.pow(10, e - 1));
  if (digits >= 100) {
    digits = Math.round(digits / 10);
    e += 1;
  }
  const mult = e - 1;
  const multiplier = mult === -1 ? 'band-gold' : mult === -2 ? 'band-silver' : BANDS[Math.max(0, Math.min(9, mult))];
  return [
    BANDS[Math.floor(digits / 10)],
    BANDS[digits % 10],
    multiplier,
    tolerance === 10 ? 'band-silver' : 'band-gold',
  ];
}
export function formatOhms(ohms) {
  const v = Number(ohms) || 0;
  const u = v >= 1e6 ? [1e6, 'MΩ'] : v >= 1e3 ? [1e3, 'kΩ'] : [1, 'Ω'];
  const n = v / u[0];
  return `${(Math.round(n * 100) / 100).toString().replace(/\.0+$/, '')} ${u[1]}`;
}
/**
 * A quarter-watt axial resistor lying flat, legs `span` pitches apart (4
 * unless given, at least 3, as the leads are bent): the dog-bone body
 * (wider end caps on a narrower middle), four bands on the middle, and
 * light and shade along the cylinder. value in ohms.
 */
export function resistor(props) {
  const span = Math.max(3, Math.round(Number(props && props.span) || 4));
  const T = tokens();
  const p = T.pitch;
  const w = span * p;
  const h = 2 * p;
  const y = p;
  let s = '';
  // ohms; value is its old name.
  const value =
    props && props.ohms !== undefined ? props.ohms : props && props.value !== undefined ? props.value : 1000;
  s += wire(0, y, w, y);
  const mm = p / 2.54;
  const bx = (w - 6.3 * mm) / 2;
  const bw = 6.3 * mm;
  const mh = 2.1 * mm;
  const capW = 1.3 * mm;
  const capH = 2.5 * mm;
  const midX = bx + capW;
  const midW = bw - 2 * capW;
  const bodyEdge = edge(T, T['resistor-body-edge'], T['stroke-detail']);
  s += tag(
    'body',
    rect(midX - 1, y - mh / 2, midW + 2, mh, T['resistor-body'], bodyEdge) +
      rect(bx, y - capH / 2, capW, capH, T['resistor-body'], Object.assign({ rx: capW * 0.45 }, bodyEdge)) +
      rect(bx + bw - capW, y - capH / 2, capW, capH, T['resistor-body'], Object.assign({ rx: capW * 0.45 }, bodyEdge)),
  );
  // The bands read left to right: first digit, second digit, multiplier, then the tolerance band after a wider gap, as the code is read.
  const bands = resistorBands(value, props && props.tolerance);
  const bandW = 0.62 * mm;
  const gap = 0.42 * mm;
  const x0 = bx + 1.14 * mm;
  const xs = [x0, x0 + bandW + gap, x0 + 2 * (bandW + gap), x0 + 3 * bandW + 2 * gap + 0.7 * mm];
  bands.forEach((name, i) => {
    s += rect(xs[i], y - mh / 2 + 0.3, bandW, mh - 0.6, T[name], {
      'data-band': i + 1,
      stroke:
        name === 'band-white' || name === 'band-yellow' || name === 'band-gold' || name === 'band-silver'
          ? T['resistor-body-edge']
          : undefined,
      'stroke-width': T['stroke-fine'],
    });
  });
  const live = (props && props.live) || {};
  const heat = Math.max(0, Math.min(1, Number(live.heat) || 0));
  s += rect(bx, y - capH / 2, bw, capH, T['band-red'], {
    'data-hook': 'heat',
    'data-live': 'heat',
    rx: capW * 0.45,
    'fill-opacity': r2(T['opacity-heat'] * heat),
  });
  s += shadeH(bx, y - capH / 2, bw, capH);
  s += flow(0, y, bx, y, live.flow, 'flow-1') + flow(bx + bw, y, w, y, live.flow, 'flow-2');
  if (live.probe) s += probe(live.probe === '2' ? w : 0, y);
  return art(w, h, `${formatOhms(value)} resistor${heat > 0.8 ? ', hot' : ''}`, s, [
    { name: '1', x: 0, y },
    { name: '2', x: w, y },
  ]);
}

/** An LED's flange seen from the front: a thin rim in the lens colour with its rounded lower corners, an edge, a light along its top and a shade along its underside; the cathode flat darkens one end (the right unless flatLeft). */
function flange(T, x0, x1, y, h, fill, opacity, flatLeft) {
  const w = x1 - x0;
  let s = '';
  s += rect(x0, y, w, h, fill, { rx: 0.9, 'fill-opacity': opacity });
  s += rect(x0, y + h * 0.5, w, h * 0.5, '#000000', { rx: 0.9, 'fill-opacity': 0.3 });
  s += rect(x0 + 0.8, y + 0.35, w - 1.6, 0.7, '#ffffff', { rx: 0.35, 'fill-opacity': 0.4 });
  s += rect(flatLeft ? x0 : x1 - 1.6, y, 1.6, h, '#000000', { rx: 0.6, 'fill-opacity': 0.25 });
  s += rect(x0, y, w, h, 'none', {
    rx: 0.9,
    stroke: T['plastic-grey-edge'],
    'stroke-width': T['stroke-fine'],
    'stroke-opacity': 0.7,
  });
  return s;
}

/**
 * A 5 mm LED standing on the bench, seen from the front, at the real
 * part's size: a 5 mm dome, 8.6 mm from the flange to the top, a 5.8 mm
 * flange with its flat on the cathode side, legs 2.54 mm apart, the
 * cathode on the left and the anode on the right. The lead frame shows
 * through the epoxy: the post (anode), the anvil cup and its stem
 * (cathode) and the bond wire between them. Unlit, the lens is
 * translucent colour over plastic-white; lit, it is opaque with a glow.
 */
export function led(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const w = 3.2 * p;
  const h = 6.2 * p;
  const color = lensColor(T, props.color || 'red');
  const on = !!props.on;
  const b = on ? (props.brightness === undefined ? 1 : Math.max(0, Math.min(1, props.brightness))) : 0;
  let s = '';
  const mm = p / 2.54;
  const x0 = (w - 5 * mm) / 2;
  const x1 = x0 + 5 * mm;
  const r = 2.5 * mm;
  const cx = w / 2;
  const top = 0.6 * p + 1.2;
  const base = top + 7.6 * mm;
  const flangeH = 1.0 * mm;
  // toC points from the anode towards the cathode: the lead frame's inner sides face each other.
  const xa = 2.1 * p;
  const xc = 1.1 * p;
  const toC = xc > xa ? 1 : -1;
  const legTop = base + flangeH - 0.4;
  const dome = `M${r2(x0)} ${r2(base)}V${r2(top + r)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x1)} ${r2(top + r)}V${r2(base)}Z`;
  const white = color === T['lens-white'];
  const glowColor = white ? '#ffd66b' : color;
  s += tag(
    'glow',
    el('ellipse', {
      'data-hook': 'glow',
      cx,
      cy: top + r + 1.5,
      rx: Math.min(r * 1.8, cx - 0.2),
      ry: Math.min(r * 1.75, top + r + 1.3),
      fill: sheen('glow', glowColor),
      'fill-opacity': r2(Math.min(1, 2.2 * T['opacity-glow']) * b),
    }),
  );
  s += wire(xa, legTop, xa, h) + wire(xc, legTop, xc, h);
  s += tag(
    'body',
    path(dome, T['plastic-white']) +
      path(dome, white && on ? '#fff0b8' : color, {
        'data-hook': 'lens',
        'fill-opacity': on ? r2(0.6 + 0.4 * b) : 0.6,
      }),
  );
  // The lead frame inside the epoxy, as the real one is built: the anvil (cathode) is the heavy piece, a stem widening into the
  // reflector cup that holds the die; the post (anode) is the thin piece with a small flag at its top, and the bond wire arcs
  // from that flag down into the cup. Both leads keep their leg width where they enter the flange.
  const frame = { fill: T['plastic-black-edge'], 'fill-opacity': on ? 0.2 : 0.58 };
  const cupTop = top + r - 1.2;
  const mm2 = mm;
  const cupW = 1.6 * mm2;
  const cupH = 1.3 * mm2;
  const cupBot = cupTop + cupH;
  const postW = 0.42 * mm2;
  // The anvil's silhouette: a broad slab out of the flange, a diagonal shoulder on the inner side rising to the narrow bar that carries the cup.
  const slabIn = xc - toC * 1.25 * mm2;
  const slabOut = xc + toC * 0.7 * mm2;
  const barIn = xc - toC * 0.1 * mm2;
  const barC = (barIn + slabOut) / 2;
  const shoulderY = cupBot + 2.3 * mm2;
  s += path(
    `M${r2(slabIn)} ${r2(base)}V${r2(shoulderY)}L${r2(barIn)} ${r2(cupBot + 0.2)}V${r2(cupBot - 0.3)}H${r2(slabOut)}V${r2(base)}Z`,
    T['plastic-black-edge'],
    frame,
  );
  s += path(`M${r2(slabIn + toC * 0.3)} ${r2(shoulderY)}L${r2(barIn + toC * 0.3)} ${r2(cupBot + 0.2)}`, 'none', {
    stroke: '#ffffff',
    'stroke-width': 0.4,
    'stroke-opacity': on ? 0.25 : 0.35,
  });
  s += path(
    `M${r2(barC - cupW / 2)} ${r2(cupTop)}H${r2(barC + cupW / 2)}L${r2(barC + cupW * 0.3)} ${r2(cupBot)}H${r2(barC - cupW * 0.3)}Z`,
    T['plastic-black-edge'],
    frame,
  );
  // The reflector cup catches the light: a paler wedge inside the anvil's top, the die a dark speck at its floor.
  s += path(
    `M${r2(barC - cupW * 0.36)} ${r2(cupTop + 0.35)}H${r2(barC + cupW * 0.36)}L${r2(barC + cupW * 0.18)} ${r2(cupBot - 0.6)}H${r2(barC - cupW * 0.18)}Z`,
    on ? '#ffffff' : T['plastic-grey'],
    { 'fill-opacity': on ? 0.55 : 0.5 },
  );
  s += rect(barC - 0.5, cupBot - 1.4, 1.0, 0.75, T['plastic-black'], { 'fill-opacity': on ? 0.5 : 0.8 });
  s += rect(xa - postW / 2, cupTop - 0.4, postW, base - cupTop + 0.4, T['plastic-black-edge'], frame);
  s += rect(
    toC > 0 ? xa - postW / 2 : xa + postW / 2 - postW * 2.2,
    cupTop - 0.4,
    postW * 2.2,
    1.3,
    T['plastic-black-edge'],
    Object.assign({ rx: 0.3 }, frame),
  );
  s += path(
    `M${r2(xa + toC * postW * 1.5)} ${r2(cupTop + 0.2)}Q${r2((xa + barC) / 2)} ${r2(cupTop - 3.4)} ${r2(barC)} ${r2(cupBot - 1.1)}`,
    'none',
    { stroke: T['plastic-black-edge'], 'stroke-width': 0.45, 'stroke-opacity': on ? 0.35 : 0.6 },
  );
  // Both leads thicken to the leg width where they are held in the flange.
  s += rect(xa - 0.95, base - 2.4, 1.9, 2.6, T['plastic-black-edge'], frame);
  // Lit, the light pours out of the cup: a white-hot core over the die that washes the frame out around it.
  if (on)
    s += el('ellipse', {
      cx: barC,
      cy: cupTop + 0.9,
      rx: r * 1.0,
      ry: r * 1.05,
      fill: sheen('hot'),
      'fill-opacity': r2(0.5 + 0.5 * b),
    });
  s += path(dome, sheen('dome'), { 'fill-opacity': on ? 0.7 : 0.8 });
  s += path(dome, 'none', { stroke: T['plastic-grey-edge'], 'stroke-width': T['stroke-fine'], 'stroke-opacity': 0.8 });
  // The flange sits under the dome, a little wider on the anode side; the flat on the cathode side brings it flush with the dome there.
  const fx0 = toC > 0 ? x0 - 0.4 * mm : x0;
  const fx1 = toC > 0 ? x1 : x1 + 0.4 * mm;
  s += flange(T, fx0, fx1, base, flangeH, color, on ? 1 : 0.6, toC < 0);
  const live = props.live || {};
  s += flow(xa, h, xa, legTop + 1, live.flow, 'flow-a') + flow(xc, legTop + 1, xc, h, live.flow, 'flow-c');
  if (live.probe) s += probe(live.probe === 'K' || live.probe === 'C' ? xc : xa, h);
  return art(w, h, `${props.color || 'red'} LED${on ? ', lit' : ''}`, s, [
    { name: 'A', x: xa, y: h },
    { name: 'K', x: xc, y: h },
  ]);
}

/**
 * A radial capacitor standing on the bench, seen from the front, at the
 * real size: a 5 × 11 mm electrolytic can with its top lip, sleeve and
 * the negative stripe, or a 5 mm ceramic disc with its code. Two tinned
 * legs one pitch apart.
 */
export function capacitor(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const kind = props.kind === 'ceramic' ? 'ceramic' : 'electrolytic';
  const w = 2 * p;
  let s = '';
  const xa = 0.5 * p;
  const xc = 1.5 * p;
  if (kind === 'ceramic') {
    const h = 4 * p;
    const cx = p;
    const cy = 1.3 * p;
    const r = 2.6 * mm;
    s +=
      wirePath(`M${r2(cx - 0.3 * p)} ${r2(cy + r - 1)}L${r2(xa)} ${r2(cy + r + 0.5 * p)}V${r2(h)}`) +
      wirePath(`M${r2(cx + 0.3 * p)} ${r2(cy + r - 1)}L${r2(xc)} ${r2(cy + r + 0.5 * p)}V${r2(h)}`);
    s += tag(
      'body',
      el(
        'ellipse',
        Object.assign(
          { cx, cy, rx: r, ry: r * 0.92, fill: T['cap-ceramic'] },
          edge(T, T['resistor-body-edge'], T['stroke-detail']),
        ),
      ),
    );
    s += el('ellipse', {
      cx: cx - r * 0.3,
      cy: cy - r * 0.35,
      rx: r * 0.35,
      ry: r * 0.22,
      fill: '#ffffff',
      'fill-opacity': 0.3,
      transform: `rotate(-25 ${r2(cx - r * 0.3)} ${r2(cy - r * 0.35)})`,
    });
    s += text(cx, cy + 1.6, props.code || '104', PIN_LABEL, T['plastic-black-edge']);
    return art(w, h, `ceramic capacitor ${props.code || '104'}`, s, [
      { name: '1', x: xa, y: h },
      { name: '2', x: xc, y: h },
    ]);
  }
  const hh = 6 * p;
  const cw = 5 * mm;
  const x0 = (w - cw) / 2;
  const top = 1.2;
  const bottom = top + 11 * mm;
  s += wire(xa, bottom - 0.6, xa, hh) + wire(xc, bottom - 0.6, xc, hh);
  s += tag(
    'body',
    rect(
      x0,
      top,
      cw,
      bottom - top,
      T['cap-electrolytic'],
      Object.assign({ rx: 2.2 }, edge(T, T['plastic-black-edge'])),
    ),
  );
  s += rect(x0 + cw * 0.66, top + 0.4, cw * 0.22, bottom - top - 0.8, T['cap-stripe'], { rx: 0.6 });
  [0.28, 0.46, 0.64, 0.82].forEach(f => {
    s += rect(x0 + cw * 0.7, top + (bottom - top) * f, cw * 0.14, 1.1, T['cap-electrolytic'], { rx: 0.3 });
  });
  s += rect(x0, top, cw, 2.8, '#000000', { rx: 2.2, 'fill-opacity': 0.3 });
  s += rect(x0 + 1.2, top + 2.4, cw - 2.4, 0.6, '#ffffff', { 'fill-opacity': 0.25 });
  s += rect(x0, bottom - 2.6, cw, 2.6, '#000000', { rx: 1.5, 'fill-opacity': 0.25 });
  s += shadeV(x0, top + 3.2, cw, bottom - top - 6);
  s += text(x0 + cw * 0.3, top + (bottom - top) * 0.6, '+', 5.6, T['cap-stripe'], { 'font-weight': 700 });
  return art(w, hh, 'electrolytic capacitor', s, [
    { name: '+', x: xa, y: hh },
    { name: '-', x: xc, y: hh },
  ]);
}

/** A 12 mm piezo buzzer from above, at the real size: a black can with its stepped top, the sound hole, the + mark over the positive leg (the left, pin 1), two tinned legs three pitches apart as on the real part (7.6 mm). live.flow runs up leg 1 and down leg 2. */
export function buzzer(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const w = 5 * p;
  const h = 6.4 * p;
  const cx = 2.5 * p;
  const cy = 2.5 * p;
  const r = 6 * mm;
  let s = '';
  const legTop = cy + r - 2;
  s += wire(p, legTop, p, h) + wire(4 * p, legTop, 4 * p, h);
  s += tag('body', circle(cx, cy, r, T['plastic-black'], edge(T, T['plastic-black-edge'])));
  s += circle(cx, cy, r * 0.86, '#000000', { 'fill-opacity': 0.35 });
  s += circle(cx, cy, r * 0.86, 'none', { stroke: '#ffffff', 'stroke-width': 0.5, 'stroke-opacity': 0.12 });
  s += circle(cx, cy, r * 0.5, T['plastic-black'], edge(T, T['plastic-black-edge'], T['stroke-fine']));
  s += circle(cx, cy, 1.1 * mm, T.cavity);
  s += path(
    `M${r2(cx - r * 0.72)} ${r2(cy - r * 0.3)}A${r2(r * 0.78)} ${r2(r * 0.78)} 0 0 1 ${r2(cx - r * 0.3)} ${r2(cy - r * 0.72)}`,
    'none',
    { stroke: '#ffffff', 'stroke-width': 1.3, 'stroke-linecap': 'round', 'stroke-opacity': 0.2 },
  );
  s += text(cx - r * 0.64, cy + r * 0.62, '+', 5, T['chip-print']);
  const live = props.live || {};
  s += flow(p, h, p, legTop, live.flow, 'flow-1') + flow(4 * p, legTop, 4 * p, h, live.flow, 'flow-2');
  if (live.probe) s += probe(live.probe === '-' || live.probe === '2' ? 4 * p : p, h);
  return art(w, h, 'Buzzer', s, [
    { name: '+', x: p, y: h },
    { name: '-', x: 4 * p, y: h },
  ]);
}

/**
 * A 5 mm diffused RGB LED in front elevation: a milky dome lit by the mix
 * of its three channels (r, g, b from 0 to 1), four legs a pitch apart in
 * the real order, red, common, green, blue; the common leg is the longest,
 * as on the real part, and ends a pitch below the others. The editor sets
 * the lens fill to the mix and the glow to the strongest channel.
 */
export function rgbLed(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const w = 4 * p;
  const h = 6.6 * p;
  let s = '';
  const legEnd = function (i) {
    return i === 1 ? h : h - p;
  };
  const ch = ['r', 'g', 'b'].map(k => {
    const v = Number(props[k]);
    return isNaN(v) ? 0 : Math.max(0, Math.min(1, v));
  });
  const level = Math.max(ch[0], ch[1], ch[2]);
  const on = level > 0.02;
  const hx = function (v) {
    const n = Math.round(v * 255).toString(16);
    return (n.length < 2 ? '0' : '') + n;
  };
  const mix = on ? `#${hx(ch[0] / level)}${hx(ch[1] / level)}${hx(ch[2] / level)}` : T['plastic-white'];
  const mm = p / 2.54;
  const x0 = (w - 5 * mm) / 2;
  const x1 = x0 + 5 * mm;
  const r = 2.5 * mm;
  const cx = w / 2;
  const top = 1.2;
  const base = top + 7.6 * mm;
  const flangeH = 1.0 * mm;
  const xs = [0.5 * p, 1.5 * p, 2.5 * p, 3.5 * p];
  const names = ['Red', 'Common', 'Green', 'Blue'];
  const legTop = base + flangeH - 0.4;
  const dome = `M${r2(x0)} ${r2(base)}V${r2(top + r)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x1)} ${r2(top + r)}V${r2(base)}Z`;
  s += tag(
    'glow',
    el('ellipse', {
      'data-hook': 'glow',
      cx,
      cy: top + r + 1.5,
      rx: r * 1.8,
      ry: r * 1.75,
      fill: sheen('glow', on ? mix : T['lens-white']),
      'fill-opacity': r2(Math.min(1, 2.2 * T['opacity-glow']) * level),
    }),
  );
  // The four legs leave the base 1.27 mm apart, as the real part's do, and splay out to the grid below it.
  xs.forEach((x, i) => {
    const xi = cx + (i - 1.5) * 1.27 * mm;
    s += wirePath(`M${r2(xi)} ${r2(legTop)}V${r2(legTop + 0.6 * p)}L${r2(x)} ${r2(legTop + 1.6 * p)}V${r2(legEnd(i))}`);
  });
  // The milky diffuser, then the lit mix over it; the four posts of the lead frame show through faintly.
  s += tag(
    'body',
    path(dome, T['plastic-white'], { 'fill-opacity': 1 }) +
      path(dome, mix, {
        'data-hook': 'lens',
        'fill-opacity': on ? r2(0.45 + 0.5 * level) : 0.08,
        'data-r': ch[0],
        'data-g': ch[1],
        'data-b': ch[2],
      }),
  );
  const cupTop = top + r + 2.2;
  [
    [-2.6, 1.4],
    [-0.9, -0.6],
    [0.9, 1.0],
    [2.6, 0.4],
  ].forEach(q => {
    s += rect(cx + q[0] * 1.3 - 0.55, cupTop + q[1] * mm, 1.1, base - cupTop - q[1] * mm, T['plastic-black-edge'], {
      'fill-opacity': on ? 0.22 : 0.35,
    });
  });
  if (on)
    s += el('ellipse', {
      cx,
      cy: top + r + 1.5,
      rx: r * 0.95,
      ry: r * 1.0,
      fill: sheen('hot'),
      'fill-opacity': r2(0.4 + 0.5 * level),
    });
  s += path(dome, sheen('dome'), { 'fill-opacity': on ? 0.7 : 0.8 });
  s += path(dome, 'none', { stroke: T['plastic-grey-edge'], 'stroke-width': T['stroke-fine'], 'stroke-opacity': 0.8 });
  const fx0 = x0 - 0.4 * mm;
  const fx1 = x1;
  s += flange(T, fx0, fx1, base, flangeH, on ? mix : T['plastic-white'], 1);
  return art(
    w,
    h,
    `RGB LED${on ? `, lit ${mix}` : ''}`,
    s,
    xs.map((x, i) => {
      return { name: names[i], x, y: legEnd(i) };
    }),
  );
}
