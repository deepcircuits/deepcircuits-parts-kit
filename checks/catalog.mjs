// The catalog (src/catalog.js), held to what the parts draw:
// - every id is its name as a slug, starts with a letter and is unique, in a known family, with a name and a state list;
// - every entry draws at rest with nothing overlapping and its pins on the pitch, and an unknown id throws;
// - every option's default draws what leaving it out draws, and every other value of it changes the drawing (in the
//   context its `when` names), so a part never lists an option it ignores;
// - every example passes checkOptions and draws;
// - pin names follow the convention: unique, a repeated name bare once and .2, .3 after, never .1;
// - loadPart draws each part from its family's entry point as drawPart draws it.
import { check, pinsOnPitch } from '../src/check.js';
import { optionApplies } from '../src/catalog.js';
import * as K from '../src/index.js';

const problems = [];
const fail = (id, msg) => problems.push(`${id}: ${msg}`);

// Each drawing once: the option checks draw the same contexts again and again.
const drawn = new Map();
function svgOf(id, options = {}) {
  const key = `${id} ${JSON.stringify(options)}`;
  if (!drawn.has(key)) drawn.set(key, K.drawPart(id, options).svg);
  return drawn.get(key);
}

const slug = name =>
  name
    .toLowerCase()
    .replace(/×/g, 'x')
    .replace(/″/g, 'in')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const ids = new Set();
for (const e of K.CATALOG) {
  if (e.id !== slug(e.name)) fail(e.id, `the id is not the name's slug (${slug(e.name)})`);
  if (!/^[a-z]/.test(e.id)) fail(e.id, 'the id must start with a letter');
  if (ids.has(e.id)) fail(e.id, 'the id repeats');
  ids.add(e.id);
  if (!K.FAMILIES.includes(e.family)) fail(e.id, `no family ${e.family}`);
  if (!e.name || !Array.isArray(e.state)) fail(e.id, 'needs a name and a state list');
  if (typeof K[e.fn] !== 'function') {
    fail(e.id, `PartsKit has no ${e.fn}`);
    continue;
  }
  let art;
  try {
    art = K.drawPart(e.id);
  } catch (err) {
    fail(e.id, `throws ${err.message}`);
    continue;
  }
  if (!art.svg || !art.pins) fail(e.id, 'not an Artwork');
  const overlaps = check(art);
  if (overlaps.length) fail(e.id, `${overlaps.length} overlaps`);
  if (art.pins.length && !pinsOnPitch(art.pins)) fail(e.id, 'pins off the pitch');
}
try {
  K.drawPart('no-such-part');
  problems.push('drawPart accepts an unknown id');
} catch {
  /* expected */
}

// A value of the spec other than its default, to show the option changes the drawing.
function probe(spec) {
  if (spec.examples && spec.examples.length) return spec.examples[0].value;
  if (spec.example !== undefined) return spec.example;
  const d = spec.default;
  switch (spec.type) {
    case 'boolean':
      return !d;
    case 'number':
    case 'integer':
      if (spec.max === undefined) return (d || 0) * 2 + 1;
      return d === spec.max ? spec.min : spec.max;
    case 'level':
      return d ? false : 1;
    case 'enum':
      return spec.choices.find(c => c.value !== d).value;
    case 'color':
      return (spec.choices || []).map(c => c.value).find(v => v !== d) || '#123456';
    case 'pixel':
      return '#ff0000';
    case 'text':
      return 'Hi';
    case 'frame':
      return { width: 8, height: 8, data: Array.from({ length: 64 }, (_, i) => (i + Math.floor(i / 8)) % 2) };
    case 'point':
      return { x: 40, y: 40 };
    case 'list':
      return Array.from({ length: spec.length || 2 }, () => probe(spec.items));
    default:
      throw new Error(`no probe for ${spec.type}`);
  }
}
const withEach = (spec, ex, preset) =>
  ex.each ? Array.from({ length: (preset && preset.chain) || spec.length || 1 }, () => ex.value) : ex.value;

// The options that put an option's `when` in force.
function contextFor(spec, entry) {
  const out = {};
  for (const [k, want] of Object.entries(spec.when || {})) {
    if (k in entry.preset) continue;
    const v = (Array.isArray(want) ? want : [want])[0];
    if (v !== null) out[k] = v;
  }
  return out;
}

// The other options set to their examples, so an option that shows only beside another (a matrix's colour, lit only
// where a frame lights it) gets the chance to show. Options named in the tested option's `when` keep its context.
function busyFor(key, spec, entry, ctx) {
  const out = { ...ctx };
  for (const [k, other] of Object.entries(entry.options)) {
    if (k === key || k in ctx || (spec.when && k in spec.when) || other.type === 'object') continue;
    const v = other.examples && other.examples.length ? withEach(other, other.examples[0], entry.preset) : other.example;
    if (v !== undefined) out[k] = v;
  }
  for (const [k, other] of Object.entries(entry.options))
    if (k in out && !(k in ctx) && !optionApplies(other, { ...entry.preset, ...out })) delete out[k];
  return out;
}

// The value to show an option with: its first example that is not its default, or else a probe.
function showValue(spec, preset) {
  const d = JSON.stringify(spec.default);
  for (const ex of spec.examples || []) {
    const v = withEach(spec, ex, preset);
    if (JSON.stringify(v) !== d) return v;
  }
  return probe(spec);
}

for (const e of K.CATALOG) {
  for (const [k, spec] of Object.entries(e.options)) {
    const ctx = contextFor(spec, e);
    if (!optionApplies(spec, { ...e.preset, ...ctx })) fail(e.id, `${k}: its when cannot be met`);
    const busy = busyFor(k, spec, e, ctx);
    const draws = (options, label) => {
      const bad = K.checkOptions(e.id, options);
      if (bad.length) return fail(e.id, `${label}: ${bad.join('; ')}`);
      return svgOf(e.id, options);
    };
    // The default draws what leaving the option out draws; `value` draws something else, alone or beside the others.
    const holds = (value, label) => {
      for (const c of [ctx, busy]) {
        const drawnWith = draws({ ...c, [k]: value }, label);
        if (drawnWith !== undefined && drawnWith !== svgOf(e.id, c)) return true;
      }
      return false;
    };
    const keeps = (value, label) => [ctx, busy].every(c => draws({ ...c, [k]: value }, label) === svgOf(e.id, c));
    if (spec.type === 'object') {
      for (const [f, fspec] of Object.entries(spec.fields)) {
        if (fspec.default !== undefined && !keeps({ [f]: fspec.default }, `${k}.${f} default`))
          fail(e.id, `${k}.${f}: the default ${JSON.stringify(fspec.default)} draws something else than leaving it out`);
        const v = fspec.type === 'text' ? K.partPins(e.id).pins[0]?.name || 'Hi' : probe(fspec);
        if (!holds({ [f]: v }, `${k}.${f}`)) fail(e.id, `${k}.${f}: ${JSON.stringify(v)} draws the same as the default`);
      }
    } else {
      if (spec.default !== undefined && !keeps(spec.default, `${k} default`))
        fail(e.id, `${k}: the default ${JSON.stringify(spec.default)} draws something else than leaving it out`);
      const v = showValue(spec, e.preset);
      if (!holds(v, k)) fail(e.id, `${k}: ${JSON.stringify(v).slice(0, 60)} draws the same as the default`);
      for (const ex of spec.examples || []) draws({ ...ctx, [k]: withEach(spec, ex, e.preset) }, `${k} example ${ex.label}`);
    }
  }
  // Pin names.
  const names = K.partPins(e.id).pins.map(p => p.name);
  const seen = new Set();
  for (const n of names) {
    if (seen.has(n)) fail(e.id, `pin ${n} repeats`);
    seen.add(n);
    const m = /^(.+)\.(\d+)$/.exec(n);
    if (m && m[2] === '1') fail(e.id, `pin ${n}: the first of a repeated name is bare`);
    if (m && m[2] !== '1' && !names.includes(m[1]) && !/^\d+$/.test(m[1])) fail(e.id, `pin ${n} has no bare ${m[1]}`);
  }
  // loadPart: the family's entry point exports the generator, and draws the part as drawPart does.
  try {
    if ((await K.loadPart(e.id))().svg !== svgOf(e.id)) fail(e.id, 'loadPart draws it differently from drawPart');
  } catch (err) {
    fail(e.id, `loadPart: ${err.message}`);
  }
}

if (problems.length) {
  console.log(problems.join('\n'));
  console.log(`${problems.length} problems`);
  process.exit(1);
}
console.log(
  `catalog: ${K.CATALOG.length} parts in ${K.FAMILIES.length} families, ${K.CATALOG.reduce((n, e) => n + Object.keys(e.options).length, 0)} options, all drawn as listed`,
);
