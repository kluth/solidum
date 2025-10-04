# Store Guide

Umfassender Guide für State Management mit @sldm/store.

## Table of Contents

- [Installation](#installation)
- [Grundkonzepte](#grundkonzepte)
- [Quick Start](#quick-start)
- [State Management](#state-management)
- [Actions](#actions)
- [Getters](#getters)
- [Selectors](#selectors)
- [Effects](#effects)
- [Middleware](#middleware)
- [Batching Updates](#batching-updates)
- [Best Practices](#best-practices)
- [Real-World Examples](#real-world-examples)

## Installation

```bash
pnpm add @sldm/store
```

## Grundkonzepte

Der **Store** ist ein zentralisiertes State-Management-Pattern für komplexe Anwendungen. Er bietet:

- **Immutable State** - State wird niemals direkt mutiert
- **Actions** - Definierte Wege um State zu ändern
- **Getters** - Berechnete Werte basierend auf State
- **Selectors** - Reaktive Subscriptions zu State-Slices
- **Effects** - Side Effects mit Zugriff auf Store
- **Middleware** - Erweiterung der Dispatch-Logik
- **Batching** - Performance-Optimierung für mehrere Updates

### Store vs. direkte Atoms

**Wann Store verwenden:**

- Komplexe State-Strukturen
- Viele zusammenhängende Daten
- Zentrale Business-Logik
- Middleware-Anforderungen (Logging, DevTools, etc.)
- Team-Standards für State Management

**Wann direkte Atoms verwenden:**

- Einfacher lokaler State
- UI-spezifischer State (z.B. "is menu open?")
- Prototyping
- Kleine Komponenten

## Quick Start

### Einfacher Counter Store

```typescript
import { createStore } from '@sldm/store';
import { createElement, effect } from '@sldm/core';

// Store erstellen
const counterStore = createStore({
  state: {
    count: 0,
  },
  actions: {
    increment(state) {
      return { ...state, count: state.count + 1 };
    },
    decrement(state) {
      return { ...state, count: state.count - 1 };
    },
    reset(state) {
      return { ...state, count: 0 };
    },
  },
  getters: {
    doubled(state) {
      return state.count * 2;
    },
    isPositive(state) {
      return state.count > 0;
    },
  },
});

// In Komponente verwenden
function Counter() {
  const count = counterStore.select(state => state.count);
  const doubled = counterStore.select(state => counterStore.getters.doubled(state));

  return createElement('div', {}, [
    createElement('p', {}, `Count: ${count()}`),
    createElement('p', {}, `Doubled: ${doubled()}`),
    createElement(
      'button',
      {
        onclick: () => counterStore.dispatch('increment'),
      },
      '+'
    ),
    createElement(
      'button',
      {
        onclick: () => counterStore.dispatch('decrement'),
      },
      '-'
    ),
    createElement(
      'button',
      {
        onclick: () => counterStore.dispatch('reset'),
      },
      'Reset'
    ),
  ]);
}
```

## State Management

### State Definition

State sollte immer ein Plain Object sein und alle relevanten Daten enthalten:

```typescript
interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  isLoading: boolean;
  error: string | null;
}

const todoStore = createStore({
  state: {
    todos: [],
    filter: 'all',
    isLoading: false,
    error: null,
  } as TodoState,
  // ...
});
```

### State lesen

```typescript
// Aktuellen State abrufen (nicht reaktiv)
const currentState = todoStore.getState();
console.log(currentState.todos);

// Reaktiver Zugriff mit select()
const todos = todoStore.select(state => state.todos);
const filter = todoStore.select(state => state.filter);

effect(() => {
  console.log('Todos changed:', todos());
  console.log('Filter:', filter());
});
```

## Actions

Actions sind die **einzige** Möglichkeit, State zu ändern. Sie sind pure functions die neuen State zurückgeben.

### Einfache Actions

```typescript
const store = createStore({
  state: { count: 0 },
  actions: {
    // Action ohne Payload
    increment(state) {
      return { ...state, count: state.count + 1 };
    },
  },
});

// Dispatch ohne Argument
store.dispatch('increment');
```

### Actions mit Payload

```typescript
const store = createStore({
  state: { count: 0 },
  actions: {
    // Action mit Payload
    add(state, amount: number) {
      return { ...state, count: state.count + amount };
    },

    set(state, value: number) {
      return { ...state, count: value };
    },
  },
});

// Dispatch mit Argument
store.dispatch('add', 5);
store.dispatch('set', 100);
```

### Komplexe Actions

```typescript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  nextId: number;
}

const todoStore = createStore({
  state: {
    todos: [],
    nextId: 1,
  } as TodoState,
  actions: {
    addTodo(state, text: string) {
      const newTodo: Todo = {
        id: String(state.nextId),
        text,
        completed: false,
      };

      return {
        ...state,
        todos: [...state.todos, newTodo],
        nextId: state.nextId + 1,
      };
    },

    toggleTodo(state, id: string) {
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    },

    deleteTodo(state, id: string) {
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== id),
      };
    },

    clearCompleted(state) {
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };
    },
  },
});
```

## Getters

Getters sind **berechnete Werte** basierend auf State. Sie werden NICHT gecached.

```typescript
const store = createStore({
  state: {
    todos: [] as Todo[],
    filter: 'all' as 'all' | 'active' | 'completed',
  },
  getters: {
    // Einfacher Getter
    totalCount(state) {
      return state.todos.length;
    },

    // Komplexer Getter
    activeTodos(state) {
      return state.todos.filter(todo => !todo.completed);
    },

    completedTodos(state) {
      return state.todos.filter(todo => todo.completed);
    },

    // Getter der andere Getter nutzt
    // (store.getters ist NICHT verfügbar in Getter selbst)
    filteredTodos(state) {
      const { todos, filter } = state;

      if (filter === 'active') {
        return todos.filter(todo => !todo.completed);
      }
      if (filter === 'completed') {
        return todos.filter(todo => todo.completed);
      }
      return todos;
    },

    // Statistiken
    stats(state) {
      const total = state.todos.length;
      const completed = state.todos.filter(t => t.completed).length;
      const active = total - completed;

      return {
        total,
        completed,
        active,
        percentComplete: total > 0 ? (completed / total) * 100 : 0,
      };
    },
  },
});

// Getter in Komponente verwenden
function TodoStats() {
  const stats = store.select(state => store.getters.stats(state));

  return createElement('div', {}, [
    createElement('p', {}, `Total: ${stats().total}`),
    createElement('p', {}, `Active: ${stats().active}`),
    createElement('p', {}, `Completed: ${stats().completed}`),
    createElement('p', {}, `${stats().percentComplete.toFixed(1)}% done`),
  ]);
}
```

## Selectors

Selectors erstellen **reaktive Computed Values** aus Store State.

```typescript
const store = createStore({
  state: {
    users: [] as User[],
    selectedUserId: null as string | null,
  },
  // ...
});

// Einfacher Selector
const users = store.select(state => state.users);

effect(() => {
  console.log('Users updated:', users());
});

// Abgeleiteter Selector
const selectedUser = store.select(state => {
  const { users, selectedUserId } = state;
  return users.find(u => u.id === selectedUserId) || null;
});

// Mehrere Selectors kombinieren
function UserProfile() {
  const user = store.select(state => {
    const { users, selectedUserId } = state;
    return users.find(u => u.id === selectedUserId);
  });

  const isSelected = store.select(state => state.selectedUserId !== null);

  return createElement('div', {}, [
    isSelected()
      ? createElement('h1', {}, user()?.name || 'Unknown')
      : createElement('p', {}, 'No user selected'),
  ]);
}
```

## Effects

Effects sind **Side Effects** mit Zugriff auf Store Context.

```typescript
interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

const cartStore = createStore({
  state: {
    items: [],
    isLoading: false,
    error: null,
  } as CartState,

  actions: {
    setLoading(state, isLoading: boolean) {
      return { ...state, isLoading };
    },

    setError(state, error: string | null) {
      return { ...state, error };
    },

    setItems(state, items: CartItem[]) {
      return { ...state, items, isLoading: false };
    },
  },

  effects: {
    // Async Effect: Daten laden
    async loadCart(ctx) {
      ctx.dispatch('setLoading', true);
      ctx.dispatch('setError', null);

      try {
        const response = await fetch('/api/cart');
        const items = await response.json();
        ctx.dispatch('setItems', items);
      } catch (error) {
        ctx.dispatch('setError', (error as Error).message);
        ctx.dispatch('setLoading', false);
      }
    },

    // Effect mit Parameter
    async addItemToCart(ctx, productId: string) {
      const currentItems = ctx.getState().items;

      // Optimistic Update
      const newItem = { productId, quantity: 1 };
      ctx.dispatch('setItems', [...currentItems, newItem]);

      try {
        await fetch('/api/cart', {
          method: 'POST',
          body: JSON.stringify(newItem),
        });
      } catch (error) {
        // Rollback on error
        ctx.dispatch('setItems', currentItems);
        ctx.dispatch('setError', 'Failed to add item');
      }
    },

    // Effect für Sync-Logik
    clearAll(ctx) {
      if (confirm('Clear entire cart?')) {
        ctx.dispatch('setItems', []);
      }
    },
  },
});

// Effects aufrufen
function ShoppingCart() {
  // Load on mount
  effect(() => {
    cartStore.effects.loadCart();
  });

  const handleAddItem = (productId: string) => {
    cartStore.effects.addItemToCart(productId);
  };

  return createElement(
    'button',
    {
      onclick: () => handleAddItem('product-123'),
    },
    'Add to Cart'
  );
}
```

## Middleware

Middleware erweitert die Dispatch-Logik (Logging, DevTools, etc.).

### Logger Middleware

```typescript
function loggerMiddleware<State>() {
  return (store: { getState: () => State }) =>
    (next: (action: string, payload?: unknown) => void) =>
    (action: string, payload?: unknown) => {
      console.group(`Action: ${action}`);
      console.log('Payload:', payload);
      console.log('State before:', store.getState());

      next(action, payload);

      console.log('State after:', store.getState());
      console.groupEnd();
    };
}

const store = createStore({
  state: { count: 0 },
  actions: {
    increment(state) {
      return { ...state, count: state.count + 1 };
    },
  },
  middleware: loggerMiddleware(),
});

store.dispatch('increment');
// Console:
// Action: increment
//   Payload: undefined
//   State before: { count: 0 }
//   State after: { count: 1 }
```

### Async Middleware

```typescript
function asyncMiddleware<State>() {
  return (store: { getState: () => State }) =>
    (next: (action: string, payload?: unknown) => void) =>
    async (action: string, payload?: unknown) => {
      // Can perform async operations
      await someAsyncOperation();

      next(action, payload);
    };
}
```

### Multiple Middleware

```typescript
const store = createStore({
  state: { count: 0 },
  actions: {
    /* ... */
  },
  middleware: [loggerMiddleware(), asyncMiddleware(), devToolsMiddleware()],
});
```

## Batching Updates

Batching optimiert Performance bei mehreren State-Updates.

```typescript
const store = createStore({
  state: {
    firstName: '',
    lastName: '',
    age: 0,
  },
  actions: {
    setFirstName(state, firstName: string) {
      return { ...state, firstName };
    },
    setLastName(state, lastName: string) {
      return { ...state, lastName };
    },
    setAge(state, age: number) {
      return { ...state, age };
    },
  },
});

// OHNE Batching: 3 separate Updates, 3 Reaktionen
store.dispatch('setFirstName', 'John');
store.dispatch('setLastName', 'Doe');
store.dispatch('setAge', 30);

// MIT Batching: 3 Updates, 1 Reaktion
store.batch(() => {
  store.dispatch('setFirstName', 'John');
  store.dispatch('setLastName', 'Doe');
  store.dispatch('setAge', 30);
});
```

### Batching mit komplexen Updates

```typescript
function importUsers(users: User[]) {
  userStore.batch(() => {
    // Erst State clearen
    userStore.dispatch('clearUsers');

    // Dann alle User hinzufügen
    users.forEach(user => {
      userStore.dispatch('addUser', user);
    });

    // Loading State updaten
    userStore.dispatch('setLoading', false);
  });

  // Nur EINE Reaktion für alle diese Änderungen
}
```

## Best Practices

### 1. State Immutability

```typescript
// ✅ RICHTIG: Neues Objekt erstellen
actions: {
  updateUser(state, user: User) {
    return {
      ...state,
      users: state.users.map(u =>
        u.id === user.id ? { ...u, ...user } : u
      ),
    };
  },
}

// ❌ FALSCH: State mutieren
actions: {
  updateUser(state, user: User) {
    const existingUser = state.users.find(u => u.id === user.id);
    existingUser.name = user.name; // MUTATION!
    return state;
  },
}
```

### 2. Typed Actions

```typescript
// ✅ RICHTIG: Actions mit expliziten Typen
interface AppActions {
  setTheme: Action<AppState, Theme>;
  setUser: Action<AppState, User>;
  logout: Action<AppState>; // Keine Payload
}

const store = createStore({
  state: initialState,
  actions: {
    setTheme(state, theme: Theme) {
      return { ...state, theme };
    },
    setUser(state, user: User) {
      return { ...state, user };
    },
    logout(state) {
      return { ...state, user: null };
    },
  } as AppActions,
});

// Type-safe dispatch
store.dispatch('setTheme', 'dark'); // ✅
store.dispatch('setTheme'); // ❌ Error: Missing payload
store.dispatch('logout', 'arg'); // ❌ Error: No payload expected
```

### 3. Action Naming

```typescript
// ✅ RICHTIG: Imperative Namen
actions: {
  addTodo(state, text: string) { /* ... */ },
  removeTodo(state, id: string) { /* ... */ },
  toggleTodo(state, id: string) { /* ... */ },
  setFilter(state, filter: Filter) { /* ... */ },
}

// ❌ FALSCH: Event Namen
actions: {
  todoAdded(state, text: string) { /* ... */ }, // Klingt wie Event
  filterChanged(state, filter: Filter) { /* ... */ },
}
```

### 4. Kleine Focused Actions

```typescript
// ✅ RICHTIG: Kleine, fokussierte Actions
actions: {
  setLoading(state, isLoading: boolean) {
    return { ...state, isLoading };
  },

  setError(state, error: string | null) {
    return { ...state, error };
  },

  setData(state, data: Data[]) {
    return { ...state, data };
  },
}

// ❌ FALSCH: Große "do everything" Action
actions: {
  updateEverything(state, payload: {
    loading?: boolean;
    error?: string;
    data?: Data[];
  }) {
    return { ...state, ...payload };
  },
}
```

### 5. Effects für Async, Actions für Sync

```typescript
// ✅ RICHTIG
effects: {
  async loadUsers(ctx) {
    ctx.dispatch('setLoading', true);
    const users = await fetchUsers();
    ctx.dispatch('setUsers', users);
  },
}

actions: {
  setLoading(state, isLoading: boolean) {
    return { ...state, isLoading };
  },
  setUsers(state, users: User[]) {
    return { ...state, users };
  },
}

// ❌ FALSCH: Async in Action
actions: {
  async loadUsers(state) { // Actions sollten NICHT async sein
    const users = await fetchUsers();
    return { ...state, users };
  },
}
```

## Real-World Examples

### Shopping Cart Store

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

const cartStore = createStore({
  state: {
    items: [],
    isLoading: false,
    error: null,
  } as CartState,

  actions: {
    addItem(state, product: Product) {
      const existing = state.items.find(item => item.product.id === product.id);

      if (existing) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { product, quantity: 1 }],
      };
    },

    removeItem(state, productId: string) {
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== productId),
      };
    },

    updateQuantity(state, payload: { productId: string; quantity: number }) {
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === payload.productId ? { ...item, quantity: payload.quantity } : item
        ),
      };
    },

    clearCart(state) {
      return { ...state, items: [] };
    },

    setLoading(state, isLoading: boolean) {
      return { ...state, isLoading };
    },

    setError(state, error: string | null) {
      return { ...state, error };
    },
  },

  getters: {
    itemCount(state) {
      return state.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    subtotal(state) {
      return state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    },

    tax(state) {
      const subtotal = state.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      return subtotal * 0.2; // 20% tax
    },

    total(state) {
      const subtotal = state.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      return subtotal * 1.2; // + 20% tax
    },
  },

  effects: {
    async checkout(ctx) {
      const { items } = ctx.getState();

      if (items.length === 0) {
        ctx.dispatch('setError', 'Cart is empty');
        return;
      }

      ctx.dispatch('setLoading', true);
      ctx.dispatch('setError', null);

      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        });

        if (!response.ok) throw new Error('Checkout failed');

        ctx.dispatch('clearCart');
        ctx.dispatch('setLoading', false);
      } catch (error) {
        ctx.dispatch('setError', (error as Error).message);
        ctx.dispatch('setLoading', false);
      }
    },
  },
});

// Component
function ShoppingCart() {
  const items = cartStore.select(state => state.items);
  const itemCount = cartStore.select(state => cartStore.getters.itemCount(state));
  const total = cartStore.select(state => cartStore.getters.total(state));
  const isLoading = cartStore.select(state => state.isLoading);

  return createElement('div', { class: 'cart' }, [
    createElement('h2', {}, `Cart (${itemCount()} items)`),

    createElement(
      'ul',
      {},
      items().map(item =>
        createElement('li', { key: item.product.id }, [
          createElement('span', {}, item.product.name),
          createElement('span', {}, ` x${item.quantity}`),
          createElement(
            'button',
            {
              onclick: () => cartStore.dispatch('removeItem', item.product.id),
            },
            'Remove'
          ),
        ])
      )
    ),

    createElement('p', {}, `Total: $${total().toFixed(2)}`),

    createElement(
      'button',
      {
        onclick: () => cartStore.effects.checkout(),
        disabled: isLoading() || itemCount() === 0,
      },
      isLoading() ? 'Processing...' : 'Checkout'
    ),
  ]);
}
```

### User Authentication Store

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const authStore = createStore({
  state: {
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
  } as AuthState,

  actions: {
    setUser(state, user: User | null) {
      return { ...state, user };
    },

    setToken(state, token: string | null) {
      return { ...state, token };
    },

    setLoading(state, isLoading: boolean) {
      return { ...state, isLoading };
    },

    setError(state, error: string | null) {
      return { ...state, error };
    },
  },

  getters: {
    isAuthenticated(state) {
      return state.user !== null && state.token !== null;
    },

    isAdmin(state) {
      return state.user?.role === 'admin';
    },
  },

  effects: {
    async login(ctx, credentials: { email: string; password: string }) {
      ctx.dispatch('setLoading', true);
      ctx.dispatch('setError', null);

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          throw new Error('Invalid credentials');
        }

        const { user, token } = await response.json();

        localStorage.setItem('token', token);

        ctx.dispatch('setUser', user);
        ctx.dispatch('setToken', token);
        ctx.dispatch('setLoading', false);
      } catch (error) {
        ctx.dispatch('setError', (error as Error).message);
        ctx.dispatch('setLoading', false);
      }
    },

    logout(ctx) {
      localStorage.removeItem('token');
      ctx.dispatch('setUser', null);
      ctx.dispatch('setToken', null);
    },

    async loadUser(ctx) {
      const { token } = ctx.getState();

      if (!token) return;

      ctx.dispatch('setLoading', true);

      try {
        const response = await fetch('/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Session expired');
        }

        const user = await response.json();
        ctx.dispatch('setUser', user);
        ctx.dispatch('setLoading', false);
      } catch (error) {
        ctx.dispatch('setError', (error as Error).message);
        ctx.dispatch('setLoading', false);
        ctx.dispatch('logout');
      }
    },
  },
});

// App Component
function App() {
  const isAuthenticated = authStore.select(state => authStore.getters.isAuthenticated(state));

  // Load user on mount
  effect(() => {
    authStore.effects.loadUser();
  });

  return createElement('div', {}, [
    isAuthenticated() ? createElement(Dashboard, {}) : createElement(LoginPage, {}),
  ]);
}
```

---

## Siehe auch

- [Store API Reference](/docs/api/store.md)
- [Core Primitives](/docs/guide/core.md)
- [Context API](/docs/guide/context.md)
- [Quick Start](/docs/guide/quick-start.md)
