// <parts-kit-part>'s attributes, held to the options they stand for:
// - every value an option lists (its default, example, examples, choices and range ends), written as an attribute,
//   reads back as the same value, for the option and for each field of an object option (live-flow);
// - every part's example options, written as attributes, pass checkOptions;
// - the spellings HTML allows (lowercase, kebab case, a bare boolean) and the attributes that are not options read as
//   the element reads them, and a misspelt option reaches drawPart, which names the nearest;
// - every input part has a control (src/elementControls.js), a knob drag turns the knob where it points, a drag round
//   the encoder turns it a detent each 18°, and each digit's hole on the dialer is found and winds round to the stop
//   within the dial's range (src/controls.js).
import { isDeepStrictEqual } from 'node:util';
import { CATALOG, checkOptions, exampleValue } from '../src/catalog.js';
import { angleBetween, detentsTurned, dialDigitAt, dialGeometry, dialTravel, knobPosition } from '../src/controls.js';
import { CONTROLS } from '../src/elementControls.js';
import { drawPart } from '../src/draw.js';
import { optionsFromAttributes } from '../src/element.js';

const problems = [];
const fail = (id, msg) => problems.push(`${id}: ${msg}`);
const kebab = key => key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);

/** A value as an attribute writes it. */
function text(spec, value) {
  if (value === true && (spec.type === 'boolean' || spec.type === 'level')) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}
/** The values an option lists, to write and read back. */
function valuesOf(spec, entry) {
  const values = [];
  if (spec.default !== undefined) values.push(spec.default);
  if (spec.example !== undefined) values.push(spec.example);
  for (const ex of spec.examples ?? [])
    values.push(exampleValue(entry, spec, ex));
  for (const choice of spec.choices ?? []) values.push(choice.value);
  if (spec.min !== undefined) values.push(spec.min);
  if (spec.max !== undefined) values.push(spec.max);
  if (spec.type === 'boolean') values.push(true, false);
  return values.filter(v => v !== undefined && !(typeof v === 'string' && spec.type === 'text' && v === ''));
}

let read = 0;
for (const e of CATALOG) {
  const example = {};
  for (const [key, spec] of Object.entries(e.options)) {
    for (const value of valuesOf(spec, e)) {
      const got = optionsFromAttributes(e.id, { [kebab(key)]: text(spec, value) });
      read++;
      if (!isDeepStrictEqual(got, { [key]: value }))
        fail(
          e.id,
          `${kebab(key)}="${text(spec, value)}" reads as ${JSON.stringify(got)}, not ${JSON.stringify(value)}`,
        );
    }
    for (const [field, inner] of Object.entries(spec.fields ?? {}))
      for (const value of valuesOf(inner, e)) {
        const name = `${kebab(key)}-${kebab(field)}`;
        const got = optionsFromAttributes(e.id, { [name]: text(inner, value) });
        read++;
        if (!isDeepStrictEqual(got, { [key]: { [field]: value } }))
          fail(e.id, `${name}="${text(inner, value)}" reads as ${JSON.stringify(got)}`);
      }
    if (spec.example !== undefined) example[kebab(key)] = text(spec, spec.example);
  }
  const problemsOf = checkOptions(e.id, optionsFromAttributes(e.id, example));
  if (problemsOf.length) fail(e.id, `its example attributes do not draw: ${problemsOf.join('; ')}`);
}

const same = (id, attributes, want) => {
  const got = optionsFromAttributes(id, attributes);
  if (!isDeepStrictEqual(got, want))
    fail(id, `${JSON.stringify(attributes)} reads as ${JSON.stringify(got)}, not ${JSON.stringify(want)}`);
};
same('led-5-mm', { type: 'led-5-mm', color: 'green', on: '' }, { color: 'green', on: true });
same('led-5-mm', { on: 'false', brightness: '0.5' }, { on: false, brightness: 0.5 });
same('led-5-mm', { 'live-flow': '' }, { live: { flow: true } });
same('led-5-mm', { live: '{"flow":"reverse"}', 'live-probe': 'K' }, { live: { flow: 'reverse', probe: 'K' } });
same(
  'servo',
  {
    angle: '45',
    class: 'big',
    style: 'width:2em',
    id: 'arm',
    'aria-label': 'Arm',
    'data-x': '1',
    onclick: 'go()',
    scale: '2',
  },
  { angle: 45 },
);
same('character-lcd-16x2', { lines: '["Hello","World"]' }, { lines: ['Hello', 'World'] });
same('addressable-led-strip', { pixelsize: '3535' }, { pixelSize: '3535' });
same(
  'addressable-led-strip',
  { 'pixel-size': '3535', pixelshape: 'round' },
  { pixelSize: '3535', pixelShape: 'round' },
);
same('full-breadboard', { 'split-rails': '' }, { splitRails: true });
same('slide-switch', { contact: '3' }, { contact: 3 });
// Misspelt: passed on as written, and drawPart names the option it is nearest to.
same('servo', { angel: '30' }, { angel: '30' });
if (!/did you mean "angle"/.test(checkOptions('servo', optionsFromAttributes('servo', { angel: '30' }))[0] ?? ''))
  fail('servo', 'a misspelt attribute does not name the nearest option');
if (!checkOptions('servo', optionsFromAttributes('servo', { angle: 'wide' })).length)
  fail('servo', 'an attribute that is not a number is not reported');

// The controls: one for every input part, each for a generator the catalog uses, with the geometry they work by.
for (const fn of Object.keys(CONTROLS)) if (!CATALOG.some(e => e.fn === fn)) fail(fn, 'a control for no catalog part');
for (const e of CATALOG) if (e.family === 'input' && !CONTROLS[e.fn]) fail(e.id, 'an input part with no control');
const near = (a, b) => Math.abs(a - b) < 1e-6;
const knob = [
  [0, -1, 0.2, 0.5],
  [1, 0, 0.2, 0.75 + 1 / 12],
  [-1, 0, 0.8, 0.25 - 1 / 12],
  [0.1, 1, 0.9, 1],
  [-0.1, 1, 0.1, 0],
];
for (const [dx, dy, previous, want] of knob)
  if (!near(knobPosition(dx, dy, previous), want))
    fail('potentiometer', `a drag to (${dx}, ${dy}) turns the knob to ${knobPosition(dx, dy, previous)}, not ${want}`);
const detents = [
  [0, 40, 2, 36],
  [0, -20, -1, -18],
  [350, 5, 0, 350],
  [350, 10, 1, 368],
];
for (const [from, to, want, next] of detents) {
  const turned = detentsTurned(from, to);
  if (turned.detents !== want || turned.from !== next)
    fail('rotary-encoder', `a drag from ${from}° to ${to}° turns ${JSON.stringify(turned)}, not ${want} to ${next}°`);
}
if (angleBetween(350, 10) !== 20 || angleBetween(0, 190) !== -170) fail('rotary-encoder', 'angles do not go the short way round');
const wheel = /<g [^>]*data-hook="dial"[^>]*>/.exec(drawPart('rotary-dialer').svg)?.[0] ?? '';
const geometry = dialGeometry({ getAttribute: name => new RegExp(` ${name}="([^"]*)"`).exec(wheel)?.[1] ?? null });
if (!geometry) fail('rotary-dialer', 'the wheel does not carry its geometry');
else {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const travels = digits.map(digit => dialTravel(geometry, digit));
  const max = CATALOG.find(e => e.id === 'rotary-dialer').options.angle.max;
  if (travels.some((t, i) => i && t <= travels[i - 1]))
    fail('rotary-dialer', `travels do not grow from 1 to 0: ${travels}`);
  if (travels.at(-1) > max) fail('rotary-dialer', `0 winds ${travels.at(-1)}°, past the angle's ${max}°`);
  digits.forEach(digit => {
    const at = (geometry.holes[(digit + 9) % 10] * Math.PI) / 180;
    const x = geometry.cx + Math.cos(at) * geometry.ring;
    const y = geometry.cy + Math.sin(at) * geometry.ring;
    if (dialDigitAt(geometry, x, y) !== digit)
      fail('rotary-dialer', `the ${digit} hole reads as ${dialDigitAt(geometry, x, y)}`);
  });
}

if (problems.length) {
  console.log(problems.join('\n'));
  console.log(`${problems.length} problems`);
  process.exit(1);
}
console.log(
  `element: ${read} option values read back from attributes across ${CATALOG.length} parts; ${Object.keys(CONTROLS).length} controls`,
);
