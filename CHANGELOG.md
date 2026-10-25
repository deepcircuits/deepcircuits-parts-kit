# Changelog

Every change that a user of the package would notice is recorded here, newest first.

## Unreleased

The first public release.

### Parts

- 101 library parts in ten families, each drawn at true size on the 0.1-inch grid with its pins: boards, displays, sensors, inputs, outputs, modules, chips, passives, breadboards and logic symbols.
- The templates behind them (`devBoardTemplate`, `moduleTemplate`, `sensorModuleTemplate`, `chipTemplate` and others, in `@deepcircuits/parts-kit/templates`) for parts of your own.
- The Blue Pill, the ESP32-DevKitC V4 and the character LCDs checked against photographs and data sheets: the Blue Pill's rows and parts as the real board has them, the DevKitC V4 at its real length with the module over the rows, the LCD's mount holes and header where the module has them.
- Every catalog part checked against photographs and data sheets for its pin order, which pins face each other, where its parts sit, its size, its holes and its pin-1 offset. Corrected:
  - Boards: the Mega, the ESP32-DevKitM-1 and DevKitC-1 boards (C3, C6, H2, S2, S3) at their true sizes, the Nucleo-64 and the Nucleo-32's width, and the Franzininho DIY at true size with its parts where the real board has them. The Nano RP2040 Connect at its true 17.78 × 43.18 mm from Arduino's drawing, with the radio module between the first pins, corner holes in line with the rows and the D13 LED (the `user-led` hook) beside the USB.
  - Displays: the 20×4 LCD's header and bezel (Raystar RC2004A); the 2.4 inch TFT as the red ILI9341 SPI module from its size drawing, and the capacitive-touch TFT as the 2.8 inch MSP2834 with SDA in J2's twelfth place; the TM1637 clock at 42 × 24 mm; the four-matrix FC-16 chain at true size; the 2.9 inch e-paper as Waveshare's 89.5 × 38 mm blue module, its pins at the connector's end with BUSY at the top; the 1.5 inch SH1107 at 34.3 × 45.5 mm with its pins GND, VCC, SCL, SDA from the left, as the module prints them.
  - Sensors: the LM393 comparator boards at 32 × 14 mm (the KY-037 at 34 × 15); the KY-013 and KY-022 at 15 × 18.5 mm; the GY-521 MPU6050 at 21 × 16 mm; both BMP180 boards redrawn from photographs, the five-pin module at 15 × 13 mm with its header down the left edge (VCC, GND, SCL, SDA, 3.3V) and the GY-68 at 10 × 12.5 mm; the KY-013's pins S, +, − from the left; the HC-SR501 PIR from the dome side with GND, OUT, VCC from the left and without the trimmers and jumper, which are on its back.
  - Inputs: the rotary encoder as the KY-040 (26.2 × 18.63 mm, CLK to GND down the right edge); the joystick as the KY-023 seen from above: the 34 × 26 mm board nearly covered by the mushroom cap (24 mm skirt, 18 mm thumb pad), the right-angle header's pins standing past the short edge with the board's own print (GND, +5V, VRx, VRy, SW) beside them.
  - Modules: the RC522 reader with SDA at the top of its header, as the board has it; the microSD module's pins in the module's order (CS, SCK, DI, DO, VCC, GND), with the catalog's CD pad below them; the logic analyzer at its true 54.7 × 27.4 mm, its pins on the 2 × 5 header as the label maps it instead of legs along one edge.
  - Breadboards: the mini's body at its true 46 × 34.5 mm, its holes unchanged.
  - Outputs: the DPDT relay's coil pins three pitches past the commons, as the data sheet's PCB layout has them.
- Every part then compared side by side with photographs of the real one seen from above. Redrawn:
  - The small boards sold with a right-angle header carry it (the LM393 boards, the KY-013, KY-022, KY-023 and KY-040, the MQ module, the DHT11 module and the HC-SR04): the black spacer at the board's edge and the pins standing past it, each pin's position at its tip. `labels` sets the print where a board prints other names than its pins (DO and AO on the flame board).
  - The KY-037's capsule lies on its side past the board's end, beside the tall 3296 trimmer; the KY-013's bead lies past the end on its long legs; the KY-022's receiver stands at the far end, its dome facing out.
  - The KY-040 as it is sold, without a knob: the metal body, the threaded bushing and the D shaft, which turns by detent.
  - The HC-SR04 has its own generator, `ultrasonicRanger`: the transducers' woven mesh, the crystal at the top, no chip on the front (the drivers are on the back), the header behind the board.
  - The DHT22 with its tab, hole and square vents; the DHT11 module as the black carrier with GND, DATA, VCC on its header; the GY-68's pins SDA, SCL, GND, VCC from the left as its front shows them, unnamed, since the names are printed on the back.
  - The keypad's number keys blue and its letter and symbol keys red, the DIP switch red and the KS2E relay amber, with the new tokens `plastic-red` and `plastic-amber`.
- State options with the same names on every part (`on`, `indicators`, `levels`, `colors`, `value`, `pressed`, `position`, `contact`, `angle`, `energised`, `live` and others), and `data-hook` attributes on the moving parts for changing state in place. Hooks are attributes, not ids, so two parts on one page never clash; the gradient ids are `pk-` ids whose content is the same wherever one repeats.
- Every catalog part's pin names follow its data sheet or silk print, and a name that repeats is bare once and `.2`, `.3` after.
- The DS18B20 has its own generator, `ds18b20Sensor`, with the data sheet's pin names GND, DQ, VDD.

### API

- `CATALOG`, the catalog: every part's id, name, family, generator, preset, the options it takes as data (type, range, choices, default, whether it is state) and the names people search for it by. `FAMILIES`, `RENAMED_IDS`, `findPart`, `searchParts`, `checkOptions` and `optionApplies` beside it.
- `drawPart(id, options)`, which draws any catalog part and throws for an unknown id or option, naming the nearest; `partPins(id, options)`, a part's pins without its SVG; `loadPart(id)`, which loads only the part's family.
- TypeScript types generated from the options: `PartId`, `PartOptions<Id>`, `PartCall`, and a `drawPart` that rejects a misspelt id or option.
- `rotateArtwork`, `flipArtwork`, `scopeIds` and `toDataUrl`, which turn, mirror, scope or encode a drawing.
- `patchSvg`, `syncSvg` and `findHook` from `@deepcircuits/parts-kit/dom`, which change a drawn part in place in a page.
- Entry points for the catalog, the templates, the primitives, the checks, the preview mount, the page helpers and each family, so a bundle keeps only what it imports.
- Catalog sensor and module boards take `finish` (their board colour); catalog chips take `package` (`dip`, `soic` or `tssop`).
- `setTokenMode('values' | 'vars' | 'live', { prefix })`, design tokens with light and dark values, and `tokens.css`. `'values'` is the default, so a page's own custom properties never recolour a part.
- `tokensCss(tokens, options)` from `@deepcircuits/parts-kit/tokens-css`, which runs in a browser, and the `parts-kit-tokens` command, which writes a tokens stylesheet with your prefix and theme selectors.
- `espDevKitTemplate({ layout: 'devkitc' })`, the ESP32-DevKitC V4's own layout.
- `espDevKitTemplate({ layout: 'devkit-1' })`, the DevKitM-1 and DevKitC-1 layout.
- `moduleTemplate({ width, height })`, a breakout's board at its true size in millimetres.
- `bmp180Board({ variant })` takes `'five-pin'` (the default) or `'gy68'`.
- `tftModule({ pins })` takes `null` for a header place with no pin, drawn as a bare pad.
- `nanoConnectTemplate({ indicators: { rgb } })` lights the Connect's RGB LED (the `rgb-led` hook).
- `check(artwork)` and `pinsOnPitch(pins)` from `@deepcircuits/parts-kit/check`, the kit's own overlap and pitch checks.
- `bundle.js`, the same kit as one classic script that defines `window.PartsKit` and, in a page, `<parts-kit-part>`.
- `<parts-kit-part>` from `@deepcircuits/parts-kit/element`: a catalog part as an HTML element (`<parts-kit-part type="led-5-mm" color="green" on>`). Its attributes are the part's options, it redraws in place when one changes, `scale` sizes it, `options` takes lists and objects from code, and an error shows where the part would be. `definePartElement` and `optionsFromAttributes` beside it.
- The element's input parts work by pointer and keyboard: a pushbutton presses while it is held, the potentiometers turn and slide as they are dragged, the slide switch and the DIP switch's levers flip when clicked, the encoder turns a detent at a time and presses, the joystick moves and springs back, the keypad's and the remote's keys press and the dialer dials. What a person changes is written to the element's attributes, and the element fires `input`, `change`, `press`, `release`, `turn` and `dial`. It takes focus, tells assistive technology its role and state, and `static` turns the controls off.
- The rotary dialer's `angle` runs to 324°, where the 0's hole meets the finger stop.
- `@deepcircuits/parts-kit/controls`: the geometry the element's input parts are operated by, for a host that handles the pointer itself. `knobPosition` turns a point round the potentiometer's knob into its position, `detentsTurned` counts the encoder's detents a drag has passed, and `dialGeometry`, `dialDigitAt` and `dialTravel` find the dialer's finger hole under a point and how far the wheel winds from it.

### Renamed

The names below changed before the first release. The old generator names, ids and options keep working and are marked `@deprecated` in the types; pin names have no aliases, since a pin has one name.

- Templates move to `@deepcircuits/parts-kit/templates` with a `Template` suffix: `devBoard`, `megaBoard`, `nanoConnect`, `picoBoard`, `espDevKit`, `nucleo32Board`, `nucleo64Board`, `module`, `sensorModule`, `comparatorBoard`, `smallSensorBoard`, `gasModule`, `chip` and `to92` become `devBoardTemplate` and so on.
- The primitives (`svg`, `pin`, `header`, `board`, `lens`, `indicator`, `flow`, `probe`, `wire` and the rest) move to `/primitives`, `check` and `pinsOnPitch` to `/check`, `mount` to `/mount`. `lens`, `indicator` and `flow` take `hook` in place of `id`.
- `ultrasonicSensor` is `ultrasonicRanger` and `mfrc522Reader` is `rfidModule`, which drew the same parts.
- Options: a resistor's `value` is `ohms`; a slide switch's `position` (1 or 2) is `contact` (1 or 3, the pin the middle pin joins). `live.flow` also takes `'reverse'`.
- Catalog ids are each part's name as a slug, and the names put a size or count after a comma (`Character LCD, 16×2`): `16x2-character-lcd` is `character-lcd-16x2`, `led` is `led-5-mm`, `esp32-dev-board` is `esp32-dev-board-30-pin`, `esp32-devkitc-v4` is `esp32-dev-board-38-pin`, `blue-pill` is `stm32-blue-pill`, and so on; `RENAMED_IDS` lists all 31. The `logic` family is `symbol`.
- Pins: an LED's cathode `C` is `K`, and a bar graph's `C1` to `C10` are `K1` to `K10`; a buzzer's `1` and `2` are `+` and `-`; a pushbutton's `1.l`, `1.r`, `2.l`, `2.r` are `1`, `1.2`, `2`, `2.2`; a one-digit seven-segment display's `COM.1` is `COM`; the DS18B20's `VCC` is `VDD`. On the boards the first of a repeated name loses its `.1` (`GND.1` is `GND`), the Mega's block `5V.1` and `5V.2` are `5V.2` and `5V.3`, and the Franzininho's second `GND` and `VCC` are `GND.2` and `VCC.2`.

### Project

- The gallery (`index.html`), the brand book, a card for every generator, and the checks that run on every build (`npm test`).
- `images/`: every catalog part as SVG files, at rest, in its states, with its examples and in each colour it comes in, with `manifest.json` (sizes, pins, hooks and the options of each picture) and a README that shows them all.
- The README's three ways to use the kit (pictures, the element, `drawPart`) and recipes for each: a part in a document, a state shown by swapping pictures and a part's pins read from the manifest; an LED lit by a button, an LED dimmed by a knob, a keypad that types, a servo sweep and a clock on an LCD; a wire between two parts' pins and parts saved as files.
