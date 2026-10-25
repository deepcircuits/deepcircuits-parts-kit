# LedRing

A ring of addressable pixels on a `pcb-black` board at the real sizes (16 pixels on 44.5 mm; 8, 12 and 24 as sold), each package turned to follow the ring as the photograph shows, four pads at the bottom (`GND`, `VCC`, `DIN`, `DOUT`). Provide `pixels` (1 to 1024, 16 unless given) and `colors`, one CSS colour per pixel from the first, clockwise from the top.

- Each pixel is a Neopixel with `data-hook="px-N"`; the editor fills them from the solved chain.
- The ring is one `board` path with its hole cut (`fill-rule="evenodd"`), the pad tab at the bottom.
- The real ring carries its four pads on the ring body between pixels, off the 0.1 inch grid; the gap between neighbouring packages (2.5 mm on the 16-ring) is narrower than one pitch, so no on-grid row of four fits there. The tab keeps the kit's pin rule; drawing the pads on the body would mean handles off the grid.
