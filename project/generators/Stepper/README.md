# Stepper

The stepper motor from above: the `plastic-black` frame with its rounded corners around the `metal` face, four mounting holes, the bearing boss and the D-cut shaft, four wires out of the bottom edge to a Header of legs on the grid (`A-`, `A+`, `B+`, `B-`). The default is the NEMA 17 frame at 42.3 mm; `frameSize` in millimetres draws the others.

- The shaft is `data-hook="rotor"` with `data-angle`; the editor turns it by the solved step count.
- `biaxial: true` draws the two-rotor clock motor: a second, hollow shaft `data-hook="rotor-2"` (`angle2`) around the first and eight winding pins (`A1-` … `B2-`), rotated to fit the header.
