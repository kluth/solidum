/**
 * Component Utilities
 *
 * Helper functions for building component libraries
 */

/**
 * Props type
 */
export type Props = Record<string, any>;

/**
 * Class value type for cn() function
 */
export type ClassValue = string | number | boolean | null | undefined | ClassArray | ClassObject;
type ClassArray = ClassValue[];
type ClassObject = Record<string, any>;

/**
 * Merge multiple props objects intelligently
 *
 * - Regular props: last value wins
 * - className/class: concatenated
 * - style: merged objects
 * - Event handlers: chained
 *
 * @example
 * ```typescript
 * const merged = mergeProps(
 *   { className: 'foo', onClick: handler1 },
 *   { className: 'bar', onClick: handler2 }
 * );
 * // { className: 'foo bar', onClick: [Function] }
 * ```
 */
export function mergeProps(...sources: Props[]): Props {
  const result: Props = {};

  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      // Skip null and undefined values
      if (value == null) continue;

      // Merge className or class
      if (key === 'className' || key === 'class') {
        if (result[key]) {
          result[key] = `${result[key]} ${value}`;
        } else {
          result[key] = value;
        }
      }
      // Merge style objects
      else if (key === 'style' && typeof value === 'object' && typeof result[key] === 'object') {
        result[key] = { ...result[key], ...value };
      }
      // Chain event handlers
      else if (key.startsWith('on') && typeof value === 'function') {
        if (typeof result[key] === 'function') {
          const existingHandler = result[key];
          result[key] = (...args: any[]) => {
            existingHandler(...args);
            value(...args);
          };
        } else {
          result[key] = value;
        }
      }
      // Regular props - last value wins
      else {
        result[key] = value;
      }
    }
  }

  return result;
}

/**
 * Flatten class values recursively
 */
function flattenClassValue(value: ClassValue): string[] {
  if (value == null || value === false || value === '') {
    return [];
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return [String(value)];
  }

  if (Array.isArray(value)) {
    const result: string[] = [];
    for (const item of value) {
      result.push(...flattenClassValue(item));
    }
    return result;
  }

  if (typeof value === 'object') {
    const result: string[] = [];
    for (const [key, val] of Object.entries(value)) {
      if (val) {
        result.push(key);
      }
    }
    return result;
  }

  return [];
}

/**
 * Concatenate class names conditionally
 *
 * Supports:
 * - Strings
 * - Numbers
 * - Objects with boolean values
 * - Arrays (nested)
 * - Falsy values (filtered out)
 *
 * @example
 * ```typescript
 * cn('foo', 'bar'); // 'foo bar'
 * cn('foo', { bar: true, baz: false }); // 'foo bar'
 * cn('foo', null, 'bar'); // 'foo bar'
 * cn(['foo', 'bar'], 'baz'); // 'foo bar baz'
 * ```
 */
export function cn(...classes: ClassValue[]): string {
  const result: string[] = [];

  for (const value of classes) {
    result.push(...flattenClassValue(value));
  }

  return result.join(' ');
}
