# Live

The live layer: how a part shows what the circuit is doing to it, in the one colour reserved for it. `signal` means "happening now" and nothing else; the materials stay quiet so the eye goes to it. Provide the state through `live` on a part (`flow`, `heat`, `probe`) or draw the primitives yourself: `flow(x1, y1, x2, y2, on, hook)`, `probe(x, y)`, `silkMark(x, y, size, color)`.

- **Flow**: `signal` dashes over a leg of a resistor, LED or buzzer (`data-live="flow"`, hooks `flow-1`, `flow-a` and so on), drawn in the direction current runs (pin 1 to pin 2, anode to cathode, `+` to the other leg), opacity `opacity-flow` while current flows and 0 when it does not. The dashes move (the `pk-flow` rule in `bundle.css`; a host can carry the same keyframe for `[data-live="flow"]`) and stop under `prefers-reduced-motion`.
- **Heat**: a `band-red` overlay on a resistor body (`data-hook="heat"`), `opacity-heat` × how close the part is to its rating. A resistor that is about to fail is visibly hot before anything else happens.
- **Probe**: a `signal` ring with a `signal-ink` tip on a pin (`data-live="probe"`). The host draws it on the hovered or measured pin, in this style, with the `pin-tooltip` beside it.
- **The mark**: the probe on a node, in silk, where a real board prints its maker's mark. Every board template places it where there is room; narrow modules skip it.
- Draw nothing else in `signal`. A lit LED is its lens colour; a HIGH logic lead is `level-high`; a selected part is `mark-select`.
- `check(artwork)` is the kit's overlap check (see *What ships* in the brand book); every card's preview passes it, and so does a fuzz of random parts.
