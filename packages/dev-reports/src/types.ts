/**
 * Report types and interfaces
 */

export interface BundleSize {
  file: string;
  size: number;
  gzipSize: number;
  brotliSize?: number;
}

export interface BundleReport {
  name: string;
  totalSize: number;
  totalGzipSize: number;
  totalBrotliSize: number;
  bundles: BundleSize[];
  timestamp: number;
  comparison?: BundleComparison;
}

export interface BundleComparison {
  previousSize: number;
  currentSize: number;
  difference: number;
  percentageChange: number;
}

export interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: boolean;
  duration: number;
}

export interface TestReport {
  name: string;
  suites: TestSuite[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  totalDuration: number;
  timestamp: number;
  coverage?: CoverageReport;
}

export interface CoverageData {
  lines: CoverageMetrics;
  statements: CoverageMetrics;
  functions: CoverageMetrics;
  branches: CoverageMetrics;
}

export interface CoverageMetrics {
  total: number;
  covered: number;
  skipped: number;
  percentage: number;
}

export interface FileCoverage {
  file: string;
  coverage: CoverageData;
}

export interface CoverageReport {
  overall: CoverageData;
  files: FileCoverage[];
  timestamp: number;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold?: number;
  passed?: boolean;
}

export interface PerformanceReport {
  name: string;
  metrics: PerformanceMetric[];
  timestamp: number;
}

export interface BuildInfo {
  name: string;
  version: string;
  buildTime: number;
  timestamp: number;
  environment: string;
  branch?: string;
  commit?: string;
}

export interface DependencyInfo {
  name: string;
  version: string;
  size: number;
  license: string;
}

export interface DependencyReport {
  name: string;
  dependencies: DependencyInfo[];
  devDependencies: DependencyInfo[];
  totalSize: number;
  timestamp: number;
}

export interface DevReport {
  build: BuildInfo;
  bundle?: BundleReport;
  tests?: TestReport;
  coverage?: CoverageReport;
  performance?: PerformanceReport;
  dependencies?: DependencyReport;
  timestamp: number;
}

export interface ReportOptions {
  title?: string;
  outputDir?: string;
  formats?: ReportFormat[];
  includeCharts?: boolean;
  includeTimeline?: boolean;
  themeColor?: string;
}

export type ReportFormat = 'html' | 'markdown' | 'json' | 'console';

export interface ReportGenerator {
  generate(_report: DevReport, _options?: ReportOptions): Promise<string>;
}
