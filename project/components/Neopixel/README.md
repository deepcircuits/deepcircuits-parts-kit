# Neopixel

One WS2812 pixel, the 5 mm package with its four pads on the grid: `VDD` and `DIN` along the top, `DOUT` and `VSS` along the bottom, two pitches by one. Provide `r`, `g`, `b` from 0 to 1 or `color` as a CSS colour.

- The lit colour is `data-hook="pixel"`, a disc over the three dies with `data-level`; the editor sets its fill and opacity from the solved pixel.
- The package is `plastic-white` with the red, green and blue dies showing through; the notched corner marks pin 1 (`VDD`).
- LedRing and NeopixelMatrix place this pixel (`px-N`) at the real pitch.
