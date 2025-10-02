# Solidum Extensibility Architecture

## Overview

Design patterns and APIs that enable building rich library ecosystems like Angular Material, NgRx, etc.

## Core Extensibility Features

### 1. Context API (Dependency Injection)

Provides a way to pass data through component trees without prop drilling.

```typescript
// Create a context
const ThemeContext = createContext<Theme>();

// Provide value
function App() {
  const theme = atom({ mode: 'dark' });

  return (
    <ThemeContext.Provider value={theme}>
      <Dashboard />
    </ThemeContext.Provider>
  );
}

// Consume value
function Button() {
  const theme = useContext(ThemeContext);
  return <button style={{ color: theme().mode === 'dark' ? '#fff' : '#000' }}>
    Click
  </button>;
}
```

### 2. Store Pattern (State Management)

Centralized state management for complex applications.

```typescript
// Define store
const store = createStore({
  state: {
    user: null,
    todos: []
  },
  actions: {
    addTodo(state, todo) {
      return { ...state, todos: [...state.todos, todo] };
    },
    setUser(state, user) {
      return { ...state, user };
    }
  },
  effects: {
    async loadUser({ dispatch }) {
      const user = await fetchUser();
      dispatch('setUser', user);
    }
  }
});

// Use in components
function TodoList() {
  const todos = store.select(state => state.todos);

  return (
    <ul>
      {todos().map(todo => <li>{todo.text}</li>)}
    </ul>
  );
}
```

### 3. Directives/Composables

Reusable behavior patterns.

```typescript
// Directive for click outside
function useClickOutside(ref: Atom<HTMLElement>, callback: () => void) {
  onMount(() => {
    const handleClick = (e: Event) => {
      if (!ref()?.contains(e.target)) {
        callback();
      }
    };

    document.addEventListener('click', handleClick);
    onCleanup(() => document.removeEventListener('click', handleClick));
  });
}

// Usage
function Dropdown() {
  const dropdownRef = atom<HTMLElement>(null);
  const isOpen = atom(false);

  useClickOutside(dropdownRef, () => isOpen(false));

  return <div ref={dropdownRef}>...</div>;
}
```

### 4. Component Utilities

Helpers for building component libraries.

```typescript
// Props merging
function mergeProps(...sources: Props[]): Props;

// Class name helper
function cn(...classes: (string | Record<string, boolean>)[]): string;

// Ref forwarding
function forwardRef<T>(component: Component<T>): Component<T>;

// Polymorphic components
function createPolymorphic<T>(defaultAs: string): PolymorphicComponent<T>;
```

### 5. Animation System

Declarative animations for UI libraries.

```typescript
// Transition component
<Transition
  show={isOpen()}
  enter="opacity-0"
  enterTo="opacity-100"
  leave="opacity-100"
  leaveTo="opacity-0"
>
  <Dialog />
</Transition>

// Animation hooks
const { play, pause, reset } = useAnimation(element, {
  keyframes: [
    { transform: 'translateX(0)' },
    { transform: 'translateX(100px)' }
  ],
  duration: 300
});
```

## Example Libraries

### Material-Style UI Library

```typescript
// @solidum/material
export function Button({ variant = 'contained', color = 'primary', ...props }) {
  const theme = useContext(ThemeContext);
  const ripple = useRipple();

  return (
    <button
      class={cn(
        'btn',
        `btn-${variant}`,
        `btn-${color}`,
        ripple.class()
      )}
      onPointerDown={ripple.onPointerDown}
      {...props}
    />
  );
}

export function Dialog({ open, onClose, children }) {
  return (
    <Portal>
      <Transition show={open()}>
        <div class="dialog-overlay" onClick={onClose}>
          <div class="dialog-content">
            {children}
          </div>
        </div>
      </Transition>
    </Portal>
  );
}
```

### State Management Library

```typescript
// @solidum/store
export const todoStore = createStore({
  state: {
    todos: [],
    filter: 'all',
  },

  getters: {
    filteredTodos: state => {
      return state.todos.filter(todo => {
        if (state.filter === 'active') return !todo.done;
        if (state.filter === 'completed') return todo.done;
        return true;
      });
    },
  },

  actions: {
    addTodo(state, text: string) {
      return {
        ...state,
        todos: [...state.todos, { id: Date.now(), text, done: false }],
      };
    },
  },

  effects: {
    async loadTodos({ setState }) {
      const todos = await api.getTodos();
      setState(state => ({ ...state, todos }));
    },
  },
});
```

### Form Library

```typescript
// @solidum/forms
export function useForm<T>(config: FormConfig<T>) {
  const values = atom<T>(config.initialValues);
  const errors = atom<Record<string, string>>({});
  const touched = atom<Record<string, boolean>>({});

  const validate = () => {
    const newErrors = config.validate?.(values()) || {};
    errors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (validate()) {
      await config.onSubmit(values());
    }
  };

  return {
    values,
    errors,
    touched,
    handleSubmit,
    register: (name: keyof T) => ({
      value: computed(() => values()[name]),
      onChange: (e: Event) => {
        values(v => ({ ...v, [name]: e.target.value }));
        touched(t => ({ ...t, [name]: true }));
      },
    }),
  };
}
```

## Implementation Priority

1. **Context API** - Foundation for DI patterns
2. **Store Pattern** - State management infrastructure
3. **Component Utilities** - Building block helpers
4. **Animation System** - UI transitions
5. **Portal** - Render outside component tree
6. **Directives** - Reusable behavior patterns

## Design Principles

1. **Composability** - Small, focused primitives that compose
2. **Type Safety** - Full TypeScript support
3. **Performance** - Leverage fine-grained reactivity
4. **Simplicity** - Easy to understand and use
5. **Flexibility** - Don't constrain library authors
6. **Tree-shakeable** - Import only what you use
