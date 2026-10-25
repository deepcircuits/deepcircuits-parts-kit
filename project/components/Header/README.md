# Header

A row of pins one `pitch` apart along x or y, with labels on one side. Provide `x`, `y` of the first pin, `labels` (the pin names in order) or a `count`, `axis` (`x` or `y`), `kind` and `side`; it returns `{ svg, pins }`, so the pins go straight into the part's pin list.

- Start a header `pin-margin` (0.8 pitch) from the board edge, centred on the board: `x = (width − (n − 1) × pitch) / 2`.
- Two rows on one board are a whole number of pitches apart (DevBoard does this), so the board sits on a breadboard.
- Labels read along the row; on a vertical row put them inside the board (`right` for the left row, `left` for the right row).
