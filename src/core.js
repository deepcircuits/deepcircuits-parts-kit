/** The kit's foundation: tokens, SVG primitives, sheens and bevels, pins and headers, bare boards, the chip package, lenses and indicators, and the live-layer fragments (flow, probe). */
import { FALLBACK, COLOR_TOKENS } from './tokens.js';

export const PITCH = 9.6;
const MONO = 'ui-monospace,monospace';

function num(v, fb) {
  const n = parseFloat(v);
  return isFinite(n) ? n : fb;
}
let cache = null;
let cacheAt = 0;
let mode = 'values';
let prefix = '';
const COLOR = new Set(COLOR_TOKENS);
/**
 * How tokens() resolves colours. 'values' (the default) always uses the light values from tokens.json, so a page's own
 * custom properties never recolour a part. 'vars' writes every colour as var(--token, value): artwork drawn once then
 * follows whatever theme the page sets (light, dark), and falls back to the light value where no stylesheet defines the
 * token. 'live' reads the page's --token custom properties as it draws (at most every 50 ms), so a change to the page's
 * tokens shows on the next drawing, and otherwise uses the light values. `prefix` namespaces the custom properties in
 * 'vars' and 'live': { prefix: 'kit-' } writes var(--kit-pad, ...) and reads --kit-pad. Metrics stay numbers in every mode.
 */
export function setTokenMode(m, props) {
  if (m !== 'live' && m !== 'values' && m !== 'vars') throw new Error("The token mode is 'live', 'values' or 'vars'.");
  mode = m;
  prefix = (props && props.prefix) || '';
  cache = null;
}
/** The current token mode and prefix. */
export function tokenMode() {
  return { mode, prefix };
}
/**
 * Runs `fn` with the token mode set to `m` (and optional `{ prefix }`), then restores the previous mode and prefix,
 * even if `fn` throws. Keeps standalone exports, previews and tests isolated from a host's active token mode.
 */
export function withTokenMode(m, props, fn) {
  if (typeof props === 'function') {
    fn = props;
    props = undefined;
  }
  const prevMode = mode;
  const prevPrefix = prefix;
  setTokenMode(m, props);
  try {
    return fn();
  } finally {
    setTokenMode(prevMode, prevPrefix ? { prefix: prevPrefix } : undefined);
  }
}
/** The palette and metrics, resolved by the token mode (the light values from tokens.json, by default). */
export function tokens() {
  const now = mode === 'live' ? Date.now() : 0;
  if (cache && (mode !== 'live' || now - cacheAt < 50)) return cache;
  const out = {};
  let css = null;
  if (mode === 'live')
    try {
      if (typeof document !== 'undefined' && typeof getComputedStyle === 'function')
        css = getComputedStyle(document.documentElement);
    } catch {
      css = null;
    }
  for (const k in FALLBACK) {
    const v = css ? css.getPropertyValue(`--${prefix}${k}`).trim() : '';
    out[k] = v || (mode === 'vars' && COLOR.has(k) ? `var(--${prefix}${k}, ${FALLBACK[k]})` : FALLBACK[k]);
  }
  // Metrics (every token that is not a colour) as numbers.
  for (const k in FALLBACK) if (!COLOR.has(k)) out[k] = num(out[k], num(FALLBACK[k], 0));
  cache = out;
  cacheAt = now;
  return out;
}

/** The smallest print on a part: 4px, which is 3pt at the kit's scale (0.1 in = 9.6px), the floor SparkFun's Fritzing guide sets. */
export const PIN_LABEL = 4;
/** The width the kit allows for `chars` characters of print `size` px high: 0.62 of the size each, the sans' mean advance. */
export function textWidth(chars, size) {
  return chars * size * 0.62;
}
export const r2 = function (n) {
  return Math.round(n * 100) / 100;
};
// Most values have nothing to escape, so they skip the replacements: drawing spends most of its time here.
const ESCAPED = /[&<>"]/;
const esc = function (s) {
  s = String(s);
  return ESCAPED.test(s)
    ? s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    : s;
};
function attrs(props) {
  let s = '';
  for (const k in props) {
    const v = props[k];
    if (v === undefined || v === null || v === false) continue;
    s += ` ${k}="${typeof v === 'number' ? r2(v) : esc(v)}"`;
  }
  return s;
}
export function el(tag, props, inner) {
  return `<${tag}${attrs(props)}${inner !== undefined ? `>${inner}</${tag}>` : '/>'}`;
}
export function rect(x, y, w, h, fill, more) {
  return el('rect', Object.assign({ x, y, width: w, height: h, fill }, more || {}));
}
export function circle(cx, cy, r, fill, more) {
  return el('circle', Object.assign({ cx, cy, r, fill }, more || {}));
}
export function line(x1, y1, x2, y2, stroke, w, more) {
  return el(
    'line',
    Object.assign({ x1, y1, x2, y2, stroke, 'stroke-width': w, 'stroke-linecap': 'round' }, more || {}),
  );
}
export function path(d, fill, more) {
  return el('path', Object.assign({ d, fill }, more || {}));
}
export function text(x, y, s, size, fill, more) {
  return el(
    'text',
    Object.assign({ x, y, 'font-size': size, 'font-family': MONO, fill, 'text-anchor': 'middle' }, more || {}),
    esc(s),
  );
}
export function svg(w, h, label, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(w)}" height="${r2(h)}" viewBox="0 0 ${r2(w)} ${r2(h)}" role="img" aria-label="${esc(label)}">${flushDefs()}${inner}</svg>`;
}
export function art(w, h, label, inner, pins) {
  return {
    width: r2(w),
    height: r2(h),
    svg: svg(w, h, label, inner),
    pins: pins.map(p => {
      return { name: p.name, x: r2(p.x), y: r2(p.y) };
    }),
  };
}
export function edge(T, color, w) {
  return { stroke: color, 'stroke-width': w === undefined ? T['stroke-outline'] : w };
}
/** Wrap a drawn part so the overlap checker (check) can see it as one thing. */
export function tag(name, inner, more) {
  return el('g', Object.assign({ 'data-part': name }, more || {}), inner);
}
/** A plated hole through a board: the hole in its pad ring, `w` the ring's stroke (the outline stroke by default). */
export function hole(T, x, y, r, w) {
  return tag('hole', circle(x, y, r, T.hole, edge(T, T.pad, w)));
}
/**
 * The bevel a moulded or machined box gets from the bench light: one light
 * path along its top and left edges, one shade path along its bottom and
 * right, each `d` wide, inset by the outline. Flat paint, two overlays.
 */
export function bevel(T, x, y, w, h, d, rx) {
  d = d || Math.max(1, Math.min(2.2, Math.min(w, h) * 0.09));
  if (rx === undefined) rx = Math.max(1, d);
  // Stroked along the body's own rounded outline, half the band's width inside it, so the bevel turns the corners with the body instead of poking past them.
  const i = 0.7 + d / 2;
  const r = Math.max(0.3, rx - d / 2 - 0.2);
  const x0 = x + i;
  const y0 = y + i;
  const x1 = x + w - i;
  const y1 = y + h - i;
  const k = r * (1 - Math.SQRT1_2);
  const light = `M${r2(x0)} ${r2(y1 - r)}V${r2(y0 + r)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x0 + r)} ${r2(y0)}H${r2(x1 - r)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x1 - k)} ${r2(
    y0 + k,
  )}M${r2(x0)} ${r2(y1 - r)}A${r2(r)} ${r2(r)} 0 0 0 ${r2(x0 + k)} ${r2(y1 - k)}`;
  const shade = `M${r2(x1 - k)} ${r2(y0 + k)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x1)} ${r2(y0 + r)}V${r2(y1 - r)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x1 - r)} ${r2(y1)}H${r2(x0 + r)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x0 + k)} ${r2(y1 - k)}`;
  return (
    path(light, 'none', {
      stroke: '#ffffff',
      'stroke-width': d,
      'stroke-opacity': T['opacity-light'],
      'stroke-linecap': 'butt',
    }) +
    path(shade, 'none', {
      stroke: '#000000',
      'stroke-width': d,
      'stroke-opacity': T['opacity-shade'],
      'stroke-linecap': 'butt',
    })
  );
}
/**
 * Gradient sheens, the one departure from flat colour: a radial sheen for
 * domes and lenses, a linear one for metal. Each artwork carries its own
 * <defs>. The ids start pk- and name what they draw (pk-dome, pk-glow-
 * ff0000), so two parts on one page that share an id share an identical
 * gradient; scopeIds makes them unique for a host that needs it. The sheen is an
 * overlay on top of the flat colour, so a state painter that resets a
 * lens fill never loses it.
 */
let DEFS = {};
// Each sheen's id and gradient, built once for each kind and glow colour (a strip draws one glow for every pixel).
const SHEENS = new Map();
export function sheen(kind, color) {
  const key = kind === 'glow' || kind === 'halo' || kind === 'bloom' ? `${kind} ${color}` : kind;
  let found = SHEENS.get(key);
  if (!found) {
    // A long run of changing glow colours starts the cache again instead of growing it.
    if (SHEENS.size >= 512) SHEENS.clear();
    found = gradient(kind, color);
    SHEENS.set(key, found);
  }
  DEFS[found.id] = found.def;
  return `url(#${found.id})`;
}
// Each gradient: its element, geometry and stops ([offset, colour, opacity]). Any other kind is metal.
const GRADIENTS = {
  hot: [
    'radialGradient',
    { cx: '50%', cy: '50%', r: '50%' },
    [
      ['0', '#ffffff', 0.95],
      ['0.4', '#ffffff', 0.45],
      ['1', '#ffffff', 0],
    ],
  ],
  dome: [
    'radialGradient',
    { cx: '38%', cy: '30%', r: '70%' },
    [
      ['0', '#ffffff', 0.55],
      ['0.45', '#ffffff', 0.08],
      ['1', '#000000', 0.22],
    ],
  ],
  lens: [
    'radialGradient',
    { cx: '36%', cy: '32%', r: '65%' },
    [
      ['0', '#ffffff', 0.5],
      ['0.5', '#ffffff', 0.06],
      ['1', '#000000', 0.18],
    ],
  ],
  metal: [
    'linearGradient',
    { x1: '0', y1: '0', x2: '1', y2: '1' },
    [
      ['0', '#ffffff', 0.42],
      ['0.5', '#ffffff', 0.04],
      ['1', '#000000', 0.2],
    ],
  ],
};
function gradient(kind, color) {
  let id;
  let shape;
  if (kind === 'glow' || kind === 'halo' || kind === 'bloom') {
    id = `pk-${kind}-${String(color)
      .replace(/[^0-9a-z]/gi, '')
      .toLowerCase()}`;
    // A halo stays strong out to the lens it surrounds, then falls away; a bloom is the softer light spilling past it; a
    // glow fades from its centre.
    shape = [
      'radialGradient',
      { cx: '50%', cy: '50%', r: '50%' },
      kind === 'halo'
        ? [
            ['0', color, 1],
            ['0.6', color, 0.9],
            ['0.8', color, 0.42],
            ['1', color, 0],
          ]
        : kind === 'bloom'
          ? [
              ['0', color, 0.7],
              ['0.5', color, 0.45],
              ['0.8', color, 0.12],
              ['1', color, 0],
            ]
          : [
              ['0', color, 0.9],
              ['0.55', color, 0.55],
              ['1', color, 0],
            ],
    ];
  } else {
    const name = kind === 'hot' || kind === 'dome' || kind === 'lens' ? kind : 'metal';
    id = `pk-${name}`;
    shape = GRADIENTS[name];
  }
  const [element, geometry, stops] = shape;
  const def = el(
    element,
    { id, ...geometry },
    stops.map(([offset, c, opacity]) => el('stop', { offset, 'stop-color': c, 'stop-opacity': opacity })).join(''),
  );
  return { id, def };
}
/**
 * The bevel of any outline: the polygon's edges that face up or left take
 * the light, those that face down or right the shade, each as a band `d`
 * wide inset from the edge. Rounded corners and chamfers are followed by
 * their vertices. Board outlines use it; bevel() is the rectangle case.
 */
export function bevelPoly(T, pts, d) {
  d = d || 2.2;
  const n = pts.length;
  let area = 0;
  let light = '';
  let shade = '';
  for (let i = 0; i < n; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    area += a[0] * b[1] - b[0] * a[1];
  }
  const sgn = area > 0 ? 1 : -1;
  for (let i = 0; i < n; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const ex = b[0] - a[0];
    const ey = b[1] - a[1];
    const len = Math.sqrt(ex * ex + ey * ey);
    if (len < 2 * d + 1) continue;
    // The inward normal: for a clockwise outline in screen space the interior is to the right of each edge. Each band is stroked half its width inside the edge and stops short of the corners, so it turns with a rounded corner instead of poking past it.
    const nx = (-ey / len) * sgn;
    const ny = (ex / len) * sgn;
    const ox = nx * (0.7 + d / 2);
    const oy = ny * (0.7 + d / 2);
    const sh = d;
    const q = `M${r2(a[0] + (ex / len) * sh + ox)} ${r2(a[1] + (ey / len) * sh + oy)}L${r2(b[0] - (ex / len) * sh + ox)} ${r2(b[1] - (ey / len) * sh + oy)}`;
    if (-nx - ny > 0.05) light += q;
    else if (-nx - ny < -0.05) shade += q;
  }
  return (
    (light
      ? path(light, 'none', {
          stroke: '#ffffff',
          'stroke-width': d,
          'stroke-opacity': T['opacity-light'],
          'stroke-linecap': 'round',
        })
      : '') +
    (shade
      ? path(shade, 'none', {
          stroke: '#000000',
          'stroke-width': d,
          'stroke-opacity': T['opacity-shade'],
          'stroke-linecap': 'round',
        })
      : '')
  );
}
function flushDefs() {
  const k = Object.keys(DEFS);
  if (!k.length) return '';
  const d = `<defs>${k
    .map(n => {
      return DEFS[n];
    })
    .join('')}</defs>`;
  DEFS = {};
  return d;
}

/** True when every pin lies on the 0.1 inch grid relative to the first. */
export function pinsOnPitch(pins, tolerance) {
  tolerance = tolerance === undefined ? 1e-6 : tolerance;
  if (!pins.length) return true;
  const f = pins[0];
  const on = function (d) {
    return Math.abs(d / PITCH - Math.round(d / PITCH)) * PITCH <= tolerance;
  };
  return pins.every(p => {
    return on(p.x - f.x) && on(p.y - f.y);
  });
}

/** The board finishes: body, edge and silk token names. */
export const FINISHES = {
  blue: { board: 'pcb-blue', edge: 'pcb-blue-edge', silk: 'silk', indicatorOff: 'indicator-off' },
  green: { board: 'pcb-green', edge: 'pcb-green-edge', silk: 'silk', indicatorOff: 'indicator-off' },
  teal: { board: 'pcb-teal', edge: 'pcb-teal-edge', silk: 'silk', indicatorOff: 'indicator-off' },
  black: { board: 'pcb-black', edge: 'pcb-black-edge', silk: 'silk', indicatorOff: 'indicator-off' },
  purple: { board: 'pcb-purple', edge: 'pcb-purple-edge', silk: 'silk', indicatorOff: 'indicator-off' },
  white: { board: 'pcb-white', edge: 'pcb-white-edge', silk: 'silk-dark', indicatorOff: 'indicator-off-light' },
  red: { board: 'pcb-red', edge: 'pcb-red-edge', silk: 'silk', indicatorOff: 'indicator-off' },
};
export function finish(T, name) {
  const f = FINISHES[name] || FINISHES.blue;
  return { board: T[f.board], edge: T[f.edge], silk: T[f.silk], indicatorOff: T[f.indicatorOff] };
}
const LENSES = {
  red: 'lens-red',
  green: 'lens-green',
  yellow: 'lens-yellow',
  blue: 'lens-blue',
  white: 'lens-white',
  orange: 'lens-orange',
};
/** A lens colour: a named lens token, or any plain CSS colour a part attribute carries. */
export function lensColor(T, value) {
  if (typeof value === 'string' && LENSES[value.toLowerCase()]) return T[LENSES[value.toLowerCase()]];
  if (
    typeof value === 'string' &&
    /^(?:#(?:[0-9a-f]{3}|[0-9a-f]{6})|[a-z]{3,20}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\))$/i.test(
      value,
    )
  )
    return value;
  return T['lens-red'];
}

/**
 * One pin as drawn on a part. kind: 'pad' (gold through-hole pad with its
 * hole), 'socket' (a female header position: black housing, dark hole),
 * 'smd' (a castellated or SMD pad), 'leg' (a bare lead end, no paint of
 * its own). label sits above, below, left or right in the given silk.
 */
export function pin(props) {
  const T = tokens();
  const x = props.x;
  const y = props.y;
  const kind = props.kind || 'pad';
  let s = '';
  const silk = props.silk || T.silk;
  const size = props.size || PIN_LABEL;
  const p = T.pitch;
  if (kind === 'pad')
    s += tag(
      'pin',
      circle(x, y, T['pad-radius'], T.pad) + circle(x, y, T['hole-radius'], T.hole, edge(T, T['metal-edge'], 0.5)),
    );
  else if (kind === 'socket')
    s += tag(
      'pin',
      rect(x - p / 2, y - p / 2, p, p, T['plastic-black'], {
        stroke: T['plastic-black-edge'],
        'stroke-width': T['stroke-fine'],
      }) + rect(x - 1.5, y - 1.5, 3, 3, T.cavity, { rx: 0.4 }),
    );
  else if (kind === 'smd') s += tag('pin', rect(x - 3.2, y - 2.4, 6.4, 4.8, T.pad, { rx: T['radius-part'] }));
  if (props.label) {
    const side = props.side || 'above';
    const clear = kind === 'socket' ? p / 2 : 0;
    if (props.rotate) {
      // A long name on a crowded row stands on end, reading away from the pin.
      const gapR = clear ? clear + 1.6 : T['pad-radius'] + 1.0;
      const ty = side === 'above' ? y - gapR : y + gapR;
      s += text(x, ty, props.label, size, silk, {
        'text-anchor': side === 'above' ? 'start' : 'end',
        'dominant-baseline': 'middle',
        transform: `rotate(-90 ${r2(x)} ${r2(ty)})`,
      });
    } else if (side === 'above') s += text(x, y - clear - T['label-rise'] + (clear ? 1.4 : 0), props.label, size, silk);
    else if (side === 'below') s += text(x, y + clear + T['label-drop'] - (clear ? 1.4 : 0), props.label, size, silk);
    else if (side === 'left')
      s += text(x - (kind === 'socket' ? p * 0.7 : T['pad-radius'] + 1.4), y + size * 0.36, props.label, size, silk, {
        'text-anchor': 'end',
      });
    else
      s += text(x + (kind === 'socket' ? p * 0.7 : T['pad-radius'] + 1.4), y + size * 0.36, props.label, size, silk, {
        'text-anchor': 'start',
      });
  }
  return s;
}

/**
 * How a row of pin names prints at pitch `p`: the longest name's length, whether the names turn to run along the pins
 * (when the longest is wider than the gap between pins) and how far the print reaches from the pin centres.
 */
export function labelRow(T, names, p) {
  const longest = names.reduce((m, n) => Math.max(m, n.length), 0);
  const rotate = textWidth(longest, PIN_LABEL) > p - 1.6;
  const span = rotate ? T['pad-radius'] + 1.0 + textWidth(longest, PIN_LABEL) + 1.2 : T['label-rise'] + 3.6;
  return { longest, rotate, span };
}

/**
 * A row of pins one pitch apart along x (axis 'x') or y (axis 'y'), printed with `labels` and named `names` (the
 * labels, or the pin numbers, by default). Returns { svg, pins }.
 */
export function header(props) {
  const T = tokens();
  const p = T.pitch;
  const labels = props.labels || [];
  const count = props.count || labels.length;
  const axis = props.axis || 'x';
  let s = '';
  const pins = [];
  for (let i = 0; i < count; i++) {
    const x = axis === 'x' ? props.x + i * p : props.x;
    const y = axis === 'x' ? props.y : props.y + i * p;
    const name = labels[i] || String(i + 1);
    s += pin({
      x,
      y,
      kind: props.kind,
      label: props.labels ? name : undefined,
      side: props.side,
      silk: props.silk,
      size: props.size,
      rotate: props.rotate,
    });
    pins.push({ name: props.names ? props.names[i] : name, x, y });
  }
  return { svg: s, pins };
}

/** A bare board: the finish, its edge, corner mounting holes and a silk title. */
export function board(props) {
  const T = tokens();
  const f = finish(T, props.finish);
  const i = T['board-inset'];
  const w = props.width;
  const h = props.height;
  const y0 = props.y || 0;
  let s = '';
  s += tag(
    'board',
    rect(i, y0 + i, w - 2 * i, h - 2 * i, f.board, Object.assign({ rx: T['radius-board'] }, edge(T, f.edge))),
  );
  s += bevel(T, i, y0 + i, w - 2 * i, h - 2 * i, 2.2, T['radius-board']);
  if (props.holes !== false) {
    const m = 0.6 * T.pitch;
    const r = T['mount-hole-radius'];
    (props.holes === 'top'
      ? [
          [m, y0 + m],
          [w - m, y0 + m],
        ]
      : [
          [m, y0 + m],
          [w - m, y0 + m],
          [m, y0 + h - m],
          [w - m, y0 + h - m],
        ]
    ).forEach(c => {
      s += hole(T, c[0], c[1], r);
    });
  }
  if (props.title)
    s += text(
      props.titleX === undefined ? w / 2 : props.titleX,
      props.titleY === undefined ? y0 + h / 2 : props.titleY,
      props.title,
      props.titleSize || 5,
      f.silk,
      props.titleAnchor ? { 'text-anchor': props.titleAnchor } : undefined,
    );
  if (props.mark) s += silkMark(props.mark.x, props.mark.y, props.mark.size || T.pitch, f.silk);
  return s;
}

/** The maker's mark on a board's silk: the probe on a node, in one ink. x, y is its top-left corner; size its width. */
export function silkMark(x, y, size, color) {
  const k = size / 32;
  return el(
    'g',
    { 'data-mark': 'deepcircuits', 'data-part': 'mark', transform: `translate(${r2(x)} ${r2(y)}) scale(${r2(k)})` },
    path('M4 16h11', 'none', { stroke: color, 'stroke-width': 3.2, 'stroke-linecap': 'round' }) +
      circle(20, 16, 5, color) +
      path('M18 25h10', 'none', { stroke: color, 'stroke-width': 3.2, 'stroke-linecap': 'round' }),
  );
}
/** Current along a leg: signal dashes over the wire, data-live="flow", opacity 0 until a host (or live.flow) turns it on. */
export function flow(x1, y1, x2, y2, on, hook) {
  const T = tokens();
  // 'reverse' runs the dashes from the end back to the start.
  if (on === 'reverse') [x1, y1, x2, y2] = [x2, y2, x1, y1];
  return line(x1, y1, x2, y2, T.signal, 1.2, {
    'data-hook': hook,
    'data-live': 'flow',
    'data-part': 'flow',
    'stroke-dasharray': '2.4 3.4',
    opacity: on ? T['opacity-flow'] : 0,
  });
}
/** The probe on a pin: a signal ring with the tip in signal-ink, data-live="probe". */
export function probe(x, y) {
  const T = tokens();
  return el(
    'g',
    { 'data-live': 'probe', 'data-part': 'probe' },
    circle(x, y, 4.6, T.signal, { 'fill-opacity': 0.3 }) +
      circle(x, y, 4.6, 'none', { stroke: T.signal, 'stroke-width': 1.4 }) +
      circle(x, y, 1.5, T['signal-ink']),
  );
}

const ROW_PITCHES = { dip: 3, soic: 2, tssop: 2 };
/**
 * A chip package, top view, pin 1 at the top left with the notch, numbered
 * anticlockwise as on the data sheet. Pin names sit outside the leads in
 * currentColor; a DIP body also carries pin numbers. `labels` prints other
 * text than the pin names, one per pin (a CD4511's segment outputs SEG_A ...
 * printed a ... g as the data sheet has them).
 */
export function chipTemplate(props) {
  const T = tokens();
  const names = props.pins;
  const label = props.label;
  const kind = props.package || 'dip';
  if (!names || names.length < 4 || names.length > 64 || names.length % 2)
    throw new Error(`A ${kind.toUpperCase()} needs an even pin count from 4 to 64.`);
  if (props.labels && props.labels.length !== names.length)
    throw new Error(`A chip's labels need one per pin (${names.length}).`);
  const printed = props.labels || names;
  const half = names.length / 2;
  const p = T.pitch;
  const span = ROW_PITCHES[kind] * p;
  const NAME = 5.2;
  const LEAD = T['lead-length'];
  const longest = Math.max.apply(
    null,
    printed.map(n => {
      return n.length;
    }),
  );
  const margin = Math.ceil((textWidth(longest, NAME) + 3) * 10) / 10;
  const width = 2 * margin + span;
  const xl = margin;
  const xr = margin + span;
  const top = p * 0.8;
  const height = 2 * top + (half - 1) * p;
  const pinY = function (row) {
    return top + row * p;
  };
  const pins = names.map((name, index) => {
    return index < half ? { name, x: xl, y: pinY(index) } : { name, x: xr, y: pinY(names.length - 1 - index) };
  });
  const bodyLeft = xl + LEAD;
  const bodyRight = xr - LEAD;
  const bodyTop = top - p * 0.6;
  const bodyBottom = height - bodyTop;
  const cx = (bodyLeft + bodyRight) / 2;
  const cy = height / 2;
  let s = tag(
    'body',
    rect(
      bodyLeft,
      bodyTop,
      bodyRight - bodyLeft,
      bodyBottom - bodyTop,
      T.chip,
      Object.assign({ rx: T['radius-chip'] }, edge(T, T['chip-edge'])),
    ),
  );
  s += path(`M${r2(cx - 2.6)} ${r2(bodyTop)}a2.6 2.6 0 0 0 5.2 0z`, T['chip-print']);
  if (kind !== 'dip') s += circle(bodyLeft + 2.2, top, 0.9, T['chip-print']);
  pins.forEach((pn, index) => {
    const left = pn.x === xl;
    s +=
      line(pn.x, pn.y, left ? bodyLeft : bodyRight, pn.y, T['lead-edge'], T['lead-width']) +
      line(pn.x, pn.y, left ? bodyLeft : bodyRight, pn.y, T.lead, T['lead-width'] - 1.0);
    // The lead's shoulder where it leaves the body.
    s += rect(
      left ? bodyLeft - LEAD * 0.55 : bodyRight,
      pn.y - 1.7,
      LEAD * 0.55,
      3.4,
      T.lead,
      Object.assign({ rx: 0.3 }, edge(T, T['lead-edge'], 0.4)),
    );
    s += text(left ? pn.x - 2.2 : pn.x + 2.2, pn.y + NAME * 0.36, printed[index], NAME, 'currentColor', {
      'text-anchor': left ? 'end' : 'start',
    });
    if (kind === 'dip')
      s += text(left ? bodyLeft + 0.8 : bodyRight - 0.8, pn.y + 1.2, String(index + 1), PIN_LABEL, T['chip-print'], {
        'text-anchor': left ? 'start' : 'end',
      });
  });
  // The moulding: the bevel the bench light gives the epoxy block, ejector-pin marks at both ends.
  s += bevel(T, bodyLeft, bodyTop, bodyRight - bodyLeft, bodyBottom - bodyTop, 1.6, T['radius-chip']);
  s +=
    circle(cx, bodyTop + 4.2, 1.1, 'none', {
      stroke: T['chip-edge'],
      'stroke-width': T['stroke-fine'],
      'stroke-opacity': 0.8,
    }) +
    circle(cx, bodyBottom - 4.2, 1.1, 'none', {
      stroke: T['chip-edge'],
      'stroke-width': T['stroke-fine'],
      'stroke-opacity': 0.8,
    });
  const labelSize = Math.min(6.4, ((bodyBottom - bodyTop - 8) / Math.max(4, label.length)) * 1.6);
  // The lot code beside the part number, as every chip carries one: the two make one block, centred on the
  // body, that stays clear of the pin numbers inside a DIP (two digits at PIN_LABEL) by at least 0.5px.
  const code = lotCode(label);
  const codeRoom = bodyBottom - bodyTop - 8 >= textWidth(code.length, PIN_LABEL) && labelSize >= 4.4;
  const numbersW = kind === 'dip' ? 0.8 + textWidth(2, PIN_LABEL) + 0.5 : 1.2;
  const block = labelSize + 0.8 + PIN_LABEL;
  const withCode = codeRoom && bodyRight - bodyLeft >= block + 2 * numbersW;
  const labelX = withCode ? cx + block / 2 - labelSize / 2 : cx;
  const codeX = cx - block / 2 + PIN_LABEL / 2;
  s += text(labelX, cy, label, labelSize, T['chip-print'], {
    'dominant-baseline': 'middle',
    transform: `rotate(90 ${r2(labelX)} ${r2(cy)})`,
  });
  if (withCode)
    s += text(codeX, cy, code, PIN_LABEL, T['chip-print'], {
      'dominant-baseline': 'middle',
      'fill-opacity': 0.85,
      transform: `rotate(90 ${r2(codeX)} ${r2(cy)})`,
    });
  return art(width, height, `${label}, ${names.length}-pin ${kind.toUpperCase()}`, s, pins);
}

/** A stable lot code for a part number: ours, never a vendor's. */
export function lotCode(label) {
  let h = 7;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) % 100000;
  return `DC${26 + (h % 9)}${String.fromCharCode(65 + (h % 26))}${100 + (h % 900)}`;
}
/** Traces under the solder mask: a faint polyline (points: [[x, y], ...]) in the finish's own tint. */
export function trace(T, finishName, points) {
  const d = points
    .map((pt, i) => {
      return `${(i ? 'L' : 'M') + r2(pt[0])} ${r2(pt[1])}`;
    })
    .join('');
  return path(d, 'none', {
    'data-part': 'trace',
    stroke: finishName === 'white' ? '#000000' : '#ffffff',
    'stroke-opacity': finishName === 'white' ? 0.1 : 0.11,
    'stroke-width': 1.1,
    'stroke-linejoin': 'round',
    'stroke-linecap': 'round',
  });
}
/** A via: a small ring of pad with a hole. */
export function via(T, x, y) {
  return tag('via', circle(x, y, 1.2, T.pad) + circle(x, y, 0.55, T.hole, edge(T, T['metal-edge'], 0.4)));
}
/** An electrolytic capacitor seen from above on a board: the can with its vent cross and the stripe. */
export function capTop(T, x, y, r) {
  return tag(
    'cap',
    circle(x, y, r, T['cap-electrolytic'], edge(T, T['plastic-black-edge'], T['stroke-detail'])) +
      path(
        `M${r2(x + r * 0.55)} ${r2(y - r * 0.83)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(x + r * 0.55)} ${r2(y + r * 0.83)}L${r2(x + r * 0.72)} ${r2(y + r * 0.69)}A${r2(r)} ${r2(r)} 0 0 0 ${r2(x + r * 0.72)} ${r2(y - r * 0.69)}z`,
        T['cap-stripe'],
      ) +
      circle(x, y, r * 0.62, T.metal, edge(T, T['metal-edge'], T['stroke-fine'])) +
      circle(x, y, r * 0.62, sheen('metal'), { 'fill-opacity': 0.6 }) +
      path(`M${r2(x - r * 0.4)} ${r2(y)}h${r2(r * 0.8)}M${r2(x)} ${r2(y - r * 0.4)}v${r2(r * 0.8)}`, 'none', {
        stroke: T['metal-edge'],
        'stroke-width': 0.6,
      }),
  );
}

/**
 * An LED lens: a dome seen from above. Unlit it is the lens colour at
 * opacity-lens-off over plastic-grey; lit at a brightness (0..1) it fills
 * with colour, shaded when dim, white-hot in the middle and haloed as it
 * brightens (shine). ids: lens, glow (for state animation).
 */
export function lens(props) {
  const T = tokens();
  const cx = props.cx;
  const cy = props.cy;
  const r = props.r || 9;
  const color = lensColor(T, props.color);
  const on = !!props.on;
  const b = on ? (props.brightness === undefined ? 1 : Math.max(0, Math.min(1, props.brightness))) : 0;
  const L = shine(b);
  let s = '';
  s += tag(
    'glow',
    circle(cx, cy, r2(r * (1.2 + 0.9 * L.spread)), sheen('halo', color), {
      'data-hook': props.hook ? `${props.hook}-glow` : 'glow',
      'fill-opacity': r2(L.halo),
      'pointer-events': 'none',
    }),
  );
  s += tag(
    'lens',
    circle(cx, cy, r, T['plastic-grey'], edge(T, T['plastic-grey-edge'], T['stroke-detail'])) +
      circle(cx, cy, r, color, {
        'data-hook': props.hook || 'lens',
        'fill-opacity': on ? r2(T['opacity-lens-off'] + (1 - T['opacity-lens-off']) * L.lens) : T['opacity-lens-off'],
      }) +
      (L.level
        ? circle(cx, cy, r, T['plastic-black'], { 'fill-opacity': r2(L.shade) }) +
          circle(cx, cy, r2(r * (0.35 + 0.6 * L.hot)), sheen('hot'), { 'fill-opacity': r2(0.4 + 0.6 * L.hot) })
        : '') +
      circle(cx, cy, r, sheen('lens'), { 'fill-opacity': on ? 0.9 : 0.7 }),
  );
  return s;
}

/** How brightly an indicator shows for its `on`: true is full, a number from 0 to 1 dims its glow (a board LED lit by PWM), anything else is off. */
export function lit(on) {
  return typeof on === 'number' ? (on > 0 ? Math.min(1, on) : 0) : on ? 1 : 0;
}

/**
 * How a light source is drawn at a level from 0 to 1 (as bright as it looks:
 * the host maps current or duty to it). The steps are exaggerated, so levels
 * a sketch tells apart (a fade, a PWM duty) read apart on the bench too: the
 * lit colour runs from deep and shaded, barely lit, through the plain lens
 * colour to a white-hot dome at full, while the halo grows from a thin rim
 * to the widest the drawing holds. Each value is 0 to 1, and 0 when off.
 * - lens: how far the lens colour has come from its unlit tint
 * - shade: how much darker than the lens colour a dim light is drawn
 * - core: the coloured light around the die
 * - hot: the white-hot centre, from a point on the die to most of the lens
 * - bloom: the white that floods the whole lens, from about a third up
 * - halo: the halo's strength; spread: its size, from just past the lens to the largest
 * - wash: how far the light drowns the lead frame and the die
 */
export function shine(level) {
  const b = level > 0 ? Math.min(1, level) : 0;
  if (!b) return { level: 0, lens: 0, shade: 0, core: 0, hot: 0, bloom: 0, halo: 0, spread: 0, wash: 0 };
  // t runs mostly in the level's logarithm, so each halving of the level is about the same step (as the eye takes light).
  // The dim end's cues (the shade lifting, the core and halo strengthening) move fastest at the bottom of t, the bright
  // end's (the halo's size, the white bloom) at the top, so neighbouring levels read apart all the way up.
  const t = Math.max(0.04, 0.75 * (1 + Math.log(b) / Math.log(50)) + 0.25 * b);
  const rise = Math.sqrt(t);
  const above = from => Math.max(0, Math.min(1, (t - from) / (1 - from)));
  return {
    level: b,
    lens: rise,
    shade: 0.75 * (1 - t) * (1 - t),
    core: 0.35 + 0.65 * rise,
    hot: rise,
    bloom: above(0.6),
    halo: 0.3 + 0.7 * rise,
    spread: t,
    wash: rise,
  };
}

/** A small SMD indicator on a board: a rounded square, off or lit in a lens colour (on: true, or a level from 0 to 1 for the glow). hook names it for state. */
export function indicator(props) {
  const T = tokens();
  const f = finish(T, props.finish);
  const w = props.size || 1.6 * T.pitch;
  const color = lensColor(T, props.color);
  const level = lit(props.on);
  const L = shine(level);
  let s = '';
  if (level)
    s += tag(
      'glow',
      circle(props.x + w / 2, props.y + w / 2, r2(w * (0.75 + 0.75 * L.spread)), sheen('halo', color), {
        'fill-opacity': r2(L.halo),
        'pointer-events': 'none',
      }),
    );
  // Lit, the chip is shaded when dim and burns white from the middle as it brightens (shine).
  const glowing = level
    ? rect(props.x, props.y, w, w, T['plastic-black'], { rx: 1.2, 'fill-opacity': r2(L.shade) }) +
      rect(props.x, props.y, w, w, sheen('hot'), { rx: 1.2, 'fill-opacity': r2(0.3 + 0.7 * L.hot) })
    : '';
  s += tag(
    'indicator',
    rect(
      props.x,
      props.y,
      w,
      w,
      level ? color : f.indicatorOff,
      Object.assign(
        {
          'data-hook': props.hook,
          rx: 1.2,
          'data-on-fill': color,
          'data-off-fill': f.indicatorOff,
          'data-lit-state': props.state,
          'data-lit': level ? 'true' : 'false',
        },
        edge(T, f.edge, T['stroke-detail']),
      ),
    ) + glowing,
  );
  if (props.label) s += text(props.x + w / 2, props.y + w + 4.2, props.label, PIN_LABEL, f.silk);
  return s;
}
