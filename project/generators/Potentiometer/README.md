# Potentiometer

A rotary potentiometer: a `plastic-grey` body with three `metal` solder tabs and a dial arc, a knurled `plastic-black` knob with a `metal` D-shaft and a `chip-print` pointer, three legs along the bottom. Provide `position` from 0 to 1; the knob turns from −135° to +135°.

- The knob is a `<g data-hook="knob">` with a `rotate(angle cx cy)` transform, so the editor animates the transform as the value changes and the pointer is the drag handle.
- Pins are `GND`, `SIG` (the wiper) and `VCC`, left to right. The dial carries no print, as the real part carries none.
- A slide potentiometer is a SlideSwitch-shaped body with the lever at the position; use the same three pin names.
- The highlight on the knob's rim stays where the bench light puts it; only the knob's knurl, shaft and pointer turn.
