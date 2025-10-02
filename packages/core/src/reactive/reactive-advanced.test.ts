/**
 * Advanced Reactive Primitive Tests
 *
 * Additional tests for edge cases and advanced scenarios
 */

import { describe, test, expect, runTests } from '@solidum/testing';

import { atom } from './atom.js';
import { batch } from './batch.js';
import { computed } from './computed.js';
import { effect } from './effect.js';

describe('atom() - Advanced', () => {
  test('should handle object updates', () => {
    const state = atom({ count: 0, name: 'test' });

    expect(state().count).toBe(0);
    expect(state().name).toBe('test');

    state({ count: 5, name: 'updated' });

    expect(state().count).toBe(5);
    expect(state().name).toBe('updated');
  });

  test('should handle array updates', () => {
    const list = atom([1, 2, 3]);

    expect(list().length).toBe(3);

    list([...list(), 4]);

    expect(list().length).toBe(4);
    expect(list()[3]).toBe(4);
  });

  test('should handle null and undefined', () => {
    const nullable = atom<string | null>(null);

    expect(nullable()).toBeNull();

    nullable('value');
    expect(nullable()).toBe('value');

    nullable(null);
    expect(nullable()).toBeNull();
  });

  test('should handle boolean values', () => {
    const flag = atom(false);

    expect(flag()).toBe(false);

    flag(true);
    expect(flag()).toBe(true);

    flag(false);
    expect(flag()).toBe(false);
  });

  test('should handle rapid updates', () => {
    const count = atom(0);
    const values: number[] = [];

    count.subscribe(val => values.push(val));

    for (let i = 1; i <= 100; i++) {
      count(i);
    }

    expect(count()).toBe(100);
    expect(values.length).toBe(100);
    expect(values[values.length - 1]).toBe(100);
  });

  test('should handle update function with previous value', () => {
    const count = atom(5);

    count(prev => prev + 10);

    expect(count()).toBe(15);

    count(prev => prev * 2);

    expect(count()).toBe(30);
  });

  test('should support multiple subscribers with different timing', () => {
    const data = atom(0);
    const subscriber1Values: number[] = [];
    const subscriber2Values: number[] = [];

    const unsub1 = data.subscribe(val => subscriber1Values.push(val));

    data(1);
    data(2);

    const unsub2 = data.subscribe(val => subscriber2Values.push(val));

    data(3);
    data(4);

    unsub1();

    data(5);

    expect(subscriber1Values).toEqual([1, 2, 3, 4]);
    expect(subscriber2Values).toEqual([3, 4, 5]);

    unsub2();
  });
});

describe('computed() - Advanced', () => {
  test('should handle complex computations', () => {
    const a = atom(2);
    const b = atom(3);
    const c = atom(4);

    const result = computed(() => {
      return a() * b() + c();
    });

    expect(result()).toBe(10); // (2 * 3) + 4

    a(5);
    expect(result()).toBe(19); // (5 * 3) + 4

    b(10);
    expect(result()).toBe(54); // (5 * 10) + 4

    c(0);
    expect(result()).toBe(50); // (5 * 10) + 0
  });

  test('should handle nested computeds', () => {
    const base = atom(2);
    const doubled = computed(() => base() * 2);
    const quadrupled = computed(() => doubled() * 2);
    const octupled = computed(() => quadrupled() * 2);

    expect(octupled()).toBe(16); // 2 * 2 * 2 * 2

    base(3);
    expect(octupled()).toBe(24); // 3 * 2 * 2 * 2

    base(10);
    expect(octupled()).toBe(80); // 10 * 2 * 2 * 2
  });

  test('should handle conditional dependencies', () => {
    const useA = atom(true);
    const a = atom(10);
    const b = atom(20);

    const result = computed(() => {
      return useA() ? a() : b();
    });

    expect(result()).toBe(10);

    a(15);
    expect(result()).toBe(15);

    useA(false);
    expect(result()).toBe(20);

    b(25);
    expect(result()).toBe(25);

    a(100); // Should not affect result
    expect(result()).toBe(25);

    useA(true);
    expect(result()).toBe(100);
  });

  test('should handle array operations', () => {
    const numbers = atom([1, 2, 3, 4, 5]);
    const sum = computed(() => numbers().reduce((a, b) => a + b, 0));
    const average = computed(() => sum() / numbers().length);

    expect(sum()).toBe(15);
    expect(average()).toBe(3);

    numbers([10, 20, 30]);
    expect(sum()).toBe(60);
    expect(average()).toBe(20);
  });

  test('should handle string operations', () => {
    const firstName = atom('John');
    const lastName = atom('Doe');
    const fullName = computed(() => `${firstName()} ${lastName()}`);
    const initials = computed(() => `${firstName()[0]}${lastName()[0]}`);
    const reversed = computed(() => fullName().split('').reverse().join(''));

    expect(fullName()).toBe('John Doe');
    expect(initials()).toBe('JD');
    expect(reversed()).toBe('eoD nhoJ');

    firstName('Jane');
    expect(fullName()).toBe('Jane Doe');
    expect(initials()).toBe('JD');

    lastName('Smith');
    expect(fullName()).toBe('Jane Smith');
    expect(initials()).toBe('JS');
  });

  test('should not recompute unnecessarily', () => {
    const a = atom(5);
    let computeCount = 0;

    const doubled = computed(() => {
      computeCount++;
      return a() * 2;
    });

    // First access
    expect(doubled()).toBe(10);
    expect(computeCount).toBe(1);

    // Access again without change
    expect(doubled()).toBe(10);
    expect(computeCount).toBe(1); // Should not recompute

    // Change dependency
    a(10);
    expect(doubled()).toBe(20);
    expect(computeCount).toBe(2);

    // Access again without change
    expect(doubled()).toBe(20);
    expect(computeCount).toBe(2); // Should not recompute
  });
});

describe('effect() - Advanced', () => {
  test('should track multiple dependencies', () => {
    const a = atom(1);
    const b = atom(2);
    const c = atom(3);
    let result = 0;

    effect(() => {
      result = a() + b() + c();
    });

    expect(result).toBe(6);

    a(10);
    expect(result).toBe(15);

    b(20);
    expect(result).toBe(33);

    c(30);
    expect(result).toBe(60);
  });

  test('should handle nested effects', () => {
    const outer = atom(1);
    const inner = atom(2);
    const results: string[] = [];

    effect(() => {
      const outerVal = outer();
      results.push(`outer:${outerVal}`);

      effect(() => {
        const innerVal = inner();
        results.push(`inner:${innerVal}`);
      });
    });

    // Clear initial run
    results.length = 0;

    outer(5);
    expect(results).toContain('outer:5');

    results.length = 0;
    inner(10);
    expect(results).toContain('inner:10');
  });

  test('should handle conditional dependencies in effects', () => {
    const condition = atom(true);
    const a = atom(10);
    const b = atom(20);
    let result = 0;

    effect(() => {
      if (condition()) {
        result = a();
      } else {
        result = b();
      }
    });

    expect(result).toBe(10);

    a(15);
    expect(result).toBe(15);

    condition(false);
    expect(result).toBe(20);

    b(25);
    expect(result).toBe(25);

    // Changing a should not trigger effect
    const beforeChange = result;
    a(100);
    expect(result).toBe(beforeChange);
  });

  test('should handle async operations in effects', async () => {
    const data = atom<number | null>(null);
    let loadCount = 0;

    effect(() => {
      const val = data();
      if (val !== null) {
        loadCount++;
      }
    });

    await new Promise(resolve => setTimeout(resolve, 10));

    data(5);
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(loadCount).toBe(1);

    data(10);
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(loadCount).toBe(2);
  });
});

describe('batch() - Advanced', () => {
  test('should batch complex update chains', () => {
    const a = atom(1);
    const b = atom(2);
    const c = atom(3);
    const updateCount = atom(0);
    let effectRuns = 0;

    effect(() => {
      a();
      b();
      c();
      updateCount();
      effectRuns++;
    });

    const initialRuns = effectRuns;

    batch(() => {
      a(10);
      b(20);
      c(30);
      updateCount(updateCount() + 1);
    });

    // Should only run once for all updates
    expect(effectRuns).toBe(initialRuns + 1);
  });

  test('should handle nested batches', () => {
    const a = atom(1);
    const b = atom(2);
    let runs = 0;

    effect(() => {
      a();
      b();
      runs++;
    });

    const initialRuns = runs;

    batch(() => {
      a(10);
      batch(() => {
        b(20);
      });
    });

    // Nested batches should still result in single notification
    expect(runs).toBe(initialRuns + 1);
  });

  test('should handle batch with computed', () => {
    const a = atom(1);
    const b = atom(2);
    const sum = computed(() => a() + b());
    let runs = 0;

    effect(() => {
      sum();
      runs++;
    });

    const initialRuns = runs;

    batch(() => {
      a(10);
      b(20);
    });

    expect(sum()).toBe(30);
    expect(runs).toBe(initialRuns + 1);
  });

  test('should handle errors in batch', () => {
    const a = atom(1);
    const b = atom(2);

    let error: Error | null = null;
    try {
      batch(() => {
        a(10);
        throw new Error('Test error');
        // eslint-disable-next-line no-unreachable
        b(20); // Should not execute
      });
    } catch (e) {
      error = e as Error;
    }

    expect(error).not.toBeNull();
    expect(error?.message).toBe('Test error');
    expect(a()).toBe(10); // First update should have happened
    expect(b()).toBe(2); // Second update should not have happened
  });
});

describe('Integration - Complex Scenarios', () => {
  test('should handle shopping cart scenario', () => {
    const items = atom<Array<{ id: number; name: string; price: number; quantity: number }>>([]);

    const subtotal = computed(() => {
      return items().reduce((sum, item) => sum + item.price * item.quantity, 0);
    });

    const tax = computed(() => subtotal() * 0.1);
    const total = computed(() => subtotal() + tax());

    // Add items
    batch(() => {
      items([
        { id: 1, name: 'Item 1', price: 10, quantity: 2 },
        { id: 2, name: 'Item 2', price: 20, quantity: 1 },
      ]);
    });

    expect(subtotal()).toBe(40);
    expect(tax()).toBe(4);
    expect(total()).toBe(44);

    // Update quantity
    items(items().map(item => (item.id === 1 ? { ...item, quantity: 3 } : item)));

    expect(subtotal()).toBe(50);
    expect(total()).toBe(55);
  });

  test('should handle form validation scenario', () => {
    const email = atom('');
    const password = atom('');

    const emailValid = computed(() => {
      const e = email();
      return e.length > 0 && e.includes('@');
    });

    const passwordValid = computed(() => password().length >= 8);
    const formValid = computed(() => emailValid() && passwordValid());

    expect(formValid()).toBe(false);

    email('test@example.com');
    expect(emailValid()).toBe(true);
    expect(formValid()).toBe(false);

    password('password123');
    expect(passwordValid()).toBe(true);
    expect(formValid()).toBe(true);

    email('invalid');
    expect(emailValid()).toBe(false);
    expect(formValid()).toBe(false);
  });

  test('should handle counter with history', () => {
    const count = atom(0);
    const history = atom<number[]>([0]);

    effect(() => {
      const current = count();
      const hist = history();
      if (hist[hist.length - 1] !== current) {
        history([...hist, current]);
      }
    });

    count(5);
    count(10);
    count(15);

    const hist = history();
    expect(hist).toEqual([0, 5, 10, 15]);
    expect(hist.length).toBe(4);
  });
});

// Run tests
runTests().catch(error => {
  // eslint-disable-next-line no-console
  console.error(error);
});
