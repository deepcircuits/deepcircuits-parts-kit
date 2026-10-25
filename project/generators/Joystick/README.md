# Joystick

The KY-023 analog joystick module as photographed: a `pcb-black` board 34 × 26 mm lying on its side, nearly covered from above by the stick's `plastic-black` mushroom cap, a 24 mm skirt under an 18 mm thumb pad, which hides the gimbal and its pots. The right-angle header sits at the left end with its five pins standing past the board's edge, and four M3 holes and the module's name are along the far end. The pins are `GND`, `VCC`, `HORZ`, `VERT` and `SEL` from the top, the catalog's names; the board prints `GND`, `+5V`, `VRx`, `VRy` and `SW` beside them. Provide `x` and `y` from -1 to 1, positive right and up, and `pressed`.

- The stick is `<g data-hook="stick">` with `data-x` and `data-y`, the thumb pad translated by up to 0.7 pitch each way; the skirt, `data-hook="boot"`, follows a third of the way. The pad is `data-hook="cap"` with `data-pressed`. The editor drags the stick and presses the cap.
- `pins` renames the pins and, unless `labels` is given, the print beside them.
