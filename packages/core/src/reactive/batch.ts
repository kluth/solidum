/**
 * batch() - Batched updates primitive
 *
 * Batches multiple state updates into a single notification cycle.
 * Prevents unnecessary re-renders or re-computations when multiple
 * related state changes happen together.
 *
 * @example
 * ```typescript
 * const firstName = atom('John');
 * const lastName = atom('Doe');
 *
 * effect(() => {
 *   console.log(`${firstName()} ${lastName()}`);
 * });
 *
 * // Without batch: triggers effect twice
 * firstName('Jane');
 * lastName('Smith');
 *
 * // With batch: triggers effect once
 * batch(() => {
 *   firstName('Jane');
 *   lastName('Smith');
 * });
 * ```
 */

let batchDepth = 0;
let pendingNotifications = new Set<() => void>();
let notifiedSubscribers = new Set<Function>();
let isFlushing = false;

/**
 * Execute a function in a batch, deferring notifications until completion
 */
export function batch<T>(fn: () => T): T {
  batchDepth++;

  try {
    return fn();
  } finally {
    batchDepth--;

    // Only flush when we exit the outermost batch
    if (batchDepth === 0) {
      const notifications = Array.from(pendingNotifications);
      pendingNotifications.clear();
      notifiedSubscribers.clear();

      isFlushing = true;
      try {
        for (const notify of notifications) {
          try {
            notify();
          } catch (error) {
            console.error('Error in batched notification:', error);
          }
        }
      } finally {
        isFlushing = false;
        // Clear the notified subscribers set after flush
        notifiedSubscribers.clear();
      }
    }
  }
}

/**
 * Check if we're currently inside a batch
 */
export function isBatching(): boolean {
  return batchDepth > 0;
}

/**
 * Schedule a notification to run after the current batch completes
 */
export function scheduleNotification(notify: () => void): void {
  if (isBatching()) {
    pendingNotifications.add(notify);
  } else {
    // Not batching, run immediately
    notify();
  }
}

/**
 * Check if a subscriber has already been notified in the current batch flush
 * If not, mark it as notified and return true (should notify)
 */
export function shouldNotifySubscriber(subscriber: Function): boolean {
  // Only deduplicate during the flush phase of a batch
  if (!isFlushing) {
    return true;
  }

  // During flush, check if subscriber was already notified
  if (notifiedSubscribers.has(subscriber)) {
    return false; // Already notified
  }

  notifiedSubscribers.add(subscriber);
  return true;
}
