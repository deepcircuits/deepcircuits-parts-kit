# RotaryEncoder

The KY-040 rotary encoder module as photographed, at the size its dimension drawing gives: a `pcb-black` board 26.2 × 18.63 mm lying on its side, the 12 mm `metal` encoder at the left with its three leads, seen from above without a knob, as it is sold (the square body, the threaded bushing and the 6 mm D shaft), the right-angle header at the right end with its five pins standing 6 mm past the edge (`CLK`, `DT`, `SW`, `VCC`, `GND` from the top) and the board's print beside the pads (`CLK`, `DT`, `SW`, `+`, `GND`), and two holes along the bottom edge. The pull-up resistors sit on the back. The box runs to the pins' tips. Provide `detent`, the detents turned, and `pressed`.

- The shaft is `<g data-hook="knob">` with `data-detent`, `data-cx`, `data-cy` and `data-angle`, turned 18° per detent (20 per turn), its flat showing the turn; the group spans the encoder's body, so a drag anywhere on the body turns it. The host animates its rotate transform. The shaft's top is `data-hook="cap"` with `data-pressed` for the push.
- `pins` may rename the pins, and `labels` the print; the catalog's names are the default. `finish` recolours the board (`blue` for the blue boards).
