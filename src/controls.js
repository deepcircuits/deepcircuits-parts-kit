/**
 * The geometry the input parts are operated by, for a host that handles the pointer itself: where a point round the
 * potentiometer's knob turns it, how many of the rotary encoder's detents a drag round its knob has passed, and which
 * of the rotary dialer's finger holes a point is in and how far the wheel winds from it. <parts-kit-part> works by the
 * same functions (elementControls.js). Points are in the drawing's pixels and angles in degrees from +x towards +y,
 * clockwise on screen; the `knob` hook carries its centre in data-cx and data-cy, and the `dial` hook its geometry.
 */

/** One rotary encoder detent: twenty to a turn. */
const DETENT_DEGREES = 18;

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
 * The encoder detents a drag round the knob has passed since angle `from` (positive clockwise), and the angle the next
 * count starts from, so a slow drag still turns one detent at a time.
 */
export function detentsTurned(from, to) {
  const detents = Math.trunc(angleBetween(from, to) / DETENT_DEGREES);
  return { detents, from: from + detents * DETENT_DEGREES };
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
