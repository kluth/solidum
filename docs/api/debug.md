# Debug API Reference

The `@sldm/debug` package provides comprehensive debugging and monitoring utilities for Solidum applications.

## Installation

```bash
npm install @sldm/debug
```

## Logger

### createLogger(config?)

Creates a new logger instance with optional configuration.

```typescript
import { createLogger, LogLevelEnum } from '@sldm/debug';

const logger = createLogger({
  level: LogLevelEnum.DEBUG,
  namespace: 'my-app',
  includeTimestamp: true,
  includeStack: false,
  persistent: true, // Save to localStorage
  maxEntries: 1000,
});
```

**Configuration Options:**

- `level` - Minimum log level (TRACE, DEBUG, INFO, WARN, ERROR, FATAL)
- `namespace` - Logger namespace for organization
- `includeTimestamp` - Include timestamps in logs (default: true)
- `includeStack` - Include stack traces (default: false)
- `persistent` - Persist logs to localStorage (default: false)
- `maxEntries` - Maximum number of log entries to keep (default: 1000)

### Logger Methods

#### Log Levels

```typescript
logger.trace(message, data?, context?);
logger.debug(message, data?, context?);
logger.info(message, data?, context?);
logger.warn(message, data?, context?);
logger.error(message, error?, context?);
logger.fatal(message, error?, context?);
```

#### Namespaces

```typescript
const dbLogger = logger.namespace('database');
dbLogger.info('Connected'); // [my-app:database] Connected
```

#### Performance Timing

```typescript
// Manual timing
logger.timeStart('operation');
await doSomething();
logger.timeEnd('operation');

// Async timing
await logger.timeAsync('api-call', async () => {
  return await fetch('/api/data');
});
```

#### Grouping

```typescript
logger.group('User Actions');
logger.info('Login');
logger.info('View Profile');
logger.groupEnd();
```

#### Tables

```typescript
logger.table([
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
]);
```

#### Streaming

```typescript
const unsubscribe = logger.subscribe(entry => {
  // Send to external service
  sendToServer(entry);
});

// Later
unsubscribe();
```

#### Export

```typescript
import { OutputFormatEnum } from '@sldm/debug';

const json = logger.export(OutputFormatEnum.JSON);
const html = logger.export(OutputFormatEnum.HTML);
const markdown = logger.export(OutputFormatEnum.MARKDOWN);
```

## Formatters

### JSONFormatter

```typescript
import { JSONFormatter } from '@sldm/debug/formatters';

const formatter = new JSONFormatter(true); // pretty print
const output = formatter.formatBatch(entries);
```

### HTMLFormatter

```typescript
import { HTMLFormatter } from '@sldm/debug/formatters';

const formatter = new HTMLFormatter();
const html = formatter.formatBatch(entries);
// Interactive HTML with styling and click-to-expand
```

### MarkdownFormatter

```typescript
import { MarkdownFormatter } from '@sldm/debug/formatters';

const formatter = new MarkdownFormatter();
const md = formatter.formatBatch(entries);
// Perfect for documentation and reports
```

### PlainFormatter

```typescript
import { PlainFormatter } from '@sldm/debug/formatters';

const formatter = new PlainFormatter();
const text = formatter.formatBatch(entries);
```

## Performance Monitoring

### PerformanceMonitor

```typescript
import { PerformanceMonitor } from '@sldm/debug';

const perfMonitor = new PerformanceMonitor();

// Mark points in time
perfMonitor.mark('start');
perfMonitor.mark('end');

// Measure between marks
const measurement = perfMonitor.measure('duration', 'start', 'end');
console.log(measurement.duration); // in milliseconds

// Measure function execution
const result = perfMonitor.measureSync('calculation', () => {
  return heavyComputation();
});

// Measure async
const data = await perfMonitor.measureAsync('fetch', async () => {
  return await fetchData();
});

// Get summary
const summary = perfMonitor.getSummary();
console.log(summary.average, summary.min, summary.max);
```

### FPSMonitor

```typescript
import { FPSMonitor } from '@sldm/debug';

const fpsMonitor = new FPSMonitor();
fpsMonitor.start();

setInterval(() => {
  console.log(`FPS: ${fpsMonitor.getFPS()}`);
}, 1000);

fpsMonitor.stop();
```

### MemoryMonitor

```typescript
import { MemoryMonitor } from '@sldm/debug';

const memMonitor = new MemoryMonitor();
const usage = memMonitor.getUsage();

if (usage) {
  console.log(`Used: ${memMonitor.formatBytes(usage.used)}`);
  console.log(`Total: ${memMonitor.formatBytes(usage.total)}`);
  console.log(`Percentage: ${usage.percentage.toFixed(2)}%`);
}
```

## Reactive Debugging

### ReactiveDebugger

```typescript
import { ReactiveDebugger } from '@sldm/debug';

const reactiveDebugger = new ReactiveDebugger();

// Track signal lifecycle
reactiveDebugger.trackCreate('counter', 0);
reactiveDebugger.trackUpdate('counter', 0, 1);
reactiveDebugger.trackDestroy('counter', 1);

// Get history
const history = reactiveDebugger.getHistory('counter');

// Subscribe to changes
const unsubscribe = reactiveDebugger.subscribe(event => {
  console.log(event.type, event.signalId, event.newValue);
});

// Get summary
const summary = reactiveDebugger.getSummary();
console.log(summary.totalSignals, summary.totalChanges);
```

### EffectDebugger

```typescript
import { EffectDebugger } from '@sldm/debug';

const effectDebugger = new EffectDebugger();

// Track effects
effectDebugger.startEffect('effect-1');
effectDebugger.trackDependency('signal-1');
effectDebugger.trackDependency('signal-2');
effectDebugger.endEffect('effect-1');

// Get dependencies
const deps = effectDebugger.getDependencies('effect-1');
// ['signal-1', 'signal-2']

// Get dependency graph
const graph = effectDebugger.getDependencyGraph();
```

### TimeTravelDebugger

```typescript
import { TimeTravelDebugger } from '@sldm/debug';

const timeTravel = new TimeTravelDebugger();

// Take snapshots
const state = new Map([['count', 0]]);
timeTravel.snapshot(state);

state.set('count', 1);
timeTravel.snapshot(state);

state.set('count', 2);
timeTravel.snapshot(state);

// Travel back
const prev = timeTravel.undo(); // count: 1

// Travel forward
const next = timeTravel.redo(); // count: 2

// Jump to specific snapshot
const snapshots = timeTravel.getSnapshots();
timeTravel.jumpTo(0); // Go to first snapshot
```

## Component Tree

### ComponentTree

```typescript
import { ComponentTree } from '@sldm/debug';

const tree = new ComponentTree();

// Register components
tree.registerComponent('root', 'App', 'component');
tree.registerComponent('header', 'Header', 'component', 'root', { title: 'My App' });
tree.registerComponent('main', 'Main', 'component', 'root');

// Update props and state
tree.updateProps('header', { title: 'Updated App' });
tree.updateState('header', { isOpen: true });

// Visualize
console.log(tree.toASCII());
// └─ App
//    ├─ Header
//    └─ Main

// Export as Mermaid
console.log(tree.toMermaid());

// Get statistics
const stats = tree.getStatistics();
console.log(stats.totalNodes, stats.depth, stats.byType);

// Find components
const headers = tree.findByName('Header');
const components = tree.findByType('component');

// Get path
const path = tree.getPath('header');
// ['App', 'Header']
```

## Debug API Server

### createDebugAPI

```typescript
import { createLogger, DebugStream } from '@sldm/debug';
import { createDebugAPI } from '@sldm/debug/server';

const logger = createLogger();
const stream = new DebugStream();
const api = createDebugAPI(logger, stream, {
  port: 9229,
  cors: true,
  allowedOrigins: ['http://localhost:3000'],
});

const handler = api.createHandler();

// Use with fetch handler or server framework
addEventListener('fetch', event => {
  if (event.request.url.includes('/debug')) {
    event.respondWith(handler(event.request));
  }
});
```

**API Endpoints:**

- `GET /logs?level=2&namespace=app&limit=100` - Get filtered logs
- `GET /logs/stream` - Stream logs via Server-Sent Events
- `POST /logs/clear` - Clear all logs
- `GET /health` - Health check

## Debug Stream

### DebugStream

```typescript
import { DebugStream } from '@sldm/debug';

const stream = new DebugStream({
  maxBufferSize: 100,
  flushInterval: 1000, // Auto-flush every second
});

// Push entries
stream.push(logEntry);

// Subscribe
const unsubscribe = stream.subscribe(entry => {
  console.log(entry);
});

// Get buffer
const buffer = stream.getBuffer();

// Clear buffer
stream.clearBuffer();
```

### SSEDebugStream

```typescript
import { SSEDebugStream } from '@sldm/debug';

const stream = new DebugStream();
const sseStream = new SSEDebugStream(stream);

const readableStream = sseStream.createStream();
// Use with Response or server framework
```

### WebSocketDebugStream

```typescript
import { WebSocketDebugStream } from '@sldm/debug';

const stream = new DebugStream();
const wsStream = new WebSocketDebugStream(stream);

wsStream.connect('ws://localhost:9229/debug');

// Disconnect when done
wsStream.disconnect();
```

## Complete Debug Instance

```typescript
import { createDebug } from '@sldm/debug';

const debug = await createDebug({
  loggerConfig: {
    level: LogLevelEnum.DEBUG,
    namespace: 'app',
  },
  enablePerformance: true,
  enableReactive: true,
  enableComponentTree: true,
});

// Access all utilities
debug.logger.info('Started');
debug.performance?.mark('init');
debug.reactive?.trackCreate('state', {});
debug.componentTree?.registerComponent('root', 'App', 'component');
debug.fps?.start();
debug.memory?.getUsage();
```

## Types

```typescript
import type {
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
} from '@sldm/debug';
```
