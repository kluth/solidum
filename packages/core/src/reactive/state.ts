/**
 * Component State Management
 *
 * Provides useState hook for component-local state that persists across re-renders
 */

import { atom, Atom } from './atom.js';

/**
 * State cache to persist state across component re-renders
 * Key: unique component instance ID
 * Value: array of state atoms for that component
 */
const stateCache = new Map<string, unknown[]>();

// Counter for generating unique component IDs
let componentIdCounter = 0;

// Map component function + instance to unique ID
const componentInstanceMap = new WeakMap<Function, Map<number, string>>();
const instanceCounters = new WeakMap<Function, number>();

let currentComponentId: string | null = null;
let currentStateIndex = 0;

/**
 * Get or create a unique ID for a component instance
 * @internal
 */
export function _getOrCreateComponentId(componentFn: Function, props: unknown): string {
  // Try to find a stable ID based on component function and props
  // For now, use a simple counter-based approach
  let instances = componentInstanceMap.get(componentFn);
  if (!instances) {
    instances = new Map();
    componentInstanceMap.set(componentFn, instances);
    instanceCounters.set(componentFn, 0);
  }

  // Use a hash of props as instance key (simplified)
  const propsKey = JSON.stringify(props || {});
  const hash = propsKey.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, 0);

  let id = instances.get(hash);
  if (!id) {
    id = `${componentFn.name || 'Anonymous'}_${componentIdCounter++}`;
    instances.set(hash, id);
  }

  return id;
}

/**
 * Set the current component context for useState
 * @internal
 */
export function _setComponentId(id: string): void {
  currentComponentId = id;
  currentStateIndex = 0;
}

/**
 * Clear the current component context
 * @internal
 */
export function _clearComponentId(): void {
  currentComponentId = null;
  currentStateIndex = 0;
}

/**
 * Hook for component-local state that persists across re-renders
 *
 * Similar to React's useState, but returns an atom instead of [value, setter]
 *
 * @param initialValue - Initial state value
 * @returns Atom containing the state
 *
 * @example
 * ```ts
 * function Counter() {
 *   const count = useState(0);
 *
 *   return createElement('button',
 *     { onClick: () => count(count() + 1) },
 *     `Count: ${count()}`
 *   );
 * }
 * ```
 */
export function useState<T>(initialValue: T | (() => T)): Atom<T> {
  if (!currentComponentId) {
    // Fallback: create a new atom (won't persist, but won't crash)
    console.warn('useState called outside component context - state will not persist');
    return atom(typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue);
  }

  // Get or create state cache for this component instance
  let states = stateCache.get(currentComponentId);
  if (!states) {
    states = [];
    stateCache.set(currentComponentId, states);
  }

  // Get or create state at current index
  const index = currentStateIndex++;
  if (index >= states.length) {
    // Create new state atom
    const value = typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
    states.push(atom(value));
  }

  return states[index] as Atom<T>;
}
