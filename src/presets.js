/**
 * The catalog parts the templates draw (devBoardTemplate, espDevKitTemplate,
 * sensorModuleTemplate, moduleTemplate, chipTemplate and the rest), each as
 * its own function with the part's real pins, silk and options filled in, so
 * a call with no options draws that part. Each takes the options its catalog
 * entry lists (src/options.js): a board's `indicators`, a sensor board's
 * `indicators` and `finish`, a module's `finish`, a chip's `package`.
 */
import { chipTemplate } from './core.js';
import {
  devBoardTemplate,
  espDevKitTemplate,
  megaBoardTemplate,
  nanoConnectTemplate,
  nucleo32BoardTemplate,
  nucleo64BoardTemplate,
  picoBoardTemplate,
} from './boards.js';
import { moduleTemplate } from './modules.js';
import { gasModuleTemplate, sensorModuleTemplate, to92Template } from './sensors.js';
import { oledBreakout, oledSquare, tftModule } from './displays.js';

/** A board's indicators, unlit unless the caller lights them. */
function lights(props, user) {
  const ind = (props && props.indicators) || {};
  return user === false ? { power: ind.power === true } : { power: ind.power === true, user: ind.user || false };
}

/** A sensor board's lamps: PWR, and DO for the comparator's output. */
function lamps(props) {
  const ind = (props && props.indicators) || {};
  return { power: ind.power === true, out: ind.out === true };
}

/** The board colour the caller picked, else the part's own. */
function finishOf(props, own) {
  return (props && props.finish) || own;
}

/** The chip package the caller picked, else the part's own. */
function packageOf(props, own) {
  return (props && props.package) || own;
}

// Uno-class, Nano-class and Mega-class boards.

/** The Uno-class board: its header groups as the catalog has them; the silk prints SCL and SDA on the second A5 and A4, as the board does. */
export function unoClassBoard(props) {
  return devBoardTemplate({
    layout: 'landscape',
    label: 'UNO-CLASS',
    chipLabel: 'ATMEGA328P',
    labels: { 'A5.2': 'SCL', 'A4.2': 'SDA' },
    top: [
      ['A5.2', 'A4.2', 'AREF', 'GND', '13', '12', '11', '10', '9', '8'],
      ['7', '6', '5', '4', '3', '2', '1', '0'],
    ],
    bottom: [
      ['NC', 'IOREF', 'RESET', '3.3V', '5V', 'GND.2', 'GND.3', 'VIN'],
      ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'],
    ],
    groupNames: { top: ['DIGITAL (PWM ~)'], bottom: ['POWER', 'ANALOG IN'] },
    pwm: ['3', '5', '6', '9', '10', '11'],
    indicators: lights(props),
    description: 'Uno-class board',
  });
}

const NANO_LABELS = { 0: 'RX0', 1: 'TX1', '3.3V': '3V3', AREF: 'REF', RESET: 'RST', 'RESET.2': 'RST' };
for (let nanoDigit = 2; nanoDigit <= 13; nanoDigit++) NANO_LABELS[String(nanoDigit)] = `D${nanoDigit}`;

/** The Nano-class board at its real 18.5 mm width, upright with the USB at the top, the ICSP header's six pins at the far end. */
export function nanoClassBoard(props) {
  return devBoardTemplate({
    label: 'NANO-CLASS',
    chipLabel: 'ATMEGA328P',
    pinKind: 'pad',
    widthPitches: 7.2,
    labels: NANO_LABELS,
    left: ['13', '3.3V', 'AREF', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', '5V', 'RESET', 'GND', 'VIN'],
    right: ['12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'GND.2', 'RESET.2', '0', '1'],
    icsp: ['12.2', '5V.2', '13.2', '11.2', 'RESET.3', 'GND.3'],
    indicators: lights(props),
    description: 'Nano-class board',
  });
}

function numbered(from, count, step) {
  const out = [];
  for (let i = 0; i < count; i++) out.push(String(from + i * step));
  return out;
}

/** The Mega-class board: the digital and communication headers, the 2 x 18 block read row by row, power and both analog groups. */
export function megaClassBoard(props) {
  return megaBoardTemplate({
    label: 'MEGA-CLASS',
    chipLabel: 'ATMEGA2560',
    top: [
      ['SCL', 'SDA', 'AREF', 'GND', '13', '12', '11', '10', '9', '8'],
      ['7', '6', '5', '4', '3', '2', '1', '0'],
      numbered(14, 8, 1),
    ],
    block: {
      left: ['5V.2'].concat(numbered(22, 16, 2), ['GND.4']),
      right: ['5V.3'].concat(numbered(23, 16, 2), ['GND.5']),
    },
    bottom: [
      ['IOREF', 'RESET', '3.3V', '5V', 'GND.2', 'GND.3', 'VIN'],
      numbered(0, 8, 1).map(n => {
        return `A${n}`;
      }),
      numbered(8, 8, 1).map(n => {
        return `A${n}`;
      }),
    ],
    groupNames: { top: ['DIGITAL (PWM ~)', 'COMMUNICATION'], bottom: ['POWER', 'ANALOG IN'] },
    pwm: numbered(2, 12, 1),
    indicators: lights(props),
    description: 'Mega-class board',
  });
}

/** The Nano RP2040 Connect, upright with the USB at the bottom: D12 and D13 at the USB end, TX at the far end after RX. */
export function nanoRp2040Board(props) {
  return nanoConnectTemplate({
    label: 'NANO RP2040',
    chipLabel: 'RP2040',
    left: ['TX', 'RX', 'RESET', 'GND', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12'],
    right: ['VIN', 'GND.2', 'REC', '5V', 'A7', 'A6', 'A5', 'A4', 'A3', 'A2', 'A1', 'A0', 'AREF', '3.3V', 'D13'],
    indicators: lights(props),
    description: 'Nano RP2040 Connect board',
  });
}

/** The Pico-class board: two 20-pin castellated rows read from the USB end; the eight grounds numbered by physical pin. */
export function picoClassBoard(props) {
  return picoBoardTemplate({
    label: 'PICO-CLASS',
    chipLabel: 'RP2040',
    debugPins: false,
    indicators: lights(props),
    description: 'Pico-class board',
    left: [
      'GP0',
      'GP1',
      'GND',
      'GP2',
      'GP3',
      'GP4',
      'GP5',
      'GND.2',
      'GP6',
      'GP7',
      'GP8',
      'GP9',
      'GND.3',
      'GP10',
      'GP11',
      'GP12',
      'GP13',
      'GND.4',
      'GP14',
      'GP15',
    ],
    right: [
      'VBUS',
      'VSYS',
      'GND.8',
      '3V3_EN',
      '3V3',
      'ADC_VREF',
      'GP28',
      'GND.7',
      'GP27',
      'GP26',
      'RUN',
      'GP22',
      'GND.6',
      'GP21',
      'GP20',
      'GP19',
      'GP18',
      'GND.5',
      'GP17',
      'GP16',
    ],
  });
}

// ESP32 development boards in Espressif's DevKit formats: two headers 0.9 inch apart, read from the module end.

/** The ESP32 DevKit V1: two 15-pin rows, the blue LED on GPIO2. */
export function esp32DevKitV1(props) {
  return espDevKitTemplate({
    label: 'ESP32 DEVKIT V1',
    chipLabel: 'ESP-WROOM-32',
    indicators: lights(props),
    description: 'ESP32 development board',
    left: ['EN', 'VP', 'VN', 'D34', 'D35', 'D32', 'D33', 'D25', 'D26', 'D27', 'D14', 'D12', 'D13', 'GND.2', 'VIN'],
    right: ['D23', 'D22', 'TX0', 'RX0', 'D21', 'D19', 'D18', 'D5', 'TX2', 'RX2', 'D4', 'D2', 'D15', 'GND', '3V3'],
  });
}

/** The ESP32-DevKitC V4 (headers J2 and J3): a WROOM-32 module over the rows, no user LED, 19-pin rows (CLK, CMD and D0 to D3 are the module's flash pins). */
export function esp32DevKitCV4(props) {
  return espDevKitTemplate({
    label: 'ESP32 DEVKITC V4',
    chipLabel: 'ESP32-WROOM-32D',
    layout: 'devkitc',
    indicators: lights(props, false),
    description: 'ESP32 development board',
    left: [
      '3V3',
      'EN',
      'VP',
      'VN',
      '34',
      '35',
      '32',
      '33',
      '25',
      '26',
      '27',
      '14',
      '12',
      'GND',
      '13',
      'D2',
      'D3',
      'CMD',
      '5V',
    ],
    right: [
      'GND.2',
      '23',
      '22',
      'TX',
      'RX',
      '21',
      'GND.3',
      '19',
      '18',
      '5',
      '17',
      '16',
      '4',
      '0',
      '2',
      '15',
      'D1',
      'D0',
      'CLK',
    ],
  });
}

/** A DevKitM-1 or DevKitC-1 at its true size (espDevKitTemplate layout 'devkit-1'): spec.size is the module, board length, antenna overhang and first pin's offset from Espressif's dimension drawing. */
function moduleDevKit(spec, props) {
  return espDevKitTemplate({
    layout: 'devkit-1',
    module: spec.size[0],
    length: spec.size[1],
    overhang: spec.size[2],
    firstPin: spec.size[3],
    usb: spec.usb,
    buttons: spec.buttons,
    bridge: spec.bridge,
    label: spec.label,
    chipLabel: spec.module,
    left: spec.left,
    right: spec.right,
    indicators: { power: lights(props).power },
    description: spec.description,
  });
}

/** The ESP32-C3 DevKitM-1: the C3-MINI-1 module, a micro USB. */
export function esp32C3DevKit(props) {
  return moduleDevKit(
    {
      module: 'ESP32-C3-MINI-1',
      label: 'DEVKITM-1',
      size: ['mini', 38.91, 5.35, 1.68],
      usb: 'micro',
      buttons: ['BOOT', 'RST'],
      bridge: 'CP2102N',
      description: 'ESP32-C3 development board',
      left: ['GND', '3V3', '3V3.2', '2', '3', 'GND.2', 'RST', 'GND.3', '0', '1', '10', 'GND.4', '5V', '5V.2', 'GND.5'],
      right: ['GND.6', 'TX', 'RX', 'GND.7', '9', '8', 'GND.8', '7', '6', '5', '4', 'GND.9', '18', '19', 'GND.10'],
    },
    props,
  );
}

/** The ESP32-S2 DevKitM-1 (headers J1 and J3); TX is GPIO43, RX GPIO44. */
export function esp32S2DevKit(props) {
  return moduleDevKit(
    {
      module: 'ESP32-S2-MINI-1',
      label: 'DEVKITM-1',
      size: ['mini-s2', 54.0, 5.6, 1.6],
      usb: 'micro',
      buttons: ['BOOT', 'RST'],
      bridge: 'CP2102N',
      description: 'ESP32-S2 development board',
      left: [
        '3V3',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '5V',
        'GND',
      ],
      right: [
        'GND.2',
        'RST',
        '46',
        '45',
        'RX',
        'TX',
        '42',
        '41',
        '40',
        '39',
        '38',
        '37',
        '36',
        '35',
        '34',
        '33',
        '26',
        '21',
        '20',
        '19',
        '18',
      ],
    },
    props,
  );
}

/** The ESP32-S3 DevKitC-1 (headers J1 and J3); TX is GPIO43, RX GPIO44. */
export function esp32S3DevKit(props) {
  return moduleDevKit(
    {
      module: 'ESP32-S3-WROOM-1',
      label: 'DEVKITC-1',
      size: ['wroom', 62.74, 8.25, 1.53],
      usb: 'dual-micro',
      buttons: ['BOOT', 'RESET'],
      bridge: 'CP2102N',
      description: 'ESP32-S3 development board',
      left: [
        '3V3',
        '3V3.2',
        'RST',
        '4',
        '5',
        '6',
        '7',
        '15',
        '16',
        '17',
        '18',
        '8',
        '3',
        '46',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '5V',
        'GND',
      ],
      right: [
        'GND.2',
        'TX',
        'RX',
        '1',
        '2',
        '42',
        '41',
        '40',
        '39',
        '38',
        '37',
        '36',
        '35',
        '0',
        '45',
        '48',
        '47',
        '21',
        '20',
        '19',
        'GND.3',
        'GND.4',
      ],
    },
    props,
  );
}

/** The ESP32-C5 DevKitC-1 (headers J1 and J3); TX is GPIO11, RX GPIO12. */
export function esp32C5DevKit(props) {
  return moduleDevKit(
    {
      module: 'ESP32-C5-WROOM-1',
      label: 'DEVKITC-1',
      size: ['wroom', 53.6, 6.5, 1.575],
      usb: 'dual-c',
      buttons: ['RESET', 'BOOT'],
      description: 'ESP32-C5 development board',
      left: ['3V3', 'RST', '2', '3', '0', '1', '6', '7', '8', '9', '10', '26', '25', '5V', 'GND', 'NC0'],
      right: ['GND.2', 'TX', 'RX', '24', '23', '15', '27', '4', '5', 'NC1', '28', 'GND.3', '14', '13', 'GND.4', 'NC2'],
    },
    props,
  );
}

/** The ESP32-C6 DevKitC-1 (headers J1 and J3); TX is GPIO16, RX GPIO17. */
export function esp32C6DevKit(props) {
  return moduleDevKit(
    {
      module: 'ESP32-C6-WROOM-1',
      label: 'DEVKITC-1',
      size: ['wroom', 51.8, 6.35, 1.575],
      usb: 'dual-c',
      buttons: ['BOOT', 'RESET'],
      description: 'ESP32-C6 development board',
      left: ['3V3', 'RST', '4', '5', '6', '7', '0', '1', '8', '10', '11', '2', '3', '5V', 'GND', null],
      right: ['GND.2', 'TX', 'RX', '15', '23', '22', '21', '20', '19', '18', '9', 'GND.3', '13', '12', 'GND.4', null],
    },
    props,
  );
}

/** The ESP32-H2 DevKitM-1 (headers J1 and J3); TX is GPIO24, RX GPIO23. */
export function esp32H2DevKit(props) {
  return moduleDevKit(
    {
      module: 'ESP32-H2-MINI-1',
      label: 'DEVKITM-1',
      size: ['mini', 48.26, 5.4, 1.46],
      usb: 'dual-c',
      buttons: ['RESET', 'BOOT'],
      description: 'ESP32-H2 development board',
      left: ['3V3', 'RST', '0', '1', '2', '3', '13', '14', '4', '5', 'NC', 'VBAT', 'GND', '5V', 'GND.2'],
      right: ['GND.3', 'TX', 'RX', '10', '11', '25', '12', '8', '22', 'GND.4', '9', 'GND.5', '27', '26', 'GND.6'],
    },
    props,
  );
}

// STM32 Nucleo boards.

/** The Nucleo-32 with the STM32L031K6: CN3 and CN4 in the Arduino Nano layout, the left row's RST and GND numbered 1, the right row's 2. */
export function stm32L031K6Board(props) {
  return nucleo32BoardTemplate({
    label: 'L031K6 BOARD',
    chipLabel: 'STM32L031K6',
    indicators: { power: lights(props).power },
    description: 'Nucleo-32 board with an STM32L031K6',
    left: ['D1', 'D0', 'RST', 'GND', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12'],
    right: ['VIN', 'GND.2', 'RST.2', '5V', 'A7', 'A6', 'A5', 'A4', 'A3', 'A2', 'A1', 'A0', 'REF', '3V3', 'D13'],
  });
}

/** The Nucleo-64 with the STM32C031C6: the morpho headers CN7 and CN10 (odd pin outer), and the Arduino headers CN6, CN8, CN5 and CN9 beside the pins they duplicate. */
export function stm32C031C6Board(props) {
  return nucleo64BoardTemplate({
    label: 'C031C6 BOARD',
    chipLabel: 'STM32C031C6',
    indicators: { power: lights(props).power },
    description: 'Nucleo-64 board with an STM32C031C6',
    left: [
      ['PD0', 'PD1'],
      ['PD2', 'PD2.2'],
      ['VDD', 'E5V'],
      ['PA14', 'GND.4'],
      [null, null],
      [null, 'IOREF.2'],
      ['PA13', 'NRST.2'],
      ['PC6', '3V3.2'],
      [null, '5V.2'],
      ['GND.5', 'GND.6'],
      [null, 'GND.7'],
      ['PC13', 'VIN.2'],
      ['PC14', null],
      [null, 'PA0'],
      ['PF0', 'PA1'],
      ['PF1', 'PA4'],
      ['PB11', 'PB0.2'],
      ['PA2', 'PA11'],
      [null, 'PA12'],
    ],
    right: [
      ['PD3', 'PA3'],
      ['PB8', 'PC15'],
      ['PB9', 'PB12'],
      ['AVDD.2', '5V.3'],
      ['GND.8', null],
      ['PA5', 'PF3'],
      ['PA6', 'PA8'],
      ['PA7', 'PB12.2'],
      ['PB0', null],
      ['PC7', 'GND.9'],
      ['PA9', 'PB2'],
      ['PA15', 'PB1'],
      ['PB5', 'PB15'],
      ['PB4', 'PB14'],
      ['PB10', 'PB13'],
      ['PB3', 'AGND'],
      ['PA10', null],
      ['PB6', null],
      ['PB7', null],
    ],
    power: [null, 'IOREF', 'NRST', '3V3', '5V', 'GND', 'GND.2', 'VIN'],
    analog: ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'],
    digitalHigh: ['D15', 'D14', 'AVDD', 'GND.3', 'D13', 'D12', 'D11', 'D10', 'D9', 'D8'],
    digitalLow: ['D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'D1', 'D0'],
  });
}

// Sensor boards.

/** The light sensor: the LDR on the four-pin comparator board. */
export function lightSensor(props) {
  return sensorModuleTemplate({
    element: 'ldr',
    comparator: true,
    pins: ['VCC', 'GND', 'DO', 'AO'],
    indicators: lamps(props),
    finish: finishOf(props),
  });
}
/** The infrared flame sensor on the same board. */
export function flameSensor(props) {
  return sensorModuleTemplate({
    element: 'flame',
    comparator: true,
    pins: ['VCC', 'GND', 'DOUT', 'AOUT'],
    labels: ['VCC', 'GND', 'DO', 'AO'],
    indicators: lamps(props),
    finish: finishOf(props),
  });
}
/** The SW-520D tilt switch on its three-pin comparator board. */
export function tiltSwitch(props) {
  return sensorModuleTemplate({
    element: 'cylinder',
    comparator: true,
    pins: ['GND', 'VCC', 'OUT'],
    indicators: lamps(props),
    finish: finishOf(props),
  });
}
/** The sound sensor: the 9.7 mm electret capsule on the four-pin comparator board, or the 6 mm one on the small board (`small`). */
export function soundSensor(props) {
  return sensorModuleTemplate({
    element: 'mic',
    comparator: true,
    micMm: props && props.small ? 6 : 9.7,
    pins: ['AOUT', 'GND', 'VCC', 'DOUT'],
    labels: ['AO', 'G', '+', 'DO'],
    indicators: lamps(props),
    finish: finishOf(props),
  });
}
/** The NTC thermistor on its three-pin board. */
export function ntcSensor(props) {
  return sensorModuleTemplate({
    element: 'bead',
    pins: ['OUT', 'VCC', 'GND'],
    label: 'KY-013',
    finish: finishOf(props),
  });
}
/** The 38 kHz infrared receiver on its three-pin board. */
export function irReceiver(props) {
  return sensorModuleTemplate({ element: 'ir', pins: ['GND', 'VCC', 'DAT'], label: 'KY-022', finish: finishOf(props) });
}
/** The MQ gas sensor module, its header as the board prints it. */
export function gasSensor(props) {
  return gasModuleTemplate({
    pins: ['VCC', 'GND', 'DOUT', 'AOUT'],
    labels: ['VCC', 'GND', 'DO', 'AO'],
    indicators: lamps(props),
    finish: finishOf(props),
  });
}
/** The DS18B20 1-Wire temperature sensor in its TO-92 package, flat face forward: GND, DQ, VDD. */
export function ds18b20Sensor() {
  return to92Template({ label: 'DS18B20', pins: ['GND', 'DQ', 'VDD'] });
}
/** The MPU6050 IMU breakout, its header as the board prints it (VCC to INT). */
export function mpu6050Imu(props) {
  return moduleTemplate({
    label: 'MPU6050',
    pins: ['VCC', 'GND', 'SCL', 'SDA', 'XDA', 'XCL', 'AD0', 'INT'],
    part: 'chip',
    ic: 'qfn',
    width: 21,
    height: 16,
    finish: finishOf(props, 'blue'),
  });
}

// Chips, pin 1 first.

/** The NE555 timer, DIP-8. */
export function ne555Timer(props) {
  return chipTemplate({
    label: 'NE555',
    package: packageOf(props, 'dip'),
    pins: ['GND', 'TRIG', 'OUT', 'RESET', 'CTRL', 'THR', 'DIS', 'VCC'],
  });
}
/** The 74HC595 shift register, DIP-16. */
export function shiftRegister595(props) {
  return chipTemplate({
    label: '74HC595',
    package: packageOf(props, 'dip'),
    pins: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'GND', 'Q7S', 'MR', 'SHCP', 'STCP', 'OE', 'DS', 'Q0', 'VCC'],
  });
}
/** The 74HC165 shift register, DIP-16. */
export function shiftRegister165(props) {
  return chipTemplate({
    label: '74HC165',
    package: packageOf(props, 'dip'),
    pins: ['PL', 'CP', 'D4', 'D5', 'D6', 'D7', 'Q7_N', 'GND', 'Q7', 'DS', 'D0', 'D1', 'D2', 'D3', 'CE', 'VCC'],
  });
}
/** The NLSF595 LED driver, TSSOP-16; pin 13 is OE (active low). */
export function ledDriver595(props) {
  return chipTemplate({
    label: 'NLSF595',
    package: packageOf(props, 'tssop'),
    pins: ['QB', 'QC', 'QD', 'QE', 'QF', 'QG', 'QH', 'GND', 'SQH', 'SCLR', 'SCK', 'RCK', 'OE', 'SI', 'QA', 'VCC'],
  });
}
/** The ATtiny85, DIP-8, its pins by port name. */
export function attiny85(props) {
  return chipTemplate({
    label: 'ATtiny85',
    package: packageOf(props, 'dip'),
    pins: ['PB5', 'PB3', 'PB4', 'GND', 'PB0', 'PB1', 'PB2', 'VCC'],
  });
}

// Display and radio modules whose catalog header differs from the template's.

/** A screen module's options: its picture (`caption`, `pixels`) over the catalog's own. */
function screen(props, own) {
  props = props || {};
  return Object.assign({ caption: props.caption, pixels: props.pixels }, own);
}

/** The SSD1306 OLED module with the four-pin I2C header. */
export function ssd1306Module(props) {
  return oledBreakout(screen(props, { pins: ['GND', 'VCC', 'SCL', 'SDA'] }));
}
/** The SH1107 128 x 128 OLED module. */
export function sh1107Module(props) {
  return oledSquare(screen(props, { label: 'SH1107 128x128', pins: ['GND', 'VCC', 'SCL', 'SDA'] }));
}
/** The ILI9341 display with the FT6206 capacitive touch: eleven pins. */
export function ili9341TouchDisplay(props) {
  return tftModule(
    screen(props, {
      touch: true,
      pins: ['VCC', 'GND', 'CS', 'RST', 'D/C', 'MOSI', 'SCK', 'LED', 'MISO', 'SCL', null, 'SDA'],
    }),
  );
}
