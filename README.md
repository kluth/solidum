# Solidum

> **A fine-grained reactive JavaScript framework for building user interfaces**

Solidum is a lightweight, performant framework that combines fine-grained reactivity with a flexible component model. Build modern web applications with reactive primitives, centralized state management, and a rich extensibility system.

## Features

- **Fine-Grained Reactivity**: Efficient updates with atom, computed, and effect primitives
- **Smart Batching**: Automatic update batching for optimal performance
- **Context API**: Dependency injection without prop drilling
- **Store Pattern**: Centralized state management with actions, getters, and effects
- **Component Utilities**: Helper functions for building component libraries
- **JSX Alternative**: Component system using createElement
- **Type-Safe**: Fully typed TypeScript with strict mode
- **Extensible**: Easy to build libraries like Material UI, state management, forms, etc.

## Documentation

📚 **[View the full documentation](https://kluth.github.io/solidum/)**

The comprehensive documentation includes:

- Detailed guides and tutorials
- Complete API reference
- Interactive examples
- Best practices

The documentation is automatically deployed to GitHub Pages on every push to master.

### Local Documentation

To run the documentation site locally:

```bash
cd docs
pnpm install
pnpm dev
```

Then visit `http://localhost:5173`

## Installation

```bash
npm install @solidum/core
```

## Quick Start

```typescript
import { atom, computed, effect, createElement, mount } from '@solidum/core';

// Create reactive state
const count = atom(0);
const doubled = computed(() => count() * 2);

// React to changes
effect(() => {
  console.log(`Count: ${count()}, Doubled: ${doubled()}`);
});

// Update state
count(5); // Console: Count: 5, Doubled: 10

// Build UI
function Counter() {
  const count = atom(0);

  return createElement(
    'div',
    null,
    createElement('h1', null, 'Count: ', String(count())),
    createElement(
      'button',
      {
        onClick: () => count(count() + 1),
      },
      'Increment'
    )
  );
}

// Mount to DOM
mount(document.getElementById('app'), () => createElement(Counter));
```

## Core Concepts

### Reactive Primitives

#### Atom - Mutable State

```typescript
import { atom } from '@solidum/core';

// Create atom with initial value
const count = atom(0);

// Read value
console.log(count()); // 0

// Write value
count(5);

// Subscribe to changes
const unsubscribe = count.subscribe(newValue => {
  console.log('Count changed:', newValue);
});

// Unsubscribe when done
unsubscribe();
```

#### Computed - Derived State

```typescript
import { atom, computed } from '@solidum/core';

const firstName = atom('John');
const lastName = atom('Doe');

const fullName = computed(() => {
  return `${firstName()} ${lastName()}`;
});

console.log(fullName()); // "John Doe"

firstName('Jane');
console.log(fullName()); // "Jane Doe"
```

#### Effect - Side Effects

```typescript
import { atom, effect } from '@solidum/core';

const count = atom(0);

// Effect runs when dependencies change
effect(() => {
  console.log('Count is:', count());
  document.title = `Count: ${count()}`;
});

count(5); // Updates document.title
```

#### Batch - Optimize Updates

```typescript
import { atom, batch } from '@solidum/core';

const firstName = atom('John');
const lastName = atom('Doe');

// Batch multiple updates into one notification
batch(() => {
  firstName('Jane');
  lastName('Smith');
});
// Subscribers only notified once
```

### Context API

Pass data through component tree without prop drilling:

```typescript
import { createContext, useContext, createElement } from '@solidum/core';

// Create context
const ThemeContext = createContext();

// Provide value
function App() {
  const theme = atom({ mode: 'dark', primary: '#667eea' });

  return createElement(ThemeContext.Provider, { value: theme }, createElement(Button));
}

// Consume value
function Button() {
  const theme = useContext(ThemeContext);

  return createElement(
    'button',
    {
      style: { color: theme().primary },
    },
    'Click me'
  );
}
```

### Store Pattern

Centralized state management for complex applications:

```typescript
import { createStore } from '@solidum/core';

const todoStore = createStore({
  // Initial state
  state: {
    todos: [],
    filter: 'all',
  },

  // Derived state
  getters: {
    filteredTodos(state) {
      return state.todos.filter(todo => {
        if (state.filter === 'active') return !todo.completed;
        if (state.filter === 'completed') return todo.completed;
        return true;
      });
    },
  },

  // State updates (pure functions)
  actions: {
    addTodo(state, text) {
      return {
        ...state,
        todos: [...state.todos, { id: Date.now(), text, completed: false }],
      };
    },
    toggleTodo(state, id) {
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    },
  },

  // Async operations
  effects: {
    async loadTodos({ dispatch }) {
      const todos = await api.getTodos();
      todos.forEach(todo => dispatch('addTodo', todo.text));
    },
  },
});

// Dispatch actions
todoStore.dispatch('addTodo', 'Learn Solidum');

// Select reactive state
const todos = todoStore.select(state => state.todos);
console.log(todos());

// Run effects
await todoStore.effects.loadTodos();
```

### Component Utilities

Helper functions for building component libraries:

```typescript
import { mergeProps, cn } from '@solidum/core';

// Conditional class names
const classes = cn(
  'btn',
  'btn-primary',
  {
    'btn-active': isActive,
    'btn-disabled': isDisabled,
  },
  ['extra-class-1', 'extra-class-2']
);

// Merge props intelligently
const merged = mergeProps(
  { className: 'base', onClick: handler1, style: { color: 'red' } },
  { className: 'extra', onClick: handler2, style: { fontSize: '16px' } }
);
// Result: {
//   className: 'base extra',
//   onClick: [both handlers chained],
//   style: { color: 'red', fontSize: '16px' }
// }
```

## Component System

### Creating Components

```typescript
import { createElement, atom } from '@solidum/core';

function Counter() {
  const count = atom(0);

  return createElement(
    'div',
    { className: 'counter' },
    createElement('h1', null, 'Count: ', String(count())),
    createElement(
      'button',
      {
        onClick: () => count(count() + 1),
      },
      'Increment'
    ),
    createElement(
      'button',
      {
        onClick: () => count(count() - 1),
      },
      'Decrement'
    )
  );
}
```

### Component Props

```typescript
function Greeting({ name, age }) {
  return createElement(
    'div',
    null,
    createElement('h1', null, `Hello, ${name}!`),
    createElement('p', null, `You are ${age} years old.`)
  );
}

// Usage
createElement(Greeting, { name: 'Alice', age: 30 });
```

### Lifecycle Hooks

```typescript
import { onMount, onCleanup } from '@solidum/core';

function Timer() {
  const seconds = atom(0);

  onMount(() => {
    const interval = setInterval(() => {
      seconds(seconds() + 1);
    }, 1000);

    onCleanup(() => {
      clearInterval(interval);
    });
  });

  return createElement('div', null, `Seconds: ${seconds()}`);
}
```

## Examples

### Todo App

See [examples/todo-app](./examples/todo-app) for a comprehensive example showcasing:

- Reactive primitives (atom, computed, effect)
- Store pattern for state management
- Context API for theme management
- Component utilities (cn)
- Lifecycle hooks (onMount)
- LocalStorage persistence

Run it:

```bash
cd examples/todo-app
python -m http.server 8080
# Open http://localhost:8080
```

## Architecture

```
@solidum/core
├── reactive/      # Reactive primitives (atom, computed, effect, batch)
├── context/       # Context API for dependency injection
├── store/         # Store pattern for state management
├── utils/         # Component utilities (mergeProps, cn)
└── dom/           # Component system and rendering
```

## Testing

```bash
# Run all tests
pnpm test

# Run specific package tests
pnpm --filter @solidum/core test

# Watch mode
pnpm --filter @solidum/core test:watch
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

## API Reference

### Reactive Primitives

- `atom<T>(initialValue: T): Atom<T>` - Create mutable reactive state
- `computed<T>(fn: () => T): Computed<T>` - Create derived state
- `effect(fn: () => void): Dispose` - Run side effects
- `batch(fn: () => void): void` - Batch multiple updates

### Context API

- `createContext<T>(defaultValue?: T): Context<T>` - Create context
- `useContext<T>(context: Context<T>): T` - Consume context value

### Store Pattern

- `createStore<State, Actions, Getters, Effects>(config): Store` - Create store

### Component Utilities

- `mergeProps(...sources: Props[]): Props` - Merge props intelligently
- `cn(...classes: ClassValue[]): string` - Conditional class names

### Component System

- `createElement(type, props, ...children): VNode` - Create virtual node
- `Fragment` - Fragment component for grouping
- `render(vnode, document?): Node` - Render to DOM
- `mount(container, component, document?): Dispose` - Mount component
- `onMount(fn: () => void): void` - Lifecycle hook
- `onCleanup(fn: () => void): void` - Cleanup hook

## Extensibility

Solidum is designed to be extensible. Build your own:

### UI Component Libraries

```typescript
import { cn, mergeProps, useContext } from '@solidum/core';

export function Button({ variant = 'primary', size = 'md', ...props }) {
  const theme = useContext(ThemeContext);

  return createElement(
    'button',
    mergeProps(
      {
        className: cn('btn', `btn-${variant}`, `btn-${size}`, props.className),
      },
      props
    )
  );
}
```

### State Management Libraries

```typescript
import { createStore, createContext } from '@solidum/core';

export function createGlobalStore(config) {
  const store = createStore(config);
  const StoreContext = createContext();

  return {
    store,
    Provider: ({ children }) => {
      return createElement(StoreContext.Provider, { value: store }, children);
    },
    useStore: () => useContext(StoreContext),
  };
}
```

### Form Libraries

```typescript
import { atom, computed } from '@solidum/core';

export function useForm(config) {
  const values = atom(config.initialValues);
  const errors = atom({});
  const touched = atom({});

  const isValid = computed(() => {
    return Object.keys(errors()).length === 0;
  });

  return { values, errors, touched, isValid, handleSubmit, register };
}
```

## Performance

- **Fine-Grained Updates**: Only affected components re-render
- **Automatic Batching**: Multiple updates batched automatically
- **Computed Caching**: Derived values cached until dependencies change
- **Memory Efficient**: Small bundle size, minimal overhead

## Browser Support

Works in all modern browsers supporting:

- ES6 modules
- Proxy
- Symbol
- WeakMap

## Contributing

Contributions welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT

## Acknowledgments

Inspired by:

- [SolidJS](https://www.solidjs.com/) - Fine-grained reactivity
- [React](https://react.dev/) - Component model
- [Vue](https://vuejs.org/) - Reactivity system
- [Svelte](https://svelte.dev/) - Compiler optimizations

---

**Built with ❤️ for reactive web applications**
