/**
 * Storable value types
 */
export type StorableValue =
  | string
  | number
  | boolean
  | null
  | Date
  | StorableArray
  | StorableObject;

export interface StorableObject {
  [key: string]: StorableValue;
}

export interface StorableArray extends Array<StorableValue> {}

/**
 * Async storage interface for IndexedDB and databases
 */
export interface IAsyncStorage {
  /**
   * Get a value from storage
   * @param key - The key to retrieve
   * @returns Promise resolving to the value or null if not found
   */
  get<T extends StorableValue>(_key: string): Promise<T | null>;

  /**
   * Set a value in storage
   * @param key - The key to set
   * @param value - The value to store
   */
  set<T extends StorableValue>(_key: string, _value: T): Promise<void>;

  /**
   * Remove a value from storage
   * @param key - The key to remove
   */
  remove(_key: string): Promise<void>;

  /**
   * Clear all values from storage
   */
  clear(): Promise<void>;

  /**
   * Check if a key exists in storage
   * @param key - The key to check
   * @returns Promise resolving to true if the key exists
   */
  has(_key: string): Promise<boolean>;

  /**
   * Get all keys in storage
   * @returns Promise resolving to array of all keys
   */
  keys(): Promise<string[]>;
}

/**
 * Query interface for more advanced storage backends
 */
export interface IQueryableStorage<T extends StorableValue = StorableValue> extends IAsyncStorage {
  /**
   * Query storage with filters
   * @param filter - Filter function or query object
   * @returns Promise resolving to array of matching values
   */
  query(_filter: QueryFilter<T>): Promise<T[]>;

  /**
   * Get all values from storage
   * @returns Promise resolving to array of all values
   */
  getAll(): Promise<T[]>;

  /**
   * Get multiple values by keys
   * @param keys - Array of keys to retrieve
   * @returns Promise resolving to array of values
   */
  getMany(_keys: string[]): Promise<(T | null)[]>;

  /**
   * Set multiple values at once
   * @param entries - Array of key-value pairs
   */
  setMany(_entries: [string, T][]): Promise<void>;

  /**
   * Remove multiple keys at once
   * @param keys - Array of keys to remove
   */
  removeMany(_keys: string[]): Promise<void>;
}

/**
 * Query filter types
 */
export type QueryFilter<T extends StorableValue> =
  | ((value: T) => boolean)
  | QueryObject<T>;

export interface QueryObject<T extends StorableValue> {
  where?: T extends StorableObject ? Partial<T> : never;
  orderBy?: T extends StorableObject ? keyof T : never;
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Record type with ID
 */
export interface RecordWithId extends StorableObject {
  id: string;
}

/**
 * Database-specific storage interface
 */
export interface IDatabaseStorage<T extends RecordWithId = RecordWithId> extends IQueryableStorage<T> {
  /**
   * Create a new record
   * @param value - The value to create
   * @returns Promise resolving to the created value with ID
   */
  create(_value: Omit<T, 'id'>): Promise<T>;

  /**
   * Update an existing record
   * @param id - The ID of the record to update
   * @param value - Partial value to update
   * @returns Promise resolving to the updated value
   */
  update(_id: string, _value: Partial<T>): Promise<T>;

  /**
   * Delete a record by ID
   * @param id - The ID of the record to delete
   */
  delete(_id: string): Promise<void>;

  /**
   * Find a record by ID
   * @param id - The ID to find
   * @returns Promise resolving to the record or null
   */
  findById(_id: string): Promise<T | null>;

  /**
   * Count records matching a filter
   * @param filter - Optional filter
   * @returns Promise resolving to the count
   */
  count(_filter?: QueryFilter<T>): Promise<number>;
}

/**
 * IndexedDB specific options
 */
export interface IndexedDBOptions {
  /**
   * Database name
   */
  dbName: string;

  /**
   * Store name
   */
  storeName: string;

  /**
   * Database version
   */
  version?: number;

  /**
   * Indexes to create
   */
  indexes?: IndexDefinition[];
}

export interface IndexDefinition {
  name: string;
  keyPath: string | string[];
  unique?: boolean;
  multiEntry?: boolean;
}
