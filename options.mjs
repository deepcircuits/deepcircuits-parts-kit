// The catalog's names and options, held to what the parts draw:
// - every id is its name as a slug, starts with a letter and is unique;
// - every option's default draws what leaving it out draws, and every other value of it changes the drawing (in the
//   context its `when` names), so a part never lists an option it ignores;
// - every example passes checkOptions and draws;
// - pin names follow the convention: unique, a repeated name bare once and .2, .3 after, never .1;
// - each family entry point exports the generators its parts name.
import * as K from './src/index.js';
import { optionApplies } from './src/catalog.js';

const problems = [];
const fail = (id, msg) => problems.push(`${id}: ${msg}`);

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

const svgOf = (id, options) => K.drawPart(id, options).svg;
for (const e of K.CATALOG) {
  for (const [k, spec] of Object.entries(e.options)) {
    const ctx = contextFor(spec, e);
    if (!optionApplies(spec, { ...e.preset, ...ctx })) fail(e.id, `${k}: its when cannot be met`);
    const busy = busyFor(k, spec, e, ctx);
    const check = (options, label) => {
      const bad = K.checkOptions(e.id, options);
      if (bad.length) return fail(e.id, `${label}: ${bad.join('; ')}`);
      return svgOf(e.id, options);
    };
    // The default draws what leaving the option out draws; `value` draws something else, alone or beside the others.
    const holds = (value, label) => {
      for (const c of [ctx, busy]) {
        const at = svgOf(e.id, c);
        const drawn = check({ ...c, [k]: value }, label);
        if (drawn !== undefined && drawn !== at) return true;
      }
      return false;
    };
    const keeps = (value, label) => [ctx, busy].every(c => check({ ...c, [k]: value }, label) === svgOf(e.id, c));
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
      for (const ex of spec.examples || []) check({ ...ctx, [k]: withEach(spec, ex, e.preset) }, `${k} example ${ex.label}`);
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
    if (m && m[2] !== '1' && !names.includes(m[1]) && !/^\d+$/.test(m[1]))
      fail(e.id, `pin ${n} has no bare ${m[1]}`);
  }
}

// The family entry points export the generators their parts name.
const families = {
  board: 'boards',
  display: 'displays',
  sensor: 'sensors',
  input: 'inputs',
  output: 'outputs',
  module: 'modules',
  chip: 'chips',
  passive: 'passives',
  breadboard: 'breadboards',
  symbol: 'symbols',
};
for (const [fam, file] of Object.entries(families)) {
  const mod = await import(`./src/families/${file}.js`);
  for (const e of K.CATALOG.filter(c => c.family === fam))
    if (typeof mod[e.fn] !== 'function') fail(e.id, `src/families/${file}.js has no ${e.fn}`);
}

if (problems.length) {
  console.log(problems.join('\n'));
  console.log(`${problems.length} problems`);
  process.exit(1);
}
console.log(`options: ${K.CATALOG.length} parts, ${K.CATALOG.reduce((n, e) => n + Object.keys(e.options).length, 0)} options, all drawn as listed`);
