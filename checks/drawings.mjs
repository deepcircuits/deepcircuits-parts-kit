// The drawings the checks share: the suite (parts in their states, by name), the fuzz cases (templates with random
// pin names, counts, finishes and sizes) and the artworks each card's preview mounts. Each takes the kit to draw with,
// so a check can draw the same set from the bundle and from the ES modules.
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const GENERATORS = path.join(ROOT, 'project/generators');

/** The built bundle's PartsKit, loaded in a context of its own so a check can replace its functions. */
export function loadBundle() {
  const ctx = { console };
  ctx.window = ctx;
  vm.runInNewContext(readFileSync(path.join(GENERATORS, 'bundle.js'), 'utf8'), ctx);
  return ctx.PartsKit;
}

/** The suite: a fixed set of parts in their states, by name. */
export function suite(K) {
  return {
  'chip dip8': K.chipTemplate({pins:['GND','TRIG','OUT','RESET','CTRL','THR','DIS','VCC'],label:'NE555'}),
  'chip soic8': K.chipTemplate({pins:['GND','TRIG','OUT','RESET','CTRL','THR','DIS','VCC'],label:'NE555',package:'soic'}),
  'chip dip16': K.chipTemplate({pins:['Q1','Q2','Q3','Q4','Q5','Q6','Q7','GND','Q7S','MR','SHCP','STCP','OE','DS','Q0','VCC'],label:'74HC595'}),
  'resistor': K.resistor({ohms:220}), 'resistor live': K.resistor({ohms:220,live:{flow:true,heat:0.7,probe:'2'}}),
  'led off': K.led(), 'led on': K.led({on:true,live:{flow:true,probe:'A'}}),
  'button': K.pushbutton(), 'button pressed': K.pushbutton({pressed:true,cap:'red'}),
  'pot 0': K.potentiometer({position:0}), 'pot 1': K.potentiometer({position:1}),
  'switch': K.slideSwitch(), 'switch 2': K.slideSwitch({contact:3}),
  'cap': K.capacitor(), 'cap ceramic': K.capacitor({kind:'ceramic'}), 'buzzer': K.buzzer(), 'buzzer live': K.buzzer({live:{flow:true,probe:'2'}}),
  'mod bmp180': K.bmp180Board({variant:'gy68'}),
  'mod ir 3': K.moduleTemplate({label:'IR',pins:['OUT','GND','VCC'],part:'chip'}),
  'mod ds1307': K.moduleTemplate({label:'DS1307',pins:['GND','VCC','SDA','SCL','SQW'],part:'chip',finish:'blue'}),
  'mod mpu': K.moduleTemplate({label:'MPU6050',pins:['VCC','GND','SCL','SDA','XDA','XCL','AD0','INT'],part:'chip',ic:'qfn',heightPitches:5}),
  'mod dht22': K.dht22Sensor(),
  'mod dht11': K.dht11Module({indicators:{power:true}}),
  'mod mq2': K.gasModuleTemplate({label:'MQ-2'}),
  'mod mq2 lamps': K.gasModuleTemplate({label:'MQ-2', indicators:{power:true, out:true}}),
  'mod ultrasonic': K.ultrasonicRanger(),
  'mod hcsr04': K.moduleTemplate({label:'HC-SR04',pins:['VCC','TRIG','ECHO','GND'],part:'dual-can',widthPitches:18,heightPitches:8,canPitches:6,finish:'blue'}),
  'mod pir': K.pirModule(),
  'uno': K.devBoardTemplate({layout:'landscape',label:'UNO-CLASS',chipLabel:'ATMEGA328P',top:[['SCL','SDA','AREF','GND','13','12','11','10','9','8'],['7','6','5','4','3','2','1','0']],bottom:[['NC','IOREF','RESET','3V3','5V','GND','GND','VIN'],['A0','A1','A2','A3','A4','A5']],groupNames:{top:['DIGITAL (PWM ~)'],bottom:['POWER','ANALOG IN']},pwm:['3','5','6','9','10','11'],indicators:{power:true,user:true}}),
  'esp32': K.devBoardTemplate({usb:'micro',buttons:['BOOT','RST'],finish:'black',label:'ESP32-C3',chipLabel:'ESP32-C3',controller:'module',pinKind:'pad',widthPitches:8,left:['GND','3V3','3V3','2','3','GND','RST','GND','0','1','10','GND','5V','5V','GND'],right:['GND','TX','RX','GND','9','8','GND','7','6','5','4','GND','18','19','GND'],indicators:{power:true}}),
  'nano': K.devBoardTemplate({finish:'teal',label:'NANO-CLASS',chipLabel:'ATMEGA328P',pinKind:'pad',widthPitches:8,left:['D13','3V3','REF','A0','A1','A2','A3','A4','A5','A6','A7','5V','RST','GND','VIN'],right:['D12','D11','D10','D9','D8','D7','D6','D5','D4','D3','D2','GND','RST','RX0','TX1'],indicators:{power:true}}),
  'rp2040 10p': K.devBoardTemplate({finish:'green',label:'RP2040',chipLabel:'RP2040',pinKind:'pad',widthPitches:10,left:['GP0','GP1','GND','GP2','GP3','GP4','GP5','GND','GP6','GP7'],right:['VBUS','VSYS','GND','3V3','GP28','GP27','GND','GP26','RUN','GP22'],indicators:{power:false}}),
  'portrait 12p sockets': K.devBoardTemplate({finish:'teal',label:'WIDE',chipLabel:'ATMEGA328P',widthPitches:12,left:['SCL','SDA','AREF','GND','D13','D12','D11','D10'],right:['NC','IOREF','RESET','3V3','5V','GND','GND','VIN'],indicators:{power:true,user:true}}),
  'lcd 16x2': K.characterLcd({lines:['Hello, world!','220 R   13.6 mA']}), 'lcd glyphs': K.characterLcd({glyphs:[[17,17,17,31,17,17,17,0],[4,0,12,4,4,4,14,0]]}), 'lcd backpack': K.characterLcd({backpack:true}), 'lcd 20x4 backpack': K.characterLcd({cols:20,rows:4,backpack:true,color:'blue'}), 'lcd 20x4': K.characterLcd({cols:20,rows:4,color:'blue',lines:['Build it here first.']}),
  'seg 1': K.sevenSegment({value:'7'}), 'seg 4': K.sevenSegment({digits:4,value:'1234',dp:[0,1,0,0]}),
  'rgb off': K.rgbLed(), 'rgb white': K.rgbLed({r:1,g:1,b:1}), 'rgb magenta': K.rgbLed({r:1,b:1}), 'button 6': K.pushbutton({size:6}), 'button 6 pressed': K.pushbutton({size:6,pressed:true,cap:'red'}),
  'slide pot': K.slidePotentiometer({position:0.6}), 'slide pot 20': K.slidePotentiometer({travel:20,position:1}), 'dip 8': K.dipSwitch({values:[1,0,1,1,0,0,1,0]}), 'dip 4': K.dipSwitch({count:4}),
  'encoder': K.rotaryEncoder({detent:3}), 'joystick': K.joystick({x:0.8,y:-0.5}), 'keypad': K.keypad({pressed:[[0,0,0,0],[0,1,0,0]]}), 'remote': K.irRemote({pressed:'play'}), 'dialer': K.rotaryDialer({angle:60}),
  'sensor ldr': K.sensorModuleTemplate({element:'ldr',comparator:true,pins:['VCC','GND','DO','AO'],indicators:{power:true}}), 'sensor flame': K.sensorModuleTemplate({element:'flame',comparator:true,pins:['VCC','GND','DOUT','AOUT'],indicators:{power:true}}),
  'sensor sound': K.sensorModuleTemplate({element:'mic',comparator:true,pins:['AOUT','GND','VCC','DOUT'],indicators:{power:true}}), 'sensor sound small': K.sensorModuleTemplate({element:'mic',micMm:6,comparator:true,pins:['AOUT','GND','VCC','DOUT']}),
  'sensor ntc': K.sensorModuleTemplate({label:'NTC',element:'bead',pins:['GND','VCC','OUT']}), 'sensor tilt': K.sensorModuleTemplate({element:'cylinder',pins:['GND','VCC','OUT'],indicators:{power:true}}), 'sensor ir': K.sensorModuleTemplate({label:'IR RX',element:'ir',pins:['GND','VCC','DAT'],indicators:{power:true}}),
  'pulse': K.pulseSensor({on:true}), 'mod hx711': K.hx711Board(),
  'mod microsd': K.microsdModule(), 'mod rtc': K.rtcModule(), 'mod ds3231': K.ds3231Module({indicators:{power:true}}),
  'neopixel': K.neopixel({r:0,g:1,b:0.4}), 'ring 16': K.ledRing({colors:['#ff0000','#ff8800','#ffff00','#00ff00']}), 'ring 12': K.ledRing({pixels:12}), 'matrix 8': K.neopixelMatrix({colors:['#ff0000',null,'#00ff00']}), 'matrix 4': K.neopixelMatrix({rows:4,cols:4}),
  'bar': K.ledBarGraph({levels:[1,1,1,1,1,1,0.6,0,0,0]}), 'bar vertical': K.ledBarGraph({levels:[1,1,1,0.5],vertical:true,colors:['green','green','yellow','red']}), 'oled': K.oledBreakout({caption:'Hello'}), 'tft': K.tftModule({caption:'TFT'}),
  'servo': K.servo({angle:45}), 'servo -90': K.servo({angle:-90}), 'servo 90': K.servo({angle:90}), 'stepper': K.stepper(), 'stepper 28': K.stepper({frameSize:28}), 'biaxial': K.stepper({biaxial:true,angle:30,angle2:-60}), 'relay': K.relay(), 'relay on': K.relay({energised:true}),
  'mega': K.megaBoardTemplate({label:'MEGA-CLASS',chipLabel:'ATMEGA2560',top:[['SCL','SDA','AREF','GND','13','12','11','10','9','8'],['7','6','5','4','3','2','1','0'],['14','15','16','17','18','19','20','21']],block:{left:['5V','22','24','26','28','30','32','34','36','38','40','42','44','46','48','50','52','GND'],right:['5V','23','25','27','29','31','33','35','37','39','41','43','45','47','49','51','53','GND']},bottom:[['IOREF','RESET','3V3','5V','GND','GND','VIN'],['A0','A1','A2','A3','A4','A5','A6','A7'],['A8','A9','A10','A11','A12','A13','A14','A15']],groupNames:{top:['DIGITAL (PWM ~)','COMMUNICATION'],bottom:['POWER','ANALOG IN']},pwm:['2','3','4','5','6','7','8','9','10','11','12','13'],indicators:{power:true,user:true}}), 'esp devkit': K.espDevKitTemplate({label:'ESP32 DEVKIT V1',chipLabel:'ESP-WROOM-32',left:['EN','VP','VN','D34','D35','D32','D33','D25','D26','D27','D14','D12','D13','GND','VIN'],right:['D23','D22','TX0','RX0','D21','D19','D18','D5','TX2','RX2','D4','D2','D15','GND','3V3'],indicators:{power:true}}), 'franzininho': K.franzininho({label:'FRANZININHO DIY',indicators:{power:true,user:true}}), 'nano connect': K.nanoConnectTemplate({label:'NANO RP2040',chipLabel:'RP2040',left:['D12','D11','D10','D9','D8','D7','D6','D5','D4','D3','D2','GND','RESET','RX','TX'],right:['D13','3.3V','AREF','A0','A1','A2','A3','A4','A5','A6','A7','5V','REC','GND','VIN'],indicators:{power:true}}), 'nano icsp': K.devBoardTemplate({label:'NANO-CLASS',chipLabel:'ATMEGA328P',pinKind:'pad',widthPitches:7.2,labels:{'12':'D12','13':'D13','0':'RX0','1':'TX1'},icsp:['12.2','5V.2','13.2','11.2','RESET.3','GND.3'],left:['13','3V3','REF','A0','A1','A2','A3','A4','A5','A6','A7','5V','RST','GND.1','VIN'],right:['12','11','10','9','8','7','6','5','4','3','2','GND.2','RST.2','0','1'],indicators:{power:true,user:0.5}}), 'uno labels': K.devBoardTemplate({layout:'landscape',label:'UNO-CLASS',chipLabel:'ATMEGA328P',labels:{'A5.2':'SCL','A4.2':'SDA'},top:[['A5.2','A4.2','AREF','GND.1','13','12','11','10','9','8'],['7','6','5','4','3','2','1','0']],bottom:[['NC','IOREF','RESET','3V3','5V','GND.2','GND.3','VIN'],['A0','A1','A2','A3','A4','A5']],groupNames:{top:['DIGITAL (PWM ~)'],bottom:['POWER','ANALOG IN']},pwm:['3','5','6','9','10','11'],indicators:{power:true,user:0.25}}), 'mega pads': K.megaBoardTemplate({label:'MEGA-CLASS',chipLabel:'ATMEGA2560',pinKind:'pad',top:[['SCL','SDA','AREF','GND','13','12','11','10','9','8'],['7','6','5','4','3','2','1','0'],['14','15','16','17','18','19','20','21']],block:{left:['5V','22','24','26','28','30','32','34','36','38','40','42','44','46','48','50','52','GND'],right:['5V','23','25','27','29','31','33','35','37','39','41','43','45','47','49','51','53','GND']},bottom:[['IOREF','RESET','3V3','5V','GND','GND','VIN'],['A0','A1','A2','A3','A4','A5','A6','A7'],['A8','A9','A10','A11','A12','A13','A14','A15']],groupNames:{top:['DIGITAL (PWM ~)','COMMUNICATION'],bottom:['POWER','ANALOG IN']}}),
  'mux': K.muxSymbol(),
  'ff d': K.flipFlopSymbol({set:true,reset:true,srLast:true}),
  'ff dsr': K.flipFlopSymbol({set:true,reset:true}),
  'clock': K.clockGenerator(),
  'vcc': K.supplySymbol({voltage:5}),
  'note': K.noteSymbol(),
  'to92': K.to92Template(),
  'transistor to92': K.transistor(), 'transistor to92 hot': K.transistor({label:'P2N2222A',pins:['C','B','E'],live:{heat:1}}), 'transistor to220': K.transistor({package:'to-220'}), 'transistor to220 hot': K.transistor({package:'to-220',label:'NDP6020P',live:{heat:1}}),
  'strip 8': K.ledStrip({colors:['#ff0000','#00ff00','#0000ff']}),
  'strip round': K.ledStrip({pixels:4,pixelShape:'round',pixelSize:'3535'}),
  'meter': K.neopixelMeter({fps:60,pixels:16,amps:0.31,watts:1.55,peakAmps:0.42,limitAmps:0.5,status:'near'}),
  'meter idle': K.neopixelMeter(),
  'strip 2020 long': K.ledStrip({pixels:40,pixelSize:'2020',colors:[{r:1,g:0,b:0},{r:0,g:0.2,b:0}]}),
  'strip circle 3535': K.ledStrip({pixels:6,pixelShape:'circle',pixelSize:'3535'}),
  'relay module': K.relayModule(),
  'relay module on': K.relayModule({indicators:{power:true,status:true}}),
  'analyzer': K.logicAnalyzer({samples:12345,state:'recording',lit:[1,0,1,1,0,0,0,1]}),
  'rfid': K.rfidModule(),
  'oled sh1107': K.oledSquare({caption:'128x128'}),
  'oled 4pin': K.oledBreakout({pins:['GND','VCC','SCL','SDA']}),
  'matrix 1': K.max7219Matrix({lit:[['00100100','00100100','00000000','10000001','01000010','00111100','00000000','00000000']]}),
  'max7219 4': K.max7219Matrix({chain:4}),
  'matrix 32': K.max7219Matrix({chain:32}),
  'tm1637 colon': K.tm1637Module({value:'1234',colon:true}),
  'tm1637 dp': K.tm1637Module({type:'dp',value:'88.8',dp:[0,1,0,0]}),
  'nokia': K.nokiaModule({caption:'Hello'}),
  'epaper': K.epaperModule({caption:'e-paper'}),
  'tft touch': K.tftModule({touch:true,pins:['VCC','GND','CS','RST','D/C','MOSI','SCK','LED','MISO','SCL','SDA']}),
  'bb full': K.breadboard(),
  'bb half': K.breadboard({variant:'breadboard-half'}),
  'bb mini': K.breadboard({variant:'breadboard-mini'}),
  'bb full blue split occupied': K.breadboard({color:'Blue',splitRails:true,occupied:[{x:182.4,y:67.2},{x:38.4,y:9.6}]}),
  'bb half black': K.breadboard({variant:'breadboard-half',color:'black'}),
  'nucleo64': K.nucleo64BoardTemplate({label:'C031C6 BOARD',chipLabel:'STM32C031C6',left:[['PD0','PD1'],['PD2','PD2'],['VDD','E5V'],['PA14','GND'],[null,null],[null,'IOREF'],['PA13','NRST'],['PC6','3V3'],[null,'5V'],['GND','GND'],[null,'GND'],['PC13','VIN'],['PC14',null],[null,'PA0'],['PF0','PA1'],['PF1','PA4'],['PB11','PB0'],['PA2','PA11'],[null,'PA12']],right:[['PD3','PA3'],['PB8','PC15'],['PB9','PB12'],['AVDD','5V'],['GND',null],['PA5','PF3'],['PA6','PA8'],['PA7','PB12'],['PB0',null],['PC7','GND'],['PA9','PB2'],['PA15','PB1'],['PB5','PB15'],['PB4','PB14'],['PB10','PB13'],['PB3','AGND'],['PA10',null],['PB6',null],['PB7',null]],power:['IOREF','NRST','3V3','5V','GND','GND','VIN'],analog:['A0','A1','A2','A3','A4','A5'],digitalHigh:['D15','D14','AVDD','GND','D13','D12','D11','D10','D9','D8'],digitalLow:['D7','D6','D5','D4','D3','D2','D1','D0'],indicators:{power:true,user:true}}),
  'nucleo64 cn6 from pin 1': K.nucleo64BoardTemplate({label:'C031C6 BOARD',chipLabel:'STM32C031C6',left:[['PD0','PD1'],['PD2','PD2'],['VDD','E5V'],['PA14','GND'],[null,null],[null,'IOREF'],['PA13','NRST'],['PC6','3V3'],[null,'5V'],['GND','GND'],[null,'GND'],['PC13','VIN'],['PC14',null],[null,'PA0'],['PF0','PA1'],['PF1','PA4'],['PB11','PB0'],['PA2','PA11'],[null,'PA12']],right:[['PD3','PA3'],['PB8','PC15'],['PB9','PB12'],['AVDD','5V'],['GND',null],['PA5','PF3'],['PA6','PA8'],['PA7','PB12'],['PB0',null],['PC7','GND'],['PA9','PB2'],['PA15','PB1'],['PB5','PB15'],['PB4','PB14'],['PB10','PB13'],['PB3','AGND'],['PA10',null],['PB6',null],['PB7',null]],power:[null,'IOREF','NRST','3V3','5V','GND','GND','VIN'],analog:['A0','A1','A2','A3','A4','A5'],digitalHigh:['D15','D14','AVDD','GND','D13','D12','D11','D10','D9','D8'],digitalLow:['D7','D6','D5','D4','D3','D2','D1','D0'],indicators:{power:true,user:true}}),
  'nucleo32': K.nucleo32BoardTemplate({label:'L031K6 BOARD',chipLabel:'STM32L031K6',left:['D1','D0','RST','GND','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12'],right:['VIN','GND','RST','5V','A7','A6','A5','A4','A3','A2','A1','A0','REF','3V3','D13'],indicators:{power:true}}),
  'pico': K.picoBoardTemplate({label:'PICO-CLASS',chipLabel:'RP2040',left:['GP0','GP1','GND','GP2','GP3','GP4','GP5','GND','GP6','GP7','GP8','GP9','GND','GP10','GP11','GP12','GP13','GND','GP14','GP15'],right:['VBUS','VSYS','GND','3V3_EN','3V3','ADC_VREF','GP28','GND','GP27','GP26','RUN','GP22','GND','GP21','GP20','GP19','GP18','GND','GP17','GP16'],indicators:{power:false,user:true}}),
  'esp32 c3': K.devBoardTemplate({usb:'micro',buttons:['BOOT','RST'],finish:'black',label:'DEVKITM-1',chipLabel:'ESP32-C3-MINI-1',controller:'module',pinKind:'pad',widthPitches:10.6,left:['GND','3V3','3V3','2','3','GND','RST','GND','0','1','10','GND','5V','5V','GND'],right:['GND','TX','RX','GND','9','8','GND','7','6','5','4','GND','18','19','GND'],indicators:{power:true}}),
  'esp32 s3': K.devBoardTemplate({moduleSize:'wroom',usb:'dual-micro',buttons:['BOOT','RESET'],finish:'black',label:'DEVKITC-1',chipLabel:'ESP32-S3-WROOM-1',controller:'module',pinKind:'pad',widthPitches:10.6,left:['3V3','3V3','RST','4','5','6','7','15','16','17','18','8','3','46','9','10','11','12','13','14','5V','GND'],right:['GND','TX','RX','1','2','42','41','40','39','38','37','36','35','0','45','48','47','21','20','19','GND','GND'],indicators:{power:true}}),
  'esp32 c6': K.devBoardTemplate({moduleSize:'wroom',usb:'dual-c',buttons:['BOOT','RESET'],finish:'black',label:'DEVKITC-1',chipLabel:'ESP32-C6-WROOM-1',controller:'module',pinKind:'pad',widthPitches:10.6,left:['3V3','RST','4','5','6','7','0','1','8','10','11','2','3','5V','GND'],right:['GND','TX','RX','15','23','22','21','20','19','18','9','GND','13','12','GND'],indicators:{power:true}}),
  'esp32 s2': K.devBoardTemplate({usb:'micro',buttons:['BOOT','RST'],finish:'black',label:'DEVKITM-1',chipLabel:'ESP32-S2-MINI-1',controller:'module',pinKind:'pad',widthPitches:10.6,left:['3V3','0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','5V','GND'],right:['GND','RST','46','45','RX','TX','42','41','40','39','38','37','36','35','34','33','26','21','20','19','18'],indicators:{power:true}}),
  'esp32 h2': K.devBoardTemplate({usb:'dual-c',buttons:['RESET','BOOT'],finish:'black',label:'DEVKITM-1',chipLabel:'ESP32-H2-MINI-1',controller:'module',pinKind:'pad',widthPitches:10.6,left:['3V3','RST','0','1','2','3','13','14','4','5','NC','VBAT','GND','5V','GND'],right:['GND','TX','RX','10','11','25','12','8','22','GND','9','GND','27','26','GND'],indicators:{power:true}}),
  'esp32 c5': K.devBoardTemplate({moduleSize:'wroom',usb:'dual-c',buttons:['RESET','BOOT'],finish:'black',label:'DEVKITC-1',chipLabel:'ESP32-C5-WROOM-1',controller:'module',pinKind:'pad',widthPitches:10.6,left:['3V3','RST','2','3','0','1','6','7','8','9','10','26','25','5V','GND','NC0'],right:['GND','TX','RX','24','23','15','27','4','5','NC1','28','GND','14','13','GND','NC2'],indicators:{power:true}}),
  'esp devkitc v4': K.espDevKitTemplate({label:'ESP32 DEVKITC V4',chipLabel:'ESP32-WROOM-32D',layout:'devkitc',left:['3V3','EN','VP','VN','34','35','32','33','25','26','27','14','12','GND.1','13','D2','D3','CMD','5V'],right:['GND.2','23','22','TX','RX','21','GND.3','19','18','5','17','16','4','0','2','15','D1','D0','CLK'],indicators:{power:true}}),
  'bluepill': K.bluePillBoard({indicators:{power:true,user:true}}),
  'chip 165': K.chipTemplate({pins:['PL','CP','D4','D5','D6','D7','Q7_N','GND','Q7','DS','D0','D1','D2','D3','CE','VCC'],label:'74HC165'}),
  'chip nlsf595': K.chipTemplate({pins:['QB','QC','QD','QE','QF','QG','QH','GND','SQH','SCLR','SCK','RCK','OE','SI','QA','VCC'],label:'NLSF595'}),
  'chip attiny85': K.chipTemplate({pins:['PB5','PB3','PB4','GND','PB0','PB1','PB2','VCC'],label:'ATTINY85'}),
  'mod bmp180 5': K.bmp180Board(),
  'cat uno': K.unoClassBoard({indicators:{power:true,user:1}}), 'cat nano': K.nanoClassBoard(), 'cat mega': K.megaClassBoard({indicators:{power:true}}), 'cat nano rp2040': K.nanoRp2040Board(), 'cat pico': K.picoClassBoard({indicators:{power:true,user:0.5}}),
  'cat esp v1': K.esp32DevKitV1({indicators:{power:true,user:true}}), 'cat esp v4': K.esp32DevKitCV4(), 'cat esp c3': K.esp32C3DevKit(), 'cat esp s2': K.esp32S2DevKit(), 'cat esp s3': K.esp32S3DevKit({indicators:{power:true}}), 'cat esp c5': K.esp32C5DevKit(), 'cat esp c6': K.esp32C6DevKit(), 'cat esp h2': K.esp32H2DevKit(),
  'cat nucleo32': K.stm32L031K6Board(), 'cat nucleo64': K.stm32C031C6Board({indicators:{power:true}}),
  'cat light': K.lightSensor({indicators:{power:true,out:true}}), 'cat flame': K.flameSensor(), 'cat tilt': K.tiltSwitch(), 'cat sound': K.soundSensor(), 'cat sound small': K.soundSensor({small:true}), 'cat ntc': K.ntcSensor(), 'cat ir': K.irReceiver(), 'cat gas': K.gasSensor({indicators:{power:true}}), 'cat ultrasonic': K.ultrasonicRanger(), 'cat mpu6050': K.mpu6050Imu(),
  'cat 555': K.ne555Timer(), 'cat 595': K.shiftRegister595(), 'cat 165': K.shiftRegister165(), 'cat nlsf595': K.ledDriver595(), 'cat attiny85': K.attiny85(),
  'cat ssd1306': K.ssd1306Module({caption:'Hello'}), 'cat sh1107': K.sh1107Module(), 'cat ili9341 touch': K.ili9341TouchDisplay(), 'cat mfrc522': K.rfidModule(),
  'oled pixels': K.oledBreakout({pixels:{width:128,height:64,data:Array.from({length:128*64},(_,i)=>((i%128)^(i>>7))%7===0)}}), 'nokia pixels': K.nokiaModule({pixels:{width:84,height:48,data:Array.from({length:84*48},(_,i)=>(i%84)<(i/84|0))}}), 'epaper pixels': K.epaperModule({pixels:{width:296,height:128,data:Array.from({length:296*128},(_,i)=>(i%296)%40<20)}}), 'tft pixels': K.tftModule({pixels:{width:240,height:320,data:Array.from({length:240*320},(_,i)=>['#ff0000','#00ff00','#0000ff',null][(i/240|0)%4])}}), 'sh1107 pixels': K.sh1107Module({pixels:{width:128,height:128,data:Array.from({length:128*128},(_,i)=>i%3===0)}}),
  'and': K.logicSymbol({gate:'and'}), 'xnor': K.logicSymbol({gate:'xnor'}), 'and4': K.logicSymbol({gate:'and',inputs:4}),
  };
}

/** The fuzz cases, [name, make], from a fixed seed: each make draws a template with random pins, counts and sizes. */
export function fuzzCases(K) {
  let seed = 7;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const pick = a => a[Math.floor(rnd() * a.length)];
  const names = ['VCC','GND','SDA','SCL','TX','RX','D13','A0','IO18','IOREF','RESET','3V3','5V','VIN','AREF','MISO','MOSI','SCK','CS','DC','EN','NC','OUT','DATA','TRIG','ECHO','SQW','INT','XDA','GP28'];
  const fin = ['blue','green','teal','black','purple','white'];
  const cases = [];
  for (let i = 0; i < 60; i++) { const n = 3 + Math.floor(rnd() * 8); const pins = Array.from({ length: n }, () => pick(names)); cases.push(['module ' + n + ' ' + i, () => K.moduleTemplate({ label: pick(['BMP180','MPU6050','RTC','HX711','MICRO-SD','IR','MQ-135']), pins, part: pick(['chip','sensor','can','dual-can','dome','none']), finish: pick(fin), widthPitches: rnd() < 0.5 ? undefined : 5 + Math.floor(rnd() * 14), heightPitches: rnd() < 0.5 ? undefined : 4.6 + Math.floor(rnd() * 7), canPitches: rnd() < 0.3 ? 6 : undefined, vent: rnd() < 0.5 ? 'holes' : undefined })]); }
  for (let i = 0; i < 40; i++) { const rows = 4 + Math.floor(rnd() * 16); const left = Array.from({ length: rows }, () => pick(names)), right = Array.from({ length: rows }, () => pick(names)); cases.push(['portrait ' + rows + ' ' + i, () => K.devBoardTemplate({ label: pick(['NANO-CLASS','RP2040','ESP32-C3','ATTINY']), chipLabel: pick(['ATMEGA328P','RP2040','ESP32-C3']), finish: pick(fin), pinKind: pick(['socket','pad']), controller: rnd() < 0.3 ? 'module' : 'chip', widthPitches: 8 + Math.floor(rnd() * 5), left, right, indicators: { power: rnd() < 0.5, user: rnd() < 0.5 } })]); }
  for (let i = 0; i < 10; i++) { cases.push(['landscape ' + i, () => K.devBoardTemplate({ layout: 'landscape', label: 'UNO-CLASS', chipLabel: 'ATMEGA328P', finish: pick(fin), pinKind: pick(['socket','pad']), top: [Array.from({ length: 10 }, () => pick(names)), Array.from({ length: 8 }, () => pick(names))], bottom: [Array.from({ length: 8 }, () => pick(names)), Array.from({ length: 6 }, () => pick(names))], groupNames: { top: ['DIGITAL (PWM ~)'], bottom: ['POWER', 'ANALOG IN'] }, pwm: ['3', '5', '6', '9', '10', '11'], indicators: { power: rnd() < 0.5, user: rnd() < 0.5 } })]); }
  for (let i = 0; i < 20; i++) { const n = 2 * (2 + Math.floor(rnd() * 14)); cases.push(['chip ' + n + ' ' + i, () => K.chipTemplate({ pins: Array.from({ length: n }, () => pick(names)), label: pick(['NE555','74HC595','ATMEGA328P','L293D','MCP23017','PCF8574']), package: pick(['dip','soic','tssop']) })]); }
  for (const c of [[16,2],[20,4]]) for (const col of ['green','blue']) cases.push(['lcd ' + c, () => K.characterLcd({ cols: c[0], rows: c[1], color: col, lines: ['Hello, world!', 'DeepCircuits 20x4', 'Temp 23.5 C', 'Hum 41 %'] })]);
  for (const c of [[16,2],[20,4]]) for (const backpack of [false, true]) cases.push(['lcd glyphs ' + c + (backpack ? ' backpack' : ''), () => K.characterLcd({ cols: c[0], rows: c[1], backpack, glyphs: Array.from({ length: c[0] * c[1] }, (_, i) => [31, 17, 21, 21, 21, 17, 31, i % 2 ? 31 : 0]) })]);
  for (let d = 1; d <= 4; d++) cases.push(['seg ' + d, () => K.sevenSegment({ digits: d, value: '8888'.slice(0, d), dp: [1,1,1,1] })]);
  for (const g of ['and','nand','or','nor','xor','xnor','not','buffer']) for (const n of [2,3,4,8]) cases.push(['gate ' + g + n, () => K.logicSymbol({ gate: g, inputs: n })]);
  for (const v of [0, 0.25, 0.5, 0.75, 1]) cases.push(['pot ' + v, () => K.potentiometer({ position: v })]);
  for (const live of [{}, { flow: true }, { flow: true, heat: 1, probe: '1' }, { probe: '2' }]) cases.push(['resistor', () => K.resistor({ ohms: 4700, live })]);
  for (const o of [{}, { on: true }, { on: true, brightness: 0.2, live: { flow: true, probe: 'K' } }, { color: 'white', live: { probe: 'A' } }]) cases.push(['led', () => K.led(o)]);
  for (const live of [{}, { flow: true }, { flow: true, probe: '1' }, { probe: '2' }]) cases.push(['buzzer', () => K.buzzer({ live })]);
  return cases;
}

/**
 * Each card's preview script (project/generators/<Name>/preview.html), by card name, without the line that sets the
 * live token mode: the gallery and the checks draw the cards in the mode they set themselves.
 */
export function previewScripts() {
  return readdirSync(GENERATORS, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort()
    .map(name => {
      const html = readFileSync(path.join(GENERATORS, name, 'preview.html'), 'utf8');
      const script = /<script>\s*([\s\S]*?)\s*<\/script>/.exec(html)[1];
      return { name, script: script.replace(/\r\n/g, '\n').replace(/^K\.setTokenMode\("live"\);\n/m, '') };
    });
}

/** The artworks the card previews mount, drawn with K: [{ name: 'Card · caption', art }]. */
export function drawPreviews(K) {
  const out = [];
  for (const { name, script } of previewScripts()) {
    const mount = (target, art, o) => {
      out.push({ name: `${name} · ${(o && o.caption) || ''}`, art });
      return null;
    };
    const kit = { ...K, mount };
    vm.runInNewContext(script, { window: { PartsKit: kit }, document: { getElementById: () => ({}) }, console });
  }
  return out;
}
