import type { Formatter, LogEntry } from '../types';

/**
 * JSON formatter for structured log output
 */
export class JSONFormatter implements Formatter {
  private pretty: boolean;

  constructor(pretty = true) {
    this.pretty = pretty;
  }

  format(entry: LogEntry): string {
    return JSON.stringify(entry, null, this.pretty ? 2 : 0);
  }

  formatBatch(entries: LogEntry[]): string {
    return JSON.stringify(entries, null, this.pretty ? 2 : 0);
  }

  /**
   * Format as NDJSON (Newline Delimited JSON) for streaming
   */
  formatNDJSON(entries: LogEntry[]): string {
    return entries.map(entry => JSON.stringify(entry)).join('\n');
  }
}
