# API reference

[Parts Kit](../README.md) › API reference

Everything below is typed in [`src/index.d.ts`](../src/index.d.ts).

## Artwork

Every generator takes an options object and returns an `Artwork`.

| Field | Meaning |
| --- | --- |
| `width`, `height` | The part's size in CSS pixels at 96 dpi. |
| `svg` | The drawing. It has an explicit size, its own `<defs>`, and presentation attributes only (no `<style>`, no `style=""`). It has `role="img"` and an `aria-label` that names the part and, for simple states, says the state too (a lit LED, a pressed button, a servo's angle, an LCD's text). Board lamps and screen pictures are left for the host to describe. |
| `pins` | Each pin's `name`, `x` and `y` within the part. Every pin is a whole number of pitches (0.1 inch) from the first. |

`partPins(id, options)` returns a part's `width`, `height` and `pins` without the SVG. It draws the part once for each set of options and remembers the result.

## State options

A state option has the same name on every part that has it. `CATALOG` lists each part's own.

| Option | Meaning | Parts |
| --- | --- | --- |
| `on`, `brightness` | A light is on, and how bright (0 to 1) | `led`, `pulseSensor` |
| `indicators` | A board's lamps by name (`power`, `user`, `out`, `status`), each on or a level from 0 to 1 | boards, sensor and relay modules |
| `levels` | Each light's level from 0 to 1, in order | `ledBarGraph`, `sevenSegment` |
| `colors`, `color`, `r` `g` `b` | Pixel colours | `neopixel`, `ledRing`, `neopixelMatrix`, `ledStrip`, `rgbLed` |
| `lit` | Which lights are on, by row or channel | `max7219Matrix`, `logicAnalyzer` |
| `value` | The characters shown | `sevenSegment`, `tm1637Module` |
| `lines`, `pixels`, `caption` | An LCD's text; a screen's picture or line of text | `characterLcd`, the screen modules |
| `pressed` | A button or key is held down | `pushbutton`, `joystick`, `rotaryEncoder`, `keypad`, `irRemote` |
| `position` | How far it has moved, from 0 to 1 | `potentiometer`, `slidePotentiometer` |
| `contact` | Which pin, 1 or 3, a slide switch's middle pin connects to | `slideSwitch` |
| `angle`, `detent`, `x` `y` | Turned in degrees or by detents, or pushed (-1 to 1, positive is right and up) | `servo`, `stepper`, `rotaryDialer`, `rotaryEncoder`, `joystick` |
| `energised` | A relay's coil is energised | `relay` |
| `live` | Current along the legs (`flow`: `true`, or `'reverse'` for the other way), heat, and a probe on a pin | `resistor`, `led`, `buzzer` |

## Colours and themes

Colours come from the design tokens in [`project/tokens.json`](../project/tokens.json), with light and dark values. `setTokenMode` sets how the generators write them:

| Mode | Writes |
| --- | --- |
| `'values'` (default) | The light values, so the page's own styles never recolour a part. |
| `'vars'` | `var(--token, value)` for every colour, so the same SVG follows your theme. `{ prefix: 'kit-' }` adds a prefix to the property names. |
| `'live'` | The page's `--token` (or `--<prefix>token`) values at the moment it draws, or else the light values. It reads the page's styles at most every 50 ms. |

For `'vars'`, load a stylesheet that defines the properties. Use [`tokens.css`](../tokens.css) (light on `:root`, dark on `[data-theme="dark"]`), or make one with your own prefix and selectors:

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

A part's body has fixed colours and looks the same on any background, as a real part does on any bench. Only print on the canvas itself (a chip's pin names, a logic symbol) follows the theme, through `currentColor`.

## Helpers

| Export | Use |
| --- | --- |
| `rotateArtwork(artwork, quarterTurns)` | Turns the drawing and its pins: `1` a quarter turn clockwise, `-1` anticlockwise, `2` a half turn. |
| `flipArtwork(artwork, axis)` | Mirrors the drawing and its pins, `'horizontal'` or `'vertical'`. |
| `toDataUrl(artwork, { ink })` | The drawing as a `data:` URL, for an `<img>`, a canvas or a CSS background. |
| `scopeIds(artwork, prefix)` | Prefixes the drawing's gradient ids, for a page that needs every id to be unique. |
| `PITCH` | 9.6, which is 0.1 inch in CSS pixels. |
| `check(artwork)`, from `/check` | The overlap check: labels touching labels or parts, parts touching parts, anything outside the box. Empty when the drawing is clean. |
| `pinsOnPitch(pins)`, from `/check` | True when every pin is a whole number of pitches from the first. |
| `mount(target, artwork, options)`, from `/mount` | Draws an artwork on a page over the pitch grid, for previews (`bundle.css` styles it). |
| `formatOhms`, `resistorBands`, from `/primitives` | A resistance as text, and its colour bands. |

```js
import { drawPart, rotateArtwork, toDataUrl } from '@deepcircuits/parts-kit';

const upright = rotateArtwork(drawPart('servo'), 1);
img.src = toDataUrl(drawPart('led-5-mm', { on: true }));
```

## Loading less

The package is marked free of side effects, so a bundler keeps only what you import. One generator, such as `led`, is about 12 KB minified. `drawPart` can draw any part, so it brings in all of them (about 210 KB). `loadPart(id)` loads only that part's family, the first time it is drawn:

```js
import { loadPart } from '@deepcircuits/parts-kit/catalog';

const drawServo = await loadPart('servo');
host.innerHTML = drawServo({ angle: 45 }).svg;
```

`@deepcircuits/parts-kit/catalog` has the catalog and its checks without any drawing code.

## Package entry points

| Import | What it is |
| --- | --- |
| `@deepcircuits/parts-kit` | Every generator, `drawPart`, the catalog, the helpers and the colour settings. |
| `@deepcircuits/parts-kit/boards`, `/displays`, `/sensors`, `/inputs`, `/outputs`, `/modules`, `/chips`, `/passives`, `/breadboards`, `/symbols` | One family's generators. |
| `@deepcircuits/parts-kit/catalog` | `CATALOG`, `FAMILIES`, `findPart`, `searchParts`, `checkOptions`, `optionApplies` and `loadPart`, without drawing code. |
| `@deepcircuits/parts-kit/templates` | The templates the parts are built from, for parts of your own. |
| `@deepcircuits/parts-kit/primitives` | The drawing building blocks (pins, headers, boards, lenses, the live layer) for making a part. |
| `@deepcircuits/parts-kit/dom` | `patchSvg`, `syncSvg` and `findHook`, for updating a drawn part on a page. |
| `@deepcircuits/parts-kit/element` | Defines `<parts-kit-part>` on a page; also `definePartElement` and `optionsFromAttributes`. |
| `@deepcircuits/parts-kit/controls` | `knobPosition`, `detentsTurned`, `angleBetween`, `dialGeometry`, `dialDigitAt` and `dialTravel`: the geometry for operating the input parts. |
| `@deepcircuits/parts-kit/check` | `check` and `pinsOnPitch`. |
| `@deepcircuits/parts-kit/mount` | `mount`, the preview helper. |
| `@deepcircuits/parts-kit/bundle.js` | The whole kit as one classic script. It defines `window.PartsKit` and, on a page, `<parts-kit-part>`. |
| `@deepcircuits/parts-kit/bundle.css` | Styles for `mount` previews and the `data-live` animation. |
| `@deepcircuits/parts-kit/tokens.css` | The tokens as CSS custom properties, light and dark. |
| `@deepcircuits/parts-kit/tokens.json` | The tokens themselves. |
| `@deepcircuits/parts-kit/tokens-css` | `tokensCss(tokens, options)`, which writes a tokens stylesheet. |

The package is ES modules only, for current browsers and Node.
