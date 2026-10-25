# Pin

One pin as drawn on a part: a gold through-hole pad, a socket in a black header, an SMD pad, or a bare leg end. Provide `x`, `y` (artwork pixels; a whole number of `pitch` from the part's first pin), `kind` (`pad`, `socket`, `smd`, `leg`), and an optional `label` with its `side` (`above`, `below`, `left`, `right`) and `silk` colour.

- A pad is `pad` with a `hole` inside, radii `pad-radius` and `hole-radius`, the hole ringed in `metal-edge` for the plating. The hole shows the canvas, so it is white in the light theme and follows the theme in the dark one.
- A socket is a `pitch`-square `plastic-black` housing with a `cavity` square: use it for female headers on boards people plug wires into.
- Labels are `pin-label` (4px, the smallest print on any part: 3pt at the kit's scale) in the board's silk, `label-rise` above or `label-drop` below the pad centre.
- Don't draw the editor's pin handle; the canvas adds it over the pad.
