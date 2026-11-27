// The kit's lint rules: modern syntax in the source (src/), and the import boundary of each module.
import js from '@eslint/js';

const browser = { document: 'readonly', window: 'readonly', getComputedStyle: 'readonly', HTMLElement: 'readonly', Element: 'readonly', Node: 'readonly' };
const node = { process: 'readonly', console: 'readonly', URL: 'readonly' };

const DOM_MODULES = ['./dom.js', './element.js', './elementControls.js', './mount.js', './controls.js'];
const PARENT_DOM_MODULES = DOM_MODULES.map(p => `.${p}`);
const ARTWORK_MODULES = [
  './actuators.js',
  './boards.js',
  './breadboard.js',
  './chips.js',
  './discretes.js',
  './displays.js',
  './inputs.js',
  './modules.js',
  './passives.js',
  './pixels.js',
  './sensors.js',
  './symbols.js',
];

export default [
  { ignores: ['node_modules/', 'project/', 'index.html', 'src/tokens.js'] },
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: { ...browser, globalThis: 'readonly', console: 'readonly' } },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'no-unused-vars': ['error', { args: 'none' }],
    },
  },
  // Pure leaf modules must not depend on any other kit source file.
  {
    files: ['src/breadboardColors.js', 'src/controls.js', 'src/dom.js'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [{ group: ['./*', '../*'], message: 'Leaf modules must not import other kit modules.' }] }],
    },
  },
  // Pure metadata (options & catalog) must stay decoupled from drawing, families, and DOM adapters.
  {
    files: ['src/options.js', 'src/catalog.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: ['./core.js', './pieces.js', './leads.js', './helpers.js', './check.js', './draw.js', './index.js', ...DOM_MODULES, ...ARTWORK_MODULES],
          patterns: [{ group: ['./families/*'], message: 'Metadata modules must not import artwork families or DOM helpers.' }],
        },
      ],
    },
  },
  // Pure SVG drawing core, part generators, primitives, and templates stay DOM-free and never import top-level barrels or catalog.
  {
    files: [
      'src/core.js',
      'src/pieces.js',
      'src/leads.js',
      'src/helpers.js',
      'src/check.js',
      'src/primitives.js',
      'src/templates.js',
      'src/actuators.js',
      'src/boards.js',
      'src/breadboard.js',
      'src/chips.js',
      'src/discretes.js',
      'src/displays.js',
      'src/inputs.js',
      'src/modules.js',
      'src/passives.js',
      'src/pixels.js',
      'src/sensors.js',
      'src/symbols.js',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: ['./catalog.js', './draw.js', './index.js', ...DOM_MODULES],
          patterns: [{ group: ['./families/*'], message: 'SVG drawing modules must stay DOM-free and avoid barrel/catalog imports.' }],
        },
      ],
    },
  },
  // Family entry barrels only re-export their underlying artwork modules (no cycles, no DOM, no cross-family barrels).
  {
    files: ['src/families/*.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: ['../index.js', '../draw.js', '../catalog.js', ...PARENT_DOM_MODULES],
          patterns: [{ group: ['./*'], message: 'Family barrels must import underlying src/*.js modules, not sibling family barrels.' }],
        },
      ],
    },
  },
  // Headless entry points (draw, index) must remain DOM-free; draw must not cycle back to index.
  {
    files: ['src/draw.js'],
    rules: {
      'no-restricted-imports': ['error', { paths: ['./index.js', ...DOM_MODULES] }],
    },
  },
  {
    files: ['src/index.js'],
    rules: {
      'no-restricted-imports': ['error', { paths: DOM_MODULES }],
    },
  },
  // Lightweight browser/Web Component adapters must not pull in part artwork generators or full barrels.
  {
    files: ['src/element.js', 'src/elementControls.js', 'src/mount.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: ['./index.js', './draw.js', ...ARTWORK_MODULES],
          patterns: [{ group: ['./families/*'], message: 'Browser mount/element adapters must not statically pull in artwork generators.' }],
        },
      ],
    },
  },
  { files: ['*.mjs', '*.js', 'bin/**/*.mjs', 'checks/**/*.mjs', 'tools/**/*.mjs'], ignores: ['src/**'], languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: node } },
];
