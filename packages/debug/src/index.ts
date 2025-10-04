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

// AI-powered debugger
export { AIDebugger, createAIDebugger } from './ai-debugger';
export type { ErrorAnalysis, DebugHint, AIDebuggerConfig } from './ai-debugger';

/**
 * Create a comprehensive debug instance with all utilities
 */
export async function createDebug(config?: {
  loggerConfig?: import('./types').LoggerConfig;
  enablePerformance?: boolean;
  enableReactive?: boolean;
  enableComponentTree?: boolean;
}) {
  const { Logger } = await import('./logger');
  const loggerInstance = new Logger(config?.loggerConfig);
  const { DebugStream } = await import('./stream');
  const stream = new DebugStream();

  // Connect logger to stream
  loggerInstance.subscribe((entry: import('./types').LogEntry) => stream.push(entry));

  const debug = {
    logger: loggerInstance,
    stream,
    performance: config?.enablePerformance
      ? new (await import('./performance')).PerformanceMonitor()
      : undefined,
    reactive: config?.enableReactive
      ? new (await import('./reactive')).ReactiveDebugger({ logger: loggerInstance })
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
import { logger as defaultLogger } from './logger';

export const debug = {
  logger: defaultLogger,
  trace: defaultLogger.trace.bind(defaultLogger),
  debug: defaultLogger.debug.bind(defaultLogger),
  info: defaultLogger.info.bind(defaultLogger),
  warn: defaultLogger.warn.bind(defaultLogger),
  error: defaultLogger.error.bind(defaultLogger),
  fatal: defaultLogger.fatal.bind(defaultLogger),
  time: defaultLogger.timeStart.bind(defaultLogger),
  timeEnd: defaultLogger.timeEnd.bind(defaultLogger),
  group: defaultLogger.group.bind(defaultLogger),
  groupEnd: defaultLogger.groupEnd.bind(defaultLogger),
  table: defaultLogger.table.bind(defaultLogger),
};
