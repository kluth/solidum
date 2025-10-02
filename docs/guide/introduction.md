# What is Solidum?

Solidum is a fine-grained reactive JavaScript framework for building user interfaces. It combines the simplicity of reactive primitives with the power of a complete component system.

## Key Features

### ⚡ Fine-Grained Reactivity

Unlike React or Vue, Solidum uses fine-grained reactivity. This means only the specific parts of your UI that depend on changed data get updated - no virtual DOM diffing required.

```typescript
const count = atom(0)
const doubled = computed(() => count() * 2)

effect(() => {
  console.log(doubled()) // Only runs when count changes
})

count(5) // Console: 10
```

### 🎯 Four Core Primitives

Everything in Solidum builds on four simple primitives:

- **`atom()`** - Mutable reactive state
- **`computed()`** - Derived state that automatically updates
- **`effect()`** - Side effects that run when dependencies change
- **`batch()`** - Batch multiple updates into one notification

That's it! Master these four concepts and you understand Solidum.

### 🏗️ Complete Framework

While the core is simple, Solidum provides everything you need:

- **Context API** - Dependency injection without prop drilling
- **Store Pattern** - Centralized state management (like NgRx/Redux)
- **Component Utilities** - Helpers for building UI libraries
- **Testing Tools** - Lightweight DOM testing without Playwright bloat

### 📦 Tiny Bundle Size

Solidum is lightweight and tree-shakeable:

- Core: ~5KB gzipped
- Full framework: ~15KB gzipped
- Import only what you need

### 🔒 Type-Safe

Written in TypeScript with strict mode enabled. Full type inference, autocomplete, and compile-time safety.

```typescript
const user = atom<User | null>(null)
const name = computed(() => user()?.name ?? 'Guest')
//    ^? Computed<string>
```

## Comparison

### vs React

- **Reactivity**: Fine-grained (better performance) vs Virtual DOM
- **Bundle Size**: Smaller (~15KB vs ~45KB)
- **Learning Curve**: Simpler primitives vs hooks + lifecycle
- **State Management**: Built-in store vs external libraries

### vs SolidJS

- **Philosophy**: Similar fine-grained reactivity
- **API**: Function-based atoms vs signals
- **Focus**: General-purpose vs web-specific
- **JSX**: Optional vs required

### vs Vue

- **Reactivity**: Similar reactive system
- **API**: Explicit primitives vs Composition API
- **Bundle Size**: Smaller
- **Ecosystem**: Newer vs mature

## When to Use Solidum

✅ **Good fit for:**
- Performance-critical applications
- Real-time dashboards
- Interactive data visualizations
- Component libraries
- Teams that value simplicity

❌ **Maybe not ideal for:**
- Large teams heavily invested in React/Vue
- Projects requiring mature ecosystem
- SSR-heavy applications (for now)

## Philosophy

Solidum follows these principles:

1. **Simplicity First** - Few concepts, easy to learn
2. **Performance by Default** - Fine-grained updates, no overhead
3. **Explicit over Implicit** - Clear data flow, no magic
4. **Composability** - Small primitives that compose well
5. **Type Safety** - Full TypeScript support

## Next Steps

Ready to dive in?

- [Quick Start](/guide/quick-start) - Get up and running in 5 minutes
- [Installation](/guide/installation) - Setup Solidum in your project
- [Reactivity](/guide/reactivity) - Learn the reactive primitives
- [Examples](/examples/counter) - See Solidum in action
