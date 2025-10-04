import type { PerformanceEntry } from './types';

/**
 * Performance monitor for tracking application performance
 */
export class PerformanceMonitor {
  private measurements: Map<string, PerformanceEntry> = new Map();
  private marks: Map<string, number> = new Map();
  private observers: Set<PerformanceObserver> = new Set();

  constructor() {
    this.setupObservers();
  }

  /**
   * Mark a performance point
   */
  mark(name: string): void {
    this.marks.set(name, performance.now());
    if (typeof performance.mark === 'function') {
      performance.mark(name);
    }
  }

  /**
   * Measure between two marks
   */
  measure(name: string, startMark: string, endMark?: string): PerformanceEntry | undefined {
    const startTime = this.marks.get(startMark);
    if (!startTime) {
      return undefined;
    }

    const endTime = endMark ? this.marks.get(endMark) : performance.now();
    if (!endTime) {
      return undefined;
    }

    const entry: PerformanceEntry = {
      name,
      duration: endTime - startTime,
      startTime,
      endTime,
    };

    // Add memory info if available
    const perfWithMemory = performance as unknown as {
      memory?: { usedJSHeapSize: number; totalJSHeapSize: number };
    };
    if (typeof perfWithMemory.memory !== 'undefined') {
      const mem = perfWithMemory.memory;
      entry.memory = {
        used: mem.usedJSHeapSize,
        total: mem.totalJSHeapSize,
      };
    }

    this.measurements.set(name, entry);

    if (typeof performance.measure === 'function') {
      try {
        performance.measure(name, startMark, endMark);
      } catch {
        // Ignore if marks don't exist in native performance API
      }
    }

    return entry;
  }

  /**
   * Get a specific measurement
   */
  getMeasurement(name: string): PerformanceEntry | undefined {
    return this.measurements.get(name);
  }

  /**
   * Get all measurements
   */
  getAllMeasurements(): PerformanceEntry[] {
    return Array.from(this.measurements.values());
  }

  /**
   * Clear all measurements
   */
  clear(): void {
    this.measurements.clear();
    this.marks.clear();
    if (typeof performance.clearMarks === 'function') {
      performance.clearMarks();
    }
    if (typeof performance.clearMeasures === 'function') {
      performance.clearMeasures();
    }
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    total: number;
    average: number;
    min: number;
    max: number;
    measurements: PerformanceEntry[];
  } {
    const measurements = this.getAllMeasurements();
    const durations = measurements.map(m => m.duration);

    return {
      total: measurements.length,
      average: durations.reduce((a, b) => a + b, 0) / durations.length || 0,
      min: Math.min(...durations) || 0,
      max: Math.max(...durations) || 0,
      measurements,
    };
  }

  /**
   * Measure function execution time
   */
  measureSync<T>(name: string, fn: () => T): T {
    this.mark(`${name}-start`);
    try {
      const result = fn();
      this.mark(`${name}-end`);
      this.measure(name, `${name}-start`, `${name}-end`);
      return result;
    } catch (err) {
      this.mark(`${name}-end`);
      this.measure(name, `${name}-start`, `${name}-end`);
      throw err;
    }
  }

  /**
   * Measure async function execution time
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.mark(`${name}-start`);
    try {
      const result = await fn();
      this.mark(`${name}-end`);
      this.measure(name, `${name}-start`, `${name}-end`);
      return result;
    } catch (err) {
      this.mark(`${name}-end`);
      this.measure(name, `${name}-start`, `${name}-end`);
      throw err;
    }
  }

  /**
   * Setup performance observers
   */
  private setupObservers(): void {
    if (typeof PerformanceObserver === 'undefined') {
      return;
    }

    try {
      // Observe long tasks
      const longTaskObserver = new PerformanceObserver(_list => {
        // Long task detected - could emit event here
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.add(longTaskObserver);
    } catch {
      // Long task API not supported
    }

    try {
      // Observe layout shifts
      const layoutShiftObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const entryWithInput = entry as unknown as { hadRecentInput?: boolean };
          if (entryWithInput.hadRecentInput) continue;
          // Layout shift detected - could emit event here
        }
      });
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.add(layoutShiftObserver);
    } catch {
      // Layout shift API not supported
    }
  }

  /**
   * Destroy the performance monitor
   */
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.clear();
  }
}

/**
 * FPS (Frames Per Second) monitor
 */
export class FPSMonitor {
  private fps = 0;
  private frames = 0;
  private lastTime = performance.now();
  private running = false;
  private rafId?: number;

  /**
   * Start monitoring FPS
   */
  start(): void {
    if (this.running) return;
    this.running = true;
    this.frames = 0;
    this.lastTime = performance.now();
    this.loop();
  }

  /**
   * Stop monitoring FPS
   */
  stop(): void {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.fps;
  }

  /**
   * Main loop
   */
  private loop = (): void => {
    this.frames++;
    const now = performance.now();
    const delta = now - this.lastTime;

    if (delta >= 1000) {
      this.fps = Math.round((this.frames * 1000) / delta);
      this.frames = 0;
      this.lastTime = now;
    }

    if (this.running) {
      this.rafId = requestAnimationFrame(this.loop);
    }
  };
}

/**
 * Memory monitor
 */
export class MemoryMonitor {
  /**
   * Get current memory usage
   */
  getUsage(): { used: number; total: number; percentage: number } | null {
    const perfWithMemory = performance as unknown as {
      memory?: { usedJSHeapSize: number; totalJSHeapSize: number };
    };
    if (typeof perfWithMemory.memory === 'undefined') {
      return null;
    }

    const mem = perfWithMemory.memory;
    return {
      used: mem.usedJSHeapSize,
      total: mem.totalJSHeapSize,
      percentage: (mem.usedJSHeapSize / mem.totalJSHeapSize) * 100,
    };
  }

  /**
   * Format bytes to human readable string
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
