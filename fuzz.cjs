require('./project/generators/bundle.js'); const K = globalThis.PartsKit;
let seed = 7; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const pick = a => a[Math.floor(rnd() * a.length)];
const names = ['VCC','GND','SDA','SCL','TX','RX','D13','A0','IO18','IOREF','RESET','3V3','5V','VIN','AREF','MISO','MOSI','SCK','CS','DC','EN','NC','OUT','DATA','TRIG','ECHO','SQW','INT','XDA','GP28'];
const fin = ['blue','green','teal','black','purple','white'];
const cases = [];
for (let i = 0; i < 60; i++) { const n = 3 + Math.floor(rnd() * 8); const pins = Array.from({ length: n }, () => pick(names)); cases.push(['module ' + n + ' ' + i, () => K.moduleTemplate({ label: pick(['BMP180','MPU6050','RTC','HX711','MICRO-SD','IR','MQ-135']), pins, part: pick(['chip','sensor','can','dual-can','dome','none']), finish: pick(fin), widthPitches: rnd() < 0.5 ? undefined : 5 + Math.floor(rnd() * 14), heightPitches: rnd() < 0.5 ? undefined : 4.6 + Math.floor(rnd() * 7), canPitches: rnd() < 0.3 ? 6 : undefined, vent: rnd() < 0.5 ? 'holes' : undefined })]); }
for (let i = 0; i < 40; i++) { const rows = 4 + Math.floor(rnd() * 16); const left = Array.from({ length: rows }, () => pick(names)), right = Array.from({ length: rows }, () => pick(names)); cases.push(['portrait ' + rows + ' ' + i, () => K.devBoardTemplate({ label: pick(['NANO-CLASS','RP2040','ESP32-C3','ATTINY']), chipLabel: pick(['ATMEGA328P','RP2040','ESP32-C3']), finish: pick(fin), pinKind: pick(['socket','pad']), controller: rnd() < 0.3 ? 'module' : 'chip', widthPitches: 8 + Math.floor(rnd() * 5), left, right, indicators: { power: rnd() < 0.5, user: rnd() < 0.5 } })]); }
for (let i = 0; i < 10; i++) { cases.push(['landscape ' + i, () => K.devBoardTemplate({ layout: 'landscape', label: 'UNO-CLASS', chipLabel: 'ATMEGA328P', finish: pick(fin), pinKind: pick(['socket','pad']), top: [Array.from({ length: 10 }, () => pick(names)), Array.from({ length: 8 }, () => pick(names))], bottom: [Array.from({ length: 8 }, () => pick(names)), Array.from({ length: 6 }, () => pick(names))], groupNames: { top: ['DIGITAL (PWM ~)'], bottom: ['POWER', 'ANALOG IN'] }, pwm: ['3', '5', '6', '9', '10', '11'], indicators: { power: rnd() < 0.5, user: rnd() < 0.5 } })]); }
for (let i = 0; i < 20; i++) { const n = 2 * (2 + Math.floor(rnd() * 14)); cases.push(['chip ' + n + ' ' + i, () => K.chipTemplate({ pins: Array.from({ length: n }, () => pick(names)), label: pick(['NE555','74HC595','ATMEGA328P','L293D','MCP23017','PCF8574']), package: pick(['dip','soic','tssop']) })]); }
for (const c of [[16,2],[20,4]]) for (const col of ['green','blue']) cases.push(['lcd ' + c, () => K.characterLcd({ cols: c[0], rows: c[1], color: col, lines: ['Hello, world!', 'DeepCircuits 20x4', 'Temp 23.5 C', 'Hum 41 %'] })]);
for (const c of [[16,2],[20,4]]) for (const backpack of [false, true]) cases.push(['lcd glyphs ' + c + (backpack ? ' backpack' : ''), () => K.characterLcd({ cols: c[0], rows: c[1], backpack, glyphs: Array.from({ length: c[0] * c[1] }, (_, i) => [31, 17, 21, 21, 21, 17, 31, i % 2 ? 31 : 0]) })]);
for (let d = 1; d <= 4; d++) cases.push(['seg ' + d, () => K.sevenSegment({ digits: d, value: '8888'.slice(0, d), dp: [1,1,1,1] })]);
for (const g of ['and','nand','or','nor','xor','xnor','not','buffer']) for (const n of [2,3,4,8]) cases.push(['gate ' + g + n, () => K.logicSymbol({ gate: g, inputs: n })]);
for (const v of [0, 0.25, 0.5, 0.75, 1]) cases.push(['pot ' + v, () => K.potentiometer({ position: v })]);
for (const live of [{}, { flow: true }, { flow: true, heat: 1, probe: '1' }, { probe: '2' }]) cases.push(['resistor', () => K.resistor({ ohms: 4700, live })]);
for (const o of [{}, { on: true }, { on: true, brightness: 0.2, live: { flow: true, probe: 'K' } }, { color: 'white', live: { probe: 'A' } }]) cases.push(['led', () => K.led(o)]);
for (const live of [{}, { flow: true }, { flow: true, probe: '1' }, { probe: '2' }]) cases.push(['buzzer', () => K.buzzer({ live })]);
let total = 0, n = 0, fails = [];
for (const [name, make] of cases) { let art; try { art = make(); } catch (e) { fails.push(name + ': threw ' + e.message); continue; } n++; const pr = K.check(art); if (pr.length) { total += pr.length; fails.push(name + ' (' + pr.length + '): ' + pr.slice(0, 3).map(p => p.kind + ' ' + p.a + (p.b ? ' x ' + p.b : '')).join(' | ')); } if (!K.pinsOnPitch(art.pins)) fails.push(name + ': OFF PITCH'); }
fails.forEach(f => console.log(f));
console.log(n, 'artworks,', total, 'overlaps,', fails.length, 'failing cases');
process.exitCode = fails.length ? 1 : 0;
