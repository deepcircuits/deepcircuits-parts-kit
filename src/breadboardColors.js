/**
 * The body colours a breadboard takes (its `color`, cosmetic). White is the
 * bread-* tokens and follows the theme; the others are fixed paint, the
 * colour the user picked, each with its holes at 3:1 and its print at 4.5:1
 * on the body (checks/contrast). Its own module, with no imports, so the
 * catalog's option list can offer the colours without loading the drawing.
 */
export const BREADBOARD_PAINT = {
  red: { body: '#ef5350', edge: '#a52825', hole: '#1a0303', print: '#1a0303' },
  orange: { body: '#fb8c00', edge: '#a85d00', hole: '#2b1600', print: '#2b1600' },
  yellow: { body: '#fdd835', edge: '#b39500', hole: '#332b00', print: '#332b00' },
  green: { body: '#43a047', edge: '#2a6b2d', hole: '#0b220c', print: '#0b220c' },
  blue: { body: '#1e88e5', edge: '#145ea0', hole: '#04162a', print: '#04162a' },
  purple: { body: '#8e24aa', edge: '#5d1771', hole: '#f3e5f5', print: '#f3e5f5' },
  brown: { body: '#9c7b6f', edge: '#5d4037', hole: '#1b110d', print: '#1b110d' },
  black: { body: '#2b2b2b', edge: '#0f0f0f', hole: '#c8c8c8', print: '#d9d9d9' },
};
export const BREADBOARD_COLORS = ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown', 'black'];
/** The colour a `color` value names, in any case; anything else is white. */
export function breadboardColor(value) {
  const k = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return Object.prototype.hasOwnProperty.call(BREADBOARD_PAINT, k) ? k : 'white';
}
