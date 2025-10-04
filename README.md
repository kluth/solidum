# Solidum Framework

> **A modern, fine-grained reactive TypeScript framework for building user interfaces**

Solidum is a comprehensive framework ecosystem that combines fine-grained reactivity with practical tools for building production-ready web applications. From reactive primitives to UI components, routing, state management, and developer tooling - everything you need is here.

[![npm version](https://img.shields.io/npm/v/@sldm/core.svg)](https://www.npmjs.com/package/@sldm/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 📦 Packages

### Core Framework

- **[@sldm/core](./packages/core)** - Reactive primitives and component system
- **[@sldm/ui](./packages/ui)** - Production-ready UI component library
- **[@sldm/router](./packages/router)** - Simple SPA routing
- **[@sldm/store](./packages/store)** - Global state management
- **[@sldm/context](./packages/context)** - Context and dependency injection
- **[@sldm/ssr](./packages/ssr)** - Server-side rendering utilities
- **[@sldm/utils](./packages/utils)** - Utility functions

### Developer Tools

- **[@sldm/testing](./packages/testing)** - TDD-first testing framework
- **[@sldm/debug](./packages/debug)** - Comprehensive debugging utilities with logging, performance monitoring, and more
- **[@sldm/storage](./packages/storage)** - Unified storage abstraction (localStorage, IndexedDB, databases)
- **[@sldm/dev-reports](./packages/dev-reports)** - Beautiful development reports for stakeholders

## 🚀 Quick Start

```bash
# Install core package
npm install @sldm/core

# Or install with UI components
npm install @sldm/core @sldm/ui

# Full stack
npm install @sldm/core @sldm/ui @sldm/router @sldm/store
```

### Hello World

```typescript
import { atom, createElement, mount } from '@sldm/core';

function Counter() {
  const count = atom(0);

  return createElement(
    'div',
    null,
    createElement('h1', null, 'Count: ', String(count())),
    createElement('button', { onClick: () => count(count() + 1) }, 'Increment')
  );
}

mount(document.getElementById('app'), () => createElement(Counter));
```

### With UI Components

```typescript
import { atom } from '@sldm/core';
import { Button, Card } from '@sldm/ui';

function App() {
  const count = atom(0);

  return Card(
    {
      variant: 'elevated',
      padding: 'large',
    },
    createElement('h1', null, `Count: ${count()}`),
    Button(
      {
        variant: 'primary',
        onClick: () => count(count() + 1),
      },
      'Increment'
    )
  );
}
```

## 🎯 Core Features

### Fine-Grained Reactivity

```typescript
import { atom, computed, effect } from '@sldm/core';

const count = atom(0);
const doubled = computed(() => count() * 2);

effect(() => {
  console.log(`Count: ${count()}, Doubled: ${doubled()}`);
});

count(5); // Logs: "Count: 5, Doubled: 10"
```

### State Management

```typescript
import { createStore } from '@sldm/store';

const store = createStore({
  state: { count: 0, todos: [] },
  actions: {
    increment: state => ({ ...state, count: state.count + 1 }),
    addTodo: (state, text) => ({
      ...state,
      todos: [...state.todos, { id: Date.now(), text }],
    }),
  },
  getters: {
    completedTodos: state => state.todos.filter(t => t.completed),
  },
});

store.dispatch('increment');
const todos = store.select(state => state.todos);
```

### Routing

```typescript
import { createRouter } from '@sldm/router';

const router = createRouter({
  '/': HomePage,
  '/about': AboutPage,
  '/users/:id': UserPage,
});

router.navigate('/users/123');
```

### Storage

```typescript
import { createStorage, IndexedDBAdapter } from '@sldm/storage';

// Simple storage
const storage = createStorage('local');
storage.set('user', { name: 'John', age: 30 });

// IndexedDB for complex data
const db = new IndexedDBAdapter({
  dbName: 'my-app',
  storeName: 'users',
});

await db.set('user-1', { name: 'John', email: 'john@example.com' });
const users = await db.query(user => user.age > 18);
```

### Debugging

```typescript
import { logger, createDebug, PerformanceMonitor } from '@sldm/debug';

// Simple logging
logger.info('Application started');
logger.debug('User data', { userId: 123 });
logger.error('Error occurred', error);

// Performance monitoring
const perfMonitor = new PerformanceMonitor();
perfMonitor.mark('start');
await loadData();
const measurement = perfMonitor.measure('load-data', 'start');

// Complete debug instance
const debug = await createDebug({
  enablePerformance: true,
  enableReactive: true,
  enableComponentTree: true,
});

// Export logs in various formats
const html = debug.logger.export('html');
const json = debug.logger.export('json');
```

### Development Reports

```typescript
import { BundleAnalyzer, TestReporter, HTMLReportGenerator } from '@sldm/dev-reports';

const bundleAnalyzer = new BundleAnalyzer();
const testReporter = new TestReporter();
const htmlGenerator = new HTMLReportGenerator();

const report = {
  build: { name: 'my-app', version: '1.0.0', buildTime: 5000 },
  bundle: bundleAnalyzer.analyze('my-app', bundles),
  tests: testReporter.generate('my-app', testSuites),
  timestamp: Date.now(),
};

const html = htmlGenerator.generate(report);
// Beautiful stakeholder-friendly report!
```

## 📚 Documentation

Full documentation is available at **[kluth.github.io/solidum](https://kluth.github.io/solidum/)**

## 🧪 Testing

Solidum includes a built-in testing framework:

```typescript
import { describe, it, expect, runTests } from '@sldm/testing';

describe('Counter', () => {
  it('should increment', () => {
    const count = atom(0);
    count(count() + 1);
    expect(count()).toBe(1);
  });
});

runTests();
```

## 🏗️ Architecture

```
@sldm
├── core          # Reactive primitives, components
├── ui            # UI component library (20+ components)
├── router        # SPA routing
├── store         # State management
├── context       # Dependency injection
├── ssr           # Server-side rendering
├── utils         # Utility functions
├── testing       # Testing framework
├── storage       # Storage abstraction
└── dev-reports   # Development reporting
```

## 🎨 UI Components

The `@sldm/ui` package includes 20+ production-ready components:

- **Button** - Multiple variants, sizes, loading states
- **Card** - Elevated, outlined, glassmorphism effects
- **Input** - Text, email, password with validation
- **Tabs** - Component-level reactivity
- **Modal** - Portal-based with backdrop
- **Dropdown** - Accessible with keyboard navigation
- And many more...

## 💾 Storage Solutions

The `@sldm/storage` package provides unified storage APIs:

- **Synchronous**: localStorage, sessionStorage, in-memory
- **Asynchronous**: IndexedDB, database adapters
- **Type-Safe**: Full TypeScript support
- **Queryable**: Advanced filtering and sorting
- **Prefixing**: Namespace isolation

## 📊 Developer Reports

Generate beautiful reports for stakeholders:

- **Bundle Size Analysis** - Track sizes with compression metrics
- **Test Results** - Success rates and durations
- **Code Coverage** - Lines, statements, functions, branches
- **Build Information** - Times, versions, environments
- **Multiple Formats** - HTML, Markdown, JSON

## 🚦 Development

```bash
# Clone repository
git clone https://github.com/kluth/solidum.git
cd solidum

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint

# Format
pnpm format
```

## 📦 Publishing

All packages are published to npm under the `@sldm` organization:

```bash
# Prepare for publishing
pnpm publish:prepare

# Publish all packages
pnpm publish:all
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## 📄 License

MIT © Matthias Kluth

## 🔗 Links

- [Documentation](https://kluth.github.io/solidum)
- [npm Organization](https://www.npmjs.com/org/sldm)
- [GitHub](https://github.com/kluth/solidum)
- [Issues](https://github.com/kluth/solidum/issues)

## 🙏 Acknowledgments

Inspired by the best ideas from:

- [SolidJS](https://www.solidjs.com/) - Fine-grained reactivity
- [React](https://react.dev/) - Component model
- [Vue](https://vuejs.org/) - Developer experience
- [Svelte](https://svelte.dev/) - Simplicity

---

**Built with ❤️ by Matthias Kluth**
