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

/**
 * Two leads from where they leave a part (`from`, each [x, y]) down to a
 * header of legs whose first pin is at `x0`, `y`: red for the first, black
 * for the second, as the motors and the solenoid are wired.
 */
function twoLeads(T, names, from, x0, y) {
  const p = T.pitch;
  const hdr = header({
    x: r2(x0),
    y,
    labels: names,
    kind: 'leg',
    side: 'above',
    silk: 'currentColor',
    size: PIN_LABEL,
  });
  let s = '';
  [T['band-red'], T['band-black']].forEach((col, i) => {
    const pn = hdr.pins[i];
    const f = from[i];
    s += path(
      `M${r2(f[0])} ${r2(f[1])}C${r2(f[0] - 1.2 * p)} ${r2(f[1] + 0.4 * p)} ${r2(pn.x)} ${r2(pn.y - 2.4 * p)} ${r2(pn.x)} ${r2(pn.y - 1.0 * p)}`,
      'none',
      { stroke: col, 'stroke-width': 1.5, 'stroke-linecap': 'round' },
    );
  });
  return { svg: s, pins: hdr.pins, header: hdr.svg };
}

/** A circle of radius r with two flats d from the centre, across `axis` ('y': flats top and bottom). */
function flatted(cx, cy, r, d, axis) {
  const a = Math.sqrt(Math.max(0, r * r - d * d));
  if (axis === 'x')
    return `M${r2(cx - d)} ${r2(cy - a)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(cx + d)} ${r2(cy - a)}V${r2(cy + a)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(cx - d)} ${r2(cy + a)}Z`;
  return `M${r2(cx - a)} ${r2(cy - d)}H${r2(cx + a)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(cx + a)} ${r2(cy + d)}H${r2(cx - a)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(cx - a)} ${r2(cy - d)}Z`;
}

/**
 * A brushed DC motor. `variant: 'hobby-130'` (the default) is the 130-size
 * can seen end on, 20.4 mm across with its flats 15.1 mm apart, the
 * bearing boss, two M2 holes and the two-blade fan on its shaft, 32 mm
 * across (rotor, data-angle);
 * `'tt-gear'` is the yellow TT gear motor lying flat, the 130 can behind
 * its 37 mm gearbox and the double-D output shaft pointing up out of the
 * gearbox (rotor, data-angle). Two leads from the can's end tabs to a
 * header of legs at the bottom edge (M+, M-).
 */
export function dcMotor(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const tt = props.variant === 'tt-gear';
  const angle = Number(props.angle) || 0;
  const names = props.pins || ['M+', 'M-'];
  let s = '';
  let w;
  let h;
  let cx;
  let cy;
  let leads;
  const rotor = (inner, x, y) =>
    el(
      'g',
      {
        'data-hook': 'rotor',
        'data-part': 'rotor',
        'data-angle': r2(angle),
        'data-cx': r2(x),
        'data-cy': r2(y),
        transform: `rotate(${r2(angle)} ${r2(x)} ${r2(y)})`,
      },
      inner,
    );
  if (!tt) {
    // The can end on, and the two-blade fan on its shaft, 32 mm across.
    const R = 10.2 * mm;
    const fan = 16 * mm;
    w = 13 * p;
    cx = w / 2;
    cy = 0.5 * p + fan;
    h = cy + fan + 2.2 * p;
    leads = twoLeads(
      T,
      names,
      [
        [cx - 1.5 * mm, cy + 4 * mm],
        [cx + 1.5 * mm, cy + 4 * mm],
      ],
      cx - p / 2,
      h - 0.6 * p,
    );
    s += leads.svg;
    s += tag('body', path(flatted(cx, cy, R, 7.55 * mm, 'y'), T.metal, edge(T, T['metal-edge'])));
    s += path(flatted(cx, cy, R - 0.8, 7.55 * mm - 0.8, 'y'), sheen('metal'), { 'fill-opacity': 0.5 });
    [-1, 1].forEach(k => {
      s += circle(cx + k * 6 * mm, cy, 0.9 * mm, T.cavity, edge(T, T['metal-edge'], T['stroke-fine']));
    });
    s += circle(cx, cy, 3.2 * mm, T.metal, edge(T, T['metal-edge'], T['stroke-detail']));
    const blade = path(
      `M${r2(cx - 1.4 * mm)} ${r2(cy - 2.6 * mm)}C${r2(cx - 4.6 * mm)} ${r2(cy - 7 * mm)} ${r2(cx - 4.2 * mm)} ${r2(cy - fan + 0.6 * mm)} ${r2(cx)} ${r2(cy - fan)}C${r2(cx + 3.2 * mm)} ${r2(cy - fan + 0.4 * mm)} ${r2(cx + 3.6 * mm)} ${r2(cy - 8 * mm)} ${r2(cx + 1.4 * mm)} ${r2(cy - 2.6 * mm)}Z`,
      T['plastic-red'],
      Object.assign({ 'stroke-linejoin': 'round' }, edge(T, T['plastic-red-edge'], T['stroke-detail'])),
    );
    s += rotor(
      blade +
        el('g', { transform: `rotate(180 ${r2(cx)} ${r2(cy)})` }, blade) +
        circle(cx, cy, 3.4 * mm, T['plastic-red'], edge(T, T['plastic-red-edge'], T['stroke-detail'])) +
        circle(cx, cy, 0.8 * mm, T.metal, edge(T, T['metal-edge'], T['stroke-fine'])),
      cx,
      cy,
    );
  } else {
    // Left to right: the can's end tabs, the can (25 x 15.1 mm, flats up), the gearbox (37 x 22.5 mm).
    const gh = 22.5 * mm;
    const ch = 15.1 * mm;
    const cap = 2.4 * mm;
    const canX = 1.6 * p;
    const canL = 25 * mm;
    const gx = canX + cap + canL;
    const gl = 37 * mm;
    w = Math.ceil((gx + gl + 0.5 * p) / p) * p;
    cy = 0.5 * p + gh / 2;
    h = 0.5 * p + gh + 2.7 * p;
    cx = gx + gl - 11.3 * mm;
    leads = twoLeads(
      T,
      names,
      [
        [canX - 0.4 * mm, cy - 2.2 * mm],
        [canX - 0.4 * mm, cy + 2.2 * mm],
      ],
      p,
      h - 0.6 * p,
    );
    s += leads.svg;
    s += tag(
      'body',
      rect(
        canX,
        cy - ch / 2 + 0.6 * mm,
        cap,
        ch - 1.2 * mm,
        T['plastic-black'],
        Object.assign({ rx: 0.6 }, edge(T, T['plastic-black-edge'], T['stroke-detail'])),
      ) +
        rect(canX + cap, cy - ch / 2, canL, ch, T.metal, Object.assign({ rx: 1.2 }, edge(T, T['metal-edge']))) +
        rect(gx, cy - gh / 2, gl, gh, T['band-yellow'], Object.assign({ rx: 1.4 }, edge(T, T['brass-edge']))),
    );
    s += rect(canX + cap + 1, cy - ch / 2 + 0.8, canL - 2, ch - 1.6, sheen('metal'), { rx: 1, 'fill-opacity': 0.5 });
    [-1, 1].forEach(k => {
      s += rect(
        canX - 1.0 * mm,
        cy + k * 2.2 * mm - 0.5 * mm,
        1.4 * mm,
        1.0 * mm,
        T.brass,
        edge(T, T['brass-edge'], T['stroke-fine']),
      );
    });
    s += bevel(T, gx, cy - gh / 2, gl, gh, 1.8);
    // Four case screws, the mounting hole through the box and the gear ratio moulded on it.
    [
      [gx + 2.6 * mm, cy - gh / 2 + 2.6 * mm],
      [gx + 2.6 * mm, cy + gh / 2 - 2.6 * mm],
      [gx + gl - 2.6 * mm, cy - gh / 2 + 2.6 * mm],
      [gx + gl - 2.6 * mm, cy + gh / 2 - 2.6 * mm],
    ].forEach(c => {
      s += circle(c[0], c[1], 1.1 * mm, T.metal, edge(T, T['metal-edge'], T['stroke-fine']));
    });
    s += circle(gx + 14 * mm, cy, 1.6 * mm, T.cavity, edge(T, T['brass-edge'], T['stroke-detail']));
    s += text(gx + 14 * mm, cy - 3.6 * mm, '1:48', PIN_LABEL, T['brass-edge'], { 'font-weight': 600 });
    s += circle(cx, cy, 4.6 * mm, T['band-yellow'], edge(T, T['brass-edge'], T['stroke-detail']));
    s += rotor(
      path(
        flatted(cx, cy, 2.7 * mm, 1.85 * mm, 'x'),
        T['plastic-white'],
        edge(T, T['plastic-white-edge'], T['stroke-detail']),
      ) +
        path(`M${r2(cx)} ${r2(cy - 0.5 * mm)}V${r2(cy - 2.1 * mm)}`, 'none', {
          stroke: T['plastic-white-edge'],
          'stroke-width': 0.8,
          'stroke-linecap': 'round',
        }),
      cx,
      cy,
    );
  }
  s += leads.header;
  return art(w, h, `${tt ? 'TT gear motor' : 'DC motor'} at ${r2(angle)}°`, s, leads.pins);
}

/**
 * The mini submersible pump lying flat: its 34 x 24 mm black body, the
 * pump head at the right end with its inlet slots, and the 7.5 mm outlet
 * pointing up; `running` draws the water leaving the outlet (flow) and
 * marks the body (data-running). Two leads from the sealed left end to a
 * header of legs at the bottom edge (M+, M-).
 */
export function waterPump(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const running = props.running === true;
  const names = props.pins || ['M+', 'M-'];
  const bl = 34 * mm;
  const bh = 24 * mm;
  const bx = 1.6 * p;
  const by = 5.2 * p;
  const cy = by + bh / 2;
  const w = Math.ceil((bx + bl + 0.5 * p) / p) * p;
  const h = by + bh + 2.7 * p;
  const ox = bx + bl - 8 * mm;
  const nozzle = 9 * mm;
  let s = '';
  const leads = twoLeads(
    T,
    names,
    [
      [bx - 0.6 * mm, cy - 1.6 * mm],
      [bx - 0.6 * mm, cy + 1.6 * mm],
    ],
    p,
    h - 0.6 * p,
  );
  s += leads.svg;
  if (running) {
    let d = '';
    [-1, 0, 1].forEach(k => {
      const x = ox + k * 1.6 * mm;
      d += `M${r2(x)} ${r2(by - nozzle - 0.8 * mm)}C${r2(x + k * 1.2 * mm - 1.0 * mm)} ${r2(by - nozzle - 2.4 * mm)} ${r2(x + k * 2.4 * mm + 1.0 * mm)} ${r2(by - nozzle - 3.6 * mm)} ${r2(x + k * 3.2 * mm)} ${r2(0.4 * p)}`;
    });
    s += tag(
      'flow',
      path(d, 'none', {
        stroke: T['lens-blue'],
        'stroke-width': 1.2,
        'stroke-linecap': 'round',
        'stroke-dasharray': '2.4 1.6',
        'stroke-opacity': T['opacity-flow'],
      }),
      { 'data-hook': 'flow' },
    );
  }
  s += tag(
    'body',
    rect(
      ox - 3.75 * mm,
      by - nozzle,
      7.5 * mm,
      nozzle + 1.5 * mm,
      T['plastic-black'],
      Object.assign({ rx: 0.8 }, edge(T, T['plastic-black-edge'], T['stroke-detail'])),
    ) +
      rect(
        bx - 1.2 * mm,
        cy - 3.2 * mm,
        1.6 * mm,
        6.4 * mm,
        T['plastic-black'],
        Object.assign({ rx: 0.6 }, edge(T, T['plastic-black-edge'], T['stroke-detail'])),
      ) +
      rect(bx, by, bl, bh, T['plastic-black'], Object.assign({ rx: 5 * mm }, edge(T, T['plastic-black-edge']))),
    { 'data-hook': 'pump', 'data-running': running ? 'true' : 'false' },
  );
  s += bevel(T, bx, by, bl, bh, 2.2, 5 * mm);
  s += rect(ox - 2.6 * mm, by - nozzle + 0.6 * mm, 5.2 * mm, 1.2 * mm, T.cavity, { rx: 0.5 });
  // The seam between the motor and the pump head, and the inlet slots in the head's end.
  s += path(`M${r2(bx + bl - 15 * mm)} ${r2(by + 0.6)}V${r2(by + bh - 0.6)}`, 'none', {
    stroke: T['plastic-black-edge'],
    'stroke-width': T['stroke-detail'],
  });
  [-1, 0, 1].forEach(k => {
    s += rect(bx + bl - 3.4 * mm, cy + k * 3 * mm - 0.6 * mm, 2.2 * mm, 1.2 * mm, T.cavity, { rx: 0.5 });
  });
  s += rect(bx + 3 * mm, by + 1.6 * mm, bl - 6 * mm, 1.4 * mm, '#ffffff', {
    rx: 0.7,
    'fill-opacity': T['opacity-light'] * 0.4,
  });
  s += leads.header;
  return art(w, h, `Water pump${running ? ', running' : ''}`, s, leads.pins);
}

/**
 * The open-frame push-pull solenoid (JF-0530B class) from its side: the
 * 27 x 14 mm frame around the taped coil and the 10 mm stroke plunger out
 * of its right end with the return spring and the end collar. `position`
 * runs from 0, the spring holding it out, to 1, pulled in (plunger,
 * data-position). `volts` is the coil rating printed on the tape (12 by
 * default). Two leads from the coil to a header of legs at the bottom edge
 * (1, 2).
 */
export function solenoid(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const position = Math.max(0, Math.min(1, Number(props.position) || 0));
  const volts = Number(props.volts) > 0 ? Number(props.volts) : 12;
  const names = props.pins || ['1', '2'];
  const fl = 27 * mm;
  const fh = 14 * mm;
  const fx = 1.6 * p;
  const fy = 0.5 * p;
  const cy = fy + fh / 2;
  const plate = 1.5 * mm;
  const out = 14 * mm - 10 * mm * position;
  const w = Math.ceil((fx + fl + 14 * mm + 1.6 * mm + 0.5 * p) / p) * p;
  const h = fy + fh + 2.7 * p;
  let s = '';
  const leads = twoLeads(
    T,
    names,
    [
      [fx - 0.6 * mm, cy - 1.8 * mm],
      [fx - 0.6 * mm, cy + 1.8 * mm],
    ],
    p,
    h - 0.6 * p,
  );
  s += leads.svg;
  const fe = fx + fl;
  s += tag(
    'body',
    rect(fx, fy, fl, fh, T.metal, Object.assign({ rx: 0.6 }, edge(T, T['metal-edge']))) +
      rect(
        fx + plate,
        fy + plate,
        fl - 2 * plate,
        fh - 2 * plate,
        T['plastic-black'],
        Object.assign({ rx: 0.4 }, edge(T, T['plastic-black-edge'], T['stroke-detail'])),
      ) +
      rect(
        fx + plate + 0.8 * mm,
        fy + plate + 0.6 * mm,
        fl - 2 * plate - 1.6 * mm,
        fh - 2 * plate - 1.2 * mm,
        T['band-yellow'],
        Object.assign({ rx: 0.6 }, edge(T, T['brass-edge'], T['stroke-fine'])),
      ),
  );
  s += rect(fx + plate + 1.6 * mm, fy + plate + 1.2 * mm, fl - 2 * plate - 3.2 * mm, 1.2 * mm, '#ffffff', {
    rx: 0.6,
    'fill-opacity': T['opacity-light'] * 0.6,
  });
  s += text(fx + fl / 2, cy + 1.2 * mm, `${String(volts)}V`, PIN_LABEL, T['plastic-black'], { 'font-weight': 600 });
  // The return spring between the frame and the collar, closer wound as the plunger goes in.
  const sx0 = fe + 0.4 * mm;
  const sx1 = fe + out - 1.8 * mm;
  const turns = 6;
  let d = `M${r2(sx0)} ${r2(cy)}`;
  for (let i = 0; i < turns; i++) {
    const x = sx0 + ((i + 0.5) * (sx1 - sx0)) / turns;
    d += `L${r2(x)} ${r2(cy + (i % 2 ? 1 : -1) * 2.6 * mm)}`;
  }
  d += `L${r2(sx1)} ${r2(cy)}`;
  s += path(d, 'none', { stroke: T['metal-edge'], 'stroke-width': 0.8, 'stroke-linejoin': 'round' });
  s += el(
    'g',
    {
      'data-hook': 'plunger',
      'data-part': 'plunger',
      'data-position': r2(position),
    },
    rect(
      fe,
      cy - 2.25 * mm,
      out,
      4.5 * mm,
      T.metal,
      Object.assign({ rx: 0.4 }, edge(T, T['metal-edge'], T['stroke-detail'])),
    ) +
      rect(
        fe + out - 1.6 * mm,
        cy - 3.6 * mm,
        1.6 * mm,
        7.2 * mm,
        T.metal,
        Object.assign({ rx: 0.4 }, edge(T, T['metal-edge'], T['stroke-detail'])),
      ),
  );
  s += leads.header;
  return art(w, h, `Solenoid, ${position >= 1 ? 'pulled in' : position <= 0 ? 'released' : 'moving'}`, s, leads.pins);
}
