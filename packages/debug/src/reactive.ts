import { Logger } from './logger';
import type { StateChangeEvent } from './types';

/**
 * Reactive state debugger for tracking signal changes
 */
export class ReactiveDebugger {
  private logger: Logger;
  private subscribers: Set<(event: StateChangeEvent) => void> = new Set();
  private stateHistory: Map<string, StateChangeEvent[]> = new Map();
  private maxHistorySize: number;

  constructor(options: { logger?: Logger; maxHistorySize?: number } = {}) {
    this.logger = options.logger ?? new Logger({ namespace: 'reactive' });
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Track signal creation
   */
  trackCreate(signalId: string, initialValue: unknown): void {
    const event: StateChangeEvent = {
      type: 'create',
      signalId,
      newValue: initialValue,
      timestamp: Date.now(),
      stack: new Error().stack,
    };

    this.recordEvent(event);
    this.logger.debug(`Signal created: ${signalId}`, { initialValue });
  }

  /**
   * Track signal update
   */
  trackUpdate(signalId: string, oldValue: unknown, newValue: unknown): void {
    const event: StateChangeEvent = {
      type: 'update',
      signalId,
      oldValue,
      newValue,
      timestamp: Date.now(),
      stack: new Error().stack,
    };

    this.recordEvent(event);
    this.logger.debug(`Signal updated: ${signalId}`, {
      oldValue,
      newValue,
      changed: oldValue !== newValue,
    });
  }

  /**
   * Track signal destruction
   */
  trackDestroy(signalId: string, finalValue: unknown): void {
    const event: StateChangeEvent = {
      type: 'destroy',
      signalId,
      oldValue: finalValue,
      timestamp: Date.now(),
      stack: new Error().stack,
    };

    this.recordEvent(event);
    this.logger.debug(`Signal destroyed: ${signalId}`, { finalValue });
  }

  /**
   * Subscribe to state changes
   */
  subscribe(callback: (event: StateChangeEvent) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Get history for a specific signal
   */
  getHistory(signalId: string): StateChangeEvent[] {
    return this.stateHistory.get(signalId) ?? [];
  }

  /**
   * Get all state changes
   */
  getAllHistory(): Map<string, StateChangeEvent[]> {
    return new Map(this.stateHistory);
  }

  /**
   * Clear history
   */
  clearHistory(signalId?: string): void {
    if (signalId) {
      this.stateHistory.delete(signalId);
    } else {
      this.stateHistory.clear();
    }
  }

  /**
   * Get state change summary
   */
  getSummary(): {
    totalSignals: number;
    totalChanges: number;
    byType: Record<string, number>;
  } {
    let totalChanges = 0;
    const byType: Record<string, number> = {
      create: 0,
      update: 0,
      destroy: 0,
    };

    this.stateHistory.forEach(events => {
      totalChanges += events.length;
      events.forEach(event => {
        byType[event.type]++;
      });
    });

    return {
      totalSignals: this.stateHistory.size,
      totalChanges,
      byType,
    };
  }

  /**
   * Record a state change event
   */
  private recordEvent(event: StateChangeEvent): void {
    const history = this.stateHistory.get(event.signalId) ?? [];
    history.push(event);

    // Limit history size
    if (history.length > this.maxHistorySize) {
      history.shift();
    }

    this.stateHistory.set(event.signalId, history);

    // Notify subscribers
    this.subscribers.forEach(callback => callback(event));
  }
}

/**
 * Effect debugger for tracking reactive computations
 */
export class EffectDebugger {
  private logger: Logger;
  private effectStack: string[] = [];
  private effectDependencies: Map<string, Set<string>> = new Map();

  constructor(logger?: Logger) {
    this.logger = logger ?? new Logger({ namespace: 'effects' });
  }

  /**
   * Track effect start
   */
  startEffect(effectId: string): void {
    this.effectStack.push(effectId);
    this.logger.trace(`Effect started: ${effectId}`);
  }

  /**
   * Track effect end
   */
  endEffect(effectId: string): void {
    const popped = this.effectStack.pop();
    if (popped !== effectId) {
      this.logger.warn(`Effect stack mismatch: expected ${effectId}, got ${popped}`);
    }
    this.logger.trace(`Effect ended: ${effectId}`);
  }

  /**
   * Track dependency access
   */
  trackDependency(signalId: string): void {
    const currentEffect = this.effectStack[this.effectStack.length - 1];
    if (!currentEffect) return;

    const deps = this.effectDependencies.get(currentEffect) ?? new Set();
    deps.add(signalId);
    this.effectDependencies.set(currentEffect, deps);

    this.logger.trace(`Dependency tracked: ${currentEffect} -> ${signalId}`);
  }

  /**
   * Get dependencies for an effect
   */
  getDependencies(effectId: string): string[] {
    return Array.from(this.effectDependencies.get(effectId) ?? []);
  }

  /**
   * Get dependency graph
   */
  getDependencyGraph(): Record<string, string[]> {
    const graph: Record<string, string[]> = {};
    this.effectDependencies.forEach((deps, effectId) => {
      graph[effectId] = Array.from(deps);
    });
    return graph;
  }

  /**
   * Clear all tracked data
   */
  clear(): void {
    this.effectStack = [];
    this.effectDependencies.clear();
  }
}

/**
 * Time travel debugger for state history
 */
export class TimeTravelDebugger {
  private snapshots: Array<{ timestamp: number; state: Map<string, unknown> }> = [];
  private currentIndex = -1;
  private maxSnapshots: number;

  constructor(maxSnapshots = 50) {
    this.maxSnapshots = maxSnapshots;
  }

  /**
   * Take a snapshot of current state
   */
  snapshot(state: Map<string, unknown>): void {
    // Remove any snapshots after current index (for branching)
    this.snapshots = this.snapshots.slice(0, this.currentIndex + 1);

    // Add new snapshot
    this.snapshots.push({
      timestamp: Date.now(),
      state: new Map(state),
    });

    // Limit snapshots
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    } else {
      this.currentIndex++;
    }
  }

  /**
   * Travel back in time
   */
  undo(): Map<string, unknown> | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.snapshots[this.currentIndex].state;
    }
    return null;
  }

  /**
   * Travel forward in time
   */
  redo(): Map<string, unknown> | null {
    if (this.currentIndex < this.snapshots.length - 1) {
      this.currentIndex++;
      return this.snapshots[this.currentIndex].state;
    }
    return null;
  }

  /**
   * Jump to specific snapshot
   */
  jumpTo(index: number): Map<string, unknown> | null {
    if (index >= 0 && index < this.snapshots.length) {
      this.currentIndex = index;
      return this.snapshots[index].state;
    }
    return null;
  }

  /**
   * Get all snapshots
   */
  getSnapshots(): Array<{ timestamp: number; index: number }> {
    return this.snapshots.map((snapshot, index) => ({
      timestamp: snapshot.timestamp,
      index,
    }));
  }

  /**
   * Get current snapshot index
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * Clear all snapshots
   */
  clear(): void {
    this.snapshots = [];
    this.currentIndex = -1;
  }
}
