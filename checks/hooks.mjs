// The hook, geometry, DOM-patching and scoped-token contracts:
// - every catalog part emits only `pk-*` ids and non-empty `data-hook` attributes;
// - every interactive input, actuator, display, module, board, lamp and test lead emits its frozen `data-hook` names;
// - hookRect, lcdLattice and matrixLayout extract valid canvas-overlay geometry from every screen, LCD, matrix and RFID;
// - withTokenMode switches mode/prefix for its callback and restores the previous setting even when the callback throws;
// - syncSvg preserves hooked elements and host-owned attributes under both default `data-hook` and custom `hookAttribute`.
import { isDeepStrictEqual } from 'node:util';
import * as K from '../src/index.js';
import { testLead } from '../src/primitives.js';
import { findHook, syncSvg } from '../src/dom.js';

const problems = [];
const fail = (what, msg) => problems.push(`${what}: ${msg}`);
const hooksOf = svg => new Set([...svg.matchAll(/\sdata-hook="([^"]*)"/g)].map(m => m[1]));

// 1. Every catalog part: non-empty data-hook values, and ids limited to pk-* defs.
for (const e of K.CATALOG) {
  const { svg } = K.drawPart(e.id);
  for (const m of svg.matchAll(/\sdata-hook="([^"]*)"/g)) {
    if (!m[1]) fail(e.id, 'empty data-hook');
  }
  for (const m of svg.matchAll(/\sid="([^"]*)"/g)) {
    if (!m[1].startsWith('pk-')) fail(e.id, `unexpected non-pk id="${m[1]}"`);
  }
}

// 2. Frozen data-hook contract across every part family a host animates, overlays or operates.
const REQUIRED_HOOKS = [
  ['pushbutton', undefined, ['cap']],
  ['pushbutton-6-mm', undefined, ['cap']],
  ['potentiometer', undefined, ['knob']],
  ['slide-potentiometer', undefined, ['lever']],
  ['dip-switch-8-way', undefined, ['lever-1', 'lever-2', 'lever-3', 'lever-4', 'lever-5', 'lever-6', 'lever-7', 'lever-8']],
  ['rotary-encoder', undefined, ['knob']],
  ['joystick', undefined, ['stick', 'cap']],
  ['keypad-4x4', undefined, ['key-1-1', 'key-1-4', 'key-4-1', 'key-4-4']],
  ['ir-remote', undefined, ['key-power', 'key-play', 'key-vol-up', 'key-vol-down', 'key-0', 'key-9']],
  ['rotary-dialer', undefined, ['dial']],
  ['servo', undefined, ['horn']],
  ['stepper-motor', undefined, ['rotor']],
  ['biaxial-stepper', undefined, ['rotor', 'rotor-2']],
  ['geared-stepper', undefined, ['rotor']],
  ['dc-motor', { blur: 0.5 }, ['rotor', 'rotor-blur', 'rotor-blades']],
  ['dc-gear-motor', { blur: 0.5 }, ['rotor', 'rotor-blur']],
  ['water-pump', { running: true }, ['pump', 'flow']],
  ['solenoid', undefined, ['plunger']],
  ['dpdt-relay', undefined, ['relay']],
  ['led-5-mm', { on: true, live: { flow: true } }, ['lens', 'glow', 'flow-a', 'flow-c']],
  ['resistor', { live: { flow: true, heat: 0.5 } }, ['heat', 'flow-1', 'flow-2']],
  ['uno-class-board', { indicators: { power: true, user: true } }, ['reset-button', 'user-led', 'power-led', 'tx-led', 'rx-led']],
  ['stm32-blue-pill', { indicators: { power: true, user: true } }, ['reset-button', 'boot0-jumper', 'boot1-jumper', 'user-led', 'power-led']],
  ['rp2040-nano-class-board', { indicators: { power: true, user: true } }, ['reset-button', 'user-led', 'power-led', 'rgb-led']],
  ['stm32-board-64-pin', undefined, ['reset-button', 'user-button', 'user-led', 'power-led']],
  ['esp32-s3-dev-board', undefined, ['boot-button', 'reset-button', 'power-led']],
  ['character-lcd-16x2', undefined, ['glass', 'matrix']],
  ['character-lcd-20x4', undefined, ['glass', 'matrix']],
  ['oled-0-96in-i2c', undefined, ['display']],
  ['oled-0-96in-spi', undefined, ['display']],
  ['oled-1-5in', undefined, ['glass', 'display']],
  ['tft-display-2-4in', undefined, ['glass', 'display']],
  ['tft-display-2-8in-touch', undefined, ['glass', 'display']],
  ['graphic-lcd-84x48', undefined, ['glass', 'display']],
  ['e-paper-display-2-9in', undefined, ['paper', 'display']],
  ['led-matrix-8x8', undefined, ['face-0']],
  ['led-matrix-chain-of-4', undefined, ['face-0', 'face-1', 'face-2', 'face-3']],
  ['rfid-reader', undefined, ['field']],
  ['stepper-driver-board', undefined, ['led-a', 'led-b', 'led-c', 'led-d']],
  ['multimeter', undefined, ['jack-mA', 'jack-COM', 'jack-V', 'plug-black', 'plug-red']],
];

for (const [id, options, want] of REQUIRED_HOOKS) {
  const got = hooksOf(K.drawPart(id, options).svg);
  for (const hook of want) {
    if (!got.has(hook)) fail(id, `missing required data-hook="${hook}"`);
  }
}
const lead = testLead({ color: 'red', plug: { x: 10, y: 10 }, tip: { x: 60, y: 80 } });
if (!hooksOf(lead.svg).has('lead-cable')) fail('testLead', 'missing data-hook="lead-cable"');

// 3. Structured display & overlay geometry helpers.
for (const id of [
  'oled-0-96in-i2c',
  'oled-0-96in-spi',
  'oled-1-5in',
  'tft-display-2-4in',
  'tft-display-2-8in-touch',
  'graphic-lcd-84x48',
  'e-paper-display-2-9in',
]) {
  const art = K.drawPart(id);
  const rect = K.hookRect(art, 'display');
  if (!rect || rect.width <= 0 || rect.height <= 0 || rect.x + rect.width > art.width || rect.y + rect.height > art.height)
    fail(id, `hookRect(display) invalid: ${JSON.stringify(rect)}`);
}
const rfidField = K.hookRect(K.drawPart('rfid-reader'), 'field');
if (!rfidField || rfidField.width <= 0 || rfidField.height <= 0) fail('rfid-reader', 'hookRect(field) missing');
if (K.hookRect(K.drawPart('resistor'), 'display') !== undefined) fail('hookRect', 'returned rect for absent hook');

for (const [id, cols, rows] of [
  ['character-lcd-16x2', 16, 2],
  ['character-lcd-20x4', 20, 4],
]) {
  const art = K.drawPart(id);
  const lat = K.lcdLattice(art);
  if (!lat || lat.cols !== cols || lat.rows !== rows) {
    fail(id, `lcdLattice invalid: ${JSON.stringify(lat)}`);
  } else {
    const right = lat.x + (cols - 1) * lat.cellDx + 4 * lat.dotDx + lat.dotW;
    const bottom = lat.y + (rows - 1) * lat.cellDy + 7 * lat.dotDy + lat.dotH;
    if (lat.x <= 0 || lat.y <= 0 || right >= lat.glass.width || bottom >= lat.glass.height)
      fail(id, `lcdLattice overflows glass: ${JSON.stringify(lat)}`);
    const bp = K.lcdLattice(K.drawPart(id, { backpack: true, color: 'blue' }));
    if (!isDeepStrictEqual(bp, lat)) fail(id, 'backpack/blue changes lcdLattice');
  }
}
if (K.lcdLattice(K.drawPart('resistor')) !== undefined) fail('lcdLattice', 'returned lattice for non-LCD');

for (const [id, chain] of [
  ['led-matrix-8x8', 1],
  ['led-matrix-chain-of-4', 4],
]) {
  const layout = K.matrixLayout(K.drawPart(id));
  if (!layout || layout.faces.length !== chain || layout.leds.length !== chain || layout.ledRadius <= 0) {
    fail(id, `matrixLayout invalid: ${JSON.stringify(layout)}`);
  } else {
    for (let i = 1; i < layout.faces.length; i++) {
      if (layout.faces[i].x <= layout.faces[i - 1].x) fail(id, 'faces not sorted left to right');
    }
    for (const faceLeds of layout.leds) {
      if (faceLeds.length !== 64) fail(id, `expected 64 leds per face, got ${faceLeds.length}`);
      for (const p of faceLeds) {
        if (p.x < 0 || p.y < 0 || p.x > layout.box.width || p.y > layout.box.height)
          fail(id, `led (${p.x}, ${p.y}) outside box`);
      }
    }
  }
}
if (K.matrixLayout(K.drawPart('resistor')) !== undefined) fail('matrixLayout', 'returned layout for non-matrix');

// 4. Scoped token mode (withTokenMode).
K.setTokenMode('values');
const varsArt = K.withTokenMode('vars', { prefix: 'kit-' }, () => K.resistor({ ohms: 220 }));
if (!varsArt.svg.includes('var(--kit-')) fail('withTokenMode', 'did not apply vars mode inside callback');
if (!isDeepStrictEqual(K.tokenMode(), { mode: 'values', prefix: '' }))
  fail('withTokenMode', `did not restore mode: ${JSON.stringify(K.tokenMode())}`);
K.setTokenMode('vars', { prefix: 'dc-' });
let threw = false;
try {
  K.withTokenMode('values', () => {
    if (K.tokenMode().mode !== 'values') fail('withTokenMode', '2-arg form did not switch to values');
    throw new Error('boom');
  });
} catch {
  threw = true;
}
if (!threw) fail('withTokenMode', 'swallowed callback error');
if (!isDeepStrictEqual(K.tokenMode(), { mode: 'vars', prefix: 'dc-' }))
  fail('withTokenMode', `did not restore after throw: ${JSON.stringify(K.tokenMode())}`);
K.setTokenMode('values');

// 5. syncSvg & findHook with both default data-hook and custom hookAttribute.
class FakeNode {
  constructor(nodeType, localName = '', nodeValue = null) {
    this.nodeType = nodeType;
    this.localName = localName;
    this.nodeValue = nodeValue;
    this.parentNode = null;
    this.childNodes = [];
    this.attrs = new Map();
  }
  get attributes() {
    return [...this.attrs].map(([name, value]) => ({ name, value }));
  }
  getAttribute(name) {
    return this.attrs.get(name) ?? null;
  }
  setAttribute(name, value) {
    this.attrs.set(name, value);
  }
  removeAttribute(name) {
    this.attrs.delete(name);
  }
  hasAttribute(name) {
    return this.attrs.has(name);
  }
  get nextSibling() {
    const siblings = this.parentNode?.childNodes ?? [];
    return siblings[siblings.indexOf(this) + 1] ?? null;
  }
  get lastChild() {
    return this.childNodes.at(-1) ?? null;
  }
  removeChild(node) {
    this.childNodes.splice(this.childNodes.indexOf(node), 1);
    node.parentNode = null;
    return node;
  }
  insertBefore(node, before) {
    node.parentNode?.removeChild(node);
    this.childNodes.splice(before ? this.childNodes.indexOf(before) : this.childNodes.length, 0, node);
    node.parentNode = this;
    return node;
  }
  appendChild(node) {
    return this.insertBefore(node, null);
  }
  replaceChild(node, old) {
    this.insertBefore(node, old);
    return this.removeChild(old);
  }
}
const mk = (tag, attrs, ...children) => {
  const n = new FakeNode(1, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  for (const c of children) n.appendChild(c);
  return n;
};
for (const attr of ['data-hook', 'data-svg-id']) {
  const opts = attr === 'data-hook' ? undefined : { hookAttribute: attr };
  const board = lit =>
    mk(
      'svg',
      {},
      mk('rect', { [attr]: 'body' }),
      ...(lit ? [mk('rect', { [attr]: 'user-led-glow', fill: 'gold' })] : []),
      mk('circle', { [attr]: 'reset-button', r: '3' }),
    );
  const shown = board(false);
  const reset = shown.childNodes[1];
  reset.setAttribute('tabindex', '0');
  syncSvg(shown, board(true), opts);
  if (shown.childNodes[2] !== reset || reset.getAttribute('tabindex') !== '0')
    fail('syncSvg', `failed to keep hooked node under ${attr}`);
  syncSvg(shown, board(false), opts);
  if (shown.childNodes[1] !== reset) fail('syncSvg', `failed to keep hooked node on removal under ${attr}`);
  let queried = '';
  findHook({ querySelector: s => ((queried = s), null) }, 'knob', opts);
  if (queried !== `[${attr}="knob"]`) fail('findHook', `queried ${queried} instead of [${attr}="knob"]`);
}

if (problems.length) {
  console.log(problems.join('\n'));
  console.log(`${problems.length} problems`);
  process.exit(1);
}
console.log(
  `hooks: ${REQUIRED_HOOKS.length} hook contracts, overlay geometry (screens, LCDs, MAX7219, RFID), withTokenMode and syncSvg verified`,
);
