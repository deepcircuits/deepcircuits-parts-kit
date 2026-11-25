/** Helpers that take an Artwork and return a new one: turned, mirrored, with unique ids, or as an image source. */
import { r2 } from './core.js';
import { FALLBACK } from './tokens.js';

function parts(art) {
  const open = /^<svg\b[^>]*>/.exec(art.svg);
  const close = art.svg.lastIndexOf('</svg>');
  if (!open || close < 0) throw new Error('The drawing has no svg root.');
  return { open: open[0], inner: art.svg.slice(open[0].length, close) };
}
const sized = (open, w, h) =>
  open
    .replace(/\swidth="[^"]*"/, ` width="${w}"`)
    .replace(/\sheight="[^"]*"/, ` height="${h}"`)
    .replace(/\sviewBox="[^"]*"/, ` viewBox="0 0 ${w} ${h}"`);

/**
 * The drawing turned by quarter turns, its pins with it: 1 a quarter clockwise (the top edge to the right), -1 or 3 a
 * quarter anticlockwise (the top edge to the left), 2 a half. The box swaps its width and height on a quarter turn.
 */
export function rotateArtwork(art, quarterTurns) {
  const t = ((Math.round(Number(quarterTurns) || 0) % 4) + 4) % 4;
  if (!t) return { ...art, pins: art.pins.slice() };
  const { width: w, height: h } = art;
  const { open, inner } = parts(art);
  const [W, H] = t === 2 ? [w, h] : [h, w];
  const transform =
    t === 1
      ? `translate(${h} 0) rotate(90)`
      : t === 2
        ? `translate(${w} ${h}) rotate(180)`
        : `translate(0 ${w}) rotate(-90)`;
  const turn = p =>
    t === 1
      ? { ...p, x: r2(h - p.y), y: r2(p.x) }
      : t === 2
        ? { ...p, x: r2(w - p.x), y: r2(h - p.y) }
        : { ...p, x: r2(p.y), y: r2(w - p.x) };
  return {
    width: W,
    height: H,
    svg: `${sized(open, W, H)}<g transform="${transform}">${inner}</g></svg>`,
    pins: art.pins.map(turn),
  };
}

/** The drawing mirrored, its pins with it: 'horizontal' swaps left and right, 'vertical' top and bottom. Its print reads mirrored, as a part seen from behind. */
export function flipArtwork(art, axis) {
  if (axis !== 'horizontal' && axis !== 'vertical') throw new Error("flipArtwork takes 'horizontal' or 'vertical'.");
  const { width: w, height: h } = art;
  const { open, inner } = parts(art);
  const across = axis === 'horizontal';
  const transform = across ? `translate(${w} 0) scale(-1 1)` : `translate(0 ${h}) scale(1 -1)`;
  return {
    width: w,
    height: h,
    svg: `${open}<g transform="${transform}">${inner}</g></svg>`,
    pins: art.pins.map(p => (across ? { ...p, x: r2(w - p.x) } : { ...p, y: r2(h - p.y) })),
  };
}

/** The drawing with every id (its gradients) and every reference to one prefixed, so copies on one page stay apart in any host. */
export function scopeIds(art, prefix) {
  const pre = String(prefix);
  return {
    ...art,
    svg: art.svg
      .replace(/\sid="([^"]+)"/g, ` id="${pre}$1"`)
      .replace(/url\(#([^)]+)\)/g, `url(#${pre}$1)`)
      .replace(/href="#([^"]+)"/g, `href="#${pre}$1"`),
  };
}

/**
 * The drawing as an image source (a data: URL), for an <img>, a canvas or a CSS background. `ink` is the colour of what
 * stands on the canvas (a chip's pin names, a symbol's lines), the dark canvas ink by default. An image cannot read the
 * page's custom properties, so a drawing made in 'vars' mode shows its light values.
 */
export function toDataUrl(art, props) {
  const ink = (props && props.ink) || FALLBACK['canvas-ink'];
  const { open } = parts(art);
  const root = /\scolor="[^"]*"/.test(open)
    ? open.replace(/\scolor="[^"]*"/, ` color="${ink}"`)
    : open.replace('<svg', `<svg color="${ink}"`);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(root + art.svg.slice(open.length))}`;
}

const svgOf = art => (typeof art === 'string' ? art : art.svg);
const escapeRegex = text => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const attrOf = (tag, name) => {
  const match = new RegExp(`\\s${name}="([^"]*)"`).exec(tag);
  return match ? match[1] : undefined;
};
const numOf = (tag, name) => Number(attrOf(tag, name) ?? NaN);

/**
 * The rectangle a drawing marks with `data-hook="<hook>"` (a screen's `display`, a character LCD's `glass`, an RFID
 * module's `field`, a matrix face `face-0`), in artwork pixels, or undefined when absent.
 */
export function hookRect(art, hook) {
  const tag = new RegExp(`<rect\\b[^>]*\\sdata-hook="${escapeRegex(hook)}"[^>]*>`).exec(svgOf(art))?.[0];
  if (!tag) return undefined;
  const x = numOf(tag, 'x');
  const y = numOf(tag, 'y');
  const width = numOf(tag, 'width');
  const height = numOf(tag, 'height');
  return [x, y, width, height].every(Number.isFinite) ? { x, y, width, height } : undefined;
}

/**
 * A character LCD's glass box and 5×8 dot-matrix lattice, for laying a `<canvas>` over `glass`. `x` and `y` are the
 * first cell's top-left dot in artwork pixels from `glass`'s top-left corner. Undefined for other parts.
 */
export function lcdLattice(art) {
  const glass = hookRect(art, 'glass');
  const tag = /<g\b[^>]*\sdata-hook="matrix"[^>]*>/.exec(svgOf(art))?.[0];
  if (!glass || !tag) return undefined;
  const cols = numOf(tag, 'data-cols');
  const rows = numOf(tag, 'data-rows');
  const rawX = numOf(tag, 'data-x');
  const rawY = numOf(tag, 'data-y');
  const cellDx = numOf(tag, 'data-cell-dx');
  const cellDy = numOf(tag, 'data-cell-dy');
  const dotDx = numOf(tag, 'data-dot-dx');
  const dotDy = numOf(tag, 'data-dot-dy');
  const dotW = numOf(tag, 'data-dot-w');
  const dotH = numOf(tag, 'data-dot-h');
  const values = [cols, rows, rawX, rawY, cellDx, cellDy, dotDx, dotDy, dotW, dotH];
  if (!values.every(Number.isFinite)) return undefined;
  return {
    glass,
    cols,
    rows,
    x: r2(rawX - glass.x),
    y: r2(rawY - glass.y),
    cellDx,
    cellDy,
    dotDx,
    dotDy,
    dotW,
    dotH,
  };
}

/**
 * A MAX7219 matrix (or chain) layout, for painting lit LEDs on a `<canvas>` over `box`: the combined box over every
 * face in artwork pixels, each face's rectangle sorted left to right (display order), each face's 64 LED centres
 * (row by row, left to right) relative to `box`, and the LED radius. Undefined for other parts.
 */
export function matrixLayout(art) {
  const markup = svgOf(art);
  const faces = [];
  for (const match of markup.matchAll(/<rect\b[^>]*\sdata-hook="face-(\d+)"[^>]*>/g)) {
    const face = Number(match[1]);
    const rect = hookRect(markup, `face-${face}`);
    if (rect) faces.push({ face, ...rect });
  }
  if (!faces.length) return undefined;
  const x0 = Math.min(...faces.map(f => f.x));
  const y0 = Math.min(...faces.map(f => f.y));
  const box = {
    x: x0,
    y: y0,
    width: r2(Math.max(...faces.map(f => f.x + f.width)) - x0),
    height: r2(Math.max(...faces.map(f => f.y + f.height)) - y0),
  };
  const byFace = new Map();
  let ledRadius = 0;
  for (const [tag] of markup.matchAll(/<circle\b[^>]*\sdata-led="\d+-\d+-\d+"[^>]*>/g)) {
    const [face, row, column] = attrOf(tag, 'data-led').split('-').map(Number);
    const cx = numOf(tag, 'cx');
    const cy = numOf(tag, 'cy');
    const r = numOf(tag, 'r');
    if (![face, row, column, cx, cy, r].every(Number.isFinite)) continue;
    ledRadius = r;
    let list = byFace.get(face);
    if (!list) byFace.set(face, (list = []));
    list.push({ row, column, x: r2(cx - x0), y: r2(cy - y0) });
  }
  const ordered = faces.slice().sort((a, b) => a.x - b.x);
  if (ordered.some(f => !byFace.has(f.face))) return undefined;
  const leds = ordered.map(f =>
    byFace
      .get(f.face)
      .sort((a, b) => a.row - b.row || a.column - b.column)
      .map(({ x, y }) => ({ x, y })),
  );
  return { box, faces: ordered, leds, ledRadius };
}
