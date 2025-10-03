import type { BundleReport, BundleSize } from './types';

export class BundleAnalyzer {
  analyze(name: string, bundles: BundleSize[], previousTotalSize?: number): BundleReport {
    const totalSize = bundles.reduce((sum, b) => sum + b.size, 0);
    const totalGzipSize = bundles.reduce((sum, b) => sum + b.gzipSize, 0);
    const totalBrotliSize = bundles.reduce((sum, b) => sum + (b.brotliSize || 0), 0);

    const report: BundleReport = {
      name,
      totalSize,
      totalGzipSize,
      totalBrotliSize,
      bundles,
      timestamp: Date.now()
    };

    if (previousTotalSize !== undefined) {
      const difference = totalSize - previousTotalSize;
      const percentageChange = Number(((difference / previousTotalSize) * 100).toFixed(2));

      report.comparison = {
        previousSize: previousTotalSize,
        currentSize: totalSize,
        difference,
        percentageChange
      };
    }

    return report;
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
}
