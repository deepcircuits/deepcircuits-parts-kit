# Multimeter

The pocket digital multimeter, drawn at about half its size so it sits beside a circuit: the `plastic-amber` holster round a `plastic-black` face, the green LCD with DC and AUTO above its reading, the rotary switch with its two positions (volts and milliamps, each with the DC mark) and three jacks along the foot. The jacks are the pins: `mA`, the fused current input marked 400mA MAX, `COM` and `V`, marked 600V MAX. `mode` turns the switch to `voltage` (the default) or `current`; `reading` is what the LCD shows, up to six characters (`4.987`, `-12.34`, `OL`), and `unit` the unit beside it (the mode's own, V or mA, when left out). With no reading the LCD shows dashes, as a meter does before it settles. The box is 14 × 25 pitches.

- The LCD's group carries `data-reading` (empty with no reading), `data-unit` and `data-mode`; each jack's socket carries `data-jack`; the knob is `data-hook="knob"`.
