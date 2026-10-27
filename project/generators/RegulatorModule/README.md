# RegulatorModule

`ams1117Module`: the small blue AMS1117-3.3 board, 25 × 11.5 mm. The three pads run down its left edge (VIN, GND, VOUT); the regulator sits in SOT-223 with its tab up, between the pads and its two capacitors, and the power LED and its resistor are at the right.

- `indicators.power` (state): the power LED, through the `power-led` hook.
- `finish`: the board colour, blue by default.
