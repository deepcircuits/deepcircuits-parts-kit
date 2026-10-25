/** Parts a person operates: buttons, potentiometers (rotary and slide), switches, the rotary encoder, joystick, keypad, IR remote and rotary dialer. */
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
  lensColor,
  line,
  path,
  r2,
  rect,
  sheen,
  tag,
  text,
  tokens,
} from './core.js';
import { edgeHeader, framed, mountHole, padRow, wire } from './pieces.js';

/**
 * A 12 mm tactile pushbutton at the real part's size: a 12 × 12 mm
 * plastic-black body, legs out of two sides (the real 5 × 12.5 mm leg
 * grid, snapped to 2 × 5 pitches), a metal top plate with its four tabs,
 * and the 7 mm round cap with its shadow ring and highlight. pressed sinks
 * the cap.
 */
export function pushbutton(props) {
  props = props || {};
  // 12 mm by default; size 6 is the 6 x 6 mm switch with its legs three pitches by two, as it sits across a breadboard's channel.
  const small = props.size === 6;
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const w = small ? 4 * p : 6 * p;
  const h = small ? 3.6 * p : 5.4 * p;
  let s = '';
  let cap = lensColor(T, props.cap || 'black');
  const pressed = !!props.pressed;
  const c = { x: w / 2, y: h / 2 };
  if (props.cap === 'black' || !props.cap) cap = T['plastic-black'];
  const legs = small
    ? [
        [c.x - 1.5 * p, c.y - p],
        [c.x + 1.5 * p, c.y - p],
        [c.x - 1.5 * p, c.y + p],
        [c.x + 1.5 * p, c.y + p],
      ]
    : [
        [0.5 * p, c.y - p],
        [5.5 * p, c.y - p],
        [0.5 * p, c.y + p],
        [5.5 * p, c.y + p],
      ];
  const half = (small ? 3 : 6) * mm;
  legs.forEach(l => {
    const left = l[0] < c.x;
    s +=
      wire(l[0], l[1], left ? c.x - half + 1 : c.x + half - 1, l[1]) +
      tag('leg', rect(l[0] - 1.6, l[1] - 1.6, 3.2, 3.2, T.lead, { rx: 0.5 }));
  });
  s += tag(
    'body',
    rect(
      c.x - half,
      c.y - half,
      2 * half,
      2 * half,
      T['plastic-black'],
      Object.assign({ rx: 2 }, edge(T, T['plastic-black-edge'])),
    ),
  );
  const inset = small ? 1.2 : 2.2;
  s += rect(
    c.x - half + inset,
    c.y - half + inset,
    2 * half - 2 * inset,
    2 * half - 2 * inset,
    T.metal,
    Object.assign({ rx: 1.4 }, edge(T, T['metal-edge'], T['stroke-detail'])),
  );
  if (!small)
    [
      [c.x - half + 2.2, c.y],
      [c.x + half - 2.2, c.y],
    ].forEach((t, j) => {
      const i = j + 2;
      s += rect(
        t[0] - (i < 2 ? 2.8 : 1.2),
        t[1] - (i < 2 ? 1.2 : 2.8),
        i < 2 ? 5.6 : 2.4,
        i < 2 ? 2.4 : 5.6,
        T['metal-edge'],
        { rx: 0.5 },
      );
    });
  const r = (small ? 1.75 : 3.5) * mm;
  const ring = small ? 1.2 : 2.4;
  s += circle(c.x, c.y, r + ring, T['plastic-black-edge']);
  s += circle(c.x, c.y, r + ring * 0.6, T.metal, edge(T, T['metal-edge'], T['stroke-fine']));
  s += circle(c.x + 0.6, c.y + 0.9, r, '#000000', { 'fill-opacity': pressed ? 0.45 : 0.3 });
  s += circle(
    c.x,
    c.y,
    pressed ? r * 0.92 : r,
    cap,
    Object.assign(
      {
        'data-hook': 'cap',
        'data-pressed': pressed ? 'true' : undefined,
        'data-axis': 'y',
        'data-travel': 1.2,
        'data-cx': r2(c.x),
        'data-cy': r2(c.y),
      },
      edge(T, T['plastic-black-edge'], T['stroke-detail']),
    ),
  );
  s += circle(c.x, c.y, (pressed ? r * 0.92 : r) - 2.2, '#000000', { 'fill-opacity': pressed ? 0.18 : 0.08 });
  s += path(
    `M${r2(c.x - r * 0.62)} ${r2(c.y - r * 0.3)}A${r2(r * 0.7)} ${r2(r * 0.7)} 0 0 1 ${r2(c.x - r * 0.2)} ${r2(c.y - r * 0.66)}`,
    'none',
    { stroke: '#ffffff', 'stroke-width': 1.4, 'stroke-linecap': 'round', 'stroke-opacity': pressed ? 0.14 : 0.3 },
  );
  return art(
    w,
    h,
    (small ? '6 mm pushbutton' : 'Pushbutton') + (pressed ? ', pressed' : ''),
    s,
    legs.map((l, i) => {
      return { name: ['1', '1.2', '2', '2.2'][i], x: l[0], y: l[1] };
    }),
  );
}

/** A rotary potentiometer: a grey body with three solder tabs, a dial arc, a knurled black knob with a D-shaft and a pointer. position 0..1 turns the knob from -135° to 135°. */
export function potentiometer(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const w = 4 * p;
  const h = 5 * p;
  let s = '';
  const pos = Math.max(0, Math.min(1, props.position === undefined ? 0.5 : Number(props.position)));
  const angle = -135 + pos * 270;
  const cx = 2 * p;
  const cy = 2 * p;
  [p, 2 * p, 3 * p].forEach(x => {
    s +=
      wire(x, 3.6 * p, x, h) +
      tag(
        'tab',
        rect(
          x - 2.4,
          3.45 * p,
          4.8,
          0.5 * p,
          T.metal,
          Object.assign({ rx: 0.4 }, edge(T, T['metal-edge'], T['stroke-fine'])),
        ),
      );
  });
  s += tag(
    'body',
    rect(
      0.25 * p,
      0.25 * p,
      3.5 * p,
      3.5 * p,
      T['plastic-grey'],
      Object.assign({ rx: 2 }, edge(T, T['plastic-grey-edge'])),
    ),
  );
  s += rect(0.25 * p, 0.25 * p, 3.5 * p, 3.5 * p, '#000000', { rx: 2, 'fill-opacity': 0.08 });
  // The dial: an arc from min to max with end dots.
  const ra = 1.62 * p;
  const a0 = ((-135 - 90) * Math.PI) / 180;
  const a1 = ((135 - 90) * Math.PI) / 180;
  s += path(
    `M${r2(cx + ra * Math.cos(a0))} ${r2(cy + ra * Math.sin(a0))}A${r2(ra)} ${r2(ra)} 0 1 1 ${r2(cx + ra * Math.cos(a1))} ${r2(cy + ra * Math.sin(a1))}`,
    'none',
    { stroke: T['chip-print'], 'stroke-width': 0.6, 'stroke-opacity': 0.6, 'stroke-linecap': 'round' },
  );
  // The knob: a knurled rim, the cap, the D shaft and the pointer; the whole group turns.
  const rk = 1.35 * p;
  let knurl = '';
  for (let k = 0; k < 28; k++) {
    const a = (k * Math.PI * 2) / 28;
    knurl += `M${r2(cx + Math.cos(a) * (rk - 0.3))} ${r2(cy + Math.sin(a) * (rk - 0.3))}L${r2(cx + Math.cos(a) * (rk + 0.9))} ${r2(cy + Math.sin(a) * (rk + 0.9))}`;
  }
  s += el(
    'g',
    {
      'data-hook': 'knob',
      'data-part': 'knob',
      'data-cx': r2(cx),
      'data-cy': r2(cy),
      'data-angle': r2(angle),
      transform: `rotate(${r2(angle)} ${r2(cx)} ${r2(cy)})`,
    },
    circle(cx, cy, rk + 1.1, T['plastic-black-edge']) +
      path(knurl, 'none', { stroke: T['plastic-black'], 'stroke-width': 1.1, 'stroke-linecap': 'round' }) +
      circle(cx, cy, rk, T['plastic-black'], edge(T, T['plastic-black-edge'], T['stroke-detail'])) +
      circle(cx, cy, rk, sheen('lens'), { 'fill-opacity': 0.5 }) +
      path(
        `M${r2(cx - 0.42 * p)} ${r2(cy - 0.26 * p)}A${r2(0.5 * p)} ${r2(0.5 * p)} 0 1 0 ${r2(cx + 0.42 * p)} ${r2(cy - 0.26 * p)}Z`,
        T.metal,
        edge(T, T['metal-edge'], T['stroke-fine']),
      ) +
      line(cx, cy - 0.55 * p, cx, cy - rk + 0.5, T['chip-print'], 1.6),
  );
  // The highlight on the knob's rim stays where the bench light puts it while the knob turns.
  s += path(
    `M${r2(cx - rk * 0.7)} ${r2(cy - rk * 0.25)}A${r2(rk * 0.75)} ${r2(rk * 0.75)} 0 0 1 ${r2(cx - rk * 0.25)} ${r2(cy - rk * 0.7)}`,
    'none',
    { stroke: '#ffffff', 'stroke-width': 1.2, 'stroke-linecap': 'round', 'stroke-opacity': 0.22 },
  );
  return art(w, h, `Potentiometer at ${Math.round(pos * 100)}%`, s, [
    { name: 'GND', x: p, y: h },
    { name: 'SIG', x: 2 * p, y: h },
    { name: 'VCC', x: 3 * p, y: h },
  ]);
}

/** A slide switch: a metal frame with two mounting ears, a dark slot, a ribbed plastic-black lever, three legs on the pitch. contact 1 joins the middle pin to pin 1, 3 to pin 3 (position 1 or 2 is the old name). */
export function slideSwitch(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const w = 4 * p;
  const h = 3 * p;
  let s = '';
  const pos = props.contact === 3 ? 2 : 1;
  [p, 2 * p, 3 * p].forEach(x => {
    s += wire(x, 1.9 * p, x, h) + rect(x - 2.2, 1.85 * p, 4.4, 0.35 * p, T['metal-edge'], { rx: 0.4 });
  });
  s +=
    tag(
      'ear',
      rect(
        0.15 * p,
        0.85 * p,
        0.3 * p,
        0.8 * p,
        T.metal,
        Object.assign({ rx: 0.4 }, edge(T, T['metal-edge'], T['stroke-fine'])),
      ) + circle(0.3 * p, 1.25 * p, 0.9, T.hole),
    ) +
    tag(
      'ear',
      rect(
        3.55 * p,
        0.85 * p,
        0.3 * p,
        0.8 * p,
        T.metal,
        Object.assign({ rx: 0.4 }, edge(T, T['metal-edge'], T['stroke-fine'])),
      ) + circle(3.7 * p, 1.25 * p, 0.9, T.hole),
    );
  s += tag(
    'body',
    rect(0.4 * p, 0.5 * p, 3.2 * p, 1.5 * p, T.metal, Object.assign({ rx: 1 }, edge(T, T['metal-edge']))),
  );
  s +=
    bevel(T, 0.4 * p, 0.5 * p, 3.2 * p, 1.5 * p, 1.2) +
    rect(0.4 * p, 0.5 * p, 3.2 * p, 1.5 * p, sheen('metal'), { rx: 1, 'fill-opacity': 0.5 });
  s += rect(0.9 * p, 0.75 * p, 2.2 * p, 1.0 * p, T['plastic-black-edge'], { rx: 0.6 });
  const lx = pos === 1 ? 1.0 * p : 2.1 * p;
  s += el(
    'g',
    {
      'data-hook': 'lever',
      'data-part': 'lever',
      'data-position': pos,
      'data-axis': 'x',
      'data-travel': r2(1.1 * p),
      transform: `translate(${r2(lx)} 0)`,
    },
    rect(
      0,
      0.5 * p,
      0.9 * p,
      1.5 * p,
      T['plastic-black'],
      Object.assign({ rx: 0.6 }, edge(T, T['plastic-black-edge'], T['stroke-detail'])),
    ) +
      path(
        `M${r2(0.25 * p)} ${r2(0.8 * p)}v${r2(0.9 * p)}M${r2(0.45 * p)} ${r2(0.8 * p)}v${r2(0.9 * p)}M${r2(0.65 * p)} ${r2(0.8 * p)}v${r2(0.9 * p)}`,
        'none',
        { stroke: '#ffffff', 'stroke-width': 0.5, 'stroke-opacity': 0.25 },
      ),
  );
  return art(w, h, `Slide switch, middle pin to pin ${pos === 2 ? 3 : 1}`, s, [
    { name: '1', x: p, y: h },
    { name: '2', x: 2 * p, y: h },
    { name: '3', x: 3 * p, y: h },
  ]);
}

/**
 * A DIP switch on the 0.3 inch footprint: count positions (8 by default),
 * the red body with ON and the position numbers printed white, white sliders
 * (lever-N, data-on). values is a list of 0/1 or booleans. Pins are
 * numbered as on a DIP package with ON at the top: 1a to Na along the
 * bottom, then Nb back to 1b along the top.
 */
export function dipSwitch(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const n = Math.max(1, Math.min(12, Number(props.count) || 8));
  const values = props.values || [];
  let s = '';
  const w = (n + 1) * p;
  const cy = 2.3 * p;
  const h = 4.6 * p;
  const bodyX = 0.5 * p;
  const bodyW = n * p;
  const bodyY = cy - 1.25 * p;
  const bodyH = 2.5 * p;
  const pins = [];
  for (let i = 0; i < n; i++) {
    const x = (i + 1) * p;
    s +=
      rect(x - 1.1, cy - 1.5 * p, 2.2, 1.5 * p - bodyH / 2 + 0.6, T.lead, { rx: 0.3 }) +
      rect(x - 1.1, cy + bodyH / 2 - 0.6, 2.2, 1.5 * p - bodyH / 2 + 0.6, T.lead, { rx: 0.3 });
    pins.push({ name: `${i + 1}a`, x, y: cy + 1.5 * p });
  }
  for (let j = n - 1; j >= 0; j--) pins.push({ name: `${j + 1}b`, x: (j + 1) * p, y: cy - 1.5 * p });
  s += tag(
    'body',
    rect(bodyX, bodyY, bodyW, bodyH, T['plastic-red'], Object.assign({ rx: 1.2 }, edge(T, T['plastic-red-edge']))),
  );
  s += bevel(T, bodyX, bodyY, bodyW, bodyH, 1.4);
  s += text(bodyX + 0.2 * p, bodyY + 0.46 * p, 'ON', PIN_LABEL, T['plastic-white'], {
    'text-anchor': 'start',
    'font-weight': 600,
  });
  for (let k = 0; k < n; k++) {
    const kx = (k + 1) * p;
    const on = !!values[k];
    s += rect(kx - 0.25 * p, cy - 0.65 * p, 0.5 * p, 1.3 * p, T['plastic-red-edge'], { rx: 0.8, 'data-slot': k + 1 });
    s += el(
      'g',
      {
        'data-hook': `lever-${k + 1}`,
        'data-part': 'lever',
        'data-on': on ? 'true' : 'false',
        'data-axis': 'y',
        'data-travel': r2(0.65 * p),
      },
      rect(
        kx - 0.2 * p,
        on ? cy - 0.6 * p : cy + 0.05 * p,
        0.4 * p,
        0.55 * p,
        T['plastic-white'],
        Object.assign({ rx: 0.6 }, edge(T, T['plastic-white-edge'], T['stroke-fine'])),
      ),
    );
    s += text(kx, bodyY + bodyH - 0.12 * p, String(k + 1), PIN_LABEL, T['plastic-white'], { 'font-weight': 600 });
  }
  return art(w, h, `${n}-position DIP switch`, s, pins);
}

/**
 * The KY-023 analog joystick module as photographed: the black 34 x 26 mm
 * board with the stick's mushroom cap over most of it, a 24 mm skirt under
 * an 18 mm thumb pad, which hide the gimbal and its pots from above. The
 * right-angle header is at the left end, its five pins standing past the
 * board's edge (GND, VCC, HORZ, VERT, SEL from the top, the catalog's
 * names; the board prints GND, +5V, VRx, VRy and SW beside them), with
 * four M3 holes and the module's name along the far end. The stick (stick,
 * moved by x and y from -1 to 1, positive right and up; data-x and data-y
 * carry them) is the thumb pad (cap, pressed); the skirt (boot) follows it
 * a third of the way, as it tilts about a pivot below.
 */
export function joystick(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'black';
  const f = finish(T, fin);
  const ext = 6 * mm;
  const bw = 34 * mm;
  const h = 26 * mm;
  const w = ext + bw;
  let s = '';
  const jx = Math.max(-1, Math.min(1, Number(props.x) || 0));
  const jy = Math.max(-1, Math.min(1, Number(props.y) || 0));
  const names = props.pins || ['GND', 'VCC', 'HORZ', 'VERT', 'SEL'];
  const prints = props.labels || (props.pins ? props.pins : ['GND', '+5V', 'VRx', 'VRy', 'SW']);
  let pins = [];
  s += el(
    'g',
    { transform: `translate(${r2(ext)} 0)` },
    board({ width: bw, height: h, finish: fin, holes: false, mark: { x: 8 * mm, y: 22.4 * mm, size: 0.8 * p } }),
  );
  [
    [ext + 4.5 * mm, 3 * mm],
    [ext + 4.5 * mm, h - 3 * mm],
    [w - 3 * mm, 3 * mm],
    [w - 3 * mm, h - 3 * mm],
  ].forEach(c => {
    s += tag('hole', circle(c[0], c[1], 1.6 * mm, T.hole, edge(T, T.pad)));
  });
  s += text(w - 1.0 * mm, h / 2, 'KY-023', 4.4, f.silk, { transform: `rotate(-90 ${r2(w - 1.0 * mm)} ${r2(h / 2)})` });
  // The header: the pins past the edge, the spacer on the board's edge, the board's print beside the pads.
  const hdr = edgeHeader(T, { names, side: 'left', at: ext, from: h / 2 - 2 * p, ext });
  s += hdr.svg;
  hdr.pads.forEach((pd, i) => {
    s += text(pd.x + 1.2 * mm, pd.y + 1.4, prints[i], PIN_LABEL, f.silk, { 'text-anchor': 'start' });
  });
  pins = hdr.pins;
  // The cap: the skirt and its shadow on the board, then the thumb pad with its dished top.
  const cx = ext + 19.5 * mm;
  const cy = h / 2;
  const travel = 0.7 * p;
  const dx = jx * travel;
  const dy = -jy * travel;
  s += circle(cx + 0.5 * mm, cy + 0.6 * mm, 12.1 * mm, '#000000', { 'fill-opacity': 0.3 });
  s += el(
    'g',
    { 'data-hook': 'boot', 'data-part': 'boot', transform: `translate(${r2(dx / 3)} ${r2(dy / 3)})` },
    circle(cx, cy, 12 * mm, T['plastic-black'], edge(T, T['plastic-black-edge'])) +
      circle(cx, cy, 12 * mm, sheen('dome'), { 'fill-opacity': 0.3 }),
  );
  s += el(
    'g',
    {
      'data-hook': 'stick',
      'data-part': 'stick',
      'data-x': r2(jx),
      'data-y': r2(jy),
      'data-axis': 'xy',
      'data-travel': r2(travel),
      'data-cx': r2(cx),
      'data-cy': r2(cy),
      transform: `translate(${r2(dx)} ${r2(dy)})`,
    },
    circle(cx, cy, 9.4 * mm, '#000000', { 'fill-opacity': 0.3 }) +
      circle(
        cx,
        cy,
        9 * mm,
        T['plastic-black'],
        Object.assign(
          { 'data-hook': 'cap', 'data-pressed': props.pressed ? 'true' : undefined },
          edge(T, T['plastic-black-edge']),
        ),
      ) +
      circle(cx, cy, 9 * mm, sheen('dome'), { 'fill-opacity': 0.22 }) +
      circle(cx, cy, 7.2 * mm, '#000000', {
        'fill-opacity': props.pressed ? 0.3 : 0.18,
        stroke: '#ffffff',
        'stroke-opacity': 0.1,
        'stroke-width': T['stroke-fine'],
      }),
  );
  return art(
    w,
    h,
    `Joystick${jx || jy ? ` at ${r2(jx)}, ${r2(jy)}` : ' centred'}${props.pressed ? ', pressed' : ''}`,
    s,
    pins,
  );
}

/**
 * A 4 x 4 membrane keypad as sold: the black sheet with sixteen keys
 * (key-R-C, data-pressed), the number keys blue and the letter and symbol
 * keys red, and the ribbon tail with its eight pins (R1 to R4, C1 to C4).
 * keys lists the legends row by row; a key is blue when its legend is a
 * digit.
 */
export function keypad(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const rows = props.rows || 4;
  const cols = props.cols || 4;
  const legends = props.keys || [
    ['1', '2', '3', 'A'],
    ['4', '5', '6', 'B'],
    ['7', '8', '9', 'C'],
    ['*', '0', '#', 'D'],
  ];
  const pressed = props.pressed || [];
  const pitch = 5.6 * p;
  const key = 3.9 * p;
  const sheetW = (cols - 1) * pitch + key + 6.6 * p;
  const sheetH = (rows - 1) * pitch + key + 8.2 * p;
  const tailW = (rows + cols + 1) * p;
  const w = sheetW;
  const h = sheetH + 3.5 * p;
  let s = '';
  s += tag(
    'body',
    rect(
      T['board-inset'],
      T['board-inset'],
      sheetW - 2 * T['board-inset'],
      sheetH - 2 * T['board-inset'],
      T['plastic-black'],
      Object.assign({ rx: 1.2 * p }, edge(T, T['plastic-black-edge'])),
    ),
  );
  s += bevel(
    T,
    T['board-inset'],
    T['board-inset'],
    sheetW - 2 * T['board-inset'],
    sheetH - 2 * T['board-inset'],
    2.4,
    1.2 * p,
  );
  s += rect(1.2 * p, 1.2 * p, sheetW - 2.4 * p, sheetH - 2.4 * p, 'none', {
    rx: 0.8 * p,
    stroke: '#ffffff',
    'stroke-width': T['stroke-fine'],
    'stroke-opacity': 0.25,
  });
  const x0 = (sheetW - ((cols - 1) * pitch + key)) / 2;
  const y0 = 4.2 * p;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const kx = x0 + c * pitch;
      const ky = y0 + r * pitch;
      const down = !!(pressed[r] && pressed[r][c]);
      const legend = (legends[r] || [])[c] || '';
      const ink = /^[0-9]$/.test(legend) ? 'plastic-blue' : 'plastic-red';
      s += el(
        'g',
        { 'data-hook': `key-${r + 1}-${c + 1}`, 'data-part': 'key', 'data-pressed': down ? 'true' : undefined },
        rect(kx, ky, key, key, T[ink], Object.assign({ rx: 0.5 * p }, edge(T, T[`${ink}-edge`], T['stroke-detail']))) +
          (down
            ? rect(kx, ky, key, key, '#000000', { rx: 0.5 * p, 'fill-opacity': 0.38 })
            : bevel(T, kx, ky, key, key, 1.6, 0.5 * p)) +
          text(kx + key / 2, ky + key / 2 + 4.0, legend, 11, T['plastic-white'], {
            'font-weight': 700,
            'fill-opacity': down ? 0.7 : 1,
          }),
      );
    }
  const tx = (w - tailW) / 2;
  s += tag(
    'tail',
    rect(
      tx,
      sheetH - 0.5 * p,
      tailW,
      4.0 * p,
      T['plastic-black'],
      Object.assign({ rx: 0.4 * p }, edge(T, T['plastic-black-edge'], T['stroke-detail'])),
    ),
  );
  const names = [];
  for (let i = 1; i <= rows; i++) names.push(`R${i}`);
  for (let j = 1; j <= cols; j++) names.push(`C${j}`);
  const hdr = header({
    x: tx + p,
    y: h - 0.5 * p,
    labels: names,
    kind: 'leg',
    side: 'above',
    silk: T['plastic-white'],
    size: PIN_LABEL,
  });
  s += hdr.svg;
  return art(w, h, `${rows} x ${cols} membrane keypad`, s, hdr.pins);
}

/**
 * An infrared remote (the 21-key NEC remote): a black handset with the
 * IR LED at the top and its keys (key-<name>, data-pressed). keys lays out
 * another handset row by row, up to three keys a row, as [name, legend]
 * pairs (null leaves a gap); the handset grows with its rows. No pins.
 */
export function irRemote(props) {
  props = props || {};
  const keys = props.keys || [
    [
      ['power', 'PWR'],
      ['vol-up', 'VOL+'],
      ['func-stop', 'FUNC'],
    ],
    [
      ['prev', '|<<'],
      ['play', '>||'],
      ['next', '>>|'],
    ],
    [
      ['down', 'v'],
      ['vol-down', 'VOL-'],
      ['up', '^'],
    ],
    [
      ['0', '0'],
      ['eq', 'EQ'],
      ['st-rept', 'ST'],
    ],
    [
      ['1', '1'],
      ['2', '2'],
      ['3', '3'],
    ],
    [
      ['4', '4'],
      ['5', '5'],
      ['6', '6'],
    ],
    [
      ['7', '7'],
      ['8', '8'],
      ['9', '9'],
    ],
  ];
  const T = tokens();
  const p = T.pitch;
  const w = 16 * p;
  const h = (5.7 + 3.9 * keys.length) * p;
  let s = '';
  const pressed = props.pressed || '';
  s += tag(
    'body',
    rect(
      T['board-inset'],
      T['board-inset'],
      w - 2 * T['board-inset'],
      h - 2 * T['board-inset'],
      T['plastic-black'],
      Object.assign({ rx: 1.6 * p }, edge(T, T['plastic-black-edge'])),
    ),
  );
  s += bevel(T, T['board-inset'], T['board-inset'], w - 2 * T['board-inset'], h - 2 * T['board-inset'], 2.4, 1.6 * p);
  s += rect(0.9 * p, 0.9 * p, w - 1.8 * p, h - 1.8 * p, 'none', {
    rx: 1.2 * p,
    stroke: '#ffffff',
    'stroke-width': T['stroke-fine'],
    'stroke-opacity': 0.2,
  });
  s += rect(1.2 * p, 3.2 * p, w - 2.4 * p, 0.5 * p, '#ffffff', { rx: 0.25 * p, 'fill-opacity': 0.08 });
  s += tag(
    'led',
    circle(w / 2, 1.7 * p, 0.55 * p, T['plastic-grey'], edge(T, T['plastic-grey-edge'], T['stroke-detail'])) +
      circle(w / 2, 1.7 * p, 0.3 * p, T['plastic-black-edge']),
  );
  keys.forEach((row, r) => {
    row.forEach((k, c) => {
      if (!k) return;
      const kx = w / 2 + (c - 1) * 4.7 * p;
      const ky = 5.4 * p + r * 3.9 * p;
      const down = pressed === k[0];
      const kr = 1.6 * p;
      const word = k[1].length > 2;
      const size = word ? 5.2 : 8;
      s += el(
        'g',
        { 'data-hook': `key-${k[0]}`, 'data-part': 'key', 'data-pressed': down ? 'true' : undefined },
        circle(
          kx,
          ky,
          kr,
          down ? '#1a1f24' : T['plastic-grey'],
          edge(T, down ? '#0b0e11' : T['plastic-grey-edge'], T['stroke-detail']),
        ) +
          (down ? '' : circle(kx, ky, kr, sheen('lens'), { 'fill-opacity': 0.45 })) +
          text(kx, ky + size * 0.36, k[1], size, T['plastic-white'], {
            'font-weight': 700,
            'fill-opacity': down ? 0.7 : 1,
          }),
      );
    });
  });
  return art(w, h, `IR remote${pressed ? `, ${pressed} pressed` : ''}`, s, []);
}

/**
 * A rotary dialer: an ivory base, the black finger wheel (dial, turned
 * while dialling) with its ten holes over the printed digits, the finger
 * stop, and three pads at the bottom (GND, DIAL, PULSE). As on a telephone
 * dial, 1 sits just counterclockwise of the stop and the digits run on
 * counterclockwise to 0, so a digit's hole travels further to the stop the
 * higher it counts. The wheel carries its geometry: data-ring and
 * data-hole-radius, data-hole-angles (1 to 9 then 0, degrees clockwise from
 * +x at rest) and data-stop (the stop's angle).
 */
export function rotaryDialer(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const w = 27 * p;
  const h = 30 * p;
  let s = '';
  const cx = 13.5 * p;
  const cy = 13.5 * p;
  const R = 11.2 * p;
  const angle = Number(props.angle) || 0;
  s += tag(
    'body',
    rect(
      T['board-inset'],
      T['board-inset'],
      w - 2 * T['board-inset'],
      h - 2 * T['board-inset'],
      T['plastic-white'],
      Object.assign({ rx: 2.4 * p }, edge(T, T['plastic-white-edge'])),
    ),
  );
  s += bevel(T, 0.8 * p, 0.8 * p, w - 1.6 * p, h - 1.6 * p, 2.0, 2.0 * p);
  s += circle(cx, cy, R + 0.6 * p, T['plastic-white-edge'], { 'fill-opacity': 0.35 });
  // The finger wheel: ten holes, 1 to 0 counterclockwise from the right, each digit printed on the wheel inside its hole, so the digits turn with it.
  const holeR = 1.55 * p;
  const ring = 8.3 * p;
  let holes = '';
  let digits = '';
  const angles = [];
  // The stop's angle: the middle of the bar drawn below.
  const stop = (Math.atan2(0.785, 0.885) * 180) / Math.PI;
  for (let i = 0; i < 10; i++) {
    angles.push(r2((((-30 - i * 28) % 360) + 360) % 360));
    const a = ((-30 - i * 28) * Math.PI) / 180;
    const hx = cx + Math.cos(a) * ring;
    const hy = cy + Math.sin(a) * ring;
    const dx = cx + Math.cos(a) * (ring - 2.6 * p);
    const dy = cy + Math.sin(a) * (ring - 2.6 * p);
    digits += text(dx, dy + 2.2, String((i + 1) % 10), 6.4, T['plastic-white'], { 'font-weight': 700 });
    holes += `M${r2(hx - holeR)} ${r2(hy)}a${r2(holeR)} ${r2(holeR)} 0 1 0 ${r2(2 * holeR)} 0a${r2(holeR)} ${r2(holeR)} 0 1 0 ${r2(-2 * holeR)} 0z`;
  }
  const disc = `M${r2(cx - R)} ${r2(cy)}a${r2(R)} ${r2(R)} 0 1 0 ${r2(2 * R)} 0a${r2(R)} ${r2(R)} 0 1 0 ${r2(-2 * R)} 0z`;
  s += el(
    'g',
    {
      'data-hook': 'dial',
      'data-part': 'dial',
      'data-cx': r2(cx),
      'data-cy': r2(cy),
      'data-angle': r2(angle),
      'data-ring': r2(ring),
      'data-hole-radius': r2(holeR),
      'data-hole-angles': angles.join(' '),
      'data-stop': r2(stop),
      transform: `rotate(${r2(angle)} ${r2(cx)} ${r2(cy)})`,
    },
    path(disc + holes, T['plastic-black'], {
      'fill-rule': 'evenodd',
      stroke: T['plastic-black-edge'],
      'stroke-width': T['stroke-outline'],
    }) +
      digits +
      circle(cx, cy, 2.4 * p, T.metal, edge(T, T['metal-edge'])) +
      circle(cx, cy, 1.0 * p, T['plastic-black'], edge(T, T['metal-edge'], T['stroke-fine'])),
  );
  s += path(`M${r2(cx + R * 0.72)} ${r2(cy + R * 0.95)}L${r2(cx + R * 1.05)} ${r2(cy + R * 0.62)}`, 'none', {
    stroke: T.metal,
    'stroke-width': 0.55 * p,
    'stroke-linecap': 'round',
  });
  s += path(`M${r2(cx + R * 0.72)} ${r2(cy + R * 0.95)}L${r2(cx + R * 1.05)} ${r2(cy + R * 0.62)}`, 'none', {
    stroke: T['metal-edge'],
    'stroke-width': T['stroke-fine'],
  });
  const hdr = header({
    x: cx - p,
    y: h - 0.8 * p,
    labels: props.pins || ['GND', 'DIAL', 'PULSE'],
    kind: 'pad',
    side: 'above',
    silk: T['plastic-black'],
    size: PIN_LABEL,
    rotate: true,
  });
  s += hdr.svg;
  return art(w, h, 'Rotary dialer', s, hdr.pins);
}

/**
 * The KY-040 rotary encoder module as photographed, at the size its
 * dimension drawing gives: a black 26.2 x 18.63 mm board lying on its side,
 * the 12 mm encoder at the left with its three leads, seen from above
 * without a knob, as it is sold: the metal body, the threaded bushing and
 * the 6 mm D shaft (knob, turned by detent, its flat showing the turn; the
 * push on the shaft as cap). The right-angle header at the right end, its
 * five pins standing 6 mm past the edge (CLK, DT, SW, VCC, GND from the
 * top) with the board's print beside the pads (labels: CLK, DT, SW, +,
 * GND), and two holes along the bottom edge. The pull-up resistors sit on
 * the back.
 */
export function rotaryEncoder(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'black';
  const f = finish(T, fin);
  const bw = 26.2 * mm;
  const ext = 6 * mm;
  const w = bw + ext;
  const h = 18.63 * mm;
  let s = '';
  const detent = Math.round(Number(props.detent) || 0);
  const cx = 9.1 * mm;
  const cy = 7.75 * mm;
  const names = props.pins || ['CLK', 'DT', 'SW', 'VCC', 'GND'];
  const prints = props.labels || (props.pins ? props.pins : ['CLK', 'DT', 'SW', '+', 'GND']);
  s += board({ width: bw, height: h, finish: fin, holes: false, mark: { x: 11.5 * mm, y: 15.5 * mm, size: 0.7 * p } });
  const hdr = edgeHeader(T, { names, side: 'right', at: bw, from: 2.0 * mm, ext });
  hdr.pads.forEach((pd, i) => {
    s += text(pd.x - T['pad-radius'] - 1.4, pd.y + 1.8, prints[i], 5, f.silk, { 'text-anchor': 'end' });
  });
  s += mountHole(T, f, 4.3 * mm, 16.4 * mm, 1.5 * mm) + mountHole(T, f, 21.6 * mm, 16.4 * mm, 1.5 * mm);
  const half = 6 * mm;
  s += tag(
    'encoder',
    [-2.5, 0, 2.5]
      .map(k => {
        return rect(cx - half - 1.0 * mm, cy + k * mm - 0.4 * mm, 1.2 * mm, 0.8 * mm, T.lead, { rx: 0.2 });
      })
      .join('') +
      rect(cx - half, cy - half, 2 * half, 2 * half, T.metal, Object.assign({ rx: 1 }, edge(T, T['metal-edge']))),
  );
  s += bevel(T, cx - half, cy - half, 2 * half, 2 * half, 1.8);
  // The threaded bushing round the shaft.
  const rb = 3.5 * mm;
  s +=
    circle(cx, cy, rb, T.metal, edge(T, T['metal-edge'])) +
    circle(cx, cy, rb - 0.6, 'none', { stroke: T['metal-edge'], 'stroke-width': 0.5, 'stroke-opacity': 0.8 }) +
    circle(cx, cy, rb - 1.4, 'none', { stroke: T['metal-edge'], 'stroke-width': 0.5, 'stroke-opacity': 0.6 });
  // The D shaft, its flat toward the top at detent 0; the group spans the body, so the whole encoder turns it.
  const rs = 3 * mm;
  const flat = 1.5 * mm;
  const chord = Math.sqrt(rs * rs - flat * flat);
  const angle = (detent % 20) * 18;
  const d = `M${r2(cx - chord)} ${r2(cy - flat)}H${r2(cx + chord)}A${r2(rs)} ${r2(rs)} 0 1 1 ${r2(cx - chord)} ${r2(cy - flat)}Z`;
  s += el(
    'g',
    {
      'data-hook': 'knob',
      'data-part': 'knob',
      'data-detent': detent,
      'data-cx': r2(cx),
      'data-cy': r2(cy),
      'data-angle': r2(angle),
      transform: `rotate(${angle} ${r2(cx)} ${r2(cy)})`,
    },
    circle(cx, cy, half, T.metal, { 'fill-opacity': 0 }) +
      path(
        d,
        props.pressed ? T['metal-edge'] : T.metal,
        Object.assign(
          { 'data-hook': 'cap', 'data-pressed': props.pressed ? 'true' : undefined },
          edge(T, T['metal-edge'], T['stroke-detail']),
        ),
      ) +
      path(d, sheen('metal'), { 'fill-opacity': props.pressed ? 0.3 : 0.75 }) +
      line(cx - chord + 0.6, cy - flat, cx + chord - 0.6, cy - flat, T['metal-edge'], 0.9),
  );
  s += hdr.svg;
  return art(w, h, `Rotary encoder at detent ${detent}${props.pressed ? ', pressed' : ''}`, s, hdr.pins);
}

/**
 * A slide potentiometer module as photographed: a red board 20 mm wide
 * and travel + 30 mm long, holes at the corners, the black 9 mm
 * potentiometer body with its slot and the yellow lever (lever, slid by
 * position along x, data-axis and data-travel), two resistors beside the
 * slot, the three pads (A, SIG, B) at the right end. travel is the slot's
 * length in mm (60 by default).
 */
export function slidePotentiometer(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'red';
  const f = finish(T, fin);
  const travel = Math.max(10, Number(props.travel) || 60);
  const pos = Math.max(0, Math.min(1, Number(props.position) || 0));
  const bodyW = (travel + 15) * mm;
  const bodyH = 9 * mm;
  const w = Math.ceil(((travel + 30) * mm) / p) * p;
  const h = 8 * p;
  let s = '';
  s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: w - 4.4 * p, y: 1.0 * p, size: 0.7 * p } });
  [
    [0.8 * p, 0.8 * p],
    [w - 0.8 * p, 0.8 * p],
    [0.8 * p, h - 0.8 * p],
    [w - 0.8 * p, h - 0.8 * p],
  ].forEach(c => {
    s += tag('hole', circle(c[0], c[1], T['mount-hole-radius'], T.hole, edge(T, T.pad)));
  });
  const hdr = padRow(
    T,
    fin,
    f,
    {
      x: w - 1.0 * p,
      y: h / 2 - p,
      axis: 'y',
      labels: ['A', 'SIG', 'B'],
      kind: 'pad',
      side: 'left',
      silk: f.silk,
      size: PIN_LABEL,
    },
    -1,
  );
  const bx = 1.6 * p;
  const by = (h - bodyH) / 2;
  s += tag(
    'body',
    rect(bx, by, bodyW, bodyH, T['plastic-black'], Object.assign({ rx: 1.2 }, edge(T, T['plastic-black-edge']))) +
      rect(
        bx + 1.2 * mm,
        by + 1.0 * mm,
        bodyW - 2.4 * mm,
        bodyH - 2.0 * mm,
        T.metal,
        Object.assign({ rx: 0.8 }, edge(T, T['metal-edge'], T['stroke-detail'])),
      ),
  );
  s +=
    bevel(T, bx, by, bodyW, bodyH, 1.4) +
    rect(bx + 0.7, by + 0.7, bodyW - 1.4, bodyH - 1.4, sheen('metal'), { rx: 1.2, 'fill-opacity': 0.4 });
  const sx0 = bx + (bodyW - travel * mm) / 2;
  const sy = by + bodyH / 2;
  s += rect(
    sx0,
    sy - 0.8 * mm,
    travel * mm,
    1.6 * mm,
    T['plastic-black'],
    Object.assign({ rx: 0.8 * mm }, edge(T, T['plastic-black-edge'], T['stroke-fine'])),
  );
  [bx + 2.4 * mm, bx + bodyW - 2.4 * mm].forEach(x => {
    s += circle(x, sy, 0.9 * mm, T.hole, edge(T, T['metal-edge'], T['stroke-fine']));
  });
  s +=
    framed(T, f, 'resistor', w - 4.1 * p, h / 2 + 1.6 * p, true) +
    framed(T, f, 'resistor', w - 4.1 * p, h / 2 - 2.2 * p, true);
  const lx = sx0 + pos * travel * mm;
  s += el(
    'g',
    {
      'data-hook': 'lever',
      'data-part': 'lever',
      'data-position': r2(pos),
      'data-axis': 'x',
      'data-travel': r2(travel * mm),
    },
    rect(
      lx - 2.0 * mm,
      sy - 3.6 * mm,
      4.0 * mm,
      7.2 * mm,
      T['band-yellow'],
      Object.assign({ rx: 1.2 }, edge(T, T['resistor-body-edge'], T['stroke-detail'])),
    ) +
      rect(lx - 2.0 * mm, sy - 0.5 * mm, 4.0 * mm, 1.0 * mm, '#000000', { 'fill-opacity': 0.35 }) +
      rect(lx - 1.4 * mm, sy - 3.0 * mm, 2.8 * mm, 1.2 * mm, '#ffffff', { rx: 1, 'fill-opacity': T['opacity-light'] }),
  );
  s += hdr.svg;
  return art(w, h, `Slide potentiometer at ${Math.round(pos * 100)}%`, s, hdr.pins);
}
