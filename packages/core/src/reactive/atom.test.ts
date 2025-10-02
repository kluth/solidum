/**
 * TDD Tests for atom() - Reactive primitive
 *
 * Tests written FIRST before implementation!
 */

import { describe, test, expect, runTests } from '@solidum/testing';

import { atom } from './atom.js';

describe('atom()', () => {
  test('should create an atom with initial value', () => {
    const count = atom(0);
    expect(count()).toBe(0);
  });

  test('should update value', () => {
    const count = atom(0);
    count(5);
    expect(count()).toBe(5);
  });

  test('should notify subscribers on change', () => {
    const count = atom(0);
    let notified = false;
    let receivedValue = 0;

    count.subscribe(value => {
      notified = true;
      receivedValue = value;
    });

    count(10);

    expect(notified).toBe(true);
    expect(receivedValue).toBe(10);
  });

  test('should NOT notify if value is the same', () => {
    const count = atom(5);
    let callCount = 0;

    count.subscribe(() => {
      callCount++;
    });

    count(5); // Same value
    expect(callCount).toBe(0);
  });

  test('should support functional updates', () => {
    const count = atom(0);
    count(prev => prev + 1);
    expect(count()).toBe(1);
  });

  test('should allow unsubscribe', () => {
    const count = atom(0);
    let callCount = 0;

    const unsubscribe = count.subscribe(() => {
      callCount++;
    });

    count(1);
    expect(callCount).toBe(1);

    unsubscribe();
    count(2);
    expect(callCount).toBe(1); // Should still be 1
  });

  test('should handle multiple subscribers', () => {
    const count = atom(0);
    const values: number[] = [];

    count.subscribe(v => values.push(v * 1));
    count.subscribe(v => values.push(v * 2));

    count(5);

    expect(values).toEqual([5, 10]);
  });

  test('should work with objects', () => {
    const state = atom({ name: 'Alice', age: 30 });

    expect(state().name).toBe('Alice');

    state({ name: 'Bob', age: 25 });

    expect(state().name).toBe('Bob');
    expect(state().age).toBe(25);
  });

  test('should work with arrays', () => {
    const items = atom([1, 2, 3]);

    expect(items()).toEqual([1, 2, 3]);

    items([4, 5, 6]);

    expect(items()).toEqual([4, 5, 6]);
  });

  test('should handle subscriber errors gracefully', () => {
    const count = atom(0);
    let secondSubscriberCalled = false;

    count.subscribe(() => {
      throw new Error('Subscriber error');
    });

    count.subscribe(() => {
      secondSubscriberCalled = true;
    });

    count(1);

    expect(secondSubscriberCalled).toBe(true);
  });
});

// Run tests
runTests().catch(error => {
  // eslint-disable-next-line no-console
  console.error(error);
});
