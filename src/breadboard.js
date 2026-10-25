/** Breadboards: full, half and mini. */
import { PIN_LABEL, art, bevel, circle, edge, path, r2, rect, tag, text, tokens } from './core.js';
import { BREADBOARD_COLORS, BREADBOARD_PAINT, breadboardColor } from './breadboardColors.js';

export { BREADBOARD_COLORS, breadboardColor };
/** A colour's paint: body, edge, hole and print. */
export function breadboardPaint(value, T) {
  const k = breadboardColor(value);
  if (k !== 'white') return BREADBOARD_PAINT[k];
  T = T || tokens();
  return { body: T['bread-body'], edge: T['bread-edge'], hole: T['bread-hole'], print: T['bread-print'] };
}

/**
 * The solderless breadboard on the grid: variant 'breadboard' (63 columns
 * with power rails), 'breadboard-half' (30 columns with rails) or
 * 'breadboard-mini' (17 columns, strips only). Rows a to e and f to j are
 * one pitch apart, e and f three pitches apart across the channel, the
 * rails three pitches outside them with their holes in groups of five. Row
 * letters and column numbers print as on the real board. The mini's body is
 * the real 46 x 34.5 mm, centred in its box. `color` picks the
 * body (BREADBOARD_COLORS), `splitRails` breaks the full board's rail
 * stripes between holes 25 and 26, as on boards whose rails are cut in
 * half, and `occupied` rings the holes in use, given as their centres
 * ({ x, y }). No pins: the editor's layout module names the holes. The
 * holes of a block are one path, so a full board stays small.
 */
export function breadboard(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const v = props.variant || 'breadboard';
  const L = { breadboard: [63, 50, 3], 'breadboard-half': [30, 25, 2], 'breadboard-mini': [17, 0, 0] }[v] || [
    63, 50, 3,
  ];
  const cols = L[0];
  const railHoles = L[1];
  const railStart = L[2];
  const rails = railHoles > 0;
  const a = rails ? 5 : 2.5;
  const rowY = {};
  const letters = 'abcdefghij';
  let s = '';
  const c = breadboardPaint(props.color, T);
  const font = { 'font-family': 'ui-sans-serif,sans-serif' };
  for (let i = 0; i < 10; i++) rowY[letters[i]] = (a + i + (i >= 5 ? 2 : 0)) * p;
  const bottom = rails ? rowY.j + 4 * p + p : rowY.j + 2.5 * p;
  const w = (cols - 1) * p + 4 * p;
  const h = bottom;
  const colX = function (k) {
    return 2 * p + (k - 1) * p;
  };
  // The body fills the box, except on the mini: its real body, 46 x 34.5 mm, is smaller than the box, so it is drawn at that size centred on the holes and the box and hole grid stay the layout module's.
  const mm = p / 2.54;
  const bw = rails ? w - 2 * T['board-inset'] : 46 * mm;
  const bh = rails ? h - 2 * T['board-inset'] : 34.5 * mm;
  const bx = (w - bw) / 2;
  const by = (h - bh) / 2;
  s += tag('body', rect(bx, by, bw, bh, c.body, Object.assign({ rx: 3 }, edge(T, c.edge))));
  s += bevel(T, bx, by, bw, bh, 2.6, 3);
  // Holes: a 3px square on each centre, the centres of a block drawn as one path.
  const holes = function (centres) {
    return path(
      centres
        .map(q => {
          return `M${r2(q[0] - 1.5)} ${r2(q[1] - 1.5)}h3v3h-3z`;
        })
        .join(''),
      c.hole,
    );
  };
  const strip = function (first) {
    const q = [];
    for (let k = 1; k <= cols; k++) for (let r = 0; r < 5; r++) q.push([colX(k), rowY[letters[first + r]]]);
    return holes(q);
  };
  // The strips in two blocks, the channel between them.
  s += rect(
    bx + 0.6 * p - T['board-inset'],
    rowY.e + 0.85 * p,
    bw - 1.2 * p + 2 * T['board-inset'],
    1.3 * p,
    '#000000',
    { rx: 2, 'fill-opacity': 0.12 },
  );
  s += strip(0) + strip(5);
  const letterX = rails ? 0.9 * p : bx + 1.2 * mm;
  for (let i = 0; i < 10; i++) {
    const y = rowY[letters[i]] + 1.4;
    s +=
      text(letterX, y, letters[i], PIN_LABEL, c.print, font) +
      text(w - letterX, y, letters[i], PIN_LABEL, c.print, font);
  }
  for (let k = 1; k <= cols; k++)
    if (k === 1 || k % 5 === 0)
      s +=
        text(colX(k), rowY.a - 0.55 * p, String(k), PIN_LABEL, c.print, font) +
        text(colX(k), rowY.j + 0.85 * p, String(k), PIN_LABEL, c.print, font);
  if (rails) {
    const railRows = { tp: p, tn: 2 * p, bp: rowY.j + 3 * p, bn: rowY.j + 4 * p };
    const railX = function (n) {
      return colX(railStart + n - 1 + Math.floor((n - 1) / 5));
    };
    const x0 = railX(1);
    const x1 = railX(railHoles);
    const split = !!props.splitRails && v === 'breadboard';
    const spans = split
      ? [
          [x0 - 0.6 * p, railX(25) + 0.3 * p],
          [railX(26) - 0.3 * p, x1 + 0.6 * p],
        ]
      : [[x0 - 0.6 * p, x1 + 0.6 * p]];
    const q = [];
    Object.keys(railRows).forEach(r => {
      const y = railRows[r];
      const plus = r === 'tp' || r === 'bp';
      const lineY = plus ? y - 0.55 * p : y + 0.55 * p;
      const ink = plus ? T['rail-plus'] : T['rail-minus'];
      spans.forEach(sp => {
        s += rect(sp[0], lineY - 0.6, sp[1] - sp[0], 1.2, ink, { rx: 0.6, 'fill-opacity': 0.9 });
      });
      s +=
        text(x0 - 1.2 * p, lineY + 1.5, plus ? '+' : '-', 5, ink, { 'font-weight': 700 }) +
        text(x1 + 1.2 * p, lineY + 1.5, plus ? '+' : '-', 5, ink, { 'font-weight': 700 });
      for (let n = 1; n <= railHoles; n++) q.push([railX(n), y]);
    });
    s += holes(q);
  }
  const rings = (props.occupied || [])
    .map(at => {
      return circle(at.x, at.y, 3.1, 'none', { stroke: T['mark-focus'], 'stroke-width': 1.2 });
    })
    .join('');
  if (rings) s += tag('occupied', rings);
  return art(
    w,
    h,
    { breadboard: 'Full breadboard', 'breadboard-half': 'Half breadboard', 'breadboard-mini': 'Mini breadboard' }[v],
    s,
    [],
  );
}
