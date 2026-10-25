// The tokens as CSS custom properties: every colour per theme, then the metrics and type families.
// Pure, so it runs in a browser or a bundler as well as in Node; bin/parts-kit-tokens.mjs is the command line.
// The defaults write tokens.css as the kit ships it: light on :root, dark on [data-theme="dark"]. A consumer that draws with
// setTokenMode('vars', { prefix }) generates its own copy with the same prefix and its theme selectors.

/** The stylesheet for a parsed tokens.json. light and dark are selectors; a theme without its own selector uses [data-theme="<id>"]. */
export function tokensCss(t, { prefix = '', light, dark } = {}) {
  const first = t.color.themes[0].id;
  const val = (tok, theme) => typeof tok.value === 'string' ? tok.value : (tok.value[theme] ?? tok.value[first]);
  const selector = id => (id === first && light) || (id === 'dark' && dark) || (id === first ? `:root, [data-theme="${id}"]` : `[data-theme="${id}"]`);
  let css = '';
  for (const th of t.color.themes) css += `${selector(th.id)} {\n` + t.color.tokens.map(k => `  --${prefix}${k.name}: ${val(k, th.id)};`).join('\n') + '\n}\n';
  css += `${light || ':root'} {\n`;
  for (const fam of ['spacing', 'radius', 'stroke', 'opacity']) css += t[fam].tokens.map(k => `  --${prefix}${k.name}: ${k.value};`).join('\n') + '\n';
  css += Object.entries(t.type.families).map(([k, v]) => `  --${prefix}font-${k}: ${v};`).join('\n') + '\n}\n';
  return css;
}
