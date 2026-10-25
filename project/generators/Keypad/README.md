# Keypad

A 4 × 4 membrane keypad as it is sold: the `plastic-black` sheet, sixteen keys with their legends (the number keys `plastic-blue`, the letter and symbol keys `plastic-red`; a key is blue when its legend is a digit), and the ribbon tail with eight pins (`R1` to `R4`, `C1` to `C4`). Provide `keys` (legends row by row) and `pressed` (a matrix of 0/1).

- Each key is `<g data-hook="key-R-C">` (1-based row and column) with `data-pressed`; the editor darkens the pressed key.
- The tail's pins are `leg` kind a pitch apart, so the keypad plugs into a breadboard or a header.
- `rows` and `cols` draw a 3 × 4 or 4 × 3 keypad with the same rules.
- Legends are white at 11px, so the sheet reads at 100 %; a pressed key darkens with its legend dimmed.
