/** The templates the catalog parts are built from, for parts of your own: a board with your pin names, a breakout with your chip, a DIP with any even number of pins. */
export {
  devBoardTemplate,
  megaBoardTemplate,
  nanoConnectTemplate,
  picoBoardTemplate,
  espDevKitTemplate,
  nucleo32BoardTemplate,
  nucleo64BoardTemplate,
} from './boards.js';
export { moduleTemplate } from './modules.js';
export {
  sensorModuleTemplate,
  comparatorBoardTemplate,
  smallSensorBoardTemplate,
  gasModuleTemplate,
  to92Template,
} from './sensors.js';
export { chipTemplate } from './core.js';
