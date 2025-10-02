/**
 * Component Mounting and Lifecycle
 *
 * Integrates reactive primitives with DOM rendering
 */

import { effect } from '../reactive/effect.js';

import { render } from './render.js';
import type { VNode } from './vnode.js';

/**
 * Current component context (for lifecycle hooks and context API)
 */
let currentContext: ComponentContext | null = null;

interface ComponentContext {
  onMountCallbacks: Array<() => void>;
  onCleanupCallbacks: Array<() => void>;
}

/**
 * Get current component context
 * @internal
 */
export function getCurrentContext(): ComponentContext | null {
  return currentContext;
}

/**
 * Mount a component to a DOM container with reactive updates
 *
 * @param container - DOM element to mount into
 * @param rootComponent - Function that returns the root VNode
 * @param document - Document object (defaults to window.document)
 * @returns Dispose function to unmount
 */
export function mount(
  container: Element,
  rootComponent: () => VNode | null,
  document: Document = window.document
): () => void {
  let currentDom: Node | null = null;

  // Create effect for reactive rendering
  const dispose = effect(onCleanup => {
    // Create component context
    const context: ComponentContext = {
      onMountCallbacks: [],
      onCleanupCallbacks: [],
    };

    currentContext = context;

    try {
      // Render the component
      const vnode = rootComponent();

      if (vnode) {
        const newDom = render(vnode, document);

        // Replace old DOM with new DOM
        if (currentDom) {
          container.removeChild(currentDom);
        }
        container.appendChild(newDom);
        currentDom = newDom;

        // Call onMount hooks after DOM is attached
        for (const callback of context.onMountCallbacks) {
          callback();
        }
      }

      // Register cleanup callbacks
      onCleanup(() => {
        // Call component cleanup hooks
        for (const callback of context.onCleanupCallbacks) {
          callback();
        }

        // Remove DOM
        if (currentDom) {
          container.removeChild(currentDom);
          currentDom = null;
        }
      });
    } finally {
      currentContext = null;
    }
  });

  return dispose;
}

/**
 * Register a callback to run after component mounts to DOM
 *
 * Must be called during component render
 */
export function onMount(callback: () => void): void {
  if (!currentContext) {
    throw new Error('onMount() can only be called during component render');
  }

  currentContext.onMountCallbacks.push(callback);
}

/**
 * Register a callback to run before component unmounts
 *
 * Must be called during component render
 */
export function onCleanup(callback: () => void): void {
  if (!currentContext) {
    throw new Error('onCleanup() can only be called during component render');
  }

  currentContext.onCleanupCallbacks.push(callback);
}
