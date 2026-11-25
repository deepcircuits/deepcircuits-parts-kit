# NanoConnect

The Nano RP2040 Connect on its navy `pcb-blue` board at its true size, as on Arduino's drawing: 17.78 × 43.18 mm with the micro USB 1.8 mm past the end (45 × 18 mm overall), two 15-pin castellated rows 0.6 inch apart so it straddles a breadboard, the first pins 3.81 mm from the far end, and a 1.65 mm mounting hole at each corner in line with the rows. `left` and `right` name the rows from the far end.

- The u-blox NINA-W102 module (10 × 14 mm) sits between the first five pins of each row with its antenna at the board's end, as on the real board. Those five names stand on end between the pad and the module, where the kit's smallest print still fits; `RESET` prints as `RST`.
- Below the module: the crystal, the RP2040 with the IMU beside it, the flash and the crypto chip, a regulator, the microphone, the reset button, the RGB LED, and the orange D13 LED and green power LED either side of the USB.
- Hooks: `data-hook="power-led"` (`data-lit-state="power"`), `data-hook="user-led"` (the D13 LED, `indicators.user`), `data-hook="rgb-led"` (`indicators.rgb`), `data-hook="reset-button"`. `moduleLabel` prints on the can; `label` names the drawing only, since the real board prints no name on top.
