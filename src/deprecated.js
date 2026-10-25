/**
 * Names the root export keeps working for while their uses move: each deprecated name, the name that replaces it and
 * the entry point that has it. build.mjs marks them @deprecated in the types; the modules check holds each one to the
 * same function as its replacement.
 */
const TEMPLATES = [
  'devBoard',
  'megaBoard',
  'nanoConnect',
  'picoBoard',
  'espDevKit',
  'nucleo32Board',
  'nucleo64Board',
  'module',
  'sensorModule',
  'comparatorBoard',
  'smallSensorBoard',
  'gasModule',
  'chip',
  'to92',
];
const PRIMITIVES = [
  'svg',
  'pin',
  'header',
  'board',
  'lens',
  'indicator',
  'silkMark',
  'flow',
  'probe',
  'wire',
  'trace',
  'via',
  'capTop',
  'lotCode',
  'usbPort',
  'usbC',
  'lensColor',
  'FINISHES',
  'formatOhms',
  'resistorBands',
  'meterLines',
  'formatMilliamps',
  'breadboardColor',
  'breadboardPaint',
];

export const DEPRECATED = {
  ...Object.fromEntries(TEMPLATES.map(name => [name, { use: `${name}Template`, from: 'templates' }])),
  ...Object.fromEntries(PRIMITIVES.map(name => [name, { use: name, from: 'primitives' }])),
  check: { use: 'check', from: 'check' },
  pinsOnPitch: { use: 'pinsOnPitch', from: 'check' },
  mount: { use: 'mount', from: 'mount' },
  ultrasonicSensor: { use: 'ultrasonicRanger', from: '' },
  mfrc522Reader: { use: 'rfidModule', from: '' },
};
