import { describe, it, expect, runTests } from '@sldm/testing';

import { BundleAnalyzer } from './bundle-analyzer';
import { CoverageAnalyzer } from './coverage-analyzer';
import { HTMLReportGenerator } from './html-generator';
import { MarkdownReportGenerator } from './markdown-generator';
import { TestReporter } from './test-reporter';
import type {
  DevReport
} from './types';

describe('BundleAnalyzer', () => {
  it('should analyze bundle sizes', () => {
    const analyzer = new BundleAnalyzer();
    const bundles = [
      { file: 'main.js', size: 100000, gzipSize: 30000 },
      { file: 'vendor.js', size: 200000, gzipSize: 60000 }
    ];

    const report = analyzer.analyze('test-project', bundles);

    expect(report.name).toBe('test-project');
    expect(report.totalSize).toBe(300000);
    expect(report.totalGzipSize).toBe(90000);
    expect(report.bundles.length).toBe(2);
  });

  it('should format sizes in human-readable format', () => {
    const analyzer = new BundleAnalyzer();

    expect(analyzer.formatSize(1024)).toBe('1.00 KB');
    expect(analyzer.formatSize(1048576)).toBe('1.00 MB');
    expect(analyzer.formatSize(500)).toBe('500 B');
  });

  it('should calculate size differences', () => {
    const analyzer = new BundleAnalyzer();
    const bundles = [
      { file: 'main.js', size: 100000, gzipSize: 30000 }
    ];

    const report = analyzer.analyze('test-project', bundles, 90000);

    expect(report.comparison).toBeDefined();
    if (report.comparison) {
      expect(report.comparison.difference).toBe(10000);
      expect(report.comparison.percentageChange).toBe(11.11);
    }
  });
});

describe('TestReporter', () => {
  it('should generate test report from results', () => {
    const reporter = new TestReporter();
    const suites = [
      {
        name: 'Suite 1',
        tests: [
          { name: 'test 1', passed: true, duration: 10 },
          { name: 'test 2', passed: true, duration: 20 }
        ],
        passed: true,
        duration: 30
      }
    ];

    const report = reporter.generate('test-project', suites);

    expect(report.name).toBe('test-project');
    expect(report.totalTests).toBe(2);
    expect(report.passedTests).toBe(2);
    expect(report.failedTests).toBe(0);
  });

  it('should count failed tests', () => {
    const reporter = new TestReporter();
    const suites = [
      {
        name: 'Suite 1',
        tests: [
          { name: 'test 1', passed: true, duration: 10 },
          { name: 'test 2', passed: false, duration: 20, error: 'Failed' }
        ],
        passed: false,
        duration: 30
      }
    ];

    const report = reporter.generate('test-project', suites);

    expect(report.passedTests).toBe(1);
    expect(report.failedTests).toBe(1);
  });

  it('should calculate total duration', () => {
    const reporter = new TestReporter();
    const suites = [
      {
        name: 'Suite 1',
        tests: [
          { name: 'test 1', passed: true, duration: 10 },
          { name: 'test 2', passed: true, duration: 20 }
        ],
        passed: true,
        duration: 30
      },
      {
        name: 'Suite 2',
        tests: [
          { name: 'test 3', passed: true, duration: 15 }
        ],
        passed: true,
        duration: 15
      }
    ];

    const report = reporter.generate('test-project', suites);

    expect(report.totalDuration).toBe(45);
  });
});

describe('CoverageAnalyzer', () => {
  it('should analyze coverage data', () => {
    const analyzer = new CoverageAnalyzer();
    const files = [
      {
        file: 'src/index.ts',
        coverage: {
          lines: { total: 100, covered: 80, skipped: 0, percentage: 80 },
          statements: { total: 100, covered: 80, skipped: 0, percentage: 80 },
          functions: { total: 20, covered: 16, skipped: 0, percentage: 80 },
          branches: { total: 40, covered: 32, skipped: 0, percentage: 80 }
        }
      }
    ];

    const report = analyzer.analyze(files);

    expect(report.overall.lines.percentage).toBe(80);
    expect(report.files.length).toBe(1);
  });

  it('should calculate overall coverage', () => {
    const analyzer = new CoverageAnalyzer();
    const files = [
      {
        file: 'file1.ts',
        coverage: {
          lines: { total: 100, covered: 80, skipped: 0, percentage: 80 },
          statements: { total: 100, covered: 80, skipped: 0, percentage: 80 },
          functions: { total: 20, covered: 16, skipped: 0, percentage: 80 },
          branches: { total: 40, covered: 32, skipped: 0, percentage: 80 }
        }
      },
      {
        file: 'file2.ts',
        coverage: {
          lines: { total: 100, covered: 90, skipped: 0, percentage: 90 },
          statements: { total: 100, covered: 90, skipped: 0, percentage: 90 },
          functions: { total: 20, covered: 18, skipped: 0, percentage: 90 },
          branches: { total: 40, covered: 36, skipped: 0, percentage: 90 }
        }
      }
    ];

    const report = analyzer.analyze(files);

    expect(report.overall.lines.total).toBe(200);
    expect(report.overall.lines.covered).toBe(170);
    expect(report.overall.lines.percentage).toBe(85);
  });

  it('should identify low coverage files', () => {
    const analyzer = new CoverageAnalyzer();
    const files = [
      {
        file: 'file1.ts',
        coverage: {
          lines: { total: 100, covered: 50, skipped: 0, percentage: 50 },
          statements: { total: 100, covered: 50, skipped: 0, percentage: 50 },
          functions: { total: 20, covered: 10, skipped: 0, percentage: 50 },
          branches: { total: 40, covered: 20, skipped: 0, percentage: 50 }
        }
      }
    ];

    const lowCoverage = analyzer.getLowCoverageFiles(files, 70);

    expect(lowCoverage.length).toBe(1);
    expect(lowCoverage[0].file).toBe('file1.ts');
  });
});

describe('HTMLReportGenerator', () => {
  it('should generate HTML report', () => {
    const generator = new HTMLReportGenerator();
    const report: DevReport = {
      build: {
        name: 'test-project',
        version: '1.0.0',
        buildTime: 5000,
        timestamp: Date.now(),
        environment: 'production'
      },
      timestamp: Date.now()
    };

    const html = generator.generate(report);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('test-project');
    expect(html).toContain('1.0.0');
  });

  it('should include bundle information', () => {
    const generator = new HTMLReportGenerator();
    const report: DevReport = {
      build: {
        name: 'test-project',
        version: '1.0.0',
        buildTime: 5000,
        timestamp: Date.now(),
        environment: 'production'
      },
      bundle: {
        name: 'test-project',
        totalSize: 300000,
        totalGzipSize: 90000,
        totalBrotliSize: 80000,
        bundles: [
          { file: 'main.js', size: 100000, gzipSize: 30000 }
        ],
        timestamp: Date.now()
      },
      timestamp: Date.now()
    };

    const html = generator.generate(report);

    expect(html).toContain('Bundle Size');
    expect(html).toContain('main.js');
  });

  it('should include test results', () => {
    const generator = new HTMLReportGenerator();
    const report: DevReport = {
      build: {
        name: 'test-project',
        version: '1.0.0',
        buildTime: 5000,
        timestamp: Date.now(),
        environment: 'production'
      },
      tests: {
        name: 'test-project',
        suites: [],
        totalTests: 10,
        passedTests: 10,
        failedTests: 0,
        skippedTests: 0,
        totalDuration: 100,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    };

    const html = generator.generate(report);

    expect(html).toContain('Test Results');
    expect(html).toContain('10');
  });
});

describe('MarkdownReportGenerator', () => {
  it('should generate Markdown report', () => {
    const generator = new MarkdownReportGenerator();
    const report: DevReport = {
      build: {
        name: 'test-project',
        version: '1.0.0',
        buildTime: 5000,
        timestamp: Date.now(),
        environment: 'production'
      },
      timestamp: Date.now()
    };

    const markdown = generator.generate(report);

    expect(markdown).toContain('# Development Report');
    expect(markdown).toContain('test-project');
    expect(markdown).toContain('1.0.0');
  });

  it('should format tables correctly', () => {
    const generator = new MarkdownReportGenerator();
    const report: DevReport = {
      build: {
        name: 'test-project',
        version: '1.0.0',
        buildTime: 5000,
        timestamp: Date.now(),
        environment: 'production'
      },
      bundle: {
        name: 'test-project',
        totalSize: 300000,
        totalGzipSize: 90000,
        totalBrotliSize: 80000,
        bundles: [
          { file: 'main.js', size: 100000, gzipSize: 30000 }
        ],
        timestamp: Date.now()
      },
      timestamp: Date.now()
    };

    const markdown = generator.generate(report);

    expect(markdown).toContain('| File | Size | Gzip |');
    expect(markdown).toContain('main.js');
  });

  it('should include coverage summary', () => {
    const generator = new MarkdownReportGenerator();
    const report: DevReport = {
      build: {
        name: 'test-project',
        version: '1.0.0',
        buildTime: 5000,
        timestamp: Date.now(),
        environment: 'production'
      },
      coverage: {
        overall: {
          lines: { total: 100, covered: 80, skipped: 0, percentage: 80 },
          statements: { total: 100, covered: 80, skipped: 0, percentage: 80 },
          functions: { total: 20, covered: 16, skipped: 0, percentage: 80 },
          branches: { total: 40, covered: 32, skipped: 0, percentage: 80 }
        },
        files: [],
        timestamp: Date.now()
      },
      timestamp: Date.now()
    };

    const markdown = generator.generate(report);

    expect(markdown).toContain('Coverage');
    expect(markdown).toContain('80');
  });
});

// Run all tests
runTests();
