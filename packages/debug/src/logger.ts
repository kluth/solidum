import type {
  LogEntry,
  LogLevel,
  LogSubscriber,
  LoggerConfig,
  OutputFormat,
  PerformanceEntry,
  Formatter,
} from './types';
import { LogLevel as Level } from './types';

/**
 * Core debug logger with support for levels, namespaces, and streaming
 */
export class Logger {
  private config: Required<LoggerConfig>;
  private subscribers: Set<LogSubscriber> = new Set();
  private entries: LogEntry[] = [];
  private performances: Map<string, number> = new Map();

  constructor(config: LoggerConfig = {}) {
    this.config = {
      level: config.level ?? Level.INFO,
      enabled: config.enabled ?? true,
      namespace: config.namespace ?? 'app',
      format: config.format ?? ('console' as OutputFormat),
      includeTimestamp: config.includeTimestamp ?? true,
      includeStack: config.includeStack ?? false,
      maxEntries: config.maxEntries ?? 1000,
      persistent: config.persistent ?? false,
    };

    // Load persistent logs if enabled
    if (this.config.persistent && typeof localStorage !== 'undefined') {
      this.loadPersistedLogs();
    }
  }

  /**
   * Create a child logger with a specific namespace
   */
  namespace(ns: string): Logger {
    return new Logger({
      ...this.config,
      namespace: `${this.config.namespace}:${ns}`,
    });
  }

  /**
   * Log a trace message
   */
  trace(message: string, data?: unknown, context?: Record<string, unknown>): void {
    this.log(Level.TRACE, message, data, context);
  }

  /**
   * Log a debug message
   */
  debug(message: string, data?: unknown, context?: Record<string, unknown>): void {
    this.log(Level.DEBUG, message, data, context);
  }

  /**
   * Log an info message
   */
  info(message: string, data?: unknown, context?: Record<string, unknown>): void {
    this.log(Level.INFO, message, data, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: unknown, context?: Record<string, unknown>): void {
    this.log(Level.WARN, message, data, context);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    const stack = error instanceof Error ? error.stack : undefined;
    this.log(Level.ERROR, message, error, context, stack);
  }

  /**
   * Log a fatal message
   */
  fatal(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    const stack = error instanceof Error ? error.stack : undefined;
    this.log(Level.FATAL, message, error, context, stack);
  }

  /**
   * Start a performance measurement
   */
  timeStart(label: string): void {
    this.performances.set(label, performance.now());
  }

  /**
   * End a performance measurement and log it
   */
  timeEnd(label: string, data?: unknown): PerformanceEntry | undefined {
    const startTime = this.performances.get(label);
    if (!startTime) {
      this.warn(`Performance measurement "${label}" was never started`);
      return undefined;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    this.performances.delete(label);

    const perfEntry: PerformanceEntry = {
      name: label,
      duration,
      startTime,
      endTime,
    };

    // Include memory info if available
    const perfWithMemory = performance as unknown as {
      memory?: { usedJSHeapSize: number; totalJSHeapSize: number };
    };
    if (typeof perfWithMemory.memory !== 'undefined') {
      const mem = perfWithMemory.memory;
      perfEntry.memory = {
        used: mem.usedJSHeapSize,
        total: mem.totalJSHeapSize,
      };
    }

    this.debug(`⏱️  ${label}: ${duration.toFixed(2)}ms`, data, {
      performance: perfEntry,
    });

    return perfEntry;
  }

  /**
   * Measure async operation performance
   */
  async timeAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.timeStart(label);
    try {
      const result = await fn();
      this.timeEnd(label);
      return result;
    } catch (error) {
      this.timeEnd(label);
      throw error;
    }
  }

  /**
   * Group related log messages
   */
  group(label: string): void {
    if (this.config.enabled && this.config.level <= Level.DEBUG) {
      // eslint-disable-next-line no-console
      console.group(label);
    }
  }

  /**
   * End a log group
   */
  groupEnd(): void {
    if (this.config.enabled && this.config.level <= Level.DEBUG) {
      // eslint-disable-next-line no-console
      console.groupEnd();
    }
  }

  /**
   * Log a table
   */
  table(data: unknown): void {
    if (this.config.enabled && this.config.level <= Level.DEBUG) {
      // eslint-disable-next-line no-console
      console.table(data);
    }
  }

  /**
   * Subscribe to log stream
   */
  subscribe(subscriber: LogSubscriber): () => void {
    this.subscribers.add(subscriber);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return () => this.subscribers.delete(subscriber!);
  }

  /**
   * Get all log entries
   */
  getEntries(filter?: { level?: LogLevel; namespace?: string }): LogEntry[] {
    let filtered = [...this.entries];

    if (filter?.level !== undefined) {
      const levelFilter = filter.level;
      filtered = filtered.filter(e => e.level >= levelFilter);
    }

    if (filter?.namespace) {
      const namespaceFilter = filter.namespace;
      filtered = filtered.filter(e => e.namespace.includes(namespaceFilter));
    }

    return filtered;
  }

  /**
   * Clear all log entries
   */
  clear(): void {
    this.entries = [];
    if (this.config.persistent && typeof localStorage !== 'undefined') {
      localStorage.removeItem(`debug:${this.config.namespace}`);
    }
  }

  /**
   * Export logs in various formats
   */
  export(format: OutputFormat = this.config.format): string {
    const formatter = this.getFormatter(format);
    return formatter.formatBatch(this.entries);
  }

  /**
   * Enable/disable logging
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    data?: unknown,
    context?: Record<string, unknown>,
    stack?: string
  ): void {
    if (!this.config.enabled || level < this.config.level) {
      return;
    }

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      namespace: this.config.namespace,
      message,
      data,
      context,
      stack: stack ?? (this.config.includeStack ? new Error().stack : undefined),
    };

    // Store entry
    this.entries.push(entry);

    // Limit entries
    if (this.entries.length > this.config.maxEntries) {
      this.entries.shift();
    }

    // Persist if enabled
    if (this.config.persistent && typeof localStorage !== 'undefined') {
      this.persistLogs();
    }

    // Notify subscribers
    this.subscribers.forEach(subscriber => subscriber(entry));

    // Console output
    this.outputToConsole(entry);
  }

  /**
   * Output to console
   */
  private outputToConsole(entry: LogEntry): void {
    const levelColors = ['#888', '#0af', '#0f0', '#fa0', '#f00', '#f0f'];
    const levelEmojis = ['🔍', '🐛', 'ℹ️', '⚠️', '❌', '💀'];

    const timestamp = this.config.includeTimestamp
      ? `[${new Date(entry.timestamp).toISOString()}]`
      : '';

    const namespace = `[${entry.namespace}]`;
    const level = levelEmojis[entry.level];
    const message = entry.message;

    const output = `${timestamp} ${namespace} ${level} ${message}`;

    const consoleMethod = ['log', 'log', 'info', 'warn', 'error', 'error'][entry.level] as
      | 'log'
      | 'info'
      | 'warn'
      | 'error';

    // eslint-disable-next-line no-console
    console[consoleMethod](`%c${output}`, `color: ${levelColors[entry.level]}; font-weight: bold;`);

    if (entry.data !== undefined) {
      // eslint-disable-next-line no-console
      console[consoleMethod]('Data:', entry.data);
    }

    if (entry.context) {
      // eslint-disable-next-line no-console
      console[consoleMethod]('Context:', entry.context);
    }

    if (entry.stack) {
      // eslint-disable-next-line no-console
      console[consoleMethod]('Stack:', entry.stack);
    }
  }

  /**
   * Get formatter for output format
   */
  private getFormatter(_format: OutputFormat): Formatter {
    // Formatters will be implemented in formatters module
    return {
      format: (entry: LogEntry) => JSON.stringify(entry, null, 2),
      formatBatch: (entries: LogEntry[]) => JSON.stringify(entries, null, 2),
    };
  }

  /**
   * Load persisted logs
   */
  private loadPersistedLogs(): void {
    try {
      const stored = localStorage.getItem(`debug:${this.config.namespace}`);
      if (stored) {
        this.entries = JSON.parse(stored);
      }
    } catch {
      // Failed to load - continue without persisted logs
    }
  }

  /**
   * Persist logs to localStorage
   */
  private persistLogs(): void {
    try {
      const toStore = this.entries.slice(-this.config.maxEntries);
      localStorage.setItem(`debug:${this.config.namespace}`, JSON.stringify(toStore));
    } catch {
      // Failed to persist - continue without persistence
    }
  }
}

/**
 * Create a default logger instance
 */
export const createLogger = (config?: LoggerConfig): Logger => {
  return new Logger(config);
};

/**
 * Global default logger
 */
export const logger = createLogger();
