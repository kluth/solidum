/**
 * @sldm/dev-reports - Beautiful development reports for stakeholders
 *
 * Generate comprehensive reports for:
 * - Bundle size analysis
 * - Test results
 * - Code coverage
 * - Performance metrics
 * - Build information
 *
 * @packageDocumentation
 */

export type {
  BundleSize,
  BundleReport,
  BundleComparison,
  TestResult,
  TestSuite,
  TestReport,
  CoverageData,
  CoverageMetrics,
  FileCoverage,
  CoverageReport,
  PerformanceMetric,
  PerformanceReport,
  BuildInfo,
  DependencyInfo,
  DependencyReport,
  DevReport,
  ReportOptions,
  ReportFormat,
  ReportGenerator
} from './types';

export { BundleAnalyzer } from './bundle-analyzer';
export { TestReporter } from './test-reporter';
export { CoverageAnalyzer } from './coverage-analyzer';
export { HTMLReportGenerator } from './html-generator';
export { MarkdownReportGenerator } from './markdown-generator';
