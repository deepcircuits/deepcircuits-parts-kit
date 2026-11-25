# DipSwitch

A DIP switch on the 0.3 inch footprint: `count` positions (8 by default) a pitch apart, the red body (`plastic-red`) with ON and the position numbers printed white, as photographed, and `plastic-white` sliders. Provide `values` as a list of 0/1 or booleans.

- Each slider is `<g data-hook="lever-N">` with `data-on`; the host flips it by animating its `y` between the slot's ends. The slot behind it is the `rect` with `data-slot="N"`, the area a press on that switch can take.
- Pins are numbered as on a DIP package with ON at the top: `1a` to `Na` along the bottom, left to right, then `Nb` back to `1b` along the top, the order the catalog lists them.
- Two to twelve positions; the body grows a pitch per position.
