/**
 * Solidum Todo App Example
 *
 * Demonstrates all framework features:
 * - Reactive primitives (atom, computed, effect)
 * - Context API for theming
 * - Store pattern for state management
 * - Component utilities (mergeProps, cn)
 * - JSX with createElement
 * - Component lifecycle (onMount, onCleanup)
 */

import {
  atom,
  computed,
  effect,
  batch,
  createContext,
  useContext,
  createStore,
  mergeProps,
  cn,
  createElement,
  mount,
  onMount,
  Fragment
} from '../../packages/core/src/index.js';

// ============================================================================
// Store: Centralized State Management
// ============================================================================

const todoStore = createStore({
  state: {
    todos: [],
    filter: 'all', // 'all' | 'active' | 'completed'
    nextId: 1
  },

  getters: {
    filteredTodos(state) {
      return state.todos.filter(todo => {
        if (state.filter === 'active') return !todo.completed;
        if (state.filter === 'completed') return todo.completed;
        return true;
      });
    },

    stats(state) {
      return {
        total: state.todos.length,
        active: state.todos.filter(t => !t.completed).length,
        completed: state.todos.filter(t => t.completed).length
      };
    }
  },

  actions: {
    addTodo(state, text) {
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: state.nextId, text, completed: false, createdAt: Date.now() }
        ],
        nextId: state.nextId + 1
      };
    },

    toggleTodo(state, id) {
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      };
    },

    deleteTodo(state, id) {
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== id)
      };
    },

    setFilter(state, filter) {
      return { ...state, filter };
    },

    clearCompleted(state) {
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };
    }
  },

  effects: {
    async loadFromLocalStorage({ dispatch }) {
      const saved = localStorage.getItem('solidum-todos');
      if (saved) {
        const data = JSON.parse(saved);
        // Restore todos by dispatching addTodo for each
        data.todos.forEach(todo => {
          dispatch('addTodo', todo.text);
          if (todo.completed) {
            dispatch('toggleTodo', todo.id);
          }
        });
      }
    },

    async saveToLocalStorage({ getState }) {
      const state = getState();
      localStorage.setItem('solidum-todos', JSON.stringify({
        todos: state.todos
      }));
    }
  }
});

// Auto-save to localStorage on every change
effect(() => {
  const state = todoStore.getState();
  // Depend on todos
  if (state.todos.length >= 0) {
    todoStore.effects.saveToLocalStorage();
  }
});

// ============================================================================
// Context: Theme Management
// ============================================================================

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const theme = atom({
    mode: 'light',
    primary: '#667eea',
    secondary: '#764ba2'
  });

  const setTheme = (mode) => {
    theme({ ...theme(), mode });
  };

  return createElement(
    ThemeContext.Provider,
    { value: { theme, setTheme } },
    children
  );
}

// ============================================================================
// Components
// ============================================================================

function AppHeader() {
  const { theme, setTheme } = useContext(ThemeContext);

  return createElement(
    'div',
    { className: 'app-header' },
    createElement('h1', null, '✓ Solidum Todo App'),
    createElement('p', null, 'Built with Solidum Framework'),
    createElement(
      'div',
      { className: 'theme-selector' },
      createElement(
        'button',
        {
          className: cn('theme-btn', { active: theme().mode === 'light' }),
          onClick: () => setTheme('light')
        },
        '☀️ Light'
      ),
      createElement(
        'button',
        {
          className: cn('theme-btn', { active: theme().mode === 'dark' }),
          onClick: () => setTheme('dark')
        },
        '🌙 Dark'
      )
    )
  );
}

function Stats() {
  const stats = todoStore.select(state => todoStore.getters.stats(state));

  return createElement(
    'div',
    { className: 'stats' },
    createElement(
      'div',
      { className: 'stat' },
      createElement('div', { className: 'stat-value' }, String(stats().total)),
      createElement('div', { className: 'stat-label' }, 'Total')
    ),
    createElement(
      'div',
      { className: 'stat' },
      createElement('div', { className: 'stat-value' }, String(stats().active)),
      createElement('div', { className: 'stat-label' }, 'Active')
    ),
    createElement(
      'div',
      { className: 'stat' },
      createElement('div', { className: 'stat-value' }, String(stats().completed)),
      createElement('div', { className: 'stat-label' }, 'Completed')
    )
  );
}

function Filters() {
  const filter = todoStore.select(state => state.filter);

  const setFilter = (newFilter) => {
    todoStore.dispatch('setFilter', newFilter);
  };

  return createElement(
    'div',
    { className: 'filters' },
    createElement(
      'button',
      {
        className: cn('filter-btn', { active: filter() === 'all' }),
        onClick: () => setFilter('all')
      },
      'All'
    ),
    createElement(
      'button',
      {
        className: cn('filter-btn', { active: filter() === 'active' }),
        onClick: () => setFilter('active')
      },
      'Active'
    ),
    createElement(
      'button',
      {
        className: cn('filter-btn', { active: filter() === 'completed' }),
        onClick: () => setFilter('completed')
      },
      'Completed'
    )
  );
}

function AddTodo() {
  const inputValue = atom('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = inputValue().trim();

    if (text) {
      todoStore.dispatch('addTodo', text);
      inputValue('');
    }
  };

  return createElement(
    'div',
    { className: 'add-todo' },
    createElement(
      'form',
      { className: 'add-todo-form', onSubmit: handleSubmit },
      createElement('input', {
        type: 'text',
        className: 'add-todo-input',
        placeholder: 'What needs to be done?',
        value: inputValue(),
        onInput: (e) => inputValue(e.target.value)
      }),
      createElement(
        'button',
        { type: 'submit', className: cn('btn', 'btn-primary') },
        'Add'
      )
    )
  );
}

function TodoItem({ todo }) {
  const handleToggle = () => {
    todoStore.dispatch('toggleTodo', todo.id);
  };

  const handleDelete = () => {
    todoStore.dispatch('deleteTodo', todo.id);
  };

  return createElement(
    'div',
    { className: cn('todo-item', { completed: todo.completed }) },
    createElement('input', {
      type: 'checkbox',
      className: 'todo-checkbox',
      checked: todo.completed,
      onChange: handleToggle
    }),
    createElement('span', { className: 'todo-text' }, todo.text),
    createElement(
      'button',
      { className: 'todo-delete', onClick: handleDelete },
      'Delete'
    )
  );
}

function TodoList() {
  const filteredTodos = todoStore.select(state => todoStore.getters.filteredTodos(state));

  // Re-render when todos change
  const todos = computed(() => filteredTodos());

  return createElement(
    'div',
    { className: 'todo-list' },
    todos().length === 0
      ? createElement(
          'div',
          { className: 'empty-state' },
          createElement('div', { className: 'empty-state-icon' }, '📝'),
          createElement('div', { className: 'empty-state-text' },
            'No todos yet. Add one above!')
        )
      : todos().map(todo =>
          createElement(TodoItem, { key: todo.id, todo })
        )
  );
}

function App() {
  // Load todos from localStorage on mount
  onMount(() => {
    todoStore.effects.loadFromLocalStorage();
  });

  return createElement(
    ThemeProvider,
    null,
    createElement(
      'div',
      null,
      createElement(AppHeader),
      createElement(Stats),
      createElement(Filters),
      createElement(AddTodo),
      createElement(TodoList)
    )
  );
}

// ============================================================================
// Mount App
// ============================================================================

const root = document.getElementById('app');
mount(root, () => createElement(App));

console.log('✨ Solidum Todo App loaded!');
console.log('Features demonstrated:');
console.log('- Reactive primitives (atom, computed, effect)');
console.log('- Context API for theme management');
console.log('- Store pattern for todo state');
console.log('- Component utilities (cn, mergeProps)');
console.log('- Lifecycle hooks (onMount)');
