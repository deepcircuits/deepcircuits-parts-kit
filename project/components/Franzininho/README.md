# Franzininho

The Franzininho DIY from its open board files: a 51.1 × 30.0 mm `pcb-green` board with the metal USB-A plug standing 16.1 mm off its left end, the USB parts lying between the plug and the chip (the 1N4148, the two 3.6 V zeners, the two 68 Ω resistors and the 1.5 kΩ pull-up, then the two 1 kΩ LED resistors along y), the 78L05 and the C1 ceramic along the top, the C2 electrolytic, the ATtiny85 in its DIP-8 socket with pin 1 at the top right, the reset button above it, the two 3 mm LEDs (ON green, LED yellow, the PB1 indicator) at the bottom, four mounting holes, eight sockets down the right edge (`side`: `GND VCC PB4 PB5 PB3 PB2 PB1 PB0`, top to bottom) and three along the top (`power`: `VIN GND VCC`).

- Hooks: `#power-led` (`data-lit-state="power"`, the green ON lamp), `#user-led` (the yellow LED on PB1), `#reset-button`. Both lamps are 3 mm domes with the kit's glow sheen when lit.
- The headers are whole pitches apart: the top row ten pitches left of the side column and two above it, each 0.2 to 0.5 mm from where the board puts it.
- The side pins follow the board's copper. Its silk prints 5 beside the pin wired to PB4 and 4 beside PB5; the drawing prints the pin names.
