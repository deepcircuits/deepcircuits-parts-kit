/**
 * The catalog: every part the kit draws, by id, with its name, its family, the generator and preset that make it, the
 * options it takes (src/options.js) and the names people search for it by. It loads no drawing code: drawPart
 * (src/draw.js) draws a part at once, loadPart loads only the part's family first.
 *
 * Ids are frozen: a stored id keeps drawing the same part. An id is its name in lower case with every run of other
 * characters a hyphen (× is x, ″ is in), and starts with a letter; a size, count or part number that would start a
 * name follows a comma instead ("Character LCD, 16×2").
 */
import { OPTIONS } from './options.js';

/** The families, in the order a picker shows them, each with the title a picker gives it. */
export const FAMILY_TITLES = {
  board: 'Boards',
  display: 'Displays',
  sensor: 'Sensors',
  input: 'Inputs',
  output: 'Outputs',
  module: 'Modules',
  chip: 'Chips',
  passive: 'Passives',
  breadboard: 'Breadboards',
  symbol: 'Symbols',
};

/** The families, in the order a picker shows them. */
export const FAMILIES = Object.keys(FAMILY_TITLES);

// [id, name, family, generator, preset, search terms]
const PARTS = [
  ['uno-class-board', 'Uno-class board', 'board', 'unoClassBoard', null, ['Arduino Uno', 'ATmega328P']],
  ['nano-class-board', 'Nano-class board', 'board', 'nanoClassBoard', null, ['Arduino Nano', 'ATmega328P']],
  ['mega-class-board', 'Mega-class board', 'board', 'megaClassBoard', null, ['Arduino Mega', 'ATmega2560']],
  ['rp2040-nano-class-board', 'RP2040 Nano-class board', 'board', 'nanoRp2040Board', null, ['Nano RP2040 Connect']],
  ['pico-class-board', 'Pico-class board', 'board', 'picoClassBoard', null, ['Raspberry Pi Pico', 'RP2040']],
  [
    'esp32-dev-board-30-pin',
    'ESP32 dev board, 30-pin',
    'board',
    'esp32DevKitV1',
    null,
    ['ESP32 DevKit V1', 'ESP-WROOM-32'],
  ],
  [
    'esp32-dev-board-38-pin',
    'ESP32 dev board, 38-pin',
    'board',
    'esp32DevKitCV4',
    null,
    ['ESP32-DevKitC V4', 'ESP32-WROOM-32'],
  ],
  ['esp32-c3-dev-board', 'ESP32-C3 dev board', 'board', 'esp32C3DevKit', null, ['ESP32-C3-DevKitM-1']],
  ['esp32-c5-dev-board', 'ESP32-C5 dev board', 'board', 'esp32C5DevKit', null, ['ESP32-C5-DevKitC-1']],
  ['esp32-c6-dev-board', 'ESP32-C6 dev board', 'board', 'esp32C6DevKit', null, ['ESP32-C6-DevKitC-1']],
  ['esp32-h2-dev-board', 'ESP32-H2 dev board', 'board', 'esp32H2DevKit', null, ['ESP32-H2-DevKitM-1']],
  ['esp32-s2-dev-board', 'ESP32-S2 dev board', 'board', 'esp32S2DevKit', null, ['ESP32-S2-DevKitM-1']],
  ['esp32-s3-dev-board', 'ESP32-S3 dev board', 'board', 'esp32S3DevKit', null, ['ESP32-S3-DevKitC-1']],
  ['stm32-board-32-pin', 'STM32 board, 32-pin', 'board', 'stm32L031K6Board', null, ['Nucleo-32', 'STM32L031K6']],
  ['stm32-board-64-pin', 'STM32 board, 64-pin', 'board', 'stm32C031C6Board', null, ['Nucleo-64', 'STM32C031C6']],
  ['stm32-blue-pill', 'STM32 Blue Pill', 'board', 'bluePillBoard', null, ['STM32F103C8']],
  ['franzininho-diy', 'Franzininho DIY', 'board', 'franzininho', null, ['ATtiny85']],
  [
    'character-lcd-16x2',
    'Character LCD, 16×2',
    'display',
    'characterLcd',
    { cols: 16, rows: 2 },
    ['LCD1602', 'HD44780'],
  ],
  [
    'character-lcd-20x4',
    'Character LCD, 20×4',
    'display',
    'characterLcd',
    { cols: 20, rows: 4 },
    ['LCD2004', 'HD44780'],
  ],
  ['oled-0-96in-i2c', 'OLED, 0.96″ I2C', 'display', 'ssd1306Module', null, ['SSD1306', '128x64']],
  ['oled-0-96in-spi', 'OLED, 0.96″ SPI', 'display', 'oledBreakout', null, ['SSD1306', '128x64']],
  ['oled-1-5in', 'OLED, 1.5″', 'display', 'sh1107Module', null, ['SH1107', '128x128']],
  ['tft-display-2-4in', 'TFT display, 2.4″', 'display', 'tftModule', null, ['ILI9341', '240x320']],
  ['tft-display-2-8in-touch', 'TFT display, 2.8″ touch', 'display', 'ili9341TouchDisplay', null, ['ILI9341', 'FT6206']],
  ['graphic-lcd-84x48', 'Graphic LCD, 84×48', 'display', 'nokiaModule', null, ['PCD8544', 'Nokia 5110']],
  ['e-paper-display-2-9in', 'E-paper display, 2.9″', 'display', 'epaperModule', null, ['e-ink', '296x128']],
  [
    'seven-segment-display-1-digit',
    'Seven-segment display, 1 digit',
    'display',
    'sevenSegment',
    { digits: 1 },
    ['7-segment'],
  ],
  [
    'seven-segment-display-4-digits',
    'Seven-segment display, 4 digits',
    'display',
    'sevenSegment',
    { digits: 4 },
    ['7-segment'],
  ],
  ['clock-display', 'Clock display', 'display', 'tm1637Module', null, ['TM1637', '7-segment']],
  ['led-matrix-8x8', 'LED matrix, 8×8', 'display', 'max7219Matrix', { chain: 1 }, ['MAX7219']],
  ['led-matrix-chain-of-4', 'LED matrix, chain of 4', 'display', 'max7219Matrix', { chain: 4 }, ['MAX7219']],
  ['rgb-led-matrix-8x8', 'RGB LED matrix, 8×8', 'display', 'neopixelMatrix', null, ['WS2812B', 'NeoPixel']],
  ['led-ring-16-leds', 'LED ring, 16 LEDs', 'display', 'ledRing', null, ['WS2812B', 'NeoPixel ring']],
  ['ultrasonic-ranger', 'Ultrasonic ranger', 'sensor', 'ultrasonicRanger', null, ['HC-SR04', 'distance']],
  [
    'temperature-and-humidity-sensor',
    'Temperature and humidity sensor',
    'sensor',
    'dht22Sensor',
    null,
    ['DHT22', 'AM2302'],
  ],
  ['temperature-and-humidity-module', 'Temperature and humidity module', 'sensor', 'dht11Module', null, ['DHT11']],
  [
    'pressure-sensor-4-pin',
    'Pressure sensor, 4-pin',
    'sensor',
    'bmp180Board',
    { variant: 'gy68' },
    ['BMP180', 'GY-68', 'barometer'],
  ],
  [
    'pressure-sensor-5-pin',
    'Pressure sensor, 5-pin',
    'sensor',
    'bmp180Board',
    { variant: 'five-pin' },
    ['BMP180', 'barometer'],
  ],
  ['light-sensor', 'Light sensor', 'sensor', 'lightSensor', null, ['LDR', 'photoresistor']],
  ['flame-sensor', 'Flame sensor', 'sensor', 'flameSensor', null, ['infrared']],
  ['sound-sensor', 'Sound sensor', 'sensor', 'soundSensor', null, ['microphone', 'KY-037', 'KY-038']],
  ['tilt-switch', 'Tilt switch', 'sensor', 'tiltSwitch', null, ['SW-520D']],
  ['gas-sensor', 'Gas sensor', 'sensor', 'gasSensor', null, ['MQ-2', 'MQ-3', 'MQ-7', 'MQ-135']],
  ['ir-receiver', 'IR receiver', 'sensor', 'irReceiver', null, ['KY-022', 'infrared', 'VS1838B']],
  ['ntc-thermistor', 'NTC thermistor', 'sensor', 'ntcSensor', null, ['KY-013', 'temperature']],
  ['pir-motion-sensor', 'PIR motion sensor', 'sensor', 'pirModule', null, ['HC-SR501']],
  ['accelerometer-and-gyro', 'Accelerometer and gyro', 'sensor', 'mpu6050Imu', null, ['MPU6050', 'IMU', 'GY-521']],
  ['pulse-sensor', 'Pulse sensor', 'sensor', 'pulseSensor', null, ['heart rate']],
  ['ds18b20-temperature-sensor', 'DS18B20 temperature sensor', 'sensor', 'ds18b20Sensor', null, ['1-Wire', 'TO-92']],
  ['environment-sensor', 'Environment sensor', 'sensor', 'bme280Module', null, ['BME280', 'BMP280', 'GY-BME280']],
  [
    'time-of-flight-sensor',
    'Time-of-flight sensor',
    'sensor',
    'vl53l0xModule',
    null,
    ['VL53L0X', 'GY-530', 'distance'],
  ],
  ['pulse-oximeter', 'Pulse oximeter', 'sensor', 'max30102Module', null, ['MAX30102', 'heart rate', 'SpO2']],
  ['lm35-temperature-sensor', 'LM35 temperature sensor', 'sensor', 'lm35Sensor', null, ['analog', 'TO-92']],
  ['tmp36-temperature-sensor', 'TMP36 temperature sensor', 'sensor', 'tmp36Sensor', null, ['analog', 'TO-92']],
  [
    'soil-moisture-sensor',
    'Soil moisture sensor',
    'sensor',
    'soilMoistureSensor',
    null,
    ['FC-28', 'YL-69', 'hygrometer'],
  ],
  [
    'capacitive-soil-moisture-sensor',
    'Capacitive soil moisture sensor',
    'sensor',
    'capacitiveSoilSensor',
    null,
    ['v1.2', 'hygrometer'],
  ],
  ['water-level-sensor', 'Water level sensor', 'sensor', 'waterLevelSensor', null, ['water sensor', 'liquid level']],
  ['rain-sensor', 'Rain sensor', 'sensor', 'rainSensor', null, ['FC-37', 'YL-83', 'raindrop']],
  ['ir-obstacle-sensor', 'IR obstacle sensor', 'sensor', 'obstacleSensor', null, ['FC-51', 'infrared', 'avoidance']],
  ['line-tracking-sensor', 'Line tracking sensor', 'sensor', 'lineTracker', null, ['TCRT5000', 'line follower']],
  [
    'voltage-divider-sensor',
    'Voltage divider sensor',
    'sensor',
    'voltageSensorModule',
    null,
    ['0-25V', 'voltage divider'],
  ],
  ['acs712-current-sensor', 'ACS712 current sensor', 'sensor', 'acs712Module', null, ['ACS712', 'hall effect']],
  ['pushbutton', 'Pushbutton', 'input', 'pushbutton', { size: 12 }, ['button', 'tactile switch']],
  ['pushbutton-6-mm', 'Pushbutton, 6 mm', 'input', 'pushbutton', { size: 6 }, ['button', 'tactile switch']],
  ['potentiometer', 'Potentiometer', 'input', 'potentiometer', null, ['knob', 'pot']],
  ['slide-potentiometer', 'Slide potentiometer', 'input', 'slidePotentiometer', null, ['fader', 'slider']],
  ['slide-switch', 'Slide switch', 'input', 'slideSwitch', null, ['SPDT']],
  ['rotary-encoder', 'Rotary encoder', 'input', 'rotaryEncoder', null, ['KY-040']],
  ['joystick', 'Joystick', 'input', 'joystick', null, ['KY-023', 'thumbstick']],
  ['keypad-4x4', 'Keypad, 4×4', 'input', 'keypad', null, ['membrane keypad', 'matrix keypad']],
  ['dip-switch-8-way', 'DIP switch, 8-way', 'input', 'dipSwitch', { count: 8 }, ['switch bank']],
  ['ir-remote', 'IR remote', 'input', 'irRemote', null, ['infrared remote']],
  ['rotary-dialer', 'Rotary dialer', 'input', 'rotaryDialer', null, ['telephone dial']],
  ['led-5-mm', 'LED, 5 mm', 'output', 'led', null, ['light-emitting diode']],
  ['rgb-led', 'RGB LED', 'output', 'rgbLed', null, ['common cathode']],
  ['led-bar-graph', 'LED bar graph', 'output', 'ledBarGraph', null, ['10-segment']],
  ['addressable-led', 'Addressable LED', 'output', 'neopixel', null, ['WS2812B', 'NeoPixel']],
  ['addressable-led-strip', 'Addressable LED strip', 'output', 'ledStrip', null, ['WS2812B', 'NeoPixel strip']],
  ['piezo-buzzer', 'Piezo buzzer', 'output', 'buzzer', null, ['beeper', 'speaker']],
  ['active-buzzer', 'Active buzzer', 'output', 'buzzer', { sealed: true }, ['beeper', 'KY-012']],
  ['servo', 'Servo', 'output', 'servo', null, ['SG90', 'micro servo']],
  ['stepper-motor', 'Stepper motor', 'output', 'stepper', { biaxial: false }, ['NEMA 17']],
  ['biaxial-stepper', 'Biaxial stepper', 'output', 'stepper', { biaxial: true }, ['clock motor']],
  ['dpdt-relay', 'DPDT relay', 'output', 'relay', null, ['relay']],
  ['relay-module', 'Relay module', 'module', 'relayModule', null, ['relay', 'SRD-05VDC']],
  [
    'relay-module-2-channel',
    'Relay module, 2-channel',
    'module',
    'multiRelayModule',
    { channels: 2 },
    ['relay', 'SRD-05VDC', 'optocoupler'],
  ],
  [
    'relay-module-4-channel',
    'Relay module, 4-channel',
    'module',
    'multiRelayModule',
    { channels: 4 },
    ['relay', 'SRD-05VDC', 'optocoupler'],
  ],
  [
    'relay-module-8-channel',
    'Relay module, 8-channel',
    'module',
    'multiRelayModule',
    { channels: 8 },
    ['relay', 'SRD-05VDC', 'optocoupler'],
  ],
  ['load-cell-amplifier', 'Load cell amplifier', 'module', 'hx711Board', null, ['HX711', 'scale']],
  ['microsd-card-module', 'microSD card module', 'module', 'microsdModule', null, ['SD card']],
  ['regulator-module-3-3-v', 'Regulator module, 3.3 V', 'module', 'ams1117Module', null, ['AMS1117', 'LDO']],
  [
    'breadboard-power-module',
    'Breadboard power module',
    'module',
    'mb102Module',
    null,
    ['MB102', 'power supply', '5V', '3.3V'],
  ],
  ['real-time-clock', 'Real-time clock', 'module', 'rtcModule', null, ['DS1307', 'RTC']],
  [
    'precision-real-time-clock',
    'Precision real-time clock',
    'module',
    'ds3231Module',
    null,
    ['DS3231', 'ZS-042', 'RTC'],
  ],
  ['rfid-reader', 'RFID reader', 'module', 'rfidModule', null, ['MFRC522', 'RC522', 'NFC']],
  ['logic-analyzer', 'Logic analyzer', 'module', 'logicAnalyzer', null, ['8 channels']],
  ['pixel-meter', 'Pixel meter', 'module', 'neopixelMeter', null, ['NeoPixel', 'current meter']],
  ['ne555-timer', 'NE555 timer', 'chip', 'ne555Timer', null, ['555']],
  ['shift-register-74hc595', 'Shift register, 74HC595', 'chip', 'shiftRegister595', null, ['SIPO']],
  ['shift-register-74hc165', 'Shift register, 74HC165', 'chip', 'shiftRegister165', null, ['PISO']],
  ['nlsf595-driver', 'NLSF595 driver', 'chip', 'ledDriver595', null, ['LED driver']],
  ['attiny85', 'ATtiny85', 'chip', 'attiny85', null, ['microcontroller']],
  ['transistor-to-92', 'Transistor, TO-92', 'chip', 'transistor', { package: 'to-92' }, ['BJT', '2N2222A', 'PN2222A']],
  [
    'transistor-to-220',
    'Transistor, TO-220',
    'chip',
    'transistor',
    { package: 'to-220' },
    ['MOSFET', 'IRLZ44N', 'power'],
  ],
  [
    'voltage-regulator-to-220',
    'Voltage regulator, TO-220',
    'chip',
    'transistor',
    { package: 'to-220', label: 'L7805CV', pins: ['IN', 'GND', 'OUT'] },
    ['7805', 'LM7805', 'L7805', '5V regulator'],
  ],
  ['resistor', 'Resistor', 'passive', 'resistor', null, ['ohm']],
  ['battery-holder', 'Battery holder', 'passive', 'batteryHolder', null, ['battery', 'AA', '18650', 'CR2032']],
  ['electrolytic-capacitor', 'Electrolytic capacitor', 'passive', 'capacitor', { kind: 'electrolytic' }, ['capacitor']],
  ['ceramic-capacitor', 'Ceramic capacitor', 'passive', 'capacitor', { kind: 'ceramic' }, ['capacitor', 'MLCC']],
  ['mini-breadboard', 'Mini breadboard', 'breadboard', 'breadboard', { variant: 'breadboard-mini' }, ['170 points']],
  ['half-breadboard', 'Half breadboard', 'breadboard', 'breadboard', { variant: 'breadboard-half' }, ['400 points']],
  ['full-breadboard', 'Full breadboard', 'breadboard', 'breadboard', { variant: 'breadboard' }, ['830 points']],
  ['and-gate', 'AND gate', 'symbol', 'logicSymbol', { gate: 'and' }, ['logic gate']],
  ['nand-gate', 'NAND gate', 'symbol', 'logicSymbol', { gate: 'nand' }, ['logic gate']],
  ['or-gate', 'OR gate', 'symbol', 'logicSymbol', { gate: 'or' }, ['logic gate']],
  ['nor-gate', 'NOR gate', 'symbol', 'logicSymbol', { gate: 'nor' }, ['logic gate']],
  ['xor-gate', 'XOR gate', 'symbol', 'logicSymbol', { gate: 'xor' }, ['logic gate']],
  ['xnor-gate', 'XNOR gate', 'symbol', 'logicSymbol', { gate: 'xnor' }, ['logic gate']],
  ['not-gate', 'NOT gate', 'symbol', 'logicSymbol', { gate: 'not' }, ['inverter', 'logic gate']],
  ['buffer', 'Buffer', 'symbol', 'logicSymbol', { gate: 'buffer' }, ['logic gate']],
  ['multiplexer', 'Multiplexer', 'symbol', 'muxSymbol', null, ['mux']],
  ['d-flip-flop', 'D flip-flop', 'symbol', 'flipFlopSymbol', null, ['latch']],
  [
    'd-flip-flop-with-set-and-reset',
    'D flip-flop with set and reset',
    'symbol',
    'flipFlopSymbol',
    { set: true, reset: true },
    ['latch'],
  ],
  ['clock-source', 'Clock source', 'symbol', 'clockGenerator', null, ['oscillator']],
  ['supply', 'Supply', 'symbol', 'supplySymbol', null, ['VCC', 'power']],
];

/** An option's `when` against a call's values: every named option matches one of its values (null is unset). */
export function optionApplies(spec, values) {
  if (!spec.when) return true;
  return Object.entries(spec.when).every(([k, want]) => {
    const v = values[k] === undefined ? null : values[k];
    return (Array.isArray(want) ? want : [want]).some(w => w === v);
  });
}

/** The value an option's example gives part `entry`: its value, or with `each`, that value for every item the part has. */
export function exampleValue(entry, spec, example) {
  return example.each
    ? Array.from({ length: Number(entry.preset.chain ?? spec.length ?? 1) }, () => example.value)
    : example.value;
}

function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const v of Object.values(value)) freeze(v);
  }
  return value;
}

function entry([id, name, family, fn, preset, aliases]) {
  const all = OPTIONS[fn];
  if (!all) throw new Error(`${id}: no options for ${fn}`);
  const options = {};
  preset = preset || {};
  for (const [k, spec] of Object.entries(all)) {
    if (k in preset) continue;
    // An option whose `when` names the preset belongs to the parts that preset makes.
    if (!spec.when || Object.keys(spec.when).every(w => !(w in preset)) || optionApplies(spec, preset))
      options[k] = spec;
  }
  const stateNames = Object.keys(options).filter(k => options[k].state);
  return { id, name, family, fn, preset, options, state: stateNames, aliases };
}

/** Every part the kit draws, in families. Each entry: id, name, family, the generator `fn` and the `preset` options that make the part, the `options` a caller may set (specs, src/options.js), the `state` options among them, and search `aliases`. */
export const CATALOG = freeze(PARTS.map(entry));

const byId = new Map(CATALOG.map(e => [e.id, e]));

/** The catalog entry for an id, or undefined. */
export function findPart(id) {
  return byId.get(id);
}

// Spelling distance, for "did you mean".
function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
function nearest(word, words) {
  let best = null;
  let bestD = Infinity;
  for (const w of words) {
    const dist = distance(word.toLowerCase(), w.toLowerCase());
    if (dist < bestD) [best, bestD] = [w, dist];
  }
  return best && bestD <= Math.max(2, Math.floor(word.length / 3)) ? best : null;
}
const isColor = v =>
  typeof v === 'string' &&
  /^(?:#(?:[0-9a-f]{3}|[0-9a-f]{6})|[a-z]{3,20}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\))$/i.test(
    v,
  );
const isNum = v => typeof v === 'number' && isFinite(v);

/** The problems with one value against its spec, as phrases ("must be ..."), empty when it fits. */
function problemsOf(spec, value, where) {
  if (value === undefined || value === null) return [];
  const out = [];
  const bad = what => out.push(`${where} must be ${what}`);
  switch (spec.type) {
    case 'boolean':
      if (typeof value !== 'boolean' && value !== 0 && value !== 1) bad('true or false');
      break;
    case 'number':
    case 'integer':
      if (!isNum(value) || (spec.type === 'integer' && !Number.isInteger(value)))
        bad(`a${spec.type === 'integer' ? 'n integer' : ' number'}`);
      break;
    case 'level':
      if (typeof value !== 'boolean' && !isNum(value)) bad('true, false or a level from 0 to 1');
      break;
    case 'enum':
      if (!spec.choices.some(c => c.value === value))
        bad(`one of ${spec.choices.map(c => JSON.stringify(c.value)).join(', ')}`);
      break;
    case 'color':
      if (!isColor(value)) bad('a lens colour name or a CSS colour');
      break;
    case 'pixel':
      if (
        !isColor(value) &&
        !(value && typeof value === 'object' && isNum(value.r) && isNum(value.g) && isNum(value.b))
      )
        bad('a CSS colour, { r, g, b } or null');
      break;
    case 'text':
      if (typeof value !== 'string' && !(spec.numeric && isNum(value))) bad(spec.numeric ? 'text or a number' : 'text');
      break;
    case 'frame':
      if (!value || typeof value !== 'object' || !isNum(value.width) || !isNum(value.height) || value.data == null)
        bad('a picture { width, height, data }');
      break;
    case 'point':
      if (!value || typeof value !== 'object' || !isNum(value.x) || !isNum(value.y)) bad('a point { x, y }');
      break;
    case 'list':
      if (!Array.isArray(value)) bad('a list');
      else value.forEach((item, i) => out.push(...problemsOf(spec.items, item, `${where}[${i}]`)));
      break;
    case 'object':
      if (typeof value !== 'object' || Array.isArray(value)) bad('an object');
      else
        for (const [k, v] of Object.entries(value)) {
          if (spec.fields[k]) out.push(...problemsOf(spec.fields[k], v, `${where}.${k}`));
          else {
            const near = nearest(k, Object.keys(spec.fields));
            out.push(
              `${where} has no "${k}"${near ? `; did you mean "${near}"?` : ''} It takes ${Object.keys(spec.fields).join(', ')}.`,
            );
          }
        }
      break;
    default:
  }
  return out;
}

/** What is wrong with drawing catalog part `id` with `options`: unknown ids and options (with the nearest name), and values of the wrong type. Empty when the call is good. Ranges are not checked: the generators clamp. */
export function checkOptions(id, options) {
  const e = findPart(id);
  if (!e) {
    const near = nearest(
      String(id),
      CATALOG.map(c => c.id),
    );
    return [`There is no catalog part "${id}"${near ? `; did you mean "${near}"?` : ''}`];
  }
  if (options === undefined || options === null) return [];
  if (typeof options !== 'object' || Array.isArray(options)) return [`${e.id}: the options must be an object`];
  const out = [];
  const names = Object.keys(e.options);
  for (const [k, v] of Object.entries(options)) {
    const spec = e.options[k];
    if (spec) out.push(...problemsOf(spec, v, `${e.id}: "${k}"`));
    else {
      const near = nearest(k, names);
      const fixed = k in e.preset ? ` (the part sets it: ${JSON.stringify(e.preset[k])})` : '';
      out.push(
        `${e.id} has no option "${k}"${fixed}${near ? `; did you mean "${near}"?` : ''}${names.length ? ` Its options are ${names.join(', ')}.` : ' It takes no options.'}`,
      );
    }
  }
  return out;
}

/** The arguments the generator gets: the part's preset under the caller's options, checked first. Throws with every problem. */
export function callOf(id, options) {
  const problems = checkOptions(id, options);
  if (problems.length) throw new Error(problems.join('\n'));
  const e = findPart(id);
  return { entry: e, props: { ...e.preset, ...options } };
}

const fold = s =>
  String(s)
    .toLowerCase()
    .replace(/×/g, 'x')
    .replace(/″/g, 'in')
    .replace(/[^a-z0-9]+/g, '');

/** The catalog parts that match a search, best first: by id, name or alias, whole or in part, ignoring case, spaces and punctuation ("hcsr04" finds the ultrasonic ranger). */
export function searchParts(query) {
  const words = String(query || '')
    .split(/\s+/)
    .map(fold)
    .filter(Boolean);
  if (!words.length) return CATALOG.slice();
  const scored = [];
  for (const e of CATALOG) {
    const terms = [e.id, e.name, ...e.aliases].map(fold);
    let score = 0;
    for (const w of words) {
      const s = terms.reduce((best, t) => Math.max(best, t === w ? 3 : t.startsWith(w) ? 2 : t.includes(w) ? 1 : 0), 0);
      if (!s) {
        score = 0;
        break;
      }
      score += s;
    }
    if (score) scored.push([score, e]);
  }
  return scored.sort((a, b) => b[0] - a[0]).map(([, e]) => e);
}

const FAMILY_MODULES = {
  board: () => import('./families/boards.js'),
  display: () => import('./families/displays.js'),
  sensor: () => import('./families/sensors.js'),
  input: () => import('./families/inputs.js'),
  output: () => import('./families/outputs.js'),
  module: () => import('./families/modules.js'),
  chip: () => import('./families/chips.js'),
  passive: () => import('./families/passives.js'),
  breadboard: () => import('./families/breadboards.js'),
  symbol: () => import('./families/symbols.js'),
};

/** Loads only the part's family and resolves to a function that draws the part: (options) => Artwork, checked as drawPart checks them. */
export async function loadPart(id) {
  const e = findPart(id);
  if (!e) throw new Error(checkOptions(id)[0]);
  const family = await FAMILY_MODULES[e.family]();
  const draw = family[e.fn];
  return options => draw(callOf(e.id, options).props);
}
