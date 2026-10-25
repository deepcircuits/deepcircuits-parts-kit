# Pictures

[Parts Kit](../README.md) › Pictures

[`images/`](../images/) has every part as an SVG file: at rest, in each state (lit, pressed, energised), with sample content, and in each colour. Its [README](../images/README.md) shows them all, and [`manifest.json`](../images/manifest.json) lists each part's size, pins and files.

Copy the files you need, or link to them on jsDelivr:

```html
<img src="https://cdn.jsdelivr.net/gh/deepcircuits/deepcircuits-parts-kit@main/images/led-5-mm--green--on.svg" width="62" alt="A lit green LED">
```

Pictures are true size (0.1 inch is 9.6 pixels), so set a width to show a small part larger.

## Put a part in a document

Markdown, wikis and slides take the files as they are, and Figma and Inkscape open them as vector drawings:

```markdown
![A lit green LED](https://cdn.jsdelivr.net/gh/deepcircuits/deepcircuits-parts-kit@main/images/led-5-mm--green--on.svg)
```

Markdown shows a picture at true size. Where HTML is allowed, an `<img>` with a `width` shows it larger.

## Show a state by swapping pictures

Each state is its own file, so a page can switch states without any of the kit's code. Click the LED to light it:

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

## Read a part's pins in any language

`manifest.json` has every part's size and pin positions, for drawing wires or labels over a picture. In Python:

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

Positions are measured from the part's top-left corner. If you show a picture at another size, multiply them by the shown width divided by the part's `width`.
