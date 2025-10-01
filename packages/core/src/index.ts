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

export type { Atom, Subscriber, Setter, Unsubscribe } from './reactive/atom.js';
export type { Computed } from './reactive/computed.js';
export type { EffectFn, Dispose } from './reactive/effect.js';

// DOM and Components
export { createElement, Fragment, render, mount, onMount, onCleanup } from './dom/index.js';

export type { VNode, ComponentFunction, JSX } from './dom/index.js';

// Context API
export { createContext, useContext } from './context/index.js';

export type { Context } from './context/index.js';

// Store Pattern
export { createStore } from './store/index.js';

export type { Store, StoreConfig, Action, EffectContext, Middleware } from './store/index.js';
