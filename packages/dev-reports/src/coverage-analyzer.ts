import type { CoverageReport, FileCoverage, CoverageData } from './types';

export class CoverageAnalyzer {
  analyze(files: FileCoverage[]): CoverageReport {
    const overall: CoverageData = {
      lines: { total: 0, covered: 0, skipped: 0, percentage: 0 },
      statements: { total: 0, covered: 0, skipped: 0, percentage: 0 },
      functions: { total: 0, covered: 0, skipped: 0, percentage: 0 },
      branches: { total: 0, covered: 0, skipped: 0, percentage: 0 }
    };

    for (const file of files) {
      overall.lines.total += file.coverage.lines.total;
      overall.lines.covered += file.coverage.lines.covered;
      overall.lines.skipped += file.coverage.lines.skipped;

      overall.statements.total += file.coverage.statements.total;
      overall.statements.covered += file.coverage.statements.covered;
      overall.statements.skipped += file.coverage.statements.skipped;

      overall.functions.total += file.coverage.functions.total;
      overall.functions.covered += file.coverage.functions.covered;
      overall.functions.skipped += file.coverage.functions.skipped;

      overall.branches.total += file.coverage.branches.total;
      overall.branches.covered += file.coverage.branches.covered;
      overall.branches.skipped += file.coverage.branches.skipped;
    }

    // Calculate percentages
    overall.lines.percentage = this.calculatePercentage(overall.lines.covered, overall.lines.total);
    overall.statements.percentage = this.calculatePercentage(overall.statements.covered, overall.statements.total);
    overall.functions.percentage = this.calculatePercentage(overall.functions.covered, overall.functions.total);
    overall.branches.percentage = this.calculatePercentage(overall.branches.covered, overall.branches.total);

    return {
      overall,
      files,
      timestamp: Date.now()
    };
  }

  getLowCoverageFiles(files: FileCoverage[], threshold: number): FileCoverage[] {
    return files.filter(file => file.coverage.lines.percentage < threshold);
  }

  private calculatePercentage(covered: number, total: number): number {
    if (total === 0) return 0;
    return Number(((covered / total) * 100).toFixed(2));
  }
}
