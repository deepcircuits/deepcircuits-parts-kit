# BluePill

The STM32F103C8 "Blue Pill" from photographs of the board, its micro USB at the left: a `pcb-blue` board 53 × 22.9 mm with two 20-pin rows along the long edges 0.6 inch apart, the BOOT0 and BOOT1 jumpers (both at 0) and the reset button beside the USB, the LQFP-48 set at 45 degrees in the middle as the board mounts it, the 8 MHz can and the 32 kHz crystal to its right, then the power and PC13 LEDs and the four SWD pads at the right end. `top` and `bottom` name the rows left to right (`GND`, `GND`, `3V3`, `R` to `VBAT` along the top, `B12` to `3V3` along the bottom); `order` is the catalog's handle order, which the pins follow. Names print without their `.N` suffix.

- Hooks: `data-hook="user-led"` (PC13, lit when the pin is low), `data-hook="power-led"` (`data-lit-state="powered"`, the state the STM32 boards report, as on the Nucleos), `data-hook="reset-button"`.
- Checked against photographs of the common board: each row's order, which pins face each other across the board (`VBAT` above `3V3`, `GND` above `B12`), and where the jumpers, button, crystals and LEDs sit.
