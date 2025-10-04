import type { Formatter, LogEntry } from '../types';
import { LogLevel } from '../types';

/**
 * Plain text formatter for simple output
 */
export class PlainFormatter implements Formatter {
  private includeTimestamp: boolean;

  constructor(includeTimestamp = true) {
    this.includeTimestamp = includeTimestamp;
  }

  format(entry: LogEntry): string {
    const levelName = LogLevel[entry.level].padEnd(5);
    const timestamp = this.includeTimestamp ? `[${new Date(entry.timestamp).toISOString()}] ` : '';

    let output = `${timestamp}[${entry.namespace}] ${levelName} ${entry.message}`;

    if (entry.data !== undefined) {
      output += `\n  Data: ${JSON.stringify(entry.data)}`;
    }

    if (entry.context) {
      output += `\n  Context: ${JSON.stringify(entry.context)}`;
    }

    if (entry.stack) {
      output += `\n  Stack: ${entry.stack}`;
    }

    if (entry.performance) {
      output += `\n  Performance: ${entry.performance.duration.toFixed(2)}ms`;
    }

    return output;
  }

  formatBatch(entries: LogEntry[]): string {
    return entries.map(e => this.format(e)).join('\n\n');
  }
}
