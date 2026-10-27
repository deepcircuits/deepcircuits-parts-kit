<div align="center">

<img src="project/assets/hero.svg" alt="Parts drawn by the kit: an Uno-class board, a character LCD, LEDs, a servo, an ESP32 board, an LED ring, an OLED, an RGB LED, an ultrasonic ranger and a clock display" width="100%">

# DeepCircuits Parts Kit

**Original electronic part artwork, drawn by code.**

Boards, chips, sensors, displays and modules as SVG, each at true size on the 0.1-inch grid, with its pins and its live state.

[![MIT licence](https://img.shields.io/badge/licence-MIT-0f766e)](LICENSE)
[![Types included](https://img.shields.io/badge/types-included-3178c6)](src/index.d.ts)
[![No dependencies](https://img.shields.io/badge/dependencies-none-16a34a)](package.json)

[**Gallery**](https://deepcircuits.io/parts) · [Catalog](docs/catalog.md) · [API](docs/api.md) · [Brand book](project/README.md) · [Contributing](CONTRIBUTING.md)

</div>

---

The Parts Kit is the artwork of [DeepCircuits](https://deepcircuits.io), the circuit simulator, published on its own so any editor, simulator, tutorial or diagram can use it.

- **True size.** Every pin sits on the 0.1-inch grid, so parts line up on a breadboard and wires snap to their legs.
- **Live state.** LEDs light, screens show text, servos turn and buttons press.
- **Typed options.** A typo such as `angel` fails in TypeScript and names the right option at run time.
- **No dependencies.** Plain functions that return SVG strings, anywhere JavaScript runs.
- **Original and MIT licensed.** Nothing copied from other part libraries, and no logos.

## Install

```bash
npm install github:deepcircuits/deepcircuits-parts-kit
```

Or, without a bundler:

```html
<script src="https://cdn.jsdelivr.net/gh/deepcircuits/deepcircuits-parts-kit@main/project/generators/bundle.js"></script>
```

## Use it

**As pictures.** Every part is an SVG file in [`images/`](images/):

```html
<img src="https://cdn.jsdelivr.net/gh/deepcircuits/deepcircuits-parts-kit@main/images/led-5-mm--green--on.svg" width="62" alt="A lit green LED">
```

**On a page.** The `<parts-kit-part>` element draws a part from its attributes, and buttons, knobs and switches respond to the mouse and keyboard:

```html
<parts-kit-part type="servo" angle="45" scale="2"></parts-kit-part>
```

**In code.** `drawPart` returns the SVG and the position of every pin:

```js
import { drawPart } from '@deepcircuits/parts-kit';

const { svg, pins } = drawPart('led-5-mm', { color: 'green', on: true });
```

## Documentation

| Page | What it covers |
| --- | --- |
| [Pictures](docs/pictures.md) | The SVG files and their manifest, in documents and pages |
| [The part element](docs/element.md) | `<parts-kit-part>`: attributes, interactive parts, events and recipes |
| [Drawing in code](docs/drawing.md) | `drawPart`, React, updating a drawing in place, wiring parts together |
| [The catalog](docs/catalog.md) | All 103 parts, their ids, pin names and options, and templates for your own |
| [API reference](docs/api.md) | Artwork, state options, themes, helpers and entry points |
| [Brand book](project/README.md) | The rules every drawing follows, and a [card](project/generators) for each generator |

## Contributing

Corrections are welcome, especially a photo of a real part that a drawing gets wrong. See [CONTRIBUTING.md](CONTRIBUTING.md) and the [changelog](CHANGELOG.md).

## Licence

[MIT](LICENSE), for the code and the artwork it draws. Product names say which real part a drawing shows. They are their owners' trademarks, and the kit is not affiliated with or endorsed by them.
