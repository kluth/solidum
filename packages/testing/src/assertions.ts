/**
 * Solidum Assertions - Fluent assertion API
 */

export class AssertionError extends Error {
  constructor(
    message: string,
    public actual: unknown,
    public expected: unknown
  ) {
    super(message);
    this.name = 'AssertionError';
  }
}

export interface Matchers<T> {
  toBe(expected: T): void;
  toEqual(expected: T): void;
  toBeNull(): void;
  toBeUndefined(): void;
  toBeDefined(): void;
  toBeTruthy(): void;
  toBeFalsy(): void;
  toBeGreaterThan(expected: number): void;
  toBeLessThan(expected: number): void;
  toContain(expected: unknown): void;
  toHaveLength(expected: number): void;
  toThrow(expected?: string | RegExp): void;
}

export interface NotMatchers<T> {
  toBe(expected: T): void;
  toEqual(expected: T): void;
  toBeNull(): void;
  toBeUndefined(): void;
}

export interface Expectation<T> extends Matchers<T> {
  not: NotMatchers<T>;
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return false;

  const aKeys = Object.keys(a as object);
  const bKeys = Object.keys(b as object);

  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if (!bKeys.includes(key)) return false;
    if (!deepEqual((a as any)[key], (b as any)[key])) return false;
  }

  return true;
}

export function expect<T>(actual: T): Expectation<T> {
  const matchers: Matchers<T> = {
    toBe(expected: T): void {
      if (actual !== expected) {
        throw new AssertionError(
          `Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`,
          actual,
          expected
        );
      }
    },

    toEqual(expected: T): void {
      if (!deepEqual(actual, expected)) {
        throw new AssertionError(
          `Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`,
          actual,
          expected
        );
      }
    },

    toBeNull(): void {
      if (actual !== null) {
        throw new AssertionError(`Expected ${JSON.stringify(actual)} to be null`, actual, null);
      }
    },

    toBeUndefined(): void {
      if (actual !== undefined) {
        throw new AssertionError(
          `Expected ${JSON.stringify(actual)} to be undefined`,
          actual,
          undefined
        );
      }
    },

    toBeDefined(): void {
      if (actual === undefined) {
        throw new AssertionError('Expected value to be defined', actual, 'defined');
      }
    },

    toBeTruthy(): void {
      if (!actual) {
        throw new AssertionError(`Expected ${JSON.stringify(actual)} to be truthy`, actual, true);
      }
    },

    toBeFalsy(): void {
      if (actual) {
        throw new AssertionError(`Expected ${JSON.stringify(actual)} to be falsy`, actual, false);
      }
    },

    toBeGreaterThan(expected: number): void {
      if (typeof actual !== 'number' || actual <= expected) {
        throw new AssertionError(
          `Expected ${actual} to be greater than ${expected}`,
          actual,
          expected
        );
      }
    },

    toBeLessThan(expected: number): void {
      if (typeof actual !== 'number' || actual >= expected) {
        throw new AssertionError(
          `Expected ${actual} to be less than ${expected}`,
          actual,
          expected
        );
      }
    },

    toContain(expected: unknown): void {
      if (Array.isArray(actual)) {
        if (!actual.includes(expected as any)) {
          throw new AssertionError(
            `Expected array to contain ${JSON.stringify(expected)}`,
            actual,
            expected
          );
        }
      } else if (typeof actual === 'string' && typeof expected === 'string') {
        if (!actual.includes(expected)) {
          throw new AssertionError(`Expected string to contain "${expected}"`, actual, expected);
        }
      } else {
        throw new AssertionError(
          'toContain() works only with arrays and strings',
          actual,
          expected
        );
      }
    },

    toHaveLength(expected: number): void {
      const length = (actual as any)?.length;
      if (length !== expected) {
        throw new AssertionError(
          `Expected length to be ${expected}, got ${length}`,
          length,
          expected
        );
      }
    },

    toThrow(expected?: string | RegExp): void {
      if (typeof actual !== 'function') {
        throw new AssertionError('toThrow() expects a function', actual, 'function');
      }

      try {
        (actual as any)();
        throw new AssertionError('Expected function to throw', undefined, 'error');
      } catch (error) {
        if (expected) {
          const message = (error as Error).message;
          if (typeof expected === 'string') {
            if (!message.includes(expected)) {
              throw new AssertionError(
                `Expected error message to include "${expected}", got "${message}"`,
                message,
                expected
              );
            }
          } else if (expected instanceof RegExp) {
            if (!expected.test(message)) {
              throw new AssertionError(
                `Expected error message to match ${expected}, got "${message}"`,
                message,
                expected
              );
            }
          }
        }
      }
    },
  };

  const notMatchers: NotMatchers<T> = {
    toBe(expected: T): void {
      if (actual === expected) {
        throw new AssertionError(
          `Expected ${JSON.stringify(actual)} not to be ${JSON.stringify(expected)}`,
          actual,
          expected
        );
      }
    },

    toEqual(expected: T): void {
      if (deepEqual(actual, expected)) {
        throw new AssertionError(
          `Expected ${JSON.stringify(actual)} not to equal ${JSON.stringify(expected)}`,
          actual,
          expected
        );
      }
    },

    toBeNull(): void {
      if (actual === null) {
        throw new AssertionError('Expected value not to be null', actual, 'not null');
      }
    },

    toBeUndefined(): void {
      if (actual === undefined) {
        throw new AssertionError('Expected value not to be undefined', actual, 'not undefined');
      }
    },
  };

  return {
    ...matchers,
    not: notMatchers,
  };
}
