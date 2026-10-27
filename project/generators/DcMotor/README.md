# DcMotor

A brushed DC motor in two forms. `variant: 'hobby-130'` (the default) is the 130-size motor seen end on: the `metal` can 20.4 mm across with its flats 15.1 mm apart, the bearing boss, the two M2 mounting holes and the `plastic-red` two-blade fan on the shaft, 32 mm across. `variant: 'tt-gear'` is the yellow TT gear motor lying flat: the 130 can (25 × 15.1 mm) behind the 37 × 22.5 mm gearbox with its case screws, mounting hole and 1:48 print, and the `plastic-white` double-D output shaft standing up out of the gearbox 11.3 mm from its end. Two leads, red then black, run from the can's end tabs to a Header of legs at the bottom edge (`M+`, `M-`).

- The fan or the output shaft is `data-hook="rotor"` with `data-angle`; the editor turns it by the solved speed, positive turning it clockwise.
- `pins` renames the two leads.
