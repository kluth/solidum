/**
 * TDD Tests for batch() - Batched updates primitive
 *
 * Tests written FIRST before implementation!
 */

import { describe, test, expect, runTests } from '@solidum/testing';
import { atom } from './atom.js';
import { computed } from './computed.js';
import { effect } from './effect.js';
import { batch } from './batch.js';

describe('batch()', () => {
  test('should batch multiple atom updates', () => {
    const a = atom(1);
    const b = atom(2);
    let runCount = 0;

    effect(() => {
      a();
      b();
      runCount++;
    });

    expect(runCount).toBe(1); // Initial run

    // Without batch, this would trigger effect twice
    batch(() => {
      a(10);
      b(20);
    });

    expect(runCount).toBe(2); // Should only run once after batch
  });

  test('should batch computed updates', () => {
    const count = atom(1);
    const doubled = computed(() => count() * 2);
    let runCount = 0;
    let lastValue = 0;

    effect(() => {
      lastValue = doubled();
      runCount++;
    });

    expect(runCount).toBe(1);
    expect(lastValue).toBe(2);

    // Multiple count updates should only trigger one recomputation
    batch(() => {
      count(5);
      count(10);
      count(15);
    });

    expect(runCount).toBe(2); // Only one effect run after batch
    expect(lastValue).toBe(30); // Final value: 15 * 2
  });

  test('should support nested batches', () => {
    const a = atom(1);
    let runCount = 0;

    effect(() => {
      a();
      runCount++;
    });

    expect(runCount).toBe(1);

    batch(() => {
      a(2);
      batch(() => {
        a(3);
      });
      a(4);
    });

    expect(runCount).toBe(2); // Only one effect run after all batches
    expect(a()).toBe(4);
  });

  test('should notify subscribers after batch completes', () => {
    const count = atom(0);
    const values: number[] = [];

    count.subscribe((value) => {
      values.push(value);
    });

    batch(() => {
      count(1);
      count(2);
      count(3);
    });

    // Should only get the final value after batch
    expect(values).toEqual([3]);
  });

  test('should work with multiple effects', () => {
    const a = atom(1);
    const b = atom(2);
    let effect1Count = 0;
    let effect2Count = 0;

    effect(() => {
      a();
      effect1Count++;
    });

    effect(() => {
      b();
      effect2Count++;
    });

    expect(effect1Count).toBe(1);
    expect(effect2Count).toBe(1);

    batch(() => {
      a(10);
      b(20);
    });

    expect(effect1Count).toBe(2);
    expect(effect2Count).toBe(2);
  });

  test('should return the result from batch function', () => {
    const result = batch(() => {
      return 42;
    });

    expect(result).toBe(42);
  });

  test('should handle errors in batch', () => {
    const count = atom(0);
    let runCount = 0;

    effect(() => {
      count();
      runCount++;
    });

    expect(runCount).toBe(1);

    try {
      batch(() => {
        count(1);
        throw new Error('Test error');
      });
    } catch (error) {
      // Error should be thrown
    }

    // Effect should still run even if batch threw an error
    expect(runCount).toBe(2);
    expect(count()).toBe(1);
  });

  test('should allow reading values inside batch', () => {
    const a = atom(1);
    const b = atom(2);
    let sum = 0;

    batch(() => {
      a(10);
      b(20);
      sum = a() + b(); // Should read updated values
    });

    expect(sum).toBe(30);
  });

  test('should not trigger effects during batch', () => {
    const count = atom(0);
    let runCount = 0;
    let valuesDuringBatch: number[] = [];

    effect(() => {
      const val = count();
      runCount++;
      valuesDuringBatch.push(val);
    });

    expect(runCount).toBe(1);
    expect(valuesDuringBatch).toEqual([0]);

    batch(() => {
      count(1);
      expect(runCount).toBe(1); // Should not have run yet
      count(2);
      expect(runCount).toBe(1); // Still should not have run
    });

    expect(runCount).toBe(2); // Now should have run once
    expect(valuesDuringBatch).toEqual([0, 2]); // Only initial and final value
  });
});

// Run tests
runTests().catch(console.error);
