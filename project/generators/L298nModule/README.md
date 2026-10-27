# L298nModule

`l298nModule`: the L298N dual H-bridge motor driver module, 43 × 43 mm. The finned heatsink runs across the top with the L298N in its Multiwatt package standing against it, its fifteen staggered legs into the board, and the eight flyback diodes in a row below. The 78M05 regulator, the power LED with its resistor and the two 220 µF capacitors fill the middle.

- Pins are `ENA`, `IN1` … `IN4`, `ENB` (the logic header along the bottom right), `12V`, `GND`, `5V` (the power terminal along the bottom left, two pitches apart), then `OUT1`, `OUT2` (the motor terminal on the left edge) and `OUT3`, `OUT4` (on the right edge).
- A 5V pin stands behind `ENA` and behind `ENB`; they are not pins of the part. `enableJumpers` (fitted by default) draws the caps that join them, with `data-jumper` `ena` and `enb`.
- `regulatorJumper` (fitted by default) draws the 5V-EN cap (`data-jumper` `5v-en`) beside the power terminal, which lets the 78M05 feed the logic from `12V`.
- `indicators.power` (state): the power LED, through the `power-led` hook.
- `finish`: the board colour, red by default.
