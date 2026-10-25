/** Development boards: the portrait and landscape dev-board templates, Mega-class, Franzininho, ESP32 DevKits, Nano RP2040 Connect, Pico, Nucleo-32, Nucleo-64 and Blue Pill. */
import {
  PIN_LABEL,
  art,
  bevelPoly,
  board,
  capTop,
  circle,
  edge,
  el,
  finish,
  header,
  indicator,
  lensColor,
  line,
  lit,
  lotCode,
  path,
  pin,
  r2,
  rect,
  sheen,
  silkMark,
  tag,
  text,
  tokens,
  trace,
  via,
} from './core.js';
import { barePad, dipOnBoard, framed, qfp, silkName, smd, soic, sot23, usbC, usbPort } from './pieces.js';
import { resistorBands } from './passives.js';

/** The silk a board prints for each pin: its `labels` entry (pin name to printed text, such as { 'A5.2': 'SCL' }) where it has one, otherwise the name without its .N suffix. */
function silkOf(props) {
  const labels = (props && props.labels) || {};
  return function (n) {
    return Object.prototype.hasOwnProperty.call(labels, n) ? String(labels[n]) : silkName(n);
  };
}

/**
 * A microcontroller board template. layout 'portrait' (default): a tall
 * board with two header rows down the long sides (left, right: pin names
 * top to bottom), the USB at the top, the controller in the middle, an
 * ICSP block, a reset button and two indicators (ids led-power and
 * led-user). controller 'module' draws a shielded radio module with its
 * antenna at the top and the USB and EN/BOOT buttons at the bottom, as on
 * an ESP32 dev kit. layout 'landscape': a wide board at the real Uno-class
 * size with header groups along the top and bottom edges (top, bottom:
 * arrays of groups, two pitches apart), USB-B and the barrel jack on the
 * left, the DIP-28 controller at the bottom right, the ICSP block on the
 * right edge and the L, TX, RX and ON indicators. `labels` prints other
 * silk for named pins (the Uno's SCL on its second A5); a portrait chip
 * board's `icsp` makes the ICSP block six named pins at the far end, as on
 * a Nano-class board, and a portrait board under 8 pitches wide has its
 * reset button under the controller. An indicator's `on` may be a level
 * from 0 to 1.
 */
export function devBoardTemplate(props) {
  props = props || {};
  if (props.layout === 'landscape') return landscapeBoard(props);
  const T = tokens();
  const p = T.pitch;
  const f = finish(T, props.finish || 'teal');
  const left = props.left || [];
  const right = props.right || [];
  const kind = props.pinKind || 'socket';
  const moduleTop = props.controller === 'module';
  const wroom = moduleTop && props.moduleSize === 'wroom';
  const dual = moduleTop && /^dual-/.test(props.usb || '');
  const modH = wroom ? 11.3 * p : 8.0 * p;
  const icspNames = !moduleTop && props.icsp && props.icsp.length === 6 ? props.icsp : null;
  const rows = Math.max(left.length, right.length);
  const w = (props.widthPitches || 10) * p;
  const top = moduleTop ? modH : (props.topPitches || 2.4) * p;
  const h = top + (rows - 1) * p + (icspNames ? p : 0) + (moduleTop ? (dual ? 5.0 : 4.0) * p : 1.4 * p);
  let s = '';
  const span = Math.round((w - 1.6 * p) / p) * p;
  const leftX = (w - span) / 2;
  const rightX = leftX + span;
  s += board({
    width: w,
    height: h,
    finish: props.finish || 'teal',
    holes: true,
    mark:
      props.mark === false
        ? undefined
        : moduleTop
          ? dual
            ? { x: w - 1.9 * p, y: h - 3.7 * p, size: 0.7 * p }
            : { x: w / 2 + 1.4 * p, y: h - 3.55 * p, size: 0.7 * p }
          : { x: 1.5 * p, y: h - 1.25 * p, size: 0.8 * p },
  });
  // The controller sits between the two label columns, whatever the names' lengths.
  const silk = silkOf(props);
  const longest = function (list) {
    return list.reduce((m, n) => {
      return Math.max(m, silk(n).length);
    }, 0);
  };
  const labelL = leftX + 0.7 * p + longest(left) * PIN_LABEL * 0.62;
  const labelR = rightX - 0.7 * p - longest(right) * PIN_LABEL * 0.62;
  const fin = props.finish || 'teal';
  const cw0 = Math.max(1.2 * p, Math.min(moduleTop ? 1.8 * p : 2.6 * p, labelR - labelL - 0.6 * p));
  const cxx0 = (labelL + labelR) / 2 - cw0 / 2;
  const traced = function (i) {
    return !(icspNames && i === rows - 1);
  };
  left.forEach((_, i) => {
    const y = top + i * p;
    if (traced(i))
      s += trace(T, fin, [
        [leftX, y],
        [leftX + 1.9 * p, y],
        [Math.max(leftX + 2.3 * p, cxx0 - 0.5 * p), y + 0.4 * p],
      ]);
  });
  right.forEach((_, i) => {
    const y = top + i * p;
    if (traced(i))
      s += trace(T, fin, [
        [rightX, y],
        [rightX - 1.9 * p, y],
        [Math.min(rightX - 2.3 * p, cxx0 + cw0 + 0.5 * p), y - 0.4 * p],
      ]);
  });
  // The lower via sits right of the ICSP block and clear of the right-hand labels; where the labels leave no room there it moves to the left side, and where neither side has room it is left out.
  const icspOk = w / 2 - 1.28 * p - 0.4 >= labelL && w / 2 + 1.28 * p + 0.4 <= labelR;
  const viaR = Math.min(w / 2 + 1.6 * p, labelR - 1.6);
  s +=
    via(T, w / 2 - 0.4 * p, top - 0.5 * p) +
    (moduleTop
      ? dual
        ? ''
        : via(T, w / 2 - 1.6 * p, h - 3.3 * p)
      : !icspNames && viaR - 1.2 >= labelL + 0.4
        ? via(T, viaR, h - 1.15 * p)
        : '');
  s += line(
    leftX + 0.75 * p,
    top - 0.6 * p,
    leftX + 0.75 * p,
    top + (left.length - 0.4) * p,
    f.silk,
    T['stroke-fine'],
    { 'stroke-opacity': 0.5 },
  );
  s += line(
    rightX - 0.75 * p,
    top - 0.6 * p,
    rightX - 0.75 * p,
    top + (right.length - 0.4) * p,
    f.silk,
    T['stroke-fine'],
    { 'stroke-opacity': 0.5 },
  );
  const ind = { power: true, user: false, ...props.indicators };
  // The reset button: the black housing, its metal frame and the plunger (reset-button).
  const rsz = 1.2 * p;
  let resetBelow = false;
  const resetButton = function (bx, by) {
    return tag(
      'reset',
      rect(
        bx,
        by,
        rsz,
        rsz,
        T['plastic-black'],
        Object.assign({ rx: 0.8 }, edge(T, T['plastic-black-edge'], T['stroke-detail'])),
      ) +
        rect(
          bx + 0.18 * p,
          by + 0.18 * p,
          rsz - 0.36 * p,
          rsz - 0.36 * p,
          T.metal,
          Object.assign({ rx: 0.5 }, edge(T, T['metal-edge'], T['stroke-fine'])),
        ) +
        circle(
          bx + rsz / 2,
          by + rsz / 2,
          0.36 * p,
          T['plastic-black'],
          Object.assign({ 'data-hook': 'reset-button' }, edge(T, T['plastic-black-edge'], T['stroke-fine'])),
        ),
    );
  };
  if (moduleTop) {
    // The radio module: a meander antenna on the board, then the shield can with its label (moduleSize 'mini' by default, 'wroom' for the larger can).
    const antH = wroom ? 1.2 * p : 0.6 * p;
    const canY = wroom ? 2.4 * p : 2.0 * p;
    const canH = wroom ? 7.5 * p : 4.3 * p;
    const rowY0 = canY + canH + 0.3 * p;
    const ax0 = 1.6 * p;
    const ax1 = w - 1.6 * p;
    const ay = wroom ? 0.7 * p : 0.9 * p;
    let d = '';
    const step = 0.5 * p;
    for (let ax = ax0; ax + step <= ax1; ax += step)
      d += `${(ax === ax0 ? 'M' : 'L') + r2(ax)} ${r2(ay)}L${r2(ax)} ${r2(ay + antH)}L${r2(ax + step / 2)} ${r2(ay + antH)}L${r2(ax + step / 2)} ${r2(ay)}L${r2(ax + step)} ${r2(ay)}`;
    s += tag('antenna', path(d, 'none', { stroke: T.pad, 'stroke-width': 0.9, 'stroke-linejoin': 'round' }));
    s += tag(
      'module',
      rect(1.2 * p, canY, w - 2.4 * p, canH, T.metal, Object.assign({ rx: 1.2 }, edge(T, T['metal-edge']))),
    );
    s += rect(1.2 * p, canY, w - 2.4 * p, 1.0 * p, '#ffffff', { rx: 1.2, 'fill-opacity': 0.22 });
    s += rect(1.2 * p, canY + canH - 0.7 * p, w - 2.4 * p, 0.7 * p, '#000000', { rx: 1, 'fill-opacity': 0.12 });
    if (props.chipLabel)
      s += text(
        w / 2,
        canY + canH / 2 + 0.3 * p,
        props.chipLabel,
        Math.min(4.4, ((w - 3.2 * p) / Math.max(4, props.chipLabel.length)) * 1.5),
        T['chip-edge'],
        { 'font-weight': 600 },
      );
    s += smd(T, 'capacitor', 1.3 * p, rowY0 + 0.05 * p, true) + smd(T, 'resistor', w - 2.2 * p, rowY0 + 0.05 * p, true);
    s += indicator({
      x: w / 2 - 1.3 * p,
      y: rowY0,
      size: 0.7 * p,
      color: 'red',
      on: ind.power,
      hook: 'power-led',
      state: 'power',
      finish: props.finish || 'teal',
    });
    s += indicator({
      x: w / 2 + 0.6 * p,
      y: rowY0,
      size: 0.7 * p,
      color: 'blue',
      on: ind.user,
      hook: 'rgb-led',
      finish: props.finish || 'teal',
    });
    // The buttons and the USB at the bottom: one connector between the two buttons, or (usb 'dual-c', 'dual-micro') two connectors under them.
    const names = props.buttons || ['EN', 'BOOT'];
    const by = dual ? h - 4.1 * p : h - 2.6 * p;
    const bxs = dual ? [w / 2 - 2.6 * p, w / 2 + 1.1 * p] : [1.1 * p, w - 2.6 * p];
    bxs.forEach((bx, bi) => {
      s += tag(
        'button',
        rect(
          bx,
          by,
          1.5 * p,
          1.5 * p,
          T['plastic-black'],
          Object.assign({ rx: 0.6 }, edge(T, T['plastic-black-edge'], T['stroke-detail'])),
        ) +
          circle(
            bx + 0.75 * p,
            by + 0.75 * p,
            0.4 * p,
            T.metal,
            Object.assign(bi === 1 ? { 'data-hook': 'boot-button' } : {}, edge(T, T['metal-edge'], T['stroke-fine'])),
          ),
      );
      s += text(bx + 0.75 * p, by + 1.5 * p + PIN_LABEL, names[bi], PIN_LABEL, f.silk);
    });
    if (props.usb === 'dual-c')
      s +=
        usbC(T, w / 2 - 2.1 * p, h - 1.6 * p, 2.4 * p, 1.2 * p) +
        usbC(T, w / 2 + 2.1 * p, h - 1.6 * p, 2.4 * p, 1.2 * p);
    else if (props.usb === 'dual-micro')
      s +=
        microUsb(T, w / 2 - 2.1 * p, h - 1.7 * p, 2.4 * p, 1.4 * p) +
        microUsb(T, w / 2 + 2.1 * p, h - 1.7 * p, 2.4 * p, 1.4 * p);
    else if (props.usb === 'c') s += usbC(T, w / 2, h - 1.7 * p, 2.6 * p, 1.4 * p);
    else s += microUsb(T, w / 2, h - 1.9 * p, 2.6 * p, 1.6 * p);
  } else {
    // The top row, left to right: USB, the two indicators, the regulator and a capacitor where the board is wide enough, the reset button at the right.
    s += microUsb(T, 2.5 * p, 0.2 * p, 2.6 * p, 1.5 * p, 'up');
    s += indicator({
      x: 4.05 * p,
      y: 0.45 * p,
      size: 0.8 * p,
      color: 'green',
      on: ind.power,
      hook: 'power-led',
      state: 'power',
      finish: props.finish || 'teal',
      label: 'ON',
    });
    s += indicator({
      x: 5.0 * p,
      y: 0.45 * p,
      size: 0.8 * p,
      color: 'yellow',
      on: ind.user,
      hook: 'user-led',
      finish: props.finish || 'teal',
      label: 'L',
    });
    const rx = w - 1.0 * p - rsz;
    const ry = 0.45 * p;
    resetBelow = rx < 5.8 * p - 0.01;
    if (rx - 6.0 * p >= 1.9 * p)
      s +=
        tag(
          'regulator',
          rect(6.1 * p, 0.3 * p, 0.8 * p, 0.45 * p, T.metal, { rx: 0.2 }) +
            rect(
              6.0 * p,
              0.7 * p,
              1.0 * p,
              0.8 * p,
              T['plastic-black'],
              Object.assign({ rx: 0.3 }, edge(T, T['plastic-black-edge'], T['stroke-fine'])),
            ),
        ) + smd(T, 'capacitor', 7.25 * p, 0.4 * p, false);
    if (!resetBelow) s += resetButton(rx, ry);
    // The reset label: under the button when the rows are pads, left of it when sockets leave no room below, and not at all on a narrow socket board.
    const hasReg = rx - 6.0 * p >= 1.9 * p;
    const rstLeft = rx - 1.4 - 3 * PIN_LABEL * 0.62;
    if (resetBelow) {
      /* drawn under the controller */
    } else if (kind !== 'socket')
      s += text(rx + rsz / 2, ry + rsz + PIN_LABEL - 0.4, props.resetLabel || 'RST', PIN_LABEL, f.silk);
    else if (rstLeft - 0.5 >= (hasReg ? 8.0 * p : 5.9 * p))
      s += text(rx - 1.4, ry + rsz / 2 + 1.4, props.resetLabel || 'RST', PIN_LABEL, f.silk, { 'text-anchor': 'end' });
  }
  // Under a radio module the only chip is the small USB bridge.
  // The controller on a Nano-class board is a square QFP with gull-wing pins on all four sides; under a radio module only the small USB bridge shows.
  const cw = moduleTop ? cw0 : Math.max(1.2 * p, Math.min(2.6 * p, cw0, h - top - 4 * p));
  const ch = moduleTop ? 1.8 * p : cw;
  const cxx = moduleTop ? cxx0 : (labelL + labelR) / 2 - cw / 2;
  const cyy = top + ((rows - 1) * p) / 2 - ch / 2;
  if (!moduleTop || props.chip !== false) {
    let chipP = '';
    const pinN = moduleTop ? Math.floor(ch / (0.5 * p)) : Math.max(4, Math.floor((cw - 0.6 * p) / (0.3 * p)));
    if (moduleTop)
      for (let i = 0; i < pinN; i++) {
        chipP +=
          rect(cxx - 1.4, cyy + 0.25 * p + i * 0.5 * p, 1.4, 0.24 * p, T.lead, { rx: 0.2 }) +
          rect(cxx + cw, cyy + 0.25 * p + i * 0.5 * p, 1.4, 0.24 * p, T.lead, { rx: 0.2 });
      }
    else
      for (let i = 0; i < pinN; i++) {
        const qo = 0.3 * p + ((i + 0.5) * (cw - 0.6 * p)) / pinN - 0.1 * p;
        chipP +=
          rect(cxx - 1.4, cyy + qo, 1.4, 0.2 * p, T.lead, { rx: 0.2 }) +
          rect(cxx + cw, cyy + qo, 1.4, 0.2 * p, T.lead, { rx: 0.2 }) +
          rect(cxx + qo, cyy - 1.4, 0.2 * p, 1.4, T.lead, { rx: 0.2 }) +
          rect(cxx + qo, cyy + ch, 0.2 * p, 1.4, T.lead, { rx: 0.2 });
      }
    s += tag(
      'chip',
      chipP +
        rect(cxx, cyy, cw, ch, T.chip, Object.assign({ rx: T['radius-chip'] }, edge(T, T['chip-edge']))) +
        (moduleTop
          ? path(`M${r2(cxx + cw / 2 - 2.2)} ${r2(cyy)}a2.2 2.2 0 0 0 4.4 0z`, T['chip-print'])
          : circle(cxx + 0.35 * p, cyy + 0.35 * p, 0.8, T['chip-print'])),
    );
    // The part number at the floor size, on one line where it fits and two where it does not; left off a body too small for two.
    if (props.chipLabel && !moduleTop) {
      const fit = Math.floor((cw - 2.4) / (PIN_LABEL * 0.62));
      const lbl = String(props.chipLabel);
      if (lbl.length <= fit) s += text(cxx + cw / 2, cyy + ch / 2 + 1.4, lbl, PIN_LABEL, T['chip-print']);
      else if (fit >= 4 && lbl.length <= 2 * fit) {
        const dm = /^[A-Za-z]+(?=\d)/.exec(lbl);
        const cut =
          dm && dm[0].length <= fit && lbl.length - dm[0].length <= fit ? dm[0].length : Math.ceil(lbl.length / 2);
        s +=
          text(cxx + cw / 2, cyy + ch / 2 - 0.8, lbl.slice(0, cut), PIN_LABEL, T['chip-print']) +
          text(cxx + cw / 2, cyy + ch / 2 + PIN_LABEL + 0.2, lbl.slice(cut), PIN_LABEL, T['chip-print']);
      }
    }
    // The crystal above the chip; decoupling caps beside it only where they stay clear of the pin labels.
    s += smd(T, 'crystal', cxx + cw / 2 - 0.65 * p, cyy - 1.2 * p, true);
    if (w >= 12 * p)
      s +=
        smd(T, 'capacitor', cxx - 1.6 * p, cyy + 0.2 * p, false) +
        smd(T, 'capacitor', cxx + cw + 1.05 * p, cyy + 0.2 * p, false);
    const icspY = cyy + ch + 0.9 * p;
    // A board too narrow for the reset button beside the indicators has it under the controller, where the ICSP holes go otherwise.
    if (resetBelow)
      s +=
        resetButton(w / 2 - rsz / 2, icspY) +
        text(w / 2, icspY + rsz + PIN_LABEL - 0.4, props.resetLabel || 'RST', PIN_LABEL, f.silk);
    else if (!moduleTop && !icspNames && icspOk && icspY + 1.4 * p < h - 1.3 * p) {
      let icsp = '';
      for (let r = 0; r < 2; r++)
        for (let c = 0; c < 3; c++)
          icsp +=
            circle(w / 2 - p + c * p, icspY + r * p, 0.28 * p, T.pad) +
            circle(w / 2 - p + c * p, icspY + r * p, 0.13 * p, T.hole);
      s += tag('icsp', icsp) + text(w / 2, icspY + 1.75 * p + 0.8, 'ICSP', PIN_LABEL, f.silk);
    }
  }
  const lh = header({
    x: leftX,
    y: top,
    axis: 'y',
    labels: left.map(silk),
    kind,
    side: 'right',
    silk: f.silk,
    size: PIN_LABEL,
  });
  const rh = header({
    x: rightX,
    y: top,
    axis: 'y',
    labels: right.map(silk),
    kind,
    side: 'left',
    silk: f.silk,
    size: PIN_LABEL,
  });
  lh.pins.forEach((pn, i) => {
    pn.name = left[i];
  });
  rh.pins.forEach((pn, i) => {
    pn.name = right[i];
  });
  s += lh.svg + rh.svg;
  // The ICSP header as pins (icsp: six names in the header's order, MISO, VCC, SCK, MOSI, RESET, GND): a 2 x 3 block at the far end, centred between the rows,
  // pins 2, 4 and 6 on the last row and 1, 3 and 5 a pitch beyond, pin 1 at the left in a square, as on a Nano-class board.
  const icspPins = [];
  if (icspNames) {
    const icx = (leftX + rightX) / 2;
    const icy = top + (rows - 1) * p;
    const pr = T['pad-radius'];
    icspNames.forEach((name, k) => {
      const x = icx + (Math.floor(k / 2) - 1) * p;
      const y = k % 2 ? icy : icy + p;
      s += pin({ x, y, kind: 'pad' });
      icspPins.push({ name, x, y });
    });
    s += rect(icx - p - pr - 0.7, icy + p - pr - 0.7, 2 * pr + 1.4, 2 * pr + 1.4, 'none', {
      stroke: f.silk,
      'stroke-width': T['stroke-fine'],
    });
    s += text(icx, icy - pr - 1.4, 'ICSP', PIN_LABEL, f.silk);
  }
  // Extra pads (a debugger's virtual COM port on a Nucleo-32): on the grid from the first pin, named above.
  const extra = [];
  (props.extraPads || []).forEach(e => {
    const x = leftX + e.dx * p;
    const y = top + e.dy * p;
    s += pin({ x, y, kind: 'pad' }) + text(x, y - T['pad-radius'] - 1.4, e.name, PIN_LABEL, f.silk);
    extra.push({ name: e.name, x, y });
  });
  if (props.label)
    s += text(w / 2, moduleTop ? (dual ? h - 4.45 * p : h - 3.1 * p) : h - 0.5 * p, props.label, 4.4, f.silk);
  return art(
    w,
    h,
    props.description || props.label || 'Microcontroller board',
    s,
    lh.pins.concat(rh.pins, icspPins, extra),
  );
}

/**
 * The Uno-class board, drawn from the real board: 68.58 x 53.34 mm with the
 * chamfered top-right corner and the wider ICSP side, the four holes where
 * they are, the USB-B and the barrel jack over the left edge, the bridge chip
 * with its own ICSP block by the USB, the L, TX and RX column under pin 13,
 * the ON LED by the ICSP block and the DIP-28 at the bottom right. top and
 * bottom name the header groups as the real board reads them, left to right
 * with the USB on the left: SCL to 8 then 7 to 0 along the top, the power
 * group then A0 to A5 along the bottom. The 0.16 inch gap between the
 * digital headers is snapped to two pitches so every pin sits on the grid.
 */

/** The USB end the Uno and the Mega share: the USB-B shell over the edge, the fuse, the reset button (unless noReset: the Mega has it by its controller), the bridge chip with its ICSP block, crystal and capacitors, and the L, TX, RX column. X, Y, L map millimetres to the box. */
function unoUsbEnd(T, f, fin, X, Y, L, ind, noReset) {
  let s = '';
  // The USB-B shell, 4 mm over the edge, with its mouth and seam; the resettable fuse under it.
  s += tag(
    'usb',
    rect(X(-4.2), Y(9.4), L(14.25), L(11.8), T.metal, Object.assign({ rx: 1.2 }, edge(T, T['metal-edge']))) +
      rect(X(-4.2), Y(9.4), L(14.25), L(11.8), sheen('metal'), { rx: 1.2, 'fill-opacity': 0.7 }) +
      rect(X(2.4), Y(10.4), L(2.2), L(0.7), T.cavity, { rx: 0.3 }) +
      rect(X(2.4), Y(19.5), L(2.2), L(0.7), T.cavity, { rx: 0.3 }) +
      rect(X(-4.2), Y(9.4), L(14.25), L(2.4), '#ffffff', { rx: 1.2, 'fill-opacity': T['opacity-light'] * 0.6 }) +
      rect(X(-4.2), Y(19.0), L(14.25), L(2.2), '#000000', { rx: 1.2, 'fill-opacity': T['opacity-shade'] }) +
      line(X(6.2), Y(9.6), X(6.2), Y(21.0), T['metal-edge'], T['stroke-fine']) +
      rect(X(-3.6), Y(11.2), L(5.4), L(8.2), T['plastic-black'], { rx: 0.9 }) +
      rect(X(-2.8), Y(12.8), L(3.6), L(5.0), T['plastic-white'], { rx: 0.5, 'fill-opacity': 0.85 }),
  );
  s += text(X(6.8), Y(24.8), 'USB', PIN_LABEL, f.silk);
  s += tag(
    'fuse',
    rect(
      X(0.9),
      Y(22.5),
      L(4.5),
      L(3.2),
      T['band-yellow'],
      Object.assign({ rx: 0.4 }, edge(T, T['resistor-body-edge'], T['stroke-fine'])),
    ),
  );
  // The reset button in the corner above the USB, and the bridge chip's own ICSP block beside it.
  if (!noReset) s += resetButton(T, f, X, Y, L, 4.0, 1.5);
  let icsp2 = '';
  [11.6, 14.14, 16.68].forEach(cx => {
    [5.67, 8.21].forEach(cy => {
      icsp2 += circle(X(cx), Y(cy), L(0.9), T.pad) + circle(X(cx), Y(cy), L(0.4), T.hole);
    });
  });
  s += tag('icsp', icsp2);
  // The USB bridge chip with its crystal and capacitors, right of the USB.
  s += tag(
    'chip',
    rect(
      X(13.5),
      Y(10.5),
      L(6),
      L(6),
      T.chip,
      Object.assign({ rx: 0.6 }, edge(T, T['chip-edge'], T['stroke-detail'])),
    ) + circle(X(14.3), Y(11.3), 0.6, T['chip-print']),
  );
  s +=
    smd(T, 'crystal', X(21.0), Y(11.2), true) +
    smd(T, 'capacitor', X(21.2), Y(14.6), true) +
    smd(T, 'capacitor', X(23.7), Y(14.6), true);
  // L, TX and RX in a column under pin 13, as on the board; ON by the ICSP block.
  [
    ['user-led', 'L', ind.user, undefined, 11.0],
    ['tx-led', 'TX', false, 'tx', 15.0],
    ['rx-led', 'RX', false, 'rx', 19.0],
  ].forEach(e => {
    s += indicator({
      x: X(26.5),
      y: Y(e[4]),
      size: L(2.0),
      color: 'yellow',
      on: e[2],
      hook: e[0],
      state: e[3],
      finish: fin,
    });
    s += text(X(29.4), Y(e[4] + 1.0) + 1.4, e[1], PIN_LABEL, f.silk, { 'text-anchor': 'start' });
  });
  return s;
}

/** The red-capped reset button, its 6 mm body's top-left corner at (x, y) mm, and RESET under it. */
function resetButton(T, f, X, Y, L, x, y) {
  return (
    tag(
      'reset',
      rect(
        X(x),
        Y(y),
        L(6),
        L(6),
        T['plastic-black'],
        Object.assign({ rx: 0.6 }, edge(T, T['plastic-black-edge'], T['stroke-detail'])),
      ) +
        rect(
          X(x + 0.7),
          Y(y + 0.7),
          L(4.6),
          L(4.6),
          T.metal,
          Object.assign({ rx: 0.5 }, edge(T, T['metal-edge'], T['stroke-fine'])),
        ) +
        circle(
          X(x + 3.0),
          Y(y + 3.0),
          L(1.5),
          T['lens-red'],
          Object.assign({ 'data-hook': 'reset-button' }, edge(T, T['plastic-black-edge'], T['stroke-fine'])),
        ),
    ) + text(X(x + 3.0), Y(y + 7.45), 'RESET', PIN_LABEL, f.silk)
  );
}

/** The power end they share: the regulator, the two electrolytics, the barrel jack over the edge and the PWR print; withCrystal adds the HC-49 crystal and its capacitors where the Uno has them. */
function unoPowerEnd(T, f, X, Y, L, withCrystal) {
  let s = '';
  s += tag(
    'regulator',
    rect(X(15.0), Y(24.2), L(4.8), L(1.6), T.metal, { rx: 0.3 }) +
      rect(
        X(14.5),
        Y(25.6),
        L(5.8),
        L(5.0),
        T['plastic-black'],
        Object.assign({ rx: 0.4 }, edge(T, T['plastic-black-edge'], T['stroke-fine'])),
      ),
  );
  if (withCrystal)
    s += tag(
      'crystal',
      rect(
        X(16.0),
        Y(32.2),
        L(11.5),
        L(4.7),
        T.metal,
        Object.assign({ rx: L(2.35) }, edge(T, T['metal-edge'], T['stroke-fine'])),
      ),
    );
  if (withCrystal) s += smd(T, 'capacitor', X(21.0), Y(38.2), true) + smd(T, 'capacitor', X(24.2), Y(38.2), true);
  s += capTop(T, X(16.6), Y(46.0), L(3.15)) + capTop(T, X(23.4), Y(46.0), L(3.15));
  // The barrel jack over the bottom-left edge.
  s += tag(
    'jack',
    rect(
      X(-2.5),
      Y(38.6),
      L(14.5),
      L(13.4),
      T['plastic-black'],
      Object.assign({ rx: 1.2 }, edge(T, T['plastic-black-edge'])),
    ) +
      rect(X(-2.5), Y(38.6), L(14.5), L(2.0), '#ffffff', { rx: 1.2, 'fill-opacity': 0.08 }) +
      circle(X(1.4), Y(45.3), L(3.3), T.metal, edge(T, T['metal-edge'])) +
      circle(X(1.4), Y(45.3), L(2.2), T.cavity) +
      circle(X(1.4), Y(45.3), L(0.75), T.metal),
  );
  s += text(X(7.0), Y(37.2), 'PWR', PIN_LABEL, f.silk);
  return s;
}

function landscapeBoard(props) {
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'teal';
  const f = finish(T, fin);
  const kind = props.pinKind || 'socket';
  const gap = 2 * p;
  const OX = 4.2;
  const X = function (x) {
    return r2((x + OX) * mm);
  };
  const Y = function (y) {
    return r2(y * mm);
  };
  const L = function (v) {
    return r2(v * mm);
  };
  const w = L(68.58 + OX);
  const h = L(53.34);
  let s = '';
  let pins = [];
  const top = props.top || [];
  const bottom = props.bottom || [];
  const ind = { power: true, user: false, ...props.indicators };
  // The board as it is cut: 66.04 mm wide at the header edges, 68.58 across the ICSP side, 1 mm corners, a chamfer at the top right.
  const d = `M${X(1)} ${Y(0)}A${L(1)} ${L(1)} 0 0 0 ${X(0)} ${Y(1)}V${Y(52.34)}A${L(1)} ${L(1)} 0 0 0 ${X(1)} ${Y(
    53.34,
  )}H${X(65.04)}A${L(1)} ${L(1)} 0 0 0 ${X(66.04)} ${Y(52.34)}V${Y(50.8)}L${X(68.58)} ${Y(48.26)}V${Y(15.49)}L${X(66.04)} ${Y(12.96)}V${Y(1.53)}L${X(64.51)} ${Y(0)}Z`;
  s += tag('board', path(d, f.board, edge(T, f.edge)));
  s += bevelPoly(
    T,
    [
      [X(0), Y(0)],
      [X(64.51), Y(0)],
      [X(66.04), Y(1.53)],
      [X(66.04), Y(12.96)],
      [X(68.58), Y(15.49)],
      [X(68.58), Y(48.26)],
      [X(66.04), Y(50.8)],
      [X(66.04), Y(53.34)],
      [X(0), Y(53.34)],
    ],
    2.4,
  );
  [
    [15.24, 2.48],
    [66.05, 17.72],
    [66.04, 45.66],
    [13.97, 50.74],
  ].forEach(c => {
    s += tag('hole', circle(X(c[0]), Y(c[1]), L(1.6), T.hole, edge(T, T.pad, 1.0)));
  });
  // Header rows at the real positions: the top row's first pin 18.46 mm from the left edge, the bottom row's four pitches further on.
  const topY = Y(2.54);
  const botY = Y(50.8);
  const tx = X(18.46);
  const bx = X(28.62);
  const traceRow = function (groups, x, y, dir) {
    groups.forEach(g => {
      g.forEach((_, i) => {
        const px = x + i * p;
        s += trace(T, fin, [
          [px, y],
          [px, y + dir * 1.3 * p],
          [px + (px < w / 2 ? 0.5 : -0.5) * p, y + dir * 1.9 * p],
        ]);
      });
      x += (g.length - 1) * p + gap;
    });
  };
  traceRow(top, tx, topY, 1);
  traceRow(bottom, bx, botY, -1);
  [
    [9, 29],
    [24, 25.5],
    [34, 21],
    [52, 21.5],
    [60, 30],
    [11, 35.5],
  ].forEach(v => {
    s += via(T, X(v[0]), Y(v[1]));
  });
  s += unoUsbEnd(T, f, fin, X, Y, L, ind);
  s += indicator({
    x: X(57.3),
    y: Y(16.2),
    size: L(2.0),
    color: 'green',
    on: ind.power,
    hook: 'power-led',
    state: 'power',
    finish: fin,
    label: 'ON',
  });
  // Silk: the line under the digital labels, the row name, the board's name where the real one prints its own, the mark.
  const silkLine = function (x0, x1, y) {
    s += line(X(x0), Y(y), X(x1), Y(y), f.silk, T['stroke-fine'], { 'stroke-opacity': 0.55 });
  };
  silkLine(17.2, 64.6, 9.8);
  silkLine(27.4, 47.0, 44.7);
  silkLine(49.7, 65.3, 44.7);
  const names = props.groupNames || {};
  if (names.top && names.top[0]) s += text(X(46.0), Y(13.4), names.top[0], PIN_LABEL, f.silk);
  (names.bottom || []).forEach((n, i) => {
    if (n) {
      const gx = bx + (i ? (bottom[0].length - 1) * p + gap : 0);
      s += text(gx + ((bottom[i].length - 1) * p) / 2, Y(43.9), n, PIN_LABEL, f.silk);
    }
  });
  if (props.label) s += text(X(46.0), Y(27.6), props.label, 11, f.silk, { 'font-weight': 700 });
  if (props.mark !== false) s += silkMark(X(60.3), Y(11.0), 0.8 * p, f.silk);
  // The ICSP block at the right edge, the controller, its crystal and capacitors, the regulator and the two electrolytics by the jack.
  let icsp = '';
  [64.27, 66.81].forEach(cx => {
    [21.37, 23.91, 26.45].forEach(cy => {
      icsp += circle(X(cx), Y(cy), L(0.9), T.pad) + circle(X(cx), Y(cy), L(0.4), T.hole);
    });
  });
  s += tag('icsp', icsp);
  s += text(X(65.54), Y(30.4), 'ICSP', PIN_LABEL, f.silk);
  s += dipOnBoard(T, X(28.5), Y(36.0), 14, props.chipLabel);
  s += unoPowerEnd(T, f, X, Y, L, true);
  // The headers last, over the traces.
  const silk = silkOf(props);
  const row = function (groups, x, y, side) {
    groups.forEach(g => {
      const hdr = header({ x, y, labels: g.map(silk), kind, side, silk: f.silk, size: PIN_LABEL, rotate: true });
      hdr.pins.forEach((pn, i) => {
        pn.name = g[i];
      });
      s += hdr.svg;
      pins = pins.concat(hdr.pins);
      x += (g.length - 1) * p + gap;
    });
  };
  row(top, tx, topY, 'below');
  row(bottom, bx, botY, 'above');
  // The ~ the board prints before each PWM pin, after the label's far end (labels read upward, their end at the pin).
  if (props.pwm && props.pwm.length) {
    const gapR = kind === 'socket' ? p / 2 + 1.6 : T['pad-radius'] + 1.0;
    let px0 = tx;
    top.forEach(g => {
      g.forEach((name, i) => {
        if (props.pwm.indexOf(name) >= 0) {
          const x = px0 + i * p;
          const ty = topY + gapR + silkOf(props)(name).length * PIN_LABEL * 0.62 + 1.6;
          s += text(x, ty, '~', PIN_LABEL, f.silk, {
            'text-anchor': 'end',
            'dominant-baseline': 'middle',
            transform: `rotate(-90 ${r2(x)} ${r2(ty)})`,
          });
        }
      });
      px0 += (g.length - 1) * p + gap;
    });
  }
  return art(w, h, props.description || props.label || 'Microcontroller board', s, pins);
}

/**
 * An axial part lying on a board between its pads (x0, y0) and (x1, y1), along
 * x or along y: the leads, the body of length len and width wide in the middle,
 * and either a resistor's colour bands (ohms) or a glass diode with its
 * cathode band at the (x1, y1) end.
 */
function axialOnBoard(T, x0, y0, x1, y1, props) {
  const vert = x0 === x1;
  const a0 = vert ? y0 : x0;
  const a1 = vert ? y1 : x1;
  const dir = a1 < a0 ? -1 : 1;
  const mid = (a0 + a1) / 2;
  const len = props.len;
  const wide = props.wide;
  let s = '';
  // A band across the body from along-axis offset t0 to t1 (0 at the first pad's end of the body, len at the other).
  const band = function (t0, t1, fill, more) {
    const u = mid + dir * (t0 - len / 2);
    const v = mid + dir * (t1 - len / 2);
    const lo = Math.min(u, v);
    const d = Math.abs(v - u);
    return vert ? rect(x0 - wide / 2, lo, wide, d, fill, more) : rect(lo, y0 - wide / 2, d, wide, fill, more);
  };
  s += line(x0, y0, x1, y1, T.lead, 1.2);
  [
    [x0, y0],
    [x1, y1],
  ].forEach(c => {
    s += circle(c[0], c[1], 1.6, T.pad) + circle(c[0], c[1], 0.7, T.hole);
  });
  if (props.kind === 'diode') {
    s += band(
      0,
      len,
      T['band-orange'],
      Object.assign({ rx: wide / 2, 'fill-opacity': 0.8 }, edge(T, T['resistor-body-edge'], T['stroke-fine'])),
    );
    s += band(0.3 * len, 0.7 * len, T['band-red'], { 'fill-opacity': 0.55 });
    s += band(0.78 * len, 0.9 * len, T['band-black']);
  } else {
    s += band(
      0,
      len,
      T['resistor-body'],
      Object.assign({ rx: wide / 2 }, edge(T, T['resistor-body-edge'], T['stroke-fine'])),
    );
    resistorBands(props.ohms).forEach((b, k) => {
      const t = [0.18, 0.32, 0.46, 0.74][k] * len;
      s += band(t, t + 0.08 * len, T[b]);
    });
  }
  return tag('smd', s);
}

/** The micro USB receptacle, pointing down unless mouth says otherwise. */
function microUsb(T, cx, y, w, h, mouth) {
  return usbPort(T, { kind: 'micro', x: cx - w / 2, y, w, h, mouth: mouth || 'down' });
}

/** A tactile button with its silk name below: the black housing, the metal frame and the plunger (hook). */
function tactile(T, f, x, y, size, name, hook) {
  let s = tag(
    'button',
    rect(
      x,
      y,
      size,
      size,
      T['plastic-black'],
      Object.assign({ rx: 0.6 }, edge(T, T['plastic-black-edge'], T['stroke-detail'])),
    ) +
      rect(
        x + 0.15 * size,
        y + 0.15 * size,
        0.7 * size,
        0.7 * size,
        T.metal,
        Object.assign({ rx: 0.5 }, edge(T, T['metal-edge'], T['stroke-fine'])),
      ) +
      circle(
        x + size / 2,
        y + size / 2,
        0.27 * size,
        T['plastic-black'],
        Object.assign(hook ? { 'data-hook': hook } : {}, edge(T, T['plastic-black-edge'], T['stroke-fine'])),
      ),
  );
  if (name) s += text(x + size / 2, y + size + PIN_LABEL, name, PIN_LABEL, f.silk);
  return s;
}

/**
 * The Mega-class board from the real board: 101.6 x 53.34 mm with the Uno's
 * USB end and power end, the digital headers along the top (SCL to 8, 7 to
 * 0, then the COMMUNICATION group 14 to 21), the 2 x 18 header at the right
 * end (block.left and block.right, read row by row as the board numbers
 * them), the power and two analog groups along the bottom, the TQFP-100
 * controller in the middle with its crystal and ICSP, six mounting holes.
 */
export function megaBoardTemplate(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'teal';
  const f = finish(T, fin);
  const kind = props.pinKind || 'socket';
  const gap = 2 * p;
  const OX = 4.2;
  const X = function (x) {
    return r2((x + OX) * mm);
  };
  const Y = function (y) {
    return r2(y * mm);
  };
  const L = function (v) {
    return r2(v * mm);
  };
  const W = 101.6;
  const w = L(W + OX);
  const h = L(53.34);
  let s = '';
  let pins = [];
  const top = props.top || [];
  const bottom = props.bottom || [];
  const block = props.block || { left: [], right: [] };
  const ind = { power: true, user: false, ...props.indicators };
  const d = `M${X(1)} ${Y(0)}A${L(1)} ${L(1)} 0 0 0 ${X(0)} ${Y(1)}V${Y(52.34)}A${L(1)} ${L(1)} 0 0 0 ${X(1)} ${Y(
    53.34,
  )}H${X(W - 3.54)}A${L(1)} ${L(1)} 0 0 0 ${X(W - 2.54)} ${Y(52.34)}V${Y(50.8)}L${X(W)} ${Y(48.26)}V${Y(15.49)}L${X(W - 2.54)} ${Y(12.96)}V${Y(1.53)}L${X(W - 4.07)} ${Y(0)}Z`;
  s += tag('board', path(d, f.board, edge(T, f.edge)));
  s += bevelPoly(
    T,
    [
      [X(0), Y(0)],
      [X(W - 4.07), Y(0)],
      [X(W - 2.54), Y(1.53)],
      [X(W - 2.54), Y(12.96)],
      [X(W), Y(15.49)],
      [X(W), Y(48.26)],
      [X(W - 2.54), Y(50.8)],
      [X(W - 2.54), Y(53.34)],
      [X(0), Y(53.34)],
    ],
    2.4,
  );
  // The holes from the board's drawing; the top-right one, at 90.17 mm, drawn 0.3 mm left and a little small to clear pin 21 and the 5V label.
  [
    [15.24, 2.54],
    [15.24, 50.8],
    [66.04, 17.78],
    [66.04, 45.72],
    [89.9, 2.54, 1.5],
    [96.52, 50.8],
  ].forEach(c => {
    s += tag('hole', circle(X(c[0]), Y(c[1]), L(c[2] || 1.6), T.hole, edge(T, T.pad, 1.0)));
  });
  const topY = Y(2.54);
  const botY = Y(50.8);
  const tx = X(18.46);
  const bx = X(31.16);
  const col1 = tx + 30 * p;
  const col2 = tx + 31 * p;
  const bottomGaps = props.bottomGaps || [2, 2];
  const gapOf = function (gaps, k) {
    return (gaps && gaps[k] !== undefined ? gaps[k] : 2) * p;
  };
  const traceRow = function (groups, x, y, dir, gaps) {
    groups.forEach((g, k) => {
      g.forEach((_, i) => {
        const px = x + i * p;
        s += trace(T, fin, [
          [px, y],
          [px, y + dir * 1.3 * p],
          [px + (px < w / 2 ? 0.5 : -0.5) * p, y + dir * 1.9 * p],
        ]);
      });
      x += (g.length - 1) * p + gapOf(gaps, k);
    });
  };
  traceRow(top, tx, topY, 1);
  traceRow(bottom, bx, botY, -1, bottomGaps);
  block.left.forEach((_, i) => {
    const y = topY + i * p;
    s += trace(T, fin, [
      [col1, y],
      [col1 - 1.6 * p, y],
      [col1 - 2.4 * p, y + 0.4 * p],
    ]);
  });
  [
    [9, 29],
    [24, 32],
    [36, 19],
    [47.5, 40.5],
    [62, 41],
    [86.5, 22.5],
    [86, 40.5],
    [11, 35.5],
  ].forEach(v => {
    s += via(T, X(v[0]), Y(v[1]));
  });
  s += unoUsbEnd(T, f, fin, X, Y, L, ind, true);
  // The reset button right of the controller's ICSP block, the ON LED above it, as on the Mega 2560 R3.
  s += resetButton(T, f, X, Y, L, 71.17, 22.4);
  s += indicator({
    x: X(76.0),
    y: Y(18.6),
    size: L(2.0),
    color: 'green',
    on: ind.power,
    hook: 'power-led',
    state: 'power',
    finish: fin,
    label: 'ON',
  });
  // Silk: the line under the digital labels, the group names, the board's name, the mark.
  const silkLine = function (x0, x1, y) {
    s += line(X(x0), Y(y), X(x1), Y(y), f.silk, T['stroke-fine'], { 'stroke-opacity': 0.55 });
  };
  silkLine(17.2, 90.0, 9.8);
  silkLine(30.0, 47.0, 44.7);
  silkLine(52.5, 93.5, 44.7);
  const names = props.groupNames || {};
  if (names.top && names.top[0]) s += text(tx + 9 * p, Y(13.4), names.top[0], PIN_LABEL, f.silk);
  if (names.top && names.top[1] && top[2])
    s += text(tx + (18 + 2 + (top[2].length - 1) / 2) * p + gap, Y(13.4), names.top[1], PIN_LABEL, f.silk);
  if (names.bottom && names.bottom[0] && bottom[0])
    s += text(bx + ((bottom[0].length - 1) * p) / 2, Y(43.9), names.bottom[0], PIN_LABEL, f.silk);
  if (names.bottom && names.bottom[1] && bottom[2]) {
    const a0 = bx + (bottom[0].length - 1) * p + gapOf(bottomGaps, 0);
    const aN = a0 + (bottom[1].length - 1) * p + gapOf(bottomGaps, 1) + (bottom[2].length - 1) * p;
    s += text((a0 + aN) / 2, Y(43.9), names.bottom[1], PIN_LABEL, f.silk);
  }
  if (props.label) s += text(X(78.0), Y(41.2), props.label, 9, f.silk, { 'font-weight': 700 });
  if (props.mark !== false) s += silkMark(X(88.5), Y(13.4), 0.8 * p, f.silk);
  // The controller, its crystal and capacitors, the ICSP block beside it and a few passives.
  s += qfp(T, X(46.0), Y(21.0), L(14), L(14), 25, props.chipLabel);
  s += tag(
    'crystal',
    rect(
      X(23.0),
      Y(21.0),
      L(11.5),
      L(4.7),
      T.metal,
      Object.assign({ rx: L(2.35) }, edge(T, T['metal-edge'], T['stroke-fine'])),
    ),
  );
  s += smd(T, 'capacitor', X(36.5), Y(23.5), true) + smd(T, 'capacitor', X(39.5), Y(35.0), true);
  let icsp = '';
  [63.63, 66.17].forEach(cx => {
    [22.86, 25.4, 27.94].forEach(cy => {
      icsp += circle(X(cx), Y(cy), L(0.9), T.pad) + circle(X(cx), Y(cy), L(0.4), T.hole);
    });
  });
  s += tag('icsp', icsp);
  s += text(X(64.9), Y(31.4), 'ICSP', PIN_LABEL, f.silk);
  s += smd(T, 'resistor', X(79.6), Y(18.6), false) + smd(T, 'capacitor', X(67.0), Y(38.5), true);
  s += unoPowerEnd(T, f, X, Y, L, false);
  // The headers last, over the traces: the three top groups, the 2 x 18 block row by row, the bottom groups.
  const silk = silkOf(props);
  const row = function (groups, x, y, side, gaps) {
    groups.forEach((g, k) => {
      const hdr = header({ x, y, labels: g.map(silk), kind, side, silk: f.silk, size: PIN_LABEL, rotate: true });
      hdr.pins.forEach((pn, i) => {
        pn.name = g[i];
      });
      s += hdr.svg;
      pins = pins.concat(hdr.pins);
      x += (g.length - 1) * p + gapOf(gaps, k);
    });
  };
  row(top, tx, topY, 'below');
  block.left.forEach((name, i) => {
    const y = topY + i * p;
    s += pin({ x: col1, y, kind, label: silk(name), side: 'left', silk: f.silk, size: PIN_LABEL });
    pins.push({ name, x: col1, y });
    const rn = block.right[i];
    if (rn !== undefined) {
      s += pin({ x: col2, y, kind, label: silk(rn), side: 'right', silk: f.silk, size: PIN_LABEL });
      pins.push({ name: rn, x: col2, y });
    }
  });
  row(bottom, bx, botY, 'above', bottomGaps);
  if (props.pwm && props.pwm.length) {
    const gapR = kind === 'socket' ? p / 2 + 1.6 : T['pad-radius'] + 1.0;
    let px0 = tx;
    top.forEach(g => {
      g.forEach((name, i) => {
        if (props.pwm.indexOf(name) >= 0) {
          const x = px0 + i * p;
          const ty = topY + gapR + silkOf(props)(name).length * PIN_LABEL * 0.62 + 1.6;
          s += text(x, ty, '~', PIN_LABEL, f.silk, {
            'text-anchor': 'end',
            'dominant-baseline': 'middle',
            transform: `rotate(-90 ${r2(x)} ${r2(ty)})`,
          });
        }
      });
      px0 += (g.length - 1) * p + gap;
    });
  }
  return art(w, h, props.description || props.label || 'Mega-class board', s, pins);
}

/**
 * The Franzininho DIY from its board files: a 51.1 x 30.0 mm board with the
 * metal USB-A plug standing 16.1 mm off its left edge, the USB parts lying
 * between the plug and the chip (the 1N4148, the two 3V6 zeners, the two
 * 68 R resistors and the 1k5 pull-up), the 78L05 and C1 along the top, the
 * ATtiny85 in its DIP-8 socket with pin 1 at the top right, the reset button,
 * C2, the ON and PB1 LEDs at the bottom, four mounting holes, eight sockets
 * down the right edge (side) and three along the top (power).
 */
export function franzininho(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'green';
  const f = finish(T, fin);
  const kind = props.pinKind || 'socket';
  let s = '';
  const OX = 16.1;
  const X = function (x) {
    return r2((x + OX) * mm);
  };
  const Y = function (y) {
    return r2(y * mm);
  };
  const L = function (v) {
    return r2(v * mm);
  };
  const w = L(OX + 51.07);
  const h = L(30.03);
  const i = T['board-inset'];
  const side = props.side || ['GND', 'VCC', 'PB4', 'PB5', 'PB3', 'PB2', 'PB1', 'PB0'];
  const power = props.power || ['VIN', 'GND.2', 'VCC.2'];
  const ind = { power: true, user: false, ...props.indicators };
  // The headers whole pitches apart: the side column 0.17 mm right of the board's and 0.54 mm down, the top row 0.17 mm left and 0.54 mm up.
  const colX = (46.075 + OX) * mm;
  const colY = 6.53 * mm;
  const rowX = colX - 10 * p;
  const rowY = colY - 2 * p;
  s += tag(
    'board',
    rect(X(0), i, w - i - X(0), h - 2 * i, f.board, Object.assign({ rx: T['radius-board'] }, edge(T, f.edge))),
  );
  s += bevelPoly(
    T,
    [
      [X(0), i],
      [w - i, i],
      [w - i, h - i],
      [X(0), h - i],
    ],
    2.2,
  );
  [
    [9.6, 2.45],
    [48.6, 2.45],
    [9.6, 27.45],
    [48.6, 27.45],
  ].forEach(c => {
    s += tag('hole', circle(X(c[0]), Y(c[1]), L(1.5), T.hole, edge(T, T.pad)));
  });
  // The USB-A plug: the 12 mm shell from its mouth to its rear on the board, the two latch windows near the mouth, then its four pins behind it, D+ and D- on to R1 and R2.
  const py = 15.03;
  let usb = rect(0.4, Y(py - 6), X(4.3) - 0.4, L(12), T.metal, Object.assign({ rx: L(0.6) }, edge(T, T['metal-edge'])));
  usb +=
    rect(0.4, Y(py - 6), X(4.3) - 0.4, L(12), sheen('metal'), { rx: L(0.6), 'fill-opacity': 0.75 }) +
    rect(0.4, Y(py - 5.4), L(0.5), L(10.8), T.cavity, { rx: 0.4 });
  usb +=
    rect(X(-13.6), Y(py - 4.3), L(2.4), L(1.8), T.cavity, { rx: 0.4 }) +
    rect(X(-13.6), Y(py + 2.5), L(2.4), L(1.8), T.cavity, { rx: 0.4 });
  usb += line(X(-1.2), Y(py - 6) + 1, X(-1.2), Y(py + 6) - 1, T['metal-edge'], T['stroke-fine']);
  s += tag('usb', usb);
  [11.53, 13.9, 16.16, 18.53].forEach(y => {
    s += circle(X(5.39), Y(y), L(0.9), T.pad) + circle(X(5.39), Y(y), L(0.4), T.hole);
  });
  s +=
    trace(T, fin, [
      [X(5.39), Y(13.9)],
      [X(8.21), Y(13.94)],
    ]) +
    trace(T, fin, [
      [X(5.39), Y(16.16)],
      [X(6.6), Y(16.16)],
      [X(7.3), Y(16.9)],
      [X(8.28), Y(16.9)],
    ]);
  // Traces from the side pins in toward the chip.
  side.forEach((_, k) => {
    const y = colY + k * p;
    s += trace(T, fin, [
      [colX, y],
      [colX - 1.2 * p, y],
      [colX - 1.55 * p, y + 0.35 * p],
    ]);
  });
  [
    [43.5, 2.6],
    [13.5, 26.6],
    [31.0, 22.2],
  ].forEach(v => {
    s += via(T, X(v[0]), Y(v[1]));
  });
  // The parts lying between the plug and the chip, from the top: D3 (1N4148), D1 (3V6 zener), R1 and R2 (68 R), D2 (3V6 zener), R3 (1k5); then R4 and R5 (1k) along y. A diode's cathode is its second end.
  const glass = { kind: 'diode', len: L(3.8), wide: L(1.8) };
  const res = function (ohms) {
    return { ohms, len: L(6.0), wide: L(2.3) };
  };
  s +=
    axialOnBoard(T, X(9.54), Y(7.62), X(17.16), Y(7.62), glass) +
    axialOnBoard(T, X(16.99), Y(10.46), X(9.37), Y(10.46), glass);
  s +=
    axialOnBoard(T, X(8.21), Y(13.94), X(18.38), Y(13.94), res(68)) +
    axialOnBoard(T, X(8.28), Y(16.9), X(18.44), Y(16.9), res(68));
  s +=
    axialOnBoard(T, X(17.09), Y(19.83), X(9.47), Y(19.83), glass) +
    axialOnBoard(T, X(8.28), Y(22.79), X(18.44), Y(22.79), res(1500));
  s +=
    axialOnBoard(T, X(21.35), Y(10.55), X(21.35), Y(20.71), res(1000)) +
    axialOnBoard(T, X(24.52), Y(10.55), X(24.52), Y(20.71), res(1000));
  // U1, the 78L05 in TO-92 with its flat face down; C1, the orange ceramic disc; C2, the 5 mm electrolytic.
  const ux = X(15.46);
  const uy = Y(3.6);
  const ur = L(2.4);
  s += tag(
    'regulator',
    path(
      `M${r2(ux - ur)} ${uy}A${ur} ${ur} 0 0 1 ${r2(ux + ur)} ${uy}V${r2(uy + L(1.4))}H${r2(ux - ur)}Z`,
      T['plastic-black'],
      edge(T, T['plastic-black-edge'], T['stroke-detail']),
    ) + text(ux, r2(uy + L(1.15)), '78L05', PIN_LABEL, T['chip-print']),
  );
  s +=
    tag(
      'cap',
      el('ellipse', {
        cx: X(22.45),
        cy: Y(7.8),
        rx: L(2.5),
        ry: L(1.2),
        fill: T['band-orange'],
        stroke: T['resistor-body-edge'],
        'stroke-width': T['stroke-fine'],
      }),
    ) + capTop(T, X(28.92), Y(8.54), L(2.5));
  // The ATtiny85 in its socket, pin 1 at the top right; the reset button above it.
  s += rect(
    X(31.6),
    Y(9.6),
    L(11.4),
    L(10.6),
    T['plastic-black'],
    Object.assign({ rx: L(0.5) }, edge(T, T['plastic-black-edge'], T['stroke-detail'])),
  );
  s += dipOnBoard(T, X(32.23), Y(14.91), 4, props.chipLabel || 'ATTINY85', true);
  s += tactile(T, f, X(34.56), Y(1.25), L(6), 'RESET', 'reset-button');
  // The ON and LED lamps, 3 mm, at the bottom.
  [
    [21.3, 'green', ind.power, 'power-led', 'power', 'ON'],
    [26.38, 'yellow', ind.user, 'user-led', undefined, 'LED'],
  ].forEach(D => {
    const col = lensColor(T, D[1]);
    const level = lit(D[2]);
    const cx = X(D[0]);
    const cy = Y(26.09);
    const lr = L(1.5);
    if (level)
      s += tag(
        'glow',
        circle(cx, cy, 1.8 * lr, sheen('glow', col), {
          'fill-opacity': r2(Math.min(1, 2.2 * T['opacity-glow']) * level),
        }),
      );
    s +=
      tag(
        'indicator',
        circle(
          cx,
          cy,
          lr,
          level ? col : f.indicatorOff,
          Object.assign(
            {
              'data-hook': D[3],
              'data-on-fill': col,
              'data-off-fill': f.indicatorOff,
              'data-lit-state': D[4],
              'data-lit': level ? 'true' : 'false',
            },
            edge(T, T['plastic-black-edge'], T['stroke-fine']),
          ),
        ),
      ) + circle(cx, cy, lr, sheen('dome'), { 'fill-opacity': 0.7 });
    s += text(cx, Y(23.3), D[5], PIN_LABEL, f.silk);
  });
  if (props.label) s += text(X(36.3), Y(25.6), props.label, 4.4, f.silk);
  if (props.mark !== false) s += silkMark(X(28.6), Y(16.0), 0.8 * p, f.silk);
  const silk = silkOf(props);
  const col = header({
    x: colX,
    y: colY,
    axis: 'y',
    labels: side.map(silk),
    kind,
    side: 'right',
    silk: f.silk,
    size: PIN_LABEL,
  });
  const rw = header({
    x: rowX,
    y: rowY,
    axis: 'x',
    labels: power.map(silk),
    kind,
    side: 'below',
    silk: f.silk,
    size: PIN_LABEL,
  });
  col.pins.forEach((pn, k) => {
    pn.name = side[k];
  });
  rw.pins.forEach((pn, k) => {
    pn.name = power[k];
  });
  s += col.svg + rw.svg;
  return art(w, h, props.description || props.label || 'ATtiny85 board', s, col.pins.concat(rw.pins));
}

/**
 * The ESP32 DevKit V1 from the real board: 28.4 x 54.6 mm in black with the
 * ESP-WROOM-32 module between the two 15-pin rows (its antenna at the top
 * end), the USB bridge and the regulator below it, the power and user LEDs,
 * the EN and BOOT buttons either side of the micro USB at the bottom. left
 * and right name the rows top to bottom, as the catalog reads them.
 * layout 'devkitc' draws the DevKitC V4 instead (devKitC below), layout
 * 'devkit-1' the later DevKitM-1 and DevKitC-1 boards (devKit1 below).
 */
export function espDevKitTemplate(props) {
  props = props || {};
  if (props.layout === 'devkitc') return devKitC(props);
  if (props.layout === 'devkit-1') return devKit1(props);
  const T = tokens();
  const p = T.pitch;
  const fin = props.finish || 'black';
  const f = finish(T, fin);
  const kind = props.pinKind || 'pad';
  const left = props.left || [];
  const right = props.right || [];
  const ind = { power: true, user: false, ...props.indicators };
  const w = 11.2 * p;
  const leftX = 0.6 * p;
  const rightX = w - 0.6 * p;
  const top = 2.5 * p;
  const rows = Math.max(left.length, right.length);
  const h = Math.max(21.5 * p, top + rows * p + 5 * p);
  let s = '';
  s += board({
    width: w,
    height: h,
    finish: fin,
    holes: false,
    mark: props.mark === false ? undefined : { x: w / 2 + 2.0 * p, y: h - 3.5 * p, size: 0.7 * p },
  });
  const mx = 2.2 * p;
  const mw = w - 4.4 * p;
  left.forEach((_, k) => {
    const y = top + k * p;
    s += trace(T, fin, [
      [leftX, y],
      [leftX + 1.2 * p, y],
      [leftX + 1.55 * p, y + 0.35 * p],
    ]);
  });
  right.forEach((_, k) => {
    const y = top + k * p;
    s += trace(T, fin, [
      [rightX, y],
      [rightX - 1.2 * p, y],
      [rightX - 1.55 * p, y - 0.35 * p],
    ]);
  });
  s += via(T, mx + 0.5 * p, 11.0 * p) + via(T, w - mx - 0.5 * p, 15.6 * p) + via(T, w / 2 - 3.0 * p, 17.4 * p);
  s += line(
    leftX + 0.75 * p,
    top - 0.6 * p,
    leftX + 0.75 * p,
    top + (left.length - 0.4) * p,
    f.silk,
    T['stroke-fine'],
    { 'stroke-opacity': 0.5 },
  );
  s += line(
    rightX - 0.75 * p,
    top - 0.6 * p,
    rightX - 0.75 * p,
    top + (right.length - 0.4) * p,
    f.silk,
    T['stroke-fine'],
    { 'stroke-opacity': 0.5 },
  );
  // The module: the meander antenna on its own PCB at the top, then the shield can with its label.
  const ax0 = mx + 0.4 * p;
  const ax1 = mx + mw - 0.4 * p;
  const ay = 0.7 * p;
  let d = '';
  const step = 0.5 * p;
  s += rect(mx, 0.4 * p, mw, 2.6 * p, T['pcb-black'], { rx: 1, 'fill-opacity': 0.5 });
  for (let ax = ax0; ax + step <= ax1; ax += step)
    d += `${(ax === ax0 ? 'M' : 'L') + r2(ax)} ${r2(ay)}L${r2(ax)} ${r2(ay + 1.2 * p)}L${r2(ax + step / 2)} ${r2(ay + 1.2 * p)}L${r2(ax + step / 2)} ${r2(ay)}L${r2(ax + step)} ${r2(ay)}`;
  s += tag('antenna', path(d, 'none', { stroke: T.pad, 'stroke-width': 0.9, 'stroke-linejoin': 'round' }));
  s += tag('module', rect(mx, 2.9 * p, mw, 7.5 * p, T.metal, Object.assign({ rx: 1.2 }, edge(T, T['metal-edge']))));
  s +=
    rect(mx, 2.9 * p, mw, 1.0 * p, '#ffffff', { rx: 1.2, 'fill-opacity': 0.22 }) +
    rect(mx, 9.7 * p, mw, 0.7 * p, '#000000', { rx: 1, 'fill-opacity': 0.12 });
  if (props.chipLabel)
    s += text(
      w / 2,
      6.0 * p,
      props.chipLabel,
      Math.min(4.4, ((mw - 1.2 * p) / Math.max(4, props.chipLabel.length)) * 1.5),
      T['chip-edge'],
      { 'font-weight': 600 },
    );
  s += text(w / 2, 7.6 * p, lotCode(props.chipLabel || 'ESP32'), PIN_LABEL, T['chip-edge'], { 'fill-opacity': 0.8 });
  // Below the module: the USB bridge (QFN-28) on the left, the regulator (SOT-223) on the right, the LEDs, passives.
  s += qfp(T, 3.2 * p, 11.3 * p, 1.9 * p, 1.9 * p, 7, 'CP2102');
  s += tag(
    'regulator',
    rect(6.9 * p, 11.2 * p, 1.6 * p, 0.6 * p, T.metal, { rx: 0.3 }) +
      rect(
        6.7 * p,
        11.75 * p,
        2.0 * p,
        1.5 * p,
        T['plastic-black'],
        Object.assign({ rx: 0.4 }, edge(T, T['plastic-black-edge'], T['stroke-fine'])),
      ),
  );
  s += indicator({
    x: 2.4 * p,
    y: 14.2 * p,
    size: 0.7 * p,
    color: 'red',
    on: ind.power,
    hook: 'power-led',
    state: 'power',
    finish: fin,
    label: 'PWR',
  });
  if (props.userLed !== false)
    s += indicator({
      x: 8.1 * p,
      y: 14.2 * p,
      size: 0.7 * p,
      color: 'blue',
      on: ind.user,
      hook: 'user-led',
      finish: fin,
      label: 'D2',
    });
  s +=
    smd(T, 'capacitor', 4.1 * p, 14.1 * p, false) +
    smd(T, 'resistor', 5.2 * p, 14.1 * p, false) +
    smd(T, 'resistor', 6.3 * p, 14.1 * p, false) +
    smd(T, 'capacitor', 3.0 * p, 16.4 * p, true) +
    smd(T, 'capacitor', 7.0 * p, 16.4 * p, true);
  // The buttons flank the micro USB at the bottom edge.
  const by = h - 3.6 * p;
  s +=
    tactile(T, f, 0.8 * p, by, 1.5 * p, 'EN', undefined) +
    tactile(T, f, w - 2.3 * p, by, 1.5 * p, 'BOOT', 'boot-button');
  s += microUsb(T, w / 2, h - 1.7 * p, 2.6 * p, 1.6 * p);
  if (props.label) s += text(w / 2, h - 3.9 * p + 0.4, props.label, 4.4, f.silk);
  const lh = header({
    x: leftX,
    y: top,
    axis: 'y',
    labels: left.map(silkOf(props)),
    kind,
    side: 'right',
    silk: f.silk,
    size: PIN_LABEL,
  });
  const rh = header({
    x: rightX,
    y: top,
    axis: 'y',
    labels: right.map(silkOf(props)),
    kind,
    side: 'left',
    silk: f.silk,
    size: PIN_LABEL,
  });
  lh.pins.forEach((pn, i) => {
    pn.name = left[i];
  });
  rh.pins.forEach((pn, i) => {
    pn.name = right[i];
  });
  s += lh.svg + rh.svg;
  return art(w, h, props.description || props.label || 'ESP32 development board', s, lh.pins.concat(rh.pins));
}

/**
 * The ESP32-DevKitC V4 measured from Espressif's photograph of the board:
 * 27.9 x 54.6 mm in black, the two rows 1 inch apart running nearly end to end,
 * the WROOM module over the first seven rows with its antenna 5 mm past the
 * board's top edge, then the regulator, the USB bridge and the red power
 * LED, EN beside the left row and BOOT beside the right either side of the
 * micro USB. No user LED.
 */
function devKitC(props) {
  const T = tokens();
  const p = T.pitch;
  const fin = props.finish || 'black';
  const f = finish(T, fin);
  const kind = props.pinKind || 'pad';
  const left = props.left || [];
  const right = props.right || [];
  const ind = props.indicators || { power: true };
  const w = 11 * p;
  const leftX = 0.5 * p;
  const rightX = w - 0.5 * p;
  const ant = 2.1 * p;
  const top = ant + 0.8 * p;
  const rows = Math.max(left.length, right.length);
  const h = Math.max(21.5 * p, top + (rows - 0.4) * p);
  let s = '';
  s += board({
    width: w,
    height: h - ant,
    y: ant,
    finish: fin,
    holes: false,
    mark: props.mark === false ? undefined : { x: 7.3 * p, y: h - 3.2 * p, size: 0.7 * p },
  });
  left.forEach((_, k) => {
    const y = top + k * p;
    s += trace(T, fin, [
      [leftX, y],
      [leftX + 1.2 * p, y],
      [leftX + 1.55 * p, y + 0.35 * p],
    ]);
  });
  right.forEach((_, k) => {
    const y = top + k * p;
    s += trace(T, fin, [
      [rightX, y],
      [rightX - 1.2 * p, y],
      [rightX - 1.55 * p, y - 0.35 * p],
    ]);
  });
  s += via(T, 2.6 * p, h - 10.1 * p) + via(T, 8.4 * p, h - 6.1 * p) + via(T, 4.3 * p, h - 5.9 * p);
  // The module: its own black board from the antenna tip, the meander antenna, then the shield can over the rows.
  const mx = 2.0 * p;
  const mw = 7.0 * p;
  const ax0 = mx + 0.4 * p;
  const ax1 = mx + mw - 0.4 * p;
  const ay = 0.5 * p;
  let d = '';
  const step = 0.5 * p;
  s += rect(mx, 0, mw, 10.0 * p, T['pcb-black'], Object.assign({ rx: 1 }, edge(T, f.edge, T['stroke-fine'])));
  for (let ax = ax0; ax + step <= ax1; ax += step)
    d += `${(ax === ax0 ? 'M' : 'L') + r2(ax)} ${r2(ay)}L${r2(ax)} ${r2(ay + 1.2 * p)}L${r2(ax + step / 2)} ${r2(ay + 1.2 * p)}L${r2(ax + step / 2)} ${r2(ay)}L${r2(ax + step)} ${r2(ay)}`;
  s += tag('antenna', path(d, 'none', { stroke: T.pad, 'stroke-width': 0.9, 'stroke-linejoin': 'round' }));
  s += tag(
    'module',
    rect(mx + 0.3 * p, 2.65 * p, mw - 0.6 * p, 6.85 * p, T.metal, Object.assign({ rx: 1.2 }, edge(T, T['metal-edge']))),
  );
  s +=
    rect(mx + 0.3 * p, 2.65 * p, mw - 0.6 * p, 1.0 * p, '#ffffff', { rx: 1.2, 'fill-opacity': 0.22 }) +
    rect(mx + 0.3 * p, 8.8 * p, mw - 0.6 * p, 0.7 * p, '#000000', { rx: 1, 'fill-opacity': 0.12 });
  if (props.chipLabel)
    s += text(
      w / 2,
      5.8 * p,
      props.chipLabel,
      Math.min(4.4, ((mw - 1.8 * p) / Math.max(4, props.chipLabel.length)) * 1.5),
      T['chip-edge'],
      { 'font-weight': 600 },
    );
  s += text(w / 2, 7.4 * p, lotCode(props.chipLabel || 'ESP32'), PIN_LABEL, T['chip-edge'], { 'fill-opacity': 0.8 });
  if (props.label) s += text(w / 2, h - 10.6 * p, props.label, 4.4, f.silk);
  // Below the module: the regulator (SOT-223), the USB bridge (QFN-28), the power LED, passives.
  const b = h - 21.5 * p;
  s += tag(
    'regulator',
    rect(3.7 * p, b + 12.3 * p, 1.6 * p, 0.6 * p, T.metal, { rx: 0.3 }) +
      rect(
        3.5 * p,
        b + 12.85 * p,
        2.0 * p,
        1.5 * p,
        T['plastic-black'],
        Object.assign({ rx: 0.4 }, edge(T, T['plastic-black-edge'], T['stroke-fine'])),
      ),
  );
  s += qfp(T, 5.0 * p, b + 16.3 * p, 1.9 * p, 1.9 * p, 7, 'CP2102');
  s += indicator({
    x: 2.3 * p,
    y: b + 16.2 * p,
    size: 0.7 * p,
    color: 'red',
    on: ind.power,
    hook: 'power-led',
    state: 'power',
    finish: fin,
    label: 'PWR',
  });
  s +=
    smd(T, 'capacitor', 6.6 * p, b + 12.4 * p, false) +
    smd(T, 'resistor', 7.6 * p, b + 12.4 * p, false) +
    smd(T, 'resistor', 7.6 * p, b + 14.0 * p, false) +
    smd(T, 'capacitor', 2.4 * p, b + 18.4 * p, true) +
    smd(T, 'capacitor', 7.4 * p, b + 16.6 * p, false);
  // EN and BOOT either side of the micro USB at the bottom edge.
  s +=
    tactile(T, f, 1.9 * p, h - 2.3 * p, 1.5 * p, 'EN', undefined) +
    tactile(T, f, w - 3.4 * p, h - 2.3 * p, 1.5 * p, 'BOOT', 'boot-button');
  s += microUsb(T, w / 2, h - 1.7 * p, 2.6 * p, 1.6 * p);
  const lh = header({
    x: leftX,
    y: top,
    axis: 'y',
    labels: left.map(silkOf(props)),
    kind,
    side: 'right',
    silk: f.silk,
    size: PIN_LABEL,
  });
  const rh = header({
    x: rightX,
    y: top,
    axis: 'y',
    labels: right.map(silkOf(props)),
    kind,
    side: 'left',
    silk: f.silk,
    size: PIN_LABEL,
  });
  lh.pins.forEach((pn, i) => {
    pn.name = left[i];
  });
  rh.pins.forEach((pn, i) => {
    pn.name = right[i];
  });
  s += lh.svg + rh.svg;
  return art(w, h, props.description || props.label || 'ESP32 development board', s, lh.pins.concat(rh.pins));
}

/** Module sizes in millimetres, width by length: the MINI-1 modules, the S2-MINI-1, the WROOM-1 modules. */
const ESP_MODULES = { mini: [13.2, 16.6], 'mini-s2': [15.4, 20.5], wroom: [18, 25.5] };

/**
 * Espressif's later DevKits from their dimension drawings: the DevKitM-1
 * boards (a MINI module) and the DevKitC-1 boards (a WROOM module). 25.4 mm
 * wide in black, the two rows 0.9 inch apart from firstPin below the top
 * edge, the module over the first rows with its antenna overhang past that
 * edge, the regulator, USB bridge, RGB and power LEDs below it, then the
 * two buttons and the USB port or ports at the bottom. length, overhang and
 * firstPin are millimetres; a null in left or right is an unconnected place,
 * drawn as a bare pad. A WROOM leaves the labels beside it less room than the
 * print needs, so they run onto the module's board beside its shield.
 */
function devKit1(props) {
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const M = function (v) {
    return v * mm;
  };
  const fin = props.finish || 'black';
  const f = finish(T, fin);
  const kind = props.pinKind || 'pad';
  const ind = { power: true, user: false, ...props.indicators };
  const left = props.left || [];
  const right = props.right || [];
  const rows = Math.max(left.length, right.length);
  const silk = silkOf(props);
  const size = ESP_MODULES[props.module] || ESP_MODULES.mini;
  const wroom = props.module === 'wroom';
  const ov = props.overhang || 5.4;
  const first = props.firstPin || 1.55;
  const len = props.length || first + (rows - 1) * 2.54 + 8;
  const usb = props.usb || 'micro';
  let s = '';
  const w = M(25.4);
  const h = M(ov + len);
  const leftX = M(1.27);
  const rightX = w - M(1.27);
  const top = M(ov + first);
  const labelW = function (list) {
    return (
      list.reduce((m, n) => {
        return n === null ? m : Math.max(m, silk(n).length);
      }, 0) *
      PIN_LABEL *
      0.62
    );
  };
  const labelL = leftX + T['pad-radius'] + 1.4 + labelW(left);
  const labelR = rightX - T['pad-radius'] - 1.4 - labelW(right);
  s += board({ width: w, height: h - M(ov), y: M(ov), finish: fin, holes: false });
  left.forEach((n, k) => {
    const y = top + k * p;
    if (n !== null)
      s += trace(T, fin, [
        [leftX, y],
        [leftX + 1.2 * p, y],
        [leftX + 1.55 * p, y + 0.35 * p],
      ]);
  });
  right.forEach((n, k) => {
    const y = top + k * p;
    if (n !== null)
      s += trace(T, fin, [
        [rightX, y],
        [rightX - 1.2 * p, y],
        [rightX - 1.55 * p, y - 0.35 * p],
      ]);
  });
  // The module: its own black board from the antenna tip, the meander antenna past the board's edge, then the shield can.
  const mw = M(size[0]);
  const mh = M(size[1]);
  const mx = (w - mw) / 2;
  const inset = M(wroom ? 1.0 : 0.6);
  const shY = M(ov + 0.6);
  const shH = mh - shY - M(0.5);
  const ax0 = mx + M(1.0);
  const ax1 = mx + mw - M(1.0);
  const ay = M(0.9);
  const antH = M(Math.min(2.6, ov - 2.0));
  let d = '';
  const step = 0.5 * p;
  s += rect(mx, 0, mw, mh, T['pcb-black'], Object.assign({ rx: 1 }, edge(T, f.edge, T['stroke-fine'])));
  for (let ax = ax0; ax + step <= ax1; ax += step)
    d += `${(ax === ax0 ? 'M' : 'L') + r2(ax)} ${r2(ay)}L${r2(ax)} ${r2(ay + antH)}L${r2(ax + step / 2)} ${r2(ay + antH)}L${r2(ax + step / 2)} ${r2(ay)}L${r2(ax + step)} ${r2(ay)}`;
  s += tag('antenna', path(d, 'none', { stroke: T.pad, 'stroke-width': 0.9, 'stroke-linejoin': 'round' }));
  s += tag(
    'module',
    rect(mx + inset, shY, mw - 2 * inset, shH, T.metal, Object.assign({ rx: 1.2 }, edge(T, T['metal-edge']))),
  );
  s +=
    rect(mx + inset, shY, mw - 2 * inset, 1.0 * p, '#ffffff', { rx: 1.2, 'fill-opacity': 0.22 }) +
    rect(mx + inset, shY + shH - 0.7 * p, mw - 2 * inset, 0.7 * p, '#000000', { rx: 1, 'fill-opacity': 0.12 });
  // The module's name on one line, or on two split at a hyphen when one line would print under the kit's smallest size.
  if (props.chipLabel) {
    const room = mw - 2 * inset - 1.0 * p;
    const fitSize = function (t) {
      return Math.min(4.4, (room / Math.max(4, t.length)) * 1.5);
    };
    const cut = props.chipLabel.lastIndexOf('-', props.chipLabel.length - 3);
    if (fitSize(props.chipLabel) < PIN_LABEL && cut > 0) {
      const l1 = props.chipLabel.slice(0, cut);
      const l2 = props.chipLabel.slice(cut + 1);
      const ls = Math.max(PIN_LABEL, Math.min(fitSize(l1), fitSize(l2)));
      s +=
        text(w / 2, shY + shH * 0.45 - 0.55 * p, l1, ls, T['chip-edge'], { 'font-weight': 600 }) +
        text(w / 2, shY + shH * 0.45, l2, ls, T['chip-edge'], { 'font-weight': 600 });
    } else
      s += text(
        w / 2,
        shY + shH * 0.45,
        props.chipLabel,
        Math.max(PIN_LABEL, fitSize(props.chipLabel)),
        T['chip-edge'],
        {
          'font-weight': 600,
        },
      );
  }
  s += text(w / 2, shY + shH * 0.45 + 1.4 * p, lotCode(props.chipLabel || 'ESP32'), PIN_LABEL, T['chip-edge'], {
    'fill-opacity': 0.8,
  });
  // The bottom: one micro USB between the buttons, two micro USB with the buttons above them among the rows, or two USB-C with the buttons above them.
  const bs = M(3.0);
  const names = props.buttons || ['BOOT', 'RST'];
  let bys;
  let bxs;
  let low;
  if (usb === 'dual-c') {
    s += usbC(T, w / 2 - M(5.2), h - M(5.2), M(8.9), M(5.0)) + usbC(T, w / 2 + M(5.2), h - M(5.2), M(8.9), M(5.0));
    bys = h - M(10.2);
    bxs = [w / 2 - M(5.2) - bs / 2, w / 2 + M(5.2) - bs / 2];
    low = bys;
  } else if (usb === 'dual-micro') {
    s +=
      microUsb(T, w / 2 - M(6.7), h - M(4.8), M(7.5), M(4.6)) + microUsb(T, w / 2 + M(6.7), h - M(4.8), M(7.5), M(4.6));
    bys = h - M(15.3);
    bxs = [w / 2 - M(5.4) - bs / 2, w / 2 + M(5.4) - bs / 2];
    low = bys;
  } else {
    s += microUsb(T, w / 2, h - M(4.8), M(7.5), M(4.6));
    bys = h - M(7.4);
    bxs = [(labelL + w / 2 - M(3.75)) / 2 - bs / 2, (labelR + w / 2 + M(3.75)) / 2 - bs / 2];
    low = bys;
  }
  bxs.forEach((bx, bi) => {
    s += tactile(T, f, bx, bys, bs, names[bi], /BOOT/.test(names[bi]) ? 'boot-button' : 'reset-button');
  });
  // Below the module, between the label columns: the regulator, the RGB LED, the USB bridge, the power LED and passives, then the board's name.
  const x0 = labelL + M(0.6);
  const x1 = labelR - M(0.6);
  const y0 = mh + M(1.0);
  const y1 = low - M(1.2);
  const cx = (x0 + x1) / 2;
  const ym = (y0 + y1) / 2;
  s += tag(
    'regulator',
    rect(x0 + M(1.6), y0, M(3.0), M(1.2), T.metal, { rx: 0.3 }) +
      rect(
        x0,
        y0 + M(1.0),
        M(6.2),
        M(3.4),
        T['plastic-black'],
        Object.assign({ rx: 0.4 }, edge(T, T['plastic-black-edge'], T['stroke-fine'])),
      ),
  );
  s += indicator({
    x: x1 - M(1.4),
    y: y0 + M(1.6),
    size: M(2.0),
    color: 'blue',
    on: ind.user,
    hook: 'rgb-led',
    finish: fin,
    label: 'RGB',
  });
  s += qfp(T, cx - M(2.0), ym - M(1.0), M(4.0), M(4.0), 6, props.bridge);
  s += smd(T, 'capacitor', cx + M(3.2), ym - M(0.6), false) + smd(T, 'resistor', cx - M(4.4), ym - M(0.6), false);
  s += indicator({
    x: x1 - M(1.4),
    y: y1 - M(1.6),
    size: M(1.6),
    color: 'red',
    on: ind.power,
    hook: 'power-led',
    state: 'power',
    finish: fin,
    label: 'PWR',
  });
  if (props.label) s += text(cx - M(1.2), y1 - M(0.6), props.label, 4.4, f.silk);
  if (props.mark !== false) s += silkMark(x0 + M(0.8), y1 - M(1.6), 0.7 * p, f.silk);
  const pins = [];
  const row = function (list, x, side) {
    list.forEach((n, k) => {
      const y = top + k * p;
      s += pin({ x, y, kind, label: n === null ? undefined : silk(n), side, silk: f.silk, size: PIN_LABEL });
      if (n !== null) pins.push({ name: n, x, y });
    });
  };
  row(left, leftX, 'right');
  row(right, rightX, 'left');
  return art(w, h, props.description || props.label || 'ESP32 development board', s, pins);
}

/**
 * The Nano RP2040 Connect at its true size, as on Arduino's drawing: a
 * 17.78 x 43.18 mm board with the micro USB 1.8 mm past its end, two 15-pin
 * castellated rows 0.6 inch apart with the first pins 3.81 mm from the far
 * end, and a 1.65 mm mounting hole at each corner in line with the rows. The
 * u-blox radio module (10 x 14 mm, its antenna at the board's end) sits
 * between the first five pins of each row, so those names stand on end
 * beside it, and RESET prints as RST. Below it: the crystal, the RP2040 and
 * the IMU, the flash and the crypto chip, a regulator, the microphone, the
 * reset button, the RGB LED, and the D13 and power LEDs either side of the
 * USB.
 */
export function nanoConnectTemplate(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const M = function (v) {
    return v * mm;
  };
  const fin = props.finish || 'blue';
  const f = finish(T, fin);
  const kind = props.pinKind || 'pad';
  const ind = { power: true, user: false, ...props.indicators };
  const left = props.left || [];
  const right = props.right || [];
  const silk = silkOf({ labels: Object.assign({ RESET: 'RST' }, props.labels) });
  const w = M(17.78);
  const h = M(45.0);
  const leftX = M(1.27);
  const rightX = M(16.51);
  const top = M(3.81);
  const mx = M(3.89);
  const mw = M(10.0);
  const my = M(0.15);
  const mh = M(14.0);
  let s = '';
  const pins = [];
  s += board({ width: w, height: M(43.18), finish: fin, holes: false });
  [
    [leftX, M(1.27)],
    [rightX, M(1.27)],
    [leftX, M(41.91)],
    [rightX, M(41.91)],
  ].forEach(c => {
    s += tag('hole', circle(c[0], c[1], M(0.82), T.hole, edge(T, T.pad, 1.0)));
  });
  // The radio module from the board's end: its own board with the meander antenna, then the shield can.
  const ax0 = mx + M(0.8);
  const ax1 = mx + mw - M(0.8);
  const ay = M(0.8);
  const antH = M(2.0);
  let d = '';
  const step = 0.5 * p;
  const shY = M(3.9);
  const shH = M(9.7);
  s += rect(mx, my, mw, mh, T['pcb-black'], Object.assign({ rx: 1 }, edge(T, f.edge, T['stroke-fine'])));
  for (let ax = ax0; ax + step <= ax1; ax += step)
    d += `${(ax === ax0 ? 'M' : 'L') + r2(ax)} ${r2(ay)}L${r2(ax)} ${r2(ay + antH)}L${r2(ax + step / 2)} ${r2(ay + antH)}L${r2(ax + step / 2)} ${r2(ay)}L${r2(ax + step)} ${r2(ay)}`;
  s += tag('antenna', path(d, 'none', { stroke: T.pad, 'stroke-width': 0.9, 'stroke-linejoin': 'round' }));
  s += tag(
    'module',
    rect(mx + M(0.35), shY, mw - M(0.7), shH, T.metal, Object.assign({ rx: 1.2 }, edge(T, T['metal-edge']))),
  );
  s +=
    rect(mx + M(0.35), shY, mw - M(0.7), 1.0 * p, '#ffffff', { rx: 1.2, 'fill-opacity': 0.22 }) +
    rect(mx + M(0.35), shY + shH - 0.7 * p, mw - M(0.7), 0.7 * p, '#000000', { rx: 1, 'fill-opacity': 0.12 });
  s +=
    text(w / 2, shY + shH * 0.45, props.moduleLabel || 'NINA-W102', 4.4, T['chip-edge'], { 'font-weight': 600 }) +
    text(w / 2, shY + shH * 0.45 + 1.4 * p, lotCode(props.moduleLabel || 'NINA'), PIN_LABEL, T['chip-edge'], {
      'fill-opacity': 0.8,
    });
  // Under the module: the maker's mark, a capacitor and the crystal, then the RP2040 with the IMU beside it.
  if (props.mark !== false) s += silkMark(M(4.2), M(14.55), 0.7 * p, f.silk);
  s += via(T, M(6.6), M(15.4)) + smd(T, 'capacitor', M(7.2), M(14.7), true) + smd(T, 'crystal', M(10.4), M(14.6), true);
  s += qfp(T, M(4.3), M(17.2), M(6.8), M(6.8), 14, props.chipLabel || 'RP2040');
  s += tag(
    'chip',
    rect(
      M(11.75),
      M(17.5),
      M(2.1),
      M(3.0),
      T.chip,
      Object.assign({ rx: T['radius-chip'] }, edge(T, T['chip-edge'], T['stroke-detail'])),
    ) + circle(M(12.2), M(17.95), 0.6, T['chip-print']),
  );
  s += via(T, M(12.8), M(22.6));
  // The flash and the crypto chip, a regulator, the microphone and the reset button.
  s += tag(
    'chip',
    rect(
      M(4.3),
      M(25.5),
      M(6.0),
      M(5.0),
      T.chip,
      Object.assign({ rx: T['radius-chip'] }, edge(T, T['chip-edge'], T['stroke-detail'])),
    ) +
      circle(M(4.9), M(26.1), 0.7, T['chip-print']) +
      text(M(7.3), M(28.4), '25SF128A', PIN_LABEL, T['chip-print']),
  );
  s += tag(
    'chip',
    rect(
      M(11.0),
      M(25.6),
      M(2.1),
      M(1.8),
      T.chip,
      Object.assign({ rx: T['radius-chip'] }, edge(T, T['chip-edge'], T['stroke-detail'])),
    ) + circle(M(11.4), M(26.0), 0.5, T['chip-print']),
  );
  s += sot23(T, M(11.7), M(28.1), 5) + via(T, M(13.1), M(32.4));
  s += tag(
    'microphone',
    rect(
      M(4.6),
      M(30.9),
      M(3.0),
      M(4.0),
      T.chip,
      Object.assign({ rx: T['radius-chip'] }, edge(T, T['chip-edge'], T['stroke-detail'])),
    ) + circle(M(6.1), M(32.2), M(0.35), T.cavity, edge(T, T['metal-edge'], T['stroke-fine'])),
  );
  const bx = M(7.9);
  const by = M(31.3);
  const bw = M(3.9);
  const bh = M(2.6);
  s += tag(
    'button',
    rect(bx, by, bw, bh, T.metal, Object.assign({ rx: 0.8 }, edge(T, T['metal-edge'], T['stroke-detail']))) +
      rect(bx + M(0.5), by + M(0.3), bw - M(1.0), bh - M(0.6), T['metal-edge'], { rx: 0.6, 'fill-opacity': 0.35 }) +
      circle(
        bx + bw / 2,
        by + bh / 2,
        M(0.8),
        T['plastic-white'],
        Object.assign({ 'data-hook': 'reset-button' }, edge(T, T['plastic-white-edge'], T['stroke-fine'])),
      ),
  );
  // By the USB: the RGB LED, the regulator and its inductor, passives, and the D13 and power LEDs either side of the connector.
  s += indicator({ x: M(5.3), y: M(35.5), size: M(1.2), color: 'blue', on: ind.rgb, hook: 'rgb-led', finish: fin });
  s +=
    sot23(T, M(8.1), M(35.6), 3) +
    smd(T, 'capacitor', M(10.6), M(34.5), false) +
    smd(T, 'resistor', M(4.7), M(37.4), true) +
    smd(T, 'resistor', M(10.3), M(37.4), true);
  s += microUsb(T, w / 2, M(39.2), M(7.5), M(5.8));
  s += indicator({
    x: M(2.75),
    y: M(40.6),
    size: M(1.36),
    color: 'orange',
    on: ind.user,
    hook: 'user-led',
    finish: fin,
  });
  s += indicator({
    x: M(13.7),
    y: M(40.6),
    size: M(1.36),
    color: 'green',
    on: ind.power,
    hook: 'power-led',
    state: 'power',
    finish: fin,
  });
  // The rows: names beside the module stand on end between the pad and the module, the rest lie inward.
  const row = function (list, x, side) {
    list.forEach((n, k) => {
      const y = top + k * p;
      const label = silk(n);
      const onEnd = y < my + mh + M(0.6);
      s += pin({ x, y, kind, label: onEnd ? undefined : label, side, silk: f.silk, size: PIN_LABEL });
      if (onEnd) {
        const lx =
          side === 'right' ? x + T['pad-radius'] + 1.0 + PIN_LABEL / 2 : x - T['pad-radius'] - 1.0 - PIN_LABEL / 2;
        s += text(lx, y, label, PIN_LABEL, f.silk, {
          'dominant-baseline': 'middle',
          transform: `rotate(-90 ${r2(lx)} ${r2(y)})`,
        });
      }
      pins.push({ name: n, x, y });
    });
  };
  row(left, leftX, 'right');
  row(right, rightX, 'left');
  return art(w, h, props.description || props.label || 'Nano-class radio board', s, pins);
}

/**
 * The Nucleo-64 board: 31 x 33 pitches with the debugger section across
 * the top (its mini USB, chip, LEDs, jumpers and the break line), the USER
 * and RESET buttons, the LQFP-48 controller with its crystal, the user LED
 * (hook user-led) and the power LED (data-lit-state powered). The morpho
 * headers run down both edges as 2 x 19 pads: `left` and `right` give each
 * row's pair in the catalog's order (left: outer then inner; right: inner
 * then outer; null for an unconnected place). The Arduino sockets sit
 * inside them: `power` (CN6 ending on row 12: 7 from IOREF, or 8 with a
 * leading null for the unconnected pin 1) and `analog` (6, rows 14 to 19)
 * on the left, `digitalHigh` (10, rows 2 to 11) and `digitalLow` (8, rows
 * 12 to 19) on the right. Pins come out in that order.
 */
export function nucleo64BoardTemplate(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const M = function (v) {
    return v * mm;
  };
  const fin = props.finish || 'white';
  const f = finish(T, fin);
  const w = M(70);
  const h = M(82.5);
  let s = '';
  const pins = [];
  const ind = { power: true, user: false, ...props.indicators };
  s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: M(52.0), y: M(79.0), size: 0.7 * p } });
  // The morpho rows' outer columns 2.5 inch apart, the Arduino sockets 1.9 inch apart two pitches inside them, as on the board.
  const X0 = M(3.3);
  const top = M(32.8);
  const rowYof = function (r) {
    return top + r * p;
  };
  const left = props.left || [];
  const right = props.right || [];
  const power = props.power || [];
  const analog = props.analog || [];
  const dHigh = props.digitalHigh || [];
  const dLow = props.digitalLow || [];
  const LX = [X0, X0 + p];
  const RX = [X0 + 24 * p, X0 + 25 * p];
  const AL = X0 + 3 * p;
  const AR = X0 + 22 * p;
  [
    [X0 + M(6.7), top - M(4.1)],
    [X0 + M(55.6), top - M(4.1)],
    [X0 + M(40.0), top + M(47.6)],
  ].forEach(c => {
    s += tag('hole', circle(c[0], c[1], M(1.6), T.hole, edge(T, T.pad, 1.0)));
  });
  // Traces from every pad in toward the controller.
  for (let r = 0; r < 19; r++) {
    const y = rowYof(r);
    s +=
      trace(T, fin, [
        [LX[1], y],
        [LX[1] + 1.2 * p, y + 0.4 * p],
      ]) +
      trace(T, fin, [
        [RX[0], y],
        [RX[0] - 1.2 * p, y - 0.4 * p],
      ]);
  }
  s +=
    via(T, M(17.5), M(64.0)) +
    via(T, M(51.5), M(64.0)) +
    via(T, M(13.0), M(4.0)) +
    via(T, M(55.0), M(13.0)) +
    via(T, M(30.0), M(46.0)) +
    via(T, M(41.0), M(46.0));
  // The debugger section: USB at the top, its chip and crystal, the COM LED, the jumpers, the SWD header down the left and the break line.
  s += usbPort(T, { kind: 'mini', x: M(46.9) - 1.9 * p, y: T['board-inset'], w: 3.8 * p, h: 1.7 * p, mouth: 'up' });
  s += qfp(T, M(31.0), M(11.8), M(7.0), M(7.0), 12, 'DEBUG');
  s +=
    smd(T, 'crystal', M(25.0), M(13.6), false) +
    smd(T, 'capacitor', M(40.2), M(13.0), false) +
    smd(T, 'capacitor', M(40.2), M(16.0), false);
  s += indicator({
    x: M(60.0),
    y: M(5.4),
    size: 0.8 * p,
    color: 'red',
    on: false,
    hook: 'com-led',
    finish: fin,
    label: 'COM',
  });
  let jp = '';
  [
    [M(20.6), M(3.4)],
    [M(20.6) + p, M(3.4)],
    [M(20.6), M(3.4) + p],
    [M(20.6) + p, M(3.4) + p],
  ].forEach(c => {
    jp += circle(c[0], c[1], 0.3 * p, T.pad) + circle(c[0], c[1], 0.14 * p, T.hole);
  });
  s += tag('icsp', jp) + text(M(21.9), M(9.6), 'CN2', PIN_LABEL, f.silk);
  let swd = '';
  for (let k = 0; k < 6; k++)
    swd += circle(M(8.0), M(9.8) + k * p, 0.3 * p, T.pad) + circle(M(8.0), M(9.8) + k * p, 0.14 * p, T.hole);
  s += tag('icsp', swd) + text(M(11.6), M(16.4), 'SWD', PIN_LABEL, f.silk);
  s += text(M(34.5), M(22.6), 'DEBUGGER', PIN_LABEL, f.silk, { 'fill-opacity': 0.8 });
  s += line(1.5 * p, M(25.9), w - 1.5 * p, M(25.9), f.silk, T['stroke-fine'], {
    'stroke-dasharray': '3 2.4',
    'stroke-opacity': 0.7,
  });
  // The target section: USER (blue) and RESET (black) buttons below the break line, the power and user LEDs, the regulator, the controller and its crystal, passives.
  s += tag(
    'button',
    rect(
      M(24.3),
      M(27.4),
      M(6.0),
      M(6.0),
      T['plastic-black'],
      Object.assign({ rx: 0.6 }, edge(T, T['plastic-black-edge'], T['stroke-detail'])),
    ) +
      circle(
        M(27.3),
        M(30.4),
        M(1.8),
        T['plastic-blue'],
        Object.assign({ 'data-hook': 'user-button' }, edge(T, T['plastic-blue-edge'], T['stroke-fine'])),
      ),
  );
  s += text(M(27.3), M(33.4) + PIN_LABEL + 0.6, 'USER', PIN_LABEL, f.silk);
  s += tactile(T, f, M(38.7), M(27.4), M(6.0), 'RESET', 'reset-button');
  s += indicator({
    x: M(48.2),
    y: M(28.6),
    size: 0.8 * p,
    color: 'red',
    on: ind.power,
    hook: 'power-led',
    state: 'powered',
    finish: fin,
    label: 'PWR',
  });
  s += indicator({
    x: M(51.6),
    y: M(28.6),
    size: 0.8 * p,
    color: 'green',
    on: ind.user,
    hook: 'user-led',
    finish: fin,
    label: 'LD4',
  });
  s += tag(
    'regulator',
    rect(M(20.0), M(37.6), M(3.0), M(1.4), T.metal, { rx: 0.3 }) +
      rect(
        M(18.3),
        M(38.8),
        M(6.5),
        M(3.5),
        T['plastic-black'],
        Object.assign({ rx: 0.4 }, edge(T, T['plastic-black-edge'], T['stroke-fine'])),
      ),
  );
  s += qfp(T, M(31.0), M(52.2), M(7.6), M(7.6), 12, props.chipLabel || 'STM32C031C6');
  s +=
    smd(T, 'crystal', M(22.0), M(53.0), false) +
    smd(T, 'capacitor', M(25.0), M(48.5), false) +
    smd(T, 'capacitor', M(42.6), M(48.5), false) +
    smd(T, 'resistor', M(25.0), M(60.0), false) +
    smd(T, 'resistor', M(42.6), M(60.0), false);
  s += smd(T, 'capacitor', M(29.0), M(40.0), true) + smd(T, 'capacitor', M(36.0), M(40.0), true);
  s += text(M(36.3), M(70.5), props.label || 'STM32 BOARD', 6, f.silk, { 'font-weight': 700 });
  s += text(M(36.3), M(74.5), 'R3 HEADERS', PIN_LABEL, f.silk, { 'fill-opacity': 0.8 });
  // The morpho pads, row by row, then the Arduino sockets.
  // The board prints no names beside the morpho pads, only the header's name over them: the pins keep their names for the host.
  const pad = function (x, y, name) {
    if (name === null || name === undefined) {
      s += tag('pin', circle(x, y, T['pad-radius'], T.pad) + circle(x, y, T['hole-radius'], T.hole));
      return;
    }
    s += pin({ x, y, kind: 'pad' });
    pins.push({ name, x, y });
  };
  for (let r = 0; r < 19; r++) {
    const y = rowYof(r);
    const lp = left[r] || [null, null];
    pad(LX[0], y, lp[0]);
    pad(LX[1], y, lp[1]);
  }
  for (let r = 0; r < 19; r++) {
    const y = rowYof(r);
    const rp = right[r] || [null, null];
    pad(RX[0], y, rp[0]);
    pad(RX[1], y, rp[1]);
  }
  s +=
    text(LX[0] + p / 2, top - 0.9 * p, 'CN7', PIN_LABEL, f.silk) +
    text(RX[0] + p / 2, top - 0.9 * p, 'CN10', PIN_LABEL, f.silk);
  // A null name is an unconnected position (CN6 pin 1): the socket without a pin.
  const sock = function (x, row, name, side) {
    const y = rowYof(row);
    if (name === null || name === undefined) {
      s += pin({ x, y, kind: 'socket' });
      return;
    }
    s += pin({ x, y, kind: 'socket', label: silkName(name), side, silk: f.silk, size: PIN_LABEL });
    pins.push({ name, x, y });
  };
  const powerRow = 12 - power.length;
  power.forEach((n, i) => {
    sock(AL, powerRow + i, n, 'right');
  });
  analog.forEach((n, i) => {
    sock(AL, 13 + i, n, 'right');
  });
  dHigh.forEach((n, i) => {
    sock(AR, 1 + i, n, 'left');
  });
  dLow.forEach((n, i) => {
    sock(AR, 11 + i, n, 'left');
  });
  s +=
    text(AL, rowYof(powerRow - 1) - 0.35 * p, 'POWER', PIN_LABEL, f.silk) +
    text(AL, rowYof(12) + 1.4, 'ANALOG', PIN_LABEL, f.silk) +
    text(AR, rowYof(0) - 0.35 * p, 'DIGITAL', PIN_LABEL, f.silk);
  return art(w, h, props.description || props.label || 'Nucleo-64 board', s, pins);
}

/**
 * The Raspberry Pi Pico as photographed: a green 21 x 51 mm board with
 * twenty castellated pads a side named on the silk, the micro USB at the
 * top with the LED beside it, the BOOTSEL button (boot-button) at the
 * left, the RP2040 in the middle with its flash above and crystal below,
 * the three debug pads at the bottom, four holes. left and right name the
 * rows top to bottom. The debug pads are pins too unless debugPins is
 * false, for a host that wires only the two rows. The box is 8.6 x 20
 * pitches.
 */
export function picoBoardTemplate(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const fin = props.finish || 'green';
  const f = finish(T, fin);
  const left = props.left || [];
  const right = props.right || [];
  const ind = props.indicators || { power: false, user: false };
  const w = 8.6 * p;
  const h = 20 * p;
  const leftX = 0.8 * p;
  const rightX = 7.8 * p;
  const top = 0.5 * p;
  const cx = 4.3 * p;
  let s = '';
  s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: 5.4 * p, y: 15.6 * p, size: 0.7 * p } });
  [
    [2.6 * p, 2.0 * p],
    [5.9 * p, 2.0 * p],
    [2.6 * p, 18.0 * p],
    [5.7 * p, 18.0 * p],
  ].forEach(c => {
    s += tag('hole', circle(c[0], c[1], T['mount-hole-radius'], T.hole, edge(T, T.pad)));
  });
  left.forEach((_, k) => {
    const y = top + k * p;
    s += trace(T, fin, [
      [leftX, y],
      [leftX + 1.3 * p, y],
      [leftX + 1.7 * p, y + 0.35 * p],
    ]);
  });
  right.forEach((_, k) => {
    const y = top + k * p;
    s += trace(T, fin, [
      [rightX, y],
      [rightX - 1.3 * p, y],
      [rightX - 1.7 * p, y - 0.35 * p],
    ]);
  });
  s += via(T, 3.0 * p, 14.6 * p) + via(T, 6.0 * p, 14.6 * p) + via(T, 5.9 * p, 7.2 * p);
  s += microUsb(T, cx, T['board-inset'], 2.6 * p, 1.5 * p, 'up');
  s += indicator({
    x: 2.3 * p,
    y: 0.6 * p,
    size: 0.6 * p,
    color: 'green',
    on: ind.user,
    hook: 'user-led',
    finish: fin,
  });
  s += tactile(T, f, 2.2 * p, 3.3 * p, 1.4 * p, undefined, 'boot-button');
  // The regulator at the top right, the flash left of centre, the RP2040 in the middle with its crystal below.
  s += sot23(T, 4.5 * p, 2.3 * p, 5) + framed(T, f, 'capacitor', 4.9 * p, 4.0 * p, true);
  s += soic(T, 3.2 * p, 5.0 * p, 1.5 * p, 1.3 * p, 2, undefined);
  s += qfp(T, cx - 1.3 * p, 8.0 * p, 2.6 * p, 2.6 * p, 10, props.chipLabel || 'RP2040');
  s +=
    smd(T, 'crystal', cx - 0.65 * p, 11.6 * p, true) +
    smd(T, 'capacitor', 3.0 * p, 12.6 * p, true) +
    smd(T, 'resistor', 4.7 * p, 12.6 * p, true);
  if (props.label)
    s += text(2.3 * p, 9.3 * p, props.label, 4.4, f.silk, {
      'dominant-baseline': 'middle',
      transform: `rotate(-90 ${r2(2.3 * p)} ${r2(9.3 * p)})`,
    });
  // The three debug pads at the bottom.
  const dbg = header({
    x: leftX + 2 * p,
    y: top + 19 * p,
    labels: ['SWCLK', 'GND', 'SWDIO'],
    kind: 'pad',
    silk: f.silk,
    size: PIN_LABEL,
  });
  s += text(cx, h - 1.45 * p, 'DEBUG', PIN_LABEL, f.silk);
  const lh = header({
    x: leftX,
    y: top,
    axis: 'y',
    labels: left.map(silkName),
    kind: 'pad',
    side: 'right',
    silk: f.silk,
    size: PIN_LABEL,
  });
  const rh = header({
    x: rightX,
    y: top,
    axis: 'y',
    labels: right.map(silkName),
    kind: 'pad',
    side: 'left',
    silk: f.silk,
    size: PIN_LABEL,
  });
  lh.pins.forEach((pn, i) => {
    pn.name = left[i];
  });
  rh.pins.forEach((pn, i) => {
    pn.name = right[i];
  });
  s += lh.svg + rh.svg + dbg.svg.replace(/<text[^>]*>[^<]*<\/text>/g, '');
  return art(
    w,
    h,
    props.description || props.label || 'Raspberry Pi Pico',
    s,
    lh.pins.concat(rh.pins, props.debugPins === false ? [] : dbg.pins),
  );
}

/**
 * The Nucleo-32 as photographed: a white 18.5 x 50.8 mm board with fifteen
 * pads a side, the micro USB at the top with the COM and PWR lamps either
 * side, the debugger in LQFP-48 under it, the reset button, the target in
 * LQFP-32 lower down with its crystal, the user lamp LD3, and the two
 * virtual COM port pads (VCP_TX, VCP_RX) on the grid. The box is the
 * board, 18.5 mm by 20 pitches.
 */
export function nucleo32BoardTemplate(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const fin = props.finish || 'white';
  const f = finish(T, fin);
  const left = props.left || [];
  const right = props.right || [];
  const ind = { power: true, user: false, ...props.indicators };
  const w = (18.5 * p) / 2.54;
  const h = 20 * p;
  const leftX = (w - 6 * p) / 2;
  const rightX = w - leftX;
  const top = 2.9 * p;
  const cx = w / 2;
  let s = '';
  s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: cx + 2.2 * p, y: 18.3 * p, size: 0.7 * p } });
  left.forEach((_, k) => {
    const y = top + k * p;
    s += trace(T, fin, [
      [leftX, y],
      [leftX + 1.3 * p, y],
      [leftX + 1.7 * p, y + 0.35 * p],
    ]);
  });
  right.forEach((_, k) => {
    const y = top + k * p;
    s += trace(T, fin, [
      [rightX, y],
      [rightX - 1.3 * p, y],
      [rightX - 1.7 * p, y - 0.35 * p],
    ]);
  });
  s += via(T, 5.5 * p, 8.0 * p);
  s += microUsb(T, cx, T['board-inset'], 2.6 * p, 1.5 * p, 'up');
  s += indicator({
    x: cx - 2.4 * p,
    y: 0.6 * p,
    size: 0.6 * p,
    color: 'red',
    on: false,
    hook: 'com-led',
    finish: fin,
    label: 'COM',
  });
  s += indicator({
    x: cx + 1.9 * p,
    y: 0.6 * p,
    size: 0.6 * p,
    color: 'red',
    on: ind.power,
    hook: 'power-led',
    state: 'powered',
    finish: fin,
    label: 'PWR',
  });
  s += qfp(T, cx - 1.3 * p, 2.3 * p, 2.6 * p, 2.6 * p, 10, 'DEBUGGER');
  s += smd(T, 'crystal', cx + 1.2 * p, 5.3 * p, false) + smd(T, 'capacitor', cx - 1.5 * p, 5.4 * p, false);
  s += tactile(T, f, cx - 1.7 * p, 6.6 * p, 1.2 * p, 'RESET', 'reset-button');
  s += line(1.6 * p, 8.9 * p, w - 1.6 * p, 8.9 * p, f.silk, T['stroke-fine'], {
    'stroke-dasharray': '3 2.4',
    'stroke-opacity': 0.7,
  });
  s += qfp(T, cx - 1.3 * p, 9.9 * p, 2.6 * p, 2.6 * p, 8, props.chipLabel || 'STM32');
  s +=
    smd(T, 'crystal', cx - 0.65 * p, 13.2 * p, true) +
    smd(T, 'capacitor', cx - 1.5 * p, 13.0 * p, false) +
    smd(T, 'capacitor', cx + 1.0 * p, 13.0 * p, false);
  s += indicator({
    x: cx - 0.3 * p,
    y: 16.6 * p,
    size: 0.6 * p,
    color: 'green',
    on: ind.user,
    hook: 'user-led',
    finish: fin,
    label: 'LD3',
  });
  const extra = [];
  (
    props.extraPads || [
      { name: 'VCP_TX', dx: 2, dy: 12 },
      { name: 'VCP_RX', dx: 4, dy: 12 },
    ]
  ).forEach(e => {
    const x = leftX + e.dx * p;
    const y = top + e.dy * p;
    s += pin({ x, y, kind: 'pad' }) + text(x, y - T['pad-radius'] - 1.4, e.name, PIN_LABEL, f.silk);
    extra.push({ name: e.name, x, y });
  });
  if (props.label) s += text(cx - 0.9 * p, h - 0.75 * p, props.label, 4.4, f.silk);
  const lh = header({
    x: leftX,
    y: top,
    axis: 'y',
    labels: left.map(silkName),
    kind: 'pad',
    side: 'right',
    silk: f.silk,
    size: PIN_LABEL,
  });
  const rh = header({
    x: rightX,
    y: top,
    axis: 'y',
    labels: right.map(silkName),
    kind: 'pad',
    side: 'left',
    silk: f.silk,
    size: PIN_LABEL,
  });
  lh.pins.forEach((pn, i) => {
    pn.name = left[i];
  });
  rh.pins.forEach((pn, i) => {
    pn.name = right[i];
  });
  s += lh.svg + rh.svg;
  return art(w, h, props.description || props.label || 'Nucleo-32 board', s, lh.pins.concat(rh.pins, extra));
}

/**
 * The STM32F103C8 "Blue Pill": a blue board 53 x 22.9 mm with two 20-pin
 * rows along the long edges 0.6 inch apart, drawn from photographs of the
 * board with its micro USB at the left: the BOOT0 and BOOT1 jumpers (both
 * at 0) and the reset button beside the USB, the LQFP-48 set at 45 degrees
 * in the middle, the 8 MHz can and the 32 kHz crystal to its right, then
 * the power and PC13 LEDs and the four SWD pads at the right end. `top` and
 * `bottom` name the rows left to right (the upper row from the grounds at
 * the USB end to VBAT, the lower from B12 to 3V3); `order` is the catalog's
 * handle order for the pins; names print without their `.N` suffix.
 */
export function bluePillBoard(props) {
  props = props || {};
  const T = tokens();
  const p = T.pitch;
  const mm = p / 2.54;
  const fin = props.finish || 'blue';
  const f = finish(T, fin);
  const w = 21 * p;
  const h = 9 * p;
  let s = '';
  const ind = props.indicators || {};
  const top = props.top || [
    'GND.2',
    'GND',
    '3V3',
    'R',
    'B11',
    'B10',
    'B1',
    'B0',
    'A7',
    'A6',
    'A5',
    'A4',
    'A3',
    'A2',
    'A1',
    'A0',
    'C15',
    'C14',
    'C13',
    'VBAT',
  ];
  const bottom = props.bottom || [
    'B12',
    'B13',
    'B14',
    'B15',
    'A8',
    'A9',
    'A10',
    'A11',
    'A12',
    'A15',
    'B3',
    'B4',
    'B5',
    'B6',
    'B7',
    'B8',
    'B9',
    '5V',
    'GND.3',
    '3V3.2',
  ];
  const order = props.order || [
    '3V3',
    '3V3.2',
    '5V',
    'A0',
    'A1',
    'A10',
    'A11',
    'A12',
    'A15',
    'A2',
    'A3',
    'A4',
    'A5',
    'A6',
    'A7',
    'A8',
    'A9',
    'B0',
    'B1',
    'B10',
    'B11',
    'B12',
    'B13',
    'B14',
    'B15',
    'B3',
    'B4',
    'B5',
    'B6',
    'B7',
    'B8',
    'B9',
    'C13',
    'C14',
    'C15',
    'GND',
    'GND.2',
    'GND.3',
    'R',
    'VBAT',
  ];
  const at = {};
  s += board({ width: w, height: h, finish: fin, holes: false, mark: { x: 6.3 * p, y: 5.0 * p, size: 0.6 * p } });
  // A few traces from the rows toward the chip, two vias.
  [
    [6, 'top'],
    [9, 'top'],
    [15, 'top'],
    [4, 'bottom'],
    [8, 'bottom'],
    [11, 'bottom'],
  ].forEach(c => {
    const x = (c[0] + 1) * p;
    const y = c[1] === 'top' ? 1.5 * p : 7.5 * p;
    const dy = c[1] === 'top' ? 1 : -1;
    s += trace(T, fin, [
      [x, y],
      [x, y + dy * 1.1 * p],
      [x + 0.6 * p, y + dy * 1.7 * p],
    ]);
  });
  s += via(T, 7.0 * p, 6.3 * p) + via(T, 17.6 * p, 3.6 * p);
  // The micro USB at the left end.
  s += usbPort(T, { kind: 'micro', x: 0, y: 4.5 * p - 1.4 * p, w: 2.0 * p, h: 2.8 * p, mouth: 'left' });
  // The BOOT0 and BOOT1 jumpers beside it: two three-pin rows, each cap on the two pins nearer the USB.
  [2.6, 3.6].forEach(jy => {
    s += tag(
      'jumper',
      rect(
        2.5 * p,
        jy * p,
        2.6 * p,
        0.6 * p,
        T['plastic-black'],
        Object.assign({ rx: 0.3 }, edge(T, T['plastic-black-edge'], T['stroke-fine'])),
      ) +
        rect(
          2.44 * p,
          (jy - 0.06) * p,
          1.72 * p,
          0.72 * p,
          '#e8c547',
          Object.assign({ rx: 0.4 }, edge(T, '#a9871f', T['stroke-fine'])),
        ),
    );
  });
  s += text(5.85 * p, 3.4 * p + PIN_LABEL * 0.4, 'BOOT', PIN_LABEL, f.silk);
  // The reset button below them, two resistors beside it.
  s += tactile(T, f, 2.9 * p, 4.65 * p, 1.2 * p, 'RST', 'reset-button');
  s += smd(T, 'resistor', 4.6 * p, 4.75 * p, false) + smd(T, 'resistor', 5.4 * p, 4.75 * p, false);
  // The LQFP-48 at 45 degrees, as the board mounts it.
  const cx = 9.9 * p;
  const cy = 4.5 * p;
  const body = 7 * mm;
  const half = body / 2;
  let g = '';
  for (let i = 0; i < 12; i++) {
    const off = -half + ((i + 0.5) * body) / 12;
    g +=
      rect(cx + off - 0.6, cy - half - 0.2 * p, 1.2, 0.2 * p, T.lead) +
      rect(cx + off - 0.6, cy + half, 1.2, 0.2 * p, T.lead) +
      rect(cx - half - 0.2 * p, cy + off - 0.6, 0.2 * p, 1.2, T.lead) +
      rect(cx + half, cy + off - 0.6, 0.2 * p, 1.2, T.lead);
  }
  g += rect(cx - half, cy - half, body, body, T.chip, Object.assign({ rx: T['radius-chip'] }, edge(T, T['chip-edge'])));
  g += circle(cx - half + 2.2, cy + half - 2.2, 0.9, T['chip-print']);
  g += text(cx, cy + 1.6, 'STM32F103', 4.4, T['chip-print'], { 'font-weight': 600 });
  s += el('g', { 'data-part': 'chip', transform: `rotate(45 ${r2(cx)} ${r2(cy)})` }, g);
  // The 8 MHz HC-49 can standing across the board, the black 32 kHz crystal beside it, two capacitors.
  s += tag(
    'crystal',
    rect(
      12.45 * p,
      2.4 * p,
      1.8 * p,
      4.2 * p,
      T.metal,
      Object.assign({ rx: 0.9 * p }, edge(T, T['metal-edge'], T['stroke-fine'])),
    ) + rect(12.75 * p, 2.75 * p, 1.2 * p, 3.5 * p, '#ffffff', { rx: 0.6 * p, 'fill-opacity': 0.18 }),
  );
  s += tag(
    'crystal',
    rect(
      14.6 * p,
      3.0 * p,
      1.3 * p,
      3.0 * p,
      T['plastic-black'],
      Object.assign({ rx: 0.3 }, edge(T, T['plastic-black-edge'], T['stroke-fine'])),
    ),
  );
  s += smd(T, 'capacitor', 14.75 * p, 2.35 * p, true) + smd(T, 'capacitor', 16.25 * p, 5.85 * p, true);
  // The power and PC13 LEDs, then the four SWD pads at the right end, between the rows.
  s += indicator({
    x: 16.4 * p,
    y: 2.6 * p,
    size: 0.6 * p,
    color: 'red',
    on: ind.power,
    hook: 'power-led',
    state: 'powered',
    finish: fin,
    label: 'PWR',
  });
  s += indicator({
    x: 16.4 * p,
    y: 4.3 * p,
    size: 0.6 * p,
    color: 'green',
    on: ind.user,
    hook: 'user-led',
    finish: fin,
    label: 'PC13',
  });
  [3, 4, 5, 6].forEach(k => {
    s += barePad(T, 18.5 * p, k * p);
  });
  // The rows: pads with their short names, pins in the catalog's order.
  top.forEach((n, c) => {
    const x = (c + 1) * p;
    const y = 1.5 * p;
    at[n] = { x, y };
    s += pin({ x, y, kind: 'pad', label: silkName(n), side: 'below', silk: f.silk, size: PIN_LABEL });
  });
  bottom.forEach((n, c) => {
    const x = (c + 1) * p;
    const y = 7.5 * p;
    at[n] = { x, y };
    s += pin({ x, y, kind: 'pad', label: silkName(n), side: 'above', silk: f.silk, size: PIN_LABEL });
  });
  const pins = order
    .filter(n => {
      return at[n];
    })
    .map(n => {
      return { name: n, x: at[n].x, y: at[n].y };
    });
  return art(w, h, props.description || props.label || 'STM32F103C8 Blue Pill board', s, pins);
}

// The catalog's boards: each template filled in with a real board's pins, silk and options, so a call with no options
// draws that board. Each takes the options its catalog entry lists (src/options.js): a board's `indicators`.
/** A board's indicators, unlit unless the caller lights them. */
function lights(props, user) {
  const ind = (props && props.indicators) || {};
  return user === false ? { power: ind.power === true } : { power: ind.power === true, user: ind.user || false };
}

// Uno-class, Nano-class and Mega-class boards.

/** The Uno-class board: its header groups as the catalog has them; the silk prints SCL and SDA on the second A5 and A4, as the board does. */
export function unoClassBoard(props) {
  return devBoardTemplate({
    layout: 'landscape',
    label: 'UNO-CLASS',
    chipLabel: 'ATMEGA328P',
    labels: { 'A5.2': 'SCL', 'A4.2': 'SDA' },
    top: [
      ['A5.2', 'A4.2', 'AREF', 'GND', '13', '12', '11', '10', '9', '8'],
      ['7', '6', '5', '4', '3', '2', '1', '0'],
    ],
    bottom: [
      ['NC', 'IOREF', 'RESET', '3.3V', '5V', 'GND.2', 'GND.3', 'VIN'],
      ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'],
    ],
    groupNames: { top: ['DIGITAL (PWM ~)'], bottom: ['POWER', 'ANALOG IN'] },
    pwm: ['3', '5', '6', '9', '10', '11'],
    indicators: lights(props),
    description: 'Uno-class board',
  });
}

const NANO_LABELS = { 0: 'RX0', 1: 'TX1', '3.3V': '3V3', AREF: 'REF', RESET: 'RST', 'RESET.2': 'RST' };
for (let nanoDigit = 2; nanoDigit <= 13; nanoDigit++) NANO_LABELS[String(nanoDigit)] = `D${nanoDigit}`;

/** The Nano-class board at its real 18.5 mm width, upright with the USB at the top, the ICSP header's six pins at the far end. */
export function nanoClassBoard(props) {
  return devBoardTemplate({
    label: 'NANO-CLASS',
    chipLabel: 'ATMEGA328P',
    pinKind: 'pad',
    widthPitches: 7.2,
    labels: NANO_LABELS,
    left: ['13', '3.3V', 'AREF', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', '5V', 'RESET', 'GND', 'VIN'],
    right: ['12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'GND.2', 'RESET.2', '0', '1'],
    icsp: ['12.2', '5V.2', '13.2', '11.2', 'RESET.3', 'GND.3'],
    indicators: lights(props),
    description: 'Nano-class board',
  });
}

function numbered(from, count, step) {
  const out = [];
  for (let i = 0; i < count; i++) out.push(String(from + i * step));
  return out;
}

/** The Mega-class board: the digital and communication headers, the 2 x 18 block read row by row, power and both analog groups. */
export function megaClassBoard(props) {
  return megaBoardTemplate({
    label: 'MEGA-CLASS',
    chipLabel: 'ATMEGA2560',
    top: [
      ['SCL', 'SDA', 'AREF', 'GND', '13', '12', '11', '10', '9', '8'],
      ['7', '6', '5', '4', '3', '2', '1', '0'],
      numbered(14, 8, 1),
    ],
    block: {
      left: ['5V.2'].concat(numbered(22, 16, 2), ['GND.4']),
      right: ['5V.3'].concat(numbered(23, 16, 2), ['GND.5']),
    },
    bottom: [
      ['IOREF', 'RESET', '3.3V', '5V', 'GND.2', 'GND.3', 'VIN'],
      numbered(0, 8, 1).map(n => {
        return `A${n}`;
      }),
      numbered(8, 8, 1).map(n => {
        return `A${n}`;
      }),
    ],
    groupNames: { top: ['DIGITAL (PWM ~)', 'COMMUNICATION'], bottom: ['POWER', 'ANALOG IN'] },
    pwm: numbered(2, 12, 1),
    indicators: lights(props),
    description: 'Mega-class board',
  });
}

/** The Nano RP2040 Connect, upright with the USB at the bottom: D12 and D13 at the USB end, TX at the far end after RX. */
export function nanoRp2040Board(props) {
  return nanoConnectTemplate({
    label: 'NANO RP2040',
    chipLabel: 'RP2040',
    left: ['TX', 'RX', 'RESET', 'GND', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12'],
    right: ['VIN', 'GND.2', 'REC', '5V', 'A7', 'A6', 'A5', 'A4', 'A3', 'A2', 'A1', 'A0', 'AREF', '3.3V', 'D13'],
    indicators: lights(props),
    description: 'Nano RP2040 Connect board',
  });
}

/** The Pico-class board: two 20-pin castellated rows read from the USB end; the eight grounds numbered by physical pin. */
export function picoClassBoard(props) {
  return picoBoardTemplate({
    label: 'PICO-CLASS',
    chipLabel: 'RP2040',
    debugPins: false,
    indicators: lights(props),
    description: 'Pico-class board',
    left: [
      'GP0',
      'GP1',
      'GND',
      'GP2',
      'GP3',
      'GP4',
      'GP5',
      'GND.2',
      'GP6',
      'GP7',
      'GP8',
      'GP9',
      'GND.3',
      'GP10',
      'GP11',
      'GP12',
      'GP13',
      'GND.4',
      'GP14',
      'GP15',
    ],
    right: [
      'VBUS',
      'VSYS',
      'GND.8',
      '3V3_EN',
      '3V3',
      'ADC_VREF',
      'GP28',
      'GND.7',
      'GP27',
      'GP26',
      'RUN',
      'GP22',
      'GND.6',
      'GP21',
      'GP20',
      'GP19',
      'GP18',
      'GND.5',
      'GP17',
      'GP16',
    ],
  });
}

// ESP32 development boards in Espressif's DevKit formats: two headers 0.9 inch apart, read from the module end.

/** The ESP32 DevKit V1: two 15-pin rows, the blue LED on GPIO2. */
export function esp32DevKitV1(props) {
  return espDevKitTemplate({
    label: 'ESP32 DEVKIT V1',
    chipLabel: 'ESP-WROOM-32',
    indicators: lights(props),
    description: 'ESP32 development board',
    left: ['EN', 'VP', 'VN', 'D34', 'D35', 'D32', 'D33', 'D25', 'D26', 'D27', 'D14', 'D12', 'D13', 'GND.2', 'VIN'],
    right: ['D23', 'D22', 'TX0', 'RX0', 'D21', 'D19', 'D18', 'D5', 'TX2', 'RX2', 'D4', 'D2', 'D15', 'GND', '3V3'],
  });
}

/** The ESP32-DevKitC V4 (headers J2 and J3): a WROOM-32 module over the rows, no user LED, 19-pin rows (CLK, CMD and D0 to D3 are the module's flash pins). */
export function esp32DevKitCV4(props) {
  return espDevKitTemplate({
    label: 'ESP32 DEVKITC V4',
    chipLabel: 'ESP32-WROOM-32D',
    layout: 'devkitc',
    indicators: lights(props, false),
    description: 'ESP32 development board',
    left: [
      '3V3',
      'EN',
      'VP',
      'VN',
      '34',
      '35',
      '32',
      '33',
      '25',
      '26',
      '27',
      '14',
      '12',
      'GND',
      '13',
      'D2',
      'D3',
      'CMD',
      '5V',
    ],
    right: [
      'GND.2',
      '23',
      '22',
      'TX',
      'RX',
      '21',
      'GND.3',
      '19',
      '18',
      '5',
      '17',
      '16',
      '4',
      '0',
      '2',
      '15',
      'D1',
      'D0',
      'CLK',
    ],
  });
}

/** A DevKitM-1 or DevKitC-1 at its true size (espDevKitTemplate layout 'devkit-1'): spec.size is the module, board length, antenna overhang and first pin's offset from Espressif's dimension drawing. */
function moduleDevKit(spec, props) {
  return espDevKitTemplate({
    layout: 'devkit-1',
    module: spec.size[0],
    length: spec.size[1],
    overhang: spec.size[2],
    firstPin: spec.size[3],
    usb: spec.usb,
    buttons: spec.buttons,
    bridge: spec.bridge,
    label: spec.label,
    chipLabel: spec.module,
    left: spec.left,
    right: spec.right,
    indicators: { power: lights(props).power },
    description: spec.description,
  });
}

/** The ESP32-C3 DevKitM-1: the C3-MINI-1 module, a micro USB. */
export function esp32C3DevKit(props) {
  return moduleDevKit(
    {
      module: 'ESP32-C3-MINI-1',
      label: 'DEVKITM-1',
      size: ['mini', 38.91, 5.35, 1.68],
      usb: 'micro',
      buttons: ['BOOT', 'RST'],
      bridge: 'CP2102N',
      description: 'ESP32-C3 development board',
      left: ['GND', '3V3', '3V3.2', '2', '3', 'GND.2', 'RST', 'GND.3', '0', '1', '10', 'GND.4', '5V', '5V.2', 'GND.5'],
      right: ['GND.6', 'TX', 'RX', 'GND.7', '9', '8', 'GND.8', '7', '6', '5', '4', 'GND.9', '18', '19', 'GND.10'],
    },
    props,
  );
}

/** The ESP32-S2 DevKitM-1 (headers J1 and J3); TX is GPIO43, RX GPIO44. */
export function esp32S2DevKit(props) {
  return moduleDevKit(
    {
      module: 'ESP32-S2-MINI-1',
      label: 'DEVKITM-1',
      size: ['mini-s2', 54.0, 5.6, 1.6],
      usb: 'micro',
      buttons: ['BOOT', 'RST'],
      bridge: 'CP2102N',
      description: 'ESP32-S2 development board',
      left: [
        '3V3',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '5V',
        'GND',
      ],
      right: [
        'GND.2',
        'RST',
        '46',
        '45',
        'RX',
        'TX',
        '42',
        '41',
        '40',
        '39',
        '38',
        '37',
        '36',
        '35',
        '34',
        '33',
        '26',
        '21',
        '20',
        '19',
        '18',
      ],
    },
    props,
  );
}

/** The ESP32-S3 DevKitC-1 (headers J1 and J3); TX is GPIO43, RX GPIO44. */
export function esp32S3DevKit(props) {
  return moduleDevKit(
    {
      module: 'ESP32-S3-WROOM-1',
      label: 'DEVKITC-1',
      size: ['wroom', 62.74, 8.25, 1.53],
      usb: 'dual-micro',
      buttons: ['BOOT', 'RESET'],
      bridge: 'CP2102N',
      description: 'ESP32-S3 development board',
      left: [
        '3V3',
        '3V3.2',
        'RST',
        '4',
        '5',
        '6',
        '7',
        '15',
        '16',
        '17',
        '18',
        '8',
        '3',
        '46',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '5V',
        'GND',
      ],
      right: [
        'GND.2',
        'TX',
        'RX',
        '1',
        '2',
        '42',
        '41',
        '40',
        '39',
        '38',
        '37',
        '36',
        '35',
        '0',
        '45',
        '48',
        '47',
        '21',
        '20',
        '19',
        'GND.3',
        'GND.4',
      ],
    },
    props,
  );
}

/** The ESP32-C5 DevKitC-1 (headers J1 and J3); TX is GPIO11, RX GPIO12. */
export function esp32C5DevKit(props) {
  return moduleDevKit(
    {
      module: 'ESP32-C5-WROOM-1',
      label: 'DEVKITC-1',
      size: ['wroom', 53.6, 6.5, 1.575],
      usb: 'dual-c',
      buttons: ['RESET', 'BOOT'],
      description: 'ESP32-C5 development board',
      left: ['3V3', 'RST', '2', '3', '0', '1', '6', '7', '8', '9', '10', '26', '25', '5V', 'GND', 'NC0'],
      right: ['GND.2', 'TX', 'RX', '24', '23', '15', '27', '4', '5', 'NC1', '28', 'GND.3', '14', '13', 'GND.4', 'NC2'],
    },
    props,
  );
}

/** The ESP32-C6 DevKitC-1 (headers J1 and J3); TX is GPIO16, RX GPIO17. */
export function esp32C6DevKit(props) {
  return moduleDevKit(
    {
      module: 'ESP32-C6-WROOM-1',
      label: 'DEVKITC-1',
      size: ['wroom', 51.8, 6.35, 1.575],
      usb: 'dual-c',
      buttons: ['BOOT', 'RESET'],
      description: 'ESP32-C6 development board',
      left: ['3V3', 'RST', '4', '5', '6', '7', '0', '1', '8', '10', '11', '2', '3', '5V', 'GND', null],
      right: ['GND.2', 'TX', 'RX', '15', '23', '22', '21', '20', '19', '18', '9', 'GND.3', '13', '12', 'GND.4', null],
    },
    props,
  );
}

/** The ESP32-H2 DevKitM-1 (headers J1 and J3); TX is GPIO24, RX GPIO23. */
export function esp32H2DevKit(props) {
  return moduleDevKit(
    {
      module: 'ESP32-H2-MINI-1',
      label: 'DEVKITM-1',
      size: ['mini', 48.26, 5.4, 1.46],
      usb: 'dual-c',
      buttons: ['RESET', 'BOOT'],
      description: 'ESP32-H2 development board',
      left: ['3V3', 'RST', '0', '1', '2', '3', '13', '14', '4', '5', 'NC', 'VBAT', 'GND', '5V', 'GND.2'],
      right: ['GND.3', 'TX', 'RX', '10', '11', '25', '12', '8', '22', 'GND.4', '9', 'GND.5', '27', '26', 'GND.6'],
    },
    props,
  );
}

// STM32 Nucleo boards.

/** The Nucleo-32 with the STM32L031K6: CN3 and CN4 in the Arduino Nano layout, the left row's RST and GND numbered 1, the right row's 2. */
export function stm32L031K6Board(props) {
  return nucleo32BoardTemplate({
    label: 'L031K6 BOARD',
    chipLabel: 'STM32L031K6',
    indicators: { power: lights(props).power },
    description: 'Nucleo-32 board with an STM32L031K6',
    left: ['D1', 'D0', 'RST', 'GND', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12'],
    right: ['VIN', 'GND.2', 'RST.2', '5V', 'A7', 'A6', 'A5', 'A4', 'A3', 'A2', 'A1', 'A0', 'REF', '3V3', 'D13'],
  });
}

/** The Nucleo-64 with the STM32C031C6: the morpho headers CN7 and CN10 (odd pin outer), and the Arduino headers CN6, CN8, CN5 and CN9 beside the pins they duplicate. */
export function stm32C031C6Board(props) {
  return nucleo64BoardTemplate({
    label: 'C031C6 BOARD',
    chipLabel: 'STM32C031C6',
    indicators: { power: lights(props).power },
    description: 'Nucleo-64 board with an STM32C031C6',
    left: [
      ['PD0', 'PD1'],
      ['PD2', 'PD2.2'],
      ['VDD', 'E5V'],
      ['PA14', 'GND.4'],
      [null, null],
      [null, 'IOREF.2'],
      ['PA13', 'NRST.2'],
      ['PC6', '3V3.2'],
      [null, '5V.2'],
      ['GND.5', 'GND.6'],
      [null, 'GND.7'],
      ['PC13', 'VIN.2'],
      ['PC14', null],
      [null, 'PA0'],
      ['PF0', 'PA1'],
      ['PF1', 'PA4'],
      ['PB11', 'PB0.2'],
      ['PA2', 'PA11'],
      [null, 'PA12'],
    ],
    right: [
      ['PD3', 'PA3'],
      ['PB8', 'PC15'],
      ['PB9', 'PB12'],
      ['AVDD.2', '5V.3'],
      ['GND.8', null],
      ['PA5', 'PF3'],
      ['PA6', 'PA8'],
      ['PA7', 'PB12.2'],
      ['PB0', null],
      ['PC7', 'GND.9'],
      ['PA9', 'PB2'],
      ['PA15', 'PB1'],
      ['PB5', 'PB15'],
      ['PB4', 'PB14'],
      ['PB10', 'PB13'],
      ['PB3', 'AGND'],
      ['PA10', null],
      ['PB6', null],
      ['PB7', null],
    ],
    power: [null, 'IOREF', 'NRST', '3V3', '5V', 'GND', 'GND.2', 'VIN'],
    analog: ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'],
    digitalHigh: ['D15', 'D14', 'AVDD', 'GND.3', 'D13', 'D12', 'D11', 'D10', 'D9', 'D8'],
    digitalLow: ['D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'D1', 'D0'],
  });
}
