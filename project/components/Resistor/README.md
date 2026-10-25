# Resistor

A quarter-watt axial resistor lying flat at the real size (6.3 × 2.4 mm body), legs four pitches apart unless `span` says otherwise: the dog-bone body (wider end caps on a narrower middle), four colour bands on the middle, light along the top and shade along the bottom of the cylinder. Provide `ohms` (`value` is its old name) and, optionally, `tolerance` (5 or 10) and `span`, the pitches between the legs (3 or more; the body stays centred between them).

- The body is `resistor-body` with a `resistor-body-edge` stroke; the end caps are 1.3 mm wide and 2.5 mm tall, the middle 2.1 mm tall. The legs are tinned wire.
- Bands come from the `band-*` tokens by the colour code, three digits bands at the left of the middle and the tolerance band at its right; `band-white` and `band-yellow` get a `stroke-fine` edge. Each band carries `data-band="1..4"`.
- No value text on the part: the editor draws the `value-caption` under it.
- Use Resistor for every through-hole resistor. A resistor on a module is a small `resistor-smd` chip drawn by Module.
- The bands read left to right as the code is read: first digit, second digit, multiplier, then the tolerance band after a wider gap (`data-band` 1 to 4 in that order).
