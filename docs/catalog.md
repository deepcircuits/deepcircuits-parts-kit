# The catalog

[Parts Kit](../README.md) › The catalog

108 parts in ten families. The [gallery](https://deepcircuits.io/parts) shows every part and every generator's card.

| Family | Parts |
| --- | --- |
| Boards (17) | Uno-, Nano- and Mega-class boards, Pico-class and RP2040 Nano-class boards, eight ESP32 dev boards (30- and 38-pin, C3, C5, C6, H2, S2, S3), two STM32 boards, the Blue Pill, Franzininho DIY |
| Displays (16) | 16×2 and 20×4 character LCDs, three OLEDs, two TFTs, an 84×48 LCD, a 2.9″ e-paper, seven-segment and clock displays, 8×8 LED matrices and a chain of four, an 8×8 RGB matrix, a 16-LED ring |
| Sensors (16) | Ultrasonic ranger, temperature and humidity, two pressure boards, light, flame, sound, tilt and gas boards, IR receiver, NTC thermistor, PIR motion, accelerometer and gyro, pulse, DS18B20 |
| Inputs (11) | Two pushbuttons, rotary and slide potentiometers, slide switch, rotary encoder, joystick, 4×4 keypad, 8-way DIP switch, IR remote, rotary dialer |
| Outputs (10) | 5 mm LED, RGB LED, LED bar graph, addressable LED and strip, piezo buzzer, servo, stepper and biaxial stepper, DPDT relay |
| Modules (8) | Relay module, load cell amplifier, microSD card, real-time clock, precision real-time clock, RFID reader, logic analyzer, pixel meter |
| Chips (7) | NE555, 74HC595, 74HC165, NLSF595, ATtiny85, each in DIP, SOIC or TSSOP; transistors in TO-92 and TO-220 |
| Passives (3) | Resistor, electrolytic and ceramic capacitors |
| Breadboards (3) | Mini, half and full, in nine colours |
| Symbols (13) | Eight logic gates, multiplexer, two D flip-flops, clock source, supply |

## Listing parts

`CATALOG` lists every part, for a part picker. Each entry has an `id`, a `name`, a `family`, its generator `fn`, the `preset` options that make the part, the `options` you can set, which of those are `state`, and `aliases` to search by.

```js
import { CATALOG, drawPart, searchParts } from '@deepcircuits/parts-kit';

for (const part of CATALOG.filter(p => p.family === 'sensor')) {
  picker.add(part.name, drawPart(part.id).svg);
}
searchParts('hcsr04'); // [{ id: 'ultrasonic-ranger', name: 'Ultrasonic ranger', … }]
```

## Options

Each entry's `options` describe what the part takes:

```js
CATALOG.find(p => p.id === 'servo').options;
// { angle: { type: 'number', label: 'Angle', min: -90, max: 90, step: 1, unit: '°', default: 0, state: true } }
```

A host can build its controls from them:

- `type` picks the control: `boolean`, `number`, `level`, `enum`, `color`, `text`, `frame`, `list`, `object` and a few more.
- `min`, `max`, `step` and `choices` set it up.
- `when` says which other values an option needs before it has any effect. `optionApplies(spec, values)` checks it.
- `examples` give values a control can't build from the type alone, such as a picture or a glyph. An example marked `each` is one item for every item the part has; `exampleValue(entry, spec, example)` gives the value to pass.

`checkOptions(id, options)` lists what is wrong with a call without drawing it. The types in `project/generators/catalog.d.ts` (`PartId`, `PartOptions<'servo'>` and `PartCall`) are generated from the same data.

## Ids and pin names

A published id always draws the same part. An id is the part's name in lower case, with a hyphen for each run of other characters (`Character LCD, 16×2` is `character-lcd-16x2`).

Pin names come from the part's data sheet or the printing on the board (`A` and `K` on an LED, `VSS` to `K` on a character LCD). When a name repeats on a part, the first is bare and the rest get `.2`, `.3` and so on (`GND`, `GND.2`). The printing on the drawing leaves the suffix off, as on the real board.

## Templates

`@deepcircuits/parts-kit/templates` has the templates the catalog is built from, for making parts of your own:

- `devBoardTemplate`: a board with your pin names.
- `moduleTemplate` and `sensorModuleTemplate`: a breakout board with your chip or sensor.
- `chipTemplate`: a DIP, SOIC or TSSOP chip with any even number of pins.
- and more.

```js
import { chipTemplate } from '@deepcircuits/parts-kit/templates';

const timer = chipTemplate({ label: 'NE555', pins: ['GND', 'TRIG', 'OUT', 'RESET', 'CTRL', 'THR', 'DIS', 'VCC'] });
```
