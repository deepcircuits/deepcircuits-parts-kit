# Catalog

The library's parts that the templates draw, each as its own function: call it with no options and it draws that part, its pins, silk and options filled in. The templates (`devBoardTemplate`, `espDevKitTemplate`, `megaBoardTemplate`, `nanoConnectTemplate`, `picoBoardTemplate`, `nucleo32BoardTemplate`, `nucleo64BoardTemplate`, `sensorModuleTemplate`, `gasModuleTemplate`, `moduleTemplate`, `chipTemplate` and `to92Template`, from `@deepcircuits/parts-kit/templates`) and the parts that take their pins as options (`oledBreakout`, `oledSquare`, `tftModule`, `rfidModule`) stay for parts of your own.

| Group | Functions |
| --- | --- |
| Boards | `unoClassBoard`, `nanoClassBoard`, `megaClassBoard`, `nanoRp2040Board`, `picoClassBoard` |
| ESP32 | `esp32DevKitV1`, `esp32DevKitCV4`, `esp32C3DevKit`, `esp32S2DevKit`, `esp32S3DevKit`, `esp32C5DevKit`, `esp32C6DevKit`, `esp32H2DevKit` |
| STM32 | `stm32L031K6Board`, `stm32C031C6Board` |
| Sensors | `lightSensor`, `flameSensor`, `tiltSwitch`, `soundSensor`, `ntcSensor`, `irReceiver`, `gasSensor`, `mpu6050Imu`, `ds18b20Sensor`, `bme280Module`, `vl53l0xModule`, `max30102Module`, `lm35Sensor`, `tmp36Sensor`, `soilMoistureSensor`, `rainSensor`, `obstacleSensor`, `lineTracker`, `waterLevelSensor`, `capacitiveSoilSensor`, `voltageSensorModule`, `acs712Module` |
| Chips | `ne555Timer`, `shiftRegister595`, `shiftRegister165`, `ledDriver595`, `attiny85` |
| Modules | `ssd1306Module`, `sh1107Module`, `ili9341TouchDisplay` |

- `CATALOG` lists every library part, these and the rest, by id: its name, family, generator, the preset options that make it, the options it takes (as data, with their types, ranges and defaults) and which of them are state. `drawPart(id, options)` draws one (`drawPart('light-sensor', { indicators: { power: true } })`) and throws for an option the part does not take.
- State: a board takes `indicators: { power, user }` (the user LED lit, or a level from 0 to 1); a sensor board `indicators: { power, out }`; a screen module `caption` and `pixels`. Everything starts unlit.
- Options: a sensor or module board takes `finish` (its board colour, each part's own by default); a chip takes `package` (`dip`, `soic` or `tssop`).
- Pin names come from the data sheet or the silk; a repeated name is bare once and `.2`, `.3` after (`GND`, `GND.2`), and the silk prints it without the suffix.
- The Nano-class boards are drawn upright; a host that lays them on their side turns them.
- `soundSensor({ small: true })` is the small board with the 6 mm capsule.
