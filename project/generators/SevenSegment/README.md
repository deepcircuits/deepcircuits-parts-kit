# SevenSegment

A seven-segment display at the 0.56 inch size: one to four digits on a `segment-face`, pin rows six pitches apart (the real 15.24 mm) with their leg stubs at the top and bottom edges. Provide `digits`, `value` (the characters to show), `color` (the lit lens) and `dp` (which decimal points are lit), or `levels` in place of `value` and `dp`.

- Each segment is an unlit bar in `segment-off` with its lit twin over it in the lens colour: `[data-segment="digit-segment"]` (the digit from 0; segments 0 to 6 for A to G, 7 the point) with `data-level`. Each digit's bars sit in a `<g data-digit>`.
- `levels` lights each segment from 0 to 1, eight a digit (A to G, then the point), for a multiplexed or dimmed display whose currents the host averages. A lit segment never shows fainter than `opacity-segment-dim`, so a dimly driven one still reads.
- Pin rows are the real packages', numbered from pin 1 at the bottom left: one digit `G F COM.2 A B` over `E D COM C DP` (the silk prints `COM` on both); two digits `A B DIG1 DIG2 F` over `C DP E D G`; three `DIG1 A F DIG2 DIG3 B` over `E D DP C G` and an unconnected leg (pin 6); four `DIG1 A F DIG2 DIG3 B CLN` over `E D DP C G DIG4 COM`. Each row is centred under the body on the pitch.
- `pins` renames the rows (`{ top, bottom }`, left to right): a repeated name carries a `.N` suffix the silk drops, and `null` is a leg the package has but does not connect.
- The digits lean ten degrees, as the real segments do.
- The four-digit display carries the colon between its second and third digits (`[data-colon]`), lit by `colon` (true, or 0 to 1) as its CLN pin drives; `showColon: false` leaves it out.
- Use the same face for a dot-matrix module: `segment-face` with `segment-off` dots.
