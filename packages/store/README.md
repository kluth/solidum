# @sldm/store

> Global state management for Solidum applications

## Installation

```bash
npm install @sldm/store @sldm/core
# or
pnpm add @sldm/store @sldm/core
```

## Features

- 🏪 **Global State** - Centralized state management
- ⚡ **Reactive** - Built on Solidum's reactivity
- 🎯 **Type-Safe** - Full TypeScript support
- 🔄 **Immutable Updates** - Nested property updates

## Quick Start

```typescript
import { createStore } from '@sldm/store';

// Create a store
const [state, setState] = createStore({
  user: { name: 'Alice', age: 30 },
  todos: [],
});

// Read state
console.log(state.user.name); // 'Alice'

// Update state (immutable)
setState('user', 'name', 'Bob');
setState('todos', todos => [...todos, { id: 1, text: 'Learn Solidum' }]);

// Use in effects
effect(() => {
  console.log('User:', state.user.name);
});
```

## API

### `createStore(initial)`

Creates a reactive store.

```typescript
const [state, setState] = createStore({ count: 0 });

// Update
setState('count', c => c + 1);
setState('count', 5);
```

## License

MIT © Matthias Kluth
