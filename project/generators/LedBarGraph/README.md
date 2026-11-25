# LedBarGraph

The ten-segment LED bar graph from its photograph: the white DIP-20 package 25.4 × 10.2 mm with its dark face inset and ten pale bars at the real 2.2 mm bar pitch (closer than the pins, so the outer bars keep their margin), anodes `A1` to `A10` along the top, cathodes `C1` to `C10` along the bottom, the rows three pitches apart as the real 7.62 mm, each lead a short stub out of the body's edge with its handle where it meets the body. Provide `levels`, ten levels from 0 to 1, and `color`; optionally `colors`, one colour per bar from bar 1 (a bar without one takes `color`), and `vertical`.

- Each bar is `data-hook="bar-N"` with `data-level`, lit in its lens colour from `opacity-segment-dim` to full; the host sets the opacity from the solved current.
- The body is `plastic-white` with `indicator-off-light` bars on a `segment-face` window that encloses all ten; the notch in the rim at the top left marks pin 1.
- `vertical` stands the package on its end: anodes `A1` to `A10` down the left, cathodes `K1` to `K10` down the right, bar 1 at the top, for a part standing in a breadboard's columns.
