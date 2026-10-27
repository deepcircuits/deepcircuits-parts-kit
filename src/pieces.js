/**
 * The board pieces the parts share: SMD parts and IC packages on a board, header and pad rows, mount holes, USB
 * receptacles, wire legs and the silk a pin's name prints as.
 */
import {
  PIN_LABEL,
  bevel,
  circle,
  edge,
  header,
  hole,
  line,
  lotCode,
  path,
  r2,
  rect,
  sheen,
  tag,
  text,
  textWidth,
  tokens,
  trace,
} from './core.js';

/** Small passives drawn on a board: an SMD resistor, an SMD capacitor, a crystal, an SMD LED. */
export function smd(T, kind, x, y, horizontal) {
  const w = horizontal ? 0.9 * T.pitch : 0.55 * T.pitch;
  const h = horizontal ? 0.55 * T.pitch : 0.9 * T.pitch;
  let s = '';
  if (kind === 'crystal')
    return tag(
      'crystal',
      rect(
        x,
        y,
        horizontal ? 1.3 * T.pitch : 0.7 * T.pitch,
        horizontal ? 0.7 * T.pitch : 1.3 * T.pitch,
        T.metal,
        Object.assign({ rx: 0.35 * T.pitch }, edge(T, T['metal-edge'], T['stroke-fine'])),
      ),
    );
  s += rect(x, y, w, h, kind === 'capacitor' ? T['cap-ceramic'] : T['resistor-smd'], { rx: 0.4 });
  s +=
    rect(x, y, horizontal ? w * 0.18 : w, horizontal ? h : h * 0.18, T.lead, { rx: 0.3 }) +
    rect(
      horizontal ? x + w * 0.82 : x,
      horizontal ? y : y + h * 0.82,
      horizontal ? w * 0.18 : w,
      horizontal ? h : h * 0.18,
      T.lead,
      { rx: 0.3 },
    );
  if (kind === 'resistor')
    s += rect(
      horizontal ? x + w * 0.3 : x + w * 0.2,
      horizontal ? y + h * 0.2 : y + h * 0.3,
      horizontal ? w * 0.4 : w * 0.6,
      horizontal ? h * 0.6 : h * 0.4,
      T['cap-stripe'],
      { rx: 0.2, 'fill-opacity': 0.9 },
    );
  return tag('smd', s);
}

/** A DIP chip lying along x on a board, leads out of its long sides: the notch at the left end and pin 1 at the bottom left, or with pin1Right the notch at the right end and pin 1 at the top right (the chip turned round, its print kept upright). */
export function dipOnBoard(T, x, cy, lengthPitches, label, pin1Right) {
  const p = T.pitch;
  const bw = lengthPitches * p;
  const bh = 2.6 * p;
  let s = '';
  const n = Math.round(lengthPitches);
  for (let i = 0; i < n; i++) {
    const lx = x + (i + 0.5) * p;
    s +=
      rect(lx - 1.1, cy - 1.5 * p, 2.2, 1.5 * p - bh / 2 + 0.6, T.lead, { rx: 0.3 }) +
      rect(lx - 1.1, cy + bh / 2 - 0.6, 2.2, 1.5 * p - bh / 2 + 0.6, T.lead, { rx: 0.3 });
  }
  s += tag(
    'chip',
    rect(x - 1.1, cy - 1.5 * p, bw + 2.2, 3 * p, 'none') +
      rect(x, cy - bh / 2, bw, bh, T.chip, Object.assign({ rx: T['radius-chip'] }, edge(T, T['chip-edge']))),
  );
  s +=
    rect(x + 0.6, cy - bh / 2 + 0.6, bw - 1.2, 1.2, '#ffffff', { rx: 0.6, 'fill-opacity': T['opacity-light'] * 0.5 }) +
    rect(x + 0.6, cy + bh / 2 - 1.8, bw - 1.2, 1.2, '#000000', { rx: 0.6, 'fill-opacity': T['opacity-shade'] });
  if (pin1Right)
    s +=
      path(`M${r2(x + bw)} ${r2(cy - 2.6)}a2.6 2.6 0 0 1 0 5.2z`, T['chip-print']) +
      circle(x + bw - 0.5 * p, cy - bh / 2 + 0.45 * p, 0.9, T['chip-print']);
  else
    s +=
      path(`M${r2(x)} ${r2(cy - 2.6)}a2.6 2.6 0 0 0 0 5.2z`, T['chip-print']) +
      circle(x + 0.5 * p, cy + bh / 2 - 0.45 * p, 0.9, T['chip-print']);
  s +=
    circle(x + 4.2, cy, 1.1, 'none', {
      stroke: T['chip-edge'],
      'stroke-width': T['stroke-fine'],
      'stroke-opacity': 0.8,
    }) +
    circle(x + bw - 4.2, cy, 1.1, 'none', {
      stroke: T['chip-edge'],
      'stroke-width': T['stroke-fine'],
      'stroke-opacity': 0.8,
    });
  if (label)
    s +=
      text(x + bw / 2, cy - 0.4, label, 4.4, T['chip-print']) +
      text(x + bw / 2, cy + PIN_LABEL + 0.2, lotCode(label), PIN_LABEL, T['chip-print'], { 'fill-opacity': 0.85 });
  return s;
}

/**
 * A USB receptacle seen from above, in its bounding box (x, y, w, h) with the
 * mouth at one edge (mouth 'down' by default, 'up', 'left' or 'right'): the
 * folded shell with its metal sheen and seam, the two solder tabs at the
 * rear, the latch windows near the mouth and the dark slit of the opening.
 * kind 'micro' (default), 'mini' or 'c' (the pill-shaped shell).
 */
export function usbPort(T, props) {
  const kind = props.kind || 'micro';
  const mouth = props.mouth || 'down';
  const x0 = props.x;
  const y0 = props.y;
  const w = props.w;
  const h = props.h;
  const vert = mouth === 'down' || mouth === 'up';
  const L = vert ? h : w;
  const W = vert ? w : h;
  const cx = x0 + w / 2;
  const cy = y0 + h / 2;
  // A rectangle in port coordinates: u across the mouth (-0.5..0.5), v along the port from the rear (0) to the mouth (1).
  const R = function (u0, u1, v0, v1, fill, more) {
    const a = (u1 - u0) * W;
    const b = (v1 - v0) * L;
    if (mouth === 'down') return rect(cx + u0 * W, y0 + v0 * L, a, b, fill, more);
    if (mouth === 'up') return rect(cx + u0 * W, y0 + (1 - v1) * L, a, b, fill, more);
    if (mouth === 'right') return rect(x0 + v0 * L, cy + u0 * W, b, a, fill, more);
    return rect(x0 + (1 - v1) * L, cy + u0 * W, b, a, fill, more);
  };
  const seam = function (v) {
    if (vert) {
      const y = mouth === 'down' ? y0 + v * L : y0 + (1 - v) * L;
      return line(x0 + 1.2, y, x0 + w - 1.2, y, T['metal-edge'], T['stroke-fine']);
    }
    const x = mouth === 'right' ? x0 + v * L : x0 + (1 - v) * L;
    return line(x, y0 + 1.2, x, y0 + h - 1.2, T['metal-edge'], T['stroke-fine']);
  };
  const rx = kind === 'c' ? W * 0.45 : 1.0;
  let s = '';
  s += R(-0.5, -0.34, 0, 0.16, T['metal-edge'], { rx: 0.3 }) + R(0.34, 0.5, 0, 0.16, T['metal-edge'], { rx: 0.3 });
  s += R(-0.5, 0.5, 0.1, 1.0, T.metal, Object.assign({ rx }, edge(T, T['metal-edge'])));
  s += R(-0.5, 0.5, 0.1, 1.0, sheen('metal'), { rx, 'fill-opacity': 0.75 });
  s += R(-0.5, 0.5, 0.1, 0.24, '#ffffff', { rx, 'fill-opacity': 0.18 });
  s += seam(0.5);
  if (kind === 'c') s += R(-0.34, 0.34, 0.8, 0.95, T['plastic-black'], { rx: 0.075 * L });
  else {
    if (kind === 'mini') s += R(-0.12, 0.12, 0.58, 0.72, T.cavity, { rx: 0.3 });
    else s += R(-0.34, -0.2, 0.6, 0.76, T.cavity, { rx: 0.3 }) + R(0.2, 0.34, 0.6, 0.76, T.cavity, { rx: 0.3 });
    s += R(-0.38, 0.38, 0.86, 0.97, T['plastic-black'], { rx: 0.4 });
  }
  return tag('usb', s);
}

/** A pad row with its traces toward the part: header() plus the kit's faint traces. */
export function padRow(T, fin, f, props, toward) {
  const hdr = header(props);
  const p = T.pitch;
  const n = hdr.pins.length;
  hdr.pins.forEach((pn, i) => {
    const dx = (i - (n - 1) / 2) * 0.3 * p;
    if (props.axis === 'y')
      hdr.svg += trace(T, fin, [
        [pn.x, pn.y],
        [pn.x + (toward < 0 ? -1.1 : 1.1) * p, pn.y],
        [pn.x + (toward < 0 ? -1.6 : 1.6) * p, pn.y + dx],
      ]);
    else
      hdr.svg += trace(T, fin, [
        [pn.x, pn.y],
        [pn.x, pn.y + (toward < 0 ? -1.1 : 1.1) * p],
        [pn.x + dx, pn.y + (toward < 0 ? -1.6 : 1.6) * p],
      ]);
  });
  return hdr;
}
/**
 * A right-angle header as the small boards are sold with it: the black
 * spacer on the board at its edge, each pin bent down behind the spacer
 * into its pad and standing ext past the edge (6 mm by default). side is
 * the edge ('bottom', 'top', 'left' or 'right'), at its coordinate, from
 * the first pin's place along it. back puts the header on the board's back
 * (the HC-SR04): only its spacer shows past the edge, the pins standing
 * from it (8.5 mm past the edge by default) and their joints on the pads
 * just inside. The pins are at their tips. Returns { svg, pins, pads },
 * pads being where each pin meets the board.
 */
export function edgeHeader(T, props) {
  const p = T.pitch;
  const mm = p / 2.54;
  const names = props.names;
  const side = props.side || 'bottom';
  const back = !!props.back;
  const ext = props.ext === undefined ? (back ? 8.5 : 6) * mm : props.ext;
  const deep = 2.5 * mm;
  const padIn = (back ? 1.6 : 3.7) * mm;
  let s = '';
  const pins = [];
  const pads = [];
  const across = side === 'top' || side === 'bottom';
  const out = side === 'bottom' || side === 'right' ? 1 : -1;
  // A box from along a0..a1 and from c0..c1 outward of the edge, in board coordinates.
  const R = function (a0, a1, c0, c1, fill, attrs) {
    const u0 = props.at + out * c0;
    const u1 = props.at + out * c1;
    const lo = Math.min(u0, u1);
    const span = Math.abs(u1 - u0);
    return across ? rect(a0, lo, a1 - a0, span, fill, attrs) : rect(lo, a0, span, a1 - a0, fill, attrs);
  };
  const P = function (a, c) {
    return across ? { x: a, y: props.at + out * c } : { x: props.at + out * c, y: a };
  };
  names.forEach((n, i) => {
    const a = props.from + i * p;
    const pad = P(a, -padIn);
    const tip = P(a, ext);
    s += tag('pad', circle(pad.x, pad.y, T['pad-radius'], T.pad));
    s += tag(
      'leg',
      R(a - 1.2, a + 1.2, back ? deep : 0, ext, T['lead-edge'], { rx: 0.5 }) +
        R(a - 0.8, a + 0.8, back ? deep : 0, ext, T.lead, { rx: 0.4 }),
    );
    if (!back) s += R(a - 0.8, a + 0.8, -padIn, -deep + 0.2 * mm, T.lead, { rx: 0.4 });
    pins.push({ name: n, x: r2(tip.x), y: r2(tip.y) });
    pads.push({ x: r2(pad.x), y: r2(pad.y) });
  });
  s += tag(
    'header',
    R(
      props.from - p / 2,
      props.from + (names.length - 0.5) * p,
      back ? 0 : -deep,
      back ? deep : 0,
      T['plastic-black'],
      Object.assign({ rx: 0.4 }, edge(T, T['plastic-black-edge'], T['stroke-fine'])),
    ),
  );
  return { svg: s, pins, pads };
}
/** A silk frame round a passive, as the small boards print. */
export function silkFrame(T, f, x, y, w, h) {
  return rect(x - 1.2, y - 1.2, w + 2.4, h + 2.4, 'none', {
    stroke: f.silk,
    'stroke-width': T['stroke-fine'],
    'stroke-opacity': 0.85,
    rx: 0.4,
  });
}
/** A framed passive on a board. */
export function framed(T, f, kind, x, y, horizontal) {
  const p = T.pitch;
  const w = horizontal ? 0.9 * p : 0.55 * p;
  const h = horizontal ? 0.55 * p : 0.9 * p;
  return silkFrame(T, f, x, y, w, h) + smd(T, kind, x, y, horizontal);
}
/** A SOT-23 transistor or regulator seen from above: the black body with three (or five) leads. */
export function sot23(T, x, y, leads, label) {
  const w = 1.3 * 3.78;
  const h = 2.9 * 3.78;
  let s = '';
  const n = leads === 5 ? 3 : 2;
  for (let i = 0; i < n; i++) {
    const ly = y + h / 2 + (i - (n - 1) / 2) * 0.95 * 3.78 - 1.0;
    s += rect(x - 1.8, ly, 1.8, 2.0, T.lead, { rx: 0.2 });
  }
  const m = leads === 5 ? 2 : 1;
  for (let j = 0; j < m; j++) {
    const ry = y + h / 2 + (j - (m - 1) / 2) * 1.9 * 3.78 - 1.0;
    s += rect(x + w, ry, 1.8, 2.0, T.lead, { rx: 0.2 });
  }
  s += rect(x, y, w, h, T.chip, Object.assign({ rx: 0.4 }, edge(T, T['chip-edge'], T['stroke-detail'])));
  if (label)
    s += text(x + w / 2, y + h / 2, label, 4, T['chip-print'], {
      'dominant-baseline': 'middle',
      transform: `rotate(-90 ${r2(x + w / 2)} ${r2(y + h / 2)})`,
    });
  return tag('smd', s);
}
/** A SOIC body with n leads a side along y, the print rotated to read along the body. */
export function soic(T, x, y, w, h, nSide, label) {
  let s = '';
  const pitch = 1.27 * 3.78;
  for (let i = 0; i < nSide; i++) {
    const ly = y + h / 2 + (i - (nSide - 1) / 2) * pitch - 0.8;
    s += rect(x - 3.6, ly, 3.6, 1.6, T.lead, { rx: 0.2 }) + rect(x + w, ly, 3.6, 1.6, T.lead, { rx: 0.2 });
  }
  s +=
    rect(x, y, w, h, T.chip, Object.assign({ rx: 0.5 }, edge(T, T['chip-edge'], T['stroke-detail']))) +
    bevel(T, x, y, w, h, 1.0, 0.5) +
    circle(x + 1.8, y + 1.8, 0.6, T['chip-print']);
  if (label)
    s += text(x + w / 2, y + h / 2, label, 4, T['chip-print'], {
      'dominant-baseline': 'middle',
      transform: `rotate(-90 ${r2(x + w / 2)} ${r2(y + h / 2)})`,
    });
  return tag('chip', s);
}
/** A 3 mm mounting hole with its silk ring. */
export function mountHole(T, f, x, y, r) {
  return (
    circle(x, y, r + 2.2, 'none', { stroke: f.silk, 'stroke-width': T['stroke-fine'], 'stroke-opacity': 0.85 }) +
    hole(T, x, y, r)
  );
}

/** A SOIC lying along x: n leads top and bottom, the print reading along the body. */
export function soicAcross(T, x, y, w, h, nSide, label) {
  let s = '';
  const pitch = 1.27 * 3.78;
  for (let i = 0; i < nSide; i++) {
    const lx = x + w / 2 + (i - (nSide - 1) / 2) * pitch - 0.8;
    s += rect(lx, y - 3.6, 1.6, 3.6, T.lead, { rx: 0.2 }) + rect(lx, y + h, 1.6, 3.6, T.lead, { rx: 0.2 });
  }
  s +=
    rect(x, y, w, h, T.chip, Object.assign({ rx: 0.5 }, edge(T, T['chip-edge'], T['stroke-detail']))) +
    bevel(T, x, y, w, h, 1.0, 0.5) +
    circle(x + 1.8, y + h - 1.8, 0.6, T['chip-print']);
  if (label) s += text(x + w / 2, y + h / 2 + 1.4, label, 4, T['chip-print']);
  return tag('chip', s);
}

/** A pin's name as the silk prints it: the catalog's .N suffix on a repeated name (GND.2) dropped. */
export function silkName(n) {
  return String(n).replace(/\.\d+$/, '');
}

/**
 * A quad flat package on a board: gull-wing leads on all four sides, the
 * body, the pin-1 dot and the part number (one line, or split before the
 * digits where it does not fit). nSide is the lead count per side.
 */
export function qfp(T, x, y, w, h, nSide, label) {
  let s = '';
  const lead = 1.5;
  const lw = Math.min(1.2, ((w - 4) / nSide) * 0.55);
  for (let i = 0; i < nSide; i++) {
    const ox = 2 + ((i + 0.5) * (w - 4)) / nSide - lw / 2;
    const oy = 2 + ((i + 0.5) * (h - 4)) / nSide - lw / 2;
    s += rect(x - lead, y + oy, lead, lw, T.lead, { rx: 0.2 }) + rect(x + w, y + oy, lead, lw, T.lead, { rx: 0.2 });
    s += rect(x + ox, y - lead, lw, lead, T.lead, { rx: 0.2 }) + rect(x + ox, y + h, lw, lead, T.lead, { rx: 0.2 });
  }
  s += rect(x, y, w, h, T.chip, Object.assign({ rx: T['radius-chip'] }, edge(T, T['chip-edge'])));
  s += rect(x + 0.6, y + 0.6, w - 1.2, 1.1, '#ffffff', { rx: 0.5, 'fill-opacity': T['opacity-light'] * 0.4 });
  s += circle(x + 3.2, y + 3.2, 0.9, T['chip-print']);
  if (label) {
    const fit = Math.floor((w - 2.4) / textWidth(1, PIN_LABEL));
    const lbl = String(label);
    const cx = x + w / 2;
    const cy = y + h / 2;
    if (lbl.length <= fit && h >= 3 * PIN_LABEL + 2)
      s +=
        text(cx, cy - 0.6, lbl, PIN_LABEL, T['chip-print']) +
        text(cx, cy + PIN_LABEL + 0.4, lotCode(lbl), PIN_LABEL, T['chip-print'], { 'fill-opacity': 0.85 });
    else if (lbl.length <= fit) s += text(cx, cy + 1.4, lbl, PIN_LABEL, T['chip-print']);
    else if (fit >= 4 && lbl.length <= 2 * fit) {
      const dm = /^[A-Za-z]+(?=\d)/.exec(lbl);
      const cut =
        dm && dm[0].length <= fit && lbl.length - dm[0].length <= fit ? dm[0].length : Math.ceil(lbl.length / 2);
      s +=
        text(cx, cy - 0.8, lbl.slice(0, cut), PIN_LABEL, T['chip-print']) +
        text(cx, cy + PIN_LABEL - 0.4, lbl.slice(cut), PIN_LABEL, T['chip-print']);
    }
  }
  return tag('chip', s);
}

/** A USB-C receptacle at the bottom edge, pointing down. */
export function usbC(T, cx, y, w, h, mouth) {
  return usbPort(T, { kind: 'c', x: cx - w / 2, y, w, h, mouth: mouth || 'down' });
}

/** A bare plated pad (no handle): the places a header has that the catalog does not name. */
export function barePad(T, x, y) {
  return tag(
    'pad',
    circle(x, y, T['pad-radius'], T.pad) + circle(x, y, T['hole-radius'], T.hole, edge(T, T['metal-edge'], 0.5)),
  );
}

/** A tinned wire leg: a metal-edge line under a lead line, so it reads as round wire. */
export function wire(x1, y1, x2, y2) {
  const T = tokens();
  return (
    line(x1, y1, x2, y2, T['lead-edge'], T['leg-width'] + 0.6) + line(x1, y1, x2, y2, T.lead, T['leg-width'] - 0.4)
  );
}

/** A leg drawn as a lead: a lead-edge stroke under a lead stroke 1px narrower, along the path `d`. */
export function leadPath(T, d) {
  const round = { 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
  return (
    path(d, 'none', Object.assign({ stroke: T['lead-edge'], 'stroke-width': 2.9 }, round)) +
    path(d, 'none', Object.assign({ stroke: T.lead, 'stroke-width': 1.9 }, round))
  );
}

/**
 * A TO-92 package in elevation, flat face to the viewer, centred on cx with its body's top at y: three legs from the
 * real 1.27 mm under the body, bent out to one pitch and down to `bottom`; the 4.7 × 4.6 mm black body with its
 * rounded shoulders and a light along its top; the print in two lines. With `heat` (0..1) the body carries the `heat`
 * hook, the body's outline in red at that share of `opacity-heat`.
 */
export function to92Package(T, cx, y, bottom, lines, heat) {
  const p = T.pitch;
  const bw = 4.7 * (p / 2.54);
  const bh = 4.6 * (p / 2.54);
  const bx = cx - bw / 2;
  let s = '';
  // Legs first, under the body: from the body's bottom to the pins, bent out to one pitch.
  for (let i = 0; i < 3; i++) {
    const x = cx + (i - 1) * p;
    const dx = (i - 1) * 1.27 * (p / 2.54);
    const d = `M${r2(cx + dx)} ${r2(y + bh - 1)}V${r2(y + bh + 0.9 * p)}L${r2(x)} ${r2(y + bh + 1.7 * p)}V${r2(bottom)}`;
    s += tag('leg', leadPath(T, d));
  }
  const outline = `M${r2(bx)} ${r2(y + bh)}V${r2(y + 2.2)}a2.2 2.2 0 0 1 2.2 -2.2H${r2(bx + bw - 2.2)}a2.2 2.2 0 0 1 2.2 2.2V${r2(y + bh)}Z`;
  s += tag(
    'body',
    path(outline, T['plastic-black'], Object.assign({ 'stroke-linejoin': 'round' }, edge(T, T['plastic-black-edge']))),
  );
  if (heat !== undefined)
    s += path(outline, T['band-red'], {
      'data-hook': 'heat',
      'data-live': 'heat',
      'fill-opacity': r2(T['opacity-heat'] * heat),
    });
  s += rect(bx + 1.2, y + 1.2, bw - 2.4, 1.6, '#ffffff', { rx: 0.8, 'fill-opacity': T['opacity-light'] * 0.5 });
  s +=
    text(cx, y + bh / 2 - 0.4, lines[0], PIN_LABEL, T['chip-print'], { 'font-weight': 600 }) +
    text(cx, y + bh / 2 + PIN_LABEL + 0.2, lines[1], PIN_LABEL, T['chip-print']);
  return s;
}
