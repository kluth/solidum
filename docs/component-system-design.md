# Component System Design

## Overview
Solidum's component system builds on top of the reactive primitives to create a declarative, reactive UI framework.

## Core Concepts

### 1. Component Function
```typescript
type Component<P = {}> = (props: P) => JSX.Element | null;
```

Components are pure functions that:
- Accept props as input
- Return a virtual DOM structure
- Use reactive primitives for state management
- Run inside a reactive context

### 2. JSX/Virtual DOM
```typescript
interface VNode {
  type: string | Component;
  props: Record<string, any>;
  children: VNode[];
}
```

Virtual nodes represent:
- HTML elements (string type)
- Component instances (function type)
- Text nodes (special case)

### 3. Reactive Rendering
- Components are rendered inside `effect()` scopes
- When reactive dependencies change, only affected components re-render
- Fine-grained reactivity: changes propagate to specific DOM nodes

### 4. Lifecycle
```typescript
- onMount(() => void) - runs after component mounts to DOM
- onCleanup(() => void) - runs before component unmounts
```

## API Design

### Creating Elements
```typescript
// JSX (via babel/typescript transform)
<div class="container">
  <h1>Hello {name()}</h1>
</div>

// Or createElement() function
createElement('div', { class: 'container' },
  createElement('h1', null, 'Hello ', name())
);
```

### Mounting Components
```typescript
mount(document.getElementById('app'), () => <App />);
```

### Component Example
```typescript
function Counter() {
  const count = atom(0);

  onMount(() => {
    console.log('Counter mounted');
  });

  return (
    <div>
      <p>Count: {count()}</p>
      <button onClick={() => count(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}
```

## Implementation Plan

### Phase 1: Virtual DOM & JSX
1. `createElement()` - create virtual nodes
2. JSX pragma configuration
3. Fragment support

### Phase 2: Rendering
1. `render()` - convert VNode to real DOM
2. Reactive text interpolation
3. Event handler binding

### Phase 3: Components
1. `component()` - component lifecycle wrapper
2. Props system
3. Context for lifecycle hooks

### Phase 4: Reconciliation (Future)
1. Diffing algorithm
2. Efficient DOM updates
3. Key-based reconciliation

## Technical Decisions

### Why No Virtual DOM Diffing Initially?
- Start with simple re-render approach
- Rely on fine-grained reactivity for performance
- Add diffing later if needed

### Why Function Components Only?
- Simpler mental model
- Better composition
- No class baggage
- Hooks pattern is proven

### Event Handling
- Direct DOM event binding
- No synthetic events initially
- Native browser behavior

## Example Application
```typescript
function TodoApp() {
  const todos = atom<string[]>([]);
  const input = atom('');

  const addTodo = () => {
    if (input().trim()) {
      todos(prev => [...prev, input()]);
      input('');
    }
  };

  return (
    <div>
      <h1>Todos</h1>
      <input
        value={input()}
        onInput={(e) => input(e.target.value)}
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos().map(todo => (
          <li>{todo}</li>
        ))}
      </ul>
    </div>
  );
}

mount(document.body, () => <TodoApp />);
```
