/** Parts that move: the micro servo, steppers and the DPDT relay. */
import {
  PIN_LABEL,
  art,
  bevel,
  circle,
  edge,
  el,
  header,
  line,
  lotCode,
  path,
  r2,
  rect,
  sheen,
  tag,
  text,
  tokens,
} from './core.js';

/**
 * A micro servo (SG90 class) from above: the blue body 22.8 x 12.2 mm with
 * its mounting ears, the output shaft at one end with the single-arm horn
 * (horn, data-angle, turned by the pulse), the three-wire lead to a
 * connector at the left edge whose pins (GND, V+, PWM) sit on the grid.
 */
export function servo(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const angle = Math.max(-90, Math.min(90, Number(props.angle) || 0));
  const w = r2(45 * mm);
  const h = r2(31.6 * mm);
  let s = '';
  const bw = 22.8 * mm;
  const bh = 12.2 * mm;
  const bx = w - bw - 4.6 * mm - 0.5 * p;
  const by = h - bh - 0.8 * p;
  const sx = bx + 6.0 * mm;
  const sy = by + bh / 2;
  const pins = [
    { name: 'GND', x: 0.5 * p, y: sy - p },
    { name: 'V+', x: 0.5 * p, y: sy },
    { name: 'PWM', x: 0.5 * p, y: sy + p },
  ];
  // The lead: three wires from the body's end to the connector.
  [
    ['#5a3a1a', -p],
    ['#c62828', 0],
    ['#f28c28', p],
  ].forEach(wr => {
    s += path(
      `M${r2(bx)} ${r2(sy + wr[1] * 0.35)}C${r2(bx - 3 * p)} ${r2(sy + wr[1] * 0.35)} ${r2(3.5 * p)} ${r2(sy + wr[1])} ${r2(1.6 * p)} ${r2(sy + wr[1])}`,
      'none',
      { stroke: wr[0], 'stroke-width': 1.6, 'stroke-linecap': 'round' },
    );
  });
  s += tag(
    'connector',
    rect(
      0.5 * p - 3.6,
      sy - 1.5 * p,
      1.5 * p,
      3 * p,
      T['plastic-black'],
      Object.assign({ rx: 0.8 }, edge(T, T['plastic-black-edge'], T['stroke-detail'])),
    ),
  );
  pins.forEach(pn => {
    s += rect(pn.x - 1.5, pn.y - 1.5, 3, 3, T.cavity, { rx: 0.4 });
  });
  // The body with its ears and the gear housing, the shaft, the horn.
  s += tag(
    'body',
    rect(
      bx - 4.6 * mm,
      sy - 2.1 * mm,
      bw + 9.2 * mm,
      4.2 * mm,
      T['plastic-blue'],
      Object.assign({ rx: 1 }, edge(T, T['plastic-blue-edge'])),
    ) + rect(bx, by, bw, bh, T['plastic-blue'], Object.assign({ rx: 1.2 }, edge(T, T['plastic-blue-edge']))),
  );
  s += bevel(T, bx, by, bw, bh, 1.8);
  [bx - 2.6 * mm, bx + bw + 2.6 * mm].forEach(x => {
    s += circle(x, sy, 1.0 * mm, T.hole, edge(T, T['plastic-blue-edge'], T['stroke-fine']));
  });
  s +=
    circle(sx, sy, 5.8 * mm, T['plastic-blue'], edge(T, T['plastic-blue-edge'], T['stroke-detail'])) +
    circle(sx, sy, 5.8 * mm, '#ffffff', { 'fill-opacity': 0.08 });
  s += circle(sx + 8.2 * mm, sy, 3.4 * mm, T['plastic-blue'], edge(T, T['plastic-blue-edge'], T['stroke-detail']));
  s += rect(bx + 2, by + 1.5, bw - 4, 1.8 * mm, '#ffffff', { rx: 1, 'fill-opacity': T['opacity-light'] * 0.5 });
  const hornLen = 18 * mm;
  s += el(
    'g',
    {
      'data-hook': 'horn',
      'data-part': 'horn',
      'data-angle': r2(angle),
      'data-cx': r2(sx),
      'data-cy': r2(sy),
      transform: `rotate(${r2(-angle)} ${r2(sx)} ${r2(sy)})`,
    },
    path(
      `M${r2(sx - 2.2 * mm)} ${r2(sy)}a${r2(2.2 * mm)} ${r2(2.2 * mm)} 0 1 1 ${r2(4.4 * mm)} 0L${r2(sx + 1.4 * mm)} ${r2(sy - hornLen)}a${r2(1.4 * mm)} ${r2(1.4 * mm)} 0 0 0 ${r2(-2.8 * mm)} 0Z`,
      T['plastic-white'],
      Object.assign({ 'stroke-linejoin': 'round' }, edge(T, T['plastic-white-edge'], T['stroke-detail'])),
    ) +
      path(`M${r2(sx)} ${r2(sy - 5 * mm)}V${r2(sy - hornLen + 2.6 * mm)}`, 'none', {
        stroke: T['plastic-white-edge'],
        'stroke-width': 0.6,
        'stroke-dasharray': '1.6 1.9',
      }) +
      circle(sx, sy, 1.4 * mm, T.metal, edge(T, T['metal-edge'], T['stroke-fine'])) +
      circle(sx, sy, 0.6 * mm, T['metal-edge']),
  );
  return art(w, h, `Micro servo at ${r2(angle)}°`, s, pins);
}

/**
 * A stepper motor from above (NEMA 17 by default, frameSize in mm): the
 * square body with its rounded corners, four mounting holes and the
 * shaft (rotor, data-angle), four wires to a header at the bottom edge
 * (A-, A+, B+, B-). biaxial draws the two-rotor clock motor with eight.
 */
export function stepper(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const frame = Math.max(20, Number(props.frameSize) || 42.3);
  const biaxial = !!props.biaxial;
  const angle = Number(props.angle) || 0;
  const angle2 = Number(props.angle2) || 0;
  const names =
    props.pins || (biaxial ? ['A1-', 'A1+', 'B1+', 'B1-', 'A2-', 'A2+', 'B2+', 'B2-'] : ['A-', 'A+', 'B+', 'B-']);
  const bw = frame * mm;
  const w = Math.ceil((bw + 1.2 * p) / p) * p;
  const bx = (w - bw) / 2;
  const by = 0.5 * p;
  const h = by + bw + 2.6 * p;
  const cx = w / 2;
  const cy = by + bw / 2;
  let s = '';
  s += tag(
    'body',
    rect(bx, by, bw, bw, T['plastic-black'], Object.assign({ rx: 0.1 * bw }, edge(T, T['plastic-black-edge']))),
  );
  s += rect(
    bx + 0.06 * bw,
    by + 0.06 * bw,
    0.88 * bw,
    0.88 * bw,
    T.metal,
    Object.assign({ rx: 0.06 * bw }, edge(T, T['metal-edge'], T['stroke-detail'])),
  );
  s +=
    bevel(T, bx + 0.06 * bw, by + 0.06 * bw, 0.88 * bw, 0.88 * bw, 2.2) +
    rect(bx + 0.06 * bw + 0.7, by + 0.06 * bw + 0.7, 0.88 * bw - 1.4, 0.88 * bw - 1.4, sheen('metal'), {
      rx: 0.06 * bw,
      'fill-opacity': 0.5,
    });
  const hole = frame >= 40 ? (31 * mm) / 2 : frame * 0.37;
  [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ].forEach(c => {
    s += circle(cx + c[0] * hole, cy + c[1] * hole, 1.5 * mm, T.hole, edge(T, T['metal-edge'], T['stroke-fine']));
  });
  s +=
    circle(cx, cy, 11 * mm, T.metal, edge(T, T['metal-edge'], T['stroke-detail'])) +
    circle(cx, cy, 11 * mm, '#000000', { 'fill-opacity': 0.06 });
  if (biaxial) {
    s += el(
      'g',
      {
        'data-hook': 'rotor-2',
        'data-part': 'rotor',
        'data-angle': r2(angle2),
        'data-cx': r2(cx),
        'data-cy': r2(cy),
        transform: `rotate(${r2(angle2)} ${r2(cx)} ${r2(cy)})`,
      },
      circle(cx, cy, 4.2 * mm, T['metal-edge'], edge(T, T['plastic-black-edge'], T['stroke-fine'])) +
        line(cx, cy - 4.2 * mm, cx, cy - 2.6 * mm, T['chip-print'], 1.2),
    );
    s += el(
      'g',
      {
        'data-hook': 'rotor',
        'data-part': 'rotor',
        'data-angle': r2(angle),
        'data-cx': r2(cx),
        'data-cy': r2(cy),
        transform: `rotate(${r2(angle)} ${r2(cx)} ${r2(cy)})`,
      },
      circle(cx, cy, 2.5 * mm, T.metal, edge(T, T['metal-edge'], T['stroke-fine'])) +
        path(`M${r2(cx - 2.5 * mm * 0.6)} ${r2(cy - 2.0 * mm)}h${r2(3.0 * mm)}`, 'none', {
          stroke: T['metal-edge'],
          'stroke-width': 0.8,
        }),
    );
  } else {
    s += el(
      'g',
      {
        'data-hook': 'rotor',
        'data-part': 'rotor',
        'data-angle': r2(angle),
        'data-cx': r2(cx),
        'data-cy': r2(cy),
        transform: `rotate(${r2(angle)} ${r2(cx)} ${r2(cy)})`,
      },
      circle(cx, cy, 2.5 * mm, T.metal, edge(T, T['metal-edge'], T['stroke-fine'])) +
        path(`M${r2(cx - 1.8 * mm)} ${r2(cy - 1.75 * mm)}h${r2(3.6 * mm)}`, 'none', {
          stroke: T['metal-edge'],
          'stroke-width': 0.9,
        }),
    );
  }
  // The wires out of the bottom edge to the header.
  const hdr = header({
    x: r2(cx - ((names.length - 1) * p) / 2),
    y: h - 0.6 * p,
    labels: names,
    kind: 'leg',
    side: 'above',
    silk: 'currentColor',
    size: PIN_LABEL,
    rotate: names.length > 4,
  });
  const cols = [
    T['band-blue'],
    T['band-red'],
    T['band-green'],
    T['resistor-smd'],
    T['band-blue'],
    T['band-red'],
    T['band-green'],
    T['resistor-smd'],
  ];
  hdr.pins.forEach((pn, i) => {
    s += path(
      `M${r2(cx + (i - (names.length - 1) / 2) * 0.35 * p)} ${r2(by + bw - 2)}C${r2(cx + (i - (names.length - 1) / 2) * 0.35 * p)} ${r2(by + bw + 0.9 * p)} ${r2(pn.x)} ${r2(by + bw + 0.2 * p)} ${r2(pn.x)} ${r2(pn.y - (names.length > 4 ? 1.9 : 1.0) * p)}`,
      'none',
      { stroke: cols[i % cols.length], 'stroke-width': 1.5, 'stroke-linecap': 'round' },
    );
  });
  s += hdr.svg;
  return art(
    w,
    h,
    `${biaxial ? 'Biaxial stepper' : `NEMA ${Math.round(frame / 2.54)} stepper`} at ${r2(angle)}°`,
    s,
    hdr.pins,
  );
}

/**
 * A DPDT relay in its amber can, 20.5 x 10 mm, eight pins in two rows three
 * pitches apart (NO2, NC2, P2, COIL2 along the top; NO1, NC1, P1, COIL1
 * along the bottom): the contacts two pitches apart and the coil three past
 * the common, 1.25 mm in from the can's end, as the data sheet's PCB layout
 * has them. energised marks the body (data-energised).
 */
export function relay(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const w = 9 * p;
  const h = 5.4 * p;
  const cy = 2.7 * p;
  const bw = 20.5 * mm;
  const bh = 10.0 * mm;
  const bx = 8 * p + 1.25 * mm - bw;
  const by = cy - bh / 2;
  let s = '';
  const pins = [];
  const top = ['NO2', 'NC2', 'P2', 'COIL2'];
  const bot = ['NO1', 'NC1', 'P1', 'COIL1'];
  const at = [1, 3, 5, 8];
  top.forEach((n, i) => {
    pins.push({ name: n, x: at[i] * p, y: cy - 1.5 * p });
  });
  bot.forEach((n, i) => {
    pins.push({ name: n, x: at[i] * p, y: cy + 1.5 * p });
  });
  s += tag(
    'body',
    rect(
      bx,
      by,
      bw,
      bh,
      T['plastic-amber'],
      Object.assign(
        { rx: 1.2, 'data-hook': 'relay', 'data-energised': props.energised ? 'true' : 'false' },
        edge(T, T['plastic-amber-edge']),
      ),
    ),
  );
  s += rect(bx + 2, by + 1.2, bw - 4, 1.4, '#ffffff', { rx: 0.7, 'fill-opacity': T['opacity-light'] * 0.5 });
  // The terminal diagram the lid prints: a dimple over each pin with its name inboard of it, so the pins under the can can be found.
  pins.forEach((pn, i) => {
    s += circle(
      pn.x,
      pn.y,
      1.4,
      '#000000',
      Object.assign({ 'fill-opacity': 0.4 }, edge(T, T['plastic-amber-edge'], T['stroke-fine'])),
    );
    s += text(pn.x, i < 4 ? cy - 8.0 : cy + 11.4, pn.name, PIN_LABEL, T['plastic-black']);
  });
  s += text(bx + bw / 2, cy - 2.2, 'KS2E-M-DC5', PIN_LABEL + 0.4, T['plastic-black'], { 'font-weight': 600 });
  s += text(bx + bw / 2, cy + 3.0, `DPDT 5V ${lotCode('KS2E')}`, PIN_LABEL, T['plastic-black'], {
    'fill-opacity': 0.85,
  });
  s += circle(bx + 3, by + bh - 3, 1.0, T['plastic-black'], { 'fill-opacity': 0.8 });
  return art(w, h, `DPDT relay${props.energised ? ', energised' : ''}`, s, pins);
}
