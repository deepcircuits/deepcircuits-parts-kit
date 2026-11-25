# Solenoid

The open-frame push-pull solenoid (JF-0530B class) from its side: the 27 × 14 mm `metal` frame around the taped coil, and the 4.5 mm plunger out of its right end with the return spring and the end collar, 10 mm of stroke. Two leads, red then black, run from the coil to a Header of legs at the bottom edge (`1`, `2`).

- The plunger is `data-hook="plunger"` with `data-position`: 0 with the spring holding it out, 1 pulled in. The host sets it from the solved armature travel, and the spring closes up as it goes in.
- `volts` is the coil rating printed on the tape, 12 by default.
- `pins` renames the two leads.
