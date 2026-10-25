# Breadboard

The solderless breadboard on the grid: `variant` `'breadboard'` (63 columns with power rails), `'breadboard-half'` (30 columns with rails) or `'breadboard-mini'` (17 columns, strips only). Rows a to e and f to j are one pitch apart, e and f three pitches apart across the channel, the rails three pitches outside them with their holes in groups of five. Row letters and column numbers print as on the real board, in `bread-print` on `bread-body`. The mini's body is the real 46 × 34.5 mm, centred in its box; the box and the holes keep their places on the grid.

- No pins: a host names the holes itself (DeepCircuits calls them `18t.d`, `tp.1`), and every hole sits on the grid.
- `color` picks the body from `BREADBOARD_COLORS`, in any case. White is the `bread-*` tokens and follows the theme; red, orange, yellow, green, blue, purple, brown and black are fixed paint, the colour the user picked, each with holes at 3:1 and print at 4.5:1 on the body (`contrast.mjs`). `breadboardColor(value)` names the colour a value picks and `breadboardPaint(value)` gives its paint.
- `splitRails` breaks the full board's `rail-plus` and `rail-minus` stripes between holes 25 and 26, as on boards whose rails are cut in half.
- `occupied` rings the holes in use in `mark-focus`, given as their centres (`{ x, y }`, in the drawing's pixels).
- The holes of a block are one path, so a full board stays near 20 KB.
