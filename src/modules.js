/** Breakout modules and their board-level details: the generic module template, USB receptacles, pad rows, SOIC and SOT-23 packages, microSD, RTC, RFID, relay module and the logic analyzer. */
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
  indicator,
  line,
  lotCode,
  path,
  r2,
  rect,
  sheen,
  tag,
  text,
  tokens,
  trace,
  via,
} from './core.js';
import { framed, padRow, qfp, silkFrame, smd, soicAcross, sot23, usbPort } from './pieces.js';

/**
 * A breakout module: a board in a finish, one header row of pads along the
 * bottom edge with labels above, a silk frame, a title, passives where
 * there is room, and the part it carries: 'chip' (a controller with a
 * crystal and passives), 'sensor' (a white housing with vent slots, as on
 * a DHT22; vent: 'holes' for a DHT11), 'can' (one metal can), 'dual-can'
 * (two 16 mm cans with the crystal between them, as on an ultrasonic
 * ranger), 'dome' (a lens, e.g. a PIR), or 'none'. canPitches sets a can's
 * diameter (default 2.6; the HC-SR04's cans are 6). width and height in mm
 * draw a board at its true size, overriding the pitch sizes.
 */
export function moduleTemplate(props) {
  const T = tokens();
  const p = T.pitch;
  const names = props.pins || ['VCC', 'OUT', 'GND'];
  const f = finish(T, props.finish || 'purple');
  const mm = p / 2.54;
  const minW = (names.length + 1) * p;
  const w = props.width ? props.width * mm : Math.max(minW, (props.widthPitches || 0) * p);
  const h = props.height ? props.height * mm : (props.heightPitches || 4.6) * p;
  const rowY = h - 0.6 * p;
  let s = '';
  const startX = r2((w - (names.length - 1) * p) / 2);
  s += board({
    width: w,
    height: h,
    finish: props.finish || 'purple',
    holes: props.holes === false || w < 5 * p ? false : startX - 0.6 * p < 1.25 * p ? 'top' : true,
    title: (props.part || 'chip') === 'dual-can' ? undefined : props.label,
    titleY: props.extraPads && props.extraPads.length ? rowY - Math.floor((rowY - 0.8 * p) / p) * p + 1.4 * p : 1.1 * p,
    titleSize: Math.min(5, ((w - 2 * p) / Math.max(4, (props.label || '').length)) * 1.5),
    mark:
      w >= 8 * p && props.mark !== false && ((props.part || 'chip') !== 'dual-can' || w >= 14 * p)
        ? {
            x: w - 2.0 * p,
            y:
              props.extraPads && props.extraPads.length
                ? rowY - Math.floor((rowY - 0.8 * p) / p) * p + 1.8 * p
                : 0.55 * p,
            size: 0.8 * p,
          }
        : undefined,
  });
  const maxLen = names.reduce((m, n) => {
    return Math.max(m, n.length);
  }, 0);
  const rotateLabels = maxLen * PIN_LABEL * 0.62 > p - 1.6;
  const labelSpan = rotateLabels ? T['pad-radius'] + 1.0 + maxLen * PIN_LABEL * 0.62 + 1.2 : T['label-rise'] + 3.6;
  const extraY = rowY - Math.floor((rowY - 0.8 * p) / p) * p;
  const extra =
    props.extraPads && props.extraPads.length
      ? header({
          x: r2((w - (props.extraPads.length - 1) * p) / 2),
          y: extraY,
          labels: props.extraPads,
          kind: 'pad',
          side: 'below',
          silk: f.silk,
          size: PIN_LABEL,
        })
      : null;
  const part = props.part || 'chip';
  const top = part === 'dual-can' ? 0.7 * p : extra ? extraY + 1.7 * p : 1.6 * p;
  const bottom = rowY - labelSpan;
  const mid = (top + bottom) / 2;
  const cx = w / 2;
  const room = bottom - top;
  if (extra) {
    s += extra.svg;
    extra.pins.forEach(pn => {
      s += trace(T, props.finish || 'purple', [
        [pn.x, pn.y],
        [pn.x, pn.y + 1.0 * p],
        [pn.x + (pn.x < cx ? 0.3 : -0.3) * p, pn.y + 1.5 * p],
      ]);
    });
  }
  if (part !== 'dual-can')
    s += rect(0.5 * p, top - 0.25 * p, w - p, bottom - top + 0.5 * p, 'none', {
      rx: 1,
      stroke: f.silk,
      'stroke-width': T['stroke-fine'],
      'stroke-opacity': 0.55,
    });
  const hdr = header({ x: startX, y: rowY, labels: names, side: 'above', silk: f.silk, rotate: rotateLabels });
  // Traces from the header pads up toward the part, and a via or two.
  hdr.pins.forEach((pn, i) => {
    const dx = (i - (names.length - 1) / 2) * 0.35 * p;
    s += trace(T, props.finish || 'purple', [
      [pn.x, pn.y],
      [pn.x, rowY - 1.1 * p],
      [pn.x + dx, bottom + 0.1 * p],
    ]);
  });
  if (w >= 8 * p && part !== 'sensor' && part !== 'dome' && (part !== 'dual-can' || w >= 14 * p))
    s +=
      via(T, 0.8 * p, rotateLabels ? Math.min(h - 1.9 * p, bottom - 0.7 * p) : h - 1.9 * p) +
      via(T, w - 0.8 * p, Math.max(top + 0.2 * p, 1.8 * p));
  if (part === 'chip') {
    const half = Math.min(0.9 * p, (bottom - top) / 2 - 0.12 * p);
    // The sensor package as the real one is: a SOIC with leads (default), a metal-lid LGA with its vent hole (BMP180), or a QFN with pads on four sides (MPU6050).
    const ic = props.ic || 'soic';
    let chipS = '';
    if (ic === 'lga') {
      chipS += rect(
        cx - half,
        mid - half,
        2 * half,
        2 * half,
        T.metal,
        Object.assign({ rx: 1 }, edge(T, T['metal-edge'], T['stroke-detail'])),
      );
      chipS +=
        rect(cx - half + 0.5, mid - half + 0.5, 2 * half - 1, 0.9, '#ffffff', {
          rx: 0.4,
          'fill-opacity': T['opacity-light'] * 0.5,
        }) + circle(cx + half * 0.3, mid + half * 0.3, half * 0.22, T.hole);
    } else {
      chipS += rect(
        cx - half,
        mid - half,
        2 * half,
        2 * half,
        T.chip,
        Object.assign({ rx: ic === 'qfn' ? 0.5 : 1 }, edge(T, T['chip-edge'], T['stroke-detail'])),
      );
      if (ic === 'qfn') {
        for (let i = 0; i < 4; i++) {
          const lq = -half * 0.66 + i * half * 0.44;
          chipS +=
            rect(cx - half, mid + lq, 1.0, 0.2 * p, T.lead) +
            rect(cx + half - 1.0, mid + lq, 1.0, 0.2 * p, T.lead) +
            rect(cx + lq, mid - half, 0.2 * p, 1.0, T.lead) +
            rect(cx + lq, mid + half - 1.0, 0.2 * p, 1.0, T.lead);
        }
      } else {
        for (let i = 0; i < 4; i++) {
          const ly = mid - half * 0.69 + i * half * 0.46;
          chipS +=
            rect(cx - half - 1.2, ly, 1.2, 0.22 * p, T.lead, { rx: 0.2 }) +
            rect(cx + half, ly, 1.2, 0.22 * p, T.lead, { rx: 0.2 });
        }
      }
      chipS += circle(cx - half * 0.66, mid - half * 0.66, 0.6, T['chip-print']);
      if (ic !== 'qfn')
        chipS += rect(cx - half + 0.5, mid - half + 0.5, 0.9, 2 * half - 1, '#ffffff', {
          rx: 0.4,
          'fill-opacity': T['opacity-light'] * 0.4,
        });
    }
    s += tag('chip', chipS);
    // The lot code at the floor size, as many characters as the body holds (a small package carries a short code).
    const codeFit = Math.floor((2 * half - 1.6) / (PIN_LABEL * 0.62));
    if (half >= 0.8 * p && codeFit >= 4)
      s += text(cx, mid + half * 0.55, lotCode(props.label || 'IC').slice(0, codeFit), PIN_LABEL, T['chip-print'], {
        'fill-opacity': 0.85,
      });
    if (cx - 2.3 * p >= 0.6 * p && room >= 1.9 * p)
      s +=
        smd(T, 'resistor', cx - 2.3 * p, mid - 0.9 * p, true) + smd(T, 'capacitor', cx - 2.3 * p, mid + 0.05 * p, true);
    if (cx + 2.1 * p <= w - 0.6 * p && room >= 1.5 * p) s += smd(T, 'crystal', cx + 1.35 * p, mid - 0.65 * p, false);
    if (w >= 8 * p && room >= 1.3 * p)
      s +=
        smd(T, 'capacitor', cx - 3.3 * p, mid - 0.45 * p, false) +
        smd(T, 'resistor', cx + 2.4 * p, mid - 0.45 * p, false);
  } else if (part === 'sensor') {
    const sw = Math.min(w - 1.6 * p, 6 * p);
    const sh = Math.min(bottom - top, 10 * p);
    const sx = cx - sw / 2;
    const sy = mid - sh / 2;
    const hp = props.housing === 'blue' ? T['plastic-blue'] : T['plastic-white'];
    const he = props.housing === 'blue' ? T['plastic-blue-edge'] : T['plastic-white-edge'];
    s += tag('housing', rect(sx, sy, sw, sh, hp, Object.assign({ rx: 1.2 }, edge(T, he))));
    s += rect(sx + 1, sy + 1, sw - 2, sh - 2, 'none', {
      rx: 0.8,
      stroke: he,
      'stroke-width': T['stroke-fine'],
      'stroke-opacity': 0.6,
    });
    if (props.vent === 'holes') {
      for (let gy = sy + 0.5 * p; gy < sy + sh - 0.3 * p; gy += 0.45 * p)
        for (let gx = sx + 0.5 * p; gx < sx + sw - 0.3 * p; gx += 0.45 * p)
          s +=
            circle(gx, gy, 0.95, T['plastic-white-edge']) +
            circle(gx - 0.25, gy - 0.25, 0.4, '#000000', { 'fill-opacity': 0.25 });
    } else {
      // The DHT22's vents: rows of vertical slots in the upper two thirds, a plain lower band.
      const slotH = Math.min(1.2 * p, (sh - 1.2 * p) / 3);
      const rowsN = Math.max(1, Math.floor((sh * 0.68) / (slotH + 0.25 * p)));
      for (let rr = 0; rr < rowsN; rr++)
        for (let sxx = sx + 0.4 * p; sxx < sx + sw - 0.4 * p; sxx += 0.42 * p)
          s +=
            rect(sxx, sy + 0.4 * p + rr * (slotH + 0.25 * p), 0.22 * p, slotH, T['plastic-white-edge'], {
              rx: 0.1 * p,
            }) +
            rect(sxx + 0.04 * p, sy + 0.4 * p + rr * (slotH + 0.25 * p), 0.1 * p, slotH, '#000000', {
              rx: 0.05 * p,
              'fill-opacity': 0.3,
            });
    }
    s += bevel(T, sx, sy, sw, sh);
  } else if (part === 'can' || part === 'dual-can') {
    // One can sits in the room above the labels. Two cans, as on an ultrasonic ranger, stand either side of the
    // header's label zone, so they may use the board's whole height at the real can size.
    let r;
    let cs;
    let cyc = mid;
    if (part === 'dual-can') {
      const zoneHalf =
        ((names.length - 1) * p) / 2 + (rotateLabels ? PIN_LABEL / 2 : (maxLen * PIN_LABEL * 0.62) / 2) + 0.6;
      const canBottom = rowY - T['pad-radius'] - 0.6;
      r = Math.min(
        ((props.canPitches || 2.6) * p) / 2,
        (canBottom - top) / 2 - 1.2,
        (cx - zoneHalf - 2.8 - 0.6 * p) / 2,
      );
      cyc = (top + canBottom) / 2;
      cs = [cx - (zoneHalf + r + 1.6), cx + (zoneHalf + r + 1.6)];
    } else {
      r = Math.min(((props.canPitches || 2.6) * p) / 2, room / 2 - 2.4, w / 2 - 0.8 * p - 1.2);
      cs = [cx];
    }
    if (r < 2) r = 2;
    cs.forEach(x => {
      s += tag('can', circle(x, cyc, r + 1.2, T['metal-edge']));
      s +=
        circle(x, cyc, r, T.metal, edge(T, T['metal-edge'])) +
        circle(x, cyc, r, sheen('metal'), { 'fill-opacity': 0.6 });
      // The cap is a stainless mesh: steel grey with its weave as rings, over the dark cavity.
      s += circle(x, cyc, r * 0.74, T['plastic-black'], edge(T, T['metal-edge'], T['stroke-fine']));
      s += circle(x, cyc, r * 0.74, T['metal-edge'], { 'fill-opacity': 0.55 });
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4 + Math.PI / 8;
        s += circle(x + Math.cos(a) * r * 0.86, cyc + Math.sin(a) * r * 0.86, r * 0.045, T['metal-edge']);
      }
      for (let m = 0; m < 5; m++)
        s += circle(x, cyc, r * (0.12 + m * 0.13), 'none', {
          stroke: '#ffffff',
          'stroke-width': 0.4,
          'stroke-opacity': 0.22,
        });
      s += path(
        `M${r2(x - r * 0.6)} ${r2(cyc - r * 0.35)}A${r2(r * 0.7)} ${r2(r * 0.7)} 0 0 1 ${r2(x - r * 0.3)} ${r2(cyc - r * 0.64)}`,
        'none',
        { stroke: '#ffffff', 'stroke-width': 1, 'stroke-linecap': 'round', 'stroke-opacity': 0.35 },
      );
    });
    if (part === 'dual-can') {
      // The title between the cans, then the crystal, the controller and a capacitor down the middle.
      const gap = cs[1] - cs[0] - 2 * r - 2.4;
      if (props.label && gap >= 8 && mid - 1.45 * p - 4.2 >= top)
        s += text(
          cx,
          mid - 0.9 * p,
          props.label,
          Math.min(5, ((gap - 2) / Math.max(4, props.label.length)) * 1.6),
          f.silk,
        );
      if (w >= 14 * p)
        s +=
          text(1.35 * p, h - 0.45 * p, 'T', PIN_LABEL, f.silk) +
          text(w - 1.35 * p, h - 0.45 * p, 'R', PIN_LABEL, f.silk);
      if (r >= 2.2 * p)
        s +=
          smd(T, 'crystal', cx - 0.65 * p, mid - 2.3 * p, true) +
          tag('chip', rect(cx - 0.6 * p, mid - 0.3 * p, 1.2 * p, 0.9 * p, T.chip, { rx: 0.6 })) +
          smd(T, 'capacitor', cx - 0.45 * p, mid + 0.8 * p, true);
    } else if (cx - r - 0.9 * p >= 0.6 * p + 1.2 && room >= 1.2 * p)
      s +=
        smd(T, 'resistor', cx - r - 0.9 * p, mid - 0.45 * p, false) +
        smd(T, 'capacitor', cx + r + 0.45 * p, mid - 0.45 * p, false);
  } else if (part === 'microsd') {
    // The card slot: a metal shell with its chamfered corner and the card's edge showing.
    const sw2 = Math.min(w - 1.6 * p, 6 * p);
    const sh2 = Math.min(room - 0.3 * p, 5.6 * p);
    const sx2 = cx - sw2 / 2;
    const sy2 = mid - sh2 / 2;
    s += tag(
      'slot',
      path(
        `M${r2(sx2)} ${r2(sy2)}H${r2(sx2 + sw2 - 0.9 * p)}l${r2(0.9 * p)} ${r2(0.9 * p)}V${r2(sy2 + sh2)}H${r2(sx2)}Z`,
        T.metal,
        edge(T, T['metal-edge']),
      ) +
        rect(sx2 + 0.5 * p, sy2 + sh2 - 1.2 * p, sw2 - 1.0 * p, 0.9 * p, T['plastic-black'], { rx: 0.3 }) +
        rect(sx2 + 0.5 * p, sy2 + sh2 - 1.2 * p, sw2 - 1.0 * p, 0.25 * p, '#ffffff', { 'fill-opacity': 0.15 }),
    );
    s += bevel(T, sx2, sy2, sw2, sh2, 1.2);
    [
      [sx2 + 0.35 * p, sy2 + 0.35 * p],
      [sx2 + sw2 - 0.35 * p, sy2 + sh2 - 0.35 * p],
      [sx2 + 0.35 * p, sy2 + sh2 - 0.35 * p],
    ].forEach(c => {
      s += circle(c[0], c[1], 0.8, T['metal-edge']);
    });
  } else if (part === 'rtc') {
    // The clock: the coin cell in its holder, the clock chip beside it and the 32 kHz crystal's little can.
    const cr = Math.min(3.9 * p, room / 2 - 0.2 * p, w / 2 - 0.8 * p);
    const ccx = Math.min(w - 0.8 * p - cr, cx + 1.0 * p);
    s += tag(
      'cell',
      circle(ccx, mid, cr + 0.9, T['metal-edge']) +
        circle(ccx, mid, cr, T.metal, edge(T, T['metal-edge'])) +
        circle(ccx, mid, cr * 0.82, 'none', {
          stroke: T['metal-edge'],
          'stroke-width': T['stroke-fine'],
          'stroke-opacity': 0.6,
        }) +
        text(ccx, mid + 2.4, 'CR2032', Math.max(PIN_LABEL, Math.min(6.4, cr * 0.5)), T['metal-edge'], {
          'font-weight': 600,
        }) +
        text(ccx, mid - cr * 0.45, '+', PIN_LABEL + 2, T['metal-edge'], { 'font-weight': 700 }),
    );
    s += el('ellipse', {
      cx: ccx - cr * 0.35,
      cy: mid - cr * 0.45,
      rx: cr * 0.35,
      ry: cr * 0.16,
      fill: '#ffffff',
      'fill-opacity': 0.45,
      transform: `rotate(-30 ${r2(ccx - cr * 0.35)} ${r2(mid - cr * 0.45)})`,
    });
    if (ccx - cr - 0.6 * p - 1.3 * p >= 0.6 * p) {
      const qx = 0.7 * p;
      const qy = mid - 0.6 * p;
      s += tag(
        'chip',
        rect(
          qx,
          qy,
          1.3 * p,
          1.2 * p,
          T.chip,
          Object.assign({ rx: 0.6 }, edge(T, T['chip-edge'], T['stroke-detail'])),
        ) + circle(qx + 2.2, qy + 2.2, 0.6, T['chip-print']),
      );
      for (let ql = 0; ql < 4; ql++)
        s +=
          rect(qx - 1.2, qy + 1.6 + ql * 2.5, 1.2, 1.4, T.lead, { rx: 0.2 }) +
          rect(qx + 1.3 * p, qy + 1.6 + ql * 2.5, 1.2, 1.4, T.lead, { rx: 0.2 });
      s += tag(
        'crystal',
        rect(
          qx,
          qy + 1.6 * p,
          0.7 * p,
          1.8 * p,
          T.metal,
          Object.assign({ rx: 0.35 * p }, edge(T, T['metal-edge'], T['stroke-fine'])),
        ),
      );
    }
  } else if (part === 'dome') {
    const dr = Math.min(((props.domePitches || 3) * p) / 2, room / 2 - 1.4, w / 2 - 0.8 * p - 1);
    s += tag('dome', circle(cx, mid, dr + 1, T['plastic-white-edge']));
    s += circle(cx, mid, dr, T['plastic-white'], edge(T, T['plastic-white-edge']));
    for (let q = 1; q <= 3; q++)
      s += circle(cx, mid, (dr * q) / 3.6, 'none', {
        stroke: T['plastic-white-edge'],
        'stroke-width': T['stroke-fine'],
      });
    s += path(`M${r2(cx - dr)} ${r2(mid)}h${r2(2 * dr)}M${r2(cx)} ${r2(mid - dr)}v${r2(2 * dr)}`, 'none', {
      stroke: T['plastic-white-edge'],
      'stroke-width': T['stroke-fine'],
    });
    s += el('ellipse', {
      cx: cx - dr * 0.35,
      cy: mid - dr * 0.4,
      rx: dr * 0.3,
      ry: dr * 0.16,
      fill: '#ffffff',
      'fill-opacity': 0.6,
      transform: `rotate(-30 ${r2(cx - dr * 0.35)} ${r2(mid - dr * 0.4)})`,
    });
    // The two orange trim pots (time and sensitivity) either side of the dome, where the board leaves room for them.
    const tp = 0.7 * p;
    if (cx - dr - 1 - 0.35 * p - tp >= 0.6 * p && room >= tp + 0.4 * p)
      [
        [0.6 * p, 'time'],
        [w - 0.6 * p - tp, 'sens'],
      ].forEach(t => {
        s += tag(
          'trimmer',
          rect(
            t[0],
            mid - tp / 2,
            tp,
            tp,
            T['band-orange'],
            Object.assign({ rx: 0.8 }, edge(T, T['resistor-body-edge'], T['stroke-fine'])),
          ) +
            circle(
              t[0] + tp / 2,
              mid,
              tp * 0.28,
              T['plastic-white'],
              edge(T, T['plastic-white-edge'], T['stroke-fine']),
            ) +
            line(
              t[0] + tp / 2 - tp * 0.22,
              mid,
              t[0] + tp / 2 + tp * 0.22,
              mid,
              T['plastic-white-edge'],
              T['stroke-fine'],
            ),
        );
      });
  }
  s += hdr.svg;
  return art(
    w,
    h,
    props.description || `${props.label || 'Breakout'} module`,
    s,
    extra ? hdr.pins.concat(extra.pins) : hdr.pins,
  );
}

/**
 * The eight-channel logic analyzer as photographed, at its true 54.7 x 27.4
 * mm: the black case with its white label (the name, 24MHz 8CH, and the
 * channel table), the mini-USB at the left end and the 2 x 5 header at the
 * right end. The header points out of the end; it is drawn folded flat as
 * the label maps it, D0, D2, D4, D6 and the clock (GND on some units) in
 * the inner column, D1, D3, D5, D7 and GND at the end, and its sockets are
 * the pins (D0 to D7, then GND; the clock has none). Each channel's row
 * carries its activity lamp (data-channel, data-lit), and the readout strip
 * at the foot of the label carries the sample count and capture state
 * (data-samples, data-state, data-running, data-activity).
 */
export function logicAnalyzer(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const w = 54.7 * mm;
  const h = 27.4 * mm;
  let s = '';
  const names = props.channels || ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
  const lit = props.lit || [];
  const samples = Math.max(0, Math.floor(Number(props.samples) || 0));
  const state = props.state || 'idle';
  const WORD = { idle: 'STOP', armed: 'ARMED', recording: 'REC', paused: 'PAUSE', full: 'FULL', error: 'MEM' };
  const bi = T['board-inset'];
  const pins = [];
  s += tag(
    'body',
    rect(
      bi,
      bi,
      w - 2 * bi,
      h - 2 * bi,
      T['plastic-black'],
      Object.assign({ rx: 3 }, edge(T, T['plastic-black-edge'])),
    ),
  );
  s += bevel(T, bi, bi, w - 2 * bi, h - 2 * bi, 2.2, 3);
  // The mini-USB at the left end, the header's shroud at the right end: its inner column, then the column at the end, five rows a pitch apart.
  s += usbPort(T, { kind: 'mini', x: 0.3 * mm, y: h / 2 - 3.85 * mm, w: 3.4 * mm, h: 7.7 * mm, mouth: 'left' });
  const colX = [w - 2 * p, w - p];
  const rowY = function (r) {
    return h / 2 + (r - 2) * p;
  };
  let hdrS = rect(
    colX[0] - 0.75 * p,
    rowY(0) - 0.85 * p,
    2.5 * p,
    5.7 * p,
    T['plastic-black'],
    Object.assign({ rx: 0.6 }, edge(T, T['plastic-black-edge'], T['stroke-fine'])),
  );
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 2; c++)
      hdrS +=
        rect(colX[c] - 0.28 * p, rowY(r) - 0.28 * p, 0.56 * p, 0.56 * p, T.cavity, { rx: 0.3 }) +
        rect(colX[c] - 0.12 * p, rowY(r) - 0.12 * p, 0.24 * p, 0.24 * p, T.metal);
  s += tag('socket', hdrS);
  for (let i = 0; i < 8; i++) pins.push({ name: names[i], x: colX[i % 2], y: rowY(Math.floor(i / 2)) });
  pins.push({ name: 'GND', x: colX[1], y: rowY(4) });
  // The white label: the name at the left, the channel table at the right in the header's rows, the readout strip along its foot.
  const lx = 4.4 * mm;
  const ly = 2 * mm;
  const lw = w - 3.05 * p - lx;
  const lh = h - 2 * ly;
  s += rect(lx, ly, lw, lh, T['plastic-white'], { rx: 1.4 });
  s +=
    text(lx + 0.5 * p, ly + 1.75 * p, 'Logic', 10.5, T['plastic-black'], {
      'text-anchor': 'start',
      'font-weight': 700,
    }) +
    text(lx + 0.5 * p, ly + 3 * p, 'Analyzer', 10.5, T['plastic-black'], {
      'text-anchor': 'start',
      'font-weight': 700,
    });
  s += text(lx + 0.5 * p, ly + 4.15 * p, '24MHz 8CH', 5, T['plastic-black'], { 'text-anchor': 'start' });
  const lampX = [lx + lw - 5 * p, lx + lw - 2.2 * p];
  for (let c2 = 0; c2 < 8; c2++) {
    const tx = lampX[c2 % 2];
    const ty = rowY(Math.floor(c2 / 2));
    const on = !!lit[c2];
    s += tag(
      'indicator',
      circle(
        tx,
        ty,
        on ? 2.4 : 2.0,
        on ? T['lens-green'] : T['indicator-off-light'],
        Object.assign(
          { 'data-channel': c2, 'data-lit': on ? 'true' : 'false' },
          edge(T, on ? T['lens-green'] : T['plastic-black-edge'], T['stroke-fine']),
        ),
      ),
    );
    s += text(tx + 0.5 * p, ty + 1.4, names[c2], PIN_LABEL, T['plastic-black'], {
      'text-anchor': 'start',
      'font-weight': 600,
    });
  }
  s +=
    text(lampX[0] + 0.5 * p, rowY(4) + 1.4, 'CLK', PIN_LABEL, T['plastic-black'], {
      'text-anchor': 'start',
      'font-weight': 600,
    }) +
    text(lampX[1] + 0.5 * p, rowY(4) + 1.4, 'GND', PIN_LABEL, T['plastic-black'], {
      'text-anchor': 'start',
      'font-weight': 600,
    });
  const rx = lx + 0.35 * p;
  const ry = ly + lh - 1.15 * p;
  const rw = lw - 0.7 * p;
  const rh = 0.75 * p;
  s += rect(rx, ry, rw, rh, T.readout, { rx: 1 });
  const g =
    text(rx + 0.3 * p, ry + 0.55 * p, `SAMPLES ${samples}`, PIN_LABEL, T['readout-text'], {
      'text-anchor': 'start',
      'font-weight': 600,
    }) +
    text(rx + rw - 0.3 * p, ry + 0.55 * p, WORD[state] || 'STOP', PIN_LABEL, T['readout-text'], {
      'text-anchor': 'end',
      'font-weight': 600,
    });
  s += el(
    'g',
    {
      'data-samples': samples,
      'data-state': state,
      'data-running': state === 'recording' ? 'true' : 'false',
      'data-activity': r2(Number(props.activity) || 0),
    },
    g,
  );
  return art(w, h, `Eight-channel logic analyzer, ${(WORD[state] || 'STOP').toLowerCase()}`, s, pins);
}

/**
 * The microSD module as photographed: a blue 42 x 24 mm board, holes at
 * the corners, the metal card socket at the left, the level shifter in
 * SOIC-14 across the top, the AMS1117 regulator at the bottom, the
 * resistors and capacitors round them, the six pins down the right edge in
 * the module's order (CS, SCK, MOSI as DI, MISO as DO, VCC, GND from the
 * top) and the catalog's card-detect pad CD below them. The box is 16.5 x
 * 9.5 pitches.
 */
export function microsdModule(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'blue';
  const f = finish(T, fin);
  const w = 16.5 * p;
  const h = 9.5 * p;
  let s = '';
  const names = props.pins || ['CS', 'SCK', 'DI', 'DO', 'VCC', 'GND', 'CD'];
  s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: 12.1 * p, y: 3.7 * p, size: 0.8 * p } });
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
    { x: w - 1.0 * p, y: 1.75 * p, axis: 'y', labels: names, kind: 'pad', side: 'left', silk: f.silk, size: PIN_LABEL },
    -1,
  );
  // The socket: the shell with its chamfered corner, the card's edge in the slot at the left.
  const sx = 1.4 * p;
  const sy = 1.6 * p;
  const sw = 14.5 * mm;
  const sh = 15.5 * mm;
  s += tag(
    'slot',
    path(
      `M${r2(sx)} ${r2(sy)}H${r2(sx + sw - 0.9 * p)}l${r2(0.9 * p)} ${r2(0.9 * p)}V${r2(sy + sh)}H${r2(sx)}Z`,
      T.metal,
      edge(T, T['metal-edge']),
    ) +
      rect(sx, sy + 0.6 * p, 0.5 * p, sh - 1.2 * p, T['plastic-black'], { rx: 0.3 }) +
      rect(sx + 0.05 * p, sy + 0.6 * p, 0.2 * p, sh - 1.2 * p, '#ffffff', { 'fill-opacity': 0.15 }) +
      rect(sx + sw - 0.45 * p, sy + 1.0 * p, 0.3 * p, sh - 2.0 * p, T['metal-edge'], { rx: 0.2, 'fill-opacity': 0.6 }),
  );
  s += bevel(T, sx, sy, sw, sh, 1.4);
  for (let k = 0; k < 8; k++)
    s += rect(sx + sw - 0.4 * p, sy + 1.3 * p + k * 0.55 * p, 0.6 * p, 0.2 * p, T.lead, { rx: 0.1 });
  [
    [sx + 0.4 * p, sy + 0.4 * p],
    [sx + 0.4 * p, sy + sh - 0.4 * p],
    [sx + sw - 0.4 * p, sy + sh - 0.4 * p],
  ].forEach(c => {
    s += circle(c[0], c[1], 0.8, T['metal-edge']);
  });
  s += soicAcross(T, 8.6 * p, 0.95 * p, 2.9 * p, 1.4 * p, 7, '74LVC125');
  [
    [7.5, 0.75],
    [7.5, 1.55],
    [11.9, 0.75],
    [11.9, 1.55],
  ].forEach(q => {
    s += framed(T, f, q[1] < 1 ? 'capacitor' : 'resistor', q[0] * p, q[1] * p, true);
  });
  // The regulator in SOT-223: the tab at the top, three leads at the bottom.
  const rx = 8.7 * p;
  const ry = 5.6 * p;
  const rw = 2.6 * p;
  const rh = 1.4 * p;
  s += tag(
    'chip',
    rect(rx + rw / 2 - 0.6 * p, ry - 0.5 * p, 1.2 * p, 0.5 * p, T.lead, { rx: 0.2 }) +
      [0.3, 1.3, 2.3]
        .map(k => {
          return rect(rx + k * p, ry + rh, 0.35 * p, 0.55 * p, T.lead, { rx: 0.2 });
        })
        .join('') +
      rect(rx, ry, rw, rh, T.chip, Object.assign({ rx: 0.5 }, edge(T, T['chip-edge'], T['stroke-detail']))) +
      bevel(T, rx, ry, rw, rh, 1.0, 0.5) +
      text(rx + rw / 2, ry + rh / 2 + 1.4, 'AMS1117', 4, T['chip-print']),
  );
  s +=
    framed(T, f, 'capacitor', 7.4 * p, 5.4 * p, true) +
    framed(T, f, 'capacitor', 7.5 * p, 6.7 * p, true) +
    framed(T, f, 'capacitor', 11.7 * p, 7.3 * p, true);
  s += hdr.svg;
  return art(w, h, 'microSD card module', s, hdr.pins);
}

/**
 * The DS1307 clock module as photographed (Open-Smart): a blue 38 x 22 mm
 * board, holes at the corners, the CR1220 cell in its holder at the left,
 * the crystal can above the DS1307 in SOIC-8, the 472 resistor array, the
 * title, the catalog's five pins down the right edge. The box is 15 x 8.7
 * pitches.
 */
export function rtcModule(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'blue';
  const f = finish(T, fin);
  const w = 15 * p;
  const h = 8.7 * p;
  let s = '';
  const names = props.pins || ['GND', '5V', 'SDA', 'SCL', 'SQW'];
  s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: 2.6 * p, y: 7.35 * p, size: 0.8 * p } });
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
    { x: w - 1.0 * p, y: 2.5 * p, axis: 'y', labels: names, kind: 'pad', side: 'left', silk: f.silk, size: PIN_LABEL },
    -1,
  );
  s += text(6.9 * p, 1.1 * p, props.label || 'RTC', 5, f.silk, { 'font-weight': 600 });
  // The coin cell in its holder: the gilded holder plate and its two side contacts, the cell with its print.
  const ccx = 3.9 * p;
  const ccy = 4.5 * p;
  const cr = 6.25 * mm;
  s += tag(
    'cell',
    circle(ccx, ccy, cr + 0.45 * p, T.pad, edge(T, T['metal-edge'], T['stroke-fine'])) +
      rect(ccx - cr - 0.9 * p, ccy - 0.35 * p, 0.8 * p, 0.7 * p, T.pad, { rx: 0.3 }) +
      rect(ccx + cr + 0.2 * p, ccy - 0.35 * p, 0.8 * p, 0.7 * p, T.pad, { rx: 0.3 }) +
      circle(ccx, ccy, cr, T['plastic-black'], edge(T, T['plastic-black-edge'])) +
      circle(ccx, ccy, cr, sheen('metal'), { 'fill-opacity': 0.35 }) +
      text(ccx, ccy - 0.6, 'CR1220', 4.4, T['plastic-grey'], { 'font-weight': 600 }) +
      text(ccx, ccy + 4.6, '3V', 4, T['plastic-grey']),
  );
  s += text(ccx + cr + 1.5 * p, ccy + 1.5 * p, '+', 5, f.silk, { 'font-weight': 700 });
  // The crystal: a 2 x 6 mm can lying along the board, its two leads to pads at the left.
  const qx = 8.4 * p;
  const qy = 2.0 * p;
  s += silkFrame(T, f, qx - 0.9 * p, qy - 0.45 * p, 3.4 * p, 0.9 * p);
  s +=
    circle(qx - 0.6 * p, qy - 0.25 * p, 1.3, T.pad) +
    circle(qx - 0.6 * p, qy + 0.25 * p, 1.3, T.pad) +
    line(qx - 0.6 * p, qy - 0.25 * p, qx + 0.1 * p, qy - 0.1 * p, T.lead, 0.9) +
    line(qx - 0.6 * p, qy + 0.25 * p, qx + 0.1 * p, qy + 0.1 * p, T.lead, 0.9);
  s += tag(
    'crystal',
    rect(
      qx,
      qy - 1.0 * mm,
      6 * mm,
      2.0 * mm,
      T.metal,
      Object.assign({ rx: 1.0 * mm }, edge(T, T['metal-edge'], T['stroke-fine'])),
    ) + rect(qx, qy - 1.0 * mm, 6 * mm, 2.0 * mm, sheen('metal'), { rx: 1.0 * mm, 'fill-opacity': 0.7 }),
  );
  s += soicAcross(T, 8.3 * p, 3.5 * p, 1.95 * p, 1.55 * p, 4, 'DS1307');
  s +=
    framed(T, f, 'resistor', 8.6 * p, 6.1 * p, true) +
    text(9.75 * p, 6.5 * p, 'R1', 4, f.silk, { 'text-anchor': 'start' });
  s += hdr.svg;
  return art(w, h, 'DS1307 real-time clock module', s, hdr.pins);
}

/**
 * The RC522 reader as photographed: a blue 60 x 40 mm board lying on its
 * long side, the eight pads down the left edge in their silk box (SDA, SCK,
 * MOSI, MISO, IRQ, GND, RST, 3.3V), the crystal can at the top left, the
 * reader in QFN-32 below it among its passives, the power LED and the two
 * inductors at the bottom left, the coil antenna round the right two
 * thirds with the arcs and the name inside it (the field is data-hook="field"),
 * four holes. The box is 23.5 x 16 pitches.
 */
export function rfidModule(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const fin = props.finish || 'blue';
  const f = finish(T, fin);
  const w = 23.5 * p;
  const h = 16 * p;
  let s = '';
  const names = props.pins || ['SDA', 'SCK', 'MOSI', 'MISO', 'IRQ', 'GND', 'RST', '3.3V'];
  s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: 10.2 * p, y: 13.4 * p, size: 0.8 * p } });
  [
    [6.9 * p, 1.2 * p],
    [6.9 * p, h - 1.2 * p],
    [22.5 * p, 2.0 * p],
    [22.5 * p, h - 2.0 * p],
  ].forEach(c => {
    s += tag('hole', circle(c[0], c[1], T['mount-hole-radius'], T.hole, edge(T, T.pad)));
  });
  const hdr = padRow(
    T,
    fin,
    f,
    { x: 1.0 * p, y: 4.0 * p, axis: 'y', labels: names, kind: 'pad', side: 'right', silk: f.silk, size: PIN_LABEL },
    1,
  );
  s += rect(0.45 * p, 3.4 * p, 1.1 * p, 8.2 * p, 'none', {
    rx: 0.6,
    stroke: f.silk,
    'stroke-width': T['stroke-fine'],
    'stroke-opacity': 0.85,
  });
  // The crystal can with its two capacitors, then the reader with its passives above and below.
  s += tag(
    'crystal',
    rect(
      1.4 * p,
      0.75 * p,
      4.3 * p,
      1.6 * p,
      T.metal,
      Object.assign({ rx: 0.8 * p }, edge(T, T['metal-edge'], T['stroke-fine'])),
    ) + rect(1.4 * p, 0.75 * p, 4.3 * p, 1.6 * p, sheen('metal'), { rx: 0.8 * p, 'fill-opacity': 0.7 }),
  );
  s += text(5.95 * p, 1.75 * p, 'OSC', 4, f.silk, { 'text-anchor': 'start' });
  s += framed(T, f, 'capacitor', 1.9 * p, 2.75 * p, true) + framed(T, f, 'capacitor', 3.6 * p, 2.75 * p, true);
  [
    [3.0, 4.35],
    [3.9, 4.35],
    [4.8, 4.35],
    [5.7, 4.35],
  ].forEach((q, i) => {
    s += framed(T, f, i === 0 || i === 3 ? 'capacitor' : 'resistor', q[0] * p, q[1] * p, false);
  });
  s += qfp(T, 3.4 * p, 6.3 * p, 2.3 * p, 2.3 * p, 8, 'RC522');
  s += text(6.6 * p, 7.45 * p, 'HW-126', 4, f.silk, {
    'dominant-baseline': 'middle',
    transform: `rotate(-90 ${r2(6.6 * p)} ${r2(7.45 * p)})`,
  });
  [
    [3.0, 9.5],
    [3.9, 9.5],
    [4.8, 9.5],
    [5.7, 9.5],
  ].forEach((q, i) => {
    s += framed(T, f, i === 1 ? 'resistor' : 'capacitor', q[0] * p, q[1] * p, false);
  });
  s +=
    silkFrame(T, f, 1.0 * p, 12.0 * p, 0.6 * p, 0.6 * p) +
    indicator({
      x: 1.0 * p,
      y: 12.0 * p,
      size: 0.6 * p,
      color: 'red',
      on: !!(props.indicators && props.indicators.power),
      hook: 'power-led',
      state: 'power',
      finish: fin,
    });
  [
    [2.4, 11.9],
    [3.3, 11.9],
    [4.2, 11.9],
  ].forEach((q, i) => {
    s += framed(T, f, 'resistor', q[0] * p, q[1] * p, false);
  });
  s +=
    text(1.3 * p, 13.5 * p, 'D1', 4, f.silk) +
    text(2.95 * p, 13.5 * p, 'R1', 4, f.silk) +
    text(3.9 * p, 13.5 * p, 'L1', 4, f.silk) +
    text(4.8 * p, 13.5 * p, 'L2', 4, f.silk);
  // The coil: three turns of pad-coloured trace round the right part, the capacitors along its inner left edge, the field inside.
  const turns = 3;
  const cx0 = 8.2 * p;
  const cy0 = 1.0 * p;
  const cw = 13.4 * p;
  const ch = h - 2.0 * p;
  const gap = 0.3 * p;
  let d = '';
  for (let t = 0; t < turns; t++) {
    const x = cx0 + t * gap;
    const y = cy0 + t * gap;
    const ww = cw - 2 * t * gap;
    const hh = ch - 2 * t * gap;
    const rr = 1.6 * p - t * gap;
    d += `M${r2(x + rr)} ${r2(y)}H${r2(x + ww - rr)}A${r2(rr)} ${r2(rr)} 0 0 1 ${r2(x + ww)} ${r2(y + rr)}V${r2(y + hh - rr)}A${r2(rr)} ${r2(rr)} 0 0 1 ${r2(x + ww - rr)} ${r2(y + hh)}H${r2(x + rr)}A${r2(rr)} ${r2(rr)} 0 0 1 ${r2(x)} ${r2(y + hh - rr)}V${r2(y + rr)}A${r2(rr)} ${r2(rr)} 0 0 1 ${r2(x + rr)} ${r2(y)}Z`;
  }
  s += path(d, 'none', { 'data-hook': 'antenna', stroke: T.pad, 'stroke-width': 1.1, 'stroke-linejoin': 'round' });
  s += rect(
    cx0 + turns * gap + 0.4 * p,
    cy0 + turns * gap + 0.4 * p,
    cw - 2 * turns * gap - 0.8 * p,
    ch - 2 * turns * gap - 0.8 * p,
    'none',
    { 'data-hook': 'field', rx: 2 },
  );
  for (let k = 0; k < 6; k++) s += framed(T, f, 'capacitor', 9.6 * p, (5.0 + k * 1.0) * p, true);
  // The arcs and the name.
  const acx = 15.3 * p;
  const acy = 8.0 * p;
  let arcs = '';
  for (let a = 1; a <= 4; a++) {
    const ar = a * 1.1 * p;
    const sa = -Math.PI * 0.8;
    const ea = -Math.PI * 0.2;
    arcs += `M${r2(acx + Math.cos(sa) * ar)} ${r2(acy + Math.sin(sa) * ar)}A${r2(ar)} ${r2(ar)} 0 0 1 ${r2(acx + Math.cos(ea) * ar)} ${r2(acy + Math.sin(ea) * ar)}`;
    arcs += `M${r2(acx - Math.cos(sa) * ar)} ${r2(acy - Math.sin(sa) * ar)}A${r2(ar)} ${r2(ar)} 0 0 1 ${r2(acx - Math.cos(ea) * ar)} ${r2(acy - Math.sin(ea) * ar)}`;
  }
  s +=
    path(arcs, 'none', { stroke: f.silk, 'stroke-width': 1.0, 'stroke-linecap': 'round' }) +
    circle(acx, acy, 1.6, f.silk);
  s += text(20.3 * p, acy, props.label || 'RFID-RC522', 6, f.silk, {
    'font-weight': 600,
    'dominant-baseline': 'middle',
    transform: `rotate(-90 ${r2(20.3 * p)} ${r2(acy)})`,
  });
  s += hdr.svg;
  return art(w, h, 'MFRC522 RFID reader module', s, hdr.pins);
}

/**
 * The single-channel relay module as photographed: a red 50 x 25 mm
 * board, holes at the corners, the blue screw terminal (NO, COM, NC) at the
 * left, the blue SRD-05VDC-SL-C relay with its print, the optocoupler,
 * transistor and resistors at the right with the PWR and ON lamps, the
 * trigger jumper, the catalog's header (VCC, GND, IN) down the right edge.
 * The box is 19.5 x 10 pitches.
 */
export function relayModule(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'red';
  const f = finish(T, fin);
  const w = 19.5 * p;
  const h = 10 * p;
  let s = '';
  const ind = { power: true, status: false, ...props.indicators };
  s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: 10.4 * p, y: 0.55 * p, size: 0.7 * p } });
  [
    [0.9 * p, 0.9 * p],
    [w - 0.9 * p, 0.9 * p],
    [0.9 * p, h - 0.9 * p],
    [w - 0.9 * p, h - 0.9 * p],
  ].forEach(c => {
    s += tag('hole', circle(c[0], c[1], T['mount-hole-radius'], T.hole, edge(T, T.pad)));
  });
  const hdr = padRow(
    T,
    fin,
    f,
    {
      x: 18.75 * p,
      y: 4 * p,
      axis: 'y',
      labels: ['VCC', 'GND', 'IN'],
      kind: 'pad',
      side: 'left',
      silk: f.silk,
      size: PIN_LABEL,
    },
    -1,
  );
  // The screw terminal: a blue block with three screws on the grid, the contact names beside it.
  const tx = 1.75 * p;
  const tw = 2.6 * p;
  const ty = 2.0 * p;
  const th = 6.0 * p;
  const names = ['NO', 'COM', 'NC'];
  const pins = hdr.pins.slice();
  s += tag(
    'terminal',
    rect(tx - tw / 2, ty, tw, th, T['plastic-blue'], Object.assign({ rx: 1 }, edge(T, T['plastic-blue-edge']))) +
      bevel(T, tx - tw / 2, ty, tw, th, 1.6, 1),
  );
  names.forEach((n, i) => {
    const y = (3 + 2 * i) * p;
    s +=
      circle(tx, y, 0.5 * p, T.metal, edge(T, T['metal-edge'], T['stroke-fine'])) +
      circle(tx, y, 0.5 * p, sheen('metal'), { 'fill-opacity': 0.6 }) +
      line(tx - 0.3 * p, y - 0.3 * p, tx + 0.3 * p, y + 0.3 * p, T['metal-edge'], 0.9) +
      line(tx + 0.3 * p, y - 0.3 * p, tx - 0.3 * p, y + 0.3 * p, T['metal-edge'], 0.9);
    s += text(tx + tw / 2 + 0.45 * p, y + 1.4, n, PIN_LABEL, f.silk, { 'text-anchor': 'start' });
  });
  // The relay: a blue cube 19 x 15.5 mm with its print.
  const rw = 19 * mm;
  const rh = 15.5 * mm;
  const rx = 4.6 * p;
  const ry = (h - rh) / 2;
  s += tag(
    'body',
    rect(rx, ry, rw, rh, T['plastic-blue'], Object.assign({ rx: 1.2 }, edge(T, T['plastic-blue-edge']))),
  );
  s += bevel(T, rx, ry, rw, rh, 1.8, 1.2);
  s += text(rx + rw / 2, ry + 1.5 * p, 'RELAY', 5, T['chip-print'], { 'font-weight': 700 });
  s +=
    text(rx + rw / 2, ry + 2.5 * p, '10A 250VAC  10A 125VAC', PIN_LABEL, T['chip-print']) +
    text(rx + rw / 2, ry + 3.1 * p, '10A 30VDC   10A 28VDC', PIN_LABEL, T['chip-print']);
  s += text(rx + rw / 2, ry + 4.3 * p, 'SRD-05VDC-SL-C', 5, T['chip-print'], { 'font-weight': 600 });
  s += text(rx + rw / 2, ry + 5.3 * p, lotCode('SRD'), PIN_LABEL, T['chip-print'], { 'fill-opacity': 0.8 });
  // The driver at the right: resistors, the transistor, the optocoupler in SOIC-4, the lamps and the trigger jumper.
  s +=
    framed(T, f, 'resistor', 13.0 * p, 0.75 * p, true) +
    framed(T, f, 'resistor', 15.0 * p, 0.75 * p, true) +
    framed(T, f, 'resistor', 15.3 * p, 3.3 * p, true) +
    framed(T, f, 'resistor', 15.3 * p, 4.3 * p, true);
  s += sot23(T, 13.4 * p, 2.1 * p, 3) + text(13.3 * p, 4.5 * p, 'Q1', PIN_LABEL, f.silk);
  s += soicAcross(T, 13.1 * p, 5.6 * p, 1.6 * p, 1.4 * p, 2, '817');
  s +=
    silkFrame(T, f, 17.0 * p, 0.8 * p, 0.7 * p, 0.7 * p) +
    indicator({
      x: 17.0 * p,
      y: 0.8 * p,
      size: 0.7 * p,
      color: 'red',
      on: !!ind.power,
      hook: 'power-led',
      state: 'power-led',
      finish: fin,
    }) +
    text(17.35 * p, 2.3 * p, 'PWR', PIN_LABEL, f.silk);
  s +=
    silkFrame(T, f, 15.9 * p, 5.5 * p, 0.7 * p, 0.7 * p) +
    indicator({
      x: 15.9 * p,
      y: 5.5 * p,
      size: 0.7 * p,
      color: 'green',
      on: !!ind.status,
      hook: 'status-led',
      state: 'status-led',
      finish: fin,
    }) +
    text(16.25 * p, 7.0 * p, 'ON', PIN_LABEL, f.silk);
  s += tag(
    'jumper',
    rect(
      13.0 * p,
      8.1 * p,
      2.2 * p,
      0.8 * p,
      T['plastic-black'],
      Object.assign({ rx: 0.3 }, edge(T, T['plastic-black-edge'], T['stroke-fine'])),
    ) + rect(13.1 * p, 8.2 * p, 1.0 * p, 0.6 * p, T['band-yellow'], { rx: 0.2 }),
  );
  s += text(12.6 * p, 8.75 * p, 'L', PIN_LABEL, f.silk) + text(15.6 * p, 8.75 * p, 'H', PIN_LABEL, f.silk);
  names.forEach((n, i) => {
    pins.push({ name: n, x: tx, y: (3 + 2 * i) * p });
  });
  if (props.label !== false)
    s += text(8.1 * p, 9.25 * p, props.label || '1 RELAY MODULE  HIGH/LOW TRIGGER', PIN_LABEL, f.silk);
  s += hdr.svg;
  return art(w, h, 'Relay module with an SPDT changeover contact', s, pins);
}
