# @sldm/dev-reports

> Beautiful development reports for stakeholders - Bundle size, tests, coverage, and more

Generate comprehensive, visually appealing reports that are easy for stakeholders to understand. Track metrics that matter: bundle sizes, test results, code coverage, and build performance.

## Features

- **📦 Bundle Size Analysis** - Track bundle sizes with gzip/brotli compression
- **✅ Test Results** - Beautiful test reports with success rates
- **🎯 Code Coverage** - Coverage metrics for lines, statements, functions, and branches
- **🔨 Build Information** - Build times, versions, and environment details
- **📊 Multiple Formats** - HTML, Markdown, JSON, and console output
- **👔 Stakeholder-Friendly** - Clean, professional reports non-technical stakeholders can understand
- **📈 Trend Analysis** - Compare with previous builds to track improvements
- **🎨 Customizable** - Custom themes and branding options

## Installation

```bash
npm install @sldm/dev-reports
# or
pnpm add @sldm/dev-reports
# or
yarn add @sldm/dev-reports
```

## Quick Start

### Generate an HTML Report

```typescript
import {
  BundleAnalyzer,
  TestReporter,
  CoverageAnalyzer,
  HTMLReportGenerator
} from '@sldm/dev-reports';

// Analyze bundle sizes
const bundleAnalyzer = new BundleAnalyzer();
const bundleReport = bundleAnalyzer.analyze('my-project', [
  { file: 'main.js', size: 100000, gzipSize: 30000 },
  { file: 'vendor.js', size: 200000, gzipSize: 60000 }
]);

// Generate test report
const testReporter = new TestReporter();
const testReport = testReporter.generate('my-project', [
  {
    name: 'Unit Tests',
    tests: [
      { name: 'should work', passed: true, duration: 10 },
      { name: 'should handle errors', passed: true, duration: 15 }
    ],
    passed: true,
    duration: 25
  }
]);

// Analyze coverage
const coverageAnalyzer = new CoverageAnalyzer();
const coverageReport = coverageAnalyzer.analyze([
  {
    file: 'src/index.ts',
    coverage: {
      lines: { total: 100, covered: 85, skipped: 0, percentage: 85 },
      statements: { total: 100, covered: 85, skipped: 0, percentage: 85 },
      functions: { total: 20, covered: 18, skipped: 0, percentage: 90 },
      branches: { total: 40, covered: 35, skipped: 0, percentage: 87.5 }
    }
  }
]);

// Create comprehensive report
const report = {
  build: {
    name: 'my-project',
    version: '1.0.0',
    buildTime: 5000,
    timestamp: Date.now(),
    environment: 'production',
    branch: 'main',
    commit: 'abc123def456'
  },
  bundle: bundleReport,
  tests: testReport,
  coverage: coverageReport,
  timestamp: Date.now()
};

// Generate HTML
const htmlGenerator = new HTMLReportGenerator();
const html = htmlGenerator.generate(report);

// Save to file
import { writeFileSync } from 'fs';
writeFileSync('dev-report.html', html);
```

### Generate a Markdown Report

```typescript
import { MarkdownReportGenerator } from '@sldm/dev-reports';

const markdownGenerator = new MarkdownReportGenerator();
const markdown = markdownGenerator.generate(report);

writeFileSync('DEV-REPORT.md', markdown);
```

## API Reference

### BundleAnalyzer

Analyzes bundle sizes and tracks changes.

```typescript
class BundleAnalyzer {
  analyze(name: string, bundles: BundleSize[], previousTotalSize?: number): BundleReport
  formatSize(bytes: number): string
}
```

**Example:**

```typescript
const analyzer = new BundleAnalyzer();
const report = analyzer.analyze('my-app', [
  { file: 'app.js', size: 150000, gzipSize: 45000, brotliSize: 40000 }
], 140000); // Previous size for comparison

console.log(report.comparison?.percentageChange); // +7.14
```

### TestReporter

Generates test result reports.

```typescript
class TestReporter {
  generate(name: string, suites: TestSuite[]): TestReport
}
```

**Example:**

```typescript
const reporter = new TestReporter();
const report = reporter.generate('my-app', [
  {
    name: 'Integration Tests',
    tests: [
      { name: 'API endpoints', passed: true, duration: 50 },
      { name: 'Database queries', passed: false, duration: 30, error: 'Connection timeout' }
    ],
    passed: false,
    duration: 80
  }
]);

console.log(`${report.passedTests}/${report.totalTests} tests passed`);
```

### CoverageAnalyzer

Analyzes code coverage metrics.

```typescript
class CoverageAnalyzer {
  analyze(files: FileCoverage[]): CoverageReport
  getLowCoverageFiles(files: FileCoverage[], threshold: number): FileCoverage[]
}
```

**Example:**

```typescript
const analyzer = new CoverageAnalyzer();
const report = analyzer.analyze(coverageData);

console.log(`Overall coverage: ${report.overall.lines.percentage}%`);

// Find files with low coverage
const lowCoverage = analyzer.getLowCoverageFiles(report.files, 80);
console.log(`${lowCoverage.length} files below 80% coverage`);
```

### HTMLReportGenerator

Generates beautiful HTML reports.

```typescript
class HTMLReportGenerator {
  generate(report: DevReport, themeColor?: string): string
}
```

**Features:**
- Responsive design
- Custom theme colors
- Interactive charts (optional)
- Print-friendly
- Mobile-optimized

### MarkdownReportGenerator

Generates Markdown reports for documentation.

```typescript
class MarkdownReportGenerator {
  generate(report: DevReport): string
}
```

**Perfect for:**
- GitHub README badges
- Pull request comments
- Documentation sites
- CI/CD summaries

## Types

### DevReport

```typescript
interface DevReport {
  build: BuildInfo;
  bundle?: BundleReport;
  tests?: TestReport;
  coverage?: CoverageReport;
  performance?: PerformanceReport;
  dependencies?: DependencyReport;
  timestamp: number;
}
```

### BuildInfo

```typescript
interface BuildInfo {
  name: string;
  version: string;
  buildTime: number;
  timestamp: number;
  environment: string;
  branch?: string;
  commit?: string;
}
```

### BundleReport

```typescript
interface BundleReport {
  name: string;
  totalSize: number;
  totalGzipSize: number;
  totalBrotliSize: number;
  bundles: BundleSize[];
  timestamp: number;
  comparison?: BundleComparison;
}
```

### TestReport

```typescript
interface TestReport {
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
```

### CoverageReport

```typescript
interface CoverageReport {
  overall: CoverageData;
  files: FileCoverage[];
  timestamp: number;
}
```

## Use Cases

### CI/CD Integration

Generate reports after each build and commit them to your repository:

```typescript
// In your CI/CD pipeline
const report = generateReport();
const html = new HTMLReportGenerator().generate(report);
writeFileSync(`reports/${process.env.CI_COMMIT_SHA}.html`, html);
```

### Pull Request Comments

Post report summaries as PR comments:

```typescript
const markdown = new MarkdownReportGenerator().generate(report);
// Post to GitHub/GitLab/etc.
```

### Dashboard Integration

Serve HTML reports as a static site:

```bash
# Deploy to GitHub Pages, Netlify, or Vercel
cp dev-report.html public/index.html
```

### Email Reports

Send stakeholder-friendly reports via email:

```typescript
const html = new HTMLReportGenerator().generate(report, '#6366f1');
sendEmail({
  to: 'stakeholders@company.com',
  subject: `Build Report: ${report.build.name} v${report.build.version}`,
  html
});
```

## Advanced Features

### Custom Themes

```typescript
const html = htmlGenerator.generate(report, '#ff6b6b'); // Custom brand color
```

### Trend Analysis

Track metrics over time:

```typescript
const currentReport = analyzer.analyze('my-app', currentBundles, previousSize);
const trend = currentReport.comparison?.percentageChange;

if (trend > 10) {
  console.warn('⚠️ Bundle size increased by more than 10%!');
}
```

### Low Coverage Alerts

```typescript
const lowCoverage = coverageAnalyzer.getLowCoverageFiles(files, 70);
if (lowCoverage.length > 0) {
  console.error(`❌ ${lowCoverage.length} files have less than 70% coverage`);
  process.exit(1);
}
```

## Integration Examples

### With Webpack

```javascript
// webpack.config.js
const { BundleAnalyzer } = require('@sldm/dev-reports');

module.exports = {
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.done.tap('DevReports', (stats) => {
          const bundles = stats.toJson().assets.map(asset => ({
            file: asset.name,
            size: asset.size,
            gzipSize: asset.gzipSize || 0
          }));

          const analyzer = new BundleAnalyzer();
          const report = analyzer.analyze('my-app', bundles);
          // Generate and save report
        });
      }
    }
  ]
};
```

### With Vite

```javascript
// vite.config.js
import { BundleAnalyzer } from '@sldm/dev-reports';

export default {
  plugins: [
    {
      name: 'dev-reports',
      closeBundle() {
        // Analyze bundles and generate report
      }
    }
  ]
};
```

## Best Practices

1. **Automate Report Generation** - Integrate into your CI/CD pipeline
2. **Set Thresholds** - Fail builds if metrics exceed limits
3. **Track Trends** - Store historical data for comparison
4. **Share with Stakeholders** - Generate reports in stakeholder-friendly formats
5. **Monitor Continuously** - Generate reports on every build

## License

MIT © Matthias Kluth

## Links

- [Documentation](https://kluth.github.io/solidum)
- [GitHub](https://github.com/kluth/solidum)
- [Issues](https://github.com/kluth/solidum/issues)
