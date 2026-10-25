// Export the example assets: node export-assets.cjs [bundle.js] [outDir]
const fs = require('fs'), path = require('path');
const bundle = path.resolve(process.argv[2] || 'project/components/bundle.js'), out = process.argv[3] || 'project/assets/Parts';
require(bundle); const K = globalThis.PartsKit;
const S = new Function('K', fs.readFileSync('suite.cjs', 'utf8').match(/const S = \{[\s\S]*?\n\};/)[0].replace('const S =', 'return'))(K);
const A = {
  'resistor-220.svg': K.resistor({ ohms: 220 }), 'resistor-10k.svg': K.resistor({ ohms: 10000 }),
  'led-red-off.svg': K.led(), 'led-red-on.svg': K.led({ on: true }), 'led-green-on.svg': K.led({ color: 'green', on: true }),
  'pushbutton.svg': K.pushbutton(), 'pushbutton-pressed.svg': K.pushbutton({ pressed: true }),
  'potentiometer.svg': K.potentiometer(), 'slide-switch.svg': K.slideSwitch(),
  'capacitor-electrolytic.svg': K.capacitor(), 'capacitor-ceramic.svg': K.capacitor({ kind: 'ceramic' }), 'buzzer.svg': K.buzzer(),
  'chip-ne555-dip8.svg': S['chip dip8'], 'chip-74hc595-dip16.svg': S['chip dip16'],
  'module-dht22.svg': S['mod dht22'], 'module-hc-sr04.svg': S['mod ultrasonic'], 'module-bmp180.svg': S['mod bmp180'],
  'board-uno-class.svg': new Function('K', 'return ' + fs.readFileSync('suite.cjs', 'utf8').match(/'uno': (K\.devBoardTemplate\(\{.*?\}\)),\n/)[1].replace('user:true', 'user:false'))(K), 'board-esp32-c3.svg': S['esp32'],
  'lcd-16x2.svg': K.characterLcd({ lines: ['Hello, world!', ''] }),
  'seven-segment-1.svg': K.sevenSegment({ value: '8' }), 'seven-segment-4.svg': K.sevenSegment({ digits: 4, value: '1234' }),
  'rgb-led-off.svg': K.rgbLed(), 'rgb-led-magenta.svg': K.rgbLed({ r: 1, b: 1 }), 'pushbutton-6mm.svg': K.pushbutton({ size: 6 }), 'slide-potentiometer.svg': K.slidePotentiometer({ position: 0.6 }),
  'dip-switch-8.svg': K.dipSwitch({ values: [1, 0, 1, 1, 0, 0, 1, 0] }), 'rotary-encoder.svg': K.rotaryEncoder(), 'joystick.svg': K.joystick(), 'keypad-4x4.svg': K.keypad(), 'ir-remote.svg': K.irRemote(), 'rotary-dialer.svg': K.rotaryDialer(),
  'sensor-ldr.svg': S['sensor ldr'], 'sensor-flame.svg': S['sensor flame'], 'sensor-sound.svg': S['sensor sound'], 'sensor-ntc.svg': S['sensor ntc'], 'sensor-tilt.svg': S['sensor tilt'], 'ir-receiver.svg': S['sensor ir'], 'pulse-sensor.svg': S['pulse'],
  'module-hx711.svg': S['mod hx711'], 'module-microsd.svg': S['mod microsd'], 'module-ds1307.svg': S['mod rtc'],
  'neopixel.svg': K.neopixel({ r: 0, g: 1, b: 0.4 }), 'led-ring-16.svg': S['ring 16'], 'neopixel-matrix-8x8.svg': S['matrix 8'], 'led-bar-graph.svg': S['bar'], 'oled-breakout.svg': K.oledBreakout(), 'tft-2in4.svg': K.tftModule(),
  'servo.svg': K.servo({ angle: 30 }), 'stepper-nema17.svg': K.stepper(), 'biaxial-stepper.svg': K.stepper({ biaxial: true, angle: 30, angle2: -60 }), 'relay-dpdt.svg': K.relay(),
  'board-mega-class.svg': S['mega'], 'board-esp32-devkit-v1.svg': S['esp devkit'], 'board-franzininho.svg': S['franzininho'], 'board-nano-rp2040.svg': S['nano connect'],
  'symbol-mux.svg': S['mux'], 'symbol-flip-flop-dsr.svg': S['ff dsr'], 'symbol-clock.svg': S['clock'], 'symbol-vcc.svg': S['vcc'], 'symbol-note.svg': S['note'], 'symbol-flip-flop-d.svg': S['ff d'], 'board-esp32-devkitc-v4.svg': S['esp devkitc v4'], 'board-bluepill.svg': S['bluepill'], 'to92-ds18b20.svg': S['to92'], 'led-strip-8.svg': S['strip 8'], 'neopixel-meter.svg': S['meter'], 'relay-module.svg': S['relay module'], 'logic-analyzer.svg': S['analyzer'], 'rfid-rc522.svg': S['rfid'], 'oled-sh1107.svg': S['oled sh1107'], 'oled-ssd1306-4pin.svg': S['oled 4pin'], 'max7219-matrix.svg': S['matrix 1'], 'max7219-matrix-4.svg': S['matrix 4'], 'tm1637-colon.svg': S['tm1637 colon'], 'nokia-5110.svg': S['nokia'], 'epaper-2in9.svg': S['epaper'], 'tft-2in4-touch.svg': S['tft touch'], 'breadboard-full.svg': S['bb full'], 'breadboard-half.svg': S['bb half'], 'breadboard-mini.svg': S['bb mini'], 'board-nucleo-64.svg': S['nucleo64'], 'board-nucleo-32.svg': S['nucleo32'], 'board-pico-class.svg': S['pico'], 'board-esp32-c3-devkitm.svg': S['esp32 c3'], 'board-esp32-s3-devkitc.svg': S['esp32 s3'], 'board-esp32-c6-devkitc.svg': S['esp32 c6'], 'board-esp32-s2-devkitm.svg': S['esp32 s2'], 'board-esp32-h2-devkitm.svg': S['esp32 h2'], 'board-esp32-c5-devkitc.svg': S['esp32 c5'], 'chip-74hc165-dip16.svg': S['chip 165'], 'chip-nlsf595-dip16.svg': S['chip nlsf595'], 'chip-attiny85-dip8.svg': S['chip attiny85'], 'module-bmp180-5pin.svg': S['mod bmp180 5'],
  'gate-and.svg': K.logicSymbol({ gate: 'and' }), 'gate-nand.svg': K.logicSymbol({ gate: 'nand' }), 'gate-not.svg': K.logicSymbol({ gate: 'not' }),
};
fs.mkdirSync(out, { recursive: true });
// Standalone files carry the light canvas ink as `color`, so currentColor resolves when the SVG is viewed on its own.
for (const [name, art] of Object.entries(A)) fs.writeFileSync(path.join(out, name), art.svg.replace('<svg ', '<svg color="#020817" '));
console.log(Object.keys(A).length, 'assets ->', out);
