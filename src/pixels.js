/** Addressable LEDs and LED arrays: pixel colour, the 5050 package, NeoPixel, ring, matrix, strip, meter and bar graph. */
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
  lensColor,
  line,
  path,
  pin,
  r2,
  rect,
  sheen,
  shine,
  tag,
  text,
  tokens,
} from './core.js';
import { barePad } from './pieces.js';

/** A pixel's colour from r, g, b (0..1) or a CSS colour string; off when nothing drives it. */
function pixelColor(T, c) {
  if (typeof c === 'string' && c) return { fill: c, level: 1 };
  if (c && typeof c === 'object') {
    const ch = ['r', 'g', 'b'].map(k => {
      const v = Number(c[k]);
      return isNaN(v) ? 0 : Math.max(0, Math.min(1, v));
    });
    const level = Math.max(ch[0], ch[1], ch[2]);
    if (level > 0.02) {
      const hx = function (v) {
        const n = Math.round(v * 255).toString(16);
        return (n.length < 2 ? '0' : '') + n;
      };
      return { fill: `#${hx(ch[0] / level)}${hx(ch[1] / level)}${hx(ch[2] / level)}`, level };
    }
  }
  return { fill: T['indicator-off'], level: 0 };
}
/** One addressable pixel at x, y (its centre), `size` mm square (5 for the 5050, 3.5 for the 3535, 2 for the 2020): the white package, the three dies, and the lit colour over them. */
function pixelPackage(T, x, y, hook, c, size) {
  const mm = T.pitch / 2.54;
  const k = (size || 5) / 5;
  const h = 2.5 * mm * k;
  const pc = pixelColor(T, c);
  const L = shine(pc.level);
  let s = '';
  const die = function (dx, fill) {
    return rect(x + dx * k, y - 0.35 * mm * k, 0.6 * mm * k, 0.7 * mm * k, T[fill], { 'fill-opacity': 0.55 });
  };
  s += tag(
    'glow',
    circle(x, y, r2(mm * k * (2.2 + 2.2 * L.spread)), pc.fill, {
      'fill-opacity': r2(0.5 * L.halo),
      'pointer-events': 'none',
    }),
  );
  s += tag(
    'body',
    rect(
      x - h,
      y - h,
      2 * h,
      2 * h,
      T['plastic-white'],
      Object.assign({ rx: 0.4 * mm * k }, edge(T, T['plastic-white-edge'], T['stroke-fine'])),
    ) +
      circle(x, y, 1.6 * mm * k, T['plastic-white-edge'], { 'fill-opacity': 0.5 }) +
      die(-1.05 * mm, 'lens-red') +
      die(-0.3 * mm, 'lens-green') +
      die(0.45 * mm, 'lens-blue') +
      circle(x, y, 1.75 * mm * k, pc.fill, {
        'data-hook': hook,
        'data-level': r2(pc.level),
        'fill-opacity': pc.level > 0 ? r2(0.4 + 0.6 * L.lens) : 0,
      }) +
      lightOf(x, y, 1.75 * mm * k, L) +
      circle(x, y, 1.6 * mm * k, sheen('lens'), { 'fill-opacity': 0.6 }),
  );
  return s;
}
/** A lit pixel's shade (dim) and white-hot middle (bright) over its colour disc of radius r (shine). */
function lightOf(x, y, r, L) {
  if (!L.level) return '';
  const T = tokens();
  return (
    circle(x, y, r, T['plastic-black'], { 'fill-opacity': r2(0.8 * L.shade) }) +
    circle(x, y, r2(r * (0.4 + 0.6 * L.hot)), sheen('hot'), { 'fill-opacity': r2(L.hot * L.hot) })
  );
}
/** One 5050 addressable pixel at x, y (its centre). */
function pixel5050(T, x, y, hook, c) {
  return pixelPackage(T, x, y, hook, c, 5);
}

/** A single WS2812 pixel, the 5 mm package with its four pads on the grid: VDD and DIN along the top, DOUT and VSS along the bottom. r, g, b or color light it. */
export function neopixel(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const w = 3 * p;
  const h = 2 * p;
  let s = '';
  const pins = [
    { name: 'VDD', x: 0.5 * p, y: 0.5 * p },
    { name: 'DIN', x: 2.5 * p, y: 0.5 * p },
    { name: 'DOUT', x: 0.5 * p, y: 1.5 * p },
    { name: 'VSS', x: 2.5 * p, y: 1.5 * p },
  ];
  pins.forEach(pn => {
    s += tag('pin', rect(pn.x - 2.4, pn.y - 1.8, 4.8, 3.6, T.pad, { rx: 0.4 }));
  });
  s += pixel5050(T, 1.5 * p, 1.0 * p, 'pixel', props.color || props);
  s += path(`M${r2(0.5 * p - 2.4)} ${r2(0.5 * p - 1.8)}l3 3`, 'none', {
    stroke: T['plastic-black-edge'],
    'stroke-width': T['stroke-fine'],
  });
  return art(w, h, `NeoPixel${pixelColor(T, props.color || props).level ? ', lit' : ''}`, s, pins);
}

/** A ring of addressable pixels (16 by default, 1 to 1024) on a black board, four pads at the bottom (GND, VCC, DIN, DOUT). The 8, 12, 16 and 24 rings take their real diameters, others 2.75 mm a pixel (at least 18 mm, so the band keeps its width). colors lights pixels from the first, clockwise from the top. */
export function ledRing(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const f = finish(T, 'black');
  const n = Math.max(1, Math.min(1024, Math.floor(Number(props.pixels)) || 16));
  const colors = props.colors || [];
  const OD = { 8: 29.7, 12: 36.8, 16: 44.5, 24: 65.5 }[n] || Math.max(18, n * 2.75 + 0.5);
  const R = (OD / 2) * mm;
  const Ri = R - 6.4 * mm;
  const pitchR = R - 3.2 * mm;
  const w = Math.ceil((2 * R + 1.2 * p) / p) * p;
  const cx = w / 2;
  const cy = 0.6 * p + R;
  const h = cy + R + 2.2 * p;
  let s = '';
  const ring = `M${r2(cx - R)} ${r2(cy)}a${r2(R)} ${r2(R)} 0 1 0 ${r2(2 * R)} 0a${r2(R)} ${r2(R)} 0 1 0 ${r2(-2 * R)} 0zM${r2(cx - Ri)} ${r2(cy)}a${r2(Ri)} ${r2(Ri)} 0 1 0 ${r2(2 * Ri)} 0a${r2(Ri)} ${r2(Ri)} 0 1 0 ${r2(-2 * Ri)} 0z`;
  s += tag(
    'board',
    path(ring, f.board, { 'fill-rule': 'evenodd', stroke: f.edge, 'stroke-width': T['stroke-outline'] }),
  );
  s += tag(
    'board',
    rect(
      cx - 2.4 * p,
      cy + R - 1.2 * p,
      4.8 * p,
      1.2 * p + 1.6 * p,
      f.board,
      Object.assign({ rx: 1 }, edge(T, f.edge)),
    ),
  );
  // Each package follows the ring, as the photograph shows: the group turns about the pixel's own centre.
  for (let i = 0; i < n; i++) {
    const deg = -90 + (i * 360) / n;
    const a = (deg * Math.PI) / 180;
    const px = r2(cx + Math.cos(a) * pitchR);
    const py = r2(cy + Math.sin(a) * pitchR);
    s += el('g', { transform: `rotate(${r2(deg + 90)} ${px} ${py})` }, pixel5050(T, px, py, `px-${i + 1}`, colors[i]));
  }
  const hdr = header({
    x: cx - 1.5 * p,
    y: h - 0.6 * p,
    labels: props.pins || ['GND', 'VCC', 'DIN', 'DOUT'],
    kind: 'pad',
    side: 'above',
    silk: f.silk,
    size: PIN_LABEL,
    rotate: true,
  });
  s += hdr.svg;
  return art(w, h, `${n}-pixel LED ring`, s, hdr.pins);
}

/**
 * A WS2812 strip: the black flexible board with `pixels` packages in a row
 * (1 to 1024; pixelSize '5050' three pitches apart, '3535' two, '2020' one
 * and a half, each drawn at its package size; pixelShape 'square', or
 * 'round' or 'circle' for the 5 mm lens), the solder pads at both ends on
 * the grid (VDD, DIN, VSS in on the left; VDD.2, DOUT, VSS.2 out on the
 * right), the arrows that mark the data direction. colors lights the
 * pixels; each sits in a group with data-pixel and data-lit, its lens id
 * px-N with data-level.
 */
export const LED_STRIP_MAX_PIXELS = 1024;
const STRIP_SIZES = { 5050: { step: 3, size: 5 }, 3535: { step: 2, size: 3.5 }, 2020: { step: 1.5, size: 2 } };
export function ledStrip(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const n = Math.max(1, Math.min(LED_STRIP_MAX_PIXELS, Math.floor(Number(props.pixels) || 8)));
  const kind = STRIP_SIZES[props.pixelSize] || STRIP_SIZES['5050'];
  const step = kind.step * p;
  const k = kind.size / 5;
  const round = props.pixelShape === 'round' || props.pixelShape === 'circle';
  const w = Math.ceil((4.8 * p + n * step) / p) * p;
  const h = 4 * p;
  let s = '';
  const colors = props.colors || [];
  s += tag(
    'board',
    rect(
      T['board-inset'],
      T['board-inset'],
      w - 2 * T['board-inset'],
      h - 2 * T['board-inset'],
      T['plastic-black'],
      Object.assign({ rx: 1.5 }, edge(T, T['plastic-black-edge'])),
    ),
  );
  s += bevel(T, T['board-inset'], T['board-inset'], w - 2 * T['board-inset'], h - 2 * T['board-inset'], 1.6);
  const inNames = ['VDD', 'DIN', 'VSS'];
  const outNames = ['VDD', 'DOUT', 'VSS'];
  const pins = [];
  [0, 1, 2].forEach(i => {
    const y = (i + 1) * p;
    s +=
      tag('pad', rect(0, y - 0.3 * p, 0.9 * p, 0.6 * p, T.pad, { rx: 1 })) +
      text(1.1 * p, y + 1.4, inNames[i], PIN_LABEL, T.silk, { 'text-anchor': 'start' });
    s +=
      tag('pad', rect(w - 0.9 * p, y - 0.3 * p, 0.9 * p, 0.6 * p, T.pad, { rx: 1 })) +
      text(w - 1.1 * p, y + 1.4, outNames[i], PIN_LABEL, T.silk, { 'text-anchor': 'end' });
    pins.push({ name: inNames[i], x: 0, y });
  });
  for (let i = 0; i < n; i++) {
    const cx = (w - n * step) / 2 + (i + 0.5) * step;
    const cy = 2 * p;
    const c = colors[i] || null;
    const pc = pixelColor(T, c);
    const L = shine(pc.level);
    let g = '';
    if (round) {
      g += tag(
        'glow',
        circle(cx, cy, r2(mm * k * (2.4 + 2.2 * L.spread)), pc.fill, {
          'fill-opacity': r2(0.5 * L.halo),
          'pointer-events': 'none',
        }),
      );
      g += tag(
        'body',
        circle(cx, cy, 2.6 * mm * k, T['plastic-white'], edge(T, T['plastic-white-edge'], T['stroke-fine'])) +
          circle(cx, cy, 1.75 * mm * k, pc.fill, {
            'data-hook': `px-${i}`,
            'data-level': r2(pc.level),
            'fill-opacity': pc.level > 0 ? r2(0.4 + 0.6 * L.lens) : 0,
          }) +
          lightOf(cx, cy, 1.75 * mm * k, L),
      );
    } else g += pixelPackage(T, cx, cy, `px-${i}`, c, kind.size);
    s += el('g', { 'data-pixel': i, 'data-lit': pc.level > 0 ? 'true' : 'false' }, g);
    if (i < n - 1) {
      const xb = cx + step / 2;
      if (step >= 3 * p) {
        // The cut line between pixels and the pad pair either side of it, as the strip is made.
        s += path(`M${r2(xb)} ${r2(T['board-inset'] + 1)}V${r2(h - T['board-inset'] - 1)}`, 'none', {
          stroke: T.silk,
          'stroke-width': T['stroke-fine'],
          'stroke-opacity': 0.5,
          'stroke-dasharray': '1.2 1.2',
        });
        [1, 2, 3].forEach(q => {
          s += tag(
            'pad',
            rect(xb - 0.5 * p, q * p - 0.25 * p, 0.3 * p, 0.5 * p, T.pad, { rx: 0.6 }) +
              rect(xb + 0.2 * p, q * p - 0.25 * p, 0.3 * p, 0.5 * p, T.pad, { rx: 0.6 }),
          );
        });
      } else
        s += path(
          `M${r2(xb - 1.6 * k)} ${r2(cy - 1.4 * k)}l${r2(1.6 * k)} ${r2(1.4 * k)}l${r2(-1.6 * k)} ${r2(1.4 * k)}`,
          'none',
          { stroke: T.silk, 'stroke-width': 0.6, 'stroke-opacity': 0.6 },
        );
    }
  }
  pins.push({ name: 'VDD.2', x: w, y: p }, { name: 'DOUT', x: w, y: 2 * p }, { name: 'VSS.2', x: w, y: 3 * p });
  return art(w, h, `${n}-pixel WS2812 strip`, s, pins);
}

/** A current in milliamps as the meter prints it: whole above 10 mA, one decimal below. */
export function formatMilliamps(amps) {
  const ma = (Number(amps) || 0) * 1000;
  return `${ma >= 10 ? Math.round(ma) : Math.round(ma * 10) / 10} mA`;
}

/** The meter's three readout lines for a reading; idle (no status, or 'idle') asks for a connection. */
export function meterLines(props) {
  props = props || {};
  if (!props.status || props.status === 'idle') return ['-- FPS', 'Connect DIN to a WS2812 data line', ''];
  return [
    `${Number(props.fps) || 0} FPS · ${Number(props.pixels) || 0} px`,
    `${formatMilliamps(props.amps)} · ${(Number(props.watts) || 0).toFixed(2)} W`,
    `peak ${formatMilliamps(props.peakAmps)} of ${Number(props.limitAmps) || 0} A`,
  ];
}

/**
 * The NeoPixel meter: a small instrument with a dark readout and one DIN
 * lead on the left. A reading gives fps, pixels, amps, watts, peakAmps,
 * limitAmps and status ('idle', 'ok', 'near' or 'over'): the lines print the
 * frame rate and pixel count, the supply current and power, and the peak
 * against the limit; the lamp and the bar under the lines (the peak's share
 * of the limit) take the status colour. The readout group carries
 * data-status, data-fps, data-pixels and data-amps.
 */
export function neopixelMeter(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const w = 20 * p;
  const h = 7 * p;
  let s = '';
  const status = { ok: 1, near: 1, over: 1 }[props.status] ? props.status : 'idle';
  const lines = meterLines(props);
  const tone = status === 'idle' ? T['readout-dim'] : T[`status-${status}`];
  const limit = Number(props.limitAmps) || 0;
  const share = status === 'idle' || !(limit > 0) ? 0 : Math.max(0, Math.min(1, (Number(props.peakAmps) || 0) / limit));
  s += line(0, 2 * p, 1.4 * p, 2 * p, T['lead-edge'], 2.9) + line(0, 2 * p, 1.4 * p, 2 * p, T.lead, 1.9);
  s += tag(
    'body',
    rect(
      1.2 * p,
      0.5 * p,
      w - 1.7 * p,
      h - 1.0 * p,
      T['plastic-black'],
      Object.assign({ rx: 3 }, edge(T, T['plastic-black-edge'])),
    ),
  );
  s += rect(1.2 * p + 1.5, 0.5 * p + 1.5, w - 1.7 * p - 3, 2.2, '#ffffff', { rx: 1, 'fill-opacity': 0.08 });
  const rx = 2.2 * p;
  const ry = 1.2 * p;
  const rw = w - 4.4 * p;
  const rh = h - 2.4 * p;
  s += rect(rx, ry, rw, rh, T.readout, { rx: 2 });
  let g = circle(rx + rw - 0.6 * p, ry + 0.6 * p, 0.25 * p, tone, { 'data-lamp': status });
  g += text(rx + 0.6 * p, ry + 1.05 * p, lines[0], 5.2, T['readout-text'], {
    'text-anchor': 'start',
    'font-weight': 600,
  });
  g += text(
    rx + 0.6 * p,
    ry + 2.2 * p,
    lines[1],
    lines[2] ? 5.2 : PIN_LABEL,
    status === 'idle' ? T['readout-dim'] : T['readout-text'],
    { 'text-anchor': 'start' },
  );
  if (lines[2]) g += text(rx + 0.6 * p, ry + 3.3 * p, lines[2], PIN_LABEL, tone, { 'text-anchor': 'start' });
  s += el(
    'g',
    {
      'data-status': status,
      'data-fps': Number(props.fps) || 0,
      'data-pixels': Number(props.pixels) || 0,
      'data-amps': r2(Number(props.amps) || 0),
    },
    g,
  );
  s += rect(rx + 0.6 * p, ry + rh - 0.55 * p, rw - 1.2 * p, 0.2 * p, T['readout-text'], {
    rx: 1,
    'fill-opacity': 0.25,
  });
  s += rect(rx + 0.6 * p, ry + rh - 0.55 * p, r2((rw - 1.2 * p) * share), 0.2 * p, tone, { rx: 1 });
  s +=
    text(w - 1.6 * p, h - 0.75 * p, 'DIN', PIN_LABEL, T.silk, { 'text-anchor': 'end', 'fill-opacity': 0.8 }) +
    text(2.2 * p, h - 0.75 * p, 'PIXEL METER', PIN_LABEL, T.silk, { 'text-anchor': 'start', 'fill-opacity': 0.8 });
  return art(w, h, `NeoPixel meter: ${lines.filter(Boolean).join(', ')}`, s, [{ name: 'DIN', x: 0, y: 2 * p }]);
}

/**
 * The ten-segment LED bar graph from its photograph: the white DIP-20
 * package 25.4 x 10.2 mm with its dark face inset, ten pale bars at the
 * 2.54 mm pitch that light in the lens colour (hook bar-N, data-level), the
 * pin-1 mark at the anode corner, and the pins under the body in two rows
 * three pitches apart as the real 7.62 mm. values lights each bar from 0 to 1;
 * colors gives each bar its own lens colour (the multicolour packages), color
 * all of them. vertical stands the package on end, as a breadboard often
 * holds it: anodes down the left (A1 at the top), cathodes down the right.
 * x and y swap rather than turn, so the bench light stays at the top left.
 */
export function ledBarGraph(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const n = 10;
  const values = props.levels || [];
  const colors = props.colors || [];
  const colorOf = function (k) {
    return lensColor(T, colors[k] || props.color || 'red');
  };
  const w = 11 * p;
  const h = 5 * p;
  const cy = 2.5 * p;
  let s = '';
  const pins = [];
  for (let i = 0; i < n; i++) pins.push({ name: `A${i + 1}`, x: (i + 1) * p, y: 1.0 * p });
  for (let j = 0; j < n; j++) pins.push({ name: `K${j + 1}`, x: (j + 1) * p, y: 4.0 * p });
  const bx0 = 0.5 * p;
  const by0 = 0.8 * p;
  const bw = 10 * p;
  const bh = 3.4 * p;
  // The twenty leads, as the kit's DIP chips show them: a short two-tone stub out of each long edge, the handle where it meets the body.
  for (let q = 0; q < n; q++) {
    const lx = (q + 1) * p;
    [
      [0.45 * p, by0],
      [by0 + bh, 4.55 * p],
    ].forEach(seg => {
      s += tag(
        'leg',
        rect(lx - 1.45, seg[0], 2.9, seg[1] - seg[0], T['lead-edge'], { rx: 0.6 }) +
          rect(lx - 0.95, seg[0], 1.9, seg[1] - seg[0], T.lead, { rx: 0.5 }),
      );
    });
  }
  s += tag(
    'body',
    rect(bx0, by0, bw, bh, T['plastic-white'], Object.assign({ rx: 1 }, edge(T, T['plastic-white-edge']))),
  );
  s += bevel(T, bx0, by0, bw, bh, 1.6, 1);
  // The dark face window, inset 1.2 mm at the ends; the ten bars sit at the real 2.2 mm pitch inside it,
  // closer together than the pins, so the outer bars keep a margin from the window's ends.
  const mm = p / 2.54;
  const bp = 2.2 * mm;
  const bwid = 1.6 * mm;
  const bht = 2.0 * p;
  s += rect(bx0 + 1.2 * mm, by0 + 0.38 * p, bw - 2.4 * mm, bh - 0.76 * p, T['segment-face'], { rx: 0.8 });
  for (let k = 0; k < n; k++) {
    const lv = Math.max(0, Math.min(1, Number(values[k]) || 0));
    const L = shine(lv);
    const bx = w / 2 + (k - (n - 1) / 2) * bp;
    // A lit bar spills light into the face round it, shaded when dim, burning white down its middle as it brightens (shine).
    const spill = 0.4 * mm * L.spread;
    if (lv)
      s += tag(
        'glow',
        rect(bx - bwid / 2 - spill, cy - bht / 2 - spill, bwid + 2 * spill, bht + 2 * spill, colorOf(k), {
          rx: r2(1.0 + spill),
          'fill-opacity': r2(0.45 * L.halo),
          'pointer-events': 'none',
        }),
      );
    s += rect(bx - bwid / 2, cy - bht / 2, bwid, bht, T['indicator-off-light'], { rx: 1.0, 'fill-opacity': 0.75 });
    s += rect(bx - bwid / 2, cy - bht / 2, bwid, bht, colorOf(k), {
      'data-hook': `bar-${k + 1}`,
      'data-level': r2(lv),
      rx: 1.0,
      'fill-opacity': lv > 0 ? r2(0.4 + 0.6 * L.lens) : 0,
    });
    if (lv)
      s +=
        rect(bx - bwid / 2, cy - bht / 2, bwid, bht, T['plastic-black'], {
          rx: 1.0,
          'fill-opacity': r2(0.8 * L.shade),
        }) +
        rect(bx - bwid / 2, cy - bht / 2, bwid, bht, sheen('hot'), { rx: 1.0, 'fill-opacity': r2(0.3 + 0.7 * L.hot) });
  }
  // The pin-1 mark: a notch in the white rim at the anode end.
  s += rect(bx0 + 0.9 * mm, by0 + 0.08 * p, 0.3 * p, 0.3 * p, T['plastic-white-edge'], {
    rx: 0.4,
    'fill-opacity': 0.9,
  });
  if (props.vertical)
    return art(
      h,
      w,
      'LED bar graph',
      el('g', { transform: 'matrix(0 1 1 0 0 0)' }, s),
      pins.map(q => {
        return { name: q.name, x: q.y, y: q.x };
      }),
    );
  return art(w, h, 'LED bar graph', s, pins);
}

/**
 * A matrix of addressable pixels from its photograph (the 8 x 8 at 71 mm
 * square): the real 8.9 mm pitch on a black board, a decoupling capacitor
 * beside every pixel, the input pads (GND, VCC, DIN) in the first row gap
 * at the left edge, the output (DOUT with its bare power pads) in the last
 * row gap at the right edge, and six mounting holes in the row gaps on
 * boards six pixels or more each way. rows and cols run from 1 to 1024; a
 * single row has both sets of pads along its bottom edge. colors lights
 * pixels row by row from the top left.
 */
export function neopixelMatrix(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const f = finish(T, 'black');
  const rows = Math.max(1, Math.min(1024, Math.floor(Number(props.rows)) || 8));
  const cols = Math.max(1, Math.min(1024, Math.floor(Number(props.cols)) || 8));
  const colors = props.colors || [];
  const pitch = 3.5 * p;
  const w = cols * pitch;
  const h = rows * pitch;
  const x0 = pitch / 2;
  const y0 = pitch / 2;
  let s = '';
  const names = props.pins || ['GND', 'VCC', 'DIN', 'DOUT'];
  s += board({
    width: w,
    height: h,
    finish: 'black',
    holes: false,
    mark: { x: w / 2 + 1.2 * p, y: y0 + Math.max(0, rows - 2) * pitch + pitch / 2 - 0.35 * p, size: 0.7 * p },
  });
  const gapTop = rows > 1 ? y0 + pitch / 2 : h;
  const gapBottom = rows > 1 ? y0 + (rows - 1.5) * pitch : h;
  if (rows >= 6 && cols >= 6)
    [
      [cols / 2 - 1.5, 0.5],
      [cols / 2 + 1.5, 0.5],
      [cols / 2 - 1.5, rows / 2 - 0.5],
      [cols / 2 + 1.5, rows / 2 - 0.5],
      [cols / 2 - 1.5, rows - 1.5],
      [cols / 2 + 1.5, rows - 1.5],
    ].forEach(c => {
      s += hole(T, x0 + c[0] * pitch, y0 + c[1] * pitch, T['mount-hole-radius']);
    });
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const cx = x0 + c * pitch;
      const cy = y0 + r * pitch;
      s += pixel5050(T, cx, cy, `px-${r * cols + c + 1}`, colors[r * cols + c]);
      s += tag(
        'smd',
        rect(cx + 1.2 * p, cy - 0.22 * p, 0.28 * p, 0.44 * p, T['cap-ceramic'], { rx: 0.3 }) +
          rect(cx + 1.2 * p, cy - 0.22 * p, 0.28 * p, 0.09 * p, T.lead) +
          rect(cx + 1.2 * p, cy + 0.13 * p, 0.28 * p, 0.09 * p, T.lead),
      );
    }
  const pins = [];
  [0, 1, 2].forEach(i => {
    s += pin({
      x: (0.5 + i) * p,
      y: gapTop,
      kind: 'pad',
      label: names[i],
      side: 'below',
      silk: f.silk,
      size: PIN_LABEL,
    });
    pins.push({ name: names[i], x: (0.5 + i) * p, y: gapTop });
  });
  s += barePad(T, w - 2.5 * p, gapBottom) + barePad(T, w - 1.5 * p, gapBottom);
  s += pin({
    x: w - 0.5 * p,
    y: gapBottom,
    kind: 'pad',
    label: names[3],
    side: 'below',
    silk: f.silk,
    size: PIN_LABEL,
  });
  pins.push({ name: names[3], x: w - 0.5 * p, y: gapBottom });
  if (cols >= 6) s += text(w / 2, y0 + (rows / 2 - 0.5) * pitch + 1.4, `${rows} x ${cols} RGB`, PIN_LABEL, f.silk);
  return art(w, h, `${rows} x ${cols} NeoPixel matrix`, s, pins);
}
