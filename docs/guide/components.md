# Components

Components in Solidum are simple functions that return VNodes (virtual nodes).

## Creating Components

A component is just a function:

```typescript
function Greeting({ name }: { name: string }) {
  return createElement('h1', null, `Hello, ${name}!`);
}

// Use it
createElement(Greeting, { name: 'World' });
```

## Props

Components receive props as their first argument:

```typescript
interface CardProps {
  title: string;
  content: string;
}

function Card({ title, content }: CardProps) {
  return createElement(
    'div',
    { className: 'card' },
    createElement('h2', null, title),
    createElement('p', null, content)
  );
}
```

## Children

Children are passed via props:

```typescript
function Container({ children }: { children?: any }) {
  return createElement('div', { className: 'container' }, children);
}

// Usage
createElement(
  Container,
  null,
  createElement('p', null, 'Child 1'),
  createElement('p', null, 'Child 2')
);
```

## Reactive Components

Use atoms for local state:

```typescript
function Counter() {
  const count = atom(0);

  return createElement(
    'div',
    null,
    createElement('h1', null, `Count: ${count()}`),
    createElement(
      'button',
      {
        onClick: () => count(count() + 1),
      },
      'Increment'
    )
  );
}
```

## Lifecycle

Use `onMount` and `onCleanup` for lifecycle management:

```typescript
import { onMount, onCleanup } from '@sldm/core';

function Timer() {
  const seconds = atom(0);

  onMount(() => {
    const interval = setInterval(() => {
      seconds(seconds() + 1);
    }, 1000);

    onCleanup(() => {
      clearInterval(interval);
    });
  });

  return createElement('div', null, `Seconds: ${seconds()}`);
}
```

## Learn More

- [API Reference](/api/components)
- [Examples](/examples/counter)
