/**
 * Reactive Tracking System
 *
 * Central tracking for computed and effect dependency tracking.
 * Avoids circular dependencies between modules.
 */

import type { Unsubscribe } from './atom.js';

// Tracking context for computed
export interface TrackingContext {
  // eslint-disable-next-line no-unused-vars
  onDependency: (_unsubscribe: Unsubscribe) => void;
}

let computedContext: TrackingContext | null = null;
let computedCallback: (() => void) | null = null;

let effectContext: TrackingContext | null = null;
let effectCallback: (() => void) | null = null;

// ===== Computed Tracking =====

export function getComputedContext(): TrackingContext | null {
  return computedContext;
}

export function getComputedCallback(): (() => void) | null {
  return computedCallback;
}

export function setComputedTracking(
  context: TrackingContext | null,
  callback: (() => void) | null
): void {
  computedContext = context;
  computedCallback = callback;
}

export function registerComputedDependency(unsubscribe: Unsubscribe): void {
  computedContext?.onDependency(unsubscribe);
}

// ===== Effect Tracking =====

export function getEffectContext(): TrackingContext | null {
  return effectContext;
}

export function getEffectCallback(): (() => void) | null {
  return effectCallback;
}

export function setEffectTracking(
  context: TrackingContext | null,
  callback: (() => void) | null
): void {
  effectContext = context;
  effectCallback = callback;
}

export function registerEffectDependency(unsubscribe: Unsubscribe): void {
  effectContext?.onDependency(unsubscribe);
}
