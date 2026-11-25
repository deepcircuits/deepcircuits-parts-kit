# EpaperModule

The 2.9 inch e-paper module from Waveshare's size drawing: a `pcb-blue` board 89.5 × 38 mm with four 3 mm holes (2.5 mm in at the flex end, 2.0 mm at the other), the 79 × 36.7 mm panel with its paper and the 66.89 × 29.05 mm active area 2.3 mm from the panel's right end, the driver strip at the panel's left end, and the flex round the board's left edge from 10.5 mm down.

- The paper is `data-hook="paper"`; the active area is `data-hook="display"` with `data-width="296"` and `data-height="128"`.
- The real module's eight-pin connector is on its back at the right end, with `BUSY` at the top and `VCC` at the bottom. The kit draws those pins on the strip at that end in the same order, one pitch apart so they sit on the grid; `pins` names them top to bottom.

- `pixels: { width, height, data }` draws a frame over the window, data row by row from the top left: a falsy entry is dark, `true` or `1` lit. The panel draws every lit pixel in its own ink. Each colour's runs are one path in `data-hook="picture"`. `caption` still prints a line of text over it.
