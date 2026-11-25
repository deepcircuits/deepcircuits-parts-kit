# OledBreakout

The 0.96 inch SSD1306 module from its photographs: a `pcb-blue` board 27 mm square with the header along the top (the catalog's eight SPI pins `DATA`, `CLK`, `DC`, `RST`, `CS`, `3V3`, `VIN`, `GND`, or the four I²C ones), four corner holes, and the 26.7 × 19.3 mm panel below the header with its 128 × 64 window in the upper part, the driver's dark band along the panel's foot and the flex tail folding under the board at the bottom centre. Provide `pins` to rename and `caption` for a line of sample text.

- The window is `data-hook="display"` with `data-width="128"` and `data-height="64"`; the controller paints it.
- The eight-pin board is a millimetre taller (28 mm) so the longer names stand on end between the pins and the glass; the four-pin board is the real 27 mm with its names printed flat.

- `pixels: { width, height, data }` draws a frame over the window, data row by row from the top left: a falsy entry is dark, `true` or `1` lit. The panel draws every lit pixel in its own ink. Each colour's runs are one path in `data-hook="picture"`. `caption` still prints a line of text over it.
