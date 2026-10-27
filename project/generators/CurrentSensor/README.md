# CurrentSensor

`acs712Module`: the red ACS712 current sensor module, 31 × 14 mm: the two-way screw terminal the measured current runs through (IP+, IP-) at the left, the ACS712 in SOIC-8 with its grade printed under the name, its capacitors, the power LED and its resistor, and the VCC, OUT, GND header down the right edge.

- `range`: the grade the chip prints, `5A` (ELC-05B, the default), `20A` (ELC-20A) or `30A` (ELC-30A).
- `indicators.power` (state): the power LED, through the `power-led` hook.
- `finish`: the board colour, red by default.
<!-- @dsCard group="Templates" height=200 -->
