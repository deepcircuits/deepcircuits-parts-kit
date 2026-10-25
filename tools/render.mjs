import { chromium } from 'playwright';
import fs from 'fs'; import vm from 'vm';
const ctx = { console }; ctx.window = ctx; vm.runInNewContext(fs.readFileSync('project/components/bundle.js', 'utf8'), ctx); const K = ctx.PartsKit;
const specs = JSON.parse(process.argv[2]);
const arts = specs.map(([fn, o]) => K[fn](o));
const sized = (a, sc) => a.svg.replace(/^<svg ([^>]*?)width="[^"]*" height="[^"]*"/, `<svg $1width="${a.width*sc}" height="${a.height*sc}"`);
const row = (bg, sc) => `<div style="background:${bg};padding:12px;display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start">${arts.map((a, i) => `<div style="font:10px sans-serif;color:#888">${specs[i][0]}<br>${sized(a, sc)}</div>`).join('')}</div>`;
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1200, height: 800 } });
await p.setContent(`<!doctype html><body style="margin:0">${row('#f6f7f8', Number(process.argv[4] || 2.5))}</body>`); await p.screenshot({ path: process.argv[3], fullPage: true }); await b.close();
for (const [i, a] of arts.entries()) { const r = K.check(a); console.log(specs[i][0], a.width + 'x' + a.height, r && r.length ? JSON.stringify(r) : 'ok'); }
