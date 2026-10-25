/** drawPart and partPins: any catalog part by id, with every family loaded. */
import { callOf } from './catalog.js';
import * as boards from './families/boards.js';
import * as displays from './families/displays.js';
import * as sensors from './families/sensors.js';
import * as inputs from './families/inputs.js';
import * as outputs from './families/outputs.js';
import * as modules from './families/modules.js';
import * as chips from './families/chips.js';
import * as passives from './families/passives.js';
import * as breadboards from './families/breadboards.js';
import * as symbols from './families/symbols.js';

const DRAW = {
  ...boards,
  ...displays,
  ...sensors,
  ...inputs,
  ...outputs,
  ...modules,
  ...chips,
  ...passives,
  ...breadboards,
  ...symbols,
};

/** Draws catalog part `id` with `options`, the ones its entry lists. Throws for an unknown id, an unknown option (naming the nearest) or a value of the wrong type. */
export function drawPart(id, options) {
  const { entry, props } = callOf(id, options);
  return DRAW[entry.fn](props);
}

const PINS = new Map();
/** A catalog part's size and pins, without its SVG. The part is drawn once for each set of options, and the result kept. */
export function partPins(id, options) {
  const key = `${id} ${JSON.stringify(options || {})}`;
  let found = PINS.get(key);
  if (!found) {
    const art = drawPart(id, options);
    found = Object.freeze({
      width: art.width,
      height: art.height,
      pins: Object.freeze(art.pins.map(p => Object.freeze({ ...p }))),
    });
    if (PINS.size >= 500) PINS.delete(PINS.keys().next().value);
    PINS.set(key, found);
  }
  return found;
}
