// The test leads' geometry (src/leads.js and the multimeter's rest and route helpers):
// 1. a cable's path starts at `from` and ends at `to`, through 0, 1 or 2 via points;
// 2. a whole lead's cable ends at its probe's tail, 8 pitches behind the point along the probe's axis;
// 3. odd input (plug on the tip, a tip far away, NaN) draws only finite numbers;
// 4. a probe points away from the cable's last point unless given an angle;
// 5. both rest places lie below the meter, apart from each other, their tails under COM;
// 6. the route is empty for a tip below the jacks, passes outside the meter's box on the tip's side for a tip above,
//    and keeps the cable off the meter's display wherever above the jacks the tip is;
// 7. the meter's pins are where they were, wherever the red plug is.
import { multimeter, multimeterLeadRests, multimeterLeadVia, PITCH as P } from '../src/index.js';
import { leadCable, probeTip, testLead } from '../src/primitives.js';

const problems = [];
const fail = msg => problems.push(msg);
const near = (a, b, tol = 0.02) => Math.abs(a - b) <= tol;
const nums = d => (d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/g) || []).map(Number);
const ends = d => {
  const n = nums(d);
  return { from: { x: n[0], y: n[1] }, to: { x: n[n.length - 2], y: n[n.length - 1] } };
};
/** Points along a cable's path: M x y then C segments of six numbers each. */
function samples(d, steps = 40) {
  const n = nums(d);
  const out = [];
  let a = { x: n[0], y: n[1] };
  for (let i = 2; i + 5 < n.length; i += 6) {
    const [c1x, c1y, c2x, c2y, bx, by] = n.slice(i, i + 6);
    for (let k = 0; k <= steps; k++) {
      const t = k / steps;
      const u = 1 - t;
      out.push({
        x: u * u * u * a.x + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * bx,
        y: u * u * u * a.y + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * by,
      });
    }
    a = { x: bx, y: by };
  }
  return out;
}

// 1. Ends of the path.
const from = { x: 10, y: 20 };
const to = { x: 300, y: -40 };
for (const via of [[], [{ x: 150, y: 260 }], [{ x: -20, y: 250 }, { x: -20, y: -20 }]]) {
  const { d, box } = leadCable({ color: 'red', from, to, via });
  const e = ends(d);
  if (!d.startsWith('M') || !near(e.from.x, from.x) || !near(e.from.y, from.y)) fail(`cable via ${via.length}: starts at ${JSON.stringify(e.from)}`);
  if (!near(e.to.x, to.x) || !near(e.to.y, to.y)) fail(`cable via ${via.length}: ends at ${JSON.stringify(e.to)}`);
  if ((d.match(/C/g) || []).length !== via.length + 1) fail(`cable via ${via.length}: ${(d.match(/C/g) || []).length} segments`);
  for (const q of samples(d)) if (q.x < box.x0 || q.x > box.x1 || q.y < box.y0 || q.y > box.y1) { fail(`cable via ${via.length}: leaves its box`); break; }
}

// 2. The cable ends at the probe's tail, 8 pitches behind the point.
for (const [plug, tip] of [[{ x: 67.2, y: 201.6 }, { x: 400, y: 120 }], [{ x: 0, y: 0 }, { x: -50, y: -300, angle: 30 }], [{ x: 5, y: 5 }, { x: 5, y: 400 }]]) {
  const lead = testLead({ color: 'black', plug, tip });
  const e = ends(lead.cable.d);
  if (!near(e.to.x, lead.probe.tail.x) || !near(e.to.y, lead.probe.tail.y)) fail(`lead to ${tip.x},${tip.y}: the cable ends at ${JSON.stringify(e.to)}, the tail is at ${JSON.stringify(lead.probe.tail)}`);
  const back = ((lead.angle + 180) * Math.PI) / 180;
  if (!near(lead.probe.tail.x, tip.x + 8 * P * Math.cos(back), 0.05) || !near(lead.probe.tail.y, tip.y + 8 * P * Math.sin(back), 0.05)) fail(`lead to ${tip.x},${tip.y}: the tail is not 8 pitches behind the point`);
  if (!near(lead.probe.point.x, tip.x) || !near(lead.probe.point.y, tip.y)) fail(`lead to ${tip.x},${tip.y}: the point moved`);
  if (tip.angle !== undefined && lead.angle !== tip.angle) fail(`lead to ${tip.x},${tip.y}: the given angle was not kept`);
}

// 3. Odd input stays finite.
for (const [name, props] of [
  ['plug on the tip', { plug: { x: 50, y: 50 }, tip: { x: 50, y: 50 } }],
  ['a tip far away', { plug: { x: 0, y: 0 }, tip: { x: 1e6, y: -1e6 } }],
  ['NaN', { plug: { x: NaN, y: 3 }, tip: { x: NaN, y: NaN, angle: NaN }, via: [{ x: NaN, y: 1 }], leave: NaN }],
  ['nothing', {}],
]) {
  const lead = testLead({ color: 'red', ...props });
  const all = lead.svg + lead.cable.d + lead.probe.hit + JSON.stringify([lead.cable.box, lead.probe.box, lead.probe.tail, lead.angle]);
  if (/NaN|Infinity|null/.test(all)) fail(`${name}: draws a number that is not finite`);
}
if (/NaN|Infinity/.test(probeTip({}).svg + leadCable({}).d)) fail('probeTip and leadCable with no props draw a number that is not finite');

// 4. The default angle.
{
  const plug = { x: 0, y: 0 };
  const a = testLead({ color: 'red', plug, tip: { x: 100, y: 100 } });
  if (!near(a.angle, 45)) fail(`a probe from the plug points at ${a.angle}, not 45`);
  const b = testLead({ color: 'red', plug, via: [{ x: 100, y: 0 }], tip: { x: 100, y: -100 } });
  if (!near(b.angle, -90)) fail(`a probe after a via point points at ${b.angle}, not -90`);
  const c = testLead({ color: 'red', plug, tip: { x: 0, y: 0 } });
  if (c.angle !== 90) fail(`a probe on its plug points at ${c.angle}, not 90`);
}

// 5. The rest places.
const W = 14 * P;
const H = 25 * P;
const COM = 7 * P;
const rests = multimeterLeadRests();
const restBox = {};
for (const color of ['black', 'red']) {
  const r = rests[color];
  const probe = probeTip({ color, ...r, pose: 'rest' });
  restBox[color] = probe.box;
  if (!(probe.box.y0 > H)) fail(`the ${color} probe's rest reaches into the meter (top at ${probe.box.y0})`);
  if (Math.abs(probe.tail.x - COM) > P) fail(`the ${color} probe's tail rests at x ${probe.tail.x}, not under COM`);
  if (/data-pose="touch"/.test(probe.svg)) fail(`the ${color} probe at rest is drawn touching`);
}
if (restBox.black.x1 > restBox.red.x0 && restBox.red.x1 > restBox.black.x0) fail('the two rest places overlap');

// 6. The route round the meter.
const LCD = { x0: 1.8 * P, y0: 1.8 * P, x1: W - 1.8 * P, y1: 7.2 * P };
const onLcd = q => q.x > LCD.x0 && q.x < LCD.x1 && q.y > LCD.y0 && q.y < LCD.y1;
const pins = Object.fromEntries(multimeter().pins.map(q => [q.name, q]));
for (const jack of ['mA', 'COM', 'V']) {
  if (multimeterLeadVia(jack, { x: 60, y: 21 * P }).length) fail(`${jack}: a tip on the jack row gets a route`);
  if (multimeterLeadVia(jack, { x: -200, y: 400 }).length) fail(`${jack}: a tip below the meter gets a route`);
  const left = multimeterLeadVia(jack, { x: -100, y: 50 });
  const right = multimeterLeadVia(jack, { x: 400, y: 50 });
  if (left.length !== 1 || !(left[0].x < 0)) fail(`${jack}: a tip up on the left routes ${JSON.stringify(left)}`);
  if (right.length !== 1 || !(right[0].x > W)) fail(`${jack}: a tip up on the right routes ${JSON.stringify(right)}`);
  const over = multimeterLeadVia(jack, { x: 40, y: -30 });
  if (over.length !== 2 || !over.every(q => q.x < 0)) fail(`${jack}: a tip over the meter's left half routes ${JSON.stringify(over)}`);
  // Tips all round the meter above its jacks: no cable crosses the display.
  for (let x = -40 * P; x <= 54 * P; x += 2 * P)
    for (let y = -40 * P; y < 21 * P; y += 2 * P) {
      if (x > -1.6 * P && x < W + 1.6 * P && y > -1.6 * P) continue; // on the meter itself
      const tip = { x, y };
      const lead = testLead({ color: 'red', plug: pins[jack], tip, via: multimeterLeadVia(jack, tip) });
      if (samples(lead.cable.d).some(onLcd)) {
        fail(`${jack}: the cable to a tip at ${x / P},${y / P} pitches crosses the display`);
        x = Infinity;
        break;
      }
    }
}

// 7. The pins.
for (const redJack of [undefined, 'V', 'mA']) {
  const got = JSON.stringify(multimeter({ redJack }).pins);
  const want = JSON.stringify([
    { name: 'mA', x: 28.8, y: 201.6 },
    { name: 'COM', x: 67.2, y: 201.6 },
    { name: 'V', x: 105.6, y: 201.6 },
  ]);
  if (got !== want) fail(`redJack ${redJack}: the pins are ${got}`);
}

for (const p of problems) console.log(p);
console.log(problems.length ? `${problems.length} lead problems` : 'the test leads hold their geometry');
process.exitCode = problems.length ? 1 : 0;
