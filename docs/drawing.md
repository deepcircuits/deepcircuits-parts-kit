# Drawing in code

[Parts Kit](../README.md) › Drawing in code

`drawPart` draws any catalog part by id and returns the SVG and the position of every pin:

```js
import { drawPart } from '@deepcircuits/parts-kit';

const lcd = drawPart('character-lcd-16x2', { lines: ['Hello, world', 'DeepCircuits'] });
container.innerHTML = lcd.svg;
lcd.pins; // [{ name: 'VSS', x: 30.24, y: 9.45 }, { name: 'VDD', … }, …]

drawPart('servo', { angel: 30 });
// TypeScript: 'angel' does not exist in type '{ angle?: number }'. Did you mean to write 'angle'?
// JavaScript: Error: servo has no option "angel"; did you mean "angle"? Its options are angle.
```

Each part also has its own generator. It takes the same options, plus any that the catalog entry fixes:

```js
import { led, resistor } from '@deepcircuits/parts-kit';

const red = led({ color: 'red', on: true, brightness: 0.6 });
const r = resistor({ ohms: 4700 }); // the colour bands follow from the resistance
```

The [API reference](api.md) describes what a drawing contains and every state option.

## In React

Insert the SVG string directly. Any text you pass in (a caption, a label, an LCD line) is escaped first, so it is safe:

```jsx
import { useMemo } from 'react';
import { drawPart } from '@deepcircuits/parts-kit';

export function Part({ id, options }) {
  const art = useMemo(() => drawPart(id, options), [id, options]);
  return <span dangerouslySetInnerHTML={{ __html: art.svg }} />;
}
```

## On a plain page

```html
<div id="bench"></div>
<script src="https://cdn.jsdelivr.net/gh/deepcircuits/deepcircuits-parts-kit@main/project/components/bundle.js"></script>
<script>
  document.getElementById('bench').innerHTML = PartsKit.drawPart('servo', { angle: 45 }).svg;
</script>
```

## Update a drawing in place

Redrawing is cheap, but replacing the SVG loses focus and pointer capture. `patchSvg(host, artwork)` from `@deepcircuits/parts-kit/dom` changes only what differs, so a control that is being dragged stays where it is:

```js
import { drawPart } from '@deepcircuits/parts-kit';
import { patchSvg, findHook } from '@deepcircuits/parts-kit/dom';

patchSvg(host, drawPart('potentiometer', { position: 0.3 }));
findHook(host, 'knob').setAttribute('tabindex', '0'); // kept across later patches
```

Moving parts have `data-hook` attributes (`lens`, `glow`, `knob`, `horn`). Select them with `[data-hook="lens"]`, not by id, so two parts on one page never clash. State is also written to `data-*` attributes (`data-segment`, `data-pressed`, and `data-angle` with its pivot in `data-cx` and `data-cy`). Current along a leg is `data-live="flow"`, which `bundle.css` animates. The brand book's *States and hooks* and *The live layer* list every hook.

## Wire two parts together

Every drawing comes with its pins, so you can draw a wire from one pin to another. Place each part, then add its position to its pins:

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

`partPins(id, options)` returns the pins without drawing, and `rotateArtwork` turns a part and its pins.

## Save parts as files

In Node or a build step:

```js
import { writeFileSync } from 'node:fs';
import { drawPart } from '@deepcircuits/parts-kit';

const chip = drawPart('ne555-timer');
// A file has no page colour to inherit, so give the pin names an ink colour.
writeFileSync('ne555.svg', chip.svg.replace('<svg ', '<svg color="#020817" '));
```
