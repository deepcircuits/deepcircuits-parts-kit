# NeopixelMatrix

A matrix of addressable pixels from its photograph (the 8 × 8 at 71 mm square): the real 8.9 mm pitch on a `pcb-black` board, a decoupling capacitor beside every pixel, the input pads (`GND`, `VCC`, `DIN`) in the first row gap at the left edge, the output (`DOUT` with its two bare power pads) in the last row gap at the right edge, and six mounting holes in the row gaps on boards six pixels or more each way. Provide `rows` and `cols` (1 to 1024 each, 8 unless given) and `colors`, one CSS colour per pixel row by row from the top left.

- Each pixel is a Neopixel with `data-hook="px-N"` in row-major order; the editor fills them from the solved chain.
- The board is `rows` by `cols` pixel pitches, so the pads in the first and last gaps are whole pitches apart on both axes.
