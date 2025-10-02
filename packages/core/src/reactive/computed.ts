/**
 * computed() - Read-only derived reactive primitive
 *
 * Creates a reactive value that automatically derives from other reactives.
 * Features lazy evaluation, caching, and automatic dependency tracking.
 *
 * @example
 * ```typescript
 * const count = atom(5);
 * const doubled = computed(() => count() * 2);
 *
 * console.log(doubled()); // 10
 *
 * count(10);
 * console.log(doubled()); // 20
 *
 * // Subscribe to changes
 * doubled.subscribe((value) => {
 *   console.log('Doubled:', value);
 * });
 * ```
 */

import type { Subscriber, Unsubscribe } from './atom.js';
import { scheduleNotification, shouldNotifySubscriber } from './batch.js';
import {
  setComputedTracking,
  getComputedCallback,
  registerComputedDependency,
  getEffectCallback,
  registerEffectDependency,
  type TrackingContext,
} from './tracking.js';

export interface Computed<T> {
  (): T;
  subscribe(subscriber: Subscriber<T>): Unsubscribe;
}

type ComputeFn<T> = () => T;

/**
 * Create a read-only computed value
 */
export function computed<T>(fn: ComputeFn<T>): Computed<T> {
  let value: T;
  let dirty = true;
  let isComputing = false; // Guard against reentry
  const subscribers = new Set<Subscriber<T>>();
  let dependencyCleanups: Unsubscribe[] = [];

  /**
   * Stable notification function for batch deduplication
   */
  function notifyAllSubscribers(): void {
    // Make a copy to avoid issues if subscribers modify the set during iteration
    const subscribersToNotify = Array.from(subscribers);
    for (const subscriber of subscribersToNotify) {
      // Deduplicate subscriber notifications during batch flush
      if (!shouldNotifySubscriber(subscriber)) {
        continue;
      }

      try {
        subscriber(value);
      } catch (error) {
        console.error('Error in computed subscriber:', error);
      }
    }
  }

  /**
   * Called when any dependency changes
   */
  function onDependencyChange(): void {
    if (dirty || isComputing) return; // Already dirty or computing

    // Check if we have subscribers that need to be notified
    if (subscribers.size > 0) {
      // We have subscribers, so we need to recompute to check if value changed
      const oldValue = value;
      dirty = true;
      const newValue = compute();

      if (!Object.is(oldValue, newValue)) {
        // Value changed, schedule notifications (respects batching)
        scheduleNotification(notifyAllSubscribers);
      }
    } else {
      // No subscribers, just mark dirty (lazy evaluation)
      dirty = true;
    }
  }

  /**
   * Compute the value by running the function and tracking dependencies
   */
  function compute(): T {
    if (isComputing) {
      throw new Error('Circular dependency detected in computed()');
    }

    isComputing = true;

    try {
      // Clean up old dependencies
      for (const cleanup of dependencyCleanups) {
        cleanup();
      }
      dependencyCleanups = [];

      // Set up tracking context
      const context: TrackingContext = {
        onDependency: unsubscribe => {
          dependencyCleanups.push(unsubscribe);
        },
      };

      // Store previous tracking state
      const prevCallback = getComputedCallback();

      // Set new tracking
      setComputedTracking(context, onDependencyChange);

      try {
        // Run the computation (this will trigger dependency registration)
        value = fn();
        dirty = false;
        return value;
      } finally {
        // Restore previous context
        setComputedTracking(null, prevCallback);
      }
    } finally {
      isComputing = false;
    }
  }

  /**
   * The computed function - reads the current value
   */
  function computedFn(): T {
    // Register with computed callback if tracking (and not self) - takes precedence
    const computedCallback = getComputedCallback();
    if (computedCallback && computedCallback !== onDependencyChange) {
      const unsubscribe = computedFn.subscribe(computedCallback);
      registerComputedDependency(unsubscribe);
    } else if (computedCallback !== onDependencyChange) {
      // Only register with effect if not inside a computed
      const effectCallback = getEffectCallback();
      if (effectCallback) {
        const unsubscribe = computedFn.subscribe(effectCallback);
        registerEffectDependency(unsubscribe);
      }
    }

    // Compute if dirty
    if (dirty) {
      compute();
    }

    return value;
  }

  /**
   * Subscribe to value changes
   */
  computedFn.subscribe = (subscriber: Subscriber<T>): Unsubscribe => {
    // If this is the first subscriber and computed hasn't been evaluated yet, evaluate it
    if (subscribers.size === 0 && dirty) {
      compute();
    }

    subscribers.add(subscriber);

    return () => {
      subscribers.delete(subscriber);
    };
  };

  return computedFn as Computed<T>;
}
