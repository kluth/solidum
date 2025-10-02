/**
 * TDD Tests for Store Pattern
 *
 * Tests written FIRST before implementation!
 */

import { describe, test, expect, runTests } from '@sldm/testing';

import { createStore } from './store.js';

describe('createStore()', () => {
  test('should create store with initial state', () => {
    const store = createStore({
      state: {
        count: 0,
        name: 'Test',
      },
    });

    expect(store).not.toBeNull();
    expect(store.getState()).toEqual({ count: 0, name: 'Test' });
  });

  test('should select reactive state slice', () => {
    const store = createStore({
      state: {
        count: 5,
        name: 'Test',
      },
    });

    const count = store.select(state => state.count);

    expect(count()).toBe(5);
  });

  test('should dispatch actions to update state', () => {
    const store = createStore({
      state: {
        count: 0,
      },
      actions: {
        increment(state) {
          return { ...state, count: state.count + 1 };
        },
        add(state, value: number) {
          return { ...state, count: state.count + value };
        },
      },
    });

    store.dispatch('increment');
    expect(store.getState().count).toBe(1);

    store.dispatch('add', 5);
    expect(store.getState().count).toBe(6);
  });

  test('should update reactive selectors when state changes', () => {
    const store = createStore({
      state: {
        count: 0,
      },
      actions: {
        increment(state) {
          return { ...state, count: state.count + 1 };
        },
      },
    });

    const count = store.select(state => state.count);
    const values: number[] = [];

    // Subscribe to changes
    const unsub = count.subscribe(value => values.push(value));

    store.dispatch('increment');
    store.dispatch('increment');

    unsub();

    expect(values).toEqual([1, 2]);
  });

  test('should support getters for derived state', () => {
    const store = createStore({
      state: {
        todos: [
          { id: 1, text: 'Task 1', done: false },
          { id: 2, text: 'Task 2', done: true },
        ],
      },
      getters: {
        completedTodos(state) {
          return state.todos.filter(todo => todo.done);
        },
        activeTodos(state) {
          return state.todos.filter(todo => !todo.done);
        },
      },
      actions: {
        toggleTodo(state, id: number) {
          return {
            ...state,
            todos: state.todos.map(todo => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
          };
        },
      },
    });

    const completed = store.select(state => store.getters.completedTodos(state));
    expect(completed().length).toBe(1);

    store.dispatch('toggleTodo', 1);
    expect(completed().length).toBe(2);
  });

  test('should support async effects', async () => {
    let loadedData: unknown = null;

    const store = createStore({
      state: {
        data: null as unknown,
        loading: false,
      },
      actions: {
        setData(state, data: unknown) {
          return { ...state, data, loading: false };
        },
        setLoading(state, loading: boolean) {
          return { ...state, loading };
        },
      },
      effects: {
        async loadData({ dispatch }) {
          dispatch('setLoading', true);

          // Simulate async operation
          const data = await new Promise(resolve => setTimeout(() => resolve({ value: 42 }), 10));

          dispatch('setData', data);
          loadedData = data;
        },
      },
    });

    expect(store.getState().loading).toBe(false);

    await store.effects.loadData();

    expect(store.getState().loading).toBe(false);
    expect(store.getState().data).toEqual({ value: 42 });
    expect(loadedData).toEqual({ value: 42 });
  });

  test('should support effects with getState access', async () => {
    const store = createStore({
      state: {
        count: 0,
      },
      actions: {
        increment(state) {
          return { ...state, count: state.count + 1 };
        },
      },
      effects: {
        async incrementTwice({ dispatch, getState }) {
          dispatch('increment');
          const current = getState();
          expect(current.count).toBe(1);
          dispatch('increment');
        },
      },
    });

    await store.effects.incrementTwice();
    expect(store.getState().count).toBe(2);
  });

  test('should batch multiple updates', () => {
    const store = createStore({
      state: {
        count: 0,
        name: 'Test',
      },
      actions: {
        increment(state) {
          return { ...state, count: state.count + 1 };
        },
        setName(state, name: string) {
          return { ...state, name };
        },
      },
    });

    const updates: number[] = [];
    const count = store.select(state => state.count);
    count.subscribe(value => updates.push(value));

    // Batch updates
    store.batch(() => {
      store.dispatch('increment');
      store.dispatch('increment');
      store.dispatch('setName', 'New Name');
    });

    // Should only trigger one update
    expect(updates.length).toBe(1);
    expect(updates[0]).toBe(2);
    expect(store.getState().name).toBe('New Name');
  });

  test('should support middleware pattern', () => {
    const actions: string[] = [];

    const store = createStore({
      state: { count: 0 },
      actions: {
        increment(state) {
          return { ...state, count: state.count + 1 };
        },
      },
      // eslint-disable-next-line no-unused-vars
      middleware: _store => next => (action, payload) => {
        actions.push(action);
        return next(action, payload);
      },
    });

    store.dispatch('increment');
    store.dispatch('increment');

    expect(actions).toEqual(['increment', 'increment']);
    expect(store.getState().count).toBe(2);
  });

  test('should throw error for unknown actions', () => {
    const store = createStore({
      state: { count: 0 },
      actions: {
        increment(state) {
          return { ...state, count: state.count + 1 };
        },
      },
    });

    let error: Error | null = null;
    try {
      (store as unknown as Record<string, unknown>).dispatch('unknownAction');
    } catch (e) {
      error = e as Error;
    }

    expect(error).not.toBeNull();
    expect(error?.message).toContain('Unknown action');
  });

  test('should support multiple independent stores', () => {
    const userStore = createStore({
      state: { name: 'Alice' },
      actions: {
        setName(state, name: string) {
          return { ...state, name };
        },
      },
    });

    const todoStore = createStore({
      state: { todos: [] as Array<{ id: number; text: string; completed: boolean }> },
      actions: {
        addTodo(state, todo: { id: number; text: string; completed: boolean }) {
          return { ...state, todos: [...state.todos, todo] };
        },
      },
    });

    userStore.dispatch('setName', 'Bob');
    todoStore.dispatch('addTodo', { text: 'Task 1' });

    expect(userStore.getState().name).toBe('Bob');
    expect(todoStore.getState().todos.length).toBe(1);
  });
});

// Run tests
runTests().catch(error => {
  // eslint-disable-next-line no-console
  console.error(error);
});
