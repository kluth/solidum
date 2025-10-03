import type { IStorage, StorableValue } from './types';

/**
 * Base adapter for Web Storage API (localStorage and sessionStorage)
 */
abstract class WebStorageAdapter implements IStorage {
  protected abstract storage: Storage;
  protected prefix: string;

  constructor(prefix: string = '') {
    this.prefix = prefix;
  }

  private getFullKey(key: string): string {
    return this.prefix + key;
  }

  get<T extends StorableValue>(key: string): T | null {
    const fullKey = this.getFullKey(key);
    const value = this.storage.getItem(fullKey);

    if (value === null) {
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
      this.storage.setItem(fullKey, serialized);
    } catch (error) {
      throw new Error(`Failed to set item in storage: ${error}`);
    }
  }

  remove(key: string): void {
    const fullKey = this.getFullKey(key);
    this.storage.removeItem(fullKey);
  }

  clear(): void {
    if (this.prefix) {
      // Only clear keys with this prefix
      const keysToDelete: string[] = [];
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => this.storage.removeItem(key));
    } else {
      this.storage.clear();
    }
  }

  has(key: string): boolean {
    const fullKey = this.getFullKey(key);
    return this.storage.getItem(fullKey) !== null;
  }

  keys(): string[] {
    const result: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key) {
        if (this.prefix) {
          if (key.startsWith(this.prefix)) {
            result.push(key);
          }
        } else {
          result.push(key);
        }
      }
    }
    return result;
  }
}

/**
 * LocalStorage adapter
 */
export class LocalStorageAdapter extends WebStorageAdapter {
  protected storage: Storage;

  constructor(prefix: string = '') {
    super(prefix);
    if (typeof localStorage === 'undefined') {
      throw new Error('localStorage is not available in this environment');
    }
    this.storage = localStorage;
  }
}

/**
 * SessionStorage adapter
 */
export class SessionStorageAdapter extends WebStorageAdapter {
  protected storage: Storage;

  constructor(prefix: string = '') {
    super(prefix);
    if (typeof sessionStorage === 'undefined') {
      throw new Error('sessionStorage is not available in this environment');
    }
    this.storage = sessionStorage;
  }
}
