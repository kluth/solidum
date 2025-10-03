import type { IStorage, StorableValue } from './types';

/**
 * In-memory storage adapter
 * Useful for testing, SSR, or as a fallback
 */
export class MemoryStorageAdapter implements IStorage {
  private store: Map<string, string>;
  private prefix: string;

  constructor(prefix: string = '') {
    this.prefix = prefix;
    this.store = new Map();
  }

  private getFullKey(key: string): string {
    return this.prefix + key;
  }

  get<T extends StorableValue>(key: string): T | null {
    const fullKey = this.getFullKey(key);
    const value = this.store.get(fullKey);

    if (value === undefined) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  set<T extends StorableValue>(key: string, value: T): void {
    if (value === undefined) {
      this.remove(key);
      return;
    }

    const fullKey = this.getFullKey(key);

    try {
      const serialized = JSON.stringify(value);
      this.store.set(fullKey, serialized);
    } catch (error) {
      throw new Error(`Failed to serialize value for key "${key}": ${error}`);
    }
  }

  remove(key: string): void {
    const fullKey = this.getFullKey(key);
    this.store.delete(fullKey);
  }

  clear(): void {
    if (this.prefix) {
      // Only clear keys with this prefix
      const keysToDelete: string[] = [];
      for (const key of this.store.keys()) {
        if (key.startsWith(this.prefix)) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => this.store.delete(key));
    } else {
      this.store.clear();
    }
  }

  has(key: string): boolean {
    const fullKey = this.getFullKey(key);
    return this.store.has(fullKey);
  }

  keys(): string[] {
    const allKeys = Array.from(this.store.keys());

    if (this.prefix) {
      return allKeys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key);
    }

    return allKeys;
  }
}
