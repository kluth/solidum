# @sldm/core

> Reactive primitives and core runtime for Solidum framework

## Installation

```bash
npm install @sldm/core
# or
pnpm add @sldm/core
```

## Features

- ⚡ **Fine-Grained Reactivity** - Efficient updates with atom, computed, and effect primitives
- 🎯 **Simple API** - Intuitive and easy to learn
- 📦 **Lightweight** - Zero dependencies, small bundle size
- 🔧 **Type-Safe** - Fully typed with TypeScript
- 🧪 **Well-Tested** - Comprehensive test suite

## Quick Start

```typescript
import { atom, computed, effect, createElement, mount } from '@sldm/core';

// Create reactive state
const count = atom(0);
const doubled = computed(() => count() * 2);

// React to changes
effect(() => {
  console.log(`Count: ${count()}, Doubled: ${doubled()}`);
});

// Update state
count(5); // Console: Count: 5, Doubled: 10

// Create UI
function Counter() {
  return createElement(
    'div',
    {},
    createElement('p', {}, `Count: ${count()}`),
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
mount(document.getElementById('app'), Counter);
```

## Core APIs

### Reactivity

- **`atom(value)`** - Create reactive state
- **`computed(fn)`** - Derive values from atoms
- **`effect(fn)`** - Run side effects when atoms change
- **`batch(fn)`** - Batch multiple updates
- **`useState(value)`** - Component-local state (auto-reactive)

### DOM

- **`createElement(type, props, ...children)`** - Create virtual nodes
- **`render(vnode)`** - Render VNode to DOM
- **`mount(container, component)`** - Mount reactive component

## Documentation

Visit [https://kluth.github.io/solidum](https://kluth.github.io/solidum) for full documentation.

## License

MIT © Matthias Kluth
