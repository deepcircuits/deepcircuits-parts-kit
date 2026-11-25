# Buzzer

A 12 mm piezo buzzer from above at the real size: a `plastic-black` can with its stepped top, the sound hole and a `+` mark, two tinned legs three pitches apart (the real 7.6 mm). Its only option is `live`.

- Pins are `+` (left, under the `+` mark) and `-`.
- `sealed: true` draws the active buzzer: the same can with its sound hole under the round white seal it is sold with (`active-buzzer`).
- There is no sounding state in the artwork; the host shows sound in its own UI.
- `live: { flow: true }` draws the live layer's flow up leg 1 and down leg 2 (`flow-1`, `flow-2`), the way current runs from `+`; `live: { probe: '+' }` or `'-'` puts the probe on that pin.
