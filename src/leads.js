/** Test leads: the plug seated in a meter's jack, the cable and the probe, drawn from above. */
import { circle, edge, el, line, path, r2, rect, tag, tokens } from './core.js';

const PAINT = { black: ['plastic-black', 'plastic-black-edge'], red: ['plastic-red', 'plastic-red-edge'] };
const colorOf = c => (c === 'red' ? 'red' : 'black');
const paint = (T, c) => PAINT[colorOf(c)].map(k => T[k]);
const finite = (v, fb) => (v !== null && v !== '' && Number.isFinite(Number(v)) ? Number(v) : fb);
const pt = q => ({ x: finite(q && q.x, 0), y: finite(q && q.y, 0) });
const dir = deg => ({ x: Math.cos((deg * Math.PI) / 180), y: Math.sin((deg * Math.PI) / 180) });
const unit = (dx, dy) => {
  const l = Math.hypot(dx, dy);
  return l > 1e-6 && Number.isFinite(l) ? { x: dx / l, y: dy / l } : null;
};
// The probe along its axis, in pitches from the metal point (0) back to the tail (negative x).
const NEEDLE = 1.6;
const GUARD = 1.95;
const HANDLE = 6.9;
const TAIL = 8;

/** A crescent of light or shade inside a round part: an arc of radius r from angle a0 to a1, and a flatter one back. */
function crescent(x, y, r, a0, a1, fill, opacity) {
  const at = a => `${r2(x + r * Math.cos((a * Math.PI) / 180))} ${r2(y + r * Math.sin((a * Math.PI) / 180))}`;
  const back = r2(1.4 * r);
  return path(`M${at(a0)}A${r2(r)} ${r2(r)} 0 0 1 ${at(a1)}A${back} ${back} 0 0 0 ${at(a0)}Z`, fill, {
    'fill-opacity': opacity,
  });
}

/**
 * A lead's plug seated in a jack, seen end on from above: the round shroud over the socket, its grip ring, the light
 * along its top left and the shade along its bottom right, and the strain relief in the middle where the cable leaves
 * toward the viewer. Every piece sits inside the shroud's circle.
 */
export function meterPlug(T, x, y, color, jack) {
  const p = T.pitch;
  const [fill, rim] = paint(T, color);
  return tag(
    'plug',
    circle(x, y, 1.5 * p, fill, edge(T, rim)) +
      circle(x, y, 1.05 * p, 'none', { stroke: rim, 'stroke-width': T['stroke-detail'] }) +
      crescent(x, y, 1.3 * p, 145, 305, '#ffffff', T['opacity-light']) +
      crescent(x, y, 1.3 * p, 325, 485, '#000000', T['opacity-shade']) +
      circle(x, y, 0.55 * p, fill, edge(T, rim, T['stroke-detail'])),
    { 'data-lead': colorOf(color), 'data-jack': jack, 'data-hook': `plug-${colorOf(color)}` },
  );
}

/**
 * A test probe in profile, its metal point at (x, y) and its body behind it, turned `angle` degrees clockwise from
 * pointing right (90 points down). `pose` 'touch' (the default) rings the point where it touches; 'rest' lies on the
 * bench. Returns the drawing, the point, the tail where the cable joins, the handle's outline as path data (guard to
 * tail, the needle left out so whatever it touches stays reachable) and the box it covers.
 */
export function probeTip(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const color = colorOf(props.color);
  const [fill, rim] = paint(T, color);
  const x = finite(props.x, 0);
  const y = finite(props.y, 0);
  const angle = finite(props.angle, 90);
  const pose = props.pose === 'rest' ? 'rest' : 'touch';
  const P = v => r2(v * p);
  let inner = '';
  // The needle, tapering to its point.
  inner += path(
    `M0 0L${P(-0.5)} ${P(-0.13)}L${P(-NEEDLE)} ${P(-0.17)}V${P(0.17)}L${P(-0.5)} ${P(0.13)}Z`,
    T.metal,
    edge(T, T['metal-edge'], T['stroke-fine']),
  );
  // The finger guard, then the handle tapering back to the boot.
  inner += rect(-GUARD * p, -0.65 * p, (GUARD - NEEDLE) * p, 1.3 * p, fill, { rx: 0.12 * p, ...edge(T, rim) });
  inner += path(
    `M${P(-GUARD)} ${P(-0.42)}L${P(-HANDLE)} ${P(-0.36)}V${P(0.36)}L${P(-GUARD)} ${P(0.42)}Z`,
    fill,
    edge(T, rim),
  );
  for (let k = 0; k < 4; k++) {
    const gx = -(3 + 0.35 * k) * p;
    inner += line(gx, -0.38 * p, gx, 0.38 * p, rim, T['stroke-detail']);
  }
  inner += rect(-6.7 * p, -0.33 * p, 4.5 * p, 0.15 * p, '#ffffff', {
    rx: 0.07 * p,
    'fill-opacity': T['opacity-light'],
  });
  inner += rect(-6.7 * p, 0.18 * p, 4.5 * p, 0.15 * p, '#000000', {
    rx: 0.07 * p,
    'fill-opacity': T['opacity-shade'],
  });
  inner += path(
    `M${P(-HANDLE)} ${P(-0.36)}L${P(-TAIL)} ${P(-0.17)}V${P(0.17)}L${P(-HANDLE)} ${P(0.36)}Z`,
    fill,
    edge(T, rim, T['stroke-detail']),
  );
  if (pose === 'touch') inner += circle(0, 0, 0.3 * p, 'none', { stroke: T.metal, 'stroke-width': T['stroke-detail'] });
  const svg = el(
    'g',
    {
      'data-hook': 'probe-tip',
      'data-lead': color,
      'data-pose': pose,
      transform: `translate(${r2(x)} ${r2(y)}) rotate(${r2(angle)})`,
    },
    inner,
  );
  const c = Math.cos((angle * Math.PI) / 180);
  const s = Math.sin((angle * Math.PI) / 180);
  const toWorld = (lx, ly) => ({ x: r2(x + lx * c - ly * s), y: r2(y + lx * s + ly * c) });
  const tail = toWorld(-TAIL * p, 0);
  const half = [
    [-NEEDLE, 0.65],
    [-GUARD, 0.65],
    [-GUARD, 0.42],
    [-HANDLE, 0.36],
    [-TAIL, 0.17],
  ];
  const outline = [
    ...half.map(([a, b]) => toWorld(a * p, -b * p)),
    ...[...half].reverse().map(([a, b]) => toWorld(a * p, b * p)),
  ];
  const hit = `M${outline.map(q => `${q.x} ${q.y}`).join('L')}Z`;
  const point = { x: r2(x), y: r2(y) };
  const xs = [point.x, ...outline.map(q => q.x)];
  const ys = [point.y, ...outline.map(q => q.y)];
  const box = {
    x0: r2(Math.min(...xs) - 1),
    y0: r2(Math.min(...ys) - 1),
    x1: r2(Math.max(...xs) + 1),
    y1: r2(Math.max(...ys) + 1),
  };
  return { svg, point, tail, hit, box };
}

/**
 * A test lead's cable from `from` (its plug) to `to` (the probe's tail), through any `via` points: a chain of curves
 * that leaves `from` along `leave` (degrees, 90 down by default) and enters `to` along `arrive` (its last stretch by
 * default). A cable with no via points sags a little. Returns the drawing, the middle of its stroke as path data and its box.
 */
export function leadCable(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const color = colorOf(props.color);
  const [fill, rim] = paint(T, color);
  const via = Array.isArray(props.via) ? props.via : [];
  const pts = [props.from, ...via, props.to].map(pt);
  const n = pts.length - 1;
  const last = unit(pts[n].x - pts[n - 1].x, pts[n].y - pts[n - 1].y);
  const tan = pts.map((q, i) => {
    if (i === 0) return dir(finite(props.leave, 90));
    if (i === n) return props.arrive === undefined ? last || dir(90) : dir(finite(props.arrive, 90));
    return unit(pts[i + 1].x - pts[i - 1].x, pts[i + 1].y - pts[i - 1].y) || dir(90);
  });
  let d = `M${r2(pts[0].x)} ${r2(pts[0].y)}`;
  const hull = [pts[0]];
  for (let i = 0; i < n; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const L = Math.hypot(b.x - a.x, b.y - a.y);
    const h = Math.min(8 * p, 0.4 * L);
    // A lone stretch sags; a chain through via points stays smooth at its joins.
    const sag = n === 1 ? Math.min(5 * p, 0.12 * L) : 0;
    const c1 = { x: a.x + tan[i].x * h, y: a.y + tan[i].y * h + sag };
    const c2 = { x: b.x - tan[i + 1].x * h, y: b.y - tan[i + 1].y * h + sag };
    d += `C${r2(c1.x)} ${r2(c1.y)} ${r2(c2.x)} ${r2(c2.y)} ${r2(b.x)} ${r2(b.y)}`;
    hull.push(c1, c2, b);
  }
  const stroke = (color_, width, more) =>
    path(d, 'none', {
      stroke: color_,
      'stroke-width': width,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      ...more,
    });
  const svg = el(
    'g',
    { 'data-hook': 'lead-cable', 'data-lead': color },
    stroke(rim, 3.8) + stroke(fill, 2.8) + stroke('#ffffff', 0.8, { 'stroke-opacity': T['opacity-light'] }),
  );
  const box = {
    x0: r2(Math.min(...hull.map(q => q.x)) - 2),
    y0: r2(Math.min(...hull.map(q => q.y)) - 2),
    x1: r2(Math.max(...hull.map(q => q.x)) + 2),
    y1: r2(Math.max(...hull.map(q => q.y)) + 2),
  };
  return { svg, d, box };
}

/**
 * A whole test lead: the cable from its plug at `plug`, through any `via` points, to a probe whose metal point is at
 * `tip`. The probe points along `tip.angle`, or else away from the cable's last point (the last via point, or the
 * plug), so its handle lies back toward the cable. The cable is drawn under the probe; a host that draws two leads
 * can draw both cables first from `cable.svg`, then both probes from `probe.svg`.
 */
export function testLead(props) {
  props = props || {};
  const color = colorOf(props.color);
  const via = Array.isArray(props.via) ? props.via.map(pt) : [];
  const plug = pt(props.plug);
  const from = via.length ? via[via.length - 1] : plug;
  const t = pt(props.tip);
  const given = props.tip ? finite(props.tip.angle, null) : null;
  const angle =
    given !== null
      ? given
      : Math.hypot(t.x - from.x, t.y - from.y) > 0.01
        ? (Math.atan2(t.y - from.y, t.x - from.x) * 180) / Math.PI
        : 90;
  const probe = probeTip({ color, x: t.x, y: t.y, angle, pose: props.pose });
  const cable = leadCable({ color, from: plug, via, to: probe.tail, leave: props.leave, arrive: angle });
  return { svg: cable.svg + probe.svg, angle: r2(angle), cable, probe };
}
