/** Character LCDs, seven-segment displays, OLED, TFT, Nokia and e-paper modules, the MAX7219 matrix and the TM1637 module. */
import {
  PIN_LABEL,
  art,
  bevel,
  board,
  circle,
  edge,
  el,
  finish,
  header,
  hole,
  labelRow,
  lensColor,
  pin,
  r2,
  rect,
  sheen,
  shine,
  tag,
  text,
  tokens,
  trace,
  via,
} from './core.js';
import { barePad, dipOnBoard, silkName, smd, wire } from './pieces.js';

/**
 * A character LCD module at the size of the real 80 × 36 mm 16×2 (or the
 * 98 × 60 mm 20×4): a green board with its four 2.5 mm mount holes 2.5 mm in
 * from the edges (75 × 31 mm apart on the 16×2), the 16-pin header along the
 * top edge in line with the top holes, pin 1 8 mm from the left edge, the
 * backlight resistor and a capacitor beside it, a black bezel, the
 * chip-on-board strip under it, and the backlit glass. The glass and its dot matrix follow the modules' data
 * sheets: 5 × 8 dots 0.55 mm wide at a 0.60 mm pitch, 0.65 mm tall at
 * 0.70 mm on the 16×2 (0.55 at 0.60 on the 20×4), characters 3.55 mm apart
 * and rows 5.95 mm apart (5.35 mm), the active area centred in a 64.5 ×
 * 16.4 mm viewing area (76.0 × 25.2 mm).
 *
 * lines: preview text per row, in a font. glyphs: each cell's dots instead,
 * rows × cols entries in reading order, eight row bitmasks a cell with
 * bit 4 the leftmost dot (as an HD44780's CGRAM holds them); a missing entry
 * is a dark cell. The matrix is `data-hook="matrix"` with its lattice as data
 * attributes, so an editor can paint the dots itself: data-cols, data-rows,
 * data-x and data-y (the first cell's top-left dot), data-cell-dx and
 * data-cell-dy (cell to cell), data-dot-dx and data-dot-dy (dot to dot),
 * data-dot-w and data-dot-h.
 *
 * backpack: the I2C backpack (a PCF8574 board soldered behind the sixteen
 * pins) instead of the bare header: its four pins come out of the left edge,
 * GND at the top, and the sixteen pads show their solder. pins names the
 * header shown (VSS to K, or GND VCC SDA SCL with the backpack).
 */
export function characterLcd(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const cols = props.cols || 16;
  const rows = props.rows || 2;
  const lines = props.lines || [];
  const glyphs = props.glyphs;
  const blue = props.color === 'blue';
  const backpack = !!props.backpack;
  const mmL = p / 2.54;
  const big = cols >= 20 || rows >= 4;
  const real = big ? [98, 60] : [80, 36];
  // The data sheets' matrix and viewing area, in millimetres; the active area is centred in the glass.
  const M = big
    ? { dotW: 0.55, dotH: 0.55, dotDx: 0.6, dotDy: 0.6, cellDy: 5.35, marginX: 3.3, marginY: 2.2 }
    : { dotW: 0.55, dotH: 0.65, dotDx: 0.6, dotDy: 0.7, cellDy: 5.95, marginX: 4.15, marginY: 2.45 };
  const cellDx = 3.55 * mmL;
  const cellDy = M.cellDy * mmL;
  const dotW = M.dotW * mmL;
  const dotH = M.dotH * mmL;
  const dotDx = M.dotDx * mmL;
  const dotDy = M.dotDy * mmL;
  const charW = 4 * dotDx + dotW;
  const charH = 7 * dotDy + dotH;
  const activeW = (cols - 1) * cellDx + charW;
  const activeH = (rows - 1) * cellDy + charH;
  const glassW = activeW + 2 * M.marginX * mmL;
  const glassH = activeH + 2 * M.marginY * mmL;
  // The board at the real module's size. The 16 x 2's bezel is 3.35 mm around the glass sideways and 3.9 mm above and below, centred below the header;
  // the 20 x 4's is 96.8 x 39.3 mm from 10.35 mm down, its glass centred on the board.
  const w = r2(real[0] * mmL);
  const h = r2(real[1] * mmL);
  const bezelW = glassW + (big ? 19.8 : 6.7) * mmL;
  const bezelH = glassH + (big ? 14.1 : 7.8) * mmL;
  const bezelX = (w - bezelW) / 2;
  const bezelY = big ? r2(10.35 * mmL) : r2(Math.max(3.0 * p, 2.6 * p + (h - 2.6 * p - 1.2 * p - bezelH) / 2));
  const parallel = ['VSS', 'VDD', 'V0', 'RS', 'RW', 'E', 'D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'A', 'K'];
  const names = backpack ? parallel : props.pins || parallel;
  const f = finish(T, props.finish || 'green');
  let s = board({
    width: w,
    height: h,
    finish: props.finish || 'green',
    holes: false,
    mark: props.mark === false ? undefined : { x: w - 2.2 * p, y: h / 2 - 0.45 * p, size: 0.9 * p },
  });
  // The mount holes with their plated rings, 2.5 mm in from each edge.
  [
    [2.5, 2.5],
    [real[0] - 2.5, 2.5],
    [2.5, real[1] - 2.5],
    [real[0] - 2.5, real[1] - 2.5],
  ].forEach(c => {
    s += tag(
      'hole',
      circle(c[0] * mmL, c[1] * mmL, 2.1 * mmL, T.pad) +
        circle(c[0] * mmL, c[1] * mmL, 1.25 * mmL, T.hole, edge(T, T['metal-edge'], 0.5)),
    );
  });
  // Silk: the module outline and the pin-1 mark.
  s += rect(1.2 * p, 1.8 * p, w - 2.4 * p, h - 3.2 * p, 'none', {
    rx: 1,
    stroke: f.silk,
    'stroke-width': T['stroke-fine'],
    'stroke-opacity': 0.4,
  });
  const hx = (big ? 10 : 8) * mmL;
  const hy = 2.5 * mmL;
  const hdr = header({ x: hx, y: hy, labels: names, side: 'below', silk: f.silk, size: PIN_LABEL });
  s += rect(hx - 0.5 * p, hy - 0.5 * p, p, p, 'none', {
    stroke: f.silk,
    'stroke-width': T['stroke-fine'],
    'stroke-opacity': 0.8,
  });
  // The backlight resistor and two capacitors beside the header (a bare module carries no trimmer; that is the I2C backpack's).
  s += smd(T, 'resistor', w - 4.4 * p, 0.45 * p, true) + smd(T, 'capacitor', w - 4.4 * p, 1.15 * p, true);
  hdr.pins.forEach((pn, i) => {
    s += trace(T, props.finish || 'green', [
      [pn.x, pn.y],
      [pn.x, pn.y + 1.0 * p],
      [pn.x + 0.5 * p, pn.y + 1.6 * p],
    ]);
  });
  s += via(T, 1.2 * p, h - 2.3 * p) + via(T, w - 1.3 * p, 2.6 * p) + via(T, w / 2, h - 0.55 * p);
  let shown = hdr.pins;
  let over = '';
  if (backpack) {
    // The backpack's pins fill the sixteen holes from behind: each pad shows a solder fillet and no hole, with the silk names kept.
    hdr.pins.forEach(pn => {
      s += tag(
        'solder',
        circle(pn.x, pn.y, T['pad-radius'], T.pad) +
          circle(pn.x, pn.y, T['hole-radius'] + 0.4, T.metal, edge(T, T['metal-edge'], 0.5)),
      );
    });
    hdr.pins.forEach((pn, i) => {
      s += text(pn.x, pn.y + T['label-drop'], names[i], PIN_LABEL, f.silk);
    });
    // Its four-pin header comes out of the left edge, GND at the top, on the pitch, drawn over the 20 x 4's bezel, which runs nearly to the edge.
    const side = header({
      x: 0.45 * p,
      y: 3.4 * p,
      labels: props.pins || ['GND', 'VCC', 'SDA', 'SCL'],
      axis: 'y',
      side: 'right',
      silk: f.silk,
      size: PIN_LABEL,
    });
    over =
      tag(
        'backpack-header',
        rect(0.05 * p, 2.9 * p, 0.8 * p, 4 * p, T['plastic-black'], { rx: 0.6, 'fill-opacity': 0.9 }),
      ) + side.svg;
    shown = side.pins;
  } else s += hdr.svg;
  // The chip-on-board strip shows under the bezel's lower edge.
  s += tag('cob', rect(bezelX + 1.2 * p, bezelY + bezelH - 0.3 * p, bezelW - 2.4 * p, 0.8 * p, T.chip, { rx: 0.5 }));
  [0.2, 0.5, 0.8].forEach(q => {
    s += rect(
      bezelX + 1.2 * p + (bezelW - 2.4 * p) * q - 0.8 * p,
      bezelY + bezelH + 0.05 * p,
      1.6 * p,
      0.35 * p,
      '#000000',
      { rx: 0.5, 'fill-opacity': 0.35 },
    );
  });
  s += tag(
    'body',
    rect(
      bezelX,
      bezelY,
      bezelW,
      bezelH,
      T['plastic-black'],
      Object.assign({ rx: T['radius-bezel'] }, edge(T, T['plastic-black-edge'])),
    ),
  );
  s += rect(bezelX + 1.5, bezelY + 1.5, bezelW - 3, bezelH - 3, 'none', {
    rx: T['radius-bezel'],
    stroke: '#ffffff',
    'stroke-width': 0.5,
    'stroke-opacity': 0.12,
  });
  const gx = bezelX + (bezelW - glassW) / 2;
  const gy = bezelY + (bezelH - glassH) / 2;
  s += rect(gx, gy, glassW, glassH, blue ? T['lcd-blue'] : T['lcd-green'], { 'data-hook': 'glass', rx: 0.8 });
  s += rect(gx, gy, glassW, glassH, 'none', {
    rx: 0.8,
    stroke: '#000000',
    'stroke-width': 0.6,
    'stroke-opacity': 0.25,
  });
  const ink = blue ? T['lcd-ink-light'] : T['lcd-ink'];
  const ox = gx + M.marginX * mmL;
  const oy = gy + M.marginY * mmL;
  let cells = '';
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const x = ox + c * cellDx;
      const y = oy + r * cellDy;
      const ch = (lines[r] || '')[c];
      const dots = glyphs ? glyphs[r * cols + c] : null;
      // Each character's box shows faintly, so an empty display still shows its grid, as the real part does.
      cells += rect(x, y, charW, charH, ink, { 'fill-opacity': 0.06 });
      if (dots) {
        for (let dy = 0; dy < 8; dy++)
          for (let dx = 0; dx < 5; dx++)
            if ((dots[dy] >> (4 - dx)) & 1) cells += rect(x + dx * dotDx, y + dy * dotDy, dotW, dotH, ink);
      } else if (!glyphs && ch && ch !== ' ')
        cells += text(x + charW / 2, y + charH * 0.86, ch, charH * 0.92, ink, { 'font-weight': 700 });
    }
  s +=
    el(
      'g',
      {
        'data-hook': 'matrix',
        'data-cols': cols,
        'data-rows': rows,
        'data-x': r2(ox),
        'data-y': r2(oy),
        'data-cell-dx': r2(cellDx),
        'data-cell-dy': r2(cellDy),
        'data-dot-dx': r2(dotDx),
        'data-dot-dy': r2(dotDy),
        'data-dot-w': r2(dotW),
        'data-dot-h': r2(dotH),
      },
      cells,
    ) + over;
  const shownText = glyphs ? '' : lines.length ? ` showing ${lines.join(' / ')}` : '';
  return art(w, h, `${cols}×${rows} character LCD${backpack ? ' with an I2C backpack' : ''}${shownText}`, s, shown);
}

// Segment polygons for one digit in a 5-pitch-wide cell, as rounded bars.
const SEG_OF = {
  0: 'abcdef',
  1: 'bc',
  2: 'abdeg',
  3: 'abcdg',
  4: 'bcfg',
  5: 'acdfg',
  6: 'acdefg',
  7: 'abc',
  8: 'abcdefg',
  9: 'abcdfg',
  '-': 'g',
  ' ': '',
  A: 'abcefg',
  b: 'cdefg',
  C: 'adef',
  d: 'bcdeg',
  E: 'adefg',
  F: 'aefg',
  H: 'bcefg',
  L: 'def',
  P: 'abefg',
  o: 'cdeg',
  r: 'eg',
  U: 'bcdef',
};

/**
 * A seven-segment display: digits in a black face, pins along the top and
 * bottom six pitches apart (the 0.56 inch package's 15.24 mm rows). value:
 * the characters to show; color: the lit lens. levels lights each segment
 * from 0 to 1 instead, eight a digit (A to G, then the point), as a
 * multiplexed or dimmed display averages. colon (true, or 0 to 1) lights
 * the four-digit display's colon, and showColon: false leaves it out. pins
 * names the rows, { top, bottom }, left to right: a repeated name carries a
 * .N suffix the silk drops (COM.1), and null is a leg the package has but
 * does not connect. Every bar is data-segment="digit-segment" (the digit
 * from 0; segments 0 to 6 for A to G, 7 the point) with data-level, over
 * its unlit twin; the colon's dots carry data-colon.
 */
export function sevenSegment(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const digits = Math.max(1, Math.min(4, props.digits || 1));
  const value = String(props.value === undefined ? '8' : props.value);
  const color = lensColor(T, props.color || 'red');
  const cellW = 5 * p;
  const w = digits * cellW;
  let h = 9 * p;
  let s = '';
  const off = T['segment-off'];
  const dim = T['opacity-segment-dim'];
  // Pin rows as the real packages carry them, numbered from pin 1 at the bottom left: one digit and two have ten pins, three twelve (pin 6 unconnected), four fourteen with COM and the colon.
  const LAYOUTS = {
    1: { top: ['G', 'F', 'COM.2', 'A', 'B'], bottom: ['E', 'D', 'COM', 'C', 'DP'] },
    2: { top: ['A', 'B', 'DIG1', 'DIG2', 'F'], bottom: ['C', 'DP', 'E', 'D', 'G'] },
    3: { top: ['DIG1', 'A', 'F', 'DIG2', 'DIG3', 'B'], bottom: ['E', 'D', 'DP', 'C', 'G', null] },
    4: { top: ['DIG1', 'A', 'F', 'DIG2', 'DIG3', 'B', 'CLN'], bottom: ['E', 'D', 'DP', 'C', 'G', 'DIG4', 'COM'] },
  };
  const names = props.pins || LAYOUTS[digits];
  const named = function (n) {
    return n !== null && n !== undefined;
  };
  // Labels of four characters stand on end, and the rows then sit lower so the labels stay inside the box; the rows stay six pitches apart.
  const allNames = names ? names.top.concat(names.bottom).filter(named).map(silkName) : [];
  const { rotate: rot } = labelRow(T, allNames, p);
  const pinTop = rot ? 1.6 * p : 1.0 * p;
  const dy = pinTop - 1.0 * p;
  h = rot ? 9.2 * p : 9 * p;
  s += tag(
    'body',
    rect(
      T['board-inset'],
      1.4 * p + dy,
      w - 2 * T['board-inset'],
      5.5 * p,
      T['segment-face'],
      Object.assign({ rx: 1.2 }, edge(T, T['plastic-black-edge'])),
    ),
  );
  s += rect(T['board-inset'] + 1.5, 1.4 * p + dy + 1.5, w - 2 * T['board-inset'] - 3, 5.5 * p - 3, 'none', {
    rx: 1,
    stroke: '#ffffff',
    'stroke-width': 0.5,
    'stroke-opacity': 0.1,
  });
  // A lit segment lays its colour over the unlit one, shaded when dim and burning white down its middle as it brightens
  // (shine), so a dimly driven segment still shows and each level reads apart.
  const clamp = function (v) {
    v = Number(v);
    return v > 0 ? Math.min(1, v) : 0;
  };
  const level = function (on, d, sgm) {
    return props.levels ? clamp(props.levels[d * 8 + sgm]) : on ? 1 : 0;
  };
  const glow = function (lv) {
    return lv > 0 ? r2(dim + (1 - dim) * shine(lv).lens) : 0;
  };
  // The shade and the white-hot middle over a lit segment's shape.
  const lightOver = function (shape, lv) {
    if (!(lv > 0)) return '';
    const L = shine(lv);
    return (
      shape(T['plastic-black'], { 'fill-opacity': r2(0.8 * L.shade) }) +
      shape(sheen('hot'), { 'fill-opacity': r2(0.25 + 0.6 * L.hot) })
    );
  };
  const bar = function (x, y, len, horizontal, lv, d, sgm) {
    const t = 0.42 * p;
    const bx = horizontal ? x : x - t / 2;
    const by = horizontal ? y - t / 2 : y;
    const bw = horizontal ? len : t;
    const bh = horizontal ? t : len;
    return (
      rect(bx, by, bw, bh, off, { rx: t / 2 }) +
      rect(bx, by, bw, bh, color, {
        rx: t / 2,
        'fill-opacity': glow(lv),
        'data-segment': `${d}-${sgm}`,
        'data-level': r2(lv),
      }) +
      lightOver((fill, more) => rect(bx, by, bw, bh, fill, Object.assign({ rx: t / 2 }, more)), lv)
    );
  };
  const dot = function (cx, cy, lv, hook) {
    return (
      circle(cx, cy, 0.24 * p, off) +
      circle(cx, cy, 0.24 * p, color, Object.assign({ 'fill-opacity': glow(lv), 'data-level': r2(lv) }, hook)) +
      lightOver((fill, more) => circle(cx, cy, 0.24 * p, fill, more), lv)
    );
  };
  const colonLevel = typeof props.colon === 'number' ? clamp(props.colon) : props.colon ? 1 : 0;
  for (let d = 0; d < digits; d++) {
    const lit = SEG_OF[value[d] === undefined ? ' ' : value[d]] || '';
    const ox = d * cellW + 1.2 * p;
    const oy = 2.0 * p + dy;
    const sw = 2.0 * p;
    const sh = 2.0 * p;
    const on = function (k) {
      return lit.indexOf(k) >= 0;
    };
    // Real digits lean about ten degrees.
    const skew = `skewX(-10) translate(${r2((oy + sh) * 0.176)} 0)`;
    let g = '';
    g += bar(ox + 0.25 * p, oy, sw, true, level(on('a'), d, 0), d, 0);
    g += bar(ox + sw + 0.25 * p, oy + 0.2 * p, sh - 0.4 * p, false, level(on('b'), d, 1), d, 1);
    g += bar(ox + sw + 0.25 * p, oy + sh + 0.2 * p, sh - 0.4 * p, false, level(on('c'), d, 2), d, 2);
    g += bar(ox + 0.25 * p, oy + 2 * sh, sw, true, level(on('d'), d, 3), d, 3);
    g += bar(ox + 0.25 * p, oy + sh + 0.2 * p, sh - 0.4 * p, false, level(on('e'), d, 4), d, 4);
    g += bar(ox + 0.25 * p, oy + 0.2 * p, sh - 0.4 * p, false, level(on('f'), d, 5), d, 5);
    g += bar(ox + 0.25 * p, oy + sh, sw, true, level(on('g'), d, 6), d, 6);
    s += el('g', { 'data-digit': d + 1, transform: skew }, g);
    if (digits === 4 && d === 1 && props.showColon !== false)
      s +=
        dot(ox + sw + 1.0 * p, oy + sh * 0.5, colonLevel, { 'data-colon': 'true' }) +
        dot(ox + sw + 1.0 * p, oy + sh * 1.5, colonLevel, { 'data-colon': 'true' });
    s += dot(ox + sw + 1.0 * p, oy + 2 * sh, level(!!(props.dp && props.dp[d]), d, 7), { 'data-segment': `${d}-7` });
  }
  const pins = [];
  if (names) {
    // Each row is centred under the body on the pitch; the top row's first pin sets the grid the bottom row follows.
    const tx0 = r2((Math.round(((w - (names.top.length - 1) * p) / 2 / p) * 2) / 2) * p);
    const bx0 = tx0 + Math.round(((w - (names.bottom.length - 1) * p) / 2 - tx0) / p) * p;
    const row = function (x0, y, list, side) {
      list.forEach((n, i) => {
        if (!named(n)) return;
        s += pin({
          x: x0 + i * p,
          y,
          kind: 'leg',
          label: silkName(n),
          side,
          silk: 'currentColor',
          size: PIN_LABEL,
          rotate: rot,
        });
        pins.push({ name: n, x: x0 + i * p, y });
      });
    };
    names.top.forEach((_, i) => {
      s = wire(tx0 + i * p, pinTop, tx0 + i * p, pinTop + 0.6 * p) + s;
    });
    names.bottom.forEach((_, i) => {
      s = wire(bx0 + i * p, pinTop + 5.8 * p, bx0 + i * p, pinTop + 6 * p) + s;
    });
    row(tx0, pinTop, names.top, 'above');
    row(bx0, pinTop + 6 * p, names.bottom, 'below');
  } else {
    for (let i = 0; i < digits * 5; i++) {
      s =
        wire(0.5 * p + i * p, 1.0 * p, 0.5 * p + i * p, 1.6 * p) +
        wire(0.5 * p + i * p, 6.8 * p, 0.5 * p + i * p, 7.0 * p) +
        s;
      pins.push({ name: `t${i + 1}`, x: 0.5 * p + i * p, y: 1.0 * p });
      pins.push({ name: `b${i + 1}`, x: 0.5 * p + i * p, y: 7.0 * p });
    }
  }
  return art(
    w,
    h,
    `${digits}-digit seven-segment display${props.levels || !value.trim() ? '' : ` showing ${value}`}`,
    s,
    pins,
  );
}

/**
 * A screen's picture over its window (x, y, w, h): `pixels` is a frame
 * { width, height, data } with data row by row from the top left. A falsy
 * entry is dark; true or 1 is lit in the panel's `ink`; a string is a CSS
 * colour, which a `colour` panel draws as it is and a monochrome one in its
 * ink. Each colour's horizontal runs are one path, in a group with the hook picture.
 */
function screenPicture(props, x, y, w, h, ink, colour) {
  const px = props.pixels;
  if (!px || !(px.width > 0) || !(px.height > 0) || !px.data) return '';
  const cw = w / px.width;
  const ch = h / px.height;
  const paths = {};
  const order = [];
  const fill = function (v) {
    return colour && typeof v === 'string' ? v : ink;
  };
  for (let row = 0; row < px.height; row++) {
    for (let col = 0; col < px.width; col++) {
      const v = px.data[row * px.width + col];
      if (!v) continue;
      const c = fill(v);
      let run = col;
      while (run + 1 < px.width && px.data[row * px.width + run + 1] && fill(px.data[row * px.width + run + 1]) === c)
        run++;
      if (!(c in paths)) {
        paths[c] = '';
        order.push(c);
      }
      paths[c] +=
        `M${r2(x + col * cw)} ${r2(y + row * ch)}h${r2((run - col + 1) * cw)}v${r2(ch)}h${r2(-(run - col + 1) * cw)}z`;
      col = run;
    }
  }
  const out = order
    .map(c => {
      return el('path', { d: paths[c], fill: c, 'shape-rendering': 'crispEdges' });
    })
    .join('');
  return out ? el('g', { 'data-hook': 'picture', 'data-width': px.width, 'data-height': px.height }, out) : '';
}

/** A flex tail folding under a board edge: the kapton strip with the panel's black end over it. */
function flexTab(T, x, y, w, h) {
  return tag(
    'smd',
    rect(x, y, w, h, '#b8792f', Object.assign({ rx: 0.6 }, edge(T, '#8a5a20', T['stroke-fine']))) +
      rect(x + 1.0, y, w - 2.0, h * 0.45, T['plastic-black'], { rx: 0.4 }),
  );
}

/**
 * The 0.96 inch SSD1306 module from its photographs: a blue board 27 mm
 * square with the header along the top (the catalog's eight SPI pins, or
 * the four I2C ones), four corner holes, and the 26.7 x 19.3 mm panel below
 * the header with its 128 x 64 window (hook display) in the upper part, the
 * driver's dark band along the panel's foot and the flex tail folding under
 * the board at the bottom centre. The eight-pin board is a millimetre taller
 * so the longer names fit between the pins and the glass.
 */
export function oledBreakout(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'blue';
  const f = finish(T, fin);
  const names = props.pins || ['DATA', 'CLK', 'DC', 'RST', 'CS', '3V3', 'VIN', 'GND'];
  const { rotate } = labelRow(T, names, p);
  const w = 10.6 * p;
  const h = rotate ? 11 * p : 10.6 * p;
  const gy = rotate ? 2.3 * p : 1.6 * p;
  let s = '';
  s += board({
    width: w,
    height: h,
    finish: fin,
    holes: true,
    mark: { x: w - 2.4 * p, y: h - 1.15 * p, size: 0.6 * p },
  });
  const hdr = header({
    x: r2((w - (names.length - 1) * p) / 2),
    y: 0.6 * p,
    labels: names,
    kind: 'pad',
    side: 'below',
    silk: f.silk,
    size: PIN_LABEL,
    rotate,
  });
  hdr.pins.forEach(pn => {
    s += trace(T, fin, [
      [pn.x, pn.y],
      [pn.x, gy + 0.6 * p],
    ]);
  });
  const gw = 26.7 * mm;
  const gh = 19.26 * mm;
  const gx = (w - gw) / 2;
  s += flexTab(T, w / 2 - 5 * mm, gy + gh - 0.5, 10 * mm, 0.45 * p + 0.5);
  s += tag('body', rect(gx, gy, gw, gh, T.bezel, Object.assign({ rx: 1 }, edge(T, T['plastic-black-edge']))));
  s += rect(gx + 1.5, gy + gh - 2.6 * mm - 1.5, gw - 3, 2.6 * mm, T['plastic-black'], { rx: 0.6 });
  s += rect(gx + 1.5, gy + 1.5, gw - 3, 0.6 * mm, '#ffffff', { 'fill-opacity': 0.12 });
  const ww = 21.74 * mm;
  const wh = 10.86 * mm;
  const wx = gx + (gw - ww) / 2;
  const wy = gy + 1.4 * mm;
  s += rect(wx, wy, ww, wh, T.glass, { 'data-hook': 'display', 'data-width': 128, 'data-height': 64, rx: 0.5 });
  s += screenPicture(props, wx, wy, ww, wh, T['readout-text']);
  if (props.caption)
    s += text(wx + ww / 2, wy + wh / 2 + 2.4, props.caption, 6.4, T['readout-text'], { 'font-weight': 600 });
  s += hdr.svg;
  return art(w, h, `0.96 inch OLED module, ${names.length}-pin`, s, hdr.pins);
}

/**
 * The 1.5 inch SH1107 module (the four-pin MC01506 board) from its
 * photographs and listed size: a blue board 34.3 x 45.5 mm with four pins
 * centred along the top (GND, VCC, SCL, SDA from the left, as its back
 * prints them mirrored), a hole 2.5 mm in from each corner, the 31 x 35 mm
 * panel filling the board's width with its 26.9 mm square window (id
 * display, 128 x 128) near the top, the driver's band at the panel's foot
 * and the flex folding under the board at the bottom centre.
 */
export function oledSquare(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'blue';
  const f = finish(T, fin);
  const cols = props.columns || 128;
  const rows = props.rows || 128;
  const names = props.pins || ['GND', 'VCC', 'SCL', 'SDA'];
  const w = 34.3 * mm;
  const h = 45.5 * mm;
  let s = '';
  s += board({
    width: w,
    height: h,
    finish: fin,
    holes: false,
    mark: { x: w - 2.6 * p, y: h - 1.05 * p, size: 0.6 * p },
  });
  [
    [2.5, 2.5],
    [31.8, 2.5],
    [2.5, 43.0],
    [31.8, 43.0],
  ].forEach(c => {
    s += hole(T, c[0] * mm, c[1] * mm, 1.3 * mm, 1.0);
  });
  const hdr = header({
    x: r2((w - (names.length - 1) * p) / 2),
    y: 0.6 * p,
    labels: names,
    kind: 'pad',
    side: 'below',
    silk: f.silk,
    size: PIN_LABEL,
  });
  const gw = 31 * mm;
  const gh = 35 * mm;
  const gx = (w - gw) / 2;
  const gy = 1.6 * p;
  const aw = 26.9 * mm;
  const ah = 26.9 * mm;
  hdr.pins.forEach(pn => {
    s += trace(T, fin, [
      [pn.x, pn.y],
      [pn.x, gy + 0.5 * p],
    ]);
  });
  s += flexTab(T, w / 2 - 5 * mm, gy + gh - 0.5, 10 * mm, 0.5 * p + 0.5);
  s += tag(
    'body',
    rect(gx, gy, gw, gh, T.bezel, Object.assign({ rx: 1, 'data-hook': 'glass' }, edge(T, T['plastic-black-edge']))),
  );
  s += rect(gx + 1.5, gy + gh - 3.3 * mm - 1.5, gw - 3, 3.3 * mm, T['plastic-black'], { rx: 0.6 });
  s += rect(gx + 1.5, gy + 1.5, gw - 3, 0.6 * mm, '#ffffff', { 'fill-opacity': 0.1 });
  const ax = gx + (gw - aw) / 2;
  const ay = gy + 2.0 * mm;
  s += rect(ax, ay, aw, ah, T.glass, { 'data-hook': 'display', 'data-width': cols, 'data-height': rows });
  s += screenPicture(props, ax, ay, aw, ah, T['readout-text']);
  if (props.caption)
    s += text(ax + aw / 2, ay + ah / 2 + 3, props.caption, 7.5, T['readout-text'], { 'font-weight': 600 });
  s += text(4.6 * mm, h - 1.6 * mm, props.label || `${cols}x${rows} OLED`, PIN_LABEL, f.silk, {
    'text-anchor': 'start',
  });
  s += hdr.svg;
  return art(w, h, `${cols} x ${rows} OLED module`, s, hdr.pins);
}

/**
 * The ILI9341 SPI module from its size drawing. The 2.4 inch board (default):
 * red, 42.72 x 77.18 mm, the 42.72 x 60.26 mm glass from 6.51 mm down with
 * its 240 x 320 window (hook display) 3 mm in and 9.26 mm down, four holes 3 mm
 * in from the sides, 3 mm from the top and 6.92 mm from the bottom, the
 * 14-place J2 along the bottom edge from 4.85 mm in and the four SD pads of
 * J4 along the top. touch: true draws the 2.8 inch capacitive-touch board
 * instead: 50 x 86 mm, the 50 x 69.2 mm glass from 6.4 mm down with its
 * 43.2 x 57.6 mm window 3.4 mm in and 9.3 mm down, the holes 44 x 76.08 mm
 * apart from 3 mm in, and J2 centred from 8.49 mm in. The catalog's pins fill
 * J2's places from the first; a null leaves a place bare, and so do the
 * places past the list. The flex folds off the glass's foot to the board.
 */
export function tftModule(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'red';
  const f = finish(T, fin);
  const cap = !!props.touch;
  let s = '';
  const names = props.pins || ['VCC', 'GND', 'CS', 'RST', 'D/C', 'MOSI', 'SCK', 'LED', 'MISO'];
  const G = cap
    ? {
        w: 50,
        h: 86,
        gy: 6.4,
        gh: 69.2,
        ww: 43.2,
        wh: 57.6,
        wx: 3.4,
        wy: 9.3,
        holes: [
          [3.0, 3.0],
          [47.0, 3.0],
          [3.0, 79.08],
          [47.0, 79.08],
        ],
        jx: 8.49,
      }
    : {
        w: 42.72,
        h: 77.18,
        gy: 6.51,
        gh: 60.26,
        ww: 36.72,
        wh: 48.96,
        wx: 3.0,
        wy: 9.26,
        holes: [
          [3.0, 3.0],
          [39.72, 3.0],
          [3.0, 70.26],
          [39.72, 70.26],
        ],
        jx: 4.85,
      };
  const w = G.w * mm;
  const h = G.h * mm;
  s += board({
    width: w,
    height: h,
    finish: fin,
    holes: false,
    mark: props.mark === false ? undefined : { x: 10.0 * mm, y: 3.0 * mm, size: 0.7 * p },
  });
  G.holes.forEach(c => {
    s += hole(T, c[0] * mm, c[1] * mm, 1.5 * mm, 1.0);
  });
  // J4, the 2.4 inch board's four SD pads; the 2.8 inch board carries its SD select on J2.
  const jx = G.jx * mm;
  const jy = h - 2.0 * mm;
  if (!cap) {
    for (let k = 0; k < 4; k++) s += barePad(T, (17.23 + k * 2.54) * mm, 2.17 * mm);
    s += text((17.23 + 3 * 2.54) * mm + 2.4 * mm, 2.17 * mm + 1.4, 'J4', PIN_LABEL, f.silk);
  }
  s += text(jx - 0.55 * p, jy + 1.4, 'J2', PIN_LABEL, f.silk, { 'text-anchor': 'end' });
  // The glass, the window and the flex folding off its foot to the board.
  const gx = 0.2 * mm;
  const gy = G.gy * mm;
  const gw = w - 0.4 * mm;
  const gh = G.gh * mm;
  s += flexTab(T, gx + gw / 2 - 9 * mm, gy + gh - 0.5, 18 * mm, 0.5 * p + 0.5);
  s += tag(
    'body',
    rect(gx, gy, gw, gh, T.bezel, Object.assign({ rx: 1, 'data-hook': 'glass' }, edge(T, T['plastic-black-edge']))),
  );
  const ww = G.ww * mm;
  const wh = G.wh * mm;
  const wx = G.wx * mm;
  const wy = G.wy * mm;
  s += rect(wx, wy, ww, wh, T.glass, { 'data-hook': 'display', 'data-width': 240, 'data-height': 320, rx: 0.5 });
  s += rect(gx + 2, gy + gh - 5.6 * mm, gw - 4, 4.2 * mm, T['plastic-black'], { rx: 0.6 });
  s += rect(gx + 2, gy + 1.5, gw - 4, 0.8 * mm, '#ffffff', { 'fill-opacity': 0.1 });
  s += screenPicture(props, wx, wy, ww, wh, '#ffffff', true);
  if (props.caption)
    s += text(wx + ww / 2, wy + wh / 2 + 3, props.caption, 7.5, T['readout-text'], { 'font-weight': 600 });
  // J2: the named places as pins, the rest bare.
  const pins = [];
  for (let i = 0; i < 14; i++) {
    const x = jx + i * p;
    const n = names[i];
    if (typeof n === 'string') {
      s += pin({ x, y: jy, kind: 'pad', label: n, side: 'above', silk: f.silk, size: PIN_LABEL, rotate: true });
      pins.push({ name: n, x, y: jy });
    } else s += barePad(T, x, jy);
  }
  return art(w, h, cap ? '2.8 inch TFT module with capacitive touch' : '2.4 inch TFT module', s, pins);
}

/**
 * The Nokia 5110 module from its picture: a red board 45.7 mm square with
 * the eight-pin header along the bottom edge (RST, CE, DC, DIN, CLK, VCC,
 * BL, GND) and the same eight places repeated along the top as bare pads
 * in a silk frame, four corner holes, C1 and D1 beside the top corners, and
 * the 40 x 34 mm glass in its metal frame with the frame's side tabs, the
 * elastomer strip along its foot and the 30 x 20 mm active area (hook display,
 * 84 x 48) in its upper part.
 */
export function nokiaModule(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'red';
  const f = finish(T, fin);
  const w = 18 * p;
  const h = 18 * p;
  let s = '';
  const names = props.pins || ['RST', 'CE', 'DC', 'DIN', 'CLK', 'VCC', 'BL', 'GND'];
  s += board({ width: w, height: h, finish: fin, holes: true, mark: { x: 14.6 * p, y: h - 1.1 * p, size: 0.6 * p } });
  const x0 = r2((w - (names.length - 1) * p) / 2);
  s += rect(x0 - 0.6 * p, 0.7 * p - 0.4 * p, (names.length - 1) * p + 1.2 * p, 0.8 * p, 'none', {
    stroke: f.silk,
    'stroke-width': T['stroke-fine'],
    'stroke-opacity': 0.8,
    rx: 0.4,
  });
  names.forEach((n, i) => {
    s += barePad(T, x0 + i * p, 0.7 * p);
  });
  s += rect(x0 - 0.6 * p, h - 0.7 * p - 0.4 * p, (names.length - 1) * p + 1.2 * p, 0.8 * p, 'none', {
    stroke: f.silk,
    'stroke-width': T['stroke-fine'],
    'stroke-opacity': 0.8,
    rx: 0.4,
  });
  s += rect(x0 - 0.45 * p, h - 1.15 * p, 0.9 * p, 0.9 * p, 'none', {
    stroke: f.silk,
    'stroke-width': T['stroke-fine'],
    'stroke-opacity': 0.9,
  });
  const hdr = header({
    x: x0,
    y: h - 0.7 * p,
    labels: names,
    kind: 'pad',
    side: 'above',
    silk: f.silk,
    size: PIN_LABEL,
  });
  s +=
    smd(T, 'capacitor', 1.5 * p, 0.45 * p, true) +
    text(1.5 * p, 0.35 * p, 'C1', PIN_LABEL, f.silk, { 'text-anchor': 'start' });
  s +=
    smd(T, 'resistor', w - 2.4 * p, 0.45 * p, true) +
    text(w - 2.4 * p, 0.35 * p, 'D1', PIN_LABEL, f.silk, { 'text-anchor': 'start' });
  const gw = 40 * mm;
  const gh = 34 * mm;
  const fr = 1.2 * mm;
  const gx = (w - gw) / 2;
  const gy = 1.9 * p + fr;
  [0.25, 0.75].forEach(q => {
    const ty = gy + gh * q - 0.5 * p;
    s += tag(
      'smd',
      rect(
        gx - fr - 0.25 * p,
        ty,
        0.25 * p + 1,
        p,
        T.metal,
        Object.assign({ rx: 0.5 }, edge(T, T['metal-edge'], T['stroke-fine'])),
      ) +
        rect(
          gx + gw + fr - 1,
          ty,
          0.25 * p + 1,
          p,
          T.metal,
          Object.assign({ rx: 0.5 }, edge(T, T['metal-edge'], T['stroke-fine'])),
        ),
    );
  });
  s += tag(
    'body',
    rect(gx - fr, gy - fr, gw + 2 * fr, gh + 2 * fr, T.metal, Object.assign({ rx: 1.4 }, edge(T, T['metal-edge']))),
  );
  s += bevel(T, gx - fr, gy - fr, gw + 2 * fr, gh + 2 * fr, 1.4, 1.4);
  s += rect(
    gx,
    gy,
    gw,
    gh,
    '#c9d3bd',
    Object.assign({ 'data-hook': 'glass', rx: 0.8 }, edge(T, '#8d9a85', T['stroke-fine'])),
  );
  s += rect(gx + 1.2 * mm, gy + gh - 5.0 * mm, gw - 2.4 * mm, 3.4 * mm, '#2a2f33', { rx: 0.6, 'fill-opacity': 0.55 });
  const dw = 30 * mm;
  const dh = 20 * mm;
  const dx = gx + (gw - dw) / 2;
  const dy = gy + 4.6 * mm;
  s += rect(dx, dy, dw, dh, 'none', { 'data-hook': 'display', 'data-width': 84, 'data-height': 48 });
  s += screenPicture(props, dx, dy, dw, dh, '#1c2a1a');
  if (props.caption) s += text(dx + dw / 2, dy + dh / 2 + 2.6, props.caption, 6.8, '#1c2a1a', { 'font-weight': 700 });
  s += text(1.2 * p, h - 0.6 * p, props.label || 'PCD8544 84x48', PIN_LABEL, f.silk, { 'text-anchor': 'start' });
  s += hdr.svg;
  return art(w, h, 'PCD8544 84 x 48 graphic LCD module', s, hdr.pins);
}

/**
 * The 2.9 inch e-paper module from Waveshare's size drawing: a blue board
 * 89.5 x 38 mm with four 3 mm holes (2.5 mm in at the flex end, 2.0 mm at
 * the other), the 79 x 36.7 mm panel with its paper (hook paper) and the
 * 66.89 x 29.05 mm active area (hook display, 296 x 128), and the flex round
 * the board's left edge from 10.5 mm down. The eight-pin connector is on
 * the back at the right end; its pins are drawn on the strip there in its
 * order, BUSY at the top, one pitch apart so they sit on the grid.
 */
export function epaperModule(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const M = function (v) {
    return v * mm;
  };
  const fin = props.finish || 'blue';
  const f = finish(T, fin);
  const w = M(89.5);
  const h = M(38);
  let s = '';
  const names = props.pins || ['BUSY', 'RST', 'DC', 'CS', 'CLK', 'DIN', 'GND', 'VCC'];
  s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: M(84.7), y: M(30.2), size: 0.7 * p } });
  [
    [M(2.5), M(2.5)],
    [M(2.5), M(35.5)],
    [M(87.5), M(2.5)],
    [M(87.5), M(35.5)],
  ].forEach(c => {
    s += hole(T, c[0], c[1], M(1.5), 1.0);
  });
  // The flex round the board's edge, then the panel: the glass, the driver's strip at the flex end, the paper and the active area.
  const pw = M(79);
  const ph = M(36.7);
  const px = M(5.0);
  const py = (h - ph) / 2;
  s += tag(
    'smd',
    rect(M(0.6), M(10.5), M(4.8), M(16.5), '#b8792f', Object.assign({ rx: 0.8 }, edge(T, '#8a5a20', T['stroke-fine']))),
  );
  s += tag(
    'body',
    rect(px, py, pw, ph, '#d9d7cf', Object.assign({ rx: 1.0 }, edge(T, T['metal-edge'], T['stroke-fine']))),
  );
  s +=
    rect(px + M(0.4), py + M(0.4), M(3.4), ph - M(0.8), '#efeee8', { rx: 0.6 }) +
    rect(px + M(1.6), h / 2 - M(4.0), M(1.0), M(8.0), T.chip, { rx: 0.3 });
  s += rect(px + M(4.2), py + M(0.6), pw - M(4.8), ph - M(1.2), '#f2f0ea', { 'data-hook': 'paper', rx: 0.8 });
  const dw = M(66.89);
  const dh = M(29.05);
  const dx = px + pw - M(2.3) - dw;
  const dy = (h - dh) / 2;
  s += rect(dx, dy, dw, dh, '#f2f0ea', { 'data-hook': 'display', 'data-width': 296, 'data-height': 128 });
  s += screenPicture(props, dx, dy, dw, dh, '#1a1a1a');
  if (props.caption) s += text(dx + dw / 2, dy + dh / 2 + 2.8, props.caption, 7.5, '#1a1a1a', { 'font-weight': 700 });
  const hdr = header({
    x: M(88.2),
    y: h / 2 - ((names.length - 1) * p) / 2,
    axis: 'y',
    labels: names,
    kind: 'pad',
    side: 'left',
    silk: f.silk,
    size: PIN_LABEL,
  });
  s += hdr.svg;
  return art(w, h, '2.9 inch 296 x 128 e-paper module', s, hdr.pins);
}

/**
 * The MAX7219 matrix module from its photographs (the FC-16 board): `chain`
 * 32 mm faces side by side covering a blue board as long as they are, each
 * an 8 x 8 grid of 3 mm LED
 * wells at the real 3.8 mm pitch (data-led "face-row-col", data-lit; the
 * face rect has the hook face-N with data-rows and data-cols), and the right-angle
 * headers soldered on the back at each end, their pins standing past the
 * board's ends on the grid: the input at the right (V+, GND, DIN, CS, CLK),
 * the output at the left (V+.2, GND.2, DOUT, CS.2, CLK.2). The board prints
 * their names on the back, so the front shows none. Face 0 is
 * the rightmost, nearest DIN; a chain runs to 32 faces. `lit` lists each
 * face's rows as strings of 0 and 1; an unlit well is the pale grey of a
 * resting LED.
 */
export function max7219Matrix(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  let fin = 'blue';
  let f = finish(T, fin);
  const chain = Math.max(1, Math.min(32, Math.floor(Number(props.chain) || 1)));
  const face = 32 * mm;
  let w = (Math.ceil(12.6 * chain) + 5) * p;
  let h = 13 * p;
  let s = '';
  const on = lensColor(T, props.color || 'red');
  const off = T['indicator-off-light'];
  const lit = props.lit || [];
  const pins = [];
  const wells = function (fx, fy, k) {
    let g = rect(
      fx,
      fy,
      face,
      face,
      T['segment-face'],
      Object.assign(
        { rx: 1.2, 'data-hook': `face-${k}`, 'data-rows': 8, 'data-cols': 8 },
        edge(T, T['plastic-black-edge'], T['stroke-fine']),
      ),
    );
    const pitch = 3.8 * mm;
    const ox = fx + (face - 7 * pitch) / 2;
    const oy = fy + (face - 7 * pitch) / 2;
    const rowsLit = lit[k] || [];
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        const isOn = String(rowsLit[r] || '')[c] === '1';
        const cx = ox + c * pitch;
        const cy = oy + r * pitch;
        g += circle(cx, cy, 1.5 * mm, isOn ? on : off, {
          'data-led': `${k}-${r}-${c}`,
          'data-lit': isOn ? 'true' : 'false',
        });
        g += circle(cx, cy, 0.8 * mm, isOn ? '#ffffff' : T['plastic-white-edge'], {
          'fill-opacity': isOn ? 0.55 : 0.35,
        });
      }
    return tag('body', g);
  };
  if (chain === 1) {
    // The single module from its photograph: a green board 33 x 51 mm with the MAX7219 in a DIP-24 above the face,
    // the five-pin input header standing out of the top edge (CLK, CS, DIN, GND, V+) and the output pins out of the bottom.
    fin = 'green';
    f = finish(T, fin);
    w = 13 * p;
    h = 22 * p;
    s = '';
    const inOrder = ['CLK', 'CS', 'DIN', 'GND', 'V+'];
    const outOrder = ['CLK.2', 'CS.2', 'DOUT', 'GND.2', 'V+.2'];
    const x0 = 4.5 * p;
    const at = {};
    s += board({
      width: w,
      height: 20 * p,
      y: 1 * p,
      finish: fin,
      holes: 'top',
      mark: { x: 1.2 * p, y: 2.6 * p, size: 0.7 * p },
    });
    inOrder.forEach((n, i) => {
      const x = x0 + i * p;
      s += tag(
        'leg',
        rect(x - 1.45, 0, 2.9, 1.0 * p, T['lead-edge'], { rx: 0.6 }) +
          rect(x - 0.95, 0, 1.9, 1.0 * p, T.lead, { rx: 0.5 }),
      );
      s += pin({ x, y: 1.0 * p, kind: 'leg', label: n, side: 'below', rotate: true, silk: f.silk, size: PIN_LABEL });
      s += tag(
        'leg',
        rect(x - 1.45, 21 * p, 2.9, 1.0 * p, T['lead-edge'], { rx: 0.6 }) +
          rect(x - 0.95, 21 * p, 1.9, 1.0 * p, T.lead, { rx: 0.5 }),
      );
      s += text(x, 20.65 * p, outOrder[i].replace('.2', ''), PIN_LABEL, f.silk);
      at[n] = { x, y: 1.0 * p };
      at[outOrder[i]] = { x, y: 21 * p };
    });
    s += dipOnBoard(T, 0.5 * p, 5.6 * p, 12, 'MAX7219');
    s += wells(0.2 * p, 20 * p - face, 0);
    ['V+', 'GND', 'DIN', 'CS', 'CLK', 'V+.2', 'GND.2', 'DOUT', 'CS.2', 'CLK.2'].forEach(n => {
      pins.push({ name: n, x: at[n].x, y: at[n].y });
    });
    return art(w, h, '1 x MAX7219 8x8 LED matrix', s, pins);
  }
  // The board under the faces, the pins at least 2 mm past each end and a whole number of pitches apart.
  const bw = chain * face;
  const i0 = T['board-inset'];
  w = Math.ceil((bw + 4 * mm) / p) * p;
  h = face;
  const ext = (w - bw) / 2;
  s += tag(
    'board',
    rect(ext + i0, i0, bw - 2 * i0, h - 2 * i0, f.board, Object.assign({ rx: T['radius-board'] }, edge(T, f.edge))),
  );
  const inNames = ['V+', 'GND', 'DIN', 'CS', 'CLK'];
  const outNames = ['V+.2', 'GND.2', 'DOUT', 'CS.2', 'CLK.2'];
  for (let i = 0; i < 5; i++) {
    const y = h / 2 + (i - 2) * p;
    s += tag(
      'leg',
      rect(w - ext - 2 * mm, y - 1.45, ext + 2 * mm, 2.9, T['lead-edge'], { rx: 0.6 }) +
        rect(w - ext - 2 * mm, y - 0.95, ext + 2 * mm, 1.9, T.lead, { rx: 0.5 }),
    );
    s += tag(
      'leg',
      rect(0, y - 1.45, ext + 2 * mm, 2.9, T['lead-edge'], { rx: 0.6 }) +
        rect(0, y - 0.95, ext + 2 * mm, 1.9, T.lead, { rx: 0.5 }),
    );
    pins.push({ name: inNames[i], x: w, y });
  }
  for (let k = 0; k < chain; k++) s += wells(ext + (chain - 1 - k) * face, 0, k);
  outNames.forEach((n, i) => {
    pins.push({ name: n, x: 0, y: h / 2 + (i - 2) * p });
  });
  return art(w, h, `${chain} x MAX7219 8x8 LED matrix`, s, pins);
}

/**
 * The TM1637 4-digit module from its photograph: a blue board 42 x 24 mm
 * with the 30 x 14 mm white display package centred on its height, its dark face carrying four
 * leaning digits with the colon between the second and third (type 'colon')
 * or a point after each digit (type 'dp'), four right-angle legs out of the
 * right edge (CLK, DIO, VCC, GND) a pitch past it, two holes at the other end and the name
 * on the silk. Every bar is data-segment="digit-segment" (segments 0 to 6
 * for A to G, 7 the point) with data-lit; the colon dots carry data-colon.
 */
export function tm1637Module(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'blue';
  const f = finish(T, fin);
  const bw = 42 * mm;
  const w = bw + p;
  const h = 24 * mm;
  let s = '';
  const color = lensColor(T, props.color || 'red');
  const value = String(props.value === undefined ? '' : props.value);
  const dp = props.type === 'dp';
  const off = T['indicator-off-light'];
  s += board({ width: bw, height: h, finish: fin, holes: false, mark: { x: 1.3 * p, y: h / 2, size: 0.7 * p } });
  [
    [2.5 * mm, 2.5 * mm],
    [2.5 * mm, h - 2.5 * mm],
  ].forEach(c => {
    s += hole(T, c[0], c[1], T['mount-hole-radius']);
  });
  const names = props.pins || ['CLK', 'DIO', 'VCC', 'GND'];
  const pins = [];
  names.forEach((n, i) => {
    const y = h / 2 + (i - 1.5) * p;
    s += trace(T, fin, [
      [bw - 1.0 * p, y],
      [bw - 2.4 * p, y],
      [bw - 3.0 * p, y - 0.4 * p],
    ]);
    s +=
      tag(
        'leg',
        rect(bw - 1.0 * p, y - 1.45, 2.0 * p, 2.9, T['lead-edge'], { rx: 0.6 }) +
          rect(bw - 1.0 * p, y - 0.95, 2.0 * p, 1.9, T.lead, { rx: 0.5 }),
      ) + text(bw - 1.15 * p, y + 1.4, n, PIN_LABEL, f.silk, { 'text-anchor': 'end' });
    pins.push({ name: n, x: w, y });
  });
  const fw = 30 * mm;
  const fh = 14 * mm;
  const fx = 2.5 * p;
  const fy = (h - fh) / 2;
  const rim = 0.3 * p;
  s += tag(
    'body',
    rect(fx, fy, fw, fh, T['plastic-white'], Object.assign({ rx: 1.2 }, edge(T, T['plastic-white-edge']))),
  );
  s += bevel(T, fx, fy, fw, fh, 1.4, 1.2);
  s += rect(fx + rim, fy + rim, fw - 2 * rim, fh - 2 * rim - 0.25 * p, T['segment-face'], { rx: 0.8 });
  s += text(fx + fw - rim - 1.5, fy + fh - 0.1 * p, '3642BS', PIN_LABEL, T['plastic-white-edge'], {
    'text-anchor': 'end',
    'fill-opacity': 0.9,
  });
  const sw = 1.35 * p;
  const sh = 1.35 * p;
  const cell = 2.7 * p;
  const t = 0.3 * p;
  const bar = function (x, y, len, horizontal, on, d, sgm) {
    return rect(
      horizontal ? x : x - t / 2,
      horizontal ? y - t / 2 : y,
      horizontal ? len : t,
      horizontal ? t : len,
      on ? color : off,
      { rx: t / 2, 'fill-opacity': on ? 1 : 0.6, 'data-segment': `${d}-${sgm}`, 'data-lit': on ? 'true' : 'false' },
    );
  };
  const oy = fy + 1.1 * p;
  for (let d = 0; d < 4; d++) {
    const litSeg = SEG_OF[value[d] === undefined ? ' ' : value[d]] || '';
    const ox = fx + 0.9 * p + d * cell + (d >= 2 ? 0.5 * p : 0);
    let g = '';
    g += bar(ox + 0.2 * p, oy, sw, true, litSeg.indexOf('a') >= 0, d, 0);
    g += bar(ox + sw + 0.2 * p, oy + 0.15 * p, sh - 0.3 * p, false, litSeg.indexOf('b') >= 0, d, 1);
    g += bar(ox + sw + 0.2 * p, oy + sh + 0.15 * p, sh - 0.3 * p, false, litSeg.indexOf('c') >= 0, d, 2);
    g += bar(ox + 0.2 * p, oy + 2 * sh, sw, true, litSeg.indexOf('d') >= 0, d, 3);
    g += bar(ox + 0.2 * p, oy + sh + 0.15 * p, sh - 0.3 * p, false, litSeg.indexOf('e') >= 0, d, 4);
    g += bar(ox + 0.2 * p, oy + 0.15 * p, sh - 0.3 * p, false, litSeg.indexOf('f') >= 0, d, 5);
    g += bar(ox + 0.2 * p, oy + sh, sw, true, litSeg.indexOf('g') >= 0, d, 6);
    s += el('g', { 'data-digit': d + 1, transform: `skewX(-10) translate(${r2((oy + sh) * 0.176)} 0)` }, g);
    if (dp) {
      const pon = !!(props.dp && props.dp[d]);
      s += circle(ox + sw + 0.75 * p, oy + 2 * sh, 0.17 * p, pon ? color : off, {
        'fill-opacity': pon ? 1 : 0.6,
        'data-segment': `${d}-7`,
        'data-lit': pon ? 'true' : 'false',
      });
    }
  }
  if (!dp) {
    const cx = fx + 0.9 * p + 2 * cell + 0.05 * p;
    const con = !!props.colon;
    s +=
      circle(cx, oy + sh * 0.55, 0.19 * p, con ? color : off, {
        'fill-opacity': con ? 1 : 0.6,
        'data-colon': 'true',
        'data-lit': con ? 'true' : 'false',
      }) +
      circle(cx, oy + sh * 1.45, 0.19 * p, con ? color : off, {
        'fill-opacity': con ? 1 : 0.6,
        'data-colon': 'true',
        'data-lit': con ? 'true' : 'false',
      });
  }
  s +=
    smd(T, 'capacitor', 15.0 * p, 1.0 * p, true) +
    smd(T, 'resistor', 15.0 * p, h - 1.6 * p, true) +
    via(T, 1.6 * p, h / 2 + 1.1 * p);
  s += text(fx + fw / 2, h - 0.5 * p, props.label || '4-DIGIT DISPLAY', PIN_LABEL, f.silk);
  return art(w, h, `TM1637 4-digit display${value ? ` showing ${value}` : ''}`, s, pins);
}

// The catalog's display modules whose header differs from the template's.
// Display and radio modules whose catalog header differs from the template's.

/** A screen module's options: its picture (`caption`, `pixels`) over the catalog's own. */
function screen(props, own) {
  props = props || {};
  return Object.assign({ caption: props.caption, pixels: props.pixels }, own);
}

/** The SSD1306 OLED module with the four-pin I2C header. */
export function ssd1306Module(props) {
  return oledBreakout(screen(props, { pins: ['GND', 'VCC', 'SCL', 'SDA'] }));
}
/** The SH1107 128 x 128 OLED module. */
export function sh1107Module(props) {
  return oledSquare(screen(props, { label: 'SH1107 128x128', pins: ['GND', 'VCC', 'SCL', 'SDA'] }));
}
/** The ILI9341 display with the FT6206 capacitive touch: eleven pins. */
export function ili9341TouchDisplay(props) {
  return tftModule(
    screen(props, {
      touch: true,
      pins: ['VCC', 'GND', 'CS', 'RST', 'D/C', 'MOSI', 'SCK', 'LED', 'MISO', 'SCL', null, 'SDA'],
    }),
  );
}
