# Debugging Guide

Learn how to debug your Solidum applications effectively using the `@sldm/debug` package.

## Installation

```bash
npm install @sldm/debug
```

Or with the CLI:

```bash
solidum add debug
```

## Quick Start

```typescript
import { logger } from '@sldm/debug';

// Simple logging
logger.info('Application started');
logger.debug('User logged in', { userId: 123 });
logger.error('Failed to load data', error);
```

## Structured Logging

### Log Levels

The debug package supports six log levels, from most to least verbose:

```typescript
logger.trace('Very detailed information'); // TRACE (0)
logger.debug('Debug information'); // DEBUG (1)
logger.info('General information'); // INFO (2)
logger.warn('Warning message'); // WARN (3)
logger.error('Error occurred', error); // ERROR (4)
logger.fatal('Critical failure', error); // FATAL (5)
```

### Namespaces

Organize logs by namespace for better filtering:

```typescript
import { createLogger } from '@sldm/debug';

const appLogger = createLogger({ namespace: 'app' });
const apiLogger = appLogger.namespace('api');
const dbLogger = appLogger.namespace('database');

apiLogger.info('GET /users'); // [app:api] GET /users
dbLogger.info('Connected'); // [app:database] Connected
```

### Rich Context

Add structured data and context to logs:

```typescript
logger.info(
  'User action',
  { action: 'purchase', amount: 99.99 },
  { userId: 123, sessionId: 'abc' }
);
```

## Performance Debugging

### Basic Timing

```typescript
import { logger } from '@sldm/debug';

// Manual timing
logger.timeStart('data-load');
const data = await loadData();
logger.timeEnd('data-load'); // Logs: ⏱️ data-load: 234.56ms

// Automatic async timing
const result = await logger.timeAsync('api-call', async () => {
  return await fetch('/api/data');
});
```

### Performance Monitoring

```typescript
import { PerformanceMonitor } from '@sldm/debug';

const perfMonitor = new PerformanceMonitor();

// Mark important points
perfMonitor.mark('render-start');
renderComponent();
perfMonitor.mark('render-end');

// Measure duration
const measurement = perfMonitor.measure('render', 'render-start', 'render-end');
console.log(`Render took ${measurement.duration}ms`);

// Measure function execution
const data = perfMonitor.measureSync('process-data', () => {
  return processLargeDataset();
});
```

### FPS Monitoring

```typescript
import { FPSMonitor } from '@sldm/debug';

const fpsMonitor = new FPSMonitor();
fpsMonitor.start();

// Check FPS periodically
setInterval(() => {
  const fps = fpsMonitor.getFPS();
  if (fps < 30) {
    logger.warn('Low FPS detected', { fps });
  }
}, 1000);
```

### Memory Monitoring

```typescript
import { MemoryMonitor } from '@sldm/debug';

const memMonitor = new MemoryMonitor();

function checkMemory() {
  const usage = memMonitor.getUsage();
  if (usage && usage.percentage > 80) {
    logger.warn('High memory usage', {
      used: memMonitor.formatBytes(usage.used),
      total: memMonitor.formatBytes(usage.total),
      percentage: usage.percentage.toFixed(2),
    });
  }
}
```

## Reactive Debugging

### Tracking Signal Changes

```typescript
import { atom } from '@sldm/core';
import { ReactiveDebugger } from '@sldm/debug';

const reactiveDebugger = new ReactiveDebugger();
const counter = atom(0);

// Wrap signal with debugging
const debugSignal = (name, signal) => {
  reactiveDebugger.trackCreate(name, signal());

  const originalSet = signal;
  return newValue => {
    if (newValue !== undefined) {
      reactiveDebugger.trackUpdate(name, signal(), newValue);
    }
    return originalSet(newValue);
  };
};

const debugCounter = debugSignal('counter', counter);

// View history
const history = reactiveDebugger.getHistory('counter');
console.log(history); // All updates to 'counter'
```

### Time Travel Debugging

```typescript
import { TimeTravelDebugger } from '@sldm/debug';

const timeTravel = new TimeTravelDebugger(50); // Keep 50 snapshots

// Take snapshots
const state = new Map([
  ['count', 0],
  ['user', null],
]);
timeTravel.snapshot(state);

// Make changes
state.set('count', 1);
timeTravel.snapshot(state);

state.set('user', { id: 123 });
timeTravel.snapshot(state);

// Travel back in time
const previousState = timeTravel.undo();
const evenEarlier = timeTravel.undo();

// Travel forward
const nextState = timeTravel.redo();

// Jump to specific point
const snapshots = timeTravel.getSnapshots();
timeTravel.jumpTo(0); // Jump to first snapshot
```

## Component Debugging

### Visualizing Component Trees

```typescript
import { ComponentTree } from '@sldm/debug';

const tree = new ComponentTree();

// Register components as they mount
function App() {
  tree.registerComponent('app', 'App', 'component');

  return createElement('div', null, Header(), Main());
}

function Header() {
  tree.registerComponent('header', 'Header', 'component', 'app');
  return createElement('header', null, 'Header');
}

// Visualize tree
console.log(tree.toASCII());
// └─ App
//    ├─ Header
//    └─ Main

// Export for documentation
const mermaid = tree.toMermaid();
```

### Component Performance

```typescript
import { ComponentTree, PerformanceMonitor } from '@sldm/debug';

const tree = new ComponentTree();
const perfMonitor = new PerformanceMonitor();

function createDebugComponent(id, name, renderFn) {
  return () => {
    perfMonitor.mark(`${id}-start`);
    const result = renderFn();
    perfMonitor.mark(`${id}-end`);

    const measurement = perfMonitor.measure(id, `${id}-start`, `${id}-end`);
    tree.addPerformance(id, measurement);

    return result;
  };
}

// Use it
const DebugHeader = createDebugComponent('header', 'Header', Header);
```

## Export and Analysis

### Export Logs

```typescript
import { logger, OutputFormatEnum } from '@sldm/debug';

// JSON for APIs
const json = logger.export(OutputFormatEnum.JSON);
await fetch('/api/logs', {
  method: 'POST',
  body: json,
});

// HTML for reports
const html = logger.export(OutputFormatEnum.HTML);
document.getElementById('debug-panel').innerHTML = html;

// Markdown for documentation
const markdown = logger.export(OutputFormatEnum.MARKDOWN);
await writeFile('debug-report.md', markdown);
```

### Live Log Streaming

```typescript
import { logger } from '@sldm/debug';

// Stream to external service
logger.subscribe(entry => {
  if (entry.level >= LogLevelEnum.ERROR) {
    sendToErrorTracking(entry);
  }
});

// Stream to WebSocket
const ws = new WebSocket('ws://localhost:9229/debug');
logger.subscribe(entry => {
  ws.send(JSON.stringify(entry));
});
```

## Production Debugging

### Conditional Debugging

```typescript
import { createLogger, LogLevelEnum } from '@sldm/debug';

const logger = createLogger({
  level: import.meta.env.PROD ? LogLevelEnum.WARN : LogLevelEnum.DEBUG,
  persistent: !import.meta.env.PROD, // Don't persist in production
});
```

### Remote Debugging

```typescript
import { createDebugAPI, DebugStream } from '@sldm/debug';

if (import.meta.env.DEV) {
  const stream = new DebugStream();
  const api = createDebugAPI(logger, stream);

  // Expose debug API
  const handler = api.createHandler();

  // Now you can access logs remotely:
  // curl http://localhost:9229/logs
  // curl http://localhost:9229/logs/stream
}
```

### Error Boundaries

```typescript
import { logger } from '@sldm/debug';

function ErrorBoundary(props) {
  try {
    return props.children;
  } catch (error) {
    logger.fatal('Component error boundary triggered', error, {
      component: props.name,
      stack: error.stack,
    });
    return createElement('div', null, 'Something went wrong');
  }
}
```

## Best Practices

### 1. Use Namespaces

```typescript
// Good
const authLogger = logger.namespace('auth');
const apiLogger = logger.namespace('api');

authLogger.info('Login successful');
apiLogger.debug('Fetching user data');
```

### 2. Include Context

```typescript
// Good
logger.error('Failed to save user', error, {
  userId: user.id,
  operation: 'update',
  timestamp: Date.now(),
});

// Bad
logger.error('Error', error);
```

### 3. Use Appropriate Levels

```typescript
// TRACE - Very detailed debugging
logger.trace('Entering function', { args });

// DEBUG - Development debugging
logger.debug('Processing item', { item });

// INFO - General information
logger.info('User logged in', { userId });

// WARN - Potentially harmful situations
logger.warn('API rate limit approaching', { remaining });

// ERROR - Error events that might still allow the app to continue
logger.error('Failed to load resource', error);

// FATAL - Very severe error events that will presumably lead the app to abort
logger.fatal('Database connection lost', error);
```

### 4. Performance Budgets

```typescript
const perfMonitor = new PerformanceMonitor();

function renderComponent() {
  const measurement = perfMonitor.measureSync('render', () => {
    return actualRender();
  });

  if (measurement.duration > 16.67) {
    // 60 FPS = 16.67ms per frame
    logger.warn('Slow render detected', {
      component: 'MyComponent',
      duration: measurement.duration,
      budget: 16.67,
    });
  }
}
```

### 5. Clean Up

```typescript
// Unsubscribe when done
const unsubscribe = logger.subscribe(handler);

onCleanup(() => {
  unsubscribe();
});

// Stop monitoring
fpsMonitor.stop();
perfMonitor.destroy();
```

## Next Steps

- [Debug API Reference](/api/debug) - Complete API documentation
- [Testing Guide](/guide/testing) - Learn about testing with Solidum
- [Best Practices](/guide/best-practices) - General best practices
