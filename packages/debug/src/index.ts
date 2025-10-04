/**
 * @sldm/debug - Comprehensive debugging utilities for Solidum applications
 */

// Core logger
export { Logger, createLogger, logger } from './logger';

// Types
export type {
  LogEntry,
  LogLevel,
  LogSubscriber,
  LoggerConfig,
  OutputFormat,
  PerformanceEntry,
  StateChangeEvent,
  ComponentNode,
  DebugMessage,
  Formatter,
} from './types';
export { LogLevel as LogLevelEnum, OutputFormat as OutputFormatEnum } from './types';

// Formatters
export {
  JSONFormatter,
  HTMLFormatter,
  MarkdownFormatter,
  PlainFormatter,
  getFormatter,
} from './formatters';

// Streaming
export { DebugStream, SSEDebugStream, WebSocketDebugStream } from './stream';

// Performance monitoring
export { PerformanceMonitor, FPSMonitor, MemoryMonitor } from './performance';

// Reactive debugging
export { ReactiveDebugger, EffectDebugger, TimeTravelDebugger } from './reactive';

// Component tree
export { ComponentTree } from './component-tree';

/**
 * Create a comprehensive debug instance with all utilities
 */
export function createDebug(config?: {
  loggerConfig?: import('./types').LoggerConfig;
  enablePerformance?: boolean;
  enableReactive?: boolean;
  enableComponentTree?: boolean;
}) {
  const logger = createLogger(config?.loggerConfig);
  const stream = new (await import('./stream')).DebugStream();

  // Connect logger to stream
  logger.subscribe(entry => stream.push(entry));

  const debug = {
    logger,
    stream,
    performance: config?.enablePerformance
      ? new (await import('./performance')).PerformanceMonitor()
      : undefined,
    reactive: config?.enableReactive
      ? new (await import('./reactive')).ReactiveDebugger({ logger })
      : undefined,
    componentTree: config?.enableComponentTree
      ? new (await import('./component-tree')).ComponentTree()
      : undefined,
    fps: config?.enablePerformance ? new (await import('./performance')).FPSMonitor() : undefined,
    memory: config?.enablePerformance
      ? new (await import('./performance')).MemoryMonitor()
      : undefined,
  };

  return debug;
}

/**
 * Default debug instance for quick usage
 */
export const debug = {
  logger,
  trace: logger.trace.bind(logger),
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  fatal: logger.fatal.bind(logger),
  time: logger.timeStart.bind(logger),
  timeEnd: logger.timeEnd.bind(logger),
  group: logger.group.bind(logger),
  groupEnd: logger.groupEnd.bind(logger),
  table: logger.table.bind(logger),
};
