/** Sensor boards and sensor packages: the comparator boards, small sensor boards, DHT, HC-SR04, BMP180, PIR, gas, HX711, pulse sensor and TO-92 parts. */
import {
  PIN_LABEL,
  art,
  bevel,
  board,
  capTop,
  circle,
  edge,
  el,
  finish,
  header,
  indicator,
  line,
  path,
  r2,
  rect,
  sheen,
  tag,
  text,
  tokens,
  trace,
} from './core.js';
import { edgeHeader, framed, mountHole, padRow, smd, soicAcross, wire } from './pieces.js';
import { moduleTemplate } from './modules.js';

/**
 * The small sensor boards sold by the hundred (KY and FC classes), drawn
 * upright with their pins at the bottom: a board in a finish, the sensing
 * element at the top (ldr, flame, mic, bead, cylinder, ir), the LM393
 * comparator with its blue trimmer and two indicators when the board has
 * one (the four-pin DO/AO boards), the title on the silk. Sizes are the
 * real boards', pins on the grid.
 */
/**
 * The LM393 comparator sensor boards, each laid out from a photograph of
 * the real one (the element at the top, the header at the bottom):
 * - 'flame' and 'ldr': the FC board, 32 x 14 mm and blue; the 5 mm
 *   element past the end on bent legs to the + and - pads, two brown
 *   capacitors and two 103 resistors down the left, the trimmer right of
 *   the LM393, PWR under the trimmer, the hole beside the DO lamp, two
 *   102 resistors down the right.
 * - 'cylinder': the tilt board, 32 x 14 mm and blue; the brass SW-520D
 *   past the end, a row of four passives under the pads, the LM393 and
 *   trimmer, both lamps by the header with their resistors above them
 *   and the hole between.
 * - 'mic': the KY-037 board, 34 x 15 mm and red; the capsule lying on its
 *   side past the end with its felt face outward (micMm 9.7, or 6 for the
 *   small one), its legs bent down to the pads, four resistors under it,
 *   the LM393 and the tall blue 3296 trimmer with its brass screw, the
 *   lamps flanking the hole by the header.
 * Each board comes with a right-angle header: the spacer on the board at
 * the end away from the element, the pins standing 6 mm past it, the names on the silk
 * above the pads (labels; DOUT and AOUT print as DO and AO, as the boards
 * print them). The box is the board's width, and its height runs from
 * the element's tip to the pins' tips.
 */
export function comparatorBoardTemplate(props) {
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const element = props.element || 'ldr';
  const layout = element === 'cylinder' ? 'tilt' : element === 'mic' ? 'ky037' : 'fc';
  const fin = props.finish || (layout === 'ky037' ? 'red' : 'blue');
  const f = finish(T, fin);
  const names = props.pins || ['VCC', 'GND', 'DO', 'AO'];
  const prints =
    props.labels ||
    names.map(n => {
      return n === 'DOUT' ? 'DO' : n === 'AOUT' ? 'AO' : n;
    });
  // The layouts below were measured on a 16.3 x 36 mm frame (14 x 36 for the tilt board); sx and sy fit them to the real board.
  const bw = (layout === 'ky037' ? 15 : 14) * mm;
  const bh = (layout === 'ky037' ? 34 : 32) * mm;
  const sx = bw / ((layout === 'tilt' ? 14 : 16.3) * mm);
  const sy = bh / (36 * mm);
  const micMm = Number(props.micMm) || 9.7;
  const micLen = (micMm > 8 ? 6.7 : 4.5) * mm;
  const ext = 6 * mm;
  const w = bw;
  const by = (layout === 'tilt' ? 11.5 : layout === 'fc' ? 6.5 : micLen / mm + 1.0) * mm;
  const h = by + bh + ext;
  const cx = w / 2;
  let s = '';
  const X = function (k) {
    return r2(cx + k * sx * mm);
  };
  const Y = function (k) {
    return r2(by + k * sy * mm);
  };
  const startX = r2((w - (names.length - 1) * p) / 2);
  const maxLen = prints.reduce((m, n) => {
    return Math.max(m, n.length);
  }, 0);
  const rotateLabels = maxLen * PIN_LABEL * 0.62 > p - 1.6;
  const edgePins = edgeHeader(T, { names, side: 'bottom', at: by + bh, from: startX, ext });
  const rowY = edgePins.pads[0].y;
  const labelSpan = rotateLabels ? T['pad-radius'] + 1.0 + maxLen * PIN_LABEL * 0.62 + 1.2 : T['label-rise'] + 3.6;
  const bottom = rowY - labelSpan;
  const frame = function (x, y, fw, fh) {
    return rect(x - 1.2, y - 1.2, fw + 2.4, fh + 2.4, 'none', {
      stroke: f.silk,
      'stroke-width': T['stroke-fine'],
      'stroke-opacity': 0.85,
      rx: 0.4,
    });
  };
  const passive = function (kind, x, y, horizontal) {
    const rw = horizontal ? 0.9 * p : 0.55 * p;
    const rh = horizontal ? 0.55 * p : 0.9 * p;
    const px = X(x);
    const py = Y(y);
    if (kind === 'mlcc') {
      const cw = horizontal ? 3.0 * mm : 1.5 * mm;
      const chh = horizontal ? 1.5 * mm : 3.0 * mm;
      return (
        frame(px, py, cw, chh) +
        tag(
          'smd',
          rect(px, py, cw, chh, T['cap-mlcc'], { rx: 0.4 }) +
            (horizontal
              ? rect(px, py, cw * 0.18, chh, T.lead, { rx: 0.3 }) +
                rect(px + cw * 0.82, py, cw * 0.18, chh, T.lead, { rx: 0.3 })
              : rect(px, py, cw, chh * 0.18, T.lead, { rx: 0.3 }) +
                rect(px, py + chh * 0.82, cw, chh * 0.18, T.lead, { rx: 0.3 })),
        )
      );
    }
    return frame(px, py, rw, rh) + smd(T, kind, px, py, horizontal);
  };
  const lamp = function (x, y, color, hook, state, on, label, where) {
    const isz = 0.6 * p;
    const lx = X(x);
    const ly = Y(y);
    let out = frame(lx, ly, isz, isz) + indicator({ x: lx, y: ly, size: isz, color, on, hook, state, finish: fin });
    if (where === 'right')
      out += text(lx + isz + 2.0, ly + isz / 2, label, 4, f.silk, {
        'text-anchor': 'start',
        'dominant-baseline': 'middle',
      });
    else out += text(lx + isz / 2, ly + isz + 4.0, label, 4, f.silk);
    return out;
  };
  const L =
    layout === 'fc'
      ? {
          holes: [
            [-6.3, 2.2],
            [6.3, 2.2],
          ],
          mount: [0.3, 24.5],
          mark: [-7.0, 27.2],
          chipX: -4.4,
          chipY: 14.0,
          trimX: 0.6,
          trimY: 11.0,
          code: '103',
          passives: [
            ['mlcc', -6.6, 6.2, true],
            ['mlcc', -6.6, 8.8, true],
            ['resistor', -7.3, 10.6, false],
            ['resistor', -5.0, 10.6, false],
            ['resistor', 3.6, 23.2, true],
            ['resistor', 3.6, 27.4, true],
          ],
          pwr: [4.6, 19.2, 'below'],
          dout: [-6.6, 24.0, 'right'],
        }
      : layout === 'tilt'
        ? {
            holes: [
              [-5.6, 2.2],
              [5.6, 2.2],
            ],
            mount: [-1.2, 23.0],
            mark: [4.0, 26.4],
            chipX: -3.6,
            chipY: 10.0,
            trimX: -0.2,
            trimY: 9.0,
            code: '103',
            passives: [
              ['resistor', -6.2, 5.6, false],
              ['resistor', -3.7, 5.6, false],
              ['capacitor', 1.2, 5.6, false],
              ['capacitor', 3.7, 5.6, false],
              ['resistor', -6.3, 17.6, true],
              ['resistor', 2.6, 17.6, true],
            ],
            pwr: [3.6, 20.4, 'below'],
            dout: [-6.3, 20.4, 'below'],
          }
        : {
            holes: [
              [-6.3, 2.2],
              [6.3, 2.2],
            ],
            mount: [0.3, 23.5],
            mark: [-1.2, 26.6],
            chipX: -4.0,
            chipY: 13.0,
            trimX: 0.6,
            trimY: 12.5,
            code: '104',
            passives: [
              ['resistor', -7.0, 9.6, false],
              ['resistor', -4.4, 9.6, false],
              ['resistor', 3.2, 5.6, false],
              ['resistor', 5.8, 5.6, false],
              ['resistor', -6.6, 20.4, true],
              ['resistor', 3.6, 20.4, true],
            ],
            pwr: [3.4, 23.5, 'below'],
            dout: [-5.8, 23.5, 'below'],
          };
  s += board({
    width: w,
    height: bh,
    y: by,
    finish: fin,
    holes: false,
    mark: { x: X(L.mark[0]), y: Y(L.mark[1]), size: 0.7 * p },
  });
  L.holes.forEach(c => {
    s += tag('hole', circle(X(c[0]), Y(c[1]), 0.8 * mm, T.hole, edge(T, T.pad, T['stroke-fine'])));
  });
  s += circle(X(L.mount[0]), Y(L.mount[1]), 2.2 * mm, 'none', {
    stroke: f.silk,
    'stroke-width': T['stroke-fine'],
    'stroke-opacity': 0.85,
  });
  s += tag('hole', circle(X(L.mount[0]), Y(L.mount[1]), 1.5 * mm, T.hole, edge(T, T.pad)));
  const hdr = header({
    x: startX,
    y: rowY,
    labels: prints,
    kind: 'print',
    side: 'above',
    silk: f.silk,
    rotate: rotateLabels,
  });
  edgePins.pads.forEach((pd, i) => {
    s += trace(T, fin, [
      [pd.x, pd.y],
      [pd.x, rowY - 1.1 * p],
      [pd.x + (i - (names.length - 1) / 2) * 0.3 * p, bottom - 0.2 * p],
    ]);
  });
  // The element at the top.
  // The element keeps its real size: E places it from the centre line in true millimetres.
  const padY = Y(3.6);
  const E = function (k) {
    return r2(cx + k * mm);
  };
  if (element === 'flame') {
    // The infrared LED lying along the board: dome past the end, the rim at the edge, legs bent down to the + and - pads.
    const lr = 2.5 * mm;
    const tip = by - 6.0 * mm;
    const base = by + 1.0 * mm;
    [E(-1.27), E(1.27)].forEach(x => {
      s += wire(x, base - 0.6, x, padY);
    });
    const dome = `M${E(-2.5)} ${r2(base)}V${r2(tip + lr)}A${r2(lr)} ${r2(lr)} 0 0 1 ${E(2.5)} ${r2(tip + lr)}V${r2(base)}Z`;
    s += tag(
      'element',
      path(dome, T['plastic-black'], edge(T, T['plastic-black-edge'], T['stroke-detail'])) +
        rect(
          E(-2.9),
          r2(base - 0.6 * mm),
          5.8 * mm,
          1.0 * mm,
          T['plastic-black'],
          Object.assign({ rx: 0.6 }, edge(T, T['plastic-black-edge'], T['stroke-detail'])),
        ),
    );
    s += path(dome, sheen('dome'), { 'fill-opacity': 0.75 });
    s += el('ellipse', {
      cx: E(-0.9),
      cy: r2(tip + lr * 0.75),
      rx: lr * 0.32,
      ry: lr * 0.16,
      fill: '#ffffff',
      'fill-opacity': 0.3,
      transform: `rotate(-30 ${E(-0.9)} ${r2(tip + lr * 0.75)})`,
    });
  } else if (element === 'ldr') {
    // The 5 mm photocell standing at the end, face out: the ceramic disc with its serpentine track, legs down to the pads.
    const pr = 2.5 * mm;
    const pcy = by - 2.6 * mm;
    [E(-1.27), E(1.27)].forEach(x => {
      s += wire(x, pcy + pr * 0.8, x, padY);
    });
    let track = '';
    for (let k = 0; k < 6; k++) {
      const ty0 = pcy - pr * 0.7 + k * pr * 0.28;
      track += `M${r2(cx - pr * 0.62)} ${r2(ty0)}h${r2(pr * 1.24)}${k < 5 ? `m${r2(k % 2 ? -pr * 1.24 : 0)} ${r2(pr * 0.14)}v0` : ''}`;
    }
    s += tag(
      'element',
      circle(cx, pcy, pr, T['cap-ceramic'], edge(T, T['resistor-body-edge'], T['stroke-detail'])) +
        path(track, 'none', { stroke: T['resistor-smd'], 'stroke-width': 1.1, 'stroke-linecap': 'round' }),
    );
    s += circle(cx, pcy, pr, sheen('lens'), { 'fill-opacity': 0.5 });
  } else if (element === 'cylinder') {
    // The brass tilt switch standing out past the end on its two legs, the rounded end outward, its black base at the edge.
    const cr = 2.0 * mm;
    const ctop = by - 11.0 * mm;
    const cbot = by + 1.0 * mm;
    [E(-1.27), E(1.27)].forEach(x => {
      s += wire(x, cbot - 0.6, x, padY);
    });
    const can = `M${E(-2)} ${r2(cbot)}V${r2(ctop + cr)}A${r2(cr)} ${r2(cr)} 0 0 1 ${E(2)} ${r2(ctop + cr)}V${r2(cbot)}Z`;
    s += tag(
      'element',
      path(can, T.brass, edge(T, T['brass-edge'])) +
        rect(E(-2), r2(cbot - 1.0 * mm), 4 * mm, 1.0 * mm, T['plastic-black'], { rx: 0.3 }),
    );
    s += path(can, sheen('metal'), { 'fill-opacity': 0.8 });
  } else if (element === 'mic') {
    // The electret capsule lying on its side past the end, seen along its can: the felt face outward, its rim, the legs bent down to the pads.
    const micR = (micMm * mm) / 2;
    const mtop = by - micLen - 0.5 * mm;
    const mbot = by - 0.5 * mm;
    [E(-1.27), E(1.27)].forEach(x => {
      s += wire(x, mbot - 0.6, x, padY);
    });
    s += tag(
      'element',
      rect(cx - micR, mtop, 2 * micR, micLen, T.metal, Object.assign({ rx: 0.8 }, edge(T, T['metal-edge']))) +
        rect(cx - micR + 0.4, mtop + 0.2, 2 * micR - 0.8, 0.9 * mm, T.cavity, { rx: 0.5 }) +
        rect(cx - micR, mtop + 1.1 * mm, 2 * micR, 0.5 * mm, T['metal-edge'], { 'fill-opacity': 0.6 }),
    );
    s += rect(cx - micR, mtop, 2 * micR, micLen, sheen('metal'), { rx: 0.8, 'fill-opacity': 0.7 });
  }
  [E(-1.27), E(1.27)].forEach(x => {
    s += tag('pad', circle(x, r2(padY), 2.2, T.pad) + circle(x, r2(padY), 0.9, T.hole));
  });
  s +=
    line(E(-4.4), r2(padY), E(-3.2), r2(padY), f.silk, 0.8) +
    line(E(-3.8), r2(padY - 0.6 * mm), E(-3.8), r2(padY + 0.6 * mm), f.silk, 0.8) +
    line(E(3.2), r2(padY), E(4.4), r2(padY), f.silk, 0.8);
  L.passives.forEach(q => {
    s += passive(q[0], q[1], q[2], q[3]);
  });
  // The blue trimmer: on the KY-037 the tall 3296 seen from above, its brass screw at the header end; on the others the square one with its dial, cross slot, arc arrow and code.
  const ts = 6.8 * mm;
  const tx = Math.min(X(L.trimX), r2(w - ts - 0.4 * mm));
  const ty = Y(L.trimY);
  const tcx = tx + ts / 2;
  const tcy = ty + ts / 2;
  const dr = 1.8 * mm;
  if (layout === 'ky037') {
    const tw = 4.8 * mm;
    const tl = 9.5 * mm;
    const qx = r2(tcx - tw / 2);
    const qy = r2(by + 9.4 * mm);
    const scx = qx + tw / 2;
    const scy = qy + tl - 1.9 * mm;
    const sr = 1.2 * mm;
    s += tag(
      'trimmer',
      rect(
        qx,
        qy,
        tw,
        tl,
        T['plastic-blue'],
        Object.assign({ rx: 0.5 }, edge(T, T['plastic-blue-edge'], T['stroke-fine'])),
      ) +
        bevel(T, qx, qy, tw, tl, 1.0, 0.5) +
        circle(scx, scy, sr, T.brass, edge(T, T['brass-edge'], T['stroke-fine'])) +
        line(scx - sr * 0.7, scy - sr * 0.7, scx + sr * 0.7, scy + sr * 0.7, T['brass-edge'], 0.7) +
        text(scx, qy + 3.4 * mm, L.code, 4, T['lens-white'], {
          'fill-opacity': 0.9,
          'dominant-baseline': 'middle',
          transform: `rotate(-90 ${r2(scx)} ${r2(qy + 3.4 * mm)})`,
        }),
    );
  } else
    s += tag(
      'trimmer',
      rect(
        tx,
        ty,
        ts,
        ts,
        T['lens-blue'],
        Object.assign({ rx: 1.6 }, edge(T, T['plastic-black-edge'], T['stroke-fine'])),
      ) +
        bevel(T, tx, ty, ts, ts, 1.2, 1.6) +
        path(
          `M${r2(tcx - dr * 1.45 * 0.5)} ${r2(tcy + dr * 1.45 * 0.866)}A${r2(dr * 1.45)} ${r2(dr * 1.45)} 0 1 1 ${r2(tcx + dr * 1.45 * 0.5)} ${r2(tcy + dr * 1.45 * 0.866)}`,
          'none',
          { stroke: T['lens-white'], 'stroke-width': 0.6, 'stroke-opacity': 0.9 },
        ) +
        path(
          `M${r2(tcx + dr * 1.45 * 0.5 - 1.6)} ${r2(tcy + dr * 1.45 * 0.866 - 1.4)}l1.8 1.3 -2.1 0.9z`,
          T['lens-white'],
          { 'fill-opacity': 0.9 },
        ) +
        circle(tcx, tcy, dr, T['cap-stripe'], edge(T, T['metal-edge'], T['stroke-fine'])) +
        line(tcx - dr * 0.7, tcy, tcx + dr * 0.7, tcy, T['metal-edge'], 0.7) +
        line(tcx, tcy - dr * 0.7, tcx, tcy + dr * 0.7, T['metal-edge'], 0.7) +
        text(tcx, ty + ts - 1.4, L.code, 4, T['lens-white'], { 'fill-opacity': 0.9 }),
    );
  // The LM393 in SOIC-8, its leads out to the sides.
  const cw = 3.9 * mm;
  const chl = 4.9 * mm;
  const chx = X(L.chipX) - cw / 2;
  const chy = Y(L.chipY);
  let chip = '';
  for (let li = 0; li < 4; li++) {
    const ly = chy + chl / 2 + (li - 1.5) * 1.27 * mm - 0.22 * mm;
    chip +=
      rect(chx - 1.0 * mm, ly, 1.0 * mm, 0.44 * mm, T.lead, { rx: 0.2 }) +
      rect(chx + cw, ly, 1.0 * mm, 0.44 * mm, T.lead, { rx: 0.2 });
  }
  chip +=
    rect(chx, chy, cw, chl, T.chip, Object.assign({ rx: 0.5 }, edge(T, T['chip-edge'], T['stroke-detail']))) +
    bevel(T, chx, chy, cw, chl, 1.0, 0.5) +
    circle(chx + 1.8, chy + 1.8, 0.6, T['chip-print']);
  chip += text(chx + cw / 2, chy + chl / 2, 'LM393', 4, T['chip-print'], {
    'dominant-baseline': 'middle',
    transform: `rotate(-90 ${r2(chx + cw / 2)} ${r2(chy + chl / 2)})`,
  });
  s += tag('chip', chip);
  // The lamps, each named on the silk: power, and the digital output.
  s += lamp(
    L.pwr[0],
    L.pwr[1],
    'red',
    'power-led',
    'power',
    !!(props.indicators && props.indicators.power),
    'PWR',
    L.pwr[2],
  );
  s += lamp(
    L.dout[0],
    L.dout[1],
    'green',
    'out-led',
    undefined,
    !!(props.indicators && props.indicators.out),
    'DO',
    L.dout[2],
  );
  s += edgePins.svg + hdr.svg;
  const what =
    element === 'flame'
      ? 'Flame sensor'
      : element === 'ldr'
        ? 'Light sensor (LDR)'
        : element === 'cylinder'
          ? 'Tilt switch'
          : 'Sound sensor';
  return art(w, h, props.description || `${what} module`, s, edgePins.pins);
}

/**
 * The three-pin sensor boards (KY class) as photographed, black 15 x
 * 18.5 mm, two holes at the far corners, one resistor in its silk frame,
 * the module's name on the silk, and the right-angle header at the near
 * end, its pins standing 6 mm past the edge with the board's print above
 * the pads (labels; S and - only, as the boards print them). Elements:
 * 'bead' (KY-013: the thermistor on its long legs from the pads in the
 * middle, the bead past the far end; the pins S, +, - from the left), 'ir'
 * (KY-022: the 38 kHz receiver standing at the far end, seen from above as
 * the top of its body with the dome facing out, the red indicator and its
 * resistor; the pins -, +, S from the left). The box is the board's width,
 * and its height runs from the bead to the pins' tips.
 */
export function smallSensorBoardTemplate(props) {
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'black';
  const f = finish(T, fin);
  const element = props.element || 'bead';
  const names = props.pins || (element === 'ir' ? ['GND', 'VCC', 'OUT'] : ['OUT', 'VCC', 'GND']);
  const prints = props.labels || (element === 'ir' ? ['-', '', 'S'] : ['S', '', '-']);
  const w = 15 * mm;
  const bh = 18.5 * mm;
  const ext = 6 * mm;
  const by = (element === 'bead' ? 7.0 : 0) * mm;
  const h = by + bh + ext;
  const cx = w / 2;
  let s = '';
  const X = function (k) {
    return r2(cx + k * mm);
  };
  const startX = r2((w - (names.length - 1) * p) / 2);
  const maxLen = prints.reduce((m, n) => {
    return Math.max(m, n.length);
  }, 0);
  const rotateLabels = maxLen * PIN_LABEL * 0.62 > p - 1.6;
  const edgePins = edgeHeader(T, { names, side: 'bottom', at: by + bh, from: startX, ext });
  const rowY = edgePins.pads[0].y;
  const labelSpan = rotateLabels ? T['pad-radius'] + 1.0 + maxLen * PIN_LABEL * 0.62 + 1.2 : T['label-rise'] + 3.6;
  const bottom = rowY - labelSpan;
  const frame = function (x, y, fw, fh) {
    return rect(x - 1.2, y - 1.2, fw + 2.4, fh + 2.4, 'none', {
      stroke: f.silk,
      'stroke-width': T['stroke-fine'],
      'stroke-opacity': 0.85,
      rx: 0.4,
    });
  };
  s += board({
    width: w,
    height: bh,
    y: by,
    finish: fin,
    holes: 'top',
    mark: { x: w - 1.4 * p, y: by + 9.6 * mm, size: 0.7 * p },
  });
  const hdr = header({
    x: startX,
    y: rowY,
    labels: prints,
    kind: 'print',
    side: 'above',
    silk: f.silk,
    rotate: rotateLabels,
  });
  edgePins.pads.forEach((pd, i) => {
    s += trace(T, fin, [
      [pd.x, pd.y],
      [pd.x, rowY - 1.1 * p],
      [pd.x + (i - (names.length - 1) / 2) * 0.3 * p, bottom - 0.2 * p],
    ]);
  });
  let pads = [];
  let padY;
  let resX = 3.0;
  let resY = 7.4;
  if (element === 'bead') {
    // The thermistor's legs from the pads across the board and past its end, the bead at their ends.
    const bcy = by - 4.6 * mm;
    padY = by + 8.4 * mm;
    resX = -5.2;
    [X(-1.27), X(1.27)].forEach(x => {
      s += wire(x, bcy + 1.4 * mm, x, padY);
    });
    s += tag(
      'element',
      el('ellipse', {
        cx,
        cy: r2(bcy),
        rx: 1.5 * mm,
        ry: 1.9 * mm,
        fill: T['plastic-black'],
        stroke: T['plastic-black-edge'],
        'stroke-width': T['stroke-detail'],
      }),
    );
    s += el('ellipse', { cx, cy: r2(bcy), rx: 1.5 * mm, ry: 1.9 * mm, fill: sheen('dome'), 'fill-opacity': 0.7 });
    pads = [X(-1.27), X(1.27)];
  } else if (element === 'ir') {
    // The 38 kHz receiver standing at the far end: the top of its body, the dome bulging from its face toward the end; its legs go down under it.
    const iw = 6.4 * mm;
    const id = 3.2 * mm;
    const itop = by + 2.9 * mm;
    const dr = 2.3 * mm;
    const dd = 2.0 * mm;
    padY = itop + id / 2;
    resY = 6.8;
    [X(-2.54), X(0), X(2.54)].forEach(x => {
      s += tag('pad', circle(x, r2(padY), 2.2, T.pad) + circle(x, r2(padY), 0.9, T.hole));
    });
    s += tag(
      'element',
      rect(
        X(-3.2),
        r2(itop),
        iw,
        id,
        T['plastic-black'],
        Object.assign({ rx: 0.8 }, edge(T, T['plastic-black-edge'])),
      ) +
        path(
          `M${X(-2.3)} ${r2(itop + 0.2)}A${r2(dr)} ${r2(dd)} 0 0 1 ${X(2.3)} ${r2(itop + 0.2)}Z`,
          T['plastic-black'],
          edge(T, T['plastic-black-edge'], T['stroke-detail']),
        ),
    );
    s +=
      bevel(T, X(-3.2), itop, iw, id, 0.8, 0.8) +
      path(`M${X(-2.3)} ${r2(itop + 0.2)}A${r2(dr)} ${r2(dd)} 0 0 1 ${X(2.3)} ${r2(itop + 0.2)}Z`, sheen('lens'), {
        'fill-opacity': 0.75,
      });
    s +=
      frame(cx - 5.2 * mm, by + 7.0 * mm, 0.6 * p, 0.6 * p) +
      indicator({
        x: cx - 5.2 * mm,
        y: by + 7.0 * mm,
        size: 0.6 * p,
        color: 'red',
        on: !!(props.indicators && props.indicators.power),
        hook: 'power-led',
        state: 'power',
        finish: fin,
      });
  }
  pads.forEach(x => {
    s += tag('pad', circle(x, r2(padY), 2.2, T.pad) + circle(x, r2(padY), 0.9, T.hole));
  });
  s +=
    frame(cx + resX * mm, by + resY * mm, 0.55 * p, 0.9 * p) +
    smd(T, 'resistor', cx + resX * mm, by + resY * mm, false);
  if (props.label)
    s += text(
      cx,
      by + (bh / mm - 6.6) * mm,
      props.label,
      Math.min(5, ((w - 2.4 * p) / Math.max(3, props.label.length)) * 1.5),
      f.silk,
    );
  s += edgePins.svg + hdr.svg;
  const what = element === 'bead' ? 'Temperature sensor (NTC)' : 'IR receiver';
  return art(w, h, props.description || `${what} module`, s, edgePins.pins);
}

export function sensorModuleTemplate(props) {
  props = props || {};
  const el0 = props.element || 'ldr';
  if (el0 === 'flame' || el0 === 'ldr' || el0 === 'mic' || el0 === 'cylinder') return comparatorBoardTemplate(props);
  if (el0 === 'bead' || el0 === 'ir') return smallSensorBoardTemplate(props);
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || (props.comparator ? 'blue' : 'black');
  const f = finish(T, fin);
  const names = props.pins || ['VCC', 'GND', 'DO', 'AO'];
  const w = (props.widthPitches || 6.5) * p;
  const h = (props.heightPitches || 14) * p;
  const rowY = h - 0.6 * p;
  let s = '';
  const element = props.element || 'ldr';
  const cx = w / 2;
  const startX = r2((w - (names.length - 1) * p) / 2);
  const maxLen = names.reduce((m, n) => {
    return Math.max(m, n.length);
  }, 0);
  const rotateLabels = maxLen * PIN_LABEL * 0.62 > p - 1.6;
  const labelSpan = rotateLabels ? T['pad-radius'] + 1.0 + maxLen * PIN_LABEL * 0.62 + 1.2 : T['label-rise'] + 3.6;
  const bottom = rowY - labelSpan;
  s += board({
    width: w,
    height: h,
    finish: fin,
    holes: w >= 5 * p ? 'top' : false,
    mark: w >= 6 * p ? { x: w - 1.4 * p, y: bottom - 1.0 * p, size: 0.7 * p } : undefined,
  });
  const hdr = header({ x: startX, y: rowY, labels: names, side: 'above', silk: f.silk, rotate: rotateLabels });
  hdr.pins.forEach((pn, i) => {
    s += trace(T, fin, [
      [pn.x, pn.y],
      [pn.x, rowY - 1.1 * p],
      [pn.x + (i - (names.length - 1) / 2) * 0.3 * p, bottom - 0.2 * p],
    ]);
  });
  // The element at the top.
  let ey = 2.4 * p;
  if (element === 'ldr') {
    // A 5 mm photocell: the ceramic disc with its serpentine track, seen face on, its two legs into the board.
    const lr = 2.5 * mm;
    ey = 1.2 * p + lr;
    s +=
      wire(cx - 1.0 * mm, ey + lr - 1, cx - 1.0 * mm, ey + lr + 1.2 * p) +
      wire(cx + 1.0 * mm, ey + lr - 1, cx + 1.0 * mm, ey + lr + 1.2 * p);
    let track = '';
    for (let k = 0; k < 6; k++) {
      const ty = ey - lr * 0.7 + k * lr * 0.28;
      track += `M${r2(cx - lr * 0.62)} ${r2(ty)}h${r2(lr * 1.24)}${k < 5 ? `m${r2(k % 2 ? -lr * 1.24 : 0)} ${r2(lr * 0.14)}v0` : ''}`;
    }
    s += tag(
      'element',
      circle(cx, ey, lr, T['cap-ceramic'], edge(T, T['resistor-body-edge'], T['stroke-detail'])) +
        path(track, 'none', { stroke: T['resistor-smd'], 'stroke-width': 1.1, 'stroke-linecap': 'round' }),
    );
    s += el('ellipse', {
      cx: cx - lr * 0.4,
      cy: ey - lr * 0.45,
      rx: lr * 0.3,
      ry: lr * 0.14,
      fill: '#ffffff',
      'fill-opacity': 0.35,
      transform: `rotate(-30 ${r2(cx - lr * 0.4)} ${r2(ey - lr * 0.45)})`,
    });
  } else if (element === 'mic') {
    // The 9.7 mm electret capsule: a metal can with its port, lying in the board's end.
    const mr = 4.85 * mm;
    ey = 1.0 * p + mr;
    s += tag(
      'element',
      circle(cx, ey, mr, T.metal, edge(T, T['metal-edge'])) +
        circle(cx, ey, mr * 0.75, '#000000', { 'fill-opacity': 0.08 }) +
        circle(cx, ey, mr * 0.22, T.cavity),
    );
    s += el('ellipse', {
      cx: cx - mr * 0.4,
      cy: ey - mr * 0.45,
      rx: mr * 0.35,
      ry: mr * 0.16,
      fill: '#ffffff',
      'fill-opacity': 0.5,
      transform: `rotate(-30 ${r2(cx - mr * 0.4)} ${r2(ey - mr * 0.45)})`,
    });
  } else if (element === 'bead') {
    // The thermistor bead on its two legs.
    ey = 1.6 * p;
    s +=
      wire(cx - 0.9 * mm, ey + 0.8 * mm, cx - 0.9 * mm, ey + 1.4 * p) +
      wire(cx + 0.9 * mm, ey + 0.8 * mm, cx + 0.9 * mm, ey + 1.4 * p);
    s += tag(
      'element',
      el('ellipse', {
        cx,
        cy: ey,
        rx: 1.5 * mm,
        ry: 1.9 * mm,
        fill: T['plastic-black'],
        stroke: T['plastic-black-edge'],
        'stroke-width': T['stroke-detail'],
      }),
    );
    s += el('ellipse', {
      cx: cx - 0.5 * mm,
      cy: ey - 0.7 * mm,
      rx: 0.5 * mm,
      ry: 0.3 * mm,
      fill: '#ffffff',
      'fill-opacity': 0.3,
    });
  } else if (element === 'cylinder') {
    // The tilt switch: a metal cylinder lying across the board's end.
    const cl = Math.min(w - 1.6 * p, 12 * mm);
    const cyl = 4 * mm;
    ey = 1.4 * p + cyl / 2;
    s += tag(
      'element',
      rect(cx - cl / 2, ey - cyl / 2, cl, cyl, T.metal, Object.assign({ rx: cyl / 2 }, edge(T, T['metal-edge']))) +
        rect(cx - cl / 2 + 1.5, ey - cyl / 2 + 1.2, cl - 3, cyl * 0.3, '#ffffff', {
          rx: 1,
          'fill-opacity': T['opacity-light'] * 0.6,
        }) +
        rect(cx - cl / 2 + 1.5, ey + cyl * 0.2, cl - 3, cyl * 0.22, '#000000', {
          rx: 1,
          'fill-opacity': T['opacity-shade'],
        }),
    );
    s += wire(cx - cl / 2 - 0.6 * p, ey, cx - cl / 2, ey) + wire(cx + cl / 2, ey, cx + cl / 2 + 0.6 * p, ey);
  } else if (element === 'ir') {
    // The 38 kHz receiver: a black body with its dome lens, three legs into the board.
    const iw = 6.5 * mm;
    const ih = 5.5 * mm;
    ey = 1.2 * p + ih / 2;
    [cx - 1.0 * p, cx, cx + 1.0 * p].forEach(x => {
      s += wire(x, ey + ih / 2 - 1, x, ey + ih / 2 + 1.0 * p);
    });
    s += tag(
      'element',
      rect(
        cx - iw / 2,
        ey - ih / 2,
        iw,
        ih,
        T['plastic-black'],
        Object.assign({ rx: 1.5 }, edge(T, T['plastic-black-edge'])),
      ) +
        circle(cx, ey, 2.2 * mm, T['plastic-black'], edge(T, T['plastic-black-edge'], T['stroke-detail'])) +
        circle(cx, ey, 2.2 * mm, '#ffffff', { 'fill-opacity': 0.06 }),
    );
    s += el('ellipse', {
      cx: cx - 0.8 * mm,
      cy: ey - 0.9 * mm,
      rx: 0.8 * mm,
      ry: 0.4 * mm,
      fill: '#ffffff',
      'fill-opacity': 0.25,
      transform: `rotate(-30 ${r2(cx - 0.8 * mm)} ${r2(ey - 0.9 * mm)})`,
    });
  }
  // The title under the element, then the comparator block where the board has one.
  const ty =
    ey +
    (element === 'mic' ? 4.85 * mm : element === 'cylinder' ? 2 * mm : 2.5 * mm) +
    1.3 * p +
    (element === 'bead' || element === 'cylinder' ? 0.6 * p : 0);
  if (props.label)
    s += text(cx, ty, props.label, Math.min(5, ((w - 1.4 * p) / Math.max(4, props.label.length)) * 1.5), f.silk);
  const by = ty + Math.max(0.5 * p, (bottom - ty - 3.8 * p) / 2);
  if (props.comparator && bottom - by >= 3.2 * p) {
    const ch = 1.0 * p;
    const chx = cx - 1.9 * p;
    const chy = by + 0.4 * p;
    s += tag(
      'chip',
      rect(chx, chy, 1.3 * p, ch, T.chip, Object.assign({ rx: 0.5 }, edge(T, T['chip-edge'], T['stroke-detail']))) +
        circle(chx + 2, chy + 2, 0.5, T['chip-print']),
    );
    for (let li = 0; li < 4; li++)
      s +=
        rect(chx + 1.5 + li * 2.6, chy - 1.3, 1.2, 1.3, T.lead, { rx: 0.2 }) +
        rect(chx + 1.5 + li * 2.6, chy + ch, 1.2, 1.3, T.lead, { rx: 0.2 });
    const tx = cx + 0.5 * p;
    const tsz = 1.0 * p;
    s += tag(
      'trimmer',
      rect(
        tx,
        by + 0.3 * p,
        tsz,
        tsz,
        T['lens-blue'],
        Object.assign({ rx: 0.3 }, edge(T, T['plastic-black-edge'], T['stroke-fine'])),
      ) +
        circle(tx + tsz / 2, by + 0.3 * p + tsz / 2, 0.28 * p, T.metal, edge(T, T['metal-edge'], T['stroke-fine'])) +
        line(
          tx + tsz / 2 - 0.2 * p,
          by + 0.3 * p + tsz / 2,
          tx + tsz / 2 + 0.2 * p,
          by + 0.3 * p + tsz / 2,
          T['metal-edge'],
          T['stroke-fine'],
        ),
    );
    const iy = by + 1.9 * p;
    s += indicator({
      x: cx - 1.9 * p,
      y: iy,
      size: 0.6 * p,
      color: 'red',
      on: !!(props.indicators && props.indicators.power),
      hook: 'power-led',
      state: 'power',
      finish: fin,
    });
    s += indicator({
      x: cx - 0.7 * p,
      y: iy,
      size: 0.6 * p,
      color: 'green',
      on: !!(props.indicators && props.indicators.out),
      hook: 'out-led',
      finish: fin,
    });
    s += smd(T, 'resistor', cx + 0.6 * p, iy - 0.05 * p, true) + smd(T, 'resistor', cx + 0.6 * p, iy + 0.55 * p, true);
    if (bottom - (iy + 1.3 * p) >= 1.0 * p)
      s += smd(T, 'capacitor', cx - 1.7 * p, iy + 1.1 * p, true) + smd(T, 'resistor', cx + 0.1 * p, iy + 1.1 * p, true);
  } else if (!props.comparator && bottom - by >= 1.4 * p) {
    // A bare module: the one series resistor and a capacitor beside the element's legs.
    s += smd(T, 'resistor', cx - 1.4 * p, by + 0.2 * p, true) + smd(T, 'capacitor', cx + 0.4 * p, by + 0.2 * p, true);
  }
  s += hdr.svg;
  return art(w, h, props.description || `${props.label || 'Sensor'} module`, s, hdr.pins);
}

/** A TO-92 package in elevation, flat face to the viewer: the black body with its rounded shoulders, the part print, three legs splayed to the grid. */
export function to92Template(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const w = 4 * p;
  const h = 5 * p;
  const names = props.pins || ['GND', 'DQ', 'VCC'];
  const label = props.label || 'DS18B20';
  let s = '';
  const cx = 2 * p;
  const bw = 4.7 * (p / 2.54);
  const bh = 4.6 * (p / 2.54);
  const bx = cx - bw / 2;
  const by = 0.9 * p;
  // Legs first, under the body: from the body's bottom to the pins, bent out to one pitch.
  names.forEach((_, i) => {
    const x = (i + 1) * p;
    const dx = (i - 1) * 1.27 * (p / 2.54);
    const d = `M${r2(cx + dx)} ${r2(by + bh - 1)}V${r2(by + bh + 0.9 * p)}L${r2(x)} ${r2(by + bh + 1.7 * p)}V${r2(h)}`;
    s += tag(
      'leg',
      path(d, 'none', {
        stroke: T['lead-edge'],
        'stroke-width': 2.9,
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round',
      }) +
        path(d, 'none', { stroke: T.lead, 'stroke-width': 1.9, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }),
    );
  });
  s += tag(
    'body',
    path(
      `M${r2(bx)} ${r2(by + bh)}V${r2(by + 2.2)}a2.2 2.2 0 0 1 2.2 -2.2H${r2(bx + bw - 2.2)}a2.2 2.2 0 0 1 2.2 2.2V${r2(by + bh)}Z`,
      T['plastic-black'],
      Object.assign({ 'stroke-linejoin': 'round' }, edge(T, T['plastic-black-edge'])),
    ),
  );
  s += rect(bx + 1.2, by + 1.2, bw - 2.4, 1.6, '#ffffff', { rx: 0.8, 'fill-opacity': T['opacity-light'] * 0.5 });
  const cut = /^[A-Za-z]+(?=\d)/.exec(label);
  const a = cut ? label.slice(0, cut[0].length) : label.slice(0, 3);
  const b = cut ? label.slice(cut[0].length) : label.slice(3);
  s +=
    text(cx, by + bh / 2 - 0.4, a, PIN_LABEL, T['chip-print'], { 'font-weight': 600 }) +
    text(cx, by + bh / 2 + PIN_LABEL + 0.2, b, PIN_LABEL, T['chip-print']);
  return art(
    w,
    h,
    `${label} in a TO-92 package`,
    s,
    names.map((n, i) => {
      return { name: n, x: (i + 1) * p, y: h };
    }),
  );
}

/**
 * The bare DHT22 (AM2302) as photographed: the 15.1 x 25.1 mm white
 * housing, its tab at the top with the mounting hole and chamfered
 * corners, the grille under it (three columns of square vents, and in the
 * five rows under the first a slot each side, open through the side), the
 * plain band with the AM2302 print, and four legs on the grid. The box is
 * 6.5 x 12 pitches.
 */
export function dht22Sensor(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const w = 6.5 * p;
  const h = 12 * p;
  const names = props.pins || ['VCC', 'SDA', 'NC', 'GND'];
  let s = '';
  const hw = 15.1 * mm;
  const hh = 25.1 * mm;
  const hx = (w - hw) / 2;
  const hy = 0.4 * p;
  const cx = w / 2;
  const xs = [1.75 * p, 2.75 * p, 3.75 * p, 4.75 * p];
  const Y = function (k) {
    return r2(hy + k * mm);
  };
  const ch = 2.8 * mm;
  const rc = 1.2;
  xs.forEach(x => {
    s += wire(x, hy + hh - 1, x, h);
  });
  // The outline: the tab's chamfers meet the full width 3.6 mm under the top; the grille's frame starts at 4.4 mm.
  s += tag(
    'housing',
    path(
      `M${r2(hx + ch)} ${r2(hy)}H${r2(hx + hw - ch)}L${r2(hx + hw)} ${Y(3.6)}V${r2(hy + hh - rc)}Q${r2(hx + hw)} ${r2(hy + hh)} ${r2(hx + hw - rc)} ${r2(
        hy + hh,
      )}H${r2(hx + rc)}Q${r2(hx)} ${r2(hy + hh)} ${r2(hx)} ${r2(hy + hh - rc)}V${Y(3.6)}Z`,
      T['plastic-white'],
      Object.assign({ 'stroke-linejoin': 'round' }, edge(T, T['plastic-white-edge'])),
    ),
  );
  s +=
    line(r2(hx + ch + 1), r2(hy + 0.9), r2(hx + hw - ch - 1), r2(hy + 0.9), '#ffffff', 0.9, { 'stroke-opacity': 0.7 }) +
    line(r2(hx + 0.4), Y(4.4), r2(hx + hw - 0.4), Y(4.4), T['plastic-white-edge'], T['stroke-fine'], {
      'stroke-opacity': 0.8,
    });
  s += circle(cx, Y(2.3), 1.4 * mm, T.hole, edge(T, T['plastic-white-edge'], T['stroke-fine']));
  // The grille: square vents in three columns 2.25 mm apart, rows 2.45 mm apart; the slots run out through both sides.
  const vw = 1.1 * mm;
  const vh = 1.0 * mm;
  const vent = function (x0, x1, y) {
    return rect(r2(x0), r2(y - vh / 2), r2(x1 - x0), r2(vh), T.cavity, { rx: 0.4, 'fill-opacity': 0.85 });
  };
  for (let r = 0; r < 6; r++) {
    const vy = hy + (5.9 + r * 2.45) * mm;
    [-2.25, 0, 2.25].forEach(k => {
      s += vent(cx + k * mm - vw / 2, cx + k * mm + vw / 2, vy);
    });
    if (r > 0) s += vent(hx - 0.5, hx + 3.7 * mm, vy) + vent(hx + hw - 3.7 * mm, hx + hw + 0.5, vy);
  }
  s += text(cx, Y(21.9), 'AM2302', 5.5, T['plastic-white-edge'], { 'font-weight': 600 });
  return art(
    w,
    h,
    'DHT22 temperature and humidity sensor',
    s,
    xs.map((x, i) => {
      return { name: names[i], x, y: h };
    }),
  );
}

/**
 * The DHT11 module as photographed: a black 14 x 28 mm board, the blue
 * 12 x 15.5 mm housing at the far end (three columns of square vents, and
 * in the rows under the first a slot each side, open through the side),
 * the plain hole under it, the power LED and its resistor down the left,
 * the pull-up on the right, and the three pins on the right-angle header
 * standing past the near end, GND, DATA, VCC printed above the joints
 * (labels). The box is the board's width, its height running to the pins'
 * tips.
 */
export function dht11Module(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'black';
  const f = finish(T, fin);
  const names = props.pins || ['GND', 'DATA', 'VCC'];
  const prints = props.labels || names;
  let s = '';
  const w = 14 * mm;
  const bh = 28 * mm;
  const cx = w / 2;
  const edgePins = edgeHeader(T, { names, side: 'bottom', at: bh, from: r2(cx - ((names.length - 1) * p) / 2) });
  const h = edgePins.pins[0].y;
  s += board({ width: w, height: bh, finish: fin, holes: false, mark: { x: 9.4 * mm, y: 20.0 * mm, size: 0.6 * p } });
  // The housing and its grille: squares 2.2 mm apart in rows 2.55 mm apart; the slots run out through both sides.
  const hw = 12 * mm;
  const hh = 15.5 * mm;
  const hx = (w - hw) / 2;
  const hy = 0.8 * mm;
  const vw = 1.4 * mm;
  const vh = 1.3 * mm;
  const vent = function (x0, x1, y) {
    return rect(r2(x0), r2(y - vh / 2), r2(x1 - x0), r2(vh), T.cavity, { rx: 0.4, 'fill-opacity': 0.8 });
  };
  s += tag(
    'housing',
    rect(hx, hy, hw, hh, T['plastic-blue'], Object.assign({ rx: 1.0 }, edge(T, T['plastic-blue-edge']))),
  );
  s += bevel(T, hx, hy, hw, hh, 1.6, 1.0);
  for (let r = 0; r < 5; r++) {
    const vy = hy + (2.6 + r * 2.55) * mm;
    [-2.2, 0, 2.2].forEach(k => {
      s += vent(cx + k * mm - vw / 2, cx + k * mm + vw / 2, vy);
    });
    if (r > 0) s += vent(hx - 0.5, hx + 2.4 * mm, vy) + vent(hx + hw - 2.4 * mm, hx + hw + 0.5, vy);
  }
  s += tag('hole', circle(cx, 19.6 * mm, 1.5 * mm, T.hole, edge(T, f.edge)));
  // The power LED and its resistor down the left, the pull-up on the right, each in its silk frame.
  s += framed(T, f, 'resistor', 1.0 * mm, 16.9 * mm, false);
  s +=
    rect(1.0 * mm - 1.2, 20.1 * mm - 1.2, 0.55 * p + 2.4, 0.55 * p + 2.4, 'none', {
      stroke: f.silk,
      'stroke-width': T['stroke-fine'],
      'stroke-opacity': 0.85,
      rx: 0.4,
    }) +
    indicator({
      x: 1.0 * mm,
      y: 20.1 * mm,
      size: 0.55 * p,
      color: 'red',
      on: !!(props.indicators && props.indicators.power),
      hook: 'power-led',
      state: 'power',
      finish: fin,
    });
  s += framed(T, f, 'resistor', w - 1.0 * mm - 0.55 * p, 16.9 * mm, false);
  const hdr = header({
    x: edgePins.pads[0].x,
    y: edgePins.pads[0].y,
    labels: prints,
    kind: 'print',
    side: 'above',
    silk: f.silk,
  });
  s += edgePins.svg + hdr.svg;
  return art(w, h, props.description || 'DHT11 module', s, edgePins.pins);
}

/**
 * The HC-SR04 ultrasonic ranger as photographed: the blue 45 x 20 mm
 * board with a hole at each corner, the two 16 mm transducers (the
 * aluminium can round its dark woven mesh), T beside the transmitter and
 * R beside the receiver, the crystal at the top between them, the name in
 * the middle, and the four pins on the right-angle header behind the
 * board, standing past its bottom edge with their names printed upright
 * above the joints (labels). The drivers are on the back. The box is the
 * board's width, its height running to the pins' tips.
 */
export function ultrasonicRanger(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'blue';
  const f = finish(T, fin);
  const names = props.pins || ['VCC', 'TRIG', 'ECHO', 'GND'];
  const prints = props.labels || ['Vcc', 'Trig', 'Echo', 'Gnd'];
  const w = 45 * mm;
  const bh = 20 * mm;
  const cx = w / 2;
  const cy = 9.6 * mm;
  const r = 8 * mm;
  let s = '';
  const edgePins = edgeHeader(T, {
    names,
    side: 'bottom',
    at: bh,
    from: r2(cx - ((names.length - 1) * p) / 2),
    back: true,
  });
  const h = edgePins.pins[0].y;
  s += board({ width: w, height: bh, finish: fin, holes: false });
  [
    [1.7, 1.7],
    [43.3, 1.7],
    [1.7, 18.3],
    [43.3, 18.3],
  ].forEach(c => {
    s += tag('hole', circle(c[0] * mm, c[1] * mm, 0.9 * mm, T.hole, edge(T, T.pad)));
  });
  // The transducers: the aluminium can, its rolled lip, the woven mesh over the dark cavity.
  [cx - 13 * mm, cx + 13 * mm].forEach(x => {
    const m = r * 0.78;
    let weave = '';
    for (let d = -m + 0.5 * mm; d < m; d += 0.5 * mm) {
      const c = Math.sqrt(m * m - d * d);
      weave +=
        line(r2(x - c), r2(cy + d), r2(x + c), r2(cy + d), '#ffffff', T['stroke-fine']) +
        line(r2(x + d), r2(cy - c), r2(x + d), r2(cy + c), '#ffffff', T['stroke-fine']);
    }
    s += tag(
      'can',
      circle(x, cy, r, T.metal, edge(T, T['metal-edge'])) +
        circle(x, cy, r, sheen('metal'), { 'fill-opacity': 0.6 }) +
        circle(x, cy, r * 0.88, 'none', {
          stroke: T['metal-edge'],
          'stroke-width': T['stroke-fine'],
          'stroke-opacity': 0.8,
        }) +
        circle(x, cy, m, T['plastic-black'], edge(T, T['metal-edge'], T['stroke-fine'])),
    );
    s += el('g', { opacity: 0.14 }, weave) + circle(x, cy, m, sheen('dome'), { 'fill-opacity': 0.25 });
  });
  // The crystal lying across the top between the cans, the name under it, T and R by the bottom corners.
  s += tag(
    'crystal',
    rect(
      cx - 4 * mm,
      1.3 * mm,
      8 * mm,
      3.2 * mm,
      T.metal,
      Object.assign({ rx: 1.6 * mm }, edge(T, T['metal-edge'], T['stroke-fine'])),
    ) +
      rect(cx - 3.2 * mm, 1.8 * mm, 6.4 * mm, 0.7 * mm, '#ffffff', {
        rx: 0.35 * mm,
        'fill-opacity': T['opacity-light'] * 0.6,
      }),
  );
  s += text(cx, 8.6 * mm, props.label || 'HC-SR04', 5, f.silk, { 'font-weight': 600 });
  s += text(4.4 * mm, 19.0 * mm, 'T', PIN_LABEL, f.silk) + text(w - 4.4 * mm, 19.0 * mm, 'R', PIN_LABEL, f.silk);
  const hdr = header({
    x: edgePins.pads[0].x,
    y: edgePins.pads[0].y,
    labels: prints,
    kind: 'print',
    side: 'above',
    silk: f.silk,
    rotate: true,
  });
  s += edgePins.svg + hdr.svg;
  return art(w, h, props.description || 'Ultrasonic distance sensor (HC-SR04)', s, edgePins.pins);
}

/**
 * The BMP180 breakouts as photographed, at their true sizes. variant
 * 'five-pin' (default): the blue 15 x 13 mm module, its header down the
 * left edge with the names printed beside it (VCC, GND, SCL, SDA, 3.3V top
 * to bottom), the 662K regulator and its passives down the middle, the
 * hole top right and the metal-lid sensor bottom right. variant 'gy68':
 * the blue 10 x 12.5 mm GY-68, its four pins along the top edge (SDA, SCL,
 * GND, VCC from the left as the front shows them; the names are printed on
 * the back only), the passives and the 662K under them, the BMP180 print,
 * the sensor bottom left and the hole bottom right.
 */
export function bmp180Board(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'blue';
  const f = finish(T, fin);
  const variant = props.variant === 'gy68' ? 'gy68' : 'five-pin';
  let s = '';
  const M = function (k) {
    return r2(k * mm);
  };
  const lga = function (x, y) {
    const hw = 1.8 * mm;
    const hh = 1.9 * mm;
    return (
      tag(
        'chip',
        rect(
          x - hw,
          y - hh,
          2 * hw,
          2 * hh,
          T.metal,
          Object.assign({ rx: 1 }, edge(T, T['metal-edge'], T['stroke-detail'])),
        ) +
          rect(x - hw + 0.5, y - hh + 0.5, 2 * hw - 1, 0.9, '#ffffff', {
            rx: 0.4,
            'fill-opacity': T['opacity-light'] * 0.5,
          }) +
          circle(x + hw * 0.45, y + hh * 0.45, hw * 0.2, T.cavity),
      ) + text(x, y + 1.4, '244', 4, T['chip-edge'], { 'fill-opacity': 0.8 })
    );
  };
  // The 662K regulator (SOT-23) lying across: one lead up, two down.
  const regulator = function (x, y) {
    const bw = 2.9 * mm;
    const bh = 1.3 * mm;
    const r =
      rect(x - 0.5 * mm, y - bh / 2 - 0.55 * mm, 1.0 * mm, 0.55 * mm, T.lead, { rx: 0.2 }) +
      rect(x - 1.45 * mm, y + bh / 2, 1.0 * mm, 0.55 * mm, T.lead, { rx: 0.2 }) +
      rect(x + 0.45 * mm, y + bh / 2, 1.0 * mm, 0.55 * mm, T.lead, { rx: 0.2 });
    return tag(
      'smd',
      r +
        rect(
          x - bw / 2,
          y - bh / 2,
          bw,
          bh,
          T.chip,
          Object.assign({ rx: 0.4 }, edge(T, T['chip-edge'], T['stroke-detail'])),
        ) +
        text(x, y + 1.4, '662K', 4, T['chip-print']),
    );
  };
  if (variant === 'gy68') {
    const w = 10 * mm;
    const h = 12.5 * mm;
    const names = props.pins || ['SDA', 'SCL', 'GND', 'VCC'];
    s += board({ width: w, height: h, finish: fin, holes: false });
    const hdr = header({ x: r2((w - (names.length - 1) * p) / 2), y: M(1.6), count: names.length });
    hdr.pins.forEach((pn, i) => {
      pn.name = names[i];
    });
    s +=
      smd(T, 'resistor', M(0.3), M(3.45), false) +
      smd(T, 'capacitor', M(2.0), M(3.45), false) +
      regulator(M(5.7), M(4.6)) +
      smd(T, 'capacitor', M(8.3), M(3.45), false);
    s += text(M(6.9), M(7.3), 'BMP180', 4.6, f.silk, { 'font-weight': 600 });
    s += lga(M(2.2), M(9.4));
    s += mountHole(T, f, M(7.1), M(9.7), 1.5 * mm);
    s += hdr.svg;
    return art(w, h, 'BMP180 breakout (GY-68)', s, hdr.pins);
  }
  const w2 = 15 * mm;
  const h2 = 13 * mm;
  const names2 = props.pins || ['VCC', 'GND', 'SCL', 'SDA', '3.3V'];
  const py = r2((h2 - (names2.length - 1) * p) / 2);
  s += board({ width: w2, height: h2, finish: fin, holes: false });
  s += rect(M(0.35), M(0.35), M(6.6), h2 - M(0.7), 'none', {
    rx: 0.6,
    stroke: f.silk,
    'stroke-width': T['stroke-fine'],
    'stroke-opacity': 0.85,
  });
  const hdr2 = header({ x: M(1.4), y: py, axis: 'y', labels: names2, side: 'right', silk: f.silk, size: 4.6 });
  s +=
    framed(T, f, 'capacitor', M(7.2), M(1.9), true) +
    regulator(M(8.4), M(5.6)) +
    framed(T, f, 'capacitor', M(7.2), M(7.3), true) +
    framed(T, f, 'resistor', M(7.2), M(9.3), true) +
    framed(T, f, 'resistor', M(7.2), M(11.1), true);
  s += framed(T, f, 'capacitor', M(10.9), M(6.4), true);
  s += mountHole(T, f, M(12.8), M(2.7), 1.6 * mm);
  s +=
    rect(M(10.3), M(8.4), M(4.2), M(4.1), 'none', {
      rx: 0.4,
      stroke: f.silk,
      'stroke-width': T['stroke-fine'],
      'stroke-opacity': 0.85,
    }) + lga(M(12.4), M(10.45));
  s += hdr2.svg;
  return art(w2, h2, 'BMP180 breakout', s, hdr2.pins);
}

/**
 * The HC-SR501 PIR motion module from the dome side, as photographed: a green
 * 32 x 25 mm board almost covered by the 21 mm white Fresnel dome on its
 * square base, a hole at each side and the three pins at the bottom edge,
 * GND, OUT, VCC from the left as the back prints them. The trimmers and the
 * trigger jumper sit on the back with the controller. The box is 12.5 x 10
 * pitches.
 */
export function pirModule(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const fin = props.finish || 'green';
  const f = finish(T, fin);
  const w = 12.5 * p;
  const h = 10 * p;
  const names = props.pins || ['GND', 'OUT', 'VCC'];
  let s = '';
  const cx = w / 2;
  const cy = 4.3 * p;
  const r = 4.0 * p;
  s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: 0.5 * p, y: 1.4 * p, size: 0.7 * p } });
  [
    [0.7 * p, 4.6 * p],
    [w - 0.7 * p, 4.6 * p],
  ].forEach(c => {
    s += tag('hole', circle(c[0], c[1], T['mount-hole-radius'], T.hole, edge(T, T.pad)));
  });
  const hdr = padRow(T, fin, f, { x: 5.25 * p, y: h - 0.6 * p, labels: names, side: 'above', silk: f.silk }, -1);
  // The dome: its square base, the lens with its facet rings and radial cuts, the sheen.
  s += tag(
    'dome',
    rect(
      cx - r,
      cy - r,
      2 * r,
      2 * r,
      T['plastic-white'],
      Object.assign({ rx: 1.2, 'fill-opacity': 0.9 }, edge(T, T['plastic-white-edge'], T['stroke-fine'])),
    ) + circle(cx, cy, r, T['plastic-white'], edge(T, T['plastic-white-edge'])),
  );
  s +=
    circle(cx, cy, r * 0.52, 'none', { stroke: T['plastic-white-edge'], 'stroke-width': T['stroke-fine'] }) +
    circle(cx, cy, r * 0.8, 'none', {
      stroke: T['plastic-white-edge'],
      'stroke-width': T['stroke-fine'],
      'stroke-opacity': 0.7,
    });
  let cuts = '';
  for (let k = 0; k < 6; k++) {
    const a = (k * Math.PI) / 3 + Math.PI / 6;
    cuts += `M${r2(cx + Math.cos(a) * r * 0.52)} ${r2(cy + Math.sin(a) * r * 0.52)}L${r2(cx + Math.cos(a) * r * 0.98)} ${r2(cy + Math.sin(a) * r * 0.98)}`;
  }
  s +=
    path(cuts, 'none', { stroke: T['plastic-white-edge'], 'stroke-width': T['stroke-fine'] }) +
    circle(cx, cy, 1.2, T['plastic-white-edge']);
  s += circle(cx, cy, r, sheen('dome'), { 'fill-opacity': 0.55 });
  s += hdr.svg;
  return art(w, h, 'PIR motion sensor module', s, hdr.pins);
}

/**
 * The MQ gas sensor module as photographed: a blue 20 x 32 mm board, the
 * 18 mm black base ring with the stainless mesh can on it filling the far
 * end, two holes, the label on the silk, and the right-angle header at the
 * near end, its four pins standing 6 mm past the edge with the board's
 * print above the pads (labels); the comparator and trimmer sit on the
 * back of the real board. `indicators` draws the PWR and DO lamps on this
 * side between the holes (`power-led`, `out-led`), for an editor that
 * lights them. The box is 8 pitches wide, the board 13 pitches long.
 */
export function gasModuleTemplate(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'blue';
  const f = finish(T, fin);
  const w = 8 * p;
  const bh = 13 * p;
  const h = bh + 6 * mm;
  const names = props.pins || ['VCC', 'GND', 'DO', 'AO'];
  const prints = props.labels || names;
  let s = '';
  const cx = w / 2;
  const cy = 4.2 * p;
  const rr = 9 * mm;
  const rm = 8 * mm;
  s += board({ width: w, height: bh, finish: fin, holes: false, mark: { x: w - 1.3 * p, y: 9.6 * p, size: 0.7 * p } });
  [
    [0.75 * p, 8.7 * p],
    [w - 0.75 * p, 8.7 * p],
  ].forEach(c => {
    s += tag('hole', circle(c[0], c[1], T['mount-hole-radius'], T.hole, edge(T, T.pad)));
  });
  const edgePins = edgeHeader(T, { names, side: 'bottom', at: bh, from: 2.5 * p });
  const hdr = padRow(
    T,
    fin,
    f,
    {
      x: 2.5 * p,
      y: edgePins.pads[0].y,
      labels: prints,
      kind: 'print',
      side: 'above',
      silk: f.silk,
      rotate: prints.some(n => {
        return n.length > 3;
      }),
    },
    -1,
  );
  s += tag(
    'can',
    circle(cx, cy, rr, T['plastic-black'], edge(T, T['plastic-black-edge'])) +
      circle(cx, cy, rm, T.metal, edge(T, T['metal-edge'])),
  );
  // The mesh: chords across the can both ways.
  let mesh = '';
  for (let k = -6; k <= 6; k++) {
    const d = (k * rm) / 6.5;
    const c = Math.sqrt(Math.max(0, rm * rm - d * d)) * 0.985;
    mesh += `M${r2(cx - c)} ${r2(cy + d)}H${r2(cx + c)}M${r2(cx + d)} ${r2(cy - c)}V${r2(cy + c)}`;
  }
  s += path(mesh, 'none', { stroke: T['metal-edge'], 'stroke-width': 0.5, 'stroke-opacity': 0.75 });
  s += circle(cx, cy, rm, sheen('metal'), { 'fill-opacity': 0.55 });
  s += text(cx, 9.9 * p, props.label || 'MQ-2', 4.6, f.silk, { 'font-weight': 600 });
  if (props.indicators) {
    const isz = 0.6 * p;
    const ly = 8.1 * p;
    const tag2 = { 'text-anchor': 'start', 'dominant-baseline': 'middle' };
    s +=
      indicator({
        x: 2.0 * p,
        y: ly,
        size: isz,
        color: 'red',
        on: !!props.indicators.power,
        hook: 'power-led',
        state: 'power',
        finish: fin,
      }) + text(2.0 * p + isz + 1.6, ly + isz / 2, 'PWR', 4, f.silk, tag2);
    s +=
      indicator({
        x: 4.6 * p,
        y: ly,
        size: isz,
        color: 'green',
        on: !!props.indicators.out,
        hook: 'out-led',
        finish: fin,
      }) + text(4.6 * p + isz + 1.6, ly + isz / 2, 'DO', 4, f.silk, tag2);
  }
  s += edgePins.svg + hdr.svg;
  return art(w, h, `${props.label || 'MQ-2'} gas sensor module`, s, edgePins.pins);
}

/**
 * The SparkFun HX711 load cell amplifier as photographed: a red 32 x 24 mm
 * board, holes at the corners, the five load-cell pads (RED, BLK, WHT,
 * GRN, YLW) down the left edge and the catalog's pins with VDD down the
 * right, the HX711 in SOIC-16 across the middle, two cans and the
 * resistors round it, the title on the silk. The box is 12.5 x 9.5 pitches.
 */
export function hx711Board(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const fin = props.finish || 'red';
  const f = finish(T, fin);
  const w = 12 * p;
  const h = 9.5 * p;
  let s = '';
  const names = props.pins || ['VCC', 'DT', 'SCK', 'GND'];
  const cells = props.cellPads || ['RED', 'BLK', 'WHT', 'GRN', 'YLW'];
  s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: 5.6 * p, y: 7.5 * p, size: 0.7 * p } });
  [
    [1.0 * p, 0.8 * p],
    [w - 1.0 * p, 0.8 * p],
    [1.0 * p, h - 0.8 * p],
    [w - 1.0 * p, h - 0.8 * p],
  ].forEach(c => {
    s += tag('hole', circle(c[0], c[1], T['mount-hole-radius'], T.hole, edge(T, T.pad)));
  });
  const left = padRow(
    T,
    fin,
    f,
    { x: 1.0 * p, y: 2.0 * p, axis: 'y', labels: cells, kind: 'pad', side: 'right', silk: f.silk, size: PIN_LABEL },
    1,
  );
  const right = padRow(
    T,
    fin,
    f,
    {
      x: w - 1.0 * p,
      y: 2.0 * p,
      axis: 'y',
      labels: ['VDD'].concat(names),
      kind: 'pad',
      side: 'left',
      silk: f.silk,
      size: PIN_LABEL,
    },
    -1,
  );
  s += soicAcross(T, 4.3 * p, 4.25 * p, 3.9 * p, 1.55 * p, 8, 'HX711');
  s += capTop(T, 7.9 * p, 1.5 * p, 0.6 * p) + capTop(T, 9.0 * p, 2.9 * p, 0.6 * p);
  [
    [3.2, 2.1],
    [3.2, 2.9],
    [3.2, 3.7],
    [3.2, 4.5],
  ].forEach(q => {
    s += framed(T, f, 'resistor', q[0] * p, q[1] * p, true);
  });
  s +=
    framed(T, f, 'resistor', 4.8 * p, 1.2 * p, true) +
    framed(T, f, 'capacitor', 5.9 * p, 1.2 * p, true) +
    framed(T, f, 'resistor', 8.8 * p, 4.75 * p, true) +
    framed(T, f, 'capacitor', 3.4 * p, 6.4 * p, true) +
    framed(T, f, 'resistor', 4.5 * p, 6.4 * p, true);
  s += text(4.2 * p, 8.7 * p, 'LOAD CELL AMP', 4.4, f.silk, { 'text-anchor': 'start', 'font-weight': 600 });
  s += left.svg + right.svg;
  return art(w, h, 'HX711 load cell amplifier', s, right.pins.slice(1).concat([right.pins[0]]).concat(left.pins));
}

/**
 * The pulse sensor as photographed: a black 16 mm round board with the
 * white heart printed on it, the green LED at the heart's top and the
 * light sensor below it, a tiny hole each side, three legs below. The box
 * is 7 pitches wide.
 */
export function pulseSensor(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = 'black';
  const f = finish(T, fin);
  const r = 8 * mm;
  const w = 7 * p;
  const h = 2 * r + 2.6 * p;
  const cx = 3.5 * p;
  const cy = 0.3 * p + r;
  let s = '';
  const xs = [2.5 * p, 3.5 * p, 4.5 * p];
  const names = props.pins || ['GND', 'VCC', 'OUT'];
  xs.forEach(x => {
    s += wire(x, cy + r - 2, x, h);
  });
  s += tag('board', circle(cx, cy, r, f.board, edge(T, f.edge)));
  s += circle(cx, cy, r, sheen('lens'), { 'fill-opacity': 0.25 });
  const hr = r * 0.62;
  const heart = `M${r2(cx)} ${r2(cy + hr * 0.85)}C${r2(cx - hr * 1.5)} ${r2(cy - hr * 0.15)} ${r2(cx - hr * 0.95)} ${r2(cy - hr * 1.15)} ${r2(cx)} ${r2(cy - hr * 0.35)}C${r2(cx + hr * 0.95)} ${r2(cy - hr * 1.15)} ${r2(cx + hr * 1.5)} ${r2(cy - hr * 0.15)} ${r2(cx)} ${r2(cy + hr * 0.85)}Z`;
  s += path(heart, f.silk, { 'fill-opacity': 0.92 });
  [
    [cx - r * 0.78, cy - r * 0.1],
    [cx + r * 0.78, cy + r * 0.1],
  ].forEach(c => {
    s += circle(c[0], c[1], 1.0, T.hole, edge(T, T.pad, T['stroke-fine']));
  });
  s += indicator({
    x: cx - 0.3 * p,
    y: cy - 0.75 * p,
    size: 0.6 * p,
    color: 'green',
    on: !!props.on,
    hook: 'pulse-led',
    finish: 'white',
  });
  s += tag(
    'sensor',
    rect(
      cx - 0.35 * p,
      cy + 0.05 * p,
      0.7 * p,
      0.5 * p,
      T['plastic-black'],
      Object.assign({ rx: 0.3 }, edge(T, T['plastic-black-edge'], T['stroke-fine'])),
    ),
  );
  return art(
    w,
    h,
    `Pulse sensor${props.on ? ', lit' : ''}`,
    s,
    xs.map((x, i) => {
      return { name: names[i], x, y: h };
    }),
  );
}

// The catalog's sensor boards and packages, built from the templates above with each part's real pins and silk. Each
// takes the options its catalog entry lists (src/options.js): a sensor board's `indicators` and `finish`.
/** A sensor board's lamps: PWR, and DO for the comparator's output. */
function lamps(props) {
  const ind = (props && props.indicators) || {};
  return { power: ind.power === true, out: ind.out === true };
}

/** The board colour the caller picked, else the part's own. */
function finishOf(props, own) {
  return (props && props.finish) || own;
}

// Sensor boards.

/** The light sensor: the LDR on the four-pin comparator board. */
export function lightSensor(props) {
  return sensorModuleTemplate({
    element: 'ldr',
    comparator: true,
    pins: ['VCC', 'GND', 'DO', 'AO'],
    indicators: lamps(props),
    finish: finishOf(props),
  });
}
/** The infrared flame sensor on the same board. */
export function flameSensor(props) {
  return sensorModuleTemplate({
    element: 'flame',
    comparator: true,
    pins: ['VCC', 'GND', 'DOUT', 'AOUT'],
    labels: ['VCC', 'GND', 'DO', 'AO'],
    indicators: lamps(props),
    finish: finishOf(props),
  });
}
/** The SW-520D tilt switch on its three-pin comparator board. */
export function tiltSwitch(props) {
  return sensorModuleTemplate({
    element: 'cylinder',
    comparator: true,
    pins: ['GND', 'VCC', 'OUT'],
    indicators: lamps(props),
    finish: finishOf(props),
  });
}
/** The sound sensor: the 9.7 mm electret capsule on the four-pin comparator board, or the 6 mm one on the small board (`small`). */
export function soundSensor(props) {
  return sensorModuleTemplate({
    element: 'mic',
    comparator: true,
    micMm: props && props.small ? 6 : 9.7,
    pins: ['AOUT', 'GND', 'VCC', 'DOUT'],
    labels: ['AO', 'G', '+', 'DO'],
    indicators: lamps(props),
    finish: finishOf(props),
  });
}
/** The NTC thermistor on its three-pin board. */
export function ntcSensor(props) {
  return sensorModuleTemplate({
    element: 'bead',
    pins: ['OUT', 'VCC', 'GND'],
    label: 'KY-013',
    finish: finishOf(props),
  });
}
/** The 38 kHz infrared receiver on its three-pin board. */
export function irReceiver(props) {
  return sensorModuleTemplate({ element: 'ir', pins: ['GND', 'VCC', 'DAT'], label: 'KY-022', finish: finishOf(props) });
}
/** The MQ gas sensor module, its header as the board prints it. */
export function gasSensor(props) {
  return gasModuleTemplate({
    pins: ['VCC', 'GND', 'DOUT', 'AOUT'],
    labels: ['VCC', 'GND', 'DO', 'AO'],
    indicators: lamps(props),
    finish: finishOf(props),
  });
}
/** The DS18B20 1-Wire temperature sensor in its TO-92 package, flat face forward: GND, DQ, VDD. */
export function ds18b20Sensor() {
  return to92Template({ label: 'DS18B20', pins: ['GND', 'DQ', 'VDD'] });
}
/** The MPU6050 IMU breakout, its header as the board prints it (VCC to INT). */
export function mpu6050Imu(props) {
  return moduleTemplate({
    label: 'MPU6050',
    pins: ['VCC', 'GND', 'SCL', 'SDA', 'XDA', 'XCL', 'AD0', 'INT'],
    part: 'chip',
    ic: 'qfn',
    width: 21,
    height: 16,
    finish: finishOf(props, 'blue'),
  });
}
