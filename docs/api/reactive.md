# Reactive Primitives API

## atom()

Creates a reactive atom - a piece of mutable state.

### Signature

```typescript
function atom<T>(initialValue: T): Atom<T>

interface Atom<T> {
  (): T                                    // Read value
  (value: T | ((prev: T) => T)): void     // Write value
  subscribe(fn: (value: T) => void): () => void
}
```

### Parameters

- `initialValue: T` - The initial value of the atom

### Returns

An `Atom<T>` function that can be called to read or write the value.

### Examples

**Basic usage:**
```typescript
const count = atom(0)

console.log(count()) // 0
count(5)
console.log(count()) // 5
```

**Update function:**
```typescript
count(prev => prev + 1)
```

**With objects:**
```typescript
const user = atom({ name: 'Alice', age: 30 })
user(prev => ({ ...prev, age: prev.age + 1 }))
```

**Subscribe to changes:**
```typescript
const unsubscribe = count.subscribe((newValue) => {
  console.log('Count changed:', newValue)
})

count(10) // Console: "Count changed: 10"
unsubscribe()
```

---

## computed()

Creates a computed value that automatically updates when dependencies change.

### Signature

```typescript
function computed<T>(fn: () => T): Computed<T>

interface Computed<T> {
  (): T
  subscribe(fn: (value: T) => void): () => void
}
```

### Parameters

- `fn: () => T` - Function that computes the value

### Returns

A `Computed<T>` function that returns the computed value.

### Examples

**Basic usage:**
```typescript
const firstName = atom('John')
const lastName = atom('Doe')
const fullName = computed(() => `${firstName()} ${lastName()}`)

console.log(fullName()) // "John Doe"
```

**Chaining:**
```typescript
const base = atom(2)
const doubled = computed(() => base() * 2)
const quadrupled = computed(() => doubled() * 2)
```

**Complex computation:**
```typescript
const items = atom([
  { price: 10, quantity: 2 },
  { price: 20, quantity: 1 }
])

const total = computed(() => {
  return items().reduce((sum, item) => sum + item.price * item.quantity, 0)
})
```

### Notes

- Computeds are lazy - they only recalculate when accessed
- Results are automatically memoized
- Dependencies are tracked automatically

---

## effect()

Runs side effects when dependencies change.

### Signature

```typescript
function effect(fn: () => void | (() => void)): () => void

type Dispose = () => void
```

### Parameters

- `fn: () => void | (() => void)` - Effect function, optionally returns cleanup function

### Returns

A `Dispose` function to stop the effect.

### Examples

**Basic usage:**
```typescript
const count = atom(0)

effect(() => {
  console.log('Count is:', count())
})
```

**With cleanup:**
```typescript
effect(() => {
  const timer = setInterval(() => {
    console.log(count())
  }, 1000)

  return () => clearInterval(timer)
})
```

**Multiple dependencies:**
```typescript
const a = atom(1)
const b = atom(2)

effect(() => {
  console.log(`a: ${a()}, b: ${b()}`)
})
```

**Disposing:**
```typescript
const dispose = effect(() => {
  console.log(count())
})

// Later...
dispose()
```

### Notes

- Effects run immediately on creation
- They re-run when any accessed atom changes
- Cleanup functions run before re-running and on disposal

---

## batch()

Batches multiple updates into a single notification.

### Signature

```typescript
function batch(fn: () => void): void
```

### Parameters

- `fn: () => void` - Function containing multiple updates

### Returns

`void`

### Examples

**Basic usage:**
```typescript
const firstName = atom('John')
const lastName = atom('Doe')

batch(() => {
  firstName('Jane')
  lastName('Smith')
})
```

**With effects:**
```typescript
let runs = 0
effect(() => {
  firstName()
  lastName()
  runs++
})

batch(() => {
  firstName('Jane')
  lastName('Smith')
})

console.log(runs) // 2 (initial + batched update)
```

**Nested batches:**
```typescript
batch(() => {
  a(1)
  batch(() => {
    b(2)
  })
  c(3)
})
```

### Notes

- Event handlers automatically batch updates
- Batches can be nested
- All updates in a batch trigger effects only once

---

## Type Definitions

```typescript
// Subscriber function
type Subscriber<T> = (value: T) => void

// Unsubscribe function
type Unsubscribe = () => void

// Setter function
type Setter<T> = (value: T | ((prev: T) => T)) => void

// Atom interface
interface Atom<T> {
  (): T
  (value: T | ((prev: T) => T)): void
  subscribe(fn: Subscriber<T>): Unsubscribe
}

// Computed interface
interface Computed<T> {
  (): T
  subscribe(fn: Subscriber<T>): Unsubscribe
}

// Effect cleanup function
type Dispose = () => void

// Effect function
type EffectFn = () => void | Dispose
```

---

## Common Patterns

### Derived State

```typescript
const todos = atom([
  { text: 'Task 1', done: false },
  { text: 'Task 2', done: true }
])

const activeTodos = computed(() => todos().filter(t => !t.done))
const completedTodos = computed(() => todos().filter(t => t.done))
const progress = computed(() => {
  const total = todos().length
  const done = completedTodos().length
  return total === 0 ? 0 : (done / total) * 100
})
```

### Async Effects

```typescript
const userId = atom(1)

effect(() => {
  const controller = new AbortController()
  const id = userId()

  fetch(`/api/users/${id}`, { signal: controller.signal })
    .then(res => res.json())
    .then(data => user(data))
    .catch(err => {
      if (err.name !== 'AbortError') {
        console.error(err)
      }
    })

  return () => controller.abort()
})
```

### Conditional Reactivity

```typescript
const enabled = atom(true)
const data = atom(null)

effect(() => {
  if (enabled()) {
    console.log('Data:', data())
  }
})
```

### Debounced Updates

```typescript
const search = atom('')
const debouncedSearch = atom('')

effect(() => {
  const value = search()
  const timeout = setTimeout(() => {
    debouncedSearch(value)
  }, 300)

  return () => clearTimeout(timeout)
})
```

---

## Performance Considerations

### Memoization

Computed values are automatically memoized:

```typescript
const expensive = computed(() => {
  console.log('Computing...')
  return heavyCalculation(data())
})

expensive() // Console: "Computing..."
expensive() // Uses cached value
expensive() // Uses cached value

data(newValue)
expensive() // Console: "Computing..." (recalculates)
```

### Lazy Evaluation

Computeds are lazy - they only run when accessed:

```typescript
const result = computed(() => {
  console.log('Calculating...')
  return a() + b()
})

// No console output yet

console.log(result()) // Now: "Calculating..."
```

### Batching

Batch related updates for better performance:

```typescript
// Multiple notifications
a(1)
b(2)
c(3)

// Single notification
batch(() => {
  a(1)
  b(2)
  c(3)
})
```
