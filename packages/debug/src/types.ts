/**
 * Debug log levels
 */
export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5,
}

/**
 * Log entry structure
 */
export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  namespace: string;
  message: string;
  data?: unknown;
  context?: Record<string, unknown>;
  stack?: string;
  performance?: PerformanceEntry;
}

/**
 * Performance measurement entry
 */
export interface PerformanceEntry {
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
  memory?: {
    used: number;
    total: number;
  };
}

/**
 * Debug output format
 */
export enum OutputFormat {
  CONSOLE = 'console',
  JSON = 'json',
  HTML = 'html',
  MARKDOWN = 'markdown',
  PLAIN = 'plain',
}

/**
 * Log stream subscriber
 */
export interface LogSubscriber {
  (entry: LogEntry): void;
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  level?: LogLevel;
  enabled?: boolean;
  namespace?: string;
  format?: OutputFormat;
  includeTimestamp?: boolean;
  includeStack?: boolean;
  maxEntries?: number;
  persistent?: boolean;
}

/**
 * Reactive state change event
 */
export interface StateChangeEvent {
  type: 'create' | 'update' | 'destroy';
  signalId: string;
  oldValue?: unknown;
  newValue?: unknown;
  timestamp: number;
  stack?: string;
}

/**
 * Component tree node for visualization
 */
export interface ComponentNode {
  id: string;
  name: string;
  type: string;
  props?: Record<string, unknown>;
  children: ComponentNode[];
  state?: Record<string, unknown>;
  performance?: PerformanceEntry;
}

/**
 * Debug API message
 */
export interface DebugMessage {
  type: 'log' | 'state' | 'component' | 'performance' | 'event';
  payload: unknown;
  timestamp: number;
}

/**
 * Formatter interface
 */
export interface Formatter {
  format(entry: LogEntry): string;
  formatBatch(entries: LogEntry[]): string;
}
