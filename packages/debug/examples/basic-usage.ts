/**
 * Basic Debug Package Usage Examples
 */

import { logger, createLogger, LogLevelEnum } from '@sldm/debug';

// ===========================
// Basic Logging
// ===========================

console.log('\n=== Basic Logging ===\n');

// Using the default logger
logger.info('Application started');
logger.debug('Debug information', { userId: 123, action: 'login' });
logger.warn('This is a warning');
logger.error('An error occurred', new Error('Something went wrong'));

// ===========================
// Custom Logger with Namespace
// ===========================

console.log('\n=== Custom Logger ===\n');

const appLogger = createLogger({
  namespace: 'my-app',
  level: LogLevelEnum.DEBUG,
  includeTimestamp: true,
});

const dbLogger = appLogger.namespace('database');
const apiLogger = appLogger.namespace('api');

dbLogger.info('Database connected');
apiLogger.info('API server listening on port 3000');

// ===========================
// Performance Timing
// ===========================

console.log('\n=== Performance Timing ===\n');

// Manual timing
logger.timeStart('data-processing');
// Simulate some work
await new Promise(resolve => setTimeout(resolve, 100));
logger.timeEnd('data-processing');

// Automatic async timing
await logger.timeAsync('api-call', async () => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return { data: 'result' };
});

// ===========================
// Log Streaming
// ===========================

console.log('\n=== Log Streaming ===\n');

const unsubscribe = logger.subscribe(entry => {
  console.log('📡 Stream received:', entry.level, entry.message);
});

logger.info('This will be streamed');
logger.debug('This will also be streamed');

unsubscribe();

// ===========================
// Export in Different Formats
// ===========================

console.log('\n=== Export Formats ===\n');

import { OutputFormatEnum } from '@sldm/debug';

// Get logs as JSON
const jsonLogs = logger.export(OutputFormatEnum.JSON);
console.log('JSON Export (first 200 chars):', jsonLogs.substring(0, 200));

// Get logs as Markdown
const mdLogs = logger.export(OutputFormatEnum.MARKDOWN);
console.log('\nMarkdown Export (first 200 chars):', mdLogs.substring(0, 200));

// ===========================
// Performance Monitoring
// ===========================

console.log('\n=== Performance Monitoring ===\n');

import { PerformanceMonitor, FPSMonitor, MemoryMonitor } from '@sldm/debug';

const perfMonitor = new PerformanceMonitor();

// Mark and measure
perfMonitor.mark('render-start');
await new Promise(resolve => setTimeout(resolve, 30));
perfMonitor.mark('render-end');
const measurement = perfMonitor.measure('render', 'render-start', 'render-end');
console.log(`Render took: ${measurement?.duration.toFixed(2)}ms`);

// Get summary
const summary = perfMonitor.getSummary();
console.log(`Performance Summary:`, summary);

// FPS Monitor (requires browser environment)
if (typeof requestAnimationFrame !== 'undefined') {
  const fpsMonitor = new FPSMonitor();
  fpsMonitor.start();
  setTimeout(() => {
    console.log(`Current FPS: ${fpsMonitor.getFPS()}`);
    fpsMonitor.stop();
  }, 1000);
}

// Memory Monitor
const memMonitor = new MemoryMonitor();
const memUsage = memMonitor.getUsage();
if (memUsage) {
  console.log(
    `Memory: ${memMonitor.formatBytes(memUsage.used)} / ${memMonitor.formatBytes(memUsage.total)}`
  );
}

// ===========================
// Reactive Debugging
// ===========================

console.log('\n=== Reactive Debugging ===\n');

import { ReactiveDebugger, TimeTravelDebugger } from '@sldm/debug';

const reactiveDebugger = new ReactiveDebugger();

// Track signal creation
reactiveDebugger.trackCreate('counter', 0);

// Track updates
reactiveDebugger.trackUpdate('counter', 0, 1);
reactiveDebugger.trackUpdate('counter', 1, 2);
reactiveDebugger.trackUpdate('counter', 2, 3);

// Get history
const history = reactiveDebugger.getHistory('counter');
console.log(`Counter history has ${history.length} entries`);

// Get summary
const reactiveSummary = reactiveDebugger.getSummary();
console.log('Reactive Summary:', reactiveSummary);

// Time Travel
const timeTravel = new TimeTravelDebugger();
const state = new Map([['count', 0]]);

timeTravel.snapshot(state);
state.set('count', 1);
timeTravel.snapshot(state);
state.set('count', 2);
timeTravel.snapshot(state);

console.log('Current state:', state.get('count')); // 2
const prevState = timeTravel.undo();
console.log('After undo:', prevState?.get('count')); // 1

// ===========================
// Component Tree
// ===========================

console.log('\n=== Component Tree ===\n');

import { ComponentTree } from '@sldm/debug';

const tree = new ComponentTree();

tree.registerComponent('root', 'App', 'component');
tree.registerComponent('header', 'Header', 'component', 'root');
tree.registerComponent('nav', 'Navigation', 'component', 'header');
tree.registerComponent('main', 'Main', 'component', 'root');
tree.registerComponent('footer', 'Footer', 'component', 'root');

console.log('Component Tree (ASCII):');
console.log(tree.toASCII());

console.log('\nComponent Tree Statistics:');
console.log(tree.getStatistics());

console.log('\n=== Done! ===\n');
