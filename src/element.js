/**
 * <parts-kit-part>: a catalog part as an HTML element. Its `type` attribute is the part's catalog id and every other
 * attribute is one of its options, written as HTML writes them:
 *
 *   <parts-kit-part type="led-5-mm" color="green" on></parts-kit-part>
 *
 * The element draws the part in its shadow root and redraws it in place when an attribute changes. Lists and objects
 * (an LCD's lines, a matrix's pixels) are written as JSON, or set from code through the `options` property. Importing
 * this module in a page defines the element; definePartElement defines it under another name.
 *
 * The parts a person operates work as they do on a bench (elementControls.js): a button presses while it is held, a knob
 * turns as it is dragged, a switch flips when it is clicked, and each takes the keyboard once focused. What a person
 * changes is written back to the element's attributes, and the element fires `input` with the options that changed,
 * `change` when a press or drag ends somewhere new, `press` and `release` for buttons and keys, `turn` for the encoder
 * and `dial` for the dialer. The `static` attribute draws the part without its controls.
 */
import { checkOptions, findPart, loadPart } from './catalog.js';
import { CONTROLS } from './elementControls.js';
import { findHook, patchSvg } from './dom.js';

const kebab = key => key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
const camel = name => name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

/** The element's own attributes, and the ones every HTML element takes: none of them is an option. */
const OWN = new Set(['type', 'scale', 'options', 'static']);
const GLOBAL = new Set([
  'id',
  'class',
  'style',
  'title',
  'lang',
  'dir',
  'hidden',
  'slot',
  'tabindex',
  'role',
  'part',
  'exportparts',
  'is',
  'inert',
  'draggable',
  'spellcheck',
  'translate',
  'contenteditable',
  'autofocus',
  'autocapitalize',
  'accesskey',
  'nonce',
  'popover',
  'enterkeyhint',
  'inputmode',
  'itemid',
  'itemprop',
  'itemref',
  'itemscope',
  'itemtype',
]);
const isGlobal = name =>
  OWN.has(name) ||
  GLOBAL.has(name) ||
  name.startsWith('aria-') ||
  name.startsWith('data-') ||
  name.startsWith('xml') ||
  (name.startsWith('on') && name.length > 2);

/** Each option's name as an attribute can spell it: as written in HTML (lowercase), or in kebab case. */
function namesOf(specs) {
  const names = new Map();
  for (const key of Object.keys(specs)) {
    names.set(key.toLowerCase(), key);
    names.set(kebab(key), key);
  }
  return names;
}

function number(value) {
  const n = Number(value);
  return value.trim() !== '' && Number.isFinite(n) ? n : value;
}
function json(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

/** An attribute's text as the value an option takes. Text that does not fit is passed on as it is, so drawPart says what is wrong. */
function valueOf(spec, value) {
  switch (spec.type) {
    case 'boolean':
      return value !== 'false';
    case 'level':
      return value === '' || value === 'true' ? true : value === 'false' ? false : number(value);
    case 'number':
    case 'integer':
      return number(value);
    case 'enum': {
      // An empty attribute (live-flow) picks the choice that is true.
      const choice =
        spec.choices.find(c => String(c.value) === value) ??
        (value === '' ? spec.choices.find(c => c.value === true) : undefined);
      return choice ? choice.value : value;
    }
    case 'text':
    case 'color':
      return value;
    case 'pixel':
      return value.startsWith('{') || value === 'null' ? json(value) : value;
    default:
      return json(value);
  }
}

const pairsOf = attributes =>
  typeof attributes[Symbol.iterator] === 'function'
    ? Array.from(attributes, a => (Array.isArray(a) ? a : [a.name, a.value]))
    : Object.entries(attributes);

/**
 * The options that attributes give part `id`, as <parts-kit-part> reads them: an attribute names an option in
 * lowercase or kebab case (pixel-size), a field of an object option after the option (live-flow), and its text becomes
 * the option's type (on and on="" are true, lists and objects are JSON). The element's own attributes and the ones
 * every HTML element takes are left out; any other name is passed on, so drawPart names the option it is nearest to.
 */
export function optionsFromAttributes(id, attributes) {
  const entry = findPart(id);
  if (!entry) throw new Error(checkOptions(id)[0]);
  const named = namesOf(entry.options);
  const options = {};
  for (const [attribute, value] of pairsOf(attributes)) {
    const name = attribute.toLowerCase();
    const key = named.get(name);
    if (key !== undefined) {
      const parsed = valueOf(entry.options[key], value);
      // An object option can come whole as JSON and field by field too; the two merge.
      options[key] = isObject(parsed) && isObject(options[key]) ? { ...options[key], ...parsed } : parsed;
      continue;
    }
    const dash = name.indexOf('-');
    const head = dash > 0 ? named.get(name.slice(0, dash)) : undefined;
    const spec = head === undefined ? undefined : entry.options[head];
    if (spec?.type === 'object') {
      const rest = name.slice(dash + 1);
      const field = namesOf(spec.fields).get(rest);
      const fields = isObject(options[head]) ? options[head] : {};
      options[head] = { ...fields, [field ?? camel(rest)]: field ? valueOf(spec.fields[field], value) : value };
      continue;
    }
    if (isGlobal(name)) continue;
    options[camel(name)] = value;
  }
  return options;
}

/** The drawing's markup at `scale` times its size: the root's width and height, which its viewBox follows. */
const scaled = (svg, scale) =>
  scale === 1
    ? svg
    : svg.replace(/^<svg\b[^>]*>/, tag =>
        tag.replace(/ (width|height)="([\d.]+)"/g, (_, name, value) => ` ${name}="${+(value * scale).toFixed(2)}"`),
      );

const STYLE = `:host{display:inline-block;line-height:0;vertical-align:middle}:host([hidden]){display:none}
[part=drawing]{display:block}svg{display:block;max-width:100%;height:auto}
[data-control]{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}
[data-control=press]{cursor:pointer;touch-action:manipulation}[data-control=drag]{cursor:grab;touch-action:none}
[part=error]{display:inline-block;max-width:24em;padding:4px 8px;border:1px solid #d92d20;border-radius:4px;
font:12px/1.4 system-ui,sans-serif;color:#b42318;background:#fff;white-space:normal}`;

/** How far a pointer moves, in CSS pixels, before a press is a drag; how long a still press waits before it holds. */
const SLOP = 4;
const HOLD_MS = 250;
/** How long a click presses a button that a drag also works (the encoder's shaft, the joystick's select). */
const PULSE_MS = 120;
/** The states a control reports to assistive technology, as ElementInternals names them. */
const ARIA = [
  'ariaPressed',
  'ariaChecked',
  'ariaValueMin',
  'ariaValueMax',
  'ariaValueNow',
  'ariaValueText',
  'ariaOrientation',
  'ariaDescription',
];

/** Nothing held: false, an empty text, or a list of nothing held, which is the same as no value at all. */
const blank = value =>
  value === undefined ||
  value === null ||
  value === false ||
  value === '' ||
  (Array.isArray(value) && value.every(blank));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b) || (blank(a) && blank(b));

/**
 * Defines the part element as `name` (parts-kit-part by default) and returns its class. A name that is already defined
 * keeps its class. Needs a page: custom elements do not exist in Node or a worker.
 */
export function definePartElement(name = 'parts-kit-part') {
  const registry = globalThis.customElements;
  if (!registry) throw new Error('definePartElement needs a page: this environment has no custom elements.');
  const defined = registry.get(name);
  if (defined) return defined;

  class PartElement extends globalThis.HTMLElement {
    #drawing;
    #observer;
    #options = {};
    #artwork = null;
    #error = null;
    #queued = false;
    #ticket = 0;
    // The part's catalog entry and its control (elementControls.js), once drawn; null for a part a person does not operate.
    #entry = null;
    #control = null;
    #internals = null;
    #context;
    // The control's own memory (a dial running back), from when it was bound.
    #session = {};
    // What each finger and key holds now (pointer:<id>, key:<code>), the keys pressed, and each pointer down.
    #holds = new Map();
    #pressed = new Set();
    #pointers = new Map();
    #pulses = 0;
    // The sources of the press or drag going on, and the state when it began, for `change`.
    #gesture = new Set();
    #before = {};
    // Options drawn for a moment and never set: the dialer's wheel as it turns.
    #transient = null;
    // Whether the element gave itself its tabindex.
    #tabindex = false;
    #leave = () => this.#letGo('');
    #hide = () => globalThis.document?.hidden && this.#letGo('');

    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${STYLE}</style><span part="drawing"></span>`;
      this.#drawing = root.lastElementChild;
      // Redraw for the attributes that draw the part, not for a class or a data- attribute the page sets.
      this.#observer = new globalThis.MutationObserver(records => {
        if (records.some(r => OWN.has(r.attributeName) || !isGlobal(r.attributeName))) this.#schedule();
      });
      try {
        this.#internals = this.attachInternals();
      } catch {
        this.#internals = null;
      }
      const element = this;
      this.#context = {
        get session() {
          return element.#session;
        },
        state: () => this.#state(),
        set: patch => this.#set(patch),
        step: change => {
          this.#begin('step');
          if (typeof change === 'function') change();
          else this.#set(change);
          this.#end('step');
        },
        hold: (source, token) => this.#hold(source, token),
        emit: (type, detail) => this.#emit(type, detail),
        show: options => {
          this.#transient = options;
          this.#schedule();
        },
        hook: name => this.hook(name),
        hooks: selector => this.#drawing.querySelectorAll(selector),
        connected: () => this.isConnected,
      };
      this.addEventListener('pointerdown', event => this.#pointerDown(event));
      this.addEventListener('pointermove', event => this.#pointerMove(event));
      for (const type of ['pointerup', 'pointercancel', 'lostpointercapture'])
        this.addEventListener(type, event => this.#pointerUp(event));
      this.addEventListener('keydown', event => this.#keyDown(event));
      this.addEventListener('keyup', event => this.#release(`key:${event.code || event.key}`));
      this.addEventListener('blur', () => this.#letGo('key:'));
      // A long press on a touch screen holds a button; it opens no menu.
      this.addEventListener('contextmenu', event => this.#pointers.size && event.preventDefault());
    }

    connectedCallback() {
      // A property set before the element was defined sits on the instance; hand it to the setter.
      for (const key of ['type', 'options'])
        if (Object.prototype.hasOwnProperty.call(this, key)) {
          const value = this[key];
          delete this[key];
          this[key] = value;
        }
      this.#observer.observe(this, { attributes: true });
      globalThis.addEventListener?.('blur', this.#leave);
      globalThis.document?.addEventListener('visibilitychange', this.#hide);
      this.#schedule();
    }

    disconnectedCallback() {
      this.#observer.disconnect();
      globalThis.removeEventListener?.('blur', this.#leave);
      globalThis.document?.removeEventListener('visibilitychange', this.#hide);
      this.#letGo('');
    }

    /** The catalog id of the part it draws: its `type` attribute. */
    get type() {
      return this.getAttribute('type') ?? '';
    }
    set type(id) {
      this.setAttribute('type', id);
    }

    /** Options set from code, over the ones the attributes give: lists and objects, such as an LCD's lines. */
    get options() {
      return { ...this.#options };
    }
    set options(options) {
      this.#options = { ...(options ?? {}) };
      this.#schedule();
    }

    /** The last drawing, before `scale`; null before the first and after an error. */
    get artwork() {
      return this.#artwork;
    }

    /** The part's pins, in the drawing's pixels before `scale`. */
    get pins() {
      return this.#artwork ? this.#artwork.pins : [];
    }

    /** Why the last drawing failed, or null. */
    get error() {
      return this.#error;
    }

    /** A drawn element by its data-hook (lens, knob, lever-3), or null. */
    hook(name) {
      return findHook(this.#drawing, name);
    }

    #schedule() {
      if (this.#queued) return;
      this.#queued = true;
      globalThis.queueMicrotask(() => {
        this.#queued = false;
        this.#draw();
      });
    }

    async #draw() {
      const ticket = ++this.#ticket;
      try {
        const type = this.getAttribute('type');
        if (!type) throw new Error('Give it a catalog part id as its type, as in type="led-5-mm".');
        const scale = Number(this.getAttribute('scale') ?? 1);
        if (!(scale > 0)) throw new Error(`scale must be a number above 0, not "${this.getAttribute('scale')}".`);
        const draw = await loadPart(type);
        if (ticket !== this.#ticket) return;
        const art = draw({ ...optionsFromAttributes(type, this.attributes), ...this.#options, ...this.#transient });
        patchSvg(this.#drawing, scaled(art.svg, scale));
        this.#artwork = art;
        this.#error = null;
        this.#bind(findPart(type));
        this.dispatchEvent(new globalThis.CustomEvent('draw', { detail: { artwork: art } }));
      } catch (error) {
        if (ticket !== this.#ticket) return;
        this.#artwork = null;
        this.#error = error.message;
        this.#bind(null);
        const box = this.ownerDocument.createElement('span');
        box.setAttribute('part', 'error');
        box.textContent = error.message;
        this.#drawing.replaceChildren(box);
        console.error(`<${this.localName}>: ${error.message}`);
      }
    }

    /** Takes the part's control when its part changes, and tells assistive technology its state. */
    #bind(entry) {
      const control = (entry && !this.hasAttribute('static') && CONTROLS[entry.fn]) || null;
      if (entry !== this.#entry || control !== this.#control) {
        // Whatever was held belonged to the part before.
        for (const drag of this.#pointers.values()) globalThis.clearTimeout(drag.timer);
        this.#pointers.clear();
        this.#holds.clear();
        this.#pressed.clear();
        this.#gesture.clear();
        this.#session = {};
        this.#transient = null;
        this.#entry = entry;
        this.#control = control;
        if (control && !this.hasAttribute('tabindex')) {
          this.setAttribute('tabindex', '0');
          this.#tabindex = true;
        } else if (!control && this.#tabindex) {
          this.removeAttribute('tabindex');
          this.#tabindex = false;
        }
        if (control) this.#drawing.setAttribute('data-control', control.drag ? 'drag' : 'press');
        else this.#drawing.removeAttribute('data-control');
      }
      const internals = this.#internals;
      if (!internals) return;
      const aria = control?.aria?.(this.#state()) ?? {};
      internals.role = control ? control.role : null;
      internals.ariaLabel = control ? entry.name : null;
      for (const name of ARIA) internals[name] = aria[name] ?? null;
    }

    /** The options the part is drawn with: its preset and defaults, the attributes, the `options` property. */
    #state() {
      const entry = this.#entry;
      if (!entry) return {};
      const defaults = {};
      for (const [key, spec] of Object.entries(entry.options))
        if (spec.default !== undefined) defaults[key] = spec.default;
      return { ...entry.preset, ...defaults, ...optionsFromAttributes(entry.id, this.attributes), ...this.#options };
    }

    /** Changes options a person changed: writes them where they came from and fires `input` with the ones that differ. */
    #set(patch) {
      const state = this.#state();
      const changed = {};
      for (const [key, value] of Object.entries(patch)) if (!same(state[key], value)) changed[key] = value;
      if (!Object.keys(changed).length) return;
      const named = namesOf(this.#entry.options);
      let redraw = false;
      for (const [key, value] of Object.entries(changed)) {
        if (Object.prototype.hasOwnProperty.call(this.#options, key)) {
          this.#options[key] = value;
          redraw = true;
          continue;
        }
        const spec = this.#entry.options[key];
        const name =
          Array.from(this.attributes, a => a.name).find(n => named.get(n.toLowerCase()) === key) ?? kebab(key);
        // A part back at rest (a button let go, a joystick centred) writes no attribute for it.
        if (spec && same(value, spec.default)) this.removeAttribute(name);
        else if (value === true && spec?.type === 'boolean') this.setAttribute(name, '');
        else this.setAttribute(name, typeof value === 'object' ? JSON.stringify(value) : String(value));
      }
      if (redraw) this.#schedule();
      this.#emit('input', changed);
    }

    #emit(type, detail) {
      this.dispatchEvent(new globalThis.CustomEvent(type, { detail, bubbles: true, composed: true }));
    }

    /** A press, drag or held key begins; the first remembers the state, for `change`. */
    #begin(source) {
      if (!this.#gesture.size) this.#before = this.#state();
      this.#gesture.add(source);
    }

    /** A press, drag or held key ends; the last fires `change` with the options that differ from when they began. */
    #end(source) {
      if (!this.#gesture.delete(source) || this.#gesture.size) return;
      const after = this.#state();
      const changed = {};
      for (const [key, value] of Object.entries(after)) if (!same(this.#before[key], value)) changed[key] = value;
      if (Object.keys(changed).length) this.#emit('change', changed);
    }

    #hold(source, token) {
      this.#begin(source);
      this.#holds.set(source, token);
      this.#settle();
    }

    #release(source) {
      if (this.#holds.delete(source)) this.#settle();
      this.#end(source);
    }

    /** Lets go of every hold whose source starts with `prefix`, and of every pointer when it is empty. */
    #letGo(prefix) {
      const sources = [...this.#holds.keys()].filter(source => source.startsWith(prefix));
      if (!prefix)
        for (const [id, drag] of this.#pointers) {
          globalThis.clearTimeout(drag.timer);
          sources.push(`pointer:${id}`);
        }
      if (!prefix) this.#pointers.clear();
      let held = false;
      for (const source of sources) held = this.#holds.delete(source) || held;
      if (held) this.#settle();
      for (const source of sources) this.#end(source);
    }

    /** Sets what the holds now give, and fires `press` and `release` for the keys that went down or came up. */
    #settle() {
      const control = this.#control;
      if (!control?.held) return;
      const tokens = [...this.#holds.values()];
      this.#set(control.held(tokens, this.#state(), this.#context));
      const keys = new Set(tokens.filter(token => token.key !== undefined).map(token => token.key));
      for (const key of keys) if (!this.#pressed.has(key)) this.#emit('press', key ? { key } : {});
      for (const key of this.#pressed) if (!keys.has(key)) this.#emit('release', key ? { key } : {});
      this.#pressed = keys;
    }

    /** A client point in the drawing's own pixels, whatever its scale. */
    #point(event) {
      const matrix = this.#drawing.querySelector('svg')?.getScreenCTM();
      return matrix
        ? new globalThis.DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse())
        : undefined;
    }

    #pointerDown(event) {
      const control = this.#control;
      if (!control || (event.pointerType === 'mouse' && event.button !== 0) || this.#pointers.has(event.pointerId))
        return;
      const point = this.#point(event);
      if (!point) return;
      const source = `pointer:${event.pointerId}`;
      const drag = { x: point.x, y: point.y, clientX: event.clientX, clientY: event.clientY, moved: false };
      this.#begin(source);
      if (!control.down?.(this.#context, event, point, drag) && !control.tap) {
        this.#end(source);
        return;
      }
      // The press focuses the element as any click does, so the keys work next and a mouse shows no focus ring.
      this.#pointers.set(event.pointerId, drag);
      try {
        this.setPointerCapture(event.pointerId);
      } catch {
        // The pointer may already be gone.
      }
      // A control a drag also works presses only on a still press: held once it has waited, briefly on a click.
      if (control.press === 'tap') {
        drag.pending = true;
        drag.timer = globalThis.setTimeout(() => {
          drag.pending = false;
          drag.pressing = true;
          this.#hold(source, { key: '' });
        }, HOLD_MS);
      }
    }

    #pointerMove(event) {
      const drag = this.#pointers.get(event.pointerId);
      if (!drag) return;
      if (!drag.moved && Math.hypot(event.clientX - drag.clientX, event.clientY - drag.clientY) > SLOP) {
        drag.moved = true;
        if (drag.pending) {
          drag.pending = false;
          globalThis.clearTimeout(drag.timer);
        }
      }
      const point = drag.moved && !drag.pressing && this.#point(event);
      if (point) this.#control?.move?.(this.#context, event, point, drag);
    }

    #pointerUp(event) {
      const drag = this.#pointers.get(event.pointerId);
      if (!drag) return;
      this.#pointers.delete(event.pointerId);
      globalThis.clearTimeout(drag.timer);
      const source = `pointer:${event.pointerId}`;
      if (event.type === 'pointerup' && !drag.moved) {
        if (drag.pending) {
          const pulse = `pulse:${++this.#pulses}`;
          this.#hold(pulse, { key: '' });
          globalThis.setTimeout(() => this.#release(pulse), PULSE_MS);
        }
        const point = this.#point(event);
        if (point) this.#control?.tap?.(this.#context, event, point);
      }
      this.#release(source);
    }

    #keyDown(event) {
      const control = this.#control;
      if (!control?.key || event.ctrlKey || event.metaKey || event.altKey) return;
      if (control.key(this.#context, event, `key:${event.code || event.key}`)) event.preventDefault();
    }
  }

  registry.define(name, PartElement);
  return PartElement;
}

// In a page, importing the module defines <parts-kit-part>.
if (globalThis.customElements && !globalThis.customElements.get('parts-kit-part')) definePartElement();
