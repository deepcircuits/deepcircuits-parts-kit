# Lens

An LED lens seen from above, used for indicators on boards, the dome on a module and any light that faces up. (A through-hole LED stands up and is the Led part.) Provide `cx`, `cy`, `r`, `color` (a lens token name such as `red`, or any plain CSS colour a part attribute carries), `on` and `brightness` (0 to 1).

- Unlit, the lens is its colour at `opacity-lens-off` over `plastic-grey`, so every colour reads as a dark version of itself.
- Lit, it is opaque and a halo of the same colour sits behind it at `opacity-glow` × brightness. A dimmed LED fades the halo first, then the lens.
- The lens carries `data-hook="lens"` and the halo `data-hook="glow"` (or `<id>-glow`), so the editor can animate `fill-opacity` by state.
- Keep the highlight: one small white ellipse at 30% unlit, 55% lit. No gradients.
