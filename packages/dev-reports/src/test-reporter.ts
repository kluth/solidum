import type { TestReport, TestSuite } from './types';

export class TestReporter {
  generate(name: string, suites: TestSuite[]): TestReport {
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    const skippedTests = 0;
    let totalDuration = 0;

    for (const suite of suites) {
      totalTests += suite.tests.length;
      totalDuration += suite.duration;

      for (const test of suite.tests) {
        if (test.passed) {
          passedTests++;
        } else {
          failedTests++;
        }
      }
    }

    return {
      name,
      suites,
      totalTests,
      passedTests,
      failedTests,
      skippedTests,
      totalDuration,
      timestamp: Date.now()
    };
  }
}
