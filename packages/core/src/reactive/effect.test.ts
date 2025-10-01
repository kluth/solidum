/**
 * TDD Tests for effect() - Side effects primitive
 *
 * Tests written FIRST before implementation!
 */

import { describe, test, expect, runTests } from '@solidum/testing';
import { atom } from './atom.js';
import { computed } from './computed.js';
import { effect } from './effect.js';

describe('effect()', () => {
  test('should run immediately', () => {
    let ran = false;

    effect(() => {
      ran = true;
    });

    expect(ran).toBe(true);
  });

  test('should rerun when dependency changes', () => {
    const count = atom(0);
    let effectCount = 0;

    effect(() => {
      count(); // Read dependency
      effectCount++;
    });

    expect(effectCount).toBe(1); // Ran once initially

    count(1);
    expect(effectCount).toBe(2); // Ran again

    count(2);
    expect(effectCount).toBe(3);
  });

  test('should track multiple dependencies', () => {
    const a = atom(1);
    const b = atom(2);
    let sum = 0;

    effect(() => {
      sum = a() + b();
    });

    expect(sum).toBe(3);

    a(5);
    expect(sum).toBe(7); // 5 + 2

    b(10);
    expect(sum).toBe(15); // 5 + 10
  });

  test('should work with computed', () => {
    const count = atom(5);
    const doubled = computed(() => count() * 2);
    let effectValue = 0;

    effect(() => {
      effectValue = doubled();
    });

    expect(effectValue).toBe(10);

    count(10);
    expect(effectValue).toBe(20);
  });

  test('should return cleanup function', () => {
    const count = atom(0);
    let effectCount = 0;

    const dispose = effect(() => {
      count();
      effectCount++;
    });

    expect(effectCount).toBe(1);

    count(1);
    expect(effectCount).toBe(2);

    dispose(); // Stop tracking

    count(2);
    expect(effectCount).toBe(2); // Should NOT increase
  });

  test('should support conditional dependencies', () => {
    const showDetails = atom(false);
    const name = atom('Alice');
    let effectValue = '';

    effect(() => {
      if (showDetails()) {
        effectValue = name();
      } else {
        effectValue = 'hidden';
      }
    });

    expect(effectValue).toBe('hidden');

    // Changing name should NOT trigger effect (not tracking it yet)
    name('Bob');
    expect(effectValue).toBe('hidden');

    // Enable details
    showDetails(true);
    expect(effectValue).toBe('Bob'); // Now tracking name

    // Now name changes should trigger
    name('Charlie');
    expect(effectValue).toBe('Charlie');
  });

  test('should support cleanup callback', () => {
    const count = atom(0);
    let cleanupCount = 0;

    effect((onCleanup) => {
      count(); // Track dependency

      onCleanup(() => {
        cleanupCount++;
      });
    });

    count(1); // Should call cleanup before rerunning
    expect(cleanupCount).toBe(1);

    count(2);
    expect(cleanupCount).toBe(2);
  });

  test('should handle errors gracefully', () => {
    const count = atom(0);
    let ran = false;

    effect(() => {
      if (count() > 0) {
        throw new Error('Test error');
      }
      ran = true;
    });

    expect(ran).toBe(true);

    // Should not crash when error is thrown
    count(1);

    // Effect should still exist
    count(0);
    ran = false;
    count(0); // Trigger again
    // No-op since value didn't change
  });

  test('should not create infinite loops', () => {
    const count = atom(0);
    let runCount = 0;

    effect(() => {
      runCount++;
      if (runCount > 10) {
        throw new Error('Infinite loop detected');
      }
      count(); // Read
      // Do NOT write to count here
    });

    expect(runCount).toBe(1);

    count(1);
    expect(runCount).toBe(2);
  });
});

// Run tests
runTests().catch(console.error);
