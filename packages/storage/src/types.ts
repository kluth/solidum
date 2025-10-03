/**
 * Storable value types for synchronous storage
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
 * Storage interface that all adapters must implement
 */
export interface IStorage {
  /**
   * Get a value from storage
   * @param key - The key to retrieve
   * @returns The value or null if not found
   */
  get<T extends StorableValue>(_key: string): T | null;

  /**
   * Set a value in storage
   * @param key - The key to set
   * @param value - The value to store
   */
  set<T extends StorableValue>(_key: string, _value: T): void;

  /**
   * Remove a value from storage
   * @param key - The key to remove
   */
  remove(_key: string): void;

  /**
   * Clear all values from storage
   */
  clear(): void;

  /**
   * Check if a key exists in storage
   * @param key - The key to check
   * @returns True if the key exists
   */
  has(_key: string): boolean;

  /**
   * Get all keys in storage
   * @returns Array of all keys
   */
  keys(): string[];
}

/**
 * Storage type options
 */
export type StorageType = 'local' | 'session' | 'memory' | 'indexeddb';

/**
 * Storage configuration options
 */
export interface StorageOptions {
  /**
   * Prefix to add to all keys
   */
  prefix?: string;

  /**
   * Whether to use JSON serialization (default: true)
   */
  serialize?: boolean;
}
