# RfidModule

The 13.56 MHz RFID reader as photographed: a `pcb-blue` 60 × 40 mm board on its long side, the eight pads down the left edge in their silk box (`SDA`, `SCK`, `MOSI`, `MISO`, `IRQ`, `GND`, `RST`, `3.3V`), the crystal can at the top left, the reader in QFN-32 marked RC522 below it among its passives, the power LED (`power-led`) and the two inductors at the bottom left, the printed coil round the right two thirds with the arcs and the name inside it, four holes.

- The area inside the coil is `data-hook="field"`: the editor lays a presented card or fob over it. The coil itself is `data-hook="antenna"`.
- `pins` may rename the pads; `label` changes the name inside the coil.
