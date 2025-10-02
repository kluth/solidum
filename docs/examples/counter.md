# Counter Example

A simple counter to demonstrate Solidum's reactive primitives.

## Basic Counter

```typescript
import { atom, createElement, mount } from '@solidum/core';

const count = atom(0);

function Counter() {
  return createElement(
    'div',
    {
      style: {
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'system-ui',
      },
    },
    createElement(
      'h1',
      {
        style: { fontSize: '48px', margin: '0 0 20px 0' },
      },
      count().toString()
    ),

    createElement(
      'div',
      { style: { display: 'flex', gap: '10px', justifyContent: 'center' } },
      createElement(
        'button',
        {
          onClick: () => count(count() - 1),
          style: {
            padding: '10px 20px',
            fontSize: '18px',
            borderRadius: '8px',
            border: 'none',
            background: '#667eea',
            color: 'white',
            cursor: 'pointer',
          },
        },
        '−'
      ),

      createElement(
        'button',
        {
          onClick: () => count(0),
          style: {
            padding: '10px 20px',
            fontSize: '18px',
            borderRadius: '8px',
            border: '1px solid #667eea',
            background: 'white',
            color: '#667eea',
            cursor: 'pointer',
          },
        },
        'Reset'
      ),

      createElement(
        'button',
        {
          onClick: () => count(count() + 1),
          style: {
            padding: '10px 20px',
            fontSize: '18px',
            borderRadius: '8px',
            border: 'none',
            background: '#667eea',
            color: 'white',
            cursor: 'pointer',
          },
        },
        '+'
      )
    )
  );
}

mount(document.getElementById('app'), () => createElement(Counter));
```

## With Computed Values

```typescript
import { atom, computed, createElement, mount } from '@solidum/core';

const count = atom(0);
const doubled = computed(() => count() * 2);
const squared = computed(() => count() ** 2);

function Counter() {
  return createElement(
    'div',
    { style: { padding: '20px' } },
    createElement('h1', null, `Count: ${count()}`),
    createElement('p', null, `Doubled: ${doubled()}`),
    createElement('p', null, `Squared: ${squared()}`),

    createElement(
      'div',
      { style: { display: 'flex', gap: '10px' } },
      createElement('button', { onClick: () => count(count() - 1) }, '−'),
      createElement('button', { onClick: () => count(0) }, 'Reset'),
      createElement('button', { onClick: () => count(count() + 1) }, '+')
    )
  );
}

mount(document.getElementById('app'), () => createElement(Counter));
```

## With Effects

```typescript
import { atom, effect, createElement, mount } from '@solidum/core';

const count = atom(0);

// Update document title
effect(() => {
  document.title = `Count: ${count()}`;
});

// Log to console
effect(() => {
  console.log('Count changed to:', count());
});

// Save to localStorage
effect(() => {
  localStorage.setItem('count', count().toString());
});

// Load from localStorage
const saved = localStorage.getItem('count');
if (saved) {
  count(parseInt(saved, 10));
}

function Counter() {
  return createElement(
    'div',
    null,
    createElement('h1', null, `Count: ${count()}`),
    createElement('button', { onClick: () => count(count() + 1) }, 'Increment')
  );
}

mount(document.getElementById('app'), () => createElement(Counter));
```

## With Store

```typescript
import { createStore, createElement, mount } from '@solidum/core';

const counterStore = createStore({
  state: {
    count: 0,
    history: [0] as number[],
  },

  getters: {
    doubled(state) {
      return state.count * 2;
    },
    canUndo(state) {
      return state.history.length > 1;
    },
  },

  actions: {
    increment(state) {
      const newCount = state.count + 1;
      return {
        count: newCount,
        history: [...state.history, newCount],
      };
    },
    decrement(state) {
      const newCount = state.count - 1;
      return {
        count: newCount,
        history: [...state.history, newCount],
      };
    },
    reset(state) {
      return {
        count: 0,
        history: [...state.history, 0],
      };
    },
    undo(state) {
      if (state.history.length <= 1) return state;
      const newHistory = state.history.slice(0, -1);
      return {
        count: newHistory[newHistory.length - 1],
        history: newHistory,
      };
    },
  },
});

function Counter() {
  const count = counterStore.select(state => state.count);
  const doubled = counterStore.select(state => counterStore.getters.doubled(state));
  const canUndo = counterStore.select(state => counterStore.getters.canUndo(state));

  return createElement(
    'div',
    { style: { padding: '20px' } },
    createElement('h1', null, `Count: ${count()}`),
    createElement('p', null, `Doubled: ${doubled()}`),

    createElement(
      'div',
      { style: { display: 'flex', gap: '10px', marginTop: '20px' } },
      createElement(
        'button',
        {
          onClick: () => counterStore.dispatch('decrement'),
        },
        '−'
      ),

      createElement(
        'button',
        {
          onClick: () => counterStore.dispatch('increment'),
        },
        '+'
      ),

      createElement(
        'button',
        {
          onClick: () => counterStore.dispatch('reset'),
        },
        'Reset'
      ),

      createElement(
        'button',
        {
          onClick: () => counterStore.dispatch('undo'),
          disabled: !canUndo(),
        },
        'Undo'
      )
    )
  );
}

mount(document.getElementById('app'), () => createElement(Counter));
```

## Live Demo

::: tip Try it yourself
Copy any of the examples above and run them in your browser!
:::

## Key Concepts

This example demonstrates:

- **Atoms** - Reactive state with `atom()`
- **Computed** - Derived values with `computed()`
- **Effects** - Side effects with `effect()`
- **Store** - Centralized state with `createStore()`
- **Components** - UI composition with `createElement()`
- **Events** - User interactions with `onClick`

## Next Steps

- Check out the [Todo App example](/examples/todo-app)
- Learn more about [Reactivity](/guide/reactivity)
- Explore the [Store Pattern](/guide/store)
