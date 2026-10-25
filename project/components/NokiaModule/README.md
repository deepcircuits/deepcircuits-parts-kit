# NokiaModule

The 84 × 48 graphic LCD module (the PCD8544 board sold for the Nokia 5110 screen) from its picture: a `pcb-red` board 45.7 mm square with the eight-pin header along the bottom edge (`RST`, `CE`, `DC`, `DIN`, `CLK`, `VCC`, `BL`, `GND`) and the same eight places repeated along the top as bare pads in a silk frame, four corner holes, C1 and D1 beside the top corners, the 40 × 34 mm glass in its metal frame with the frame's side tabs, the elastomer strip along the glass's foot and the 30 × 20 mm active area in its upper part.

- The active area is `data-hook="display"` with `data-width="84"` and `data-height="48"` (the editor scales the picture to it); the whole glass is `data-hook="glass"`, whose colour the renderer blends with the backlight.
- The handles are on the bottom row; the top row is the board's duplicate header, drawn so the part reads as the real one.

- `pixels: { width, height, data }` draws a frame over the window, data row by row from the top left: a falsy entry is dark, `true` or `1` lit. The panel draws every lit pixel in its own ink. Each colour's runs are one path in `#picture`. `caption` still prints a line of text over it.
