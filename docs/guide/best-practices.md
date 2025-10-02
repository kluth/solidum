# Best Practices

Guidelines for writing clean, performant Solidum applications.

## Reactivity

### Keep Computeds Pure

Computeds should be pure functions without side effects:

```typescript
// ✅ Good
const doubled = computed(() => count() * 2);

// ❌ Bad
const doubled = computed(() => {
  console.log('Computing...'); // Side effect!
  return count() * 2;
});
```

### Use Effects for Side Effects

Put side effects in effects, not computeds:

```typescript
// ✅ Good
effect(() => {
  console.log('Count:', count());
});

// ❌ Bad
const logged = computed(() => {
  console.log('Count:', count());
  return count();
});
```

### Batch Related Updates

Group related updates for better performance:

```typescript
// ✅ Good
batch(() => {
  firstName('Jane');
  lastName('Smith');
  age(25);
});

// ❌ Okay but less efficient
firstName('Jane');
lastName('Smith');
age(25);
```

### Clean Up Effects

Always clean up resources in effects:

```typescript
// ✅ Good
effect(() => {
  const interval = setInterval(() => tick(), 1000);
  return () => clearInterval(interval);
});

// ❌ Bad - memory leak
effect(() => {
  setInterval(() => tick(), 1000);
});
```

## Components

### Extract Reusable Components

Break down complex UIs into smaller components:

```typescript
// ✅ Good
function TodoList() {
  return createElement(
    'ul',
    null,
    todos().map(todo => createElement(TodoItem, { key: todo.id, todo }))
  );
}

function TodoItem({ todo }) {
  return createElement('li', null, todo.text);
}

// ❌ Bad - everything in one component
function TodoList() {
  return createElement(
    'ul',
    null,
    todos().map(todo =>
      createElement(
        'li',
        {
          className: cn('todo-item', { completed: todo.done }),
          onClick: () => toggle(todo.id),
        },
        createElement('input', {
          type: 'checkbox',
          checked: todo.done,
          onChange: () => toggle(todo.id),
        }),
        createElement('span', null, todo.text),
        createElement(
          'button',
          {
            onClick: () => remove(todo.id),
          },
          'Delete'
        )
      )
    )
  );
}
```

### Use Local State

Keep state close to where it's used:

```typescript
// ✅ Good
function Counter() {
  const count = atom(0); // Local to component

  return createElement(
    'button',
    {
      onClick: () => count(count() + 1),
    },
    `Count: ${count()}`
  );
}
```

### Prop Typing

Use TypeScript interfaces for props:

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children?: any;
}

function Button({ variant = 'primary', ...props }: ButtonProps) {
  // ...
}
```

## State Management

### Use Store for Global State

Use stores for app-wide state:

```typescript
// ✅ Good - global store
const appStore = createStore({
  state: { user: null, settings: {} },
  actions: {
    /* ... */
  },
});

// ❌ Bad - global atom
const globalUser = atom(null);
```

### Keep Actions Pure

Store actions should be pure functions:

```typescript
// ✅ Good
actions: {
  addTodo(state, text: string) {
    return {
      ...state,
      todos: [...state.todos, { id: Date.now(), text, done: false }]
    }
  }
}

// ❌ Bad - mutates state
actions: {
  addTodo(state, text: string) {
    state.todos.push({ id: Date.now(), text, done: false })
    return state
  }
}
```

### Use Effects for Async

Handle async operations in effects:

```typescript
effects: {
  async loadData({ dispatch, getState }) {
    dispatch('setLoading', true)
    const data = await fetchData()
    dispatch('setData', data)
  }
}
```

## Performance

### Memoize Expensive Computations

Use computed for expensive calculations:

```typescript
// ✅ Good
const expensive = computed(() => {
  return heavyCalculation(data());
});

// ❌ Bad - recalculates every time
function Component() {
  const result = heavyCalculation(data());
  return createElement('div', null, result);
}
```

### Avoid Deep Nesting

Keep component trees shallow:

```typescript
// ✅ Good
function App() {
  return createElement(
    Layout,
    null,
    createElement(Header),
    createElement(Main),
    createElement(Footer)
  );
}

// ❌ Bad - deeply nested
function App() {
  return createElement(
    'div',
    null,
    createElement('div', null, createElement('div', null, createElement('div', null /* ... */)))
  );
}
```

### Use Keys for Lists

Always provide keys for list items:

```typescript
// ✅ Good
todos().map(todo => createElement(TodoItem, { key: todo.id, todo }));

// ❌ Bad - no keys
todos().map(todo => createElement(TodoItem, { todo }));
```

## Code Organization

### File Structure

Organize code by feature:

```
src/
├── features/
│   ├── todos/
│   │   ├── TodoList.ts
│   │   ├── TodoItem.ts
│   │   └── todoStore.ts
│   └── auth/
│       ├── Login.ts
│       └── authStore.ts
├── components/
│   ├── Button.ts
│   └── Input.ts
└── utils/
    └── helpers.ts
```

### Naming Conventions

Use clear, descriptive names:

```typescript
// ✅ Good
const userCount = atom(0);
const isAuthenticated = computed(() => user() !== null);
const loadUserData = async () => {
  /* ... */
};

// ❌ Bad
const u = atom(0);
const x = computed(() => y() !== null);
const func = async () => {
  /* ... */
};
```

### Export Only What's Needed

Keep implementation details private:

```typescript
// ✅ Good
const internalHelper = () => {
  /* ... */
};

export function publicAPI() {
  return internalHelper();
}

// ❌ Bad - exports everything
export const helper1 = () => {
  /* ... */
};
export const helper2 = () => {
  /* ... */
};
export const helper3 = () => {
  /* ... */
};
```

## Testing

### Test Business Logic

Focus tests on business logic, not implementation:

```typescript
// ✅ Good
test('should calculate total price correctly', () => {
  const store = createStore({
    /* ... */
  });
  store.dispatch('addItem', { price: 10, quantity: 2 });
  expect(store.getters.total(store.getState())).toBe(20);
});

// ❌ Bad - testing implementation
test('should update items array', () => {
  const store = createStore({
    /* ... */
  });
  store.dispatch('addItem', { price: 10, quantity: 2 });
  expect(store.getState().items.length).toBe(1);
  expect(store.getState().items[0].price).toBe(10);
});
```

### Use Test Utilities

Leverage built-in testing utilities:

```typescript
import { createDOMEnvironment, UserInteraction } from '@solidum/testing';

test('should handle user input', async () => {
  const env = createDOMEnvironment();
  try {
    const input = env.document.createElement('input');
    await UserInteraction.type(input, 'Hello');
    expect(input.value).toBe('Hello');
  } finally {
    env.cleanup();
  }
});
```

## Learn More

- [Testing Guide](/guide/testing)
- [Examples](/examples/counter)
