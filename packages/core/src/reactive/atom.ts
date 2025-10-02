/**
 * atom() - Writable reactive primitive
 *
 * Creates a reactive value that can be read and written.
 * Notifies subscribers when the value changes.
 *
 * @example
 * ```typescript
 * const count = atom(0);
 *
 * // Read value
 * console.log(count()); // 0
 *
 * // Write value
 * count(1);
 * console.log(count()); // 1
 *
 * // Functional update
 * count(prev => prev + 1);
 * console.log(count()); // 2
 *
 * // Subscribe to changes
 * const unsubscribe = count.subscribe((value) => {
 *   console.log('Count changed:', value);
 * });
 * ```
 */

import { scheduleNotification, shouldNotifySubscriber } from './batch.js';
import {
  getComputedCallback,
  registerComputedDependency,
  getEffectCallback,
  registerEffectDependency,
} from './tracking.js';

export type Subscriber<T> = (value: T) => void;
export type Setter<T> = T | ((prev: T) => T);
export type Unsubscribe = () => void;

export interface Atom<T> {
  (): T;
  (value: Setter<T>): void;
  subscribe(_subscriber: Subscriber<T>): Unsubscribe;
}

/**
 * Create a writable reactive atom
 */
export function atom<T>(initialValue: T): Atom<T> {
  let value = initialValue;
  const subscribers = new Set<Subscriber<T>>();

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
        // Log error but don't break other subscribers
        console.error('Error in atom subscriber:', error);
      }
    }
  }

  function atomFn(): T;
  function atomFn(newValue: Setter<T>): void;
  function atomFn(newValue?: Setter<T>): T | void {
    // Read
    if (arguments.length === 0) {
      // Register with computed callback if tracking (takes precedence over effect)
      const computedCallback = getComputedCallback();
      if (computedCallback) {
        const unsubscribe = atomFn.subscribe(computedCallback);
        registerComputedDependency(unsubscribe);
      } else {
        // Only register with effect if not inside a computed
        const effectCallback = getEffectCallback();
        if (effectCallback) {
          const unsubscribe = atomFn.subscribe(effectCallback);
          registerEffectDependency(unsubscribe);
        }
      }

      return value;
    }

    // Write
    const nextValue =
      typeof newValue === 'function' ? (newValue as (prev: T) => T)(value) : newValue;

    // Skip notification if value hasn't changed
    if (Object.is(nextValue, value)) {
      return;
    }

    value = nextValue as T;

    // Schedule notifications (respects batching)
    // Use stable function reference for proper deduplication
    scheduleNotification(notifyAllSubscribers);
  }

  atomFn.subscribe = (subscriber: Subscriber<T>): Unsubscribe => {
    subscribers.add(subscriber);

    return () => {
      subscribers.delete(subscriber);
    };
  };

  return atomFn as Atom<T>;
}
