# Board

A bare printed circuit board: one of the seven finishes, its darker edge stroke, four corner mounting holes and a silk title. Provide `width` and `height` (whole pitches), `finish` (`blue`, `green`, `teal`, `black`, `purple`, `white`, `red`), `title` and whether it has `holes`.

- Pick the finish by family: `blue` for display and sensor modules, `green` for RP2040-class boards and LCDs, `teal` for Uno, Nano and Mega-class boards, `black` for ESP32 dev kits and instruments, `purple` for small sensor breakouts, `white` for Nucleo-class boards, `red` for the 2.4 inch TFT module, the relay module and other red breakouts.
- The rectangle is inset `board-inset` and rounded `radius-board`; the edge is `stroke-outline` of the finish's `-edge` token.
- Mount holes are `mount-hole-radius`, `hole` with a `pad` ring, 0.6 pitch from each corner; the hole shows the canvas (white in the light theme), as a drilled board does. Leave them off a board narrower than five pitches.
- The title is `silk-title` in `silk` (or `silk-dark` on `pcb-white`). Never a vendor logo. `mark` places our maker's mark on the silk.
- Traces (`PartsKit.trace`) and vias (`PartsKit.via`) go on after the board and before the pads, so the pads sit on top of them.
