# GearedStepper

`gearedStepper`: the 28BYJ-48 5 V geared unipolar stepper seen from its shaft side. The `metal` can 28 mm across with its rolled seam and print, the flange across it with its two mounting holes 35 mm apart, the output shaft's boss 8 mm off the can's centre, and the `plastic-blue` cover over the lead exit. Five leads run from the cover to a Header of legs at the bottom edge, in the order the motor's plug holds them: blue, pink, yellow, orange, red.

- Pins come back in drive order: `ORANGE`, `YELLOW`, `PINK`, `BLUE`, then `RED`, the two windings' common centre tap. Wired to a ULN2003 board's A, B, C, D and +, the board's connector order matches the header's.
- The `brass` output shaft with its two flats is `data-hook="rotor"` with `data-angle`; the editor turns it by the solved output-shaft angle, positive turning it clockwise.
