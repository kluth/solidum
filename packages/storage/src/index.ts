/**
 * @sldm/storage - Unified storage abstraction for web and databases
 *
 * Provides a consistent API for various storage backends:
 * - localStorage
 * - sessionStorage
 * - In-memory storage
 * - IndexedDB
 * - Database adapters
 *
 * @packageDocumentation
 */

// Synchronous storage types and adapters
export type {
  IStorage,
  StorageType,
  StorageOptions,
  StorableValue,
  StorableObject,
  StorableArray
} from './types';
export { MemoryStorageAdapter } from './memory-storage';
export { LocalStorageAdapter, SessionStorageAdapter } from './web-storage';
export { createStorage } from './factory';

// Asynchronous storage types and adapters
export type {
  IAsyncStorage,
  IQueryableStorage,
  IDatabaseStorage,
  QueryFilter,
  QueryObject,
  RecordWithId,
  IndexedDBOptions,
  IndexDefinition
} from './async-types';
export { IndexedDBAdapter } from './indexeddb-storage';
export { MemoryDatabaseAdapter, BaseDatabaseAdapter } from './database-storage';
