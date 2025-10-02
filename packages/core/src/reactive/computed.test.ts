/**
 * TDD Tests for computed() - Derived reactive primitive
 *
 * Tests written FIRST before implementation!
 */

import { describe, test, expect, runTests } from '@solidum/testing';

import { atom } from './atom.js';
import { computed } from './computed.js';

describe('computed()', () => {
  test('should compute derived value', () => {
    const count = atom(5);
    const doubled = computed(() => count() * 2);

    expect(doubled()).toBe(10);
  });

  test('should update when dependency changes', () => {
    const count = atom(5);
    const doubled = computed(() => count() * 2);

    count(10);

    expect(doubled()).toBe(20);
  });

  test('should support multiple dependencies', () => {
    const firstName = atom('John');
    const lastName = atom('Doe');
    const fullName = computed(() => `${firstName()} ${lastName()}`);

    expect(fullName()).toBe('John Doe');

    firstName('Jane');
    expect(fullName()).toBe('Jane Doe');

    lastName('Smith');
    expect(fullName()).toBe('Jane Smith');
  });

  test('should be lazy (only compute when accessed)', () => {
    const count = atom(0);
    let computeCount = 0;

    const doubled = computed(() => {
      computeCount++;
      return count() * 2;
    });

    // Should not have computed yet
    expect(computeCount).toBe(0);

    // First access triggers computation
    doubled();
    expect(computeCount).toBe(1);
  });

  test('should cache result until dependency changes', () => {
    const count = atom(5);
    let computeCount = 0;

    const doubled = computed(() => {
      computeCount++;
      return count() * 2;
    });

    // First access
    doubled();
    expect(computeCount).toBe(1);

    // Second access (should use cache)
    doubled();
    expect(computeCount).toBe(1);

    // Change dependency
    count(10);

    // Next access recomputes
    doubled();
    expect(computeCount).toBe(2);

    // Access again (cached)
    doubled();
    expect(computeCount).toBe(2);
  });

  test('should work with nested computed', () => {
    const count = atom(5);
    const doubled = computed(() => count() * 2);
    const quadrupled = computed(() => doubled() * 2);

    expect(quadrupled()).toBe(20);

    count(10);
    expect(quadrupled()).toBe(40);
  });

  test('should only recompute once when multiple deps change', () => {
    const a = atom(1);
    const b = atom(2);
    let computeCount = 0;

    const sum = computed(() => {
      computeCount++;
      return a() + b();
    });

    expect(sum()).toBe(3);
    expect(computeCount).toBe(1);

    // Change both deps
    a(10);
    b(20);

    // Should only recompute once on next access
    expect(sum()).toBe(30);
    expect(computeCount).toBe(2);
  });

  test('should notify subscribers when value changes', () => {
    const count = atom(5);
    const doubled = computed(() => count() * 2);

    let notified = false;
    let receivedValue = 0;

    doubled.subscribe(value => {
      notified = true;
      receivedValue = value;
    });

    count(10);

    // Subscriber should be notified
    expect(notified).toBe(true);
    expect(receivedValue).toBe(20);
  });

  test('should NOT notify if computed value is the same', () => {
    const count = atom(5);
    const isPositive = computed(() => count() > 0);

    let callCount = 0;

    isPositive.subscribe(() => {
      callCount++;
    });

    // Value is true
    expect(isPositive()).toBe(true);

    // Change count but isPositive stays true
    count(10);

    expect(isPositive()).toBe(true);
    expect(callCount).toBe(0); // No notification!
  });

  test('should handle complex dependency graphs', () => {
    const x = atom(2);
    const y = atom(3);
    const sum = computed(() => x() + y());
    const product = computed(() => x() * y());
    const result = computed(() => sum() + product());

    expect(result()).toBe(11); // (2+3) + (2*3) = 5 + 6 = 11

    x(4);
    expect(result()).toBe(19); // (4+3) + (4*3) = 7 + 12 = 19
  });
});

// Run tests
runTests().catch(error => {
  // eslint-disable-next-line no-console
  console.error(error);
});
