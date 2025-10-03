/**
 * Terminal color utilities
 * Replaces external picocolors dependency
 */

const isColorSupported =
  typeof process !== 'undefined' &&
  process.stdout &&
  process.stdout.isTTY &&
  process.env.TERM !== 'dumb' &&
  !process.env.NO_COLOR;

function createColor(open: number, close: number) {
  return isColorSupported
    ? (str: string | number) => `\x1b[${open}m${str}\x1b[${close}m`
    : (str: string | number) => String(str);
}

export const colors = {
  // Text colors
  black: createColor(30, 39),
  red: createColor(31, 39),
  green: createColor(32, 39),
  yellow: createColor(33, 39),
  blue: createColor(34, 39),
  magenta: createColor(35, 39),
  cyan: createColor(36, 39),
  white: createColor(37, 39),
  gray: createColor(90, 39),

  // Background colors
  bgBlack: createColor(40, 49),
  bgRed: createColor(41, 49),
  bgGreen: createColor(42, 49),
  bgYellow: createColor(43, 49),
  bgBlue: createColor(44, 49),
  bgMagenta: createColor(45, 49),
  bgCyan: createColor(46, 49),
  bgWhite: createColor(47, 49),

  // Styles
  bold: createColor(1, 22),
  dim: createColor(2, 22),
  italic: createColor(3, 23),
  underline: createColor(4, 24),
  inverse: createColor(7, 27),
  hidden: createColor(8, 28),
  strikethrough: createColor(9, 29),

  // Reset
  reset: createColor(0, 0),

  // Helpers
  isColorSupported,
};
