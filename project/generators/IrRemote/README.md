# IrRemote

An infrared remote, the common 21-key handset from hobby kits: a `plastic-black` body 40 × 84 mm with the IR LED at the top and its keys. Provide `pressed` with a key's name. No pins: it talks to an IR receiver.

- Keys are `<g data-hook="key-<name>">` with `data-pressed`: `power`, `vol-up`, `func-stop`, `prev`, `play`, `next`, `down`, `vol-down`, `up`, `0`, `eq`, `st-rept`, `1` to `9`.
- Provide `keys` to lay out another handset: rows of up to three `[name, legend]` pairs, top to bottom, with `null` for a gap. Each key is then `key-<name>`, and the handset is as tall as its rows.
- Legends are print at `pin-label` size in `plastic-black` on the grey keys.
- Keys are dark rubber with white legends (8px digits, 5.2px words) under a lens sheen; a pressed key goes black with its legend dimmed.
