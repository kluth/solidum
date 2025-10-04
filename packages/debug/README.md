# @sldm/debug

> Comprehensive debugging utilities for Solidum applications

## Features

- 📊 **Structured Logging** - Log levels, namespaces, and rich context
- 🎨 **Multiple Formatters** - Console, JSON, HTML, Markdown, Plain text
- 📡 **Real-time Streaming** - SSE and WebSocket support
- ⚡ **Performance Monitoring** - FPS, memory, and custom measurements
- 🔍 **Reactive Debugging** - Track signal changes and effects
- 🌳 **Component Tree** - Visualize component hierarchy
- ⏰ **Time Travel** - Snapshot and replay state changes
- 🚀 **Debug API** - HTTP endpoints for external tools

## Installation

```bash
pnpm add @sldm/debug
```

## Quick Start

```typescript
import { logger, debug } from '@sldm/debug';

// Simple logging
logger.info('Application started');
logger.debug('User data', { userId: 123 });
logger.error('Failed to load', error);

// Or use the shorthand
debug.info('Quick log message');
```

## Core Logger

### Log Levels

```typescript
import { createLogger, LogLevelEnum } from '@sldm/debug';

const logger = createLogger({
  level: LogLevelEnum.DEBUG,
  namespace: 'my-app',
  includeTimestamp: true,
  includeStack: false,
});

logger.trace('Detailed trace');
logger.debug('Debug information');
logger.info('General information');
logger.warn('Warning message');
logger.error('Error occurred', error);
logger.fatal('Critical error', error);
```

### Namespaces

```typescript
const appLogger = createLogger({ namespace: 'app' });
const dbLogger = appLogger.namespace('database');
const apiLogger = appLogger.namespace('api');

dbLogger.info('Connected'); // [app:database] Connected
apiLogger.info('Request'); // [app:api] Request
```

### Performance Timing

```typescript
// Manual timing
logger.timeStart('load-data');
await loadData();
logger.timeEnd('load-data'); // Logs duration

// Automatic timing
await logger.timeAsync('api-call', async () => {
  return await fetch('/api/data');
});

// Sync timing
const result = logger.measureSync('computation', () => {
  return heavyComputation();
});
```

### Log Streaming

```typescript
import { logger } from '@sldm/debug';

// Subscribe to log stream
const unsubscribe = logger.subscribe(entry => {
  console.log('New log entry:', entry);
  // Send to external service, etc.
});

// Unsubscribe when done
unsubscribe();
```

## Formatters

### Export in Different Formats

```typescript
import { logger, OutputFormatEnum } from '@sldm/debug';

// Export as JSON
const json = logger.export(OutputFormatEnum.JSON);

// Export as HTML
const html = logger.export(OutputFormatEnum.HTML);

// Export as Markdown
const markdown = logger.export(OutputFormatEnum.MARKDOWN);

// Export as plain text
const plain = logger.export(OutputFormatEnum.PLAIN);

// Save to file or send to server
await fetch('/api/logs', {
  method: 'POST',
  body: json,
});
```

### HTML Formatter

```typescript
import { HTMLFormatter } from '@sldm/debug/formatters';

const formatter = new HTMLFormatter();
const entries = logger.getEntries();
const html = formatter.formatBatch(entries);

// Write to file or display in iframe
document.getElementById('debug-panel').innerHTML = html;
```

## Performance Monitoring

### Performance Monitor

```typescript
import { PerformanceMonitor } from '@sldm/debug';

const perfMonitor = new PerformanceMonitor();

// Mark points in time
perfMonitor.mark('start-render');
// ... rendering code
perfMonitor.mark('end-render');

// Measure between marks
const measurement = perfMonitor.measure('render', 'start-render', 'end-render');
console.log(`Render took ${measurement.duration}ms`);

// Measure function execution
const data = perfMonitor.measureSync('fetch-data', () => {
  return fetchDataFromAPI();
});

// Measure async
const result = await perfMonitor.measureAsync('async-operation', async () => {
  return await someAsyncOperation();
});

// Get performance summary
const summary = perfMonitor.getSummary();
console.log(`Average: ${summary.average}ms`);
console.log(`Min: ${summary.min}ms, Max: ${summary.max}ms`);
```

### FPS Monitor

```typescript
import { FPSMonitor } from '@sldm/debug';

const fpsMonitor = new FPSMonitor();
fpsMonitor.start();

setInterval(() => {
  console.log(`FPS: ${fpsMonitor.getFPS()}`);
}, 1000);

// Stop when done
fpsMonitor.stop();
```

### Memory Monitor

```typescript
import { MemoryMonitor } from '@sldm/debug';

const memMonitor = new MemoryMonitor();
const usage = memMonitor.getUsage();

if (usage) {
  console.log(
    `Memory: ${memMonitor.formatBytes(usage.used)} / ${memMonitor.formatBytes(usage.total)}`
  );
  console.log(`Usage: ${usage.percentage.toFixed(2)}%`);
}
```

## Reactive Debugging

### Track Signal Changes

```typescript
import { ReactiveDebugger } from '@sldm/debug';

const reactiveDebugger = new ReactiveDebugger();

// In your reactive system:
const signal = createSignal(0);

// Track creation
reactiveDebugger.trackCreate('count', signal());

// Track updates
signal.subscribe((newValue, oldValue) => {
  reactiveDebugger.trackUpdate('count', oldValue, newValue);
});

// Get history
const history = reactiveDebugger.getHistory('count');

// Get summary
const summary = reactiveDebugger.getSummary();
console.log(`Total signals: ${summary.totalSignals}`);
console.log(`Total changes: ${summary.totalChanges}`);
```

### Time Travel Debugging

```typescript
import { TimeTravelDebugger } from '@sldm/debug';

const timeTravel = new TimeTravelDebugger();

// Take snapshots of state
const state = new Map([['count', 0]]);
timeTravel.snapshot(state);

// Make changes
state.set('count', 1);
timeTravel.snapshot(state);

state.set('count', 2);
timeTravel.snapshot(state);

// Travel back
const previousState = timeTravel.undo();
console.log(previousState); // count: 1

// Travel forward
const nextState = timeTravel.redo();
console.log(nextState); // count: 2

// Jump to specific snapshot
const snapshots = timeTravel.getSnapshots();
timeTravel.jumpTo(0); // Go to first snapshot
```

## Component Tree

```typescript
import { ComponentTree } from '@sldm/debug';

const tree = new ComponentTree();

// Register components
tree.registerComponent('root', 'App', 'component');
tree.registerComponent('header', 'Header', 'component', 'root');
tree.registerComponent('nav', 'Navigation', 'component', 'header');
tree.registerComponent('main', 'Main', 'component', 'root');

// Get ASCII visualization
console.log(tree.toASCII());
// └─ App
//    ├─ Header
//    │  └─ Navigation
//    └─ Main

// Get as Mermaid diagram
console.log(tree.toMermaid());

// Get statistics
const stats = tree.getStatistics();
console.log(`Total components: ${stats.totalNodes}`);
console.log(`Tree depth: ${stats.depth}`);

// Find components
const navs = tree.findByType('navigation');
const headers = tree.findByName('Header');
```

## Debug API

### Create API Server

```typescript
import { createLogger, DebugStream } from '@sldm/debug';
import { createDebugAPI } from '@sldm/debug/server';

const logger = createLogger();
const stream = new DebugStream();
const api = createDebugAPI(logger, stream, {
  port: 9229,
  cors: true,
});

// Use with service worker or server framework
const handler = api.createHandler();

// Example with fetch handler
addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/debug')) {
    event.respondWith(handler(event.request));
  }
});
```

### API Endpoints

- `GET /logs` - Get all logs (query params: level, namespace, limit)
- `GET /logs/stream` - Stream logs via SSE
- `POST /logs/clear` - Clear all logs
- `GET /health` - Health check

### Example API Usage

```bash
# Get logs
curl http://localhost:9229/logs?level=2&limit=50

# Stream logs
curl http://localhost:9229/logs/stream

# Clear logs
curl -X POST http://localhost:9229/logs/clear
```

## Advanced Usage

### Comprehensive Debug Instance

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
debug.logger.info('Application started');
debug.performance?.mark('init');
debug.reactive?.trackCreate('state', initialState);
debug.componentTree?.registerComponent('root', 'App', 'component');
debug.fps?.start();
```

### Persistent Logs

```typescript
const logger = createLogger({
  persistent: true, // Save logs to localStorage
  maxEntries: 1000,
});

// Logs survive page reloads
logger.info('This will be persisted');
```

## TypeScript Support

Full TypeScript support with type definitions:

```typescript
import type {
  LogEntry,
  LogLevel,
  PerformanceEntry,
  StateChangeEvent,
  ComponentNode,
} from '@sldm/debug';
```

## License

MIT © Matthias Kluth
