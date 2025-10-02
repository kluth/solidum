# Reactivity

Solidum's reactivity system is based on four core primitives. Master these and you understand the entire framework.

## Atom - Mutable State

`atom()` creates a reactive piece of mutable state.

### Basic Usage

```typescript
import { atom } from '@solidum/core'

// Create an atom
const count = atom(0)

// Read value
console.log(count()) // 0

// Write value
count(5)
console.log(count()) // 5

// Update based on previous value
count(prev => prev + 1)
console.log(count()) // 6
```

### Subscribing to Changes

```typescript
const count = atom(0)

// Subscribe to changes
const unsubscribe = count.subscribe((newValue) => {
  console.log('Count changed:', newValue)
})

count(5) // Console: "Count changed: 5"
count(10) // Console: "Count changed: 10"

// Unsubscribe when done
unsubscribe()
```

### Working with Objects

```typescript
interface User {
  name: string
  age: number
}

const user = atom<User>({
  name: 'Alice',
  age: 30
})

// Update entire object
user({ name: 'Bob', age: 25 })

// Update based on previous value
user(prev => ({ ...prev, age: prev.age + 1 }))
```

### Working with Arrays

```typescript
const todos = atom<string[]>([])

// Add item
todos(prev => [...prev, 'New task'])

// Remove item
todos(prev => prev.filter((_, i) => i !== 0))

// Update item
todos(prev => prev.map((todo, i) =>
  i === 0 ? 'Updated task' : todo
))
```

## Computed - Derived State

`computed()` creates reactive derived state that automatically updates when dependencies change.

### Basic Usage

```typescript
import { atom, computed } from '@solidum/core'

const firstName = atom('John')
const lastName = atom('Doe')

const fullName = computed(() => {
  return `${firstName()} ${lastName()}`
})

console.log(fullName()) // "John Doe"

firstName('Jane')
console.log(fullName()) // "Jane Doe"
```

### Automatic Dependency Tracking

Computed values automatically track which atoms they depend on:

```typescript
const a = atom(2)
const b = atom(3)
const c = atom(4)

const result = computed(() => {
  return (a() * b()) + c()
})

console.log(result()) // 10

a(5)
console.log(result()) // 19 (automatically recalculated)
```

### Chaining Computeds

You can create computeds that depend on other computeds:

```typescript
const base = atom(2)
const doubled = computed(() => base() * 2)
const quadrupled = computed(() => doubled() * 2)
const octupled = computed(() => quadrupled() * 2)

console.log(octupled()) // 16

base(5)
console.log(octupled()) // 40
```

### Conditional Dependencies

Computeds only track dependencies that are actually accessed:

```typescript
const useA = atom(true)
const a = atom(10)
const b = atom(20)

const result = computed(() => {
  return useA() ? a() : b()
})

console.log(result()) // 10

// Changing a affects result
a(15)
console.log(result()) // 15

// Switch to b
useA(false)
console.log(result()) // 20

// Now changing a doesn't affect result
a(100)
console.log(result()) // 20 (still uses b)
```

### Lazy Evaluation

Computeds are lazy - they only recalculate when accessed:

```typescript
const count = atom(0)
let computeCount = 0

const doubled = computed(() => {
  computeCount++
  return count() * 2
})

console.log(computeCount) // 0 (not computed yet)

console.log(doubled()) // Access triggers computation
console.log(computeCount) // 1

count(5) // Change dependency
console.log(computeCount) // Still 1 (not recomputed yet)

console.log(doubled()) // Access triggers recomputation
console.log(computeCount) // 2
```

## Effect - Side Effects

`effect()` runs side effects when dependencies change.

### Basic Usage

```typescript
import { atom, effect } from '@solidum/core'

const count = atom(0)

// Effect runs immediately and on every change
effect(() => {
  console.log('Count is:', count())
})
// Console: "Count is: 0"

count(5)
// Console: "Count is: 5"
```

### Cleanup

Effects can return a cleanup function:

```typescript
const url = atom('/api/users')

effect(() => {
  const controller = new AbortController()

  fetch(url(), { signal: controller.signal })
    .then(res => res.json())
    .then(data => console.log(data))

  // Cleanup function
  return () => {
    controller.abort()
  }
})
```

### Multiple Dependencies

Effects automatically track all accessed atoms:

```typescript
const firstName = atom('John')
const lastName = atom('Doe')
const age = atom(30)

effect(() => {
  console.log(`${firstName()} ${lastName()}, age ${age()}`)
})
```

### Unsubscribing

```typescript
const count = atom(0)

const dispose = effect(() => {
  console.log(count())
})

// Later...
dispose() // Stop the effect
```

### Common Patterns

**Update document title:**
```typescript
const count = atom(0)

effect(() => {
  document.title = `Count: ${count()}`
})
```

**Save to localStorage:**
```typescript
const user = atom({ name: 'Alice', age: 30 })

effect(() => {
  localStorage.setItem('user', JSON.stringify(user()))
})
```

**Sync with API:**
```typescript
const settings = atom({})

effect(() => {
  const currentSettings = settings()
  fetch('/api/settings', {
    method: 'POST',
    body: JSON.stringify(currentSettings)
  })
})
```

## Batch - Optimize Updates

`batch()` groups multiple updates into one notification.

### Problem

Without batching, multiple updates trigger multiple notifications:

```typescript
const firstName = atom('John')
const lastName = atom('Doe')

let runs = 0
effect(() => {
  firstName()
  lastName()
  runs++
})

console.log(runs) // 1 (initial run)

firstName('Jane')
lastName('Smith')
console.log(runs) // 3 (two additional runs)
```

### Solution

Use `batch()` to combine updates:

```typescript
import { atom, effect, batch } from '@solidum/core'

const firstName = atom('John')
const lastName = atom('Doe')

let runs = 0
effect(() => {
  firstName()
  lastName()
  runs++
})

console.log(runs) // 1

batch(() => {
  firstName('Jane')
  lastName('Smith')
})

console.log(runs) // 2 (only one additional run)
```

### Automatic Batching

Event handlers automatically batch updates:

```typescript
function handleClick() {
  // These are automatically batched
  count(count() + 1)
  name('Updated')
  status('active')
}
```

### Nested Batches

Batches can be nested:

```typescript
batch(() => {
  a(1)
  batch(() => {
    b(2)
    c(3)
  })
  d(4)
})
// All four updates batched together
```

## Best Practices

### 1. Keep Computeds Pure

```typescript
// ✅ Good - pure function
const doubled = computed(() => count() * 2)

// ❌ Bad - side effects
const doubled = computed(() => {
  console.log('Computing...')  // Side effect!
  return count() * 2
})
```

### 2. Use Effects for Side Effects

```typescript
// ✅ Good - side effect in effect
effect(() => {
  console.log('Count:', count())
})

// ❌ Bad - side effect in computed
const logged = computed(() => {
  console.log('Count:', count())
  return count()
})
```

### 3. Avoid Infinite Loops

```typescript
// ❌ Bad - infinite loop
const count = atom(0)
effect(() => {
  count(count() + 1) // Will run forever!
})

// ✅ Good - conditional update
effect(() => {
  if (count() < 10) {
    count(count() + 1)
  }
})
```

### 4. Batch Related Updates

```typescript
// ✅ Good - batched
batch(() => {
  firstName('Jane')
  lastName('Smith')
  age(25)
})

// ❌ Okay but less efficient
firstName('Jane')
lastName('Smith')
age(25)
```

### 5. Clean Up Effects

```typescript
// ✅ Good - cleanup
effect(() => {
  const interval = setInterval(() => {
    count(count() + 1)
  }, 1000)

  return () => clearInterval(interval)
})

// ❌ Bad - memory leak
effect(() => {
  setInterval(() => {
    count(count() + 1)
  }, 1000)
  // No cleanup!
})
```

## Performance Tips

### Memoization

Computeds automatically memoize results:

```typescript
const expensive = computed(() => {
  // This only runs when dependencies change
  return heavyCalculation(data())
})

// Multiple accesses use cached value
console.log(expensive())
console.log(expensive()) // Uses cache
console.log(expensive()) // Uses cache
```

### Selective Dependencies

Only access what you need:

```typescript
const user = atom({ name: 'Alice', age: 30, email: 'alice@example.com' })

// ✅ Good - only depends on name
const greeting = computed(() => `Hello, ${user().name}`)

// ❌ Bad - depends on entire object
const greeting = computed(() => {
  const u = user()  // Accesses whole object
  return `Hello, ${u.name}`
})
```

### Avoid Deep Reactivity

For better performance, update immutably:

```typescript
// ✅ Good - immutable update
user(prev => ({ ...prev, age: prev.age + 1 }))

// ❌ Bad - mutation (not reactive)
const u = user()
u.age++
user(u)
```

## Next Steps

- Learn about [Components](/guide/components)
- Explore the [Context API](/guide/context)
- Master the [Store Pattern](/guide/store)
- See [Examples](/examples/counter)
