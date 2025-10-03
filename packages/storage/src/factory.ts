import { MemoryStorageAdapter } from './memory-storage';
import type { IStorage, StorageType } from './types';
import { LocalStorageAdapter, SessionStorageAdapter } from './web-storage';

/**
 * Create a storage adapter based on type
 * @param type - The type of storage to create
 * @param prefix - Optional prefix for all keys
 * @returns Storage adapter instance
 */
export function createStorage(
  type: StorageType = 'memory',
  prefix?: string
): IStorage {
  switch (type) {
    case 'local':
      try {
        return new LocalStorageAdapter(prefix);
      } catch {
        console.warn('localStorage not available, falling back to memory storage');
        return new MemoryStorageAdapter(prefix);
      }

    case 'session':
      try {
        return new SessionStorageAdapter(prefix);
      } catch {
        console.warn('sessionStorage not available, falling back to memory storage');
        return new MemoryStorageAdapter(prefix);
      }

    case 'memory':
      return new MemoryStorageAdapter(prefix);

    case 'indexeddb':
      // TODO: Implement IndexedDB adapter
      throw new Error('IndexedDB adapter not yet implemented');

    default:
      throw new Error(`Unknown storage type: ${type}`);
  }
}
