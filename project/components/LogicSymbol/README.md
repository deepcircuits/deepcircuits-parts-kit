# LogicSymbol

An IEEE distinctive-shape logic gate drawn in currentColor, so it reads in `canvas-ink` on either theme. Provide `gate` (`and`, `nand`, `or`, `nor`, `xor`, `xnor`, `not`, `buffer`), `inputs` (2 to 8) and optional `inputNames` and `outputName`.

- Inputs are `pitch-2` apart and the output is centred, so every pin is on the grid; strokes are `stroke-symbol`.
- The output lead carries `data-level-pin` with the output's pin index: the editor recolours it `level-high` or `level-low` from the solved voltage.
- This is the one family with no fixed material: never give a symbol a fill or a colour of its own.
