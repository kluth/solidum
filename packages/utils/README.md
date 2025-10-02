# @solidum/utils

> Utility functions for Solidum framework

## Installation

```bash
npm install @solidum/utils
# or
pnpm add @solidum/utils
```

## Features

- 🛠️ **Helpers** - Common utility functions
- 🎨 **Styling** - className utilities
- 📦 **Lightweight** - Minimal dependencies

## Quick Start

```typescript
import { cn, mergeProps } from '@solidum/utils';

// Conditional classNames
const className = cn('btn', {
  'btn-primary': isPrimary,
  'btn-disabled': isDisabled
});

// Merge props
const props = mergeProps(
  { className: 'base', onClick: handler1 },
  { className: 'extended', onClick: handler2 }
);
// Result: { className: 'base extended', onClick: [handler1, handler2] }
```

## API

### `cn(...inputs)`

Conditionally join classNames together.

```typescript
cn('btn', { 'btn-active': isActive }, ['extra', 'classes'])
// => 'btn btn-active extra classes'
```

### `mergeProps(...props)`

Merge multiple props objects intelligently.

## License

MIT © Matthias Kluth
