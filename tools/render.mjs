// Renders parts to a PNG sheet with Playwright and prints each one's size and overlap check. The parts are suite
// parts by name, or generator calls as JSON:
//   node tools/render.mjs 'uno,led on' sheet.png [scale]
//   node tools/render.mjs '[["led",{"on":true}],["servo",{"angle":45}]]' sheet.png [scale]
import { chromium } from 'playwright';
import { loadBundle, suite } from '../checks/drawings.mjs';

const K = loadBundle();
const [parts, out, scale] = process.argv.slice(2);
const calls = parts.startsWith('[');
const S = calls ? null : suite(K);
const arts = calls
  ? JSON.parse(parts).map(([fn, o]) => [fn, K[fn](o)])
  : parts.split(',').map(n => {
      if (!S[n]) throw new Error(`no suite part ${n}`);
      return [n, S[n]];
    });
const sc = Number(scale || (calls ? 2.5 : 2));
const sized = a => a.svg.replace(/^<svg ([^>]*?)width="[^"]*" height="[^"]*"/, `<svg $1width="${a.width * sc}" height="${a.height * sc}"`);
const row = arts.map(([name, a]) => `<div style="font:10px sans-serif;color:#888">${name}<br>${sized(a)}</div>`).join('');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
await page.setContent(
  `<!doctype html><body style="margin:0"><div style="background:#f6f7f8;padding:12px;display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start">${row}</div></body>`,
);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
for (const [name, a] of arts) {
  const found = K.check(a);
  console.log(name, `${a.width}x${a.height}`, found.length ? JSON.stringify(found) : 'ok');
}
