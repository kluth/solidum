/**
 * Virtual DOM Node and createElement() implementation
 *
 * Provides JSX-compatible virtual node creation.
 */

export type ComponentFunction<P = Record<string, unknown>> = (props: P) => VNode | null;

export interface VNode {
  type: string | ComponentFunction | typeof Fragment;
  props: Record<string, unknown>;
  children: VNode[];
  text?: string;
}

/**
 * Fragment symbol for grouping elements without a wrapper
 */
export const Fragment = Symbol('Fragment');

/**
 * Create a virtual node (JSX pragma)
 *
 * @example
 * ```typescript
 * // JSX
 * <div class="container">Hello</div>
 *
 * // Transforms to:
 * createElement('div', { class: 'container' }, 'Hello')
 * ```
 */
export function createElement(
  type: string | ComponentFunction | typeof Fragment,
  props: Record<string, unknown> | null,
  ...children: unknown[]
): VNode {
  // Normalize props
  const normalizedProps = props || {};

  // Flatten and normalize children
  const normalizedChildren = flattenChildren(children)
    .filter(child => child != null && child !== false) // Remove null, undefined, false
    .map(normalizeChild);

  return {
    type,
    props: normalizedProps,
    children: normalizedChildren,
  };
}

/**
 * Flatten nested arrays of children
 */
function flattenChildren(children: unknown[]): unknown[] {
  const result: unknown[] = [];

  for (const child of children) {
    if (Array.isArray(child)) {
      result.push(...flattenChildren(child));
    } else {
      result.push(child);
    }
  }

  return result;
}

/**
 * Normalize a child to a VNode
 */
function normalizeChild(child: unknown): VNode {
  // Already a VNode
  if (isVNode(child)) {
    return child;
  }

  // Convert primitives to text nodes
  return createTextNode(String(child));
}

/**
 * Check if value is a VNode
 */
function isVNode(value: unknown): value is VNode {
  return (
    value != null &&
    typeof value === 'object' &&
    'type' in value &&
    'props' in value &&
    'children' in value
  );
}

/**
 * Create a text node
 */
function createTextNode(text: string): VNode {
  return {
    type: 'TEXT_NODE',
    props: {},
    children: [],
    text,
  };
}

/**
 * JSX TypeScript namespace
 */
export namespace JSX {
  export interface Element extends VNode {}

  export interface IntrinsicElements {
    [elemName: string]: Record<string, unknown>;
  }

  export interface ElementChildrenAttribute {
    children: {};
  }
}
