/**
 * How a person operates the parts <parts-kit-part> draws: a button presses while it is held, a knob or a slider turns
 * or slides as it is dragged, a switch flips when it is clicked, the joystick moves and springs back, the keypad's and
 * the remote's keys press, the dialer dials. Each control is keyed by the part's generator, so a preset of one (the 6 mm
 * pushbutton) works the same, and finds its way round the drawing by the hooks and data attributes the generator writes.
 *
 * A control is called with the element's context: its state (the options as drawn), set (changes options a person
 * changed), step (one change on its own, such as an arrow key), hold and release (an input held by one finger or key,
 * which the control's `held` turns into options), emit, show (options drawn for a moment, not set) and hook. The knob,
 * detent and dial geometry they work by is public, in controls.js.
 */
import { detentsTurned, dialDigitAt, dialGeometry, dialTravel, knobPosition } from './controls.js';
import { PITCH, r2 } from './core.js';

/** The drag, in drawing pixels, that pushes the joystick to the end of its travel: 9 mm. */
const JOYSTICK_FULL_DRAG = (9 * PITCH) / 2.54;
/** The dialer's wheel as a finger winds it, and as its spring runs it back: ten pulses a second, a digit's 28° each. */
const WIND_DEGREES_PER_SECOND = 720;
const RUN_DEGREES_PER_SECOND = 280;
const STOP_MS = 120;

const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const degreesOf = (dx, dy) => (Math.atan2(dy, dx) * 180) / Math.PI;
const data = (element, name) => Number(element?.getAttribute(name) ?? NaN);
const activates = event => event.key === ' ' || event.key === 'Enter';
/** The drawn element an event is on that matches `selector`, or undefined. */
const on = (event, selector) =>
  event.composedPath().find(node => node instanceof globalThis.Element && node.matches(selector));

/** A slider's state for assistive technology, 0 to 1 as a percentage. */
const sliderAria = (position, orientation) => ({
  ariaValueMin: '0',
  ariaValueMax: '100',
  ariaValueNow: String(Math.round(position * 100)),
  ariaValueText: `${Math.round(position * 100)}%`,
  ariaOrientation: orientation,
});

/** Arrow keys step a 0-to-1 position by 1%, Page Up and Page Down by 10%, Home and End go to the ends. */
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
function sliderKey(c, event) {
  const step = SLIDER_KEYS[event.key];
  if (!step) return false;
  c.step({ position: r2(clamp(step(Number(c.state().position) || 0), 0, 1)) });
  return true;
}

/** The encoder's shaft turned a detent each way, twenty to a turn. */
function turn(c, steps) {
  const detent = (((Math.round(Number(c.state().detent) || 0) + steps) % 20) + 20) % 20;
  c.set({ detent });
  c.emit('turn', { steps, detent });
}

/** The keys of a keypad or a remote, drawn as key-<row>-<column> or key-<name>, with their printed legends. */
const keysOf = c =>
  Array.from(c.hooks('[data-hook^="key-"]'), element => ({
    element,
    hook: element.getAttribute('data-hook'),
    legend: element.querySelector('text')?.textContent ?? '',
  }));

/** The IR remote's keys on a keyboard: the digits, the arrows, Space or Enter to play, + and - for the volume. */
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

/** Winds the dialer's wheel round to the stop from a digit's hole and lets it run back, then reports the digit. */
function dial(c, digit) {
  const session = c.session;
  const geometry = dialGeometry(c.hook('dial'));
  if (session.dialling || !geometry) return;
  const travel = dialTravel(geometry, digit);
  if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    c.emit('dial', { digit });
    return;
  }
  session.dialling = true;
  const wind = (travel / WIND_DEGREES_PER_SECOND) * 1000;
  const run = (travel / RUN_DEGREES_PER_SECOND) * 1000;
  const start = globalThis.performance.now();
  const frame = now => {
    const t = now - start;
    if (!c.connected() || t >= wind + STOP_MS + run) {
      session.dialling = false;
      c.show(null);
      if (c.connected()) c.emit('dial', { digit });
      return;
    }
    const angle = t < wind ? (travel * t) / wind : travel * (1 - Math.max(0, t - wind - STOP_MS) / run);
    c.show({ angle: r2(angle) });
    globalThis.requestAnimationFrame(frame);
  };
  globalThis.requestAnimationFrame(frame);
}

/**
 * The controls, by generator. Each has a role for assistive technology and `aria(state)` for its state; `drag` when
 * a pointer drags it (the page does not scroll under it). The element calls:
 * - down(c, event, point, drag): a pointer went down at `point` (drawing pixels). True keeps the pointer; `drag` is
 *   the pointer's own record, kept until it lifts. `press: 'tap'` presses on a press that does not move, so the same
 *   pointer can drag;
 * - move(c, event, point, drag): the kept pointer moved;
 * - tap(c, event, point): the pointer lifted without moving;
 * - key(c, event, source): a key went down on the focused element. True takes it; a hold under `source` is let go
 *   when the key lifts;
 * - held(tokens, state): the options the inputs held now give, each token what one finger or key holds. A token with
 *   a `key` presses that key (the press and release events name it).
 */
export const CONTROLS = {
  pushbutton: {
    role: 'button',
    aria: state => ({ ariaPressed: String(!!state.pressed) }),
    down: (c, event) => (c.hold(`pointer:${event.pointerId}`, { key: '' }), true),
    key: (c, event, source) => activates(event) && (c.hold(source, { key: '' }), true),
    held: tokens => ({ pressed: tokens.length > 0 }),
  },

  slideSwitch: {
    role: 'switch',
    aria: state => ({ ariaChecked: String(state.contact === 3) }),
    tap: c => c.step({ contact: c.state().contact === 3 ? 1 : 3 }),
    key: (c, event) => {
      const contact = activates(event) ? (c.state().contact === 3 ? 1 : 3) : { ArrowLeft: 1, ArrowRight: 3 }[event.key];
      if (contact === undefined) return false;
      if (!event.repeat) c.step({ contact });
      return true;
    },
  },

  dipSwitch: {
    role: 'group',
    tap: (c, event, point) => {
      // A lever's slot is its area, a pixel larger all round.
      const slot = Array.from(c.hooks('[data-slot]')).find(element => {
        const box = element.getBBox();
        return (
          point.x >= box.x - 1 &&
          point.x <= box.x + box.width + 1 &&
          point.y >= box.y - 1 &&
          point.y <= box.y + box.height + 1
        );
      });
      if (slot) flipLever(c, Number(slot.getAttribute('data-slot')) - 1);
    },
    key: (c, event) => {
      const index = /^[1-9]$/.test(event.key) ? Number(event.key) - 1 : -1;
      if (index < 0 || index >= c.hooks('[data-slot]').length) return false;
      if (!event.repeat) flipLever(c, index);
      return true;
    },
  },

  potentiometer: {
    role: 'slider',
    drag: true,
    aria: state => sliderAria(Number(state.position)),
    down: () => true,
    move: (c, event, point) => {
      const knob = c.hook('knob');
      const cx = data(knob, 'data-cx');
      const cy = data(knob, 'data-cy');
      if (!Number.isFinite(cx) || !Number.isFinite(cy)) return;
      c.set({ position: r2(knobPosition(point.x - cx, point.y - cy, Number(c.state().position))) });
    },
    key: sliderKey,
  },

  slidePotentiometer: {
    role: 'slider',
    drag: true,
    aria: state => sliderAria(Number(state.position), 'horizontal'),
    down: (c, event, point, drag) => ((drag.position = Number(c.state().position) || 0), true),
    move: (c, event, point, drag) => {
      const travel = data(c.hook('lever'), 'data-travel');
      if (travel > 0) c.set({ position: r2(clamp(drag.position + (point.x - drag.x) / travel, 0, 1)) });
    },
    key: sliderKey,
  },

  rotaryEncoder: {
    role: 'slider',
    drag: true,
    press: 'tap',
    aria: state => ({
      ariaValueMin: '0',
      ariaValueMax: '19',
      ariaValueNow: String(state.detent ?? 0),
      ariaValueText: `Detent ${state.detent ?? 0}${state.pressed ? ', pressed' : ''}`,
    }),
    down: (c, event, point, drag) => {
      const knob = c.hook('knob');
      drag.cx = data(knob, 'data-cx');
      drag.cy = data(knob, 'data-cy');
      drag.from = degreesOf(point.x - drag.cx, point.y - drag.cy);
      return Number.isFinite(drag.cx) && Number.isFinite(drag.cy);
    },
    move: (c, event, point, drag) => {
      const { detents, from } = detentsTurned(drag.from, degreesOf(point.x - drag.cx, point.y - drag.cy));
      drag.from = from;
      for (let k = 0; k < Math.abs(detents); k++) turn(c, Math.sign(detents));
    },
    key: (c, event, source) => {
      if (activates(event)) return (c.hold(source, { key: '' }), true);
      const steps = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[event.key];
      if (!steps) return false;
      c.step(() => turn(c, steps));
      return true;
    },
    held: tokens => ({ pressed: tokens.length > 0 }),
  },

  joystick: {
    role: 'group',
    drag: true,
    press: 'tap',
    aria: state => ({
      ariaDescription: `x ${state.x ?? 0}, y ${state.y ?? 0}${state.pressed ? ', pressed' : ''}`,
    }),
    down: () => true,
    move: (c, event, point, drag) =>
      c.hold(`pointer:${event.pointerId}`, {
        x: (point.x - drag.x) / JOYSTICK_FULL_DRAG,
        y: -(point.y - drag.y) / JOYSTICK_FULL_DRAG,
      }),
    key: (c, event, source) => {
      if (activates(event)) return (c.hold(source, { key: '' }), true);
      const share = event.shiftKey ? 0.25 : 1;
      const at = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[event.key];
      if (!at) return false;
      c.hold(source, { x: at[0] * share, y: at[1] * share });
      return true;
    },
    // Each finger and key pushes the stick; letting go of all of them centres it.
    held: tokens => {
      const sum = axis =>
        r2(
          clamp(
            tokens.reduce((total, token) => total + (token[axis] ?? 0), 0),
            -1,
            1,
          ),
        );
      return { x: sum('x'), y: sum('y'), pressed: tokens.some(token => token.key !== undefined) };
    },
  },

  keypad: {
    role: 'group',
    down: (c, event) => {
      const key = on(event, '[data-hook^="key-"]');
      return !!key && (c.hold(`pointer:${event.pointerId}`, keypadToken(key)), true);
    },
    // A legend typed on the keyboard holds its key: 0 to 9, A to D, * and #.
    key: (c, event, source) => {
      const key = keysOf(c).find(k => k.legend && k.legend.toUpperCase() === event.key.toUpperCase());
      return !!key && (c.hold(source, keypadToken(key.element)), true);
    },
    held: (tokens, state, c) => {
      const pressed = [];
      for (const key of keysOf(c)) {
        const [, row, column] = /^key-(\d+)-(\d+)$/.exec(key.hook) ?? [];
        if (row === undefined) continue;
        pressed[row - 1] ??= [];
        pressed[row - 1][column - 1] = tokens.some(token => token.hook === key.hook);
      }
      return { pressed };
    },
  },

  irRemote: {
    role: 'group',
    down: (c, event) => {
      const key = on(event, '[data-hook^="key-"]');
      return !!key && (c.hold(`pointer:${event.pointerId}`, { key: key.getAttribute('data-hook').slice(4) }), true);
    },
    key: (c, event, source) => {
      const name = /^[0-9]$/.test(event.key) ? event.key : REMOTE_KEYS[event.key];
      if (!name || !c.hook(`key-${name}`)) return false;
      c.hold(source, { key: name });
      return true;
    },
    // The remote sends one key at a time: the last one pressed.
    held: tokens => ({ pressed: tokens.length ? tokens[tokens.length - 1].key : '' }),
  },

  rotaryDialer: {
    role: 'group',
    tap: (c, event, point) => {
      const geometry = dialGeometry(c.hook('dial'));
      const digit = geometry && dialDigitAt(geometry, point.x, point.y, 1);
      if (digit !== undefined) dial(c, digit);
    },
    key: (c, event) => {
      if (!/^[0-9]$/.test(event.key)) return false;
      if (!event.repeat) dial(c, Number(event.key));
      return true;
    },
  },
};

function keypadToken(element) {
  return { key: element.querySelector('text')?.textContent ?? '', hook: element.getAttribute('data-hook') };
}

function flipLever(c, index) {
  const count = c.hooks('[data-slot]').length;
  const values = Array.from({ length: count }, (_, k) => !!(c.state().values ?? [])[k]);
  values[index] = !values[index];
  c.step({ values });
}
