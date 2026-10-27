# BreadboardPowerModule

`mb102Module`: the MB102 breadboard power module, 33 × 53 mm, drawn to drop onto the end of a full or half breadboard. The four rail pins run down the right edge where a breadboard's rails are: TOP+ and TOP- one pitch apart at the top, BOT+ and BOT- 18 and 19 pitches below TOP+. The output header (5V, 3V3, GND) stands nine pitches below TOP+, over the breadboard's centre channel, where the board has no holes, so the header never plugs into a strip.

Along the left edge are the barrel jack (6.5 to 12 V) and the USB-A receptacle, with the latching power switch and the power LED between them. Each regulator is an AMS1117 in SOT-223 (5.0 V above, 3.3 V below) beside its output capacitor. Each rail has a three-pin jumper, 5V, the rail and 3.3V.

- `topRail`, `bottomRail`: `5` (the default), `3.3` or `off`; the jumper cap bridges the rail pin and the chosen voltage, or is gone.
- `power`: `on` (the default, the button pressed in) or `off`.
- `indicators.power` (state): the power LED, through the `power-led` hook.
- `finish`: the board colour, red by default.
