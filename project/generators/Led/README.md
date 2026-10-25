# Led

A 5 mm LED standing on the bench, seen from the front at the real size (5 mm dome, 8.6 mm tall, 5.8 mm flange): the domed epoxy on its flange, the lead frame showing through the lens as the real one is built (the thin post with its flag on the anode side, the anvil on the cathode side, a broad slab with a diagonal shoulder rising to the narrow bar that carries the reflector cup and the die, the bond wire arcing from the flag into the cup), and two tinned legs one pitch apart. Provide `color` (a lens token name or any CSS colour), `on` and `brightness`.

- Pins are `A` (anode, right) and `K` (cathode, left, under the anvil and the flange's flat), in that order, as data sheets name them.
- Unlit, the epoxy is the colour at 60% over `plastic-white`, so it reads as translucent plastic and the frame shows at 55%. Lit, the colour goes opaque (`#lens`), a halo of the same colour appears behind the dome (`#glow`, `opacity-glow` × brightness) and the frame fades to 30%. The editor animates `fill-opacity` on both ids.
- A light runs down the left of the dome and a shade down the right; the flange is a rim in the lens colour: rounded lower corners, an edge, a light along its top and a shade along its underside (`PartsKit.flange`, shared with RgbLed).
- Draw other LED sizes (3 mm, 10 mm) with the same anatomy at another dome width; keep the legs on the pitch. A board's own LEDs are indicators (Lens), not this part.
- The flange is cut short on the cathode side, the flat a hobbyist looks for; the halo reaches 0.4 pitch past the dome, so the box is 3.2 × 6.2 pitches with the legs one pitch apart at its centre. A white LED lit takes a warm tint and halo, so on and off tell apart.
