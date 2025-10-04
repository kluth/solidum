/**
 * effect() - Side effects primitive
 *
 * Runs a function immediately and automatically reruns when dependencies change.
 * Used for side effects like DOM updates, logging, API calls, etc.
 *
 * @example
 * ```typescript
 * const count = atom(0);
 *
 * // Runs immediately and on every count() change
 * effect(() => {
 *   console.log('Count:', count());
 * });
 *
 * count(1); // Logs: "Count: 1"
 * count(2); // Logs: "Count: 2"
 * ```
 *
 * @example With cleanup
 * ```typescript
 * const url = atom('/api/users');
 *
 * effect((onCleanup) => {
 *   const controller = new AbortController();
 *
 *   fetch(url(), { signal: controller.signal })
 *     .then(r => r.json())
 *     .then(data => console.log(data));
 *
 *   onCleanup(() => {
 *     controller.abort(); // Cancel previous request
 *   });
 * });
 * ```
 */

import type { Unsubscribe } from './atom.js';
import { setEffectTracking, type TrackingContext } from './tracking.js';

export type EffectFn = (_onCleanup: (_cleanup: () => void) => void) => void;
export type Dispose = () => void;

/**
 * Create a side effect that runs immediately and on dependency changes
 */
export function effect(fn: EffectFn): Dispose {
  let dependencyCleanups: Unsubscribe[] = [];
  let userCleanup: (() => void) | null = null;
  let isRunning = false;
  let isDisposed = false;

  /**
   * Called when any dependency changes
   */
  function rerun(): void {
    if (isDisposed || isRunning) return;

    execute();
  }

  /**
   * Execute the effect function
   */
  function execute(): void {
    if (isDisposed) return;

    // Prevent infinite loops
    if (isRunning) {
      // eslint-disable-next-line no-console
      console.error('Effect is already running, skipping rerun');
      return;
    }

    isRunning = true;

    try {
      // Call user cleanup from previous run
      if (userCleanup) {
        try {
          userCleanup();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error in effect cleanup:', error);
        }
        userCleanup = null;
      }

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

      // Set effect tracking
      setEffectTracking(context, rerun);

      try {
        // Run the effect (this will register dependencies)
        fn(cleanup => {
          userCleanup = cleanup;
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error in effect:', error);
      } finally {
        // Clear effect tracking
        setEffectTracking(null, null);
      }
    } finally {
      isRunning = false;
    }
  }

  // Run immediately
  execute();

  // Return dispose function
  return () => {
    if (isDisposed) return;

    isDisposed = true;

    // Call user cleanup
    if (userCleanup) {
      try {
        userCleanup();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error in effect cleanup:', error);
      }
    }

    // Clean up dependencies
    for (const cleanup of dependencyCleanups) {
      cleanup();
    }
    dependencyCleanups = [];
  };
}
