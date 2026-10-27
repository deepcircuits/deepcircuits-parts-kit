# Uln2003Board

`uln2003Board`: the ULN2003 stepper driver board sold with the 28BYJ-48, 35 × 32 mm on a `pcb-green` board. The ULN2003A lies across the middle in DIP-16, the white 5-pin motor connector runs along the top edge with the four channel LEDs and their resistors beside it, and the input header and supply pins run along the bottom edge.

- Pins are `IN1` … `IN4` (the input header along the bottom left), `VCC` and `GND` (printed `+` and `-`, the 5-12 V supply), then `A`, `B`, `C`, `D` and `COM`, the motor connector's pins, printed D, C, B, A and + from the left so the motor's plug (blue, pink, yellow, orange, red) meets them in order.
- The ON/OFF jumper beside the supply pins is drawn fitted; it joins `VCC` to `COM`, so its two pins are not pins of the part.
- `status` (state): the channel LEDs A to D, through the `led-a` … `led-d` hooks.
- `finish`: the board colour, green by default.
