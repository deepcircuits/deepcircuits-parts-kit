/**
 * DeepCircuits Parts Kit: original part artwork generators. Every generator returns an Artwork { width, height, svg,
 * pins }. The root holds the parts, the catalog, the helpers and the colour settings; the templates, the drawing
 * primitives, the checks, the preview mount and the in-page patching have entry points of their own
 * (@deepcircuits/parts-kit/templates, /primitives, /check, /mount, /dom), and each family of parts too (/boards ...).
 */

// The parts.
export * from './families/boards.js';
export * from './families/displays.js';
export * from './families/sensors.js';
export * from './families/inputs.js';
export * from './families/outputs.js';
export * from './families/modules.js';
export * from './families/chips.js';
export * from './families/passives.js';
export * from './families/breadboards.js';
export * from './families/symbols.js';

// The catalog: every part by id, with its options.
export { CATALOG, FAMILIES, checkOptions, searchParts, loadPart } from './catalog.js';
export { drawPart, partPins } from './draw.js';

// Helpers on a drawing.
export { rotateArtwork, flipArtwork, scopeIds, toDataUrl } from './helpers.js';

// Colours and the grid.
export { PITCH, tokens, setTokenMode, tokenMode } from './core.js';
export { BREADBOARD_COLORS } from './breadboardColors.js';
export { LED_STRIP_MAX_PIXELS } from './pixels.js';

// Deprecated: the names below moved (src/deprecated.js lists where). They keep working here.
export {
  devBoardTemplate as devBoard,
  megaBoardTemplate as megaBoard,
  nanoConnectTemplate as nanoConnect,
  picoBoardTemplate as picoBoard,
  espDevKitTemplate as espDevKit,
  nucleo32BoardTemplate as nucleo32Board,
  nucleo64BoardTemplate as nucleo64Board,
  moduleTemplate as module,
  sensorModuleTemplate as sensorModule,
  comparatorBoardTemplate as comparatorBoard,
  smallSensorBoardTemplate as smallSensorBoard,
  gasModuleTemplate as gasModule,
  chipTemplate as chip,
  to92Template as to92,
} from './templates.js';
export {
  svg,
  pin,
  header,
  board,
  lens,
  indicator,
  silkMark,
  flow,
  probe,
  wire,
  trace,
  via,
  capTop,
  lotCode,
  usbPort,
  usbC,
  lensColor,
  FINISHES,
  formatOhms,
  resistorBands,
  meterLines,
  formatMilliamps,
  breadboardColor,
  breadboardPaint,
} from './primitives.js';
export { check, pinsOnPitch } from './check.js';
export { mount } from './mount.js';
export { ultrasonicRanger as ultrasonicSensor } from './sensors.js';
export { rfidModule as mfrc522Reader } from './modules.js';
