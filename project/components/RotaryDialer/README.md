# RotaryDialer

A rotary dialer: a `plastic-white` base 69 × 76 mm, the `plastic-black` finger wheel with its ten holes and the digits printed on the wheel beside them, the `metal` finger stop, and three pads at the bottom (`GND`, `DIAL`, `PULSE`). Provide `angle` for the wheel's turn while dialling.

- The wheel is `<g data-hook="dial">`; the editor animates its rotate transform as a digit is dialled and released.
- As on a telephone dial, 1 sits just counterclockwise of the finger stop and the digits run on counterclockwise to 0, each printed inside its hole on the wheel, so they turn with it. Dialling a digit turns the wheel clockwise until its hole reaches the stop, further the higher the digit counts.
- The wheel carries its geometry for an editor: `data-cx` and `data-cy` (its centre), `data-ring` (the radius of the hole centres), `data-hole-radius`, `data-hole-angles` (the holes for 1 to 9 then 0 at rest, in degrees clockwise from +x) and `data-stop` (the finger stop's angle). A digit's travel is `data-stop` minus its hole's angle, taken clockwise.
