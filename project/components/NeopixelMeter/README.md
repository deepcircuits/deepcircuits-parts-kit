# NeopixelMeter

The NeoPixel meter: a small instrument with a dark readout and one `DIN` lead on the left. A reading gives `fps`, `pixels`, `amps`, `watts`, `peakAmps`, `limitAmps` and `status` (`'ok'`, `'near'` or `'over'`); the three lines print the frame rate and pixel count, the supply current and power, and the peak against the limit (`meterLines`, with currents through `formatMilliamps`), and the lamp and the bar under the lines (the peak's share of the limit) take the status colour. Without a status, or with `'idle'`, it asks for a connection.

- The readout group carries `data-status`, `data-fps`, `data-pixels` and `data-amps`; the editor regenerates the drawing with each reading.
