# Quick Start

Get up and running with Solidum in 5 minutes.

## Installation

::: code-group
```bash [npm]
npm install @solidum/core
```

```bash [pnpm]
pnpm add @solidum/core
```

```bash [yarn]
yarn add @solidum/core
```
:::

## Your First App

Create a simple counter application:

```typescript
import { atom, createElement, mount } from '@solidum/core'

// Create reactive state
const count = atom(0)

// Create component
function Counter() {
  return createElement('div', { style: { padding: '20px' } },
    createElement('h1', null, `Count: ${count()}`),
    createElement('button', {
      onClick: () => count(count() + 1),
      style: { marginRight: '8px' }
    }, '+'),
    createElement('button', {
      onClick: () => count(count() - 1)
    }, '-')
  )
}

// Mount to DOM
mount(document.getElementById('app'), () => createElement(Counter))
```

## Add Some Style

Let's make it look nicer:

```typescript
import { atom, createElement, mount, cn } from '@solidum/core'

const count = atom(0)

function Counter() {
  return createElement('div', {
    className: 'counter-container',
    style: {
      maxWidth: '400px',
      margin: '50px auto',
      padding: '32px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }
  },
    createElement('h1', {
      style: {
        fontSize: '48px',
        margin: '0 0 24px 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }
    }, count().toString()),

    createElement('div', { style: { display: 'flex', gap: '12px', justifyContent: 'center' } },
      createElement('button', {
        onClick: () => count(count() - 1),
        className: cn('btn'),
        style: {
          padding: '12px 24px',
          fontSize: '18px',
          borderRadius: '8px',
          border: 'none',
          background: '#667eea',
          color: 'white',
          cursor: 'pointer',
          fontWeight: '600'
        }
      }, '−'),

      createElement('button', {
        onClick: () => count(count() + 1),
        style: {
          padding: '12px 24px',
          fontSize: '18px',
          borderRadius: '8px',
          border: 'none',
          background: '#667eea',
          color: 'white',
          cursor: 'pointer',
          fontWeight: '600'
        }
      }, '+')
    )
  )
}

mount(document.getElementById('app'), () => createElement(Counter))
```

## Add Computed Values

Let's add derived state:

```typescript
import { atom, computed, createElement, mount } from '@solidum/core'

const count = atom(0)
const doubled = computed(() => count() * 2)
const status = computed(() => {
  const c = count()
  if (c === 0) return 'Zero'
  if (c > 0) return 'Positive'
  return 'Negative'
})

function Counter() {
  return createElement('div', { className: 'container' },
    createElement('h1', null, `Count: ${count()}`),
    createElement('p', null, `Doubled: ${doubled()}`),
    createElement('p', null, `Status: ${status()}`),

    createElement('button', { onClick: () => count(count() + 1) }, '+'),
    createElement('button', { onClick: () => count(count() - 1) }, '-'),
    createElement('button', { onClick: () => count(0) }, 'Reset')
  )
}

mount(document.getElementById('app'), () => createElement(Counter))
```

## Add Effects

Run side effects when data changes:

```typescript
import { atom, effect, createElement, mount } from '@solidum/core'

const count = atom(0)

// Update document title
effect(() => {
  document.title = `Count: ${count()}`
})

// Log to console
effect(() => {
  console.log('Count changed:', count())
})

// Save to localStorage
effect(() => {
  localStorage.setItem('count', count().toString())
})

function Counter() {
  return createElement('div', null,
    createElement('h1', null, `Count: ${count()}`),
    createElement('button', {
      onClick: () => count(count() + 1)
    }, 'Increment')
  )
}

mount(document.getElementById('app'), () => createElement(Counter))
```

## Use Context

Share state across components without prop drilling:

```typescript
import {
  atom,
  createContext,
  useContext,
  createElement,
  mount
} from '@solidum/core'

// Create context
const CountContext = createContext()

// Provider component
function App() {
  const count = atom(0)

  return createElement(
    CountContext.Provider,
    { value: count },
    createElement(Display),
    createElement(Controls)
  )
}

// Display component
function Display() {
  const count = useContext(CountContext)
  return createElement('h1', null, `Count: ${count()}`)
}

// Controls component
function Controls() {
  const count = useContext(CountContext)

  return createElement('div', null,
    createElement('button', {
      onClick: () => count(count() + 1)
    }, '+'),
    createElement('button', {
      onClick: () => count(count() - 1)
    }, '-')
  )
}

mount(document.getElementById('app'), () => createElement(App))
```

## Use a Store

For larger apps, use the store pattern:

```typescript
import { createStore, createElement, mount } from '@solidum/core'

// Create store
const counterStore = createStore({
  state: {
    count: 0,
    history: [] as number[]
  },

  getters: {
    doubled(state) {
      return state.count * 2
    }
  },

  actions: {
    increment(state) {
      return {
        ...state,
        count: state.count + 1,
        history: [...state.history, state.count + 1]
      }
    },
    decrement(state) {
      return {
        ...state,
        count: state.count - 1,
        history: [...state.history, state.count - 1]
      }
    },
    reset(state) {
      return {
        count: 0,
        history: [0]
      }
    }
  }
})

function Counter() {
  const count = counterStore.select(state => state.count)
  const doubled = counterStore.select(state => counterStore.getters.doubled(state))

  return createElement('div', null,
    createElement('h1', null, `Count: ${count()}`),
    createElement('p', null, `Doubled: ${doubled()}`),

    createElement('button', {
      onClick: () => counterStore.dispatch('increment')
    }, '+'),
    createElement('button', {
      onClick: () => counterStore.dispatch('decrement')
    }, '-'),
    createElement('button', {
      onClick: () => counterStore.dispatch('reset')
    }, 'Reset')
  )
}

mount(document.getElementById('app'), () => createElement(Counter))
```

## Next Steps

Now that you've got the basics:

- Learn more about [Reactivity](/guide/reactivity)
- Understand [Components](/guide/components)
- Explore the [Context API](/guide/context)
- Master the [Store Pattern](/guide/store)
- Check out [Examples](/examples/counter)
- Read the [API Reference](/api/reactive)
