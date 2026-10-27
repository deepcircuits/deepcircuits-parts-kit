# MultiRelayModule

`multiRelayModule`: the 2-, 4- and 8-channel relay modules (`channels`, 4 by default) on a `pcb-blue` board, 7 × channels + 2 by 21 pitches. Each channel has its blue screw terminal (`NO`, `COM`, `NC`, two pitches apart) along the top edge, its SRD-05VDC-SL-C relay standing below it, and its driver: the PC817 optocoupler, the transistor, the resistors and the status LED printed with its input's name.

- Pins are `GND`, `IN1` … `INn`, `VCC` (the input header along the bottom edge), `JD-VCC`, then each channel's `NO1`, `COM1`, `NC1` and so on.
- The three-pin block at the bottom right is `GND`, `VCC`, `JD-VCC`; its `GND` and `VCC` pads are the header's own nets, so only `JD-VCC` is a pin. `jumper` (fitted by default) draws the cap joining `VCC` to `JD-VCC`.
- The lamps carry `data-lit-state` `power-led` and `status-led-1` … `status-led-n`; `indicators.power` and `status` (a list from channel 1) light them.
