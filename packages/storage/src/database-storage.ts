import type {
  IDatabaseStorage,
  RecordWithId,
  QueryFilter,
  StorableObject,
  StorableValue
} from './async-types';

/**
 * Generate a random ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * In-memory database adapter
 * Useful for testing or as a base for other database adapters
 */
export class MemoryDatabaseAdapter<T extends RecordWithId> implements IDatabaseStorage<T> {
  private store: Map<string, T>;

  constructor() {
    this.store = new Map();
  }

  async create(value: Omit<T, 'id'>): Promise<T> {
    const id = generateId();
    const record = { ...value, id } as T;
    this.store.set(id, record);
    return record;
  }

  async findById(id: string): Promise<T | null> {
    return this.store.get(id) || null;
  }

  async update(id: string, value: Partial<T>): Promise<T> {
    const existing = this.store.get(id);
    if (!existing) {
      throw new Error(`Record with id "${id}" not found`);
    }

    const updated = { ...existing, ...value, id } as T;
    this.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }

  async get<V extends StorableValue>(key: string): Promise<V | null> {
    return (this.store.get(key) as unknown as V) || null;
  }

  async set<V extends StorableValue>(key: string, value: V): Promise<void> {
    this.store.set(key, value as unknown as T);
  }

  async remove(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  async has(key: string): Promise<boolean> {
    return this.store.has(key);
  }

  async keys(): Promise<string[]> {
    return Array.from(this.store.keys());
  }

  async getAll(): Promise<T[]> {
    return Array.from(this.store.values());
  }

  async getMany(keys: string[]): Promise<(T | null)[]> {
    return keys.map(key => this.store.get(key) || null);
  }

  async setMany(entries: [string, T][]): Promise<void> {
    for (const [key, value] of entries) {
      this.store.set(key, value);
    }
  }

  async removeMany(keys: string[]): Promise<void> {
    for (const key of keys) {
      this.store.delete(key);
    }
  }

  async query(filter: QueryFilter<T>): Promise<T[]> {
    let results = Array.from(this.store.values());

    // Function filter
    if (typeof filter === 'function') {
      return results.filter(filter);
    }

    // Query object filter
    // Apply where clause
    if (filter.where) {
      results = results.filter(item => {
        const where = filter.where as Partial<StorableObject>;

        for (const [key, value] of Object.entries(where)) {
          if ((item as unknown as StorableObject)[key] !== value) {
            return false;
          }
        }
        return true;
      });
    }

    // Apply ordering
    if (filter.orderBy) {
      results.sort((a, b) => {
        const orderKey = filter.orderBy as string;
        const aVal = (a as unknown as StorableObject)[orderKey];
        const bVal = (b as unknown as StorableObject)[orderKey];

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

  async count(filter?: QueryFilter<T>): Promise<number> {
    if (!filter) {
      return this.store.size;
    }

    const filtered = await this.query(filter);
    return filtered.length;
  }
}

/**
 * Abstract base class for database adapters
 * Extend this to create adapters for SQL, NoSQL, etc.
 */
export abstract class BaseDatabaseAdapter<T extends RecordWithId> implements IDatabaseStorage<T> {
  abstract create(_value: Omit<T, 'id'>): Promise<T>;
  abstract findById(_id: string): Promise<T | null>;
  abstract update(_id: string, _value: Partial<T>): Promise<T>;
  abstract delete(_id: string): Promise<void>;
  abstract get<V extends StorableValue>(_key: string): Promise<V | null>;
  abstract set<V extends StorableValue>(_key: string, _value: V): Promise<void>;
  abstract remove(_key: string): Promise<void>;
  abstract clear(): Promise<void>;
  abstract has(_key: string): Promise<boolean>;
  abstract keys(): Promise<string[]>;
  abstract getAll(): Promise<T[]>;
  abstract getMany(_keys: string[]): Promise<(T | null)[]>;
  abstract setMany(_entries: [string, T][]): Promise<void>;
  abstract removeMany(_keys: string[]): Promise<void>;
  abstract query(_filter: QueryFilter<T>): Promise<T[]>;
  abstract count(_filter?: QueryFilter<T>): Promise<number>;
}
