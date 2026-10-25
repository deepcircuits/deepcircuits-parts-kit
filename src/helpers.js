/** Helpers that take an Artwork and return a new one: turned, mirrored, with unique ids, or as an image source. */
import { FALLBACK } from './tokens.js';

const round = v => Math.round(v * 100) / 100;

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
      ? { ...p, x: round(h - p.y), y: round(p.x) }
      : t === 2
        ? { ...p, x: round(w - p.x), y: round(h - p.y) }
        : { ...p, x: round(p.y), y: round(w - p.x) };
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
    pins: art.pins.map(p => (across ? { ...p, x: round(w - p.x) } : { ...p, y: round(h - p.y) })),
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
