/**
 * The options each catalog generator takes, as data: what an option is called, its type, its range or choices, its
 * default and whether it changes while the part runs (`state`). The catalog lists each part's options from here,
 * drawPart checks a call against them, build.mjs writes the TypeScript types from them, and a host builds controls
 * from them. No drawing code, so the catalog stays small.
 *
 * A spec's `type` is one of:
 * - 'boolean'; 'number' and 'integer' (min, max, step, unit); 'level': true, false or a light from 0 to 1;
 * - 'enum': one of `choices` ({ value, label, swatch? });
 * - 'color': a lens name or any CSS colour, `choices` the named ones; 'pixel': a CSS colour, { r, g, b } or null (off);
 * - 'text' (maxLength; `numeric` also takes a number); 'frame': a screen picture { width, height, data };
 * - 'point': { x, y }; 'list' (`items` a spec, `length` the count the part has); 'object' (`fields`).
 * `when` names the other options (or the preset) an option needs to show: { status: ['ok', 'near', 'over'] }; null
 * stands for unset. `examples` are values worth offering ({ label, value, code? }, `each` when the value is one item of
 * a list, for every item), for options a control cannot build from the type alone; `example` is a value that shows
 * the option off in a preview.
 */
import { FALLBACK } from './tokens.js';
import { BREADBOARD_COLORS, BREADBOARD_PAINT } from './breadboardColors.js';

const cap = s => s[0].toUpperCase() + s.slice(1);
const choice = (value, label, swatch) => (swatch ? { value, label, swatch } : { value, label });

const LENS_CHOICES = ['red', 'green', 'yellow', 'blue', 'white', 'orange'].map(c =>
  choice(c, cap(c), FALLBACK[`lens-${c}`]),
);
const FINISH_CHOICES = ['blue', 'green', 'teal', 'black', 'purple', 'white', 'red'].map(f =>
  choice(f, cap(f), FALLBACK[`pcb-${f}`]),
);
const PIXEL_CHOICES = [
  choice('#22c55e', 'Green', '#22c55e'),
  choice('#3b82f6', 'Blue', '#3b82f6'),
  choice('#f59e0b', 'Amber', '#f59e0b'),
  choice('#ec4899', 'Pink', '#ec4899'),
  choice('#ffffff', 'White', '#ffffff'),
];

const bool = (label, more) => ({ type: 'boolean', label, default: false, ...more });
const state = spec => ({ ...spec, state: true });
const unit = (label, more) => ({ type: 'number', label, min: 0, max: 1, step: 0.05, default: 0, ...more });
const finish = def => ({ type: 'enum', label: 'Board colour', choices: FINISH_CHOICES, default: def });
const lens = def => ({ type: 'color', label: 'Colour', choices: LENS_CHOICES, default: def });
const pkg = def => ({
  type: 'enum',
  label: 'Package',
  choices: [choice('dip', 'DIP'), choice('soic', 'SOIC'), choice('tssop', 'TSSOP')],
  default: def,
});
const pixels = (length, label = 'Pixel colours') =>
  state({ type: 'list', label, items: { type: 'pixel', choices: PIXEL_CHOICES }, length });
/** A board's lamps by name, each off unless `lit` names it. */
const lamps = (fields, lit = []) => {
  const out = {};
  for (const [k, label] of Object.entries(fields))
    out[k] = { type: k === 'user' ? 'level' : 'boolean', label, default: lit.includes(k) };
  return state({ type: 'object', label: 'Lamps', fields: out });
};
const BOARD = { indicators: lamps({ power: 'Power LED', user: 'User LED' }) };
const POWER_BOARD = { indicators: lamps({ power: 'Power LED' }) };
const SENSOR_BOARD = def => ({ indicators: lamps({ power: 'Power LED', out: 'Output LED' }), finish: finish(def) });

// A sine wave across a 64 x 32 picture, offered for every screen.
const WAVE_CODE =
  'Array.from({ length: 2048 }, (_, i) => Math.abs(16 - 12 * Math.sin((i % 64) / 6) - Math.floor(i / 64)) < 1.5)';
const WAVE = {
  width: 64,
  height: 32,
  data: Array.from({ length: 2048 }, (_, i) => Math.abs(16 - 12 * Math.sin((i % 64) / 6) - Math.floor(i / 64)) < 1.5),
};
const screen = (def, caption = 'Hello!') => ({
  caption: state({
    type: 'text',
    label: 'Caption',
    default: '',
    maxLength: 24,
    when: { pixels: null },
    example: caption,
  }),
  pixels: state({
    type: 'frame',
    label: 'Picture',
    examples: [{ label: 'Sine wave', value: WAVE, code: `{ width: 64, height: 32, data: ${WAVE_CODE} }` }],
  }),
  ...(def ? { finish: finish(def) } : {}),
});

// 8 x 8 pictures for the LED matrices, row by row, the leftmost dot first.
const GLYPHS = {
  Heart: ['00000000', '01100110', '11111111', '11111111', '01111110', '00111100', '00011000', '00000000'],
  Smile: ['00111100', '01000010', '10100101', '10000001', '10100101', '10011001', '01000010', '00111100'],
  Arrow: ['00011000', '00111100', '01111110', '11111111', '00011000', '00011000', '00011000', '00011000'],
};
const KEYPAD = [
  ['1', '2', '3', 'A'],
  ['4', '5', '6', 'B'],
  ['7', '8', '9', 'C'],
  ['*', '0', '#', 'D'],
];
const REMOTE_KEYS = [
  ['power', 'Power'],
  ['vol-up', 'Vol +'],
  ['func-stop', 'Func/stop'],
  ['prev', 'Previous'],
  ['play', 'Play'],
  ['next', 'Next'],
  ['down', 'Down'],
  ['vol-down', 'Vol −'],
  ['up', 'Up'],
  ['0', '0'],
  ['eq', 'EQ'],
  ['st-rept', 'ST/REPT'],
  ...'123456789'.split('').map(k => [k, k]),
];

const flow = {
  type: 'enum',
  label: 'Current',
  choices: [choice(false, 'Off'), choice(true, 'Flowing'), choice('reverse', 'Reversed')],
  default: false,
};
/** The probe on one of a part's pins, by name, or none. */
const probe = pins => ({
  type: 'enum',
  label: 'Probe on pin',
  choices: [choice('', 'None'), ...pins.map(p => choice(p, p))],
  default: '',
});

/** The options of each generator the catalog names, by generator. */
export const OPTIONS = {
  // Boards.
  unoClassBoard: BOARD,
  nanoClassBoard: BOARD,
  megaClassBoard: BOARD,
  nanoRp2040Board: BOARD,
  picoClassBoard: { indicators: lamps({ user: 'User LED' }) },
  esp32DevKitV1: BOARD,
  esp32DevKitCV4: POWER_BOARD,
  esp32C3DevKit: POWER_BOARD,
  esp32C5DevKit: POWER_BOARD,
  esp32C6DevKit: POWER_BOARD,
  esp32H2DevKit: POWER_BOARD,
  esp32S2DevKit: POWER_BOARD,
  esp32S3DevKit: POWER_BOARD,
  stm32L031K6Board: POWER_BOARD,
  stm32C031C6Board: POWER_BOARD,
  bluePillBoard: BOARD,
  franzininho: { indicators: lamps({ power: 'Power LED', user: 'User LED' }, ['power']) },
  // Displays.
  characterLcd: {
    lines: state({
      type: 'list',
      label: 'Lines',
      items: { type: 'text', label: 'Line', maxLength: 20 },
      example: ['Hello, world', 'DeepCircuits'],
    }),
    glyphs: state({
      type: 'list',
      label: 'Cells',
      items: { type: 'list', items: { type: 'integer', min: 0, max: 31 }, length: 8 },
    }),
    color: {
      type: 'enum',
      label: 'Backlight',
      choices: [choice('green', 'Green', FALLBACK['lcd-green']), choice('blue', 'Blue', FALLBACK['lcd-blue'])],
      default: 'green',
    },
    backpack: bool('I2C backpack'),
  },
  ssd1306Module: screen(),
  oledBreakout: screen('blue'),
  sh1107Module: screen(),
  tftModule: screen('red', 'Hello, bench!'),
  ili9341TouchDisplay: screen(null, 'Touch me'),
  nokiaModule: screen('red'),
  epaperModule: screen('blue', 'Hello, bench!'),
  sevenSegment: {
    value: state({ type: 'text', label: 'Text', numeric: true, default: '8', maxLength: 8 }),
    dp: state({ type: 'list', label: 'Points', items: { type: 'boolean' } }),
    colon: state({ type: 'level', label: 'Colon', default: false, when: { digits: 4 } }),
    levels: state({ type: 'list', label: 'Segment levels', items: { type: 'number', min: 0, max: 1 } }),
    color: lens('red'),
  },
  tm1637Module: {
    value: state({ type: 'text', label: 'Text', numeric: true, default: '', maxLength: 4, example: '1230' }),
    colon: state(bool('Colon')),
    color: lens('red'),
    finish: finish('blue'),
  },
  max7219Matrix: {
    lit: state({
      type: 'list',
      label: 'Picture',
      items: { type: 'list', items: { type: 'text', maxLength: 8 }, length: 8 },
      examples: Object.entries(GLYPHS).map(([label, rows]) => ({ label, value: rows, each: true })),
    }),
    color: lens('red'),
  },
  neopixelMatrix: { colors: pixels(64) },
  ledRing: { colors: pixels(16) },
  // Sensors.
  ultrasonicRanger: { finish: finish('blue') },
  dht22Sensor: {},
  dht11Module: { indicators: lamps({ power: 'Power LED' }), finish: finish('black') },
  bmp180Board: { finish: finish('blue') },
  lightSensor: SENSOR_BOARD('blue'),
  flameSensor: SENSOR_BOARD('blue'),
  soundSensor: { ...SENSOR_BOARD('red'), small: bool('Small board, 6 mm capsule') },
  tiltSwitch: SENSOR_BOARD('blue'),
  gasSensor: SENSOR_BOARD('blue'),
  irReceiver: { finish: finish('black') },
  ntcSensor: { finish: finish('black') },
  pirModule: { finish: finish('green') },
  mpu6050Imu: { finish: finish('blue') },
  pulseSensor: { on: state(bool('Beat LED')) },
  ds18b20Sensor: {},
  // Inputs.
  pushbutton: {
    pressed: state(bool('Pressed')),
    cap: {
      type: 'color',
      label: 'Cap',
      choices: [choice('black', 'Black', FALLBACK['plastic-black']), ...LENS_CHOICES],
      default: 'black',
    },
  },
  potentiometer: { position: state(unit('Position', { step: 0.01, default: 0.5 })) },
  slidePotentiometer: { position: state(unit('Position', { step: 0.01, default: 0 })) },
  slideSwitch: {
    contact: state({
      type: 'enum',
      label: 'Middle pin joins',
      choices: [choice(1, 'Pin 1'), choice(3, 'Pin 3')],
      default: 1,
    }),
  },
  rotaryEncoder: {
    detent: state({ type: 'integer', label: 'Detent', min: 0, max: 19, step: 1, default: 0 }),
    pressed: state(bool('Pressed')),
    finish: finish('black'),
  },
  joystick: {
    x: state({ type: 'number', label: 'X', min: -1, max: 1, step: 0.05, default: 0 }),
    y: state({ type: 'number', label: 'Y', min: -1, max: 1, step: 0.05, default: 0 }),
    pressed: state(bool('Pressed')),
    finish: finish('black'),
  },
  keypad: {
    pressed: state({
      type: 'list',
      label: 'Keys held',
      items: { type: 'list', items: { type: 'boolean' }, length: 4 },
      length: 4,
      examples: ['1', '5', '9', 'A', '*', '#'].map(key => ({
        label: key,
        value: KEYPAD.map(row => row.map(k => (k === key ? 1 : 0))),
      })),
    }),
  },
  dipSwitch: { values: state({ type: 'list', label: 'Switches on', items: { type: 'boolean' }, length: 8 }) },
  irRemote: {
    pressed: state({
      type: 'enum',
      label: 'Key held',
      choices: [choice('', 'None'), ...REMOTE_KEYS.map(([k, label]) => choice(k, label))],
      default: '',
    }),
  },
  rotaryDialer: {
    // 324°: the 0's hole wound round to the finger stop.
    angle: state({ type: 'number', label: 'Dial', min: 0, max: 324, step: 1, unit: '°', default: 0 }),
  },
  // Outputs.
  led: {
    color: lens('red'),
    on: state(bool('Lit')),
    brightness: state(unit('Brightness', { default: 1, when: { on: true } })),
    live: state({ type: 'object', label: 'Live layer', fields: { flow, probe: probe(['A', 'K']) } }),
  },
  rgbLed: {
    r: state(unit('Red')),
    g: state(unit('Green')),
    b: state(unit('Blue')),
  },
  ledBarGraph: {
    levels: state({ type: 'list', label: 'Bar levels', items: { type: 'number', min: 0, max: 1 }, length: 10 }),
    color: lens('red'),
  },
  neopixel: {
    color: state({ type: 'pixel', label: 'Colour', choices: PIXEL_CHOICES }),
    r: state(unit('Red')),
    g: state(unit('Green')),
    b: state(unit('Blue')),
  },
  ledStrip: {
    colors: pixels(8),
    pixels: { type: 'integer', label: 'Pixels', min: 1, max: 1024, step: 1, default: 8 },
    pixelSize: {
      type: 'enum',
      label: 'Pixel size',
      choices: [choice('5050', '5050'), choice('3535', '3535'), choice('2020', '2020')],
      default: '5050',
    },
    pixelShape: {
      type: 'enum',
      label: 'Pixel shape',
      choices: [choice('square', 'Square'), choice('round', 'Round')],
      default: 'square',
    },
  },
  buzzer: { live: state({ type: 'object', label: 'Live layer', fields: { flow, probe: probe(['+', '-']) } }) },
  servo: { angle: state({ type: 'number', label: 'Angle', min: -90, max: 90, step: 1, unit: '°', default: 0 }) },
  stepper: {
    angle: state({ type: 'number', label: 'Angle', min: 0, max: 360, step: 1.8, unit: '°', default: 0 }),
    angle2: state({
      type: 'number',
      label: 'Outer angle',
      min: 0,
      max: 360,
      step: 6,
      unit: '°',
      default: 0,
      when: { biaxial: true },
    }),
  },
  relay: { energised: state(bool('Energised')) },
  // Modules.
  relayModule: { indicators: lamps({ power: 'Power LED', status: 'Status LED' }, ['power']), finish: finish('red') },
  hx711Board: { finish: finish('red') },
  microsdModule: { finish: finish('blue') },
  rtcModule: { finish: finish('blue') },
  rfidModule: { indicators: lamps({ power: 'Power LED' }), finish: finish('blue') },
  logicAnalyzer: {
    state: state({
      type: 'enum',
      label: 'State',
      choices: ['idle', 'armed', 'recording', 'paused', 'full', 'error'].map(s => choice(s, cap(s))),
      default: 'idle',
    }),
    samples: state({ type: 'integer', label: 'Samples', min: 0, max: 1000000, step: 1, default: 0 }),
    lit: state({ type: 'list', label: 'Channels high', items: { type: 'boolean' }, length: 8 }),
    activity: state(unit('Activity')),
  },
  neopixelMeter: {
    status: state({
      type: 'enum',
      label: 'Status',
      choices: [
        choice('idle', 'Idle'),
        choice('ok', 'OK'),
        choice('near', 'Near the limit'),
        choice('over', 'Over the limit'),
      ],
      default: 'idle',
    }),
    fps: state({
      type: 'number',
      label: 'Frames a second',
      min: 0,
      max: 240,
      step: 1,
      default: 0,
      when: { status: ['ok', 'near', 'over'] },
    }),
    pixels: state({
      type: 'integer',
      label: 'Pixels',
      min: 0,
      max: 1024,
      step: 1,
      default: 0,
      when: { status: ['ok', 'near', 'over'] },
    }),
    amps: state({
      type: 'number',
      label: 'Current',
      min: 0,
      max: 10,
      step: 0.05,
      unit: 'A',
      default: 0,
      when: { status: ['ok', 'near', 'over'] },
    }),
    watts: state({
      type: 'number',
      label: 'Power',
      min: 0,
      max: 50,
      step: 0.1,
      unit: 'W',
      default: 0,
      when: { status: ['ok', 'near', 'over'] },
    }),
    peakAmps: state({
      type: 'number',
      label: 'Peak current',
      min: 0,
      max: 10,
      step: 0.05,
      unit: 'A',
      default: 0,
      when: { status: ['ok', 'near', 'over'] },
    }),
    limitAmps: state({
      type: 'number',
      label: 'Supply limit',
      min: 0,
      max: 10,
      step: 0.5,
      unit: 'A',
      default: 0,
      when: { status: ['ok', 'near', 'over'] },
    }),
  },
  // Chips.
  ne555Timer: { package: pkg('dip') },
  shiftRegister595: { package: pkg('dip') },
  shiftRegister165: { package: pkg('dip') },
  ledDriver595: { package: pkg('tssop') },
  attiny85: { package: pkg('dip') },
  transistor: {
    package: {
      type: 'enum',
      label: 'Package',
      choices: [choice('to-92', 'TO-92'), choice('to-220', 'TO-220')],
      default: 'to-92',
    },
    // No default: each package prints its own part (PN2222A in TO-92, IRLZ44N in TO-220) unless given one.
    label: { type: 'text', label: 'Part number', maxLength: 10 },
    live: state({ type: 'object', label: 'Live layer', fields: { heat: unit('Heat') } }),
  },
  // Passives.
  resistor: {
    ohms: {
      type: 'number',
      label: 'Resistance',
      min: 0,
      step: 1,
      unit: 'Ω',
      default: 1000,
      examples: [220, 1000, 10000, 100000].map(v => ({ label: `${v >= 1000 ? `${v / 1000} k` : `${v} `}Ω`, value: v })),
    },
    tolerance: { type: 'enum', label: 'Tolerance', choices: [choice(5, '5%'), choice(10, '10%')], default: 5 },
    span: { type: 'integer', label: 'Lead spacing', min: 3, max: 12, step: 1, unit: 'pitches', default: 4 },
    live: state({
      type: 'object',
      label: 'Live layer',
      fields: { flow, heat: unit('Heat'), probe: probe(['1', '2']) },
    }),
  },
  capacitor: {
    code: {
      type: 'text',
      label: 'Value code',
      default: '104',
      maxLength: 4,
      when: { kind: 'ceramic' },
      examples: [
        { label: '100 nF', value: '104' },
        { label: '10 nF', value: '103' },
        { label: '2.2 nF', value: '222' },
        { label: '22 pF', value: '220' },
      ],
    },
  },
  // Breadboards.
  breadboard: {
    color: {
      type: 'enum',
      label: 'Colour',
      choices: BREADBOARD_COLORS.map(c =>
        choice(c, cap(c), c === 'white' ? FALLBACK['bread-body'] : BREADBOARD_PAINT[c].body),
      ),
      default: 'white',
    },
    splitRails: bool('Split rails', { when: { variant: 'breadboard' } }),
    occupied: state({ type: 'list', label: 'Holes in use', items: { type: 'point' } }),
  },
  // Symbols.
  logicSymbol: {
    inputs: {
      type: 'integer',
      label: 'Inputs',
      min: 2,
      max: 8,
      step: 1,
      default: 2,
      when: { gate: ['and', 'nand', 'or', 'nor', 'xor', 'xnor'] },
    },
  },
  muxSymbol: {},
  flipFlopSymbol: {},
  clockGenerator: { label: { type: 'text', label: 'Label', default: 'CLK', maxLength: 8 } },
  supplySymbol: { voltage: { type: 'number', label: 'Voltage', min: 0, max: 48, step: 0.1, unit: 'V' } },
};
