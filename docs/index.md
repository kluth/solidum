---
layout: home

hero:
  name: Solidum
  text: Fine-Grained Reactive Framework
  tagline: Build blazing-fast user interfaces with reactive primitives
  image:
    src: /logo.svg
    alt: Solidum
  actions:
    - theme: brand
      text: Get Started
      link: /guide/quick-start
    - theme: alt
      text: View on GitHub
      link: https://github.com/yourusername/Solidum

features:
  - icon: ⚡
    title: Fine-Grained Reactivity
    details: Efficient updates with atom, computed, and effect primitives. Only what changes gets updated.

  - icon: 🎯
    title: Smart Batching
    details: Automatic update batching for optimal performance. Multiple updates trigger only one re-render.

  - icon: 🔌
    title: Context API
    details: Dependency injection without prop drilling. Pass data through component trees elegantly.

  - icon: 🏪
    title: Store Pattern
    details: Centralized state management with actions, getters, and effects. Like NgRx but simpler.

  - icon: 🛠️
    title: Component Utilities
    details: Helper functions for building component libraries. mergeProps, cn, and more.

  - icon: 📦
    title: Tiny Bundle Size
    details: Lightweight and tree-shakeable. Import only what you need.

  - icon: 🔒
    title: Type-Safe
    details: Written in TypeScript with strict mode. Full type inference and autocomplete.

  - icon: 🧪
    title: Easy Testing
    details: Built-in testing utilities without the Playwright bloat. Fast and reliable.

  - icon: 🎨
    title: Extensible
    details: Easy to build libraries like Material UI, state management solutions, and form libraries.
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.VPFeature {
  padding: 24px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.VPFeature:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.VPFeature .icon {
  font-size: 32px;
  margin-bottom: 12px;
}
</style>

## Quick Example

```typescript
import { atom, computed, effect, createElement, mount } from '@solidum/core'

// Create reactive state
const count = atom(0)
const doubled = computed(() => count() * 2)

// React to changes
effect(() => {
  console.log(`Count: ${count()}, Doubled: ${doubled()}`)
})

// Build UI
function Counter() {
  return createElement('div', null,
    createElement('h1', null, `Count: ${count()}`),
    createElement('button', {
      onClick: () => count(count() + 1)
    }, 'Increment')
  )
}

// Mount to DOM
mount(document.getElementById('app'), () => createElement(Counter))
```

## Why Solidum?

<div class="why-solidum">
  <div class="reason">
    <h3>🚀 Blazing Fast</h3>
    <p>Fine-grained reactivity means only what changes gets updated. No virtual DOM diffing overhead.</p>
  </div>

  <div class="reason">
    <h3>🎯 Simple API</h3>
    <p>Four core primitives: atom, computed, effect, and batch. That's all you need to master.</p>
  </div>

  <div class="reason">
    <h3>🔋 Batteries Included</h3>
    <p>Context API, Store pattern, component utilities, and testing tools out of the box.</p>
  </div>

  <div class="reason">
    <h3>📚 Great DX</h3>
    <p>Full TypeScript support, comprehensive docs, and helpful error messages.</p>
  </div>
</div>

<style>
.why-solidum {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin: 48px 0;
}

.reason {
  padding: 24px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.reason h3 {
  margin-top: 0;
  color: var(--vp-c-brand-1);
}

.reason p {
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
</style>

## Ready to Get Started?

Check out the [Quick Start Guide](/guide/quick-start) to begin building with Solidum, or explore our [Examples](/examples/counter) to see it in action.
