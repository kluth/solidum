# Components API

## createElement()

Creates a virtual node (VNode).

### Signature

```typescript
function createElement(
  type: string | ComponentFunction,
  props?: Record<string, any> | null,
  ...children: any[]
): VNode;
```

## mount()

Mounts a component to a DOM element.

### Signature

```typescript
function mount(container: Element, component: () => VNode, document?: Document): () => void;
```

## onMount()

Lifecycle hook called when component mounts.

### Signature

```typescript
function onMount(fn: () => void): void;
```

## onCleanup()

Register cleanup function.

### Signature

```typescript
function onCleanup(fn: () => void): void;
```
