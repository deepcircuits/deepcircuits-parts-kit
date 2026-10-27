# Transistor

A transistor standing on the bench in its package, legs down, in a 4 × 8 pitch box. The legs end at the bottom edge one, two and three pitches from the left whatever the package, so a part drawn in TO-92 and one in TO-220 sit in the same three breadboard holes and a host can swap one for the other without moving a wire.

- `package`: `to-92` (the default) or `to-220`.
- `label`: the part number printed on the package, PN2222A in TO-92 and IRLZ44N in TO-220 unless given. Print the number the real part carries: leg order follows the number, not the die (a PN2222A is E, B, C from the left; a P2N2222A is C, B, E).
- `pins`: the three legs' names from the left, flat or printed face to the viewer (E, B, C in TO-92 and G, D, S in TO-220 unless given). `pins` is a prop of `transistor()`, not a catalog option, so the catalog rows `transistor-to-92` and `transistor-to-220` (`drawPart`, `<parts-kit-part>`) always name the legs E, B, C and G, D, S. For a part with another leg order (a BC547 is C, B, E; a 2N7000 is S, G, D), call `transistor()` with its `pins`.
- `live.heat` (0..1, state): how close the part is to its dissipation rating; the body warms to red through the `heat` hook, as Resistor's does.

TO-92: the 4.7 × 4.6 mm black body with its rounded shoulders, flat face forward (the same moulding as To92), the print split before the digits (PN / 2222A, 2N / 3904, P2N / 2222A), and the legs bent out from the real 1.27 mm to the pitch and run long, as an untrimmed part's are.

TO-220: the TO-220AB outline. The metal tab with its 3.6 mm hole stands 6.5 mm above the 9 mm black moulding, the part number and a lot code are printed on the moulding, and the three legs are 2.54 mm apart, each with its wide shoulder where it leaves the moulding, trimmed to the box. The moulding is drawn 10 mm wide (the outline allows 9.66 to 10.67 mm), so its edge stays inside the four pitches.

No maker's name or logo is printed; only the part number, as on the real part.
