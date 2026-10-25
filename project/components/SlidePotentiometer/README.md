# SlidePotentiometer

A slide potentiometer module as photographed: a `pcb-red` board 20 mm wide and `travel` + 30 mm long with holes at the corners, the `plastic-black` potentiometer body with its `metal` cover and slot, the yellow lever at `position` 0 to 1, two resistors beside the slot, and the three pads (`A`, `SIG`, `B`) down the right end on the grid. `travel` is the slot's length in mm (60 by default).

- The lever is a `<g data-hook="lever">` with `data-position`, `data-axis="x"` and `data-travel`; the editor moves it along the slot by animating a translate, and it is the drag handle.
- The catalog's slide pot reads A as VCC and B as GND; the names stay as the catalog has them.
