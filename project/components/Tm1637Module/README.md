# Tm1637Module

The TM1637 4-digit module from its photograph: a `pcb-blue` board 42 × 24 mm with the 30 × 14 mm white display package centred on its height and the four right-angle legs a pitch past its right edge, its dark face carrying four leaning digits with the colon between the second and third (`type: 'colon'`, lit by `colon`) or a point after each digit (`type: 'dp'`, lit by `dp`), four right-angle legs at the right edge (`CLK`, `DIO`, `VCC`, `GND`), two holes at the other end and the name on the silk. `value` sets the digits.

- Every bar is `data-segment="digit-segment"` (segments 0 to 6 for A to G, 7 the point) with `data-lit`; the colon dots carry `data-colon`. An unlit bar is `indicator-off-light`, as the display's segments rest.
