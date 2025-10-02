/**
 * Context API for Dependency Injection
 *
 * Provides a way to pass data through the component tree
 * without having to pass props down manually at every level.
 */

import type { ComponentFunction } from '@solidum/core';
import { createElement, Fragment } from '@solidum/core';

/**
 * Context object
 */
export interface Context<T> {
  id: symbol;
  defaultValue: T | undefined;
  Provider: ComponentFunction<{ value: T; children?: any }>;
}

/**
 * Context value stack (per render tree)
 */
interface ContextEntry {
  id: symbol;
  value: any;
}

let contextStack: ContextEntry[] = [];

/**
 * Create a new context
 *
 * @example
 * ```typescript
 * const ThemeContext = createContext<Theme>();
 *
 * function App() {
 *   return (
 *     <ThemeContext.Provider value={theme}>
 *       <Button />
 *     </ThemeContext.Provider>
 *   );
 * }
 * ```
 */
export function createContext<T>(defaultValue?: T): Context<T> {
  const id = Symbol('context');

  const Provider: ComponentFunction<{ value: T; children?: unknown }> = (props) => {
    // Render children
    const children = Array.isArray(props.children)
      ? props.children
      : props.children
      ? [props.children]
      : [];

    // Return fragment with children and context metadata
    const vnode = createElement(Fragment, null, ...children);
    // Attach context info to vnode for render phase
    (vnode as any).__contextId = id;
    (vnode as any).__contextValue = props.value;

    return vnode;
  };

  return {
    id,
    defaultValue,
    Provider,
  };
}

// Track if we're inside a render call
let renderDepth = 0;

/**
 * Mark that we're entering render
 * @internal
 */
export function enterRender(): void {
  renderDepth++;
}

/**
 * Mark that we're exiting render
 * @internal
 */
export function exitRender(): void {
  renderDepth--;
}

/**
 * Consume a context value
 *
 * Must be called during component render
 *
 * @example
 * ```typescript
 * function Button() {
 *   const theme = useContext(ThemeContext);
 *   return <button style={theme.buttonStyle}>Click</button>;
 * }
 * ```
 */
export function useContext<T>(context: Context<T>): T {
  // Check if we're in a render context
  if (renderDepth === 0) {
    throw new Error('useContext() can only be called during component render');
  }

  // Search for context value in stack (from top to bottom)
  for (let i = contextStack.length - 1; i >= 0; i--) {
    if (contextStack[i].id === context.id) {
      return contextStack[i].value;
    }
  }

  // Not found, use default value
  if (context.defaultValue !== undefined) {
    return context.defaultValue;
  }

  throw new Error('Context value not found and no default value provided');
}

/**
 * Push context value onto stack
 * @internal
 */
export function pushContext(id: symbol, value: any): void {
  contextStack.push({ id, value });
}

/**
 * Pop context value from stack
 * @internal
 */
export function popContext(): void {
  contextStack.pop();
}
