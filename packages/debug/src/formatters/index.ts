export { JSONFormatter } from './json';
export { HTMLFormatter } from './html';
export { MarkdownFormatter } from './markdown';
export { PlainFormatter } from './plain';

import type { Formatter } from '../types';
import { OutputFormat } from '../types';

import { HTMLFormatter } from './html';
import { JSONFormatter } from './json';
import { MarkdownFormatter } from './markdown';
import { PlainFormatter } from './plain';

/**
 * Get formatter for specific output format
 */
export function getFormatter(format: OutputFormat): Formatter {
  switch (format) {
    case OutputFormat.JSON:
      return new JSONFormatter();
    case OutputFormat.HTML:
      return new HTMLFormatter();
    case OutputFormat.MARKDOWN:
      return new MarkdownFormatter();
    case OutputFormat.PLAIN:
      return new PlainFormatter();
    case OutputFormat.CONSOLE:
    default:
      return new PlainFormatter();
  }
}
