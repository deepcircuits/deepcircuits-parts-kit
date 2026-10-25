# OledSquare

The 1.5 inch SH1107 module (the four-pin MC01506 board) from its photographs and listed size: a `pcb-blue` board 34.3 × 45.5 mm with four pins centred along the top edge (`GND`, `VCC`, `SCL`, `SDA` from the left; the back prints them mirrored), a hole 2.5 mm in from each corner, the 31 × 35 mm panel filling the board's width with its 26.9 mm square window near the top, the driver's band at the panel's foot, the flex folding under the board at the bottom centre and the module's name along the bottom edge. `pins` names the header from the left; `columns` and `rows` set the window's pixel counts; `caption` paints sample text.

- The window is `data-hook="display"` with `data-width` and `data-height` (128 × 128 by default) at the real 26.9 mm, so the editor scales the picture to it; the glass is `data-hook="glass"`.
- The 0.96 inch 4-pin module is OledBreakout with four names, at its real 27 mm.

- `pixels: { width, height, data }` draws a frame over the window, data row by row from the top left: a falsy entry is dark, `true` or `1` lit. The panel draws every lit pixel in its own ink. Each colour's runs are one path in `#picture`. `caption` still prints a line of text over it.
