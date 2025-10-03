import type {
  IQueryableStorage,
  IndexedDBOptions,
  QueryFilter,
  StorableValue,
  StorableObject
} from './async-types';

/**
 * IndexedDB storage adapter
 * Provides async storage with IndexedDB backend
 */
export class IndexedDBAdapter<T extends StorableValue = StorableValue> implements IQueryableStorage<T> {
  private dbName: string;
  private storeName: string;
  private version: number;
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  constructor(options: IndexedDBOptions) {
    this.dbName = options.dbName;
    this.storeName = options.storeName;
    this.version = options.version || 1;

    if (typeof indexedDB === 'undefined') {
      throw new Error('IndexedDB is not available in this environment');
    }
  }

  /**
   * Initialize the database connection
   */
  private async init(): Promise<void> {
    if (this.db) return;

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error(`Failed to open database: ${request.error}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });

    return this.initPromise;
  }

  /**
   * Get a transaction
   */
  private async getTransaction(mode: IDBTransactionMode): Promise<IDBObjectStore> {
    await this.init();
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction([this.storeName], mode);
    return transaction.objectStore(this.storeName);
  }

  /**
   * Execute a request and return a promise
   */
  private executeRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get<V extends StorableValue>(key: string): Promise<V | null> {
    const store = await this.getTransaction('readonly');
    const request = store.get(key);
    const result = await this.executeRequest(request);
    return result === undefined ? null : (result as V);
  }

  async set<V extends StorableValue>(key: string, value: V): Promise<void> {
    const store = await this.getTransaction('readwrite');
    const request = store.put(value, key);
    await this.executeRequest(request);
  }

  async remove(key: string): Promise<void> {
    const store = await this.getTransaction('readwrite');
    const request = store.delete(key);
    await this.executeRequest(request);
  }

  async clear(): Promise<void> {
    const store = await this.getTransaction('readwrite');
    const request = store.clear();
    await this.executeRequest(request);
  }

  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  async keys(): Promise<string[]> {
    const store = await this.getTransaction('readonly');
    const request = store.getAllKeys();
    const result = await this.executeRequest(request);
    return result.map(key => String(key));
  }

  async getAll(): Promise<T[]> {
    const store = await this.getTransaction('readonly');
    const request = store.getAll();
    const result = await this.executeRequest(request);
    return result as T[];
  }

  async getMany(keys: string[]): Promise<(T | null)[]> {
    const results: (T | null)[] = [];

    for (const key of keys) {
      const value = await this.get<T>(key);
      results.push(value);
    }

    return results;
  }

  async setMany(entries: [string, T][]): Promise<void> {
    const store = await this.getTransaction('readwrite');

    const promises = entries.map(([key, value]) => {
      const request = store.put(value, key);
      return this.executeRequest(request);
    });

    await Promise.all(promises);
  }

  async removeMany(keys: string[]): Promise<void> {
    const store = await this.getTransaction('readwrite');

    const promises = keys.map(key => {
      const request = store.delete(key);
      return this.executeRequest(request);
    });

    await Promise.all(promises);
  }

  async query(filter: QueryFilter<T>): Promise<T[]> {
    const all = await this.getAll();

    // Function filter
    if (typeof filter === 'function') {
      return all.filter(filter);
    }

    // Query object filter
    let results = all;

    // Apply where clause
    if (filter.where && typeof results[0] === 'object' && results[0] !== null) {
      results = results.filter(item => {
        if (typeof item !== 'object' || item === null) return false;

        const itemObj = item as StorableObject;
        const where = filter.where as Partial<StorableObject>;

        for (const [key, value] of Object.entries(where)) {
          if (itemObj[key] !== value) {
            return false;
          }
        }
        return true;
      });
    }

    // Apply ordering
    if (filter.orderBy && typeof results[0] === 'object' && results[0] !== null) {
      results.sort((a, b) => {
        if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
          return 0;
        }

        const aObj = a as StorableObject;
        const bObj = b as StorableObject;
        const orderKey = filter.orderBy as string;

        const aVal = aObj[orderKey];
        const bVal = bObj[orderKey];

        if (aVal === null || bVal === null) return 0;
        if (aVal < bVal) return filter.order === 'desc' ? 1 : -1;
        if (aVal > bVal) return filter.order === 'desc' ? -1 : 1;
        return 0;
      });
    }

    // Apply offset
    if (filter.offset) {
      results = results.slice(filter.offset);
    }

    // Apply limit
    if (filter.limit) {
      results = results.slice(0, filter.limit);
    }

    return results;
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initPromise = null;
    }
  }
}
