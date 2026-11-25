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
export { CATALOG, FAMILIES, FAMILY_TITLES, checkOptions, searchParts, loadPart } from './catalog.js';
export { drawPart, partPins } from './draw.js';

// Helpers on a drawing.
export { rotateArtwork, flipArtwork, scopeIds, toDataUrl, hookRect, lcdLattice, matrixLayout } from './helpers.js';

// Colours and the grid.
export { PITCH, tokens, setTokenMode, tokenMode, withTokenMode } from './core.js';
export { BREADBOARD_COLORS } from './breadboardColors.js';
export { LED_STRIP_MAX_PIXELS } from './pixels.js';
