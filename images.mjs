// Writes images/: every catalog part as a standalone SVG file, with manifest.json and a README that shows them all.
// Each part comes at rest (<id>.svg), in each of its on/off states (<id>--on.svg, --pressed), as its preview shows it
// (--example), with each value an option offers as an example (--lit-heart, --ohms-220), and in each colour it comes
// in (--green, and for a lens colour each state too: --green--on). A picture that draws the same as one before it is
// left out. The files carry the light ink as `color`, so the print that faces the canvas shows on its own.
// Run by npm run build and npm run check. The folder is committed, so a page can link to the files; it is not in the
// npm package.
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { CATALOG, FAMILIES, FAMILY_TITLES, optionApplies } from './src/catalog.js';
import { drawPart } from './src/draw.js';
import { PITCH } from './src/index.js';

const OUT = 'images';
const INK = '#020817';
const kebab = key => key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
const slug = text =>
  String(text)
    .toLowerCase()
    .replace(/#/g, ' hash ')
    .replace(/\*/g, ' star ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const lower = text => text.charAt(0).toLowerCase() + text.slice(1);

/** The pictures of a part: a file suffix, a label and the options that draw it. */
function picturesOf(entry) {
  const specs = Object.entries(entry.options);
  const applies = options => Object.entries(options).every(([key]) => optionApplies(entry.options[key], { ...entry.preset, ...options }));
  const states = specs.filter(([key, spec]) => entry.state.includes(key) && (spec.type === 'boolean' || spec.type === 'level'));
  const pictures = [{ suffix: '', label: 'At rest', options: {} }];
  for (const [key, spec] of states) pictures.push({ suffix: kebab(key), label: spec.label ?? key, options: { [key]: true } });
  // A board's or a module's indicator LEDs, all lit: how it looks powered.
  for (const [key, spec] of specs) {
    const fields = Object.entries(spec.fields ?? {});
    if (entry.state.includes(key) && fields.length && fields.every(([, f]) => f.type === 'boolean' || f.type === 'level'))
      pictures.push({
        suffix: `${kebab(key)}-lit`,
        label: `${spec.label ?? key}, lit`,
        options: { [key]: Object.fromEntries(fields.map(([field]) => [field, true])) },
      });
  }
  // A state that is a number (an angle, a knob's position, a colour channel), at each end of its range.
  for (const [key, spec] of specs)
    if (entry.state.includes(key) && (spec.type === 'number' || spec.type === 'integer') && !spec.examples)
      for (const value of [spec.min, spec.max])
        // A whole turn from its default looks the same as the default.
        if (value !== undefined && !(spec.unit === '°' && (value - (spec.default ?? 0)) % 360 === 0))
          pictures.push({
            suffix: `${kebab(key)}-${value < 0 ? `minus-${-value}` : value}`,
            label: `${spec.label ?? key}: ${value}${spec.unit ? ` ${spec.unit}` : ''}`,
            options: { [key]: value },
          });
  const example = Object.fromEntries(specs.filter(([, spec]) => spec.example !== undefined).map(([key, spec]) => [key, spec.example]));
  if (Object.keys(example).length) pictures.push({ suffix: 'example', label: 'Example', options: example });
  for (const [key, spec] of specs)
    for (const ex of spec.examples ?? []) {
      const value = ex.each
        ? Array.from({ length: Number(entry.preset.chain ?? spec.length ?? 1) }, () => ex.value)
        : ex.value;
      const name = typeof ex.value === 'number' ? ex.value : slug(ex.label);
      pictures.push({ suffix: `${kebab(key)}-${name}`, label: `${spec.label ?? key}: ${ex.label}`, options: { [key]: value } });
    }
  const colours = specs.filter(
    ([, spec]) => spec.type === 'color' || (spec.type === 'enum' && spec.choices?.length && spec.choices.every(c => c.swatch)),
  );
  for (const [key, spec] of colours)
    for (const choice of spec.choices) {
      const colour = slug(choice.value);
      pictures.push({ suffix: colour, label: choice.label, options: { [key]: choice.value } });
      // A lens colour is worth seeing lit: each state in each colour.
      if (spec.type === 'color')
        for (const [state, s] of states)
          pictures.push({
            suffix: `${colour}--${kebab(state)}`,
            label: `${choice.label}, ${lower(s.label ?? state)}`,
            options: { [key]: choice.value, [state]: true },
          });
    }
  return pictures.filter(p => applies(p.options));
}

const samePins = (a, b) => a.length === b.length && a.every((p, i) => p.name === b[i].name && p.x === b[i].x && p.y === b[i].y);
const hooksOf = svg => [...new Set([...svg.matchAll(/data-hook="([^"]+)"/g)].map(m => m[1]))];

mkdirSync(OUT, { recursive: true });
const files = new Map();
const parts = [];
for (const entry of CATALOG) {
  const base = drawPart(entry.id);
  const drawn = new Set();
  const images = [];
  for (const picture of picturesOf(entry)) {
    const art = drawPart(entry.id, picture.options);
    if (drawn.has(art.svg)) continue;
    drawn.add(art.svg);
    const file = `${entry.id}${picture.suffix ? `--${picture.suffix}` : ''}.svg`;
    if (files.has(file)) throw new Error(`${file} is written twice`);
    files.set(file, art.svg.replace('<svg ', `<svg color="${INK}" `));
    images.push({
      file,
      label: picture.label,
      options: picture.options,
      ...(art.width !== base.width || art.height !== base.height ? { width: art.width, height: art.height } : {}),
      ...(samePins(art.pins, base.pins) ? {} : { pins: art.pins }),
    });
  }
  parts.push({
    id: entry.id,
    name: entry.name,
    family: entry.family,
    aliases: entry.aliases,
    width: base.width,
    height: base.height,
    pins: base.pins,
    hooks: hooksOf(base.svg),
    images,
  });
}

// A file the catalog no longer draws goes.
for (const old of readdirSync(OUT)) if (old.endsWith('.svg') && !files.has(old)) rmSync(`${OUT}/${old}`);
for (const [file, svg] of files) writeFileSync(`${OUT}/${file}`, svg);

const manifest = {
  about:
    'Every DeepCircuits Parts Kit catalog part as SVG files. Sizes and pin positions are CSS pixels at 96 dpi; pins are measured from the top left of the part at rest. Generated by images.mjs; do not edit.',
  pitch: PITCH,
  parts,
};
// One pin per line keeps the file readable and its changes small.
writeFileSync(
  `${OUT}/manifest.json`,
  `${JSON.stringify(manifest, null, 2).replace(/\{\s+"name": ("[^"]*"),\s+"x": ([\d.-]+),\s+"y": ([\d.-]+)\s+\}/g, '{ "name": $1, "x": $2, "y": $3 }')}\n`,
);

const thumb = image => `<a href="${image.file}"><img src="${image.file}" height="56" alt="${image.label}" title="${image.label}"></a>`;
const readme = [
  '# Parts Kit images',
  '',
  `Every part in the catalog as an SVG file: ${parts.length} parts in ${files.size} pictures. Generated by \`images.mjs\` from the catalog; do not edit.`,
  '',
  '| File | Shows |',
  '| --- | --- |',
  '| `<id>.svg` | The part at rest, as `drawPart(id)` draws it. |',
  '| `<id>--<state>.svg` | One of its on/off states: `--on`, `--pressed`, `--energised`. |',
  '| `<id>--example.svg` | The part as its preview shows it: text on a screen, a value on a display. |',
  '| `<id>--<option>-<example>.svg` | A value an option offers as an example: `--lit-heart`, `--ohms-220`. |',
  '| `<id>--<colour>.svg` | Each colour the part comes in, and for an LED each colour lit: `--green--on`. |',
  '',
  '`manifest.json` lists every part with its name, family, size, pins (in CSS pixels at 96 dpi, from the top left) and `data-hook` names, and each picture with the options that draw it.',
  '',
  'Each file is drawn at its true size, 0.1 inch to 9.6 pixels, so a small part is a small picture: set a width to show it larger. The print that faces the canvas (a chip\'s pin names) is dark, for a light page.',
  '',
  'Link to a file from jsDelivr, which serves it from this repository:',
  '',
  '```html',
  '<img src="https://cdn.jsdelivr.net/gh/deepcircuits/deepcircuits-parts-kit@main/images/led-5-mm--on.svg" width="62" alt="A lit red LED">',
  '```',
  '',
];
for (const family of FAMILIES) {
  const inFamily = parts.filter(p => p.family === family);
  if (!inFamily.length) continue;
  readme.push(`## ${FAMILY_TITLES[family]}`, '', '| Part | Pictures |', '| --- | --- |');
  for (const part of inFamily) readme.push(`| ${part.name}<br>\`${part.id}\` | ${part.images.map(thumb).join(' ')} |`);
  readme.push('');
}
writeFileSync(`${OUT}/README.md`, readme.join('\n'));
console.log(`images: ${files.size} pictures of ${parts.length} parts -> ${OUT}/`);
