# Store Pattern

The Store pattern provides centralized state management for complex applications.

## Creating a Store

```typescript
import { createStore } from '@sldm/core';

const todoStore = createStore({
  state: {
    todos: [],
    filter: 'all',
  },

  actions: {
    addTodo(state, text: string) {
      return {
        ...state,
        todos: [...state.todos, { id: Date.now(), text, done: false }],
      };
    },
  },
});
```

## Actions

Actions update state with pure functions:

```typescript
actions: {
  increment(state) {
    return { ...state, count: state.count + 1 }
  },
  setName(state, name: string) {
    return { ...state, name }
  }
}

// Dispatch actions
store.dispatch('increment')
store.dispatch('setName', 'Alice')
```

## Getters

Getters compute derived state:

```typescript
getters: {
  completedTodos(state) {
    return state.todos.filter(t => t.done)
  },
  activeTodos(state) {
    return state.todos.filter(t => !t.done)
  }
}

// Use getters
const completed = store.getters.completedTodos(store.getState())
```

## Effects

Effects handle async operations:

```typescript
effects: {
  async loadTodos({ dispatch }) {
    const todos = await fetch('/api/todos').then(r => r.json())
    todos.forEach(todo => dispatch('addTodo', todo.text))
  }
}

// Run effects
await store.effects.loadTodos()
```

## Selecting State

Use `select` for reactive subscriptions:

```typescript
const todos = store.select(state => state.todos);

effect(() => {
  console.log('Todos:', todos());
});
```

## Batching

Batch multiple updates:

```typescript
store.batch(() => {
  store.dispatch('addTodo', 'Task 1');
  store.dispatch('addTodo', 'Task 2');
  store.dispatch('setFilter', 'active');
});
```

## Learn More

- [API Reference](/api/store)
- [Examples](/examples/todo-app)
