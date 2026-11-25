/**
 * The geometry and key maps the input parts are operated by, for a host that handles the pointer itself: potentiometers
 * (rotary and slide), the rotary encoder, the joystick, the 4×4 keypad, the DIP switch, the IR remote and the rotary
 * dialer. <parts-kit-part> works by the same functions (elementControls.js). Points are in the drawing's pixels and
 * angles in degrees from +x towards +y, clockwise on screen.
 */

/** One rotary encoder detent: twenty to a turn. */
const DETENT_DEGREES = 18;
/** The drag, in drawing pixels, that pushes the joystick to the end of its travel: 9 mm at 9.6 px / 2.54 mm. */
export const JOYSTICK_FULL_DRAG = (9 * 9.6) / 2.54;

/** The 16 keys of the default 4×4 membrane keypad, row by row from top left. */
export const KEYPAD_KEYS = Object.freeze([
  '1',
  '2',
  '3',
  'A',
  '4',
  '5',
  '6',
  'B',
  '7',
  '8',
  '9',
  'C',
  '*',
  '0',
  '#',
  'D',
]);

const SLIDER_KEYS = {
  ArrowRight: position => position + 0.01,
  ArrowUp: position => position + 0.01,
  ArrowLeft: position => position - 0.01,
  ArrowDown: position => position - 0.01,
  PageUp: position => position + 0.1,
  PageDown: position => position - 0.1,
  Home: () => 0,
  End: () => 1,
};

const REMOTE_KEYS = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'prev',
  ArrowRight: 'next',
  ' ': 'play',
  Enter: 'play',
  '+': 'vol-up',
  '=': 'vol-up',
  '-': 'vol-down',
};

const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const r2 = n => Math.round(n * 100) / 100;
const data = (element, name) => Number(element?.getAttribute(name) ?? NaN);

/** The degrees from a to b, the short way round: -180 to 180. */
export function angleBetween(a, b) {
  return ((((b - a) % 360) + 540) % 360) - 180;
}

/**
 * The position, 0 to 1, a point at (dx, dy) from a knob's centre gives a knob that turns clockwise from -135° to 135°
 * of straight up. In the gap below the knob a knob near an end keeps that end, so a sweep past the end never jumps
 * across; from further in, the side the point is on picks the end.
 */
export function knobPosition(dx, dy, previous) {
  if (Math.hypot(dx, dy) < 1e-6) return previous;
  const angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
  if (angle >= -135 && angle <= 135) return (angle + 135) / 270;
  if (previous >= 0.75) return 1;
  if (previous <= 0.25) return 0;
  return dx < 0 ? 0 : dx > 0 ? 1 : previous >= 0.5 ? 1 : 0;
}

/**
 * The position, 0 to 1, of a slide potentiometer dragged by `delta` drawing pixels from `startPosition` over `travel`
 * (the `lever` hook's `data-travel`). Rounded to whole percent; undefined when `travel` is not positive.
 */
export function slidePosition(startPosition, delta, travel) {
  if (!(travel > 0) || !Number.isFinite(startPosition) || !Number.isFinite(delta)) return undefined;
  return r2(clamp(startPosition + delta / travel, 0, 1));
}

/**
 * The next 0-to-1 position for a keyboard `key` on a rotary or slide potentiometer (arrows step 1%, Page Up/Down 10%,
 * Home and End go to 0 and 1), or undefined for any other key.
 */
export function sliderKeyStep(key, position) {
  const step = SLIDER_KEYS[key];
  if (!step) return undefined;
  return r2(clamp(step(Number(position) || 0), 0, 1));
}

/**
 * The encoder detents a drag round the knob has passed since angle `from` (positive clockwise), and the angle the next
 * count starts from, so a slow drag still turns one detent at a time.
 */
export function detentsTurned(from, to) {
  const detents = Math.trunc(angleBetween(from, to) / DETENT_DEGREES);
  return { detents, from: from + detents * DETENT_DEGREES };
}

/**
 * The joystick's (x, y) in -1 to 1 (positive is right and up) for a pointer drag of (dx, dy) drawing pixels, over
 * `fullDrag` (9 mm by default).
 */
export function joystickPosition(dx, dy, fullDrag = JOYSTICK_FULL_DRAG) {
  if (!(fullDrag > 0)) return { x: 0, y: 0 };
  return {
    x: r2(clamp(dx / fullDrag, -1, 1)),
    y: r2(clamp(-dy / fullDrag, -1, 1)),
  };
}

/**
 * The joystick's geometry from its `stick` hook (`data-cx`, `data-cy`, `data-travel`, `data-x`, `data-y`): rest centre,
 * travel, current normalised offset, and current cap centre `(cx, cy)` in drawing pixels, or undefined when absent.
 */
export function joystickGeometry(stick) {
  if (!stick) return undefined;
  const restX = data(stick, 'data-cx');
  const restY = data(stick, 'data-cy');
  const travel = data(stick, 'data-travel');
  const x = data(stick, 'data-x');
  const y = data(stick, 'data-y');
  if (![restX, restY, travel, x, y].every(Number.isFinite)) return undefined;
  return { restX, restY, travel, x, y, cx: r2(restX + x * travel), cy: r2(restY - y * travel) };
}

/** The default 4×4 keypad key (`1`..`9`, `0`, `A`..`D`, `*`, `#`) for a `key-<row>-<column>` hook, or undefined. */
export function keypadKeyOf(hook) {
  const match = /^key-([1-4])-([1-4])$/.exec(hook ?? '');
  return match ? KEYPAD_KEYS[(Number(match[1]) - 1) * 4 + (Number(match[2]) - 1)] : undefined;
}

/** The `key-<row>-<column>` hook for a default 4×4 keypad key, or undefined. */
export function keypadHookOf(key) {
  const index = KEYPAD_KEYS.indexOf(String(key ?? ''));
  return index < 0 ? undefined : `key-${Math.floor(index / 4) + 1}-${(index % 4) + 1}`;
}

/** The 0-based lever index of a DIP switch hook (`lever-1` -> 0), or undefined. */
export function dipLeverIndex(hook) {
  const match = /^lever-([1-9]\d*)$/.exec(hook ?? '');
  return match ? Number(match[1]) - 1 : undefined;
}

/** The 21-key IR remote's key name (`0`..`9`, `up`, `down`, `prev`, `next`, `play`, `vol-up`, `vol-down`) for a keyboard key, or undefined. */
export function remoteKeyForKeyboard(key) {
  if (typeof key !== 'string') return undefined;
  return /^[0-9]$/.test(key) ? key : REMOTE_KEYS[key];
}

/** The geometry the rotary dialer writes on its wheel (`dial`): centre, hole ring, holes for 1 to 9 then 0, stop. */
export function dialGeometry(dial) {
  if (!dial) return undefined;
  const holes = (dial.getAttribute('data-hole-angles') ?? '').trim().split(/\s+/).map(Number);
  const geometry = {
    cx: data(dial, 'data-cx'),
    cy: data(dial, 'data-cy'),
    ring: data(dial, 'data-ring'),
    holeRadius: data(dial, 'data-hole-radius'),
    stop: data(dial, 'data-stop'),
    angle: data(dial, 'data-angle') || 0,
    holes,
  };
  const numbers = [geometry.cx, geometry.cy, geometry.ring, geometry.holeRadius, geometry.stop, ...holes];
  return holes.length === 10 && numbers.every(Number.isFinite) ? geometry : undefined;
}

/** The digit whose finger hole holds a drawing point, allowing `reach` past its edge, or undefined. */
export function dialDigitAt(geometry, x, y, reach = 0) {
  let digit;
  let nearest = Infinity;
  geometry.holes.forEach((degrees, index) => {
    const radians = ((degrees + geometry.angle) * Math.PI) / 180;
    const distance = Math.hypot(
      x - (geometry.cx + Math.cos(radians) * geometry.ring),
      y - (geometry.cy + Math.sin(radians) * geometry.ring),
    );
    if (distance <= geometry.holeRadius + reach && distance < nearest) {
      nearest = distance;
      digit = (index + 1) % 10;
    }
  });
  return digit;
}

/** How far the wheel turns, clockwise, to bring a digit's hole to the finger stop. */
export function dialTravel(geometry, digit) {
  const at = geometry.holes[(digit + 9) % 10];
  return (((geometry.stop - at) % 360) + 360) % 360;
}
