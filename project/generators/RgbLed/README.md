# RgbLed

A 5 mm diffused RGB LED in front elevation: a milky `plastic-white` dome lit by the mix of its three channels, four legs a pitch apart in the real order, red, common, green, blue. Provide `r`, `g`, `b` from 0 to 1.

- The dome is one `data-hook="lens"` layer whose `fill` is the mix of the channels (the hue from their ratio, the opacity from the strongest); `data-r`, `data-g` and `data-b` carry the channels. The host sets the fill and the `data-hook="glow"` opacity from the solved channel currents.
- Off, the dome is the milky diffuser the real part shows; the lead frame's four posts show through faintly.
- The flange is cut short on the cathode side, as on the single-colour Led; the common leg is the second from the left and one pitch longer than the others, as the real part's longest lead.
- Pins are the catalog's: `Red`, `Common`, `Green`, `Blue`.
- The four legs leave the base 1.27 mm apart, as the real part does, and splay out to the grid below it.
