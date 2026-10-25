// The kit's lint rules: modern syntax in the source (src/), and the import boundary of each module.
import js from '@eslint/js';

const browser = { document: 'readonly', window: 'readonly', getComputedStyle: 'readonly', HTMLElement: 'readonly', Element: 'readonly', Node: 'readonly' };
const node = { process: 'readonly', console: 'readonly', URL: 'readonly' };

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
  { files: ['*.mjs', '*.js', 'bin/**/*.mjs', 'checks/**/*.mjs', 'tools/**/*.mjs'], ignores: ['src/**'], languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: node } },
];
