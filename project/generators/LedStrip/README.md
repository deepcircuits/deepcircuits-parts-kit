# LedStrip

The WS2812 strip: a black flexible board with `pixels` packages in a row (1 to 1024, `LED_STRIP_MAX_PIXELS`), each drawn at its package size: three pitches apart for the 5050 package, two for `pixelSize: '3535'` and one and a half for `'2020'`; `pixelShape: 'round'` (or `'circle'`) draws the 5 mm lens. The solder pads sit at both ends on the grid (`VDD`, `DIN`, `VSS` in on the left, `VDD.2`, `DOUT`, `VSS.2` out on the right) and, as the strip is made, a cut line between 5050 pixels with a pad pair either side of it; the narrower pitches have no room for them and show the data arrows instead. `colors` lights the pixels by index, each a CSS colour or `{ r, g, b }` from 0 to 1.

- Each pixel is a group with `data-pixel` and `data-lit`; its lens is `data-hook="px-N"` with `data-level`, the hooks the editor paints.
- The width grows by whole pitches as pixels are added, so the output pads stay on the grid.
