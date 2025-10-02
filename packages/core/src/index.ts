/**
 * @solidum/core - Reactive primitives and core runtime
 *
 * @packageDocumentation
 */

// Reactive primitives
export { atom } from './reactive/atom.js';
export { computed } from './reactive/computed.js';
export { effect } from './reactive/effect.js';
export { batch } from './reactive/batch.js';
export { useState, _getOrCreateComponentId, _setComponentId, _clearComponentId } from './reactive/state.js';

export type { Atom, Subscriber, Setter, Unsubscribe } from './reactive/atom.js';
export type { Computed } from './reactive/computed.js';
export type { EffectFn, Dispose } from './reactive/effect.js';

// DOM and Components
export { createElement, Fragment, render, mount, onMount, onCleanup } from './dom/index.js';

export type { VNode, ComponentFunction, JSX } from './dom/index.js';

// Note: Context, Store, and Utils have been moved to separate packages:
// - @solidum/context for Context API
// - @solidum/store for Store Pattern  
// - @solidum/utils for Component Utilities
