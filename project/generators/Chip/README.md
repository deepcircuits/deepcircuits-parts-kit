# Chip

A chip package from above: DIP, SOIC or TSSOP, pin 1 top left under the notch, numbered anticlockwise as on the data sheet. Provide `pins` (names in data-sheet order, an even count from 4 to 64), `label` (the part number) and `package`.

- A DIP's rows are `pitch-3` apart so it straddles a breadboard's channel; SOIC and TSSOP rows are `pitch-2` apart, for chips sold on breakouts.
- The body is `chip` with a `chip-edge` stroke and `radius-chip` corners; leads are `lead`, `lead-width` wide and `lead-length` long.
- Pin names sit outside the leads in `pin-name` and currentColor (`canvas-ink`), so they follow the theme; the part number is `part-number` in `chip-print`, rotated along the body, with the lot code (`DC` plus five characters from the part number) beside it in `pin-label`, the two centred as one block that stays clear of a DIP's pin numbers; a body with no room for both shows the part number alone.
- The moulding is drawn: a light along the left edge, a shade along the right, two ejector-pin rings at the ends, and a shoulder on every lead where it leaves the body.
- Use Chip for any bare IC. A chip on a module is drawn smaller by Module and carries no pin names.
