/**
 * DeepCircuits Parts Kit — the artwork generators on window.PartsKit, and
 * the same functions as ES modules: the root (@deepcircuits/parts-kit) and the
 * entry points /templates, /primitives, /check, /mount, /dom, /catalog and one
 * per family (/boards, /displays ...), each typed by its generated src/*.d.ts.
 * The kit is plain JavaScript; these types document it. The catalog's ids and
 * options are generated into catalog.d.ts from src/options.js.
 */
import type { DrawPart, PartId, PartOptions } from './catalog.d.ts';
export type * from './catalog.d.ts';

/** A pin position in artwork pixels; every pin of a part is a whole number of pitches from its first pin. */
export interface ArtworkPin { readonly name: string; readonly x: number; readonly y: number }
/** What every part generator returns. `svg` has explicit width and height and uses presentation attributes only. */
export interface Artwork { readonly width: number; readonly height: number; readonly svg: string; readonly pins: readonly ArtworkPin[] }
/** A drawn fragment with the pins it placed (Header). */
export interface Fragment { readonly svg: string; readonly pins: readonly ArtworkPin[] }

export type Finish = 'blue' | 'green' | 'teal' | 'black' | 'purple' | 'white' | 'red';
export type LensName = 'red' | 'green' | 'yellow' | 'blue' | 'white' | 'orange';
/** A lens token name or any plain CSS colour a part attribute carries. */
export type LensColor = LensName | string;
export type PinKind = 'pad' | 'socket' | 'smd' | 'leg';
/** How tokens() resolves colours (setTokenMode): 'values' (the default), 'vars' or 'live'. */
export type TokenMode = 'live' | 'values' | 'vars';
export type LabelSide = 'above' | 'below' | 'left' | 'right';

export interface PinProps { x: number; y: number; kind?: PinKind; label?: string; side?: LabelSide; silk?: string; size?: number; /** Stand a long label on end, reading away from the pin. */ rotate?: boolean }
export interface HeaderProps { x: number; y: number; labels?: readonly string[]; /** The pins' names, where they differ from the printed labels. */ names?: readonly string[]; count?: number; axis?: 'x' | 'y'; kind?: PinKind; side?: LabelSide; silk?: string; size?: number; rotate?: boolean }
export interface BoardProps { width: number; height: number; finish?: Finish; title?: string; titleX?: number; titleY?: number; titleSize?: number; titleAnchor?: 'start' | 'middle' | 'end'; holes?: boolean; /** The maker's mark on the silk: its top-left corner and width. */ mark?: { x: number; y: number; size?: number } }
export interface ChipProps { pins: readonly string[]; label: string; package?: 'dip' | 'soic' | 'tssop' }
/** `hook` names the lens for state (data-hook, `lens` by default; its glow is `<hook>-glow`). */
export interface LensProps { cx: number; cy: number; r?: number; color?: LensColor; on?: boolean; brightness?: number; hook?: string }
/** A board indicator's state: true lit, false off, or a level from 0 to 1 that dims its glow (an LED driven by PWM). */
export type Lit = boolean | number;
/** `hook` names the indicator for state (data-hook). */
export interface IndicatorProps { x: number; y: number; size?: number; color?: LensColor; on?: Lit; hook?: string; finish?: Finish; label?: string }
/** What the circuit is doing to a part: current along its legs (true from the first pin to the last, 'reverse' back), heat (0..1, how close to its rating), the probe on a named pin. */
export interface LiveState { flow?: boolean | 'reverse'; heat?: number; probe?: string }
export interface ResistorProps { /** The resistance in ohms (1000). */ ohms?: number; tolerance?: 5 | 10; /** The leads' spacing in pitches (4; at least 3). */ span?: number; live?: LiveState }
export interface LedProps { color?: LensColor; on?: boolean; brightness?: number; live?: LiveState }
export interface PushbuttonProps { pressed?: boolean; cap?: LensColor | 'black'; /** 12 mm (default) or the 6 mm switch. */ size?: 6 | 12 }
export interface PotentiometerProps { position?: number }
/** contact: the pin the middle pin joins, 1 (default) or 3. */
export interface SlideSwitchProps { contact?: 1 | 3 }
export interface CapacitorProps { kind?: 'electrolytic' | 'ceramic'; code?: string }
/** A battery holder from above with its two leads, + (red) one pitch and - (black) two pitches from the left at the top edge whatever the holder: 2, 4 or 6 AA cells, two 18650 cells, or a CR2032 coin cell. */
export interface BatteryHolderProps { cells?: '2xAA' | '4xAA' | '6xAA' | '2x18650' | 'CR2032' }
export interface BuzzerProps { live?: LiveState }
export interface ModuleProps { label?: string; pins?: readonly string[]; finish?: Finish; part?: 'chip' | 'sensor' | 'can' | 'dual-can' | 'dome' | 'microsd' | 'rtc' | 'none'; /** A second row of pads along the top edge (the HX711's load-cell pads). */ extraPads?: readonly string[]; /** A can's diameter in pitches (2.6 by default; 6 for the HC-SR04's 16 mm cans). */ canPitches?: number; /** A dome's diameter in pitches (3 by default; 9 for the PIR's 23 mm lens). */ domePitches?: number; /** A sensor housing's vents: slots (DHT22) or holes (DHT11). */ vent?: 'slots' | 'holes'; /** The sensor housing's plastic: white (default) or the DHT11's blue. */ housing?: 'white' | 'blue'; /** A chip module's package: a SOIC with leads (default), a metal-lid LGA with its vent hole, or a QFN with pads on four sides. */ ic?: 'soic' | 'lga' | 'qfn'; widthPitches?: number; heightPitches?: number; /** The board's true width in mm, overriding widthPitches (the GY-521 is 21). */ width?: number; /** The board's true height in mm, overriding heightPitches (the GY-521 is 16). */ height?: number; holes?: boolean; description?: string; /** false hides the maker's mark. */ mark?: boolean }
export interface DevBoardProps {
  label?: string; chipLabel?: string; finish?: Finish; pinKind?: 'socket' | 'pad'; widthPitches?: number; indicators?: { power?: Lit; user?: Lit }; description?: string;
  /** 'portrait' (default): header rows down the long sides. 'landscape': the Uno-class board, header groups along the top and bottom edges. */
  layout?: 'portrait' | 'landscape';
  /** Portrait: the controller is a chip (default) or a shielded radio module with its antenna, as on an ESP32 dev kit. */
  controller?: 'chip' | 'module';
  /** Module boards: the can's size ('mini' default, 'wroom' for the larger module), the connector(s) at the bottom ('micro' default, 'c', 'dual-c', 'dual-micro'), and the two button names left to right (EN, BOOT by default). */
  moduleSize?: 'mini' | 'wroom'; usb?: 'micro' | 'c' | 'dual-c' | 'dual-micro'; buttons?: readonly [string, string];
  /** Portrait rows, pin names top to bottom. */
  left?: readonly string[]; right?: readonly string[];
  /** The silk printed for a pin in place of its name, by pin name ({ 'A5.2': 'SCL' }); other names print without their .N suffix. */ labels?: Readonly<Record<string, string>>;
  /** Portrait chip boards: the ICSP header as six pins, named in the header's order (MISO, VCC, SCK, MOSI, RESET, GND): a 2 x 3 block at the far end between the rows, pins 2, 4 and 6 on the last row and 1, 3 and 5 a pitch beyond, as on a Nano-class board. Without it the block is drawn as holes. */
  icsp?: readonly [string, string, string, string, string, string];
  /** Landscape is the Uno-class board at its real size: top and bottom are the header groups as the board reads them left to right with the USB on the left; the gap between groups is two pitches. widthPitches, heightPitches, gapPitches and bottomStartPitches do not apply to it. */
  top?: readonly (readonly string[])[]; bottom?: readonly (readonly string[])[]; gapPitches?: number; /** Top-row pins the board marks with a ~ (PWM). */ pwm?: readonly string[];
  /** Landscape: the board's height in pitches (21) and where the bottom row starts (9). */
  heightPitches?: number; bottomStartPitches?: number;
  /** Landscape: silk names printed by each group. */
  groupNames?: { top?: readonly string[]; bottom?: readonly string[] };
  /** false hides the maker's mark. */
  mark?: boolean;
}
export interface CharacterLcdProps {
  cols?: 16 | 20; rows?: 2 | 4;
  /** Preview text per row, in a font. */
  lines?: readonly string[];
  /** Each cell's dots in place of lines: rows × cols entries in reading order, eight row bitmasks a cell, bit 4 the leftmost dot. A missing entry is a dark cell. */
  glyphs?: readonly (readonly number[] | null | undefined)[];
  /** The I2C backpack behind the module: its GND, VCC, SDA and SCL pins come out of the left edge in place of the sixteen. */
  backpack?: boolean;
  color?: 'green' | 'blue'; finish?: Finish;
  /** The names of the header shown: the sixteen parallel pins, or the backpack's four. */
  pins?: readonly string[];
  mark?: boolean;
}
export interface SevenSegmentProps {
  digits?: 1 | 2 | 3 | 4; value?: string | number; color?: LensColor; dp?: readonly (0 | 1 | boolean)[];
  /** Each segment's light from 0 to 1, eight a digit (A to G, then the point), in place of value and dp. */
  levels?: readonly number[];
  /** The four-digit display's colon, between its second and third digits: lit, or its light from 0 to 1. */
  colon?: boolean | number;
  /** false leaves the four-digit display's colon out. */
  showColon?: boolean;
  /** The pin rows, left to right: a name's .N suffix is not printed, and null is a leg the package does not connect. */
  pins?: { top: readonly (string | null)[]; bottom: readonly (string | null)[] };
}
export interface LogicSymbolProps { gate?: 'and' | 'nand' | 'or' | 'nor' | 'xor' | 'xnor' | 'not' | 'buffer'; inputs?: number; inputNames?: readonly string[]; outputName?: string }
export interface MountOptions { scale?: number; grid?: boolean; pins?: boolean; caption?: string }

export interface RgbLedProps { r?: number; g?: number; b?: number }
export interface SlidePotentiometerProps { position?: number; /** The slot's length in mm (60). */ travel?: number; finish?: Finish }
export interface DipSwitchProps { count?: number; values?: readonly (0 | 1 | boolean)[] }
export interface RotaryEncoderProps { /** Detents turned (18° each). */ detent?: number; pressed?: boolean; finish?: Finish; pins?: readonly string[]; /** The print beside the pins; the board's own CLK, DT, SW, +, GND unless pins renames them. */ labels?: readonly string[] }
export interface JoystickProps { /** -1 to 1, positive right. */ x?: number; /** -1 to 1, positive up. */ y?: number; pressed?: boolean; finish?: Finish; pins?: readonly string[]; /** The print beside the pins; the board's own GND, +5V, VRx, VRy, SW unless pins renames them. */ labels?: readonly string[] }
export interface KeypadProps { rows?: number; cols?: number; keys?: readonly (readonly string[])[]; pressed?: readonly (readonly (0 | 1 | boolean)[])[] }
export interface IrRemoteProps {
  /** The key held, by name: power, vol-up, func-stop, prev, play, next, down, vol-down, up, 0, eq, st-rept, 1 to 9, or a name from `keys`. */
  pressed?: string;
  /** Another handset's keys, row by row: up to three [name, legend] pairs a row, null for a gap. */
  keys?: readonly (readonly (readonly [string, string] | null)[])[];
}
export interface RotaryDialerProps { angle?: number; pins?: readonly string[] }
/** The small sensor boards, each laid out from its photograph by `element`: the comparator boards (ldr and flame 16.5 × 36 mm, mic 16.5 × 36 mm in red, cylinder 14 × 36 mm, each with the LM393 and the trimmer) and the small boards (bead 16 × 19 mm, ir 15 × 20 mm). The board size follows the element; `widthPitches` and `heightPitches` apply only to `element: 'none'`. */
export interface SensorModuleProps { label?: string; pins?: readonly string[]; /** The print beside the pins, in pin order, where the board prints other names than pins (DO for DOUT); pins by default. */ labels?: readonly string[]; element?: 'ldr' | 'flame' | 'mic' | 'bead' | 'cylinder' | 'ir' | 'none'; comparator?: boolean; /** The sound boards' electret capsule in mm: 9.7 by default, 6 for the small board. */ micMm?: number; /** Only for `element: 'none'`; the photographed elements set their own size. */ widthPitches?: number; /** Only for `element: 'none'`. */ heightPitches?: number; finish?: Finish; indicators?: { power?: boolean; out?: boolean }; description?: string }
export interface PulseSensorProps { on?: boolean; pins?: readonly string[] }
export interface NeopixelProps { r?: number; g?: number; b?: number; color?: string }
/** A pixel's colour: a CSS colour, or r, g and b from 0 to 1; null or undefined leaves it dark. */
export type PixelColor = string | { readonly r: number; readonly g: number; readonly b: number } | null | undefined;
export interface LedRingProps { /** 1 to 1024 (16). */ pixels?: number; colors?: readonly PixelColor[]; pins?: readonly string[] }
/** The NeoPixel matrix from its photograph: pads in the first row gap (GND, VCC, DIN) and the last (DOUT); rows and cols from 1 to 1024. */
export interface NeopixelMatrixProps { rows?: number; cols?: number; colors?: readonly PixelColor[]; pins?: readonly string[] }
export interface LedBarGraphProps { /** Each bar's light from 0 to 1, bar 1 first. */ levels?: readonly number[]; color?: LensColor; /** A lens colour per bar, for the multicolour packages; a missing one takes `color`. */ colors?: readonly (LensColor | undefined)[]; /** Stand it on end: anodes down the left, A1 at the top. */ vertical?: boolean }
/** A screen's frame, `data` row by row from the top left: falsy is dark, true or 1 lit in the panel's ink, a string a CSS colour (the TFT draws it; a monochrome panel draws it in its ink). */
export interface ScreenPixels { width: number; height: number; data: ArrayLike<number | boolean | string | null | undefined> }
/** What a screen shows: `caption` a line of text, `pixels` a frame. */
export interface ScreenPicture { caption?: string; pixels?: ScreenPixels }
/** The 0.96 inch OLED module: eight SPI names by default, four I2C names for the smaller board. */
export interface OledBreakoutProps extends ScreenPicture { pins?: readonly string[]; finish?: Finish }
/** The 2.4 inch breakout (blue by default): the catalog's pins fill the left column from the top. */
export interface TftModuleProps extends ScreenPicture { /** J2's places from the first; null leaves a place bare. */ pins?: readonly (string | null)[]; finish?: Finish; /** The 2.8 inch capacitive-touch board (50 x 86 mm) in place of the 2.4 inch one. */ touch?: boolean }
/** The micro servo; angle in degrees, -90 to 90, turns the `horn` hook (data-angle). */
export interface ServoProps { angle?: number }
/** The stepper: frameSize in mm (NEMA 17 is 42.3), biaxial for the two-rotor clock motor (angle2 turns the `rotor-2` hook), pins to rename. */
export interface StepperProps { frameSize?: number; biaxial?: boolean; angle?: number; angle2?: number; pins?: readonly string[] }
/** The symbols drawn in currentColor beside LogicSymbol. */
export interface MuxSymbolProps { pins?: readonly string[] }
export interface FlipFlopSymbolProps { set?: boolean; reset?: boolean; /** S and R after Q and NOTQ in the pin list, as the catalog's plain D type now orders them. */ srLast?: boolean }
export interface ClockGeneratorProps { label?: string }
export interface SupplySymbolProps { voltage?: number }
/** A TO-92 part in elevation (DS18B20 by default): the print splits before its digits. */
export interface To92Props { label?: string; pins?: readonly [string, string, string] }
/** A transistor standing in its package in a 4 × 8 pitch box, legs one, two and three pitches from the left at the bottom edge: `label` the part number (PN2222A in TO-92, IRLZ44N in TO-220), `pins` the legs from the left (E, B, C in TO-92, G, D, S in TO-220), `live.heat` (0..1) warms the body. */
export interface TransistorProps { package?: 'to-92' | 'to-220'; label?: string; pins?: readonly [string, string, string]; live?: { heat?: number } }
/** The WS2812 strip: pixels 1 to 1024, three pitches apart ('5050') or two ('3535'); colors by pixel index. */
export interface LedStripProps { /** 1 to 1024. */ pixels?: number; pixelSize?: '5050' | '3535' | '2020'; pixelShape?: 'square' | 'round' | 'circle'; colors?: readonly PixelColor[] }
export type MeterStatus = 'idle' | 'ok' | 'near' | 'over';
/** A meter reading; without a status (or 'idle') the meter asks for a connection. */
export interface NeopixelMeterProps { fps?: number; pixels?: number; amps?: number; watts?: number; peakAmps?: number; limitAmps?: number; status?: MeterStatus }
export interface RelayModuleProps { /** The photographed board is red. */ finish?: Finish; label?: string | false; indicators?: { power?: boolean; status?: boolean } }
export interface LogicAnalyzerProps { channels?: readonly string[]; lit?: readonly (boolean | 0 | 1)[]; samples?: number; state?: 'idle' | 'armed' | 'recording' | 'paused' | 'full' | 'error'; activity?: number; /** Accepted and ignored: the label prints the analyzer's own name and channel table. */ label?: string }
export interface RfidModuleProps { finish?: Finish; pins?: readonly string[]; label?: string; indicators?: { power?: boolean } }
/** The AMS1117-3.3 regulator module: VIN, GND and VOUT down the left edge; the power LED lit by `indicators.power`. */
export interface Ams1117ModuleProps { finish?: Finish; indicators?: { power?: boolean } }
/** The MB102 breadboard power module: the rail pins (TOP+, TOP-, BOT+, BOT-) where a breadboard's rails are, the output header (5V, 3V3, GND) over the centre channel; each rail's jumper at 5 V, 3.3 V or off, the power switch on or off, the power LED lit by `indicators.power`. */
export interface Mb102ModuleProps { power?: 'on' | 'off'; topRail?: '5' | '3.3' | 'off'; bottomRail?: '5' | '3.3' | 'off'; finish?: Finish; indicators?: { power?: boolean } }
export interface PicoBoardProps { label?: string; chipLabel?: string; finish?: Finish; left?: readonly string[]; right?: readonly string[]; indicators?: { power?: Lit; user?: Lit }; /** false draws the debug pads without returning them as pins. */ debugPins?: boolean; description?: string }
export interface Nucleo32BoardProps { label?: string; chipLabel?: string; finish?: Finish; left?: readonly string[]; right?: readonly string[]; extraPads?: readonly { name: string; dx: number; dy: number }[]; indicators?: { power?: Lit; user?: Lit }; description?: string }
export interface Dht22SensorProps { pins?: readonly string[] }
export interface Dht11ModuleProps { pins?: readonly string[]; /** The print beside the pins, in pin order, where the board prints other names than pins (DO for DOUT); pins by default. */ labels?: readonly string[]; finish?: Finish; indicators?: { power?: boolean }; description?: string }
export interface UltrasonicRangerProps { label?: string; pins?: readonly string[]; /** The print above the pins; the board's own Vcc, Trig, Echo, Gnd by default. */ labels?: readonly string[]; finish?: Finish; description?: string }
export interface Bmp180BoardProps { /** The five-pin 15 x 13 mm module (default) or the four-pin 10 x 12.5 mm GY-68. */ variant?: 'five-pin' | 'gy68'; pins?: readonly string[]; finish?: Finish }
export interface PirModuleProps { pins?: readonly string[]; finish?: Finish }
export interface GasModuleProps { label?: string; pins?: readonly string[]; /** The print beside the pins, in pin order, where the board prints other names than pins (DO for DOUT); pins by default. */ labels?: readonly string[]; finish?: Finish; indicators?: { power?: boolean; out?: boolean } }
export interface Hx711BoardProps { pins?: readonly string[]; /** The load-cell pads down the left edge. */ cellPads?: readonly string[]; finish?: Finish }
export interface MicrosdModuleProps { pins?: readonly string[]; finish?: Finish }
export interface RtcModuleProps { pins?: readonly string[]; label?: string; finish?: Finish }
/** The DS3231 module (ZS-042 layout): six pins on the right-angle header, the pass-through pads drawn but not pins. */
export interface Ds3231ModuleProps { pins?: readonly string[]; /** The print beside the pins, in pin order; pins by default. */ labels?: readonly string[]; /** The board's silk title; ZS-042 by default. */ label?: string; finish?: Finish; indicators?: { power?: boolean } }
export interface OledSquareProps extends ScreenPicture { finish?: Finish; pins?: readonly string[]; columns?: number; rows?: number; label?: string }
/** chain 1 to 32 faces; lit[face] lists eight rows of '0'/'1'; face 0 is the rightmost, nearest DIN. */
/** chain 1 is the green single module (header out of the top, output pins out of the bottom); 2 to 32 the blue FC-16 chain with the header at the right end. */
export interface Max7219MatrixProps { chain?: number; color?: LensColor; lit?: readonly (readonly string[])[] }
export interface Tm1637ModuleProps { finish?: Finish; pins?: readonly string[]; type?: 'colon' | 'dp'; value?: string; colon?: boolean; dp?: readonly (0 | 1 | boolean)[]; color?: LensColor; label?: string }
/** The Nokia 5110 module (red by default): handles on the bottom header, the top one bare. */
export interface NokiaModuleProps extends ScreenPicture { finish?: Finish; pins?: readonly string[]; label?: string }
/** The 2.9 inch e-paper carrier (black by default): eight pads along the top edge. */
export interface EpaperModuleProps extends ScreenPicture { finish?: Finish; pins?: readonly string[] }
export type BreadboardColor = 'white' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'brown' | 'black';
/** A breadboard colour's paint. */
export interface BreadboardPaint { readonly body: string; readonly edge: string; readonly hole: string; readonly print: string }
export interface BreadboardProps { variant?: 'breadboard' | 'breadboard-half' | 'breadboard-mini'; /** A BreadboardColor in any case; anything else is white. */ color?: unknown; /** Break the full board's rail stripes between holes 25 and 26. */ splitRails?: boolean; /** Ring the holes in use, by their centres. */ occupied?: readonly { x: number; y: number }[] }
/** The Nucleo-64: morpho rows as pairs in the catalog's order (left: outer then inner; right: inner then outer; null for an unconnected place), the Arduino sockets as four lists. */
export interface Nucleo64BoardProps { label?: string; chipLabel?: string; finish?: Finish; left?: readonly (readonly [string | null, string | null])[]; right?: readonly (readonly [string | null, string | null])[]; /** CN6, ending beside morpho row 12: 7 names from IOREF, or 8 with a leading null for pin 1. */ power?: readonly (string | null)[]; analog?: readonly string[]; digitalHigh?: readonly string[]; digitalLow?: readonly string[]; indicators?: { power?: Lit; user?: Lit }; mark?: boolean; description?: string }
/** The DPDT relay; energised marks the `relay` hook (data-energised). */
export interface RelayProps { energised?: boolean }
/** The Mega-class board: top groups (SCL to 8, 7 to 0, 14 to 21), the 2 x 18 block (left and right columns, row by row), the bottom groups (power, A0 to A7, A8 to A15; bottomGaps in pitches, default [3, 2]). */
export interface MegaBoardProps { /** The silk printed for a pin in place of its name, by pin name ({ 'A5.2': 'SCL' }); other names print without their .N suffix. */ labels?: Readonly<Record<string, string>>; label?: string; chipLabel?: string; finish?: Finish; pinKind?: PinKind; top?: readonly (readonly string[])[]; bottom?: readonly (readonly string[])[]; block?: { left: readonly string[]; right: readonly string[] }; bottomGaps?: readonly number[]; groupNames?: { top?: readonly string[]; bottom?: readonly string[] }; pwm?: readonly string[]; indicators?: { power?: Lit; user?: Lit }; mark?: boolean; description?: string }
/** The Franzininho DIY: side names the eight sockets down the right edge, power the three along the top. */
export interface FranzininhoProps { /** The silk printed for a pin in place of its name, by pin name ({ 'A5.2': 'SCL' }); other names print without their .N suffix. */ labels?: Readonly<Record<string, string>>; label?: string; chipLabel?: string; finish?: Finish; pinKind?: PinKind; side?: readonly string[]; power?: readonly string[]; indicators?: { power?: Lit; user?: Lit }; mark?: boolean; description?: string }
/** The ESP32 DevKit V1: left and right name the 15-pin rows top to bottom. */
/** The classic ESP32 kits: the DevKit V1 (15-pin rows) and the DevKitC V4 (19-pin rows, no user LED: userLed false). The board grows with the rows; names print without a `.N` suffix. */
export interface EspDevKitProps { /** The silk printed for a pin in place of its name, by pin name ({ 'A5.2': 'SCL' }); other names print without their .N suffix. */ labels?: Readonly<Record<string, string>>; label?: string; chipLabel?: string; finish?: Finish; pinKind?: PinKind; left?: readonly (string | null)[]; right?: readonly (string | null)[]; indicators?: { power?: Lit; user?: Lit }; userLed?: boolean; /** 'devkitc' draws the ESP32-DevKitC V4: the module over the first rows, its antenna past the board's end. 'devkit-1' draws a DevKitM-1 or DevKitC-1 at its true size: 25.4 mm wide, the rows 0.9 inch apart, the module over the first rows; a null in left or right is an unconnected place, a bare pad. */ layout?: 'devkit' | 'devkitc' | 'devkit-1'; /** devkit-1: the module, 'mini' (13.2 x 16.6 mm), 'mini-s2' (15.4 x 20.5) or 'wroom' (18 x 25.5). */ module?: 'mini' | 'mini-s2' | 'wroom'; /** devkit-1: the board's length, the module's overhang past its top edge and the first pin's distance from that edge, in millimetres. */ length?: number; overhang?: number; firstPin?: number; /** devkit-1: one micro USB between the buttons, two micro USB, or two USB-C. */ usb?: 'micro' | 'dual-micro' | 'dual-c'; /** devkit-1: the two buttons' names, left then right (a BOOT button is boot-button, the other reset-button). */ buttons?: readonly [string, string]; /** devkit-1: the USB bridge's marking. */ bridge?: string; mark?: boolean; description?: string }
/** The STM32F103C8 Blue Pill: two 20-pin rows (`top`, `bottom`, left to right) and the catalog's handle `order`; indicators light the power and PC13 LEDs. */
export interface BluePillBoardProps { label?: string; finish?: Finish; top?: readonly string[]; bottom?: readonly string[]; order?: readonly string[]; indicators?: { power?: Lit; user?: Lit }; description?: string }
/** The Nano RP2040 Connect: left and right name the 15-pin rows top to bottom; moduleLabel prints on the radio can. */
export interface NanoConnectProps { /** The silk printed for a pin in place of its name, by pin name ({ 'A5.2': 'SCL' }); other names print without their .N suffix, and RESET prints as RST. */ labels?: Readonly<Record<string, string>>; /** Names the drawing; the real board prints no name on top, so neither does the kit. */ label?: string; chipLabel?: string; moduleLabel?: string; finish?: Finish; pinKind?: PinKind; left?: readonly string[]; right?: readonly string[]; /** power: the green LED; user: the orange D13 LED; rgb: the RGB LED. */ indicators?: { power?: Lit; user?: Lit; rgb?: Lit }; mark?: boolean; description?: string }
/** A catalog board's state: its power LED, and its user LED lit or at a level from 0 to 1. */
export interface CatalogBoardState { indicators?: { power?: boolean; user?: Lit } }
/** A catalog sensor board's lamps: PWR, and DO for the comparator's output. */
export interface CatalogSensorState { indicators?: { power?: boolean; out?: boolean }; /** The board colour; each part has its own default. */ finish?: Finish }
/** A catalog module's options: its board colour. */
export interface CatalogModuleState { finish?: Finish }
/** A catalog chip's options: its package (the part's own by default). */
export interface CatalogChipState { package?: 'dip' | 'soic' | 'tssop' }
/** A catalog screen module's picture. */
export type CatalogScreenState = ScreenPicture;
/** The families the catalog sorts parts into, in the order a picker shows them (FAMILIES). */
export type CatalogFamily = 'board' | 'display' | 'sensor' | 'input' | 'output' | 'module' | 'chip' | 'passive' | 'breadboard' | 'symbol';
/** One choice of an 'enum' or 'color' option: its value, what a control calls it, and a colour to show beside it. */
export interface OptionChoice { readonly value: string | number | boolean; readonly label: string; readonly swatch?: string }
/** A value worth offering for an option, with the code that makes it when the value is long (`each`: one item of a list, for every item). */
export interface OptionExample { readonly label: string; readonly value: unknown; readonly code?: string; readonly each?: boolean }
/** One option of a catalog part, as data: what to call it, its type, its range or choices, its default, and whether it changes while the part runs. A host builds its controls from these. */
export interface OptionSpec {
  readonly type: 'boolean' | 'number' | 'integer' | 'level' | 'enum' | 'color' | 'pixel' | 'text' | 'frame' | 'point' | 'list' | 'object';
  readonly label?: string;
  readonly default?: unknown;
  /** true: the option changes while the part runs (a lit LED, a pressed key); otherwise it is how the part is made. */
  readonly state?: boolean;
  readonly min?: number; readonly max?: number; readonly step?: number; readonly unit?: string;
  readonly choices?: readonly OptionChoice[];
  /** 'text': the longest value; numeric: a number is taken too. */
  readonly maxLength?: number; readonly numeric?: boolean;
  /** 'list': each item's spec and the count the part has. */
  readonly items?: OptionSpec; readonly length?: number;
  /** 'object': its fields. */
  readonly fields?: Readonly<Record<string, OptionSpec>>;
  /** The other options this one needs to show, each with the values it needs (null: unset). See optionApplies. */
  readonly when?: Readonly<Record<string, unknown>>;
  readonly examples?: readonly OptionExample[];
  /** A value that shows the option off in a preview. */
  readonly example?: unknown;
}
/** One part in the catalog. */
export interface CatalogEntry {
  /** Stable kebab-case id, for drawPart and for storing a part: the name's slug. */
  readonly id: PartId;
  /** What to call the part in a picker. */
  readonly name: string;
  readonly family: CatalogFamily;
  /** The generator that draws it, exported from the root and the family's entry point. */
  readonly fn: keyof PartsKit;
  /** The generator's options that make this part (a 6 mm pushbutton is pushbutton { size: 6 }); a caller cannot set them. */
  readonly preset: Readonly<Record<string, unknown>>;
  /** The options a caller may set, by name. */
  readonly options: Readonly<Record<string, OptionSpec>>;
  /** The names of the options that change while the part runs. */
  readonly state: readonly string[];
  /** Other names people search for the part by (searchParts). */
  readonly aliases: readonly string[];
}
/** A part's size and pins, without its SVG (partPins). */
export interface PartLayout { readonly width: number; readonly height: number; readonly pins: readonly ArtworkPin[] }
/** The events <parts-kit-part> fires. A person operating a part (a press, a drag, a key) changes its attributes and fires `input`, then the part's own events. */
export interface PartElementEvents {
  /** After each drawing. */
  draw: CustomEvent<{ readonly artwork: Artwork }>;
  /** A person changed options: the ones that changed, such as { pressed: true } or { position: 0.42 }. */
  input: CustomEvent<Record<string, unknown>>;
  /** A press, drag or key ended with options other than when it began: the ones that differ. */
  change: CustomEvent<Record<string, unknown>>;
  /** A button or key went down: a keypad's or a remote's key by its legend or name, nothing for a part with one button. */
  press: CustomEvent<{ readonly key?: string }>;
  /** A button or key came up. */
  release: CustomEvent<{ readonly key?: string }>;
  /** The rotary encoder's shaft turned a detent: 1 clockwise, -1 back, and the detent it is at. */
  turn: CustomEvent<{ readonly steps: 1 | -1; readonly detent: number }>;
  /** The rotary dialer's wheel ran back from dialling a digit. */
  dial: CustomEvent<{ readonly digit: number }>;
}
/** An HTML element's events, with <parts-kit-part>'s own in place of the ones of the same name (input, change). */
export type PartElementEventMap = Omit<HTMLElementEventMap, keyof PartElementEvents> & PartElementEvents;
/**
 * <parts-kit-part>: a catalog part as an element. Its `type` attribute is the part's id and its other attributes are
 * the part's options. The parts a person operates (buttons, knobs, switches, the joystick, keypad, remote and dialer)
 * work by pointer and keyboard, unless the element has the `static` attribute.
 */
export interface PartElement extends HTMLElement {
  /** The catalog id of the part it draws: its `type` attribute. */
  type: string;
  /** Options set from code, over the ones its attributes give: lists and objects, such as an LCD's lines. */
  options: Readonly<Record<string, unknown>>;
  /** The last drawing, before `scale`; null before the first and after an error. */
  readonly artwork: Artwork | null;
  /** The part's pins, in the drawing's pixels before `scale`. */
  readonly pins: readonly ArtworkPin[];
  /** Why the last drawing failed, or null. */
  readonly error: string | null;
  /** A drawn element by its data-hook (lens, knob, lever-3), or null. */
  hook(name: string): Element | null;
  addEventListener<K extends keyof PartElementEventMap>(
    type: K,
    listener: (this: PartElement, event: PartElementEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof PartElementEventMap>(
    type: K,
    listener: (this: PartElement, event: PartElementEventMap[K]) => unknown,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
/** The rotary dialer's wheel as its `dial` hook carries it (dialGeometry), in drawing pixels and in degrees from +x towards +y, clockwise on screen. */
export interface DialGeometry {
  /** The wheel's centre. */
  readonly cx: number;
  readonly cy: number;
  /** The radius of the ring the finger holes sit on, and of each hole. */
  readonly ring: number;
  readonly holeRadius: number;
  /** The holes' angles at rest, for the digits 1 to 9 then 0. */
  readonly holes: readonly number[];
  /** The finger stop's angle. */
  readonly stop: number;
  /** How far the wheel is turned now. */
  readonly angle: number;
}
export interface PartsKit {
  /** Every part the kit draws, in families, with the options each one takes. */
  readonly CATALOG: readonly CatalogEntry[];
  /** The families, in the order a picker shows them. */
  readonly FAMILIES: readonly CatalogFamily[];
  /** Each family's title, as a picker shows it. */
  readonly FAMILY_TITLES: Readonly<Record<CatalogFamily, string>>;
  /** Draws catalog part `id` with `options`, the ones its entry lists. Throws for an unknown id, an unknown option (naming the nearest) or a value of the wrong type. */
  drawPart: DrawPart;
  /** A catalog part's size and pins without its SVG: drawn once for each set of options and kept. */
  partPins<Id extends PartId>(id: Id, options?: PartOptions<Id>): PartLayout;
  /** What is wrong with drawing part `id` with `options`: an unknown id or option (with the nearest name), or a value of the wrong type. Empty when the call is good. */
  checkOptions(id: string, options?: unknown): string[];
  /** The catalog entry for an id, or undefined. */
  findPart(id: string): CatalogEntry | undefined;
  /** The parts that match a search, best first, by id, name or alias, ignoring case, spaces and punctuation. Every part for an empty query. */
  searchParts(query: string): CatalogEntry[];
  /** Loads only the part's family, then resolves to a function that draws the part, checked as drawPart checks. */
  loadPart<Id extends PartId>(id: Id): Promise<(options?: PartOptions<Id>) => Artwork>;
  /** Whether an option applies beside the other values of a call (its `when`), for showing a control only when it does something. */
  optionApplies(spec: OptionSpec, values: Readonly<Record<string, unknown>>): boolean;
  /** The value an option's example gives a part: its value, or with `each`, that value for every item the part has (its chain, or the list's length). */
  exampleValue(entry: CatalogEntry, spec: OptionSpec, example: OptionExample): unknown;
  /** The entry and the props the generator gets for a call: the part's preset under the options, checked first. Throws with every problem. */
  callOf(id: string, options?: unknown): { entry: CatalogEntry; props: Record<string, unknown> };
  /** The drawing turned by quarter turns, its pins with it: 1 a quarter clockwise, -1 or 3 anticlockwise, 2 a half. */
  rotateArtwork(artwork: Artwork, quarterTurns: number): Artwork;
  /** The drawing mirrored, its pins with it: 'horizontal' swaps left and right, 'vertical' top and bottom. */
  flipArtwork(artwork: Artwork, axis: 'horizontal' | 'vertical'): Artwork;
  /** The drawing with every id and every reference to one prefixed, for a host that needs ids unique on the page. */
  scopeIds(artwork: Artwork, prefix: string): Artwork;
  /** The drawing as a data: URL for an <img>, a canvas or a CSS background; `ink` colours what stands on the canvas (a chip's pin names). */
  toDataUrl(artwork: Artwork, options?: { ink?: string }): string;
  /** Shows a drawing in `host`, changing only what differs from the one there, so focus, pointer capture and the host's own attributes survive a redraw. */
  patchSvg(host: Element, drawing: Artwork | string): void;
  /** Brings one drawn SVG node to another, child by child, keeping every element with a data-hook that is still drawn. */
  syncSvg(current: Node, next: Node): void;
  /** A drawn element by its data-hook (lens, knob, lever-3) inside `host`, or null. */
  findHook(host: ParentNode, hook: string): Element | null;
  /** Defines the part element as `name` (parts-kit-part, which importing @deepcircuits/parts-kit/element in a page defines) and returns its class. Needs a page. */
  definePartElement(name?: string): { new (): PartElement; prototype: PartElement };
  /** The options that attributes give part `id`, as <parts-kit-part> reads them: lowercase or kebab-case names, an object's fields after it (live-flow), on="" as true, lists and objects as JSON. */
  optionsFromAttributes(
    id: string,
    attributes: Iterable<{ readonly name: string; readonly value: string } | readonly [string, string]> | Readonly<Record<string, string>>,
  ): Record<string, unknown>;
  /** The degrees from a to b, the short way round: -180 to 180. */
  angleBetween(a: number, b: number): number;
  /** The position, 0 to 1, a point at (dx, dy) drawing pixels from a potentiometer's knob centre (the `knob` hook's data-cx and data-cy) turns it to: clockwise from -135° to 135° of straight up. Below the knob, a knob near an end keeps that end. */
  knobPosition(dx: number, dy: number, previous: number): number;
  /** The rotary encoder detents a drag round its knob has passed since angle `from` (positive clockwise, twenty to a turn), and the angle the next count starts from. */
  detentsTurned(from: number, to: number): { readonly detents: number; readonly from: number };
  /** The rotary dialer's geometry from its `dial` hook, or undefined when the element does not carry it. */
  dialGeometry(dial: Element | null | undefined): DialGeometry | undefined;
  /** The digit whose finger hole holds drawing point (x, y), allowing `reach` pixels past its edge, or undefined. */
  dialDigitAt(geometry: DialGeometry, x: number, y: number, reach?: number): number | undefined;
  /** How far the wheel turns, clockwise in degrees, to bring a digit's hole to the finger stop. */
  dialTravel(geometry: Pick<DialGeometry, 'holes' | 'stop'>, digit: number): number;
  /** 9.6: 0.1 inch in CSS pixels at 96 dpi. */
  readonly PITCH: number;
  /** The palette and metrics, resolved by the token mode: tokens.json's values (the default), CSS variables, or the page's live values. */
  tokens(): Record<string, string | number>;
  /** 'values' (default): tokens.json's light values, the same on any page. 'vars': every colour as var(--<prefix><token>, value), so artwork follows the page's theme. 'live': the page's --<prefix><token> values, read at most every 50 ms, else tokens.json's. */
  setTokenMode(mode: TokenMode, options?: { prefix?: string }): void;
  tokenMode(): { mode: TokenMode; prefix: string };
  pinsOnPitch(pins: readonly ArtworkPin[], tolerance?: number): boolean;
  formatOhms(ohms: number): string;
  resistorBands(ohms: number, tolerance?: 5 | 10): [string, string, string, string];
  lensColor(tokens: Record<string, string | number>, value: unknown): string;
  readonly FINISHES: Record<Finish, { board: string; edge: string; silk: string; indicatorOff: string }>;
  /** The breadboard body colours, white (the bread-* tokens) first. */
  readonly BREADBOARD_COLORS: readonly BreadboardColor[];
  /** The colour a `color` value names, in any case; anything else is white. */
  breadboardColor(value: unknown): BreadboardColor;
  /** A colour's paint; white resolves the bread-* tokens. */
  breadboardPaint(value: unknown, tokens?: Record<string, string | number>): BreadboardPaint;
  svg(width: number, height: number, label: string, inner: string): string;
  // Primitives: fragments to compose into a part.
  pin(props: PinProps): string;
  header(props: HeaderProps): Fragment;
  board(props: BoardProps): string;
  lens(props: LensProps): string;
  indicator(props: IndicatorProps): string;
  // The live layer.
  /** Signal dashes along a leg, data-live="flow", opacity 0 until on; 'reverse' runs them back. `hook` names them for state. */
  flow(x1: number, y1: number, x2: number, y2: number, on?: boolean | 'reverse', hook?: string): string;
  /** The probe on a pin: a signal ring with a signal-ink tip. */
  probe(x: number, y: number): string;
  /** The maker's mark in one ink (the board's silk). */
  silkMark(x: number, y: number, size: number, color: string): string;
  /** A tinned wire leg. */
  wire(x1: number, y1: number, x2: number, y2: number): string;
  /** The bench light's bevel on a box: a light path along the top and left edges, a shade path along the bottom and right, each `d` wide. */
  bevel(tokens: Record<string, string | number>, x: number, y: number, w: number, h: number, d?: number, rx?: number): string;
  /** The bevel of any outline: edges facing up or left take the light, those facing down or right the shade. */
  bevelPoly(tokens: Record<string, string | number>, points: readonly (readonly [number, number])[], d?: number): string;
  // Parts: complete artwork.
  chipTemplate(props: ChipProps): Artwork;
  resistor(props?: ResistorProps): Artwork;
  led(props?: LedProps): Artwork;
  pushbutton(props?: PushbuttonProps): Artwork;
  rgbLed(props?: RgbLedProps): Artwork;
  slidePotentiometer(props?: SlidePotentiometerProps): Artwork;
  dipSwitch(props?: DipSwitchProps): Artwork;
  rotaryEncoder(props?: RotaryEncoderProps): Artwork;
  joystick(props?: JoystickProps): Artwork;
  keypad(props?: KeypadProps): Artwork;
  irRemote(props?: IrRemoteProps): Artwork;
  rotaryDialer(props?: RotaryDialerProps): Artwork;
  sensorModuleTemplate(props?: SensorModuleProps): Artwork;
  /** The comparator sensor boards sensorModule draws for 'ldr', 'flame', 'mic' and 'cylinder'. */
  comparatorBoardTemplate(props: SensorModuleProps & { micMm?: number }): Artwork;
  /** The three-pin sensor boards sensorModule draws for 'bead' and 'ir'. */
  smallSensorBoardTemplate(props: SensorModuleProps): Artwork;
  pulseSensor(props?: PulseSensorProps): Artwork;
  neopixel(props?: NeopixelProps): Artwork;
  ledRing(props?: LedRingProps): Artwork;
  neopixelMatrix(props?: NeopixelMatrixProps): Artwork;
  ledBarGraph(props?: LedBarGraphProps): Artwork;
  oledBreakout(props?: OledBreakoutProps): Artwork;
  tftModule(props?: TftModuleProps): Artwork;
  servo(props?: ServoProps): Artwork;
  stepper(props?: StepperProps): Artwork;
  relay(props?: RelayProps): Artwork;
  megaBoardTemplate(props?: MegaBoardProps): Artwork;
  franzininho(props?: FranzininhoProps): Artwork;
  espDevKitTemplate(props?: EspDevKitProps): Artwork;
  bluePillBoard(props?: BluePillBoardProps): Artwork;
  // Catalog parts: each library part the templates draw, as its own function with its pins and options filled in.
  unoClassBoard(state?: CatalogBoardState): Artwork;
  /** Upright, the USB at the top. */
  nanoClassBoard(state?: CatalogBoardState): Artwork;
  megaClassBoard(state?: CatalogBoardState): Artwork;
  /** Upright, the USB at the bottom. */
  nanoRp2040Board(state?: CatalogBoardState): Artwork;
  picoClassBoard(state?: CatalogBoardState): Artwork;
  esp32DevKitV1(state?: CatalogBoardState): Artwork;
  /** No user LED: only `indicators.power` applies. */
  esp32DevKitCV4(state?: CatalogBoardState): Artwork;
  esp32C3DevKit(state?: CatalogBoardState): Artwork;
  esp32S2DevKit(state?: CatalogBoardState): Artwork;
  esp32S3DevKit(state?: CatalogBoardState): Artwork;
  esp32C5DevKit(state?: CatalogBoardState): Artwork;
  esp32C6DevKit(state?: CatalogBoardState): Artwork;
  esp32H2DevKit(state?: CatalogBoardState): Artwork;
  stm32L031K6Board(state?: CatalogBoardState): Artwork;
  stm32C031C6Board(state?: CatalogBoardState): Artwork;
  lightSensor(state?: CatalogSensorState): Artwork;
  flameSensor(state?: CatalogSensorState): Artwork;
  tiltSwitch(state?: CatalogSensorState): Artwork;
  /** `small`: the 6 mm capsule on the small board. */
  soundSensor(state?: CatalogSensorState & { small?: boolean }): Artwork;
  ntcSensor(state?: CatalogModuleState): Artwork;
  irReceiver(state?: CatalogModuleState): Artwork;
  gasSensor(state?: CatalogSensorState): Artwork;
  mpu6050Imu(state?: CatalogModuleState): Artwork;
  ne555Timer(state?: CatalogChipState): Artwork;
  shiftRegister595(state?: CatalogChipState): Artwork;
  shiftRegister165(state?: CatalogChipState): Artwork;
  ledDriver595(state?: CatalogChipState): Artwork;
  attiny85(state?: CatalogChipState): Artwork;
  /** A transistor in TO-92 (PN2222A: E, B, C) or TO-220 (IRLZ44N: G, D, S), the same pins whatever the package. */
  transistor(props?: TransistorProps): Artwork;
  ssd1306Module(state?: CatalogScreenState): Artwork;
  sh1107Module(state?: CatalogScreenState): Artwork;
  ili9341TouchDisplay(state?: CatalogScreenState): Artwork;
  nanoConnectTemplate(props?: NanoConnectProps): Artwork;
  muxSymbol(props?: MuxSymbolProps): Artwork;
  flipFlopSymbol(props?: FlipFlopSymbolProps): Artwork;
  clockGenerator(props?: ClockGeneratorProps): Artwork;
  supplySymbol(props?: SupplySymbolProps): Artwork;
  noteSymbol(): Artwork;
  to92Template(props?: To92Props): Artwork;
  /** The DS18B20 temperature sensor in its TO-92 package: GND, DQ, VDD. */
  ds18b20Sensor(): Artwork;
  ledStrip(props?: LedStripProps): Artwork;
  readonly LED_STRIP_MAX_PIXELS: number;
  neopixelMeter(props?: NeopixelMeterProps): Artwork;
  /** The meter's three readout lines for a reading (the third empty when idle). */
  meterLines(props?: NeopixelMeterProps): [string, string, string];
  /** A current in amps as the meter prints it in milliamps. */
  formatMilliamps(amps: number): string;
  relayModule(props?: RelayModuleProps): Artwork;
  logicAnalyzer(props?: LogicAnalyzerProps): Artwork;
  rfidModule(props?: RfidModuleProps): Artwork;
  picoBoardTemplate(props?: PicoBoardProps): Artwork;
  nucleo32BoardTemplate(props?: Nucleo32BoardProps): Artwork;
  dht22Sensor(props?: Dht22SensorProps): Artwork;
  dht11Module(props?: Dht11ModuleProps): Artwork;
  ultrasonicRanger(props?: UltrasonicRangerProps): Artwork;
  bmp180Board(props?: Bmp180BoardProps): Artwork;
  pirModule(props?: PirModuleProps): Artwork;
  gasModuleTemplate(props?: GasModuleProps): Artwork;
  hx711Board(props?: Hx711BoardProps): Artwork;
  microsdModule(props?: MicrosdModuleProps): Artwork;
  rtcModule(props?: RtcModuleProps): Artwork;
  ds3231Module(props?: Ds3231ModuleProps): Artwork;
  /** The AMS1117-3.3 regulator module (VIN, GND, VOUT). */
  ams1117Module(props?: Ams1117ModuleProps): Artwork;
  /** The MB102 breadboard power module, its rail pins on a breadboard's rails. */
  mb102Module(props?: Mb102ModuleProps): Artwork;
  oledSquare(props?: OledSquareProps): Artwork;
  max7219Matrix(props?: Max7219MatrixProps): Artwork;
  tm1637Module(props?: Tm1637ModuleProps): Artwork;
  nokiaModule(props?: NokiaModuleProps): Artwork;
  epaperModule(props?: EpaperModuleProps): Artwork;
  breadboard(props?: BreadboardProps): Artwork;
  nucleo64BoardTemplate(props?: Nucleo64BoardProps): Artwork;
  potentiometer(props?: PotentiometerProps): Artwork;
  slideSwitch(props?: SlideSwitchProps): Artwork;
  capacitor(props?: CapacitorProps): Artwork;
  /** A battery holder with its red and black leads (+, -). */
  batteryHolder(props?: BatteryHolderProps): Artwork;
  buzzer(props?: BuzzerProps): Artwork;
  moduleTemplate(props: ModuleProps): Artwork;
  devBoardTemplate(props: DevBoardProps): Artwork;
  characterLcd(props?: CharacterLcdProps): Artwork;
  sevenSegment(props?: SevenSegmentProps): Artwork;
  logicSymbol(props?: LogicSymbolProps): Artwork;
  /** The overlap check: text on text, text on a part, part on a part, anything outside the box. Empty for a part that ships. */
  check(artwork: Artwork): { kind: 'text-on-text' | 'text-on-part' | 'part-on-part' | 'outside'; a: string; b?: string }[];
  /** Traces under the mask, vias, a top-view electrolytic, a chip's lot code. */
  trace(tokens: Record<string, string | number>, finish: Finish, points: readonly (readonly [number, number])[]): string;
  via(tokens: Record<string, string | number>, x: number, y: number): string;
  capTop(tokens: Record<string, string | number>, x: number, y: number, r: number): string;
  /** A USB receptacle from above in its box, the mouth at one edge: the folded shell with sheen and seam, rear tabs, latch windows and the dark opening. */
  usbPort(tokens: Record<string, string | number>, props: { kind?: 'micro' | 'mini' | 'c'; x: number; y: number; w: number; h: number; mouth?: 'down' | 'up' | 'left' | 'right' }): string;
  lotCode(partNumber: string): string;
  /** A USB-C receptacle centred on cx (usbPort with kind 'c'). */
  usbC(tokens: Record<string, string | number>, cx: number, y: number, w: number, h: number, mouth?: 'down' | 'up' | 'left' | 'right'): string;
  /** Preview helper: draws an Artwork at `scale` over a pitch grid aligned to its first pin. */
  mount(target: HTMLElement, artwork: Artwork, options?: MountOptions): HTMLElement;
}

declare global { interface Window { PartsKit: PartsKit } }
