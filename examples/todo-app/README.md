# Solidum Todo App Example

A comprehensive example application showcasing all features of the Solidum framework.

## Features Demonstrated

### 1. **Reactive Primitives**

- `atom()` - For local component state (input value, theme)
- `computed()` - For derived values
- `effect()` - For side effects (auto-save to localStorage)
- `batch()` - For batching multiple updates

### 2. **Store Pattern**

Centralized state management with:

- **State**: Todo list, filter, next ID
- **Getters**: Filtered todos, statistics
- **Actions**: Add, toggle, delete todos, change filter
- **Effects**: Load/save from localStorage

### 3. **Context API**

Theme management using dependency injection:

- ThemeContext provides theme state to all components
- useContext() accesses theme in child components
- No prop drilling required

### 4. **Component Utilities**

- `cn()` - Conditional class names
- `mergeProps()` - Intelligent props merging (demonstrated in components)

### 5. **Component System**

- `createElement()` - JSX alternative
- `Fragment` - Group elements without wrapper
- Component composition and reusability

### 6. **Lifecycle Hooks**

- `onMount()` - Load data when component mounts
- `onCleanup()` - Cleanup on unmount (not shown but available)

## Running the Example

### Option 1: HTTP Server

```bash
# Install a simple HTTP server (if you don't have one)
npm install -g http-server

# Navigate to the example directory
cd examples/todo-app

# Start the server
http-server -p 8080

# Open http://localhost:8080 in your browser
```

### Option 2: VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 3: Python HTTP Server

```bash
# Navigate to the example directory
cd examples/todo-app

# Python 3
python -m http.server 8080

# Open http://localhost:8080 in your browser
```

## Code Structure

```
todo-app/
├── index.html          # HTML structure and styles
├── app.js              # Main application code
└── README.md           # This file
```

## Key Concepts

### Store Pattern Usage

```javascript
// Create store
const todoStore = createStore({
  state: { todos: [] },
  actions: {
    addTodo(state, text) {
      return { ...state, todos: [...state.todos, { text }] };
    },
  },
  getters: {
    activeTodos(state) {
      return state.todos.filter(t => !t.completed);
    },
  },
});

// Dispatch actions
todoStore.dispatch('addTodo', 'Learn Solidum');

// Select reactive state
const todos = todoStore.select(state => state.todos);
console.log(todos()); // Access current value
```

### Context API Usage

```javascript
// Create context
const ThemeContext = createContext();

// Provide value
function ThemeProvider({ children }) {
  const theme = atom({ mode: 'light' });
  return createElement(ThemeContext.Provider, { value: { theme } }, children);
}

// Consume value
function Button() {
  const { theme } = useContext(ThemeContext);
  return createElement('button', {
    style: { color: theme().mode === 'dark' ? 'white' : 'black' },
  });
}
```

### Component Utilities

```javascript
// Conditional class names
const classes = cn('btn', 'btn-primary', { active: isActive, disabled: isDisabled });

// Merge props
const merged = mergeProps(
  { className: 'base', onClick: handler1 },
  { className: 'extra', onClick: handler2 }
);
// Result: { className: 'base extra', onClick: [both handlers chained] }
```

## Learning Path

1. **Start with the Store** - See how centralized state works
2. **Examine Components** - Understand component structure
3. **Follow the Data Flow** - Track how state changes propagate
4. **Try Modifications** - Add features like editing todos
5. **Experiment** - Change themes, add new filters, etc.

## Extending the Example

Ideas for further exploration:

1. **Add todo editing** - Double-click to edit
2. **Add categories** - Tag todos with categories
3. **Add due dates** - Track when todos are due
4. **Add persistence** - Use a backend API instead of localStorage
5. **Add animations** - Animate todo additions/removals
6. **Add search** - Filter todos by text search
7. **Add sorting** - Sort by date, completion, etc.

## Performance Notes

- Uses fine-grained reactivity - only affected components re-render
- Store updates are automatically batched
- Computed values are cached and only recalculate when dependencies change
- Effects track dependencies automatically

## Browser Support

Works in all modern browsers that support:

- ES6 modules
- Proxy
- Symbol
- Array methods (map, filter, etc.)
