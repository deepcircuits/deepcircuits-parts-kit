# Servo

The micro servo (SG90 class) from above: the `plastic-blue` body 22.8 × 12.2 mm with its mounting ears and screw holes, the gear housing and output shaft at one end, the single-arm `plastic-white` horn on the shaft, and the brown, red and orange lead to a connector at the left edge whose three pins (`GND`, `V+`, `PWM`) sit on the grid. Provide `angle` in degrees, -90 to 90.

- The horn is `data-hook="horn"` with `data-angle`; the host turns it to the solved pulse angle, so it rotates about the shaft and never leaves the box at either end of travel.
- The box is the real 45 × 31.6 mm footprint, so the servo sits beside a board at the scale of the other parts.
