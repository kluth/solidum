/**
 * Store Integration Tests
 *
 * Real-world scenarios and integration tests for the store pattern
 */

import { effect } from '@sldm/core';
import { describe, test, expect, runTests } from '@sldm/testing';

import { createStore } from './store.js';

describe('Store - Real World Scenarios', () => {
  test('should handle todo list application', () => {
    const todoStore = createStore({
      state: {
        todos: [] as Array<{ id: number; text: string; completed: boolean }>,
        filter: 'all' as 'all' | 'active' | 'completed',
        nextId: 1,
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
            completed: state.todos.filter(t => t.completed).length,
          };
        },
      },

      actions: {
        addTodo(state, text: string) {
          return {
            ...state,
            todos: [...state.todos, { id: state.nextId, text, completed: false }],
            nextId: state.nextId + 1,
          };
        },
        toggleTodo(state, id: number) {
          return {
            ...state,
            todos: state.todos.map(todo =>
              todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ),
          };
        },
        setFilter(state, filter: 'all' | 'active' | 'completed') {
          return { ...state, filter };
        },
      },
    });

    // Add todos
    todoStore.dispatch('addTodo', 'Task 1');
    todoStore.dispatch('addTodo', 'Task 2');
    todoStore.dispatch('addTodo', 'Task 3');

    expect(todoStore.getState().todos.length).toBe(3);

    const stats = todoStore.select(state => todoStore.getters.stats(state));
    expect(stats().total).toBe(3);
    expect(stats().active).toBe(3);
    expect(stats().completed).toBe(0);

    // Toggle todo
    todoStore.dispatch('toggleTodo', 1);
    expect(stats().active).toBe(2);
    expect(stats().completed).toBe(1);

    // Filter todos
    todoStore.dispatch('setFilter', 'active');
    const filtered = todoStore.select(state => todoStore.getters.filteredTodos(state));
    expect(filtered().length).toBe(2);

    todoStore.dispatch('setFilter', 'completed');
    expect(filtered().length).toBe(1);
  });

  test('should handle user authentication flow', async () => {
    interface User {
      id: number;
      email: string;
      name: string;
    }

    const authStore = createStore({
      state: {
        user: null as User | null,
        loading: false,
        error: null as string | null,
      },

      getters: {
        isAuthenticated(state) {
          return state.user !== null;
        },
      },

      actions: {
        setLoading(state, loading: boolean) {
          return { ...state, loading, error: null };
        },
        setUser(state, user: User) {
          return { ...state, user, loading: false, error: null };
        },
        setError(state, error: string) {
          return { ...state, error, loading: false };
        },
        logout(state) {
          return { ...state, user: null, error: null };
        },
      },

      effects: {
        async login({ dispatch }, credentials: { email: string; password: string }) {
          dispatch('setLoading', true);

          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 10));

          if (credentials.password === 'correct') {
            const user: User = { id: 1, email: credentials.email, name: 'Test User' };
            dispatch('setUser', user);
          } else {
            dispatch('setError', 'Invalid credentials');
          }
        },
      },
    });

    expect(authStore.getters.isAuthenticated(authStore.getState())).toBe(false);

    // Failed login
    await authStore.effects.login({ email: 'test@example.com', password: 'wrong' });
    expect(authStore.getState().error).toBe('Invalid credentials');
    expect(authStore.getters.isAuthenticated(authStore.getState())).toBe(false);

    // Successful login
    await authStore.effects.login({ email: 'test@example.com', password: 'correct' });
    expect(authStore.getState().user).not.toBeNull();
    expect(authStore.getState().user?.email).toBe('test@example.com');
    expect(authStore.getters.isAuthenticated(authStore.getState())).toBe(true);

    // Logout
    authStore.dispatch('logout');
    expect(authStore.getState().user).toBeNull();
    expect(authStore.getters.isAuthenticated(authStore.getState())).toBe(false);
  });

  test('should handle shopping cart', () => {
    interface CartItem {
      id: number;
      name: string;
      price: number;
      quantity: number;
    }

    const cartStore = createStore({
      state: {
        items: [] as CartItem[],
        couponCode: null as string | null,
        discount: 0,
      },

      getters: {
        subtotal(state) {
          return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
        discountAmount(state) {
          const subtotal = this.subtotal(state);
          return subtotal * state.discount;
        },
        total(state) {
          return this.subtotal(state) - this.discountAmount(state);
        },
        itemCount(state) {
          return state.items.reduce((sum, item) => sum + item.quantity, 0);
        },
      },

      actions: {
        addItem(state, item: CartItem) {
          const existing = state.items.find(i => i.id === item.id);
          if (existing) {
            return {
              ...state,
              items: state.items.map(i =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { ...state, items: [...state.items, item] };
        },
        removeItem(state, id: number) {
          return { ...state, items: state.items.filter(item => item.id !== id) };
        },
        updateQuantity(state, payload: { id: number; quantity: number }) {
          return {
            ...state,
            items: state.items.map(item =>
              item.id === payload.id ? { ...item, quantity: payload.quantity } : item
            ),
          };
        },
        applyCoupon(state, code: string) {
          const discount = code === 'SAVE10' ? 0.1 : code === 'SAVE20' ? 0.2 : 0;
          return { ...state, couponCode: code, discount };
        },
        clearCart(state) {
          return { ...state, items: [], couponCode: null, discount: 0 };
        },
      },
    });

    // Add items
    cartStore.dispatch('addItem', { id: 1, name: 'Product 1', price: 100, quantity: 2 });
    cartStore.dispatch('addItem', { id: 2, name: 'Product 2', price: 50, quantity: 1 });

    expect(cartStore.getters.subtotal(cartStore.getState())).toBe(250);
    expect(cartStore.getters.itemCount(cartStore.getState())).toBe(3);

    // Add same item again
    cartStore.dispatch('addItem', { id: 1, name: 'Product 1', price: 100, quantity: 1 });
    expect(cartStore.getters.itemCount(cartStore.getState())).toBe(4);

    // Apply coupon
    cartStore.dispatch('applyCoupon', 'SAVE10');
    expect(cartStore.getters.discountAmount(cartStore.getState())).toBe(35); // 10% of 350
    expect(cartStore.getters.total(cartStore.getState())).toBe(315); // 350 - 35

    // Update quantity
    cartStore.dispatch('updateQuantity', { id: 1, quantity: 1 });
    expect(cartStore.getters.subtotal(cartStore.getState())).toBe(150);

    // Remove item
    cartStore.dispatch('removeItem', 2);
    expect(cartStore.getState().items.length).toBe(1);
  });

  test('should handle notification system', () => {
    interface Notification {
      id: number;
      type: 'info' | 'success' | 'warning' | 'error';
      message: string;
      read: boolean;
      timestamp: number;
    }

    const notificationStore = createStore({
      state: {
        notifications: [] as Notification[],
        nextId: 1,
      },

      getters: {
        unreadCount(state) {
          return state.notifications.filter(n => !n.read).length;
        },
        unreadNotifications(state) {
          return state.notifications.filter(n => !n.read);
        },
        byType(state) {
          return (type: Notification['type']) => state.notifications.filter(n => n.type === type);
        },
      },

      actions: {
        add(state, payload: Pick<Notification, 'type' | 'message'>) {
          return {
            ...state,
            notifications: [
              {
                id: state.nextId,
                ...payload,
                read: false,
                timestamp: Date.now(),
              },
              ...state.notifications,
            ],
            nextId: state.nextId + 1,
          };
        },
        markAsRead(state, id: number) {
          return {
            ...state,
            notifications: state.notifications.map(n => (n.id === id ? { ...n, read: true } : n)),
          };
        },
        markAllAsRead(state) {
          return {
            ...state,
            notifications: state.notifications.map(n => ({ ...n, read: true })),
          };
        },
        remove(state, id: number) {
          return {
            ...state,
            notifications: state.notifications.filter(n => n.id !== id),
          };
        },
        clear(state) {
          return { ...state, notifications: [] };
        },
      },
    });

    // Add notifications
    notificationStore.dispatch('add', { type: 'info', message: 'Info message' });
    notificationStore.dispatch('add', { type: 'success', message: 'Success message' });
    notificationStore.dispatch('add', { type: 'error', message: 'Error message' });

    expect(notificationStore.getState().notifications.length).toBe(3);
    expect(notificationStore.getters.unreadCount(notificationStore.getState())).toBe(3);

    // Mark one as read
    notificationStore.dispatch('markAsRead', 1);
    expect(notificationStore.getters.unreadCount(notificationStore.getState())).toBe(2);

    // Mark all as read
    notificationStore.dispatch('markAllAsRead');
    expect(notificationStore.getters.unreadCount(notificationStore.getState())).toBe(0);

    // Filter by type
    const errors = notificationStore.getters.byType(notificationStore.getState())('error');
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('Error message');
  });

  test('should integrate with reactive effects', () => {
    const counterStore = createStore({
      state: { count: 0 },
      actions: {
        increment(state) {
          return { ...state, count: state.count + 1 };
        },
      },
    });

    const count = counterStore.select(state => state.count);
    const values: number[] = [];

    // Effect reacts to store changes
    effect(() => {
      values.push(count());
    });

    counterStore.dispatch('increment');
    counterStore.dispatch('increment');
    counterStore.dispatch('increment');

    expect(values).toEqual([0, 1, 2, 3]);
  });

  test('should handle complex state updates with multiple actions', () => {
    interface Task {
      id: number;
      title: string;
      completed: boolean;
      priority: 'low' | 'medium' | 'high';
      tags: string[];
    }

    const taskStore = createStore({
      state: {
        tasks: [] as Task[],
        nextId: 1,
        selectedTags: [] as string[],
      },

      getters: {
        filteredTasks(state) {
          if (state.selectedTags.length === 0) {
            return state.tasks;
          }
          return state.tasks.filter(task =>
            task.tags.some(tag => state.selectedTags.includes(tag))
          );
        },
        byPriority(state) {
          return (priority: Task['priority']) =>
            state.tasks.filter(task => task.priority === priority);
        },
        completedCount(state) {
          return state.tasks.filter(t => t.completed).length;
        },
      },

      actions: {
        addTask(state, task: Omit<Task, 'id'>) {
          return {
            ...state,
            tasks: [...state.tasks, { ...task, id: state.nextId }],
            nextId: state.nextId + 1,
          };
        },
        toggleTask(state, id: number) {
          return {
            ...state,
            tasks: state.tasks.map(task =>
              task.id === id ? { ...task, completed: !task.completed } : task
            ),
          };
        },
        setPriority(state, payload: { id: number; priority: Task['priority'] }) {
          return {
            ...state,
            tasks: state.tasks.map(task =>
              task.id === payload.id ? { ...task, priority: payload.priority } : task
            ),
          };
        },
        addTag(state, payload: { id: number; tag: string }) {
          return {
            ...state,
            tasks: state.tasks.map(task =>
              task.id === payload.id && !task.tags.includes(payload.tag)
                ? { ...task, tags: [...task.tags, payload.tag] }
                : task
            ),
          };
        },
        filterByTag(state, tag: string) {
          const selected = state.selectedTags.includes(tag)
            ? state.selectedTags.filter(t => t !== tag)
            : [...state.selectedTags, tag];
          return { ...state, selectedTags: selected };
        },
      },
    });

    // Add tasks
    taskStore.dispatch('addTask', {
      title: 'Task 1',
      completed: false,
      priority: 'high',
      tags: ['urgent', 'important'],
    });

    taskStore.dispatch('addTask', {
      title: 'Task 2',
      completed: false,
      priority: 'low',
      tags: ['later'],
    });

    expect(taskStore.getState().tasks.length).toBe(2);

    // Test priority filtering
    const highPriority = taskStore.getters.byPriority(taskStore.getState())('high');
    expect(highPriority.length).toBe(1);

    // Test tag filtering
    taskStore.dispatch('filterByTag', 'urgent');
    const filtered = taskStore.getters.filteredTasks(taskStore.getState());
    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe('Task 1');

    // Complete task
    taskStore.dispatch('toggleTask', 1);
    expect(taskStore.getters.completedCount(taskStore.getState())).toBe(1);

    // Change priority
    taskStore.dispatch('setPriority', { id: 2, priority: 'high' });
    const highPriorityAfter = taskStore.getters.byPriority(taskStore.getState())('high');
    expect(highPriorityAfter.length).toBe(2);
  });
});

// Run tests
runTests().catch(error => {
  // eslint-disable-next-line no-console
  console.error(error);
});
