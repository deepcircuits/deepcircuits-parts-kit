/** Chips the catalog draws from chipTemplate, each with its real pins in order from pin 1: DIP, SOIC or TSSOP. */
import { chipTemplate } from './core.js';

/** The chip package the caller picked, else the part's own. */
function packageOf(props, own) {
  return (props && props.package) || own;
}

// Chips, pin 1 first.

/** The NE555 timer, DIP-8. */
export function ne555Timer(props) {
  return chipTemplate({
    label: 'NE555',
    package: packageOf(props, 'dip'),
    pins: ['GND', 'TRIG', 'OUT', 'RESET', 'CTRL', 'THR', 'DIS', 'VCC'],
  });
}
/** The 74HC595 shift register, DIP-16. */
export function shiftRegister595(props) {
  return chipTemplate({
    label: '74HC595',
    package: packageOf(props, 'dip'),
    pins: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'GND', 'Q7S', 'MR', 'SHCP', 'STCP', 'OE', 'DS', 'Q0', 'VCC'],
  });
}
/** The 74HC165 shift register, DIP-16. */
export function shiftRegister165(props) {
  return chipTemplate({
    label: '74HC165',
    package: packageOf(props, 'dip'),
    pins: ['PL', 'CP', 'D4', 'D5', 'D6', 'D7', 'Q7_N', 'GND', 'Q7', 'DS', 'D0', 'D1', 'D2', 'D3', 'CE', 'VCC'],
  });
}
/** The NLSF595 LED driver, TSSOP-16; pin 13 is OE (active low). */
export function ledDriver595(props) {
  return chipTemplate({
    label: 'NLSF595',
    package: packageOf(props, 'tssop'),
    pins: ['QB', 'QC', 'QD', 'QE', 'QF', 'QG', 'QH', 'GND', 'SQH', 'SCLR', 'SCK', 'RCK', 'OE', 'SI', 'QA', 'VCC'],
  });
}
/** The ATtiny85, DIP-8, its pins by port name. */
export function attiny85(props) {
  return chipTemplate({
    label: 'ATtiny85',
    package: packageOf(props, 'dip'),
    pins: ['PB5', 'PB3', 'PB4', 'GND', 'PB0', 'PB1', 'PB2', 'VCC'],
  });
}
