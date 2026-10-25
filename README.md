<div align="center">

<img src="project/assets/hero.svg" alt="Parts drawn by the kit: an Uno-class board, a character LCD, LEDs, a servo, an ESP32 board, an LED ring, an OLED, an RGB LED, an ultrasonic ranger and a clock display" width="100%">

# DeepCircuits Parts Kit

**Original electronic part artwork, drawn by code.**

Boards, chips, sensors, displays and modules as SVG generators: every part at true size on the 0.1-inch grid, with its pins and its live state.

[![MIT licence](https://img.shields.io/badge/licence-MIT-0f766e)](LICENSE)
[![Types included](https://img.shields.io/badge/types-included-3178c6)](src/index.d.ts)
[![No dependencies](https://img.shields.io/badge/dependencies-none-16a34a)](package.json)

[**Gallery**](https://deepcircuits.github.io/deepcircuits-parts-kit/) · [Catalog](#the-catalog) · [API](#api) · [Brand book](project/README.md) · [Contributing](CONTRIBUTING.md)

</div>

---

The Parts Kit is the artwork of [DeepCircuits](https://deepcircuits.io), the circuit simulator, published on its own so any editor, simulator, tutorial or diagram can use it. You call a function and get back an SVG and the positions of the part's pins.

- **True size, on the grid.** Each part is drawn at its real dimensions, and every pin sits a whole number of 0.1-inch pitches from the first (9.6 px at 96 dpi). Parts line up on a breadboard and wires snap to their legs.
- **Live state.** LEDs light, screens show text and pictures, servos turn, buttons press. State is an option of the call, and the SVG carries hooks for changing it in place.
- **Typed options.** Every part's options are data, with their types, ranges and defaults, and TypeScript types are generated from them: a typo such as `angel` fails to compile, and at run time the error names the option you meant.
- **Themes.** Colours come from design tokens with light and dark values. One mode writes them as CSS custom properties, so a drawing follows your theme.
- **No framework, no dependencies.** Plain functions that return strings. They run in any framework, in Node, in a worker or on a server, and need no DOM.
- **Checked on every build.** Nothing overlaps, print stays readable, every option changes the drawing, and pins, legs and line widths meet the published conventions for breadboard part graphics.
- **Original and MIT licensed.** The code and the artwork it draws are MIT. Nothing is copied from other part libraries, and boards carry no logos.

## Install

The kit is not published to npm. Install it from its GitHub repository:

```bash
npm install github:deepcircuits/deepcircuits-parts-kit
```

The repository holds the built files, so there is no build step. With no bundler at all, load the classic script from jsDelivr, which serves it from the repository. It defines `window.PartsKit` and the `<parts-kit-part>` element:

```html
<script src="https://cdn.jsdelivr.net/gh/deepcircuits/deepcircuits-parts-kit@main/project/components/bundle.js"></script>
```

## Three ways to use it

| You want | Use |
| --- | --- |
| A picture of a part, for a document, a slide or a design tool | The [picture files](#pictures): every part as an SVG, in its common states |
| Parts on a web page, without writing code | The [`<parts-kit-part>` element](#on-a-page-parts-kit-part) |
| Parts in an editor, a simulator or a build step | [`drawPart`](#in-code-drawpart), which returns the SVG and the position of every pin |

### Pictures

[`images/`](images/) has every catalog part as an SVG file: at rest, in each of its states (lit, pressed, energised), with its example content, and in each colour it comes in. Its [README](images/README.md) shows them all, and [`manifest.json`](images/manifest.json) lists each part's size, pins and pictures. Copy the files you need, or link to one from jsDelivr:

```html
<img src="https://cdn.jsdelivr.net/gh/deepcircuits/deepcircuits-parts-kit@main/images/led-5-mm--green--on.svg" width="62" alt="A lit green LED">
```

Each picture is drawn at its true size, 0.1 inch to 9.6 pixels, so set a width to show a small part larger.

### On a page: `<parts-kit-part>`

```html
<script src="https://cdn.jsdelivr.net/gh/deepcircuits/deepcircuits-parts-kit@main/project/components/bundle.js"></script>

<parts-kit-part type="led-5-mm" color="green" on></parts-kit-part>
<parts-kit-part type="servo" angle="45" scale="2"></parts-kit-part>
<parts-kit-part type="character-lcd-16x2" lines='["Hello, world", "DeepCircuits"]'></parts-kit-part>
```

`type` is the part's catalog id, and every other attribute is one of its options. Change an attribute and the part redraws in place. The parts a person operates work as they do on a bench: a button presses while it is held, a knob turns as it is dragged, a switch flips when it is clicked, and each takes the keyboard once focused. A misspelt option shows its error where the part would be: `servo has no option "angel"; did you mean "angle"?`. With a bundler, `import '@deepcircuits/parts-kit/element'` defines the element, and each part's family loads the first time one of its parts is drawn. [The part element](#the-part-element) has the details.

### In code: `drawPart`

```js
import { drawPart } from '@deepcircuits/parts-kit';

// Any part in the catalog, by id, with its options.
const lcd = drawPart('character-lcd-16x2', { lines: ['Hello, world', 'DeepCircuits'] });
container.innerHTML = lcd.svg;
lcd.pins; // [{ name: 'VSS', x: 30.24, y: 9.45 }, { name: 'VDD', … }, …]

drawPart('servo', { angel: 30 });
// TypeScript: 'angel' does not exist in type '{ angle?: number }'. Did you mean to write 'angle'?
// JavaScript: Error: servo has no option "angel"; did you mean "angle"? Its options are angle.
```

Each part also has a generator of its own, which takes the same options and the ones its preset fixes:

```js
import { led, resistor } from '@deepcircuits/parts-kit';

const red = led({ color: 'red', on: true, brightness: 0.6 });
const r = resistor({ ohms: 4700 }); // the bands are worked out from the resistance
```

In React, the drawing is a string of trusted SVG; any text you pass in (a caption, a label, an LCD line) is escaped before it is drawn.

```jsx
import { useMemo } from 'react';
import { drawPart } from '@deepcircuits/parts-kit';

export function Part({ id, options }) {
  const art = useMemo(() => drawPart(id, options), [id, options]);
  return <span dangerouslySetInnerHTML={{ __html: art.svg }} />;
}
```

On a plain page:

```html
<div id="bench"></div>
<script src="https://cdn.jsdelivr.net/gh/deepcircuits/deepcircuits-parts-kit@main/project/components/bundle.js"></script>
<script>
  document.getElementById('bench').innerHTML = PartsKit.drawPart('servo', { angle: 45 }).svg;
</script>
```

## Recipes

### With the pictures

#### Put a part in a document

Markdown, a wiki or a slide takes the files as they are, and design tools such as Figma and Inkscape open them as vector drawings:

```markdown
![A lit green LED](https://cdn.jsdelivr.net/gh/deepcircuits/deepcircuits-parts-kit@main/images/led-5-mm--green--on.svg)
```

Markdown shows a picture at its true size; where the page takes HTML, an `<img>` with a `width` shows it larger.

#### Show a state by swapping pictures

Each state is its own file, so a page can show one without any of the kit's code. Click the LED to light it:

```html
<img id="led" src="https://cdn.jsdelivr.net/gh/deepcircuits/deepcircuits-parts-kit@main/images/led-5-mm.svg" width="62" alt="A red LED">
<script>
  const images = 'https://cdn.jsdelivr.net/gh/deepcircuits/deepcircuits-parts-kit@main/images/';
  const led = document.getElementById('led');
  let lit = false;
  led.addEventListener('click', () => {
    lit = !lit;
    led.src = `${images}led-5-mm${lit ? '--on' : ''}.svg`;
    led.alt = lit ? 'A lit red LED' : 'A red LED';
  });
</script>
```

#### Read a part's pins in any language

`manifest.json` holds every part's size and the position of each pin, for drawing wires or labels over a picture. In Python:

```python
import json
from urllib.request import urlopen

URL = 'https://cdn.jsdelivr.net/gh/deepcircuits/deepcircuits-parts-kit@main/images/manifest.json'
parts = {part['id']: part for part in json.load(urlopen(URL))['parts']}

uno = parts['uno-class-board']
print(uno['width'], uno['height'])  # 275.07 201.6, in CSS pixels at 96 dpi
for pin in uno['pins'][:3]:
    print(pin['name'], pin['x'], pin['y'])  # A5.2 85.64 9.6, then A4.2 and AREF
print([image['file'] for image in uno['images']])  # ['uno-class-board.svg', 'uno-class-board--indicators-lit.svg']
```

The positions are from the part's top left. For a picture shown at another size, multiply them by the width it is shown at over the part's `width`.

### With the element

#### Light an LED while a button is held

Hold the button down, or focus it and hold Space. Each press and release fires `input` with the options that changed:

```html
<parts-kit-part id="button" type="pushbutton" scale="2"></parts-kit-part>
<parts-kit-part id="led" type="led-5-mm" color="green" scale="2"></parts-kit-part>
<script>
  const led = document.getElementById('led');
  document.getElementById('button').addEventListener('input', event => {
    led.toggleAttribute('on', event.detail.pressed);
  });
</script>
```

#### Dim an LED with a knob

Drag round the knob, or focus it and use the arrow keys:

```html
<parts-kit-part id="knob" type="potentiometer" scale="2"></parts-kit-part>
<parts-kit-part id="lamp" type="led-5-mm" color="yellow" on brightness="0.5" scale="2"></parts-kit-part>
<script>
  const lamp = document.getElementById('lamp');
  document.getElementById('knob').addEventListener('input', event => {
    lamp.setAttribute('brightness', event.detail.position);
  });
</script>
```

#### Type on a keypad

Click the keys, or focus the keypad and type. `press` names the key:

```html
<parts-kit-part id="keypad" type="keypad-4x4"></parts-kit-part>
<output id="typed"></output>
<script>
  const typed = document.getElementById('typed');
  document.getElementById('keypad').addEventListener('press', event => {
    typed.value += event.detail.key;
  });
</script>
```

#### Sweep a servo

The element changes only what moved, so it can redraw every frame:

```html
<parts-kit-part id="servo" type="servo" scale="2"></parts-kit-part>
<script>
  const servo = document.getElementById('servo');
  let angle = 0;
  let step = 3;
  setInterval(() => {
    if (Math.abs(angle + step) > 90) step = -step;
    angle += step;
    servo.setAttribute('angle', angle);
  }, 30);
</script>
```

#### Show the time on an LCD

Lists are easier to set from code, through the element's `options`:

```html
<parts-kit-part id="lcd" type="character-lcd-16x2"></parts-kit-part>
<script>
  const lcd = document.getElementById('lcd');
  const show = () => (lcd.options = { lines: ['The time is', new Date().toLocaleTimeString('en-GB')] });
  show();
  setInterval(show, 1000);
</script>
```

### With `drawPart`

#### Wire two parts together

Every drawing comes with its pins, so a wire can run from one pin to another. Place each part, then add its offset to its pins:

```js
import { drawPart } from '@deepcircuits/parts-kit';

const parts = [
  { art: drawPart('resistor', { ohms: 220 }), x: 20, y: 80 },
  { art: drawPart('led-5-mm', { on: true }), x: 100, y: 20 },
];
const pin = ({ art, x, y }, name) => {
  const p = art.pins.find(p => p.name === name);
  return { x: x + p.x, y: y + p.y };
};
const from = pin(parts[0], '2'); // the resistor's right leg
const to = pin(parts[1], 'A'); // the LED's anode

bench.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="110">
  ${parts.map(({ art, x, y }) => art.svg.replace('<svg ', `<svg x="${x}" y="${y}" `)).join('')}
  <path d="M${from.x} ${from.y} H${to.x} V${to.y}" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round"/>
</svg>`;
```

`partPins(id, options)` gives the same pins without drawing, and `rotateArtwork` turns a part with its pins.

#### Save parts as files

In Node, or in a build step:

```js
import { writeFileSync } from 'node:fs';
import { drawPart } from '@deepcircuits/parts-kit';

const chip = drawPart('ne555-timer');
// On its own, a file has no page colour to take: give the print that faces the canvas (the pin names) an ink.
writeFileSync('ne555.svg', chip.svg.replace('<svg ', '<svg color="#020817" '));
```

## The catalog

101 parts in ten families. The [gallery](https://deepcircuits.github.io/deepcircuits-parts-kit/) draws every one of them, and every generator's card.

| Family | Parts |
| --- | --- |
| Boards (17) | Uno-, Nano- and Mega-class boards, Pico-class and RP2040 Nano-class boards, eight ESP32 dev boards (30- and 38-pin, C3, C5, C6, H2, S2, S3), two STM32 boards, the Blue Pill, Franzininho DIY |
| Displays (16) | 16×2 and 20×4 character LCDs, three OLEDs, two TFTs, an 84×48 LCD, a 2.9″ e-paper, seven-segment and clock displays, 8×8 LED matrices and a chain of four, an 8×8 RGB matrix, a 16-LED ring |
| Sensors (16) | Ultrasonic ranger, temperature and humidity, two pressure boards, light, flame, sound, tilt and gas boards, IR receiver, NTC thermistor, PIR motion, accelerometer and gyro, pulse, DS18B20 |
| Inputs (11) | Two pushbuttons, rotary and slide potentiometers, slide switch, rotary encoder, joystick, 4×4 keypad, 8-way DIP switch, IR remote, rotary dialer |
| Outputs (10) | 5 mm LED, RGB LED, LED bar graph, addressable LED and strip, piezo buzzer, servo, stepper and biaxial stepper, DPDT relay |
| Modules (7) | Relay module, load cell amplifier, microSD card, real-time clock, RFID reader, logic analyzer, pixel meter |
| Chips (5) | NE555, 74HC595, 74HC165, NLSF595, ATtiny85, each in DIP, SOIC or TSSOP |
| Passives (3) | Resistor, electrolytic and ceramic capacitors |
| Breadboards (3) | Mini, half and full, in nine colours |
| Symbols (13) | Eight logic gates, multiplexer, two D flip-flops, clock source, supply |

`CATALOG` lists them for a part picker. Each entry has an `id`, a `name`, a `family`, the generator `fn` and the `preset` options that make the part, the `options` a caller may set, which of those are `state`, and the `aliases` people search for it by.

```js
import { CATALOG, drawPart, searchParts } from '@deepcircuits/parts-kit';

for (const part of CATALOG.filter(p => p.family === 'sensor')) {
  picker.add(part.name, drawPart(part.id).svg);
}
searchParts('hcsr04'); // [{ id: 'ultrasonic-ranger', name: 'Ultrasonic ranger', … }]
```

### Options

Each entry's `options` describe what the part takes, as data:

```js
CATALOG.find(p => p.id === 'servo').options;
// { angle: { type: 'number', label: 'Angle', min: -90, max: 90, step: 1, unit: '°', default: 0, state: true } }
```

A host can build its controls from them: the `type` picks the control (`boolean`, `number`, `level`, `enum`, `color`, `text`, `frame`, `list`, `object` and a few more), `min`, `max`, `step` and `choices` fill it in, `when` says which other values an option needs before it does anything (`optionApplies(spec, values)` answers that), and `examples` offer values a control cannot build from the type alone, such as a picture or a glyph. `checkOptions(id, options)` lists what is wrong with a call without drawing it. The types in `project/components/catalog.d.ts` are generated from the same data: `PartId`, `PartOptions<'servo'>` and `PartCall`.

### Ids and pin names

Ids do not change once published: a stored id keeps drawing the same part. An id is its name in lower case with a hyphen for every run of other characters (`Character LCD, 16×2` is `character-lcd-16x2`). An id that has been renamed keeps working, and `RENAMED_IDS` says what it is now.

Pin names come from the part's data sheet or its silk print (`A` and `K` on an LED, `VSS` to `K` on a character LCD). A name that repeats on a part is bare once and `.2`, `.3` after (`GND`, `GND.2`); the silk prints it without the suffix, as the real board does.

### Templates

`@deepcircuits/parts-kit/templates` has the templates the catalog is built from, for parts of your own: `devBoardTemplate` (a board with your pin names), `moduleTemplate` and `sensorModuleTemplate` (a breakout with your chip or element), `chipTemplate` (a DIP, SOIC or TSSOP with any even number of pins) and the rest.

```js
import { chipTemplate } from '@deepcircuits/parts-kit/templates';

const timer = chipTemplate({ label: 'NE555', pins: ['GND', 'TRIG', 'OUT', 'RESET', 'CTRL', 'THR', 'DIS', 'VCC'] });
```

## API

### Artwork

Every generator takes one options object and returns an `Artwork`. All of them are typed in [`src/index.d.ts`](src/index.d.ts).

| Field | Meaning |
| --- | --- |
| `width`, `height` | The part's box in CSS pixels at 96 dpi. |
| `svg` | The drawing: presentation attributes only (no `<style>`, no `style=""`), an explicit size, its own `<defs>`, `role="img"` and an `aria-label` that names the part. A part whose state is one short phrase says that too (a lit LED, a pressed button, a servo's angle, the text on a character LCD); a board's lamps and a screen's picture are left to the host. |
| `pins` | Each pin's `name` and position (`x`, `y`) in the part's box. Every pin is a whole number of pitches from the first. |

`partPins(id, options)` gives a catalog part's `width`, `height` and `pins` without its SVG. It draws the part once for each set of options and keeps the answer.

### State options

A part's state is an option with the same name on every part that has it. `CATALOG` lists each part's own.

| Option | Meaning | Parts |
| --- | --- | --- |
| `on`, `brightness` | A single light, lit, and how bright (0 to 1) | `led`, `pulseSensor` |
| `indicators` | A board's lamps by name (`power`, `user`, `out`, `status`), each lit or a level from 0 to 1 | boards, sensor and relay modules |
| `levels` | Each light's level from 0 to 1, in order | `ledBarGraph`, `sevenSegment` |
| `colors`, `color`, `r` `g` `b` | Pixel colours | `neopixel`, `ledRing`, `neopixelMatrix`, `ledStrip`, `rgbLed` |
| `lit` | Which lights are on, as rows or channels | `max7219Matrix`, `logicAnalyzer` |
| `value` | Characters to show | `sevenSegment`, `tm1637Module` |
| `lines`, `pixels`, `caption` | A character LCD's text; a screen's frame or a line of text | `characterLcd`, the screen modules |
| `pressed` | A button or key held | `pushbutton`, `joystick`, `rotaryEncoder`, `keypad`, `irRemote` |
| `position` | Travel from 0 to 1 | `potentiometer`, `slidePotentiometer` |
| `contact` | The pin a slide switch's middle pin joins: 1 or 3 | `slideSwitch` |
| `angle`, `detent`, `x` `y` | Turned in degrees, by detents, or pushed (-1 to 1, positive right and up) | `servo`, `stepper`, `rotaryDialer`, `rotaryEncoder`, `joystick` |
| `energised` | A relay's coil | `relay` |
| `live` | Current along the legs (`flow`: `true`, or `'reverse'` for the other way), heat and the probe on a pin | `resistor`, `led`, `buzzer` |

### Changing state in place

Redrawing is cheap, but replacing the SVG ends a control's focus and pointer capture. `patchSvg(host, artwork)` from `@deepcircuits/parts-kit/dom` shows a redrawn part by changing only what differs, so the element a user is dragging stays where it is:

```js
import { drawPart } from '@deepcircuits/parts-kit';
import { patchSvg, findHook } from '@deepcircuits/parts-kit/dom';

patchSvg(host, drawPart('potentiometer', { position: 0.3 }));
findHook(host, 'knob').setAttribute('tabindex', '0'); // kept across later patches
```

The moving parts carry `data-hook` attributes (`lens`, `glow`, `knob`, `horn`; select them with `[data-hook="lens"]`, never by id, so two parts on one page never clash) and `data-*` attributes (`data-segment`, `data-pressed`, `data-angle` with its pivot in `data-cx` and `data-cy`). Current along a leg is `data-live="flow"`, which `bundle.css` animates. The brand book's *States and hooks* and *The live layer* list every hook.

### The part element

`<parts-kit-part>` draws a catalog part in its shadow root, and redraws it in place with `patchSvg` when an attribute or its `options` change. Importing `@deepcircuits/parts-kit/element` in a page defines it, and so does the classic script.

| Attribute or property | Meaning |
| --- | --- |
| `type` | The part's catalog id. A renamed id works too. |
| An option, such as `color` or `angle` | The option, written as HTML writes it. `on` or `on=""` is true and `on="false"` is false. A camel-case name can be written in kebab case (`pixel-size`), and an object's field after the object (`live-flow="reverse"`). Lists and objects are JSON (`lines='["Hello", "World"]'`). |
| `scale` | Shows the part at that many times its true size; 1 by default. CSS sizes it too: a width smaller than the part shrinks it to fit. |
| `static` | Draws the part without its controls, for a picture that only shows a state. |
| `options` | Options set from code, over the attributes: the easy way to pass a list or a picture. |
| `artwork`, `pins` | The last drawing and its pins, in the drawing's pixels before `scale`. |
| `hook(name)` | A drawn element by its `data-hook`, such as `lens` or `knob`. |
| `error` | Why the last drawing failed, or null. The element shows the message where the part would be (style it with `::part(error)`) and logs it. |

The element fires `draw` after each drawing, with the artwork in `event.detail.artwork`. The print that faces the canvas takes the element's `color`. Attributes every HTML element has (`id`, `class`, `style`, `aria-*`, `data-*`) are not options. `definePartElement(name)` defines the element under another tag name, and `optionsFromAttributes(id, attributes)` reads attributes as the element does.

#### Parts a person operates

The input parts work by pointer and, once focused (a click or Tab focuses them), by keyboard:

| Part | Pointer | Keyboard | Changes |
| --- | --- | --- | --- |
| Pushbutton, 6 mm pushbutton | Hold it down | Space or Enter, held | `pressed` |
| Slide switch | Click | Space or Enter flips it; Left and Right pick a side | `contact` |
| DIP switch | Click a lever | 1 to 8 flip that lever | `values` |
| Potentiometer | Drag round the knob | The arrows step 1%, Page Up and Page Down 10%; Home and End go to the ends | `position` |
| Slide potentiometer | Drag along the slot | As the potentiometer | `position` |
| Rotary encoder | Drag round to turn it a detent at a time; click or hold to press the shaft | The arrows turn it; Space or Enter press | `detent`, `pressed` |
| Joystick | Drag the stick, which springs back; click or hold to press | The arrows push it (with Shift, a quarter of the way); Space or Enter press | `x`, `y`, `pressed` |
| Keypad | Hold a key, several at once with several fingers | A key's legend: 0 to 9, A to D, * and # | `pressed` |
| IR remote | Hold a key | 0 to 9; Up, Down, Left and Right (previous, next); Space or Enter (play); + and - (volume) | `pressed` |
| Rotary dialer | Click a finger hole | 0 to 9 | Nothing: the wheel winds round and runs back |

What a person changes is written to the element's attributes, so `button.hasAttribute('pressed')` reads it and CSS can select it; a part back at rest drops the attribute. Changing an attribute from code redraws the part and fires nothing, as with a form control. The element reports its role and state to assistive technology (a button, a switch, a slider), and `static` turns the controls off.

| Event | When | `event.detail` |
| --- | --- | --- |
| `input` | A person changed options | The options that changed: `{ pressed: true }`, `{ position: 0.42 }` |
| `change` | A press, drag or key ended with the part somewhere new | The options that differ from when it began |
| `press`, `release` | A button or key went down or came up | `{ key }` for a keypad's or remote's key, `{}` for a part with one button |
| `turn` | The encoder turned a detent | `{ steps, detent }`: `steps` is 1 clockwise, -1 back |
| `dial` | The dialer's wheel ran back from a digit | `{ digit }` |
| `draw` | After each drawing | `{ artwork }` |

A host that handles the pointer itself, such as an editor where a press on the part also drags it, can work the parts by the same geometry the element uses, from `@deepcircuits/parts-kit/controls`:

```js
import { knobPosition, detentsTurned, dialGeometry, dialDigitAt, dialTravel } from '@deepcircuits/parts-kit/controls';
import { findHook } from '@deepcircuits/parts-kit/dom';

const knob = findHook(host, 'knob');
const position = knobPosition(x - Number(knob.dataset.cx), y - Number(knob.dataset.cy), previous); // 0 to 1
const { detents, from } = detentsTurned(start, angle); // encoder detents passed since angle `start`
const wheel = dialGeometry(findHook(host, 'dial'));
const digit = dialDigitAt(wheel, x, y); // the finger hole under (x, y), or undefined
const travel = dialTravel(wheel, digit); // degrees the wheel winds to the finger stop
```

Points are in the drawing's pixels and angles in degrees from +x towards +y, so clockwise on screen is positive.

### Colours and themes

Colours come from the design tokens in [`project/tokens.json`](project/tokens.json), with light and dark values. `setTokenMode` chooses how the generators write them:

| Mode | Writes |
| --- | --- |
| `'values'` (default) | The light values, always, so the page's own custom properties never recolour a part. |
| `'vars'` | `var(--token, value)` for every colour, so the same SVG follows your theme. `{ prefix: 'kit-' }` namespaces the properties. |
| `'live'` | The page's `--token` (or `--<prefix>token`) custom properties as it draws, otherwise the light values. It reads the page's styles at most every 50 ms. |

For `'vars'`, load the stylesheet that defines the properties: [`tokens.css`](tokens.css) (light on `:root`, dark on `[data-theme="dark"]`), or one with your own prefix and selectors:

```bash
npx parts-kit-tokens --prefix kit- --dark '.dark' --out src/kit-tokens.css
```

```js
import { setTokenMode } from '@deepcircuits/parts-kit';
import { tokensCss } from '@deepcircuits/parts-kit/tokens-css';
import tokens from '@deepcircuits/parts-kit/tokens.json'; // Node adds: with { type: 'json' }

setTokenMode('vars', { prefix: 'kit-' });
const css = tokensCss(tokens, { prefix: 'kit-', dark: '.dark' }); // the same stylesheet, built at run time
```

A part's body is painted in fixed materials and looks the same on any canvas, as a real part does on any bench. Only what stands on the canvas (a chip's pin names, a logic symbol) follows the theme, in `currentColor`.

### Helpers

| Export | Use |
| --- | --- |
| `rotateArtwork(artwork, quarterTurns)` | The drawing turned, its pins with it: `1` a quarter clockwise, `-1` anticlockwise, `2` a half. |
| `flipArtwork(artwork, axis)` | The drawing mirrored, `'horizontal'` or `'vertical'`, its pins with it. |
| `toDataUrl(artwork, { ink })` | The drawing as a `data:` URL for an `<img>`, a canvas or a CSS background. |
| `scopeIds(artwork, prefix)` | The drawing with its gradient ids prefixed, for a host that needs every id on the page unique. |
| `PITCH` | 9.6: 0.1 inch in CSS pixels. |
| `check(artwork)`, from `/check` | The overlap check: labels touching labels or parts, parts touching parts, anything outside the box. Empty when the drawing is clean. |
| `pinsOnPitch(pins)`, from `/check` | True when every pin is a whole number of pitches from the first. |
| `mount(target, artwork, options)`, from `/mount` | Draws an artwork into a page over the pitch grid, for previews (`bundle.css` styles it). |
| `formatOhms`, `resistorBands`, from `/primitives` | A resistance as text, and its colour bands. |

```js
import { drawPart, rotateArtwork, toDataUrl } from '@deepcircuits/parts-kit';

const upright = rotateArtwork(drawPart('servo'), 1);
img.src = toDataUrl(drawPart('led-5-mm', { on: true }));
```

### Loading less

The package marks its modules free of side effects, so a bundler keeps only what you import: one generator such as `led` comes to about 12 KB minified. `drawPart` can draw any part, so it brings all of them (about 210 KB). `loadPart(id)` loads only the part's family, the first time it is drawn:

```js
import { loadPart } from '@deepcircuits/parts-kit/catalog';

const drawServo = await loadPart('servo');
host.innerHTML = drawServo({ angle: 45 }).svg;
```

`@deepcircuits/parts-kit/catalog` holds the catalog and its checks without any drawing code.

### Package entry points

| Import | What it is |
| --- | --- |
| `@deepcircuits/parts-kit` | Every part's generator, `drawPart`, the catalog, the helpers and the colour settings. |
| `@deepcircuits/parts-kit/boards`, `/displays`, `/sensors`, `/inputs`, `/outputs`, `/modules`, `/chips`, `/passives`, `/breadboards`, `/symbols` | One family's generators. |
| `@deepcircuits/parts-kit/catalog` | `CATALOG`, `FAMILIES`, `RENAMED_IDS`, `findPart`, `searchParts`, `checkOptions`, `optionApplies` and `loadPart`, without drawing code. |
| `@deepcircuits/parts-kit/templates` | The templates the parts are built from, for parts of your own. |
| `@deepcircuits/parts-kit/primitives` | The drawing primitives (pins, headers, boards, lenses, the live layer) for composing a part. |
| `@deepcircuits/parts-kit/dom` | `patchSvg`, `syncSvg` and `findHook`, for changing a drawn part in place in a page. |
| `@deepcircuits/parts-kit/element` | Defines `<parts-kit-part>` in a page; `definePartElement` and `optionsFromAttributes`. |
| `@deepcircuits/parts-kit/controls` | `knobPosition`, `detentsTurned`, `angleBetween`, `dialGeometry`, `dialDigitAt` and `dialTravel`: the geometry the input parts are operated by. |
| `@deepcircuits/parts-kit/check` | `check` and `pinsOnPitch`. |
| `@deepcircuits/parts-kit/mount` | `mount`, the preview helper. |
| `@deepcircuits/parts-kit/bundle.js` | The same kit as one classic script that defines `window.PartsKit` and, in a page, `<parts-kit-part>`. |
| `@deepcircuits/parts-kit/bundle.css` | Styles for `mount` previews and the `data-live` animation. |
| `@deepcircuits/parts-kit/tokens.css` | The tokens as custom properties, light and dark. |
| `@deepcircuits/parts-kit/tokens.json` | The tokens themselves. |
| `@deepcircuits/parts-kit/tokens-css` | `tokensCss(tokens, options)`, which writes a tokens stylesheet. |

The package is ES modules only, for current browsers and Node.

### Renamed names

Names that have changed keep working and are marked `@deprecated` in the types: the templates' old names at the root (`devBoard` is `devBoardTemplate` in `/templates`), the primitives and checks at the root (now in `/primitives`, `/check` and `/mount`), `ultrasonicSensor` (`ultrasonicRanger`) and `mfrc522Reader` (`rfidModule`), the old catalog ids (`RENAMED_IDS`), a resistor's `value` (`ohms`) and a slide switch's `position` (`contact`). The [changelog](CHANGELOG.md) lists every one.

## The brand book

[`project/README.md`](project/README.md) is the rule book every part follows: the grid, the materials and their tokens, the bench light, how state is shown, the measurements each drawing was taken from, and the checks a part must pass to ship. Each generator has a card in [`project/components/`](project/components) that says what it draws and what it takes.

## Contributing

Corrections are welcome, above all a photograph of a real part that a drawing gets wrong. [CONTRIBUTING.md](CONTRIBUTING.md) explains how the kit is laid out, how to change a part and how to run the checks. Changes are listed in the [changelog](CHANGELOG.md).

## Licence

[MIT](LICENSE), for the code and the artwork it draws.

Product names in the API and in this documentation say which real part a drawing shows. They are their owners' trademarks, and the kit is not affiliated with or endorsed by them.
