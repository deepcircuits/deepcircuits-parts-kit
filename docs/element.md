# The part element

[Parts Kit](../README.md) › The part element

`<parts-kit-part>` draws any catalog part on a web page, without writing code:

```html
<script src="https://cdn.jsdelivr.net/gh/deepcircuits/deepcircuits-parts-kit@main/project/components/bundle.js"></script>

<parts-kit-part type="led-5-mm" color="green" on></parts-kit-part>
<parts-kit-part type="servo" angle="45" scale="2"></parts-kit-part>
<parts-kit-part type="character-lcd-16x2" lines='["Hello, world", "DeepCircuits"]'></parts-kit-part>
```

`type` is the part's id, and every other attribute is an option. Change an attribute and the part redraws. Buttons press, knobs turn and switches flip with a mouse, a finger or the keyboard. A misspelt option shows an error in place of the part: `servo has no option "angel"; did you mean "angle"?`.

With a bundler, `import '@deepcircuits/parts-kit/element'` defines the element and loads each family of parts when it is first used.

## Attributes and properties

The element draws its part in its shadow root. When an attribute or its `options` change, it updates the drawing in place with `patchSvg`.

| Attribute or property | Meaning |
| --- | --- |
| `type` | The part's id. Renamed ids work too. |
| An option, such as `color` or `angle` | The option as an HTML attribute. `on` or `on=""` is true, and `on="false"` is false. A camelCase name can be written in kebab-case (`pixel-size`), and an object's field after the object's name (`live-flow="reverse"`). Lists and objects are JSON (`lines='["Hello", "World"]'`). |
| `scale` | Shows the part at that many times its true size (1 by default). CSS can size it too: a smaller width shrinks it to fit. |
| `static` | Draws the part without its controls, as a still picture of a state. |
| `options` | Options set from code, on top of the attributes. The easy way to pass a list or a picture. |
| `artwork`, `pins` | The last drawing and its pins, in the drawing's pixels before `scale`. |
| `hook(name)` | A drawn element by its `data-hook`, such as `lens` or `knob`. |
| `error` | Why the last drawing failed, or null. The element shows the message where the part would be (style it with `::part(error)`) and logs it. |

The element fires `draw` after each drawing, with the artwork in `event.detail.artwork`. Pin names and other print on the canvas take the element's `color`. Standard HTML attributes (`id`, `class`, `style`, `aria-*`, `data-*`) are not options. `definePartElement(name)` defines the element under another tag name, and `optionsFromAttributes(id, attributes)` reads attributes the way the element does.

## Parts you can operate

The input parts work with the pointer and, once focused by a click or Tab, with the keyboard:

| Part | Pointer | Keyboard | Changes |
| --- | --- | --- | --- |
| Pushbutton, 6 mm pushbutton | Hold it down | Hold Space or Enter | `pressed` |
| Slide switch | Click | Space or Enter flips it; Left and Right pick a side | `contact` |
| DIP switch | Click a lever | 1 to 8 flip that lever | `values` |
| Potentiometer | Drag the knob around | Arrows step 1%, Page Up and Page Down 10%, Home and End go to the ends | `position` |
| Slide potentiometer | Drag along the slot | Same as the potentiometer | `position` |
| Rotary encoder | Drag around to turn it one detent at a time; click or hold to press the shaft | Arrows turn it; Space or Enter press it | `detent`, `pressed` |
| Joystick | Drag the stick, which springs back; click or hold to press | Arrows push it (a quarter of the way with Shift); Space or Enter press it | `x`, `y`, `pressed` |
| Keypad | Hold a key, or several keys with several fingers | The key's label: 0 to 9, A to D, * and # | `pressed` |
| IR remote | Hold a key | 0 to 9; Up, Down, Left and Right (previous, next); Space or Enter (play); + and - (volume) | `pressed` |
| Rotary dialer | Click a finger hole | 0 to 9 | Nothing: the wheel winds round and runs back |

What a person changes is written to the element's attributes, so `button.hasAttribute('pressed')` reads it and CSS can select it. When the part is back at rest, the attribute is removed. Setting an attribute from code redraws the part but fires no event, as with a form control. The element tells assistive technology its role and state (button, switch, slider). `static` turns the controls off.

| Event | When | `event.detail` |
| --- | --- | --- |
| `input` | A person changed an option | The options that changed: `{ pressed: true }`, `{ position: 0.42 }` |
| `change` | A press, drag or key ended with the part in a new state | The options that differ from the start |
| `press`, `release` | A button or key went down or came up | `{ key }` for a keypad or remote key, `{}` for a part with one button |
| `turn` | The encoder turned one detent | `{ steps, detent }`: `steps` is 1 clockwise, -1 anticlockwise |
| `dial` | The dialer's wheel ran back from a digit | `{ digit }` |
| `draw` | After each drawing | `{ artwork }` |

## Recipes

### Light an LED while a button is held

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

### Dim an LED with a knob

Drag the knob around, or focus it and use the arrow keys:

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

### Type on a keypad

Click the keys, or focus the keypad and type. The `press` event names the key:

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

### Sweep a servo

The element only updates what changed, so it can redraw every frame:

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

### Show the time on an LCD

Lists are easier to set from code, with the element's `options` property:

```html
<parts-kit-part id="lcd" type="character-lcd-16x2"></parts-kit-part>
<script>
  const lcd = document.getElementById('lcd');
  const show = () => (lcd.options = { lines: ['The time is', new Date().toLocaleTimeString('en-GB')] });
  show();
  setInterval(show, 1000);
</script>
```

## Handling the pointer yourself

A host that handles the pointer itself, such as an editor where dragging a part also moves it, can use the same geometry as the element, from `@deepcircuits/parts-kit/controls`:

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

Points are in the drawing's pixels. Angles are in degrees from +x towards +y, so clockwise on screen is positive.
