# @solidum/context

> Context/dependency injection for Solidum

## Installation

```bash
npm install @solidum/context @solidum/core
# or
pnpm add @solidum/context @solidum/core
```

## Features

- 📦 **Dependency Injection** - Share data across component tree
- 🎯 **Type-Safe** - Full TypeScript support
- ⚡ **Reactive** - Context values can be reactive

## Quick Start

```typescript
import { createContext, useContext } from '@solidum/context';
import { createElement } from '@solidum/core';

// Create context
const ThemeContext = createContext('light');

// Provider
function App() {
  return createElement(ThemeContext.Provider, { value: 'dark' },
    createElement(ThemedButton, {})
  );
}

// Consumer
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return createElement('button', {
    className: `btn-${theme}`
  }, 'Click me');
}
```

## API

### `createContext(defaultValue)`

Creates a context.

### `useContext(context)`

Reads context value.

## License

MIT © Matthias Kluth
