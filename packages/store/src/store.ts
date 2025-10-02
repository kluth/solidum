/**
 * Store Pattern for State Management
 *
 * Centralized state management for complex applications
 */

/* eslint-disable no-unused-vars */
import { atom } from '@solidum/core';
import { computed } from '@solidum/core';
import { batch as batchFn } from '@solidum/core';
import type { Computed } from '@solidum/core';

/**
 * Store configuration
 */
export interface StoreConfig<State, Actions, Getters, Effects> {
  state: State;
  actions?: Actions;
  getters?: Getters;
  effects?: Effects;
  middleware?: Middleware<State> | Middleware<State>[];
}

/**
 * Action function type
 */
export type Action<State, Payload = void> = Payload extends void
  ? // eslint-disable-next-line no-unused-vars
    (_state: State) => State
  : // eslint-disable-next-line no-unused-vars
    (_state: State, _payload: Payload) => State;

/**
 * Effect context
 */
export interface EffectContext<State> {
  // eslint-disable-next-line no-unused-vars
  dispatch: <K extends string>(_action: K, ..._args: unknown[]) => void;
  getState: () => State;
}

/**
 * Middleware function type
 */
export type Middleware<State> = // eslint-disable-next-line no-unused-vars
  (_store: { getState: () => State }) => (
    // eslint-disable-next-line no-unused-vars
    _next: (_action: string, _payload?: unknown) => void
  ) => // eslint-disable-next-line no-unused-vars
  (_action: string, _payload?: unknown) => void;

/**
 * Store interface
 */
export interface Store<State, Actions, Getters, Effects> {
  getState: () => State;
  // eslint-disable-next-line no-unused-vars
  select: <Result>(_selector: (_state: State) => Result) => Computed<Result>;
  dispatch: <K extends keyof Actions>(
    // eslint-disable-next-line no-unused-vars
    _action: K,
    // eslint-disable-next-line no-unused-vars
    ...args: Actions[K] extends Action<State, infer P> ? (P extends void ? [] : [P]) : never
  ) => void;
  // eslint-disable-next-line no-unused-vars
  batch: (fn: () => void) => void;
  getters: {
    [K in keyof Getters]: Getters[K] extends (_state: State) => infer R // eslint-disable-next-line no-unused-vars
      ? // eslint-disable-next-line no-unused-vars
        (_state: State) => R
      : never;
  };
  effects: {
    [K in keyof Effects]: Effects[K] extends (_ctx: EffectContext<State>) => infer R // eslint-disable-next-line no-unused-vars
      ? () => R
      : never;
  };
}

/**
 * Create a new store
 *
 * @example
 * ```typescript
 * const store = createStore({
 *   state: { count: 0 },
 *   actions: {
 *     increment(state) {
 *       return { ...state, count: state.count + 1 };
 *     }
 *   },
 *   getters: {
 *     doubled(state) {
 *       return state.count * 2;
 *     }
 *   }
 * });
 *
 * store.dispatch('increment');
 * const doubled = store.select(state => store.getters.doubled(state));
 * ```
 */
export function createStore<State, Actions = {}, Getters = {}, Effects = {}>(
  config: StoreConfig<State, Actions, Getters, Effects>
): Store<State, Actions, Getters, Effects> {
  // Create reactive state atom
  const stateAtom = atom<State>(config.state);

  // Build middleware chain
  let dispatchFn = (action: string, payload?: unknown) => {
    executeAction(action, payload);
  };

  if (config.middleware) {
    const middlewares = Array.isArray(config.middleware) ? config.middleware : [config.middleware];
    for (let i = middlewares.length - 1; i >= 0; i--) {
      const middleware = middlewares[i];
      dispatchFn = middleware({ getState })(dispatchFn);
    }
  }

  /**
   * Get current state
   */
  function getState(): State {
    return stateAtom();
  }

  /**
   * Execute an action
   */
  function executeAction(action: string, payload?: unknown): void {
    const actions = config.actions as Record<string, Function>;

    if (!actions || !(action in actions)) {
      throw new Error(`Unknown action: ${action}`);
    }

    const actionFn = actions[action];
    const currentState = getState();

    // Call action and update state
    const newState =
      payload === undefined ? actionFn(currentState) : actionFn(currentState, payload);

    stateAtom(newState);
  }

  /**
   * Dispatch an action
   */
  function dispatch(action: string, payload?: unknown): void {
    dispatchFn(action, payload);
  }

  /**
   * Select a reactive slice of state
   */
  // eslint-disable-next-line no-unused-vars
  function select<Result>(_selector: (_state: State) => Result): Computed<Result> {
    return computed(() => _selector(stateAtom()));
  }

  /**
   * Batch multiple updates
   */
  function batch(fn: () => void): void {
    batchFn(fn);
  }

  /**
   * Build effects object
   */
  const effects = {} as {
    [K in keyof Effects]: Effects[K] extends (_ctx: EffectContext<State>) => infer R // eslint-disable-next-line no-unused-vars
      ? () => R
      : never;
  };
  if (config.effects) {
    const effectsConfig = config.effects as Record<string, Function>;
    for (const key in effectsConfig) {
      (effects as Record<string, Function>)[key] = (...args: unknown[]) => {
        const ctx: EffectContext<State> = {
          dispatch,
          getState,
        };
        return effectsConfig[key](ctx, ...args);
      };
    }
  }

  return {
    getState,
    select,
    dispatch: dispatch as <K extends keyof Actions>(
      // eslint-disable-next-line no-unused-vars
      _action: K,
      // eslint-disable-next-line no-unused-vars
      ..._args: Actions[K] extends Action<State, infer P> ? (P extends void ? [] : [P]) : never
    ) => void,
    batch,
    getters: (config.getters || {}) as {
      [K in keyof Getters]: Getters[K] extends (_state: State) => infer R // eslint-disable-next-line no-unused-vars
        ? // eslint-disable-next-line no-unused-vars
          (_state: State) => R
        : never;
    },
    effects,
  };
}
