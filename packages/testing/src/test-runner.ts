/**
 * Solidum Test Runner - TDD-First Testing Framework
 *
 * Features:
 * - Zero config
 * - Fast execution
 * - Beautiful output
 * - Auto-watch mode
 * - Parallel execution
 */

import { EventEmitter } from 'node:events';

import pc from 'picocolors';

export interface TestContext {
  skip: () => void;
  only: () => void;
}

export interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: Error;
}

export interface SuiteResult {
  name: string;
  tests: TestResult[];
  passed: boolean;
  duration: number;
}

// eslint-disable-next-line no-unused-vars
type TestFn = (_ctx: TestContext) => void | Promise<void>;
type SuiteFn = () => void | Promise<void>;

class TestRegistry extends EventEmitter {
  private suites: Map<string, TestFn[]> = new Map();
  private currentSuite: string | null = null;
  private onlyTests: Set<string> = new Set();
  private skippedTests: Set<string> = new Set();

  describe(name: string, fn: SuiteFn): void {
    this.currentSuite = name;
    this.suites.set(name, []);
    fn();
    this.currentSuite = null;
  }

  test(_name: string, fn: TestFn): void {
    if (!this.currentSuite) {
      throw new Error('test() must be called inside describe()');
    }

    const tests = this.suites.get(this.currentSuite);
    if (!tests) {
      throw new Error(`Suite "${this.currentSuite}" not found`);
    }

    tests.push(fn);
  }

  async run(): Promise<SuiteResult[]> {
    const results: SuiteResult[] = [];

    for (const [suiteName, tests] of this.suites) {
      const suiteStart = performance.now();
      const testResults: TestResult[] = [];

      for (let i = 0; i < tests.length; i++) {
        const testFn = tests[i];
        const testName = `test ${i + 1}`;
        const testStart = performance.now();

        const ctx: TestContext = {
          skip: () => this.skippedTests.add(testName),
          only: () => this.onlyTests.add(testName),
        };

        try {
          await testFn(ctx);
          const duration = performance.now() - testStart;

          testResults.push({
            name: testName,
            passed: true,
            duration,
          });

          this.emit('test:pass', { suite: suiteName, test: testName, duration });
        } catch (error) {
          const duration = performance.now() - testStart;

          testResults.push({
            name: testName,
            passed: false,
            duration,
            error: error as Error,
          });

          this.emit('test:fail', {
            suite: suiteName,
            test: testName,
            duration,
            error,
          });
        }
      }

      const suiteDuration = performance.now() - suiteStart;
      const passed = testResults.every(t => t.passed);

      results.push({
        name: suiteName,
        tests: testResults,
        passed,
        duration: suiteDuration,
      });

      this.emit('suite:complete', { name: suiteName, passed, duration: suiteDuration });
    }

    return results;
  }

  clear(): void {
    this.suites.clear();
    this.currentSuite = null;
    this.onlyTests.clear();
    this.skippedTests.clear();
  }
}

export const registry = new TestRegistry();

// Global test functions
export function describe(name: string, fn: SuiteFn): void {
  registry.describe(name, fn);
}

export function test(name: string, fn: TestFn): void {
  registry.test(name, fn);
}

export const it = test;

// Reporter
export class ConsoleReporter {
  private passed = 0;
  private failed = 0;
  private totalDuration = 0;

  // eslint-disable-next-line no-unused-vars
  constructor(private _registry: TestRegistry) {
    this._registry.on('test:pass', this.onTestPass.bind(this));
    this._registry.on('test:fail', this.onTestFail.bind(this));
    this._registry.on('suite:complete', this.onSuiteComplete.bind(this));
  }

  private onTestPass(data: { suite: string; test: string; duration: number }): void {
    this.passed++;
    // eslint-disable-next-line no-console
    console.log(`  ${pc.green('✓')} ${data.test} ${pc.dim(`(${data.duration.toFixed(2)}ms)`)}`);
  }

  private onTestFail(data: { suite: string; test: string; duration: number; error: Error }): void {
    this.failed++;
    // eslint-disable-next-line no-console
    console.log(`  ${pc.red('✗')} ${data.test}`);
    // eslint-disable-next-line no-console
    console.log(`    ${pc.red(data.error.message)}`);
    if (data.error.stack) {
      // eslint-disable-next-line no-console
      console.log(pc.dim(data.error.stack.split('\n').slice(1).join('\n')));
    }
  }

  private onSuiteComplete(data: { name: string; passed: boolean; duration: number }): void {
    this.totalDuration += data.duration;
    const icon = data.passed ? pc.green('✓') : pc.red('✗');
    // eslint-disable-next-line no-console
    console.log(`\n${icon} ${pc.bold(data.name)} ${pc.dim(`(${data.duration.toFixed(2)}ms)`)}\n`);
  }

  // eslint-disable-next-line no-unused-vars
  async report(_results: SuiteResult[]): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('\n' + pc.bold('Test Results:'));
    // eslint-disable-next-line no-console
    console.log(`  ${pc.green(`${this.passed} passed`)}`);
    if (this.failed > 0) {
      // eslint-disable-next-line no-console
      console.log(`  ${pc.red(`${this.failed} failed`)}`);
    }
    // eslint-disable-next-line no-console
    console.log(`  Duration: ${this.totalDuration.toFixed(2)}ms\n`);

    if (this.failed > 0) {
      process.exit(1);
    }
  }
}

// Run tests
export async function runTests(): Promise<void> {
  const reporter = new ConsoleReporter(registry);
  // eslint-disable-next-line no-console
  console.log(pc.bold(pc.cyan('\n⚡ Solidum Test Runner\n')));

  const results = await registry.run();
  await reporter.report(results);
}
