# LightBulb

A miniature incandescent bulb standing on the bench, seen from the front, the kind a flashlight takes: a 10 mm clear glass globe narrowing to its neck, a metal screw base with four turns of thread, the black insulator under it and two tinned leads two pitches apart. Inside the glass the stem rises from the neck with its two support wires, and the coiled filament is strung between their tops and held up in the middle. Provide `on` and `brightness`.

- Pins are `1` (left) and `2` (right), in that order. A filament has no polarity; the current's direction only turns the flow dashes round.
- Unlit, the glass is a pale tint over whatever is behind it, so the filament and the wires show through, and the filament is dark. Lit at a `brightness` from 0 to 1 (as bright as it looks, on the same scale as the LED: `shine`), the filament runs from a dull red through orange to a white-yellow, the glass fills with warm light, a halo of the same light widens round the globe (`data-hook="glow"`) and, from about two thirds up, the glass burns white from the filament out. The filament carries `data-level`.
- The halo and the bloom are gradients that never take the pointer, and at their widest (1.45 times the globe's radius) they stay inside the box, so a host that clips to the box shows all of the light.
- The box is 6 × 8 pitches: the globe at the top with room for its halo, the base below it and the leads one pitch either side of the middle, their pins on the box's bottom edge.
