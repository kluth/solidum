# Store API Reference

Vollständige API-Dokumentation für @sldm/store.

## Table of Contents

- [createStore()](#createstore)
- [Store Interface](#store-interface)
- [Types](#types)
  - [StoreConfig](#storeconfig)
  - [Action](#action)
  - [Middleware](#middleware)
  - [EffectContext](#effectcontext)
- [Best Practices](#best-practices)

## createStore()

Erstellt einen zentralisierten Store für State Management.

**Signature:**

```typescript
function createStore<State, Actions = {}, Getters = {}, Effects = {}>(
  config: StoreConfig<State, Actions, Getters, Effects>
): Store<State, Actions, Getters, Effects>;
```

**Parameters:**

- `config` - Store-Konfiguration (siehe [StoreConfig](#storeconfig))

**Returns:** `Store<State, Actions, Getters, Effects>` - Store-Instanz

**Example:**

```typescript
import { createStore } from '@sldm/store';

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

const todoStore = createStore({
  state: {
    todos: [],
    filter: 'all',
  } as TodoState,

  actions: {
    addTodo(state, text: string) {
      return {
        ...state,
        todos: [...state.todos, { id: Date.now().toString(), text, completed: false }],
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

    setFilter(state, filter: 'all' | 'active' | 'completed') {
      return { ...state, filter };
    },
  },

  getters: {
    filteredTodos(state) {
      if (state.filter === 'active') {
        return state.todos.filter(t => !t.completed);
      }
      if (state.filter === 'completed') {
        return state.todos.filter(t => t.completed);
      }
      return state.todos;
    },

    activeTodoCount(state) {
      return state.todos.filter(t => !t.completed).length;
    },
  },
});
```

---

## Store Interface

Die Store-Instanz bietet folgende Methods und Properties:

```typescript
interface Store<State, Actions, Getters, Effects> {
  getState: () => State;
  select: <Result>(selector: (state: State) => Result) => Computed<Result>;
  dispatch: <K extends keyof Actions>(
    action: K,
    ...args: /* payload */
  ) => void;
  batch: (fn: () => void) => void;
  getters: Getters;
  effects: Effects;
}
```

---

### getState()

Gibt den aktuellen State zurück (nicht reaktiv).

**Signature:**

```typescript
getState(): State
```

**Returns:** `State` - Aktueller State

**Example:**

```typescript
const currentState = store.getState();
console.log(currentState.todos);
```

**Note:** `getState()` ist **nicht reaktiv**. Für reaktive Subscriptions verwende `select()`.

---

### select()

Erstellt eine reaktive Subscription zu einem State-Slice.

**Signature:**

```typescript
select<Result>(selector: (state: State) => Result): Computed<Result>
```

**Parameters:**

- `selector` - Funktion die einen Teil des States auswählt

**Returns:** `Computed<Result>` - Reaktiver Computed Value

**Example:**

```typescript
import { effect } from '@sldm/core';

// Select state slice
const todos = store.select(state => state.todos);
const filter = store.select(state => state.filter);

// React to changes
effect(() => {
  console.log('Todos changed:', todos());
  console.log('Filter:', filter());
});

// Computed from getter
const filteredTodos = store.select(state => store.getters.filteredTodos(state));
```

---

### dispatch()

Dispatched eine Action um State zu ändern.

**Signature:**

```typescript
dispatch<K extends keyof Actions>(
  action: K,
  ...args: /* inferred from Action type */
): void
```

**Parameters:**

- `action` - Name der Action
- `...args` - Payload (falls Action Parameter erwartet)

**Example:**

```typescript
// Action ohne Payload
store.dispatch('increment');

// Action mit Payload
store.dispatch('addTodo', 'Buy milk');
store.dispatch('setFilter', 'active');

// Type-safe dispatch
store.dispatch('addTodo', 'Text'); // ✅
store.dispatch('addTodo'); // ❌ Error: Missing payload
store.dispatch('unknownAction', 'x'); // ❌ Error: Unknown action
```

---

### batch()

Batched mehrere Dispatches zu einem Update.

**Signature:**

```typescript
batch(fn: () => void): void
```

**Parameters:**

- `fn` - Funktion die mehrere Dispatches enthält

**Example:**

```typescript
// OHNE Batching: 3 Updates, 3 Re-Renders
store.dispatch('setFirstName', 'John');
store.dispatch('setLastName', 'Doe');
store.dispatch('setAge', 30);

// MIT Batching: 3 Updates, 1 Re-Render
store.batch(() => {
  store.dispatch('setFirstName', 'John');
  store.dispatch('setLastName', 'Doe');
  store.dispatch('setAge', 30);
});
```

**Performance:**

Batching ist wichtig für Performance wenn:

- Mehrere State-Updates auf einmal passieren
- UI-Updates teuer sind
- Import/Sync-Operationen

---

### getters

Objekt mit allen Getters (berechnete Werte).

**Type:**

```typescript
getters: {
  [K in keyof Getters]: (state: State) => ReturnType<Getters[K]>
}
```

**Example:**

```typescript
const store = createStore({
  state: { count: 0 },
  getters: {
    doubled(state) {
      return state.count * 2;
    },
    isEven(state) {
      return state.count % 2 === 0;
    },
  },
});

// Verwenden
const currentState = store.getState();
const doubled = store.getters.doubled(currentState);
const isEven = store.getters.isEven(currentState);

// Mit select (reaktiv)
const doubled = store.select(state => store.getters.doubled(state));
```

**Note:** Getters sind **nicht gecached**. Sie werden bei jedem Aufruf neu berechnet.

---

### effects

Objekt mit allen Effects (Side Effects).

**Type:**

```typescript
effects: {
  [K in keyof Effects]: (...args: any[]) => ReturnType<Effects[K]>
}
```

**Example:**

```typescript
const store = createStore({
  state: { users: [] },
  actions: {
    setUsers(state, users: User[]) {
      return { ...state, users };
    },
    setLoading(state, isLoading: boolean) {
      return { ...state, isLoading };
    },
  },
  effects: {
    async loadUsers(ctx) {
      ctx.dispatch('setLoading', true);

      try {
        const users = await fetchUsers();
        ctx.dispatch('setUsers', users);
      } finally {
        ctx.dispatch('setLoading', false);
      }
    },

    async deleteUser(ctx, userId: string) {
      await deleteUserAPI(userId);
      const users = ctx.getState().users.filter(u => u.id !== userId);
      ctx.dispatch('setUsers', users);
    },
  },
});

// Effects aufrufen
store.effects.loadUsers();
store.effects.deleteUser('user-123');
```

---

## Types

### StoreConfig

Konfigurations-Objekt für `createStore()`.

**Interface:**

```typescript
interface StoreConfig<State, Actions, Getters, Effects> {
  state: State; // Initial State
  actions?: Actions; // Action-Funktionen
  getters?: Getters; // Getter-Funktionen
  effects?: Effects; // Effect-Funktionen
  middleware?: Middleware<State> | Middleware<State>[]; // Middleware
}
```

**Properties:**

#### state

Der initiale State des Stores.

```typescript
state: State;
```

**Example:**

```typescript
const store = createStore({
  state: {
    count: 0,
    user: null,
    isLoading: false,
  },
  // ...
});
```

---

#### actions

Objekt mit Action-Funktionen zum Ändern des States.

```typescript
actions?: {
  [actionName: string]: Action<State, Payload?>;
}
```

**Example:**

```typescript
actions: {
  // Ohne Payload
  increment(state) {
    return { ...state, count: state.count + 1 };
  },

  // Mit Payload
  setUser(state, user: User) {
    return { ...state, user };
  },

  // Komplexe Action
  addTodo(state, text: string) {
    return {
      ...state,
      todos: [
        ...state.todos,
        { id: generateId(), text, completed: false },
      ],
    };
  },
}
```

---

#### getters

Objekt mit Getter-Funktionen für berechnete Werte.

```typescript
getters?: {
  [getterName: string]: (state: State) => any;
}
```

**Example:**

```typescript
getters: {
  totalCount(state) {
    return state.todos.length;
  },

  completedTodos(state) {
    return state.todos.filter(t => t.completed);
  },

  stats(state) {
    const total = state.todos.length;
    const completed = state.todos.filter(t => t.completed).length;
    return { total, completed, active: total - completed };
  },
}
```

---

#### effects

Objekt mit Effect-Funktionen für Side Effects.

```typescript
effects?: {
  [effectName: string]: (ctx: EffectContext<State>, ...args: any[]) => any;
}
```

**Example:**

```typescript
effects: {
  async loadData(ctx) {
    ctx.dispatch('setLoading', true);
    const data = await fetchData();
    ctx.dispatch('setData', data);
    ctx.dispatch('setLoading', false);
  },

  async saveChanges(ctx) {
    const state = ctx.getState();
    await saveToAPI(state.data);
  },
}
```

---

#### middleware

Middleware-Funktion(en) zur Erweiterung der Dispatch-Logik.

```typescript
middleware?: Middleware<State> | Middleware<State>[]
```

**Example:**

```typescript
function loggerMiddleware<State>(): Middleware<State> {
  return store => next => (action, payload) => {
    console.log('Before:', action, store.getState());
    next(action, payload);
    console.log('After:', action, store.getState());
  };
}

const store = createStore({
  state: { count: 0 },
  actions: { increment: s => ({ ...s, count: s.count + 1 }) },
  middleware: loggerMiddleware(),
});
```

---

### Action

Type für Action-Funktionen.

**Type:**

```typescript
type Action<State, Payload = void> = Payload extends void
  ? (state: State) => State
  : (state: State, payload: Payload) => State;
```

**Example:**

```typescript
// Action ohne Payload
const increment: Action<AppState> = state => {
  return { ...state, count: state.count + 1 };
};

// Action mit Payload
const setName: Action<AppState, string> = (state, name) => {
  return { ...state, name };
};

// Action mit komplexem Payload
const updateUser: Action<AppState, Partial<User>> = (state, updates) => {
  return {
    ...state,
    user: { ...state.user, ...updates },
  };
};
```

**Rules:**

- ✅ Must be pure functions
- ✅ Must return new state object
- ❌ No side effects
- ❌ No mutations
- ❌ No async operations (use Effects instead)

---

### Middleware

Type für Middleware-Funktionen.

**Type:**

```typescript
type Middleware<State> = (store: {
  getState: () => State;
}) => (
  next: (action: string, payload?: unknown) => void
) => (action: string, payload?: unknown) => void;
```

**Example:**

```typescript
function timingMiddleware<State>(): Middleware<State> {
  return store => next => (action, payload) => {
    const start = performance.now();
    next(action, payload);
    const duration = performance.now() - start;
    console.log(`${action} took ${duration.toFixed(2)}ms`);
  };
}

function crashReporterMiddleware<State>(): Middleware<State> {
  return store => next => (action, payload) => {
    try {
      next(action, payload);
    } catch (error) {
      console.error('Action crashed:', action, error);
      reportError(error);
      throw error;
    }
  };
}
```

**Middleware Chain:**

```typescript
const store = createStore({
  state: { count: 0 },
  actions: {
    /* ... */
  },
  middleware: [loggerMiddleware(), timingMiddleware(), crashReporterMiddleware()],
});

// Execution order:
// 1. loggerMiddleware (before)
// 2. timingMiddleware (before)
// 3. crashReporterMiddleware (before)
// 4. Actual action execution
// 5. crashReporterMiddleware (after)
// 6. timingMiddleware (after)
// 7. loggerMiddleware (after)
```

---

### EffectContext

Context-Objekt das an Effects übergeben wird.

**Interface:**

```typescript
interface EffectContext<State> {
  dispatch: <K extends string>(action: K, ...args: unknown[]) => void;
  getState: () => State;
}
```

**Properties:**

#### dispatch

Dispatched eine Action.

```typescript
dispatch<K extends string>(action: K, ...args: unknown[]): void
```

**Example:**

```typescript
effects: {
  async loadUser(ctx, userId: string) {
    ctx.dispatch('setLoading', true);

    try {
      const user = await fetchUser(userId);
      ctx.dispatch('setUser', user);
    } catch (error) {
      ctx.dispatch('setError', error.message);
    } finally {
      ctx.dispatch('setLoading', false);
    }
  },
}
```

---

#### getState

Gibt aktuellen State zurück.

```typescript
getState(): State
```

**Example:**

```typescript
effects: {
  async updateIfNeeded(ctx) {
    const state = ctx.getState();

    if (state.needsUpdate) {
      const data = await fetchData();
      ctx.dispatch('setData', data);
    }
  },

  async saveChanges(ctx) {
    const state = ctx.getState();
    await saveToServer(state.data);
  },
}
```

---

## Best Practices

### 1. Type-Safe Actions

```typescript
// ✅ RICHTIG: Explizite Action-Types
interface CounterActions {
  increment: Action<CounterState>;
  decrement: Action<CounterState>;
  add: Action<CounterState, number>;
  set: Action<CounterState, number>;
}

const store = createStore({
  state: { count: 0 },
  actions: {
    increment: state => ({ ...state, count: state.count + 1 }),
    decrement: state => ({ ...state, count: state.count - 1 }),
    add: (state, amount: number) => ({ ...state, count: state.count + amount }),
    set: (state, value: number) => ({ ...state, count: value }),
  } as CounterActions,
});

// Type-safe dispatch
store.dispatch('add', 5); // ✅
store.dispatch('add'); // ❌ Error
store.dispatch('unknown', 1); // ❌ Error
```

---

### 2. Immutable Updates

```typescript
// ✅ RICHTIG: Neue Objekte erstellen
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
    const existing = state.users.find(u => u.id === user.id);
    existing.name = user.name; // MUTATION!
    return state;
  },
}
```

---

### 3. Small Focused Actions

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

// ❌ FALSCH: Eine große "God Action"
actions: {
  updateEverything(state, updates: Partial<State>) {
    return { ...state, ...updates };
  },
}
```

---

### 4. Effects für Async

```typescript
// ✅ RICHTIG: Async in Effects
effects: {
  async loadData(ctx) {
    ctx.dispatch('setLoading', true);
    const data = await fetchData();
    ctx.dispatch('setData', data);
    ctx.dispatch('setLoading', false);
  },
}

// ❌ FALSCH: Async in Actions
actions: {
  async loadData(state) { // Actions sollten NICHT async sein!
    const data = await fetchData();
    return { ...state, data };
  },
}
```

---

### 5. Batching für Performance

```typescript
// ✅ RICHTIG: Batch bei mehreren Updates
function importUsers(users: User[]) {
  store.batch(() => {
    store.dispatch('clearUsers');
    users.forEach(user => store.dispatch('addUser', user));
    store.dispatch('setLoading', false);
  });
}

// ❌ FALSCH: Viele einzelne Dispatches
function importUsers(users: User[]) {
  store.dispatch('clearUsers');
  users.forEach(user => store.dispatch('addUser', user)); // Viele Re-Renders!
  store.dispatch('setLoading', false);
}
```

---

## Siehe auch

- [Store Guide](/docs/guide/store.md)
- [Core Primitives](/docs/guide/core.md)
- [Context API](/docs/guide/context.md)
