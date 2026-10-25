// Writes the gallery (index.html, for GitHub Pages or a local browser) and the README's hero picture
// (project/assets/hero.svg). The gallery draws the catalog index and runs every card's preview script
// with the classic bundle, so it needs no build step of its own and no server.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const REPO = 'https://github.com/deepcircuits/deepcircuits-parts-kit';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Each card's name, the first clause of its README, and its preview script.
const cards = readdirSync('project/components', { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name !== 'Cover').map(d => d.name).sort()
  .map(name => {
    const html = readFileSync(`project/components/${name}/preview.html`, 'utf8');
    // A preview opts into live colours on its own card; the gallery draws every card in 'vars' so its theme switch works.
    const script = /<script>\s*([\s\S]*?)\s*<\/script>/.exec(html)[1].replace(/^K\.setTokenMode\("live"\);\r?\n/m, '');
    if (/<\/script/i.test(script)) throw new Error(`${name}: its preview script contains </script`);
    const readme = readFileSync(`project/components/${name}/README.md`, 'utf8');
    const para = readme.split(/\n\s*\n/).find(p => p.trim() && !p.startsWith('#')) || '';
    let depth = 0, cut = para.length;
    for (let i = 0; i < para.length; i++) {
      const c = para[i];
      if (c === '(') depth++; else if (c === ')') depth--;
      else if (depth === 0 && (c === ':' || c === ';' || (c === '.' && /\s/.test(para[i + 1] || ' '))) && i > 20) { cut = i; break; }
    }
    const intro = esc(para.slice(0, cut).replace(/\s+/g, ' ').trim()).replace(/`([^`]+)`/g, '<code>$1</code>');
    return { name, intro, script };
  });

const cardData = cards.map(c => `  { name: ${JSON.stringify(c.name)}, intro: ${JSON.stringify(c.intro)}, run: function (document) {\n${c.script.split('\n').map(l => '    ' + l).join('\n')}\n  } }`).join(',\n');

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DeepCircuits Parts Kit</title>
<meta name="description" content="Original electronic part artwork as SVG generators: boards, chips, sensors, displays and modules at true size on the 0.1-inch grid, with pins and live state.">
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="project/components/bundle.css">
<style>
  :root { color-scheme: light; --surface: color-mix(in srgb, var(--canvas-ink) 3%, var(--canvas)); --line: color-mix(in srgb, var(--canvas-ink) 11%, var(--canvas)); --accent: var(--mark-select); }
  [data-theme="dark"] { color-scheme: dark; }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; scroll-padding-top: 72px; }
  body { margin: 0; background: var(--canvas); color: var(--canvas-ink); font: 400 16px/1.6 var(--font-sans); -webkit-font-smoothing: antialiased; }
  a { color: inherit; }
  code { font-family: var(--font-mono); font-size: 0.86em; }
  .wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  @media (max-width: 640px) { .wrap { padding: 0 16px; } }

  .bar { position: sticky; top: 0; z-index: 10; background: color-mix(in srgb, var(--canvas) 86%, transparent); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
  .bar .wrap { display: flex; align-items: center; gap: 24px; height: 60px; }
  .brand { font-weight: 650; letter-spacing: -0.01em; text-decoration: none; display: flex; align-items: center; gap: 10px; }
  .brand svg { width: 22px; height: 22px; }
  .bar nav { display: flex; gap: 20px; margin-left: auto; font-size: 14px; }
  .bar nav a { text-decoration: none; color: var(--canvas-ink-muted); }
  .bar nav a:hover { color: var(--canvas-ink); }
  .theme { border: 1px solid var(--line); background: var(--surface); color: var(--canvas-ink); border-radius: 999px; width: 36px; height: 36px; display: grid; place-items: center; cursor: pointer; }
  @media (max-width: 640px) { .bar nav a.wide { display: none; } }

  .hero { padding-top: 72px; padding-bottom: 40px; display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 48px; align-items: center; }
  @media (max-width: 880px) { .hero { grid-template-columns: minmax(0, 1fr); padding-top: 48px; gap: 32px; } }
  .hero h1 { font-size: clamp(36px, 5.4vw, 60px); line-height: 1.04; letter-spacing: -0.035em; margin: 0 0 20px; font-weight: 700; }
  .hero p { font-size: 18px; color: var(--canvas-ink-muted); margin: 0 0 28px; max-width: 54ch; }
  .install { max-width: 100%; display: inline-flex; align-items: center; gap: 12px; border: 1px solid var(--line); background: var(--surface); border-radius: 12px; padding: 10px 10px 10px 16px; font-family: var(--font-mono); font-size: 14px; }
  #cmd { min-width: 0; overflow-x: auto; white-space: nowrap; scrollbar-width: none; }
  .copy { border: 0; background: var(--canvas-ink); color: var(--canvas); border-radius: 8px; padding: 6px 12px; cursor: pointer; font-family: var(--font-sans) !important; font-size: 13px !important; font-weight: 600; }
  .links { display: flex; gap: 20px; margin-top: 20px; font-size: 14px; }
  .links a { color: var(--canvas-ink-muted); }
  pre.sample { margin: 0; border: 1px solid var(--line); background: var(--surface); border-radius: 16px; padding: 20px 22px; overflow-x: auto; font: 13px/1.7 var(--font-mono); }
  .sample .c { color: var(--canvas-ink-muted); }
  .bench { margin-top: 20px; border: 1px solid var(--line); border-radius: 16px; padding: 20px; display: flex; gap: 18px; align-items: flex-end; justify-content: center; flex-wrap: wrap; background-image: radial-gradient(circle, var(--canvas-grid) 1px, transparent 1.4px); background-size: 19.2px 19.2px; }
  .bench svg { display: block; max-width: 100%; height: auto; }

  section.block { padding: 56px 0; border-top: 1px solid var(--line); }
  .block h2 { font-size: 30px; letter-spacing: -0.02em; margin: 0 0 8px; }
  .block > .wrap > p.lead { color: var(--canvas-ink-muted); margin: 0 0 28px; max-width: 70ch; }

  .filters { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 28px; }
  .filters input { flex: 1 1 240px; max-width: 320px; height: 38px; border-radius: 10px; border: 1px solid var(--line); background: var(--surface); color: var(--canvas-ink); padding: 0 12px; font: inherit; font-size: 14px; }
  .chip { height: 34px; border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--canvas-ink-muted); padding: 0 14px; font: 500 13px var(--font-sans); cursor: pointer; }
  .chip[aria-pressed="true"] { background: var(--canvas-ink); color: var(--canvas); border-color: var(--canvas-ink); }
  .family h3 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--canvas-ink-muted); margin: 28px 0 12px; font-weight: 600; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(210px, 40vw), 1fr)); gap: 14px; }
  .tile { margin: 0; border: 1px solid var(--line); border-radius: 14px; overflow: hidden; background: var(--canvas); display: flex; flex-direction: column; }
  .tile .stage { height: 176px; display: grid; place-items: center; padding: 14px; color: var(--canvas-ink); background-color: var(--surface); background-image: radial-gradient(circle, var(--canvas-grid) 1px, transparent 1.4px); background-size: 14.4px 14.4px; }
  .tile .stage svg { display: block; max-width: 100%; height: auto; }
  .tile figcaption { padding: 10px 12px 12px; display: flex; flex-direction: column; gap: 2px; border-top: 1px solid var(--line); }
  .tile .name { font-weight: 600; font-size: 14px; }
  .tile button.call { all: unset; cursor: pointer; font: 12px var(--font-mono); color: var(--canvas-ink-muted); overflow-wrap: anywhere; }
  .tile button.call:hover, .tile button.call:focus-visible { color: var(--accent); }
  .empty { color: var(--canvas-ink-muted); display: none; }

  .card { border: 1px solid var(--line); border-radius: 16px; margin-bottom: 18px; overflow: hidden; }
  .card header { padding: 18px 20px 4px; display: flex; gap: 16px; align-items: baseline; flex-wrap: wrap; }
  .card h3 { margin: 0; font-size: 18px; }
  .card header a { font-size: 13px; color: var(--canvas-ink-muted); margin-left: auto; }
  .card p { margin: 4px 20px 0; color: var(--canvas-ink-muted); font-size: 14px; max-width: 90ch; }
  .card .shelf { overflow-x: auto; }
  .card .pk-row { padding: 18px 20px 22px; }
  .toc { columns: 4 160px; font-size: 14px; margin: 0 0 32px; padding: 0; list-style: none; }
  .toc a { color: var(--canvas-ink-muted); text-decoration: none; }
  .toc a:hover { color: var(--canvas-ink); }

  footer { border-top: 1px solid var(--line); padding: 32px 0 48px; color: var(--canvas-ink-muted); font-size: 14px; }
  .toast { position: fixed; left: 50%; bottom: 24px; transform: translate(-50%, 12px); opacity: 0; transition: opacity .18s, transform .18s; background: var(--canvas-ink); color: var(--canvas); padding: 8px 14px; border-radius: 10px; font-size: 13px; pointer-events: none; }
  .toast.on { opacity: 1; transform: translate(-50%, 0); }
  @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } .toast { transition: none; } }
</style>
</head>
<body>
<header class="bar"><div class="wrap">
  <a class="brand" href="#top"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="#0f766e"/><g fill="#d4a017"><circle cx="7" cy="9" r="1.3"/><circle cx="12" cy="9" r="1.3"/><circle cx="17" cy="9" r="1.3"/><circle cx="7" cy="15" r="1.3"/><circle cx="12" cy="15" r="1.3"/><circle cx="17" cy="15" r="1.3"/></g></svg>Parts Kit</a>
  <nav><a href="#catalog">Catalog</a><a href="#components" class="wide">Components</a><a href="${REPO}/blob/main/project/README.md" class="wide">Brand book</a><a href="${REPO}">GitHub</a></nav>
  <button class="theme" type="button" aria-label="Switch between light and dark" title="Light or dark"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z"/></svg></button>
</div></header>

<main id="top">
<div class="wrap hero">
  <div>
    <h1>Electronic parts, drawn by code.</h1>
    <p>Original SVG artwork for boards, chips, sensors, displays and modules. Every part is at true size on the 0.1-inch grid, returns its pin positions, and shows its state: LEDs light, screens show text, servos turn.</p>
    <div class="install"><span id="cmd">npm install @deepcircuits/parts-kit</span><button class="copy" type="button" data-copy="npm install @deepcircuits/parts-kit">Copy</button></div>
    <div class="links"><a href="${REPO}#readme">Documentation</a><a href="${REPO}/blob/main/project/README.md">Brand book</a><span>MIT licence</span></div>
  </div>
  <div>
<pre class="sample">import { drawPart } from '@deepcircuits/parts-kit';

<span class="c">// Any part by its catalog id, with its options.</span>
const lcd = drawPart('character-lcd-16x2', {
  lines: ['Hello, world', 'DeepCircuits'],
});
el.innerHTML = lcd.svg;  <span class="c">// the drawing</span>
lcd.pins;                <span class="c">// [{ name, x, y }, …]</span></pre>
    <div class="bench" id="bench" aria-label="Sample parts"></div>
  </div>
</div>

<section class="block" id="catalog"><div class="wrap">
  <h2>Catalog</h2>
  <p class="lead">Every part the kit draws. Each is one call, <code>drawPart(id, options)</code>, or its generator by name. Click an id to copy its call.</p>
  <div class="filters" role="group" aria-label="Filter the catalog">
    <input type="search" id="q" placeholder="Search parts" aria-label="Search parts">
    <div id="chips" style="display:contents"></div>
  </div>
  <div id="families"></div>
  <p class="empty" id="empty">No part matches that search.</p>
</div></section>

<section class="block" id="components"><div class="wrap">
  <h2>Components</h2>
  <p class="lead">The generators behind the catalog, each in the states and variants it draws, over the pitch grid every pin lands on.</p>
  <ul class="toc" id="toc"></ul>
  <div id="cards"></div>
</div></section>
</main>

<footer><div class="wrap">
  DeepCircuits Parts Kit is MIT licensed, code and artwork. Product names say which real part a drawing shows; they are their owners' trademarks, and the kit is not affiliated with or endorsed by them.
</div></footer>
<div class="toast" id="toast" role="status" aria-live="polite"></div>

<script src="project/components/bundle.js"></script>
<script>
var CARDS = [
${cardData}
];
</script>
<script>
(function () {
  var K = window.PartsKit, root = document.documentElement;
  K.setTokenMode('vars');
  var dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.querySelector('.theme').addEventListener('click', function () {
    root.setAttribute('data-theme', root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  var toast = document.getElementById('toast'), timer;
  function copy(text) {
    var done = function () { toast.textContent = 'Copied ' + text; toast.classList.add('on'); clearTimeout(timer); timer = setTimeout(function () { toast.classList.remove('on'); }, 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {}); else done();
  }
  document.querySelector('.install .copy').addEventListener('click', function () { copy(this.getAttribute('data-copy')); });

  // Fits an artwork into a w x h box, never above 2x.
  function fit(art, w, h) {
    var s = Math.min(w / art.width, h / art.height, 2);
    return art.svg.replace(/^<svg([^>]*?) width="[^"]*" height="[^"]*"/, '<svg$1 width="' + (art.width * s).toFixed(1) + '" height="' + (art.height * s).toFixed(1) + '"');
  }

  var bench = document.getElementById('bench');
  [['led-5-mm', { on: true }], ['character-lcd-16x2', { lines: ['Hello, world', 'DeepCircuits'] }], ['servo', { angle: 45 }], ['rgb-led', { r: 0.2, g: 0.6, b: 1 }], ['oled-0-96in-i2c', { caption: 'Hi!' }]].forEach(function (p) {
    var a = K.drawPart(p[0], p[1]), d = document.createElement('div'); d.innerHTML = fit(a, a.width, 140); bench.appendChild(d);
  });

  var FAMILIES = { board: 'Boards', display: 'Displays', sensor: 'Sensors', input: 'Inputs', output: 'Outputs', module: 'Modules', chip: 'Chips', passive: 'Passives', breadboard: 'Breadboards', symbol: 'Symbols' };
  var families = document.getElementById('families'), chips = document.getElementById('chips'), tiles = [], current = 'all';
  function chip(key, label) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = label; b.setAttribute('aria-pressed', key === 'all' ? 'true' : 'false');
    b.addEventListener('click', function () { current = key; Array.prototype.forEach.call(chips.children, function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); }); apply(); });
    chips.appendChild(b);
  }
  chip('all', 'All');
  Object.keys(FAMILIES).forEach(function (f) {
    var parts = K.CATALOG.filter(function (e) { return e.family === f; }); if (!parts.length) return;
    chip(f, FAMILIES[f]);
    var sec = document.createElement('div'); sec.className = 'family'; sec.setAttribute('data-family', f);
    sec.innerHTML = '<h3>' + FAMILIES[f] + '</h3><div class="grid"></div>';
    var grid = sec.lastChild;
    parts.forEach(function (e) {
      var call = "drawPart('" + e.id + "')", fig = document.createElement('figure'); fig.className = 'tile';
      fig.innerHTML = '<div class="stage">' + fit(K.drawPart(e.id), 182, 148) + '</div><figcaption><span class="name"></span><button type="button" class="call"></button></figcaption>';
      fig.querySelector('.name').textContent = e.name;
      var btn = fig.querySelector('.call'); btn.textContent = e.id; btn.title = 'Copy ' + call; btn.setAttribute('aria-label', 'Copy ' + call);
      btn.addEventListener('click', function () { copy(call); });
      grid.appendChild(fig);
      tiles.push({ el: fig, family: f, text: (e.name + ' ' + e.id + ' ' + e.fn).toLowerCase() });
    });
    families.appendChild(sec);
  });
  var q = document.getElementById('q');
  function apply() {
    var term = q.value.trim().toLowerCase(), shown = 0;
    tiles.forEach(function (t) { var on = (current === 'all' || t.family === current) && (!term || t.text.indexOf(term) >= 0); t.el.style.display = on ? '' : 'none'; if (on) shown++; });
    Array.prototype.forEach.call(families.children, function (sec) { sec.style.display = sec.querySelector('.tile:not([style*="none"])') ? '' : 'none'; });
    document.getElementById('empty').style.display = shown ? 'none' : 'block';
  }
  q.addEventListener('input', apply);

  var cards = document.getElementById('cards'), toc = document.getElementById('toc');
  CARDS.forEach(function (c) {
    var sec = document.createElement('section'); sec.className = 'card'; sec.id = 'card-' + c.name;
    sec.innerHTML = '<header><h3>' + c.name + '</h3><a href="${REPO}/blob/main/project/components/' + c.name + '/README.md">Read the card</a></header><p>' + c.intro + '</p><div class="shelf"><div class="pk-row"></div></div>';
    cards.appendChild(sec);
    var row = sec.querySelector('.pk-row');
    try { c.run({ getElementById: function () { return row; } }); } catch (err) { row.textContent = 'This card did not draw: ' + err.message; }
    var li = document.createElement('li'); li.innerHTML = '<a href="#card-' + c.name + '">' + c.name + '</a>'; toc.appendChild(li);
  });
})();
</script>
</body>
</html>
`;
writeFileSync('index.html', page);

// The README's hero: two rows of parts at true size, each standing on its baseline and centred, in the light
// values so an <img> shows them.
const K = await import(pathToFileURL('src/index.js').href);
K.setTokenMode('values');
const rows = [
  [K.drawPart('uno-class-board', { indicators: { power: true, user: true } }),
    K.drawPart('character-lcd-16x2', { lines: ['Hello, world', 'DeepCircuits'] }),
    K.drawPart('led-5-mm', { on: true }),
    K.drawPart('led-5-mm', { color: 'green', on: true }),
    K.drawPart('servo', { angle: 30 })],
  [K.drawPart('esp32-dev-board-30-pin', { indicators: { power: true } }),
    K.drawPart('led-ring-16-leds', { colors: Array.from({ length: 16 }, (_, i) => (i < 11 ? '#22c55e' : null)) }),
    K.drawPart('oled-0-96in-i2c', { caption: 'Hello!' }),
    K.drawPart('rgb-led', { r: 1, g: 0.2, b: 0.8 }),
    K.drawPart('ultrasonic-ranger'),
    K.drawPart('clock-display', { value: '1230', colon: true })],
];
const gap = 28, rowWidth = r => r.reduce((w, a) => w + a.width, 0) + gap * (r.length - 1);
const width = Math.max(...rows.map(rowWidth));
let y = 0, body = '';
for (const r of rows) {
  const h = Math.max(...r.map(a => a.height));
  let x = (width - rowWidth(r)) / 2;
  for (const a of r) { body += a.svg.replace(/^<svg/, `<svg x="${x.toFixed(2)}" y="${(y + h - a.height).toFixed(2)}"`); x += a.width + gap; }
  y += h + gap;
}
const height = y - gap;
writeFileSync('project/assets/hero.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="${width.toFixed(2)}" height="${height.toFixed(2)}" viewBox="0 0 ${width.toFixed(2)} ${height.toFixed(2)}" role="img" aria-label="Parts drawn by the kit: an Uno-class board, a character LCD, LEDs, a servo, an ESP32 board, an LED ring, an OLED, an RGB LED, an ultrasonic ranger and a clock display">${body}</svg>\n`);
console.log('index.html', page.length, 'bytes,', cards.length, 'cards; project/assets/hero.svg', Math.round(width), 'x', Math.round(height));
