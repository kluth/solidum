/**
 * @solidum/testing - TDD-First Testing Framework
 *
 * @example
 * ```typescript
 * import { describe, test, expect } from '@solidum/testing';
 *
 * describe('My Feature', () => {
 *   test('should work', () => {
 *     expect(1 + 1).toBe(2);
 *   });
 * });
 * ```
 */

export { describe, test, it, runTests, registry } from './test-runner.js';
export { expect } from './assertions.js';
export type { TestContext, TestResult, SuiteResult } from './test-runner.js';
export type { Expectation, Matchers } from './assertions.js';

// DOM Testing Utilities
export {
  createDOMEnvironment,
  DOMQueries,
  DOMEvents,
  DOMWait,
  DOMAssertions,
  UserInteraction,
  Screen,
  screen,
  render,
  within,
} from './dom-testing.js';
export type { DOMTestEnvironment, QueryOptions, RenderResult } from './dom-testing.js';
