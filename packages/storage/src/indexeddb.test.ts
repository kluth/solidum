import { describe, it, expect, runTests } from '@sldm/testing';
import fakeIndexedDB from 'fake-indexeddb';

import { IndexedDBAdapter } from './indexeddb-storage';

// Setup fake-indexeddb for Node.js environment
if (typeof indexedDB === 'undefined') {
  (global as typeof globalThis & { indexedDB: IDBFactory }).indexedDB = fakeIndexedDB as unknown as IDBFactory;
}

describe('IndexedDBAdapter - Basic Operations', () => {
  it('should set and get a value', async () => {
    const storage = new IndexedDBAdapter({
      dbName: 'test-db',
      storeName: 'test-store',
    });

    await storage.set('key1', 'value1');
    const value = await storage.get('key1');
    expect(value).toBe('value1');
  });

  it('should set and get an object', async () => {
    const storage = new IndexedDBAdapter({
      dbName: 'test-db-2',
      storeName: 'test-store',
    });

    const obj = { name: 'John', age: 30 };
    await storage.set('user', obj);
    const retrieved = await storage.get('user');
    expect(retrieved).toEqual(obj);
  });

  it('should return null for non-existent key', async () => {
    const storage = new IndexedDBAdapter({
      dbName: 'test-db-3',
      storeName: 'test-store',
    });

    const value = await storage.get('nonexistent');
    expect(value).toBe(null);
  });

  it('should check if key exists', async () => {
    const storage = new IndexedDBAdapter({
      dbName: 'test-db-4',
      storeName: 'test-store',
    });

    await storage.set('key1', 'value1');
    const exists = await storage.has('key1');
    expect(exists).toBe(true);

    const notExists = await storage.has('key2');
    expect(notExists).toBe(false);
  });

  it('should remove a key', async () => {
    const storage = new IndexedDBAdapter({
      dbName: 'test-db-5',
      storeName: 'test-store',
    });

    await storage.set('key1', 'value1');
    expect(await storage.has('key1')).toBe(true);

    await storage.remove('key1');
    expect(await storage.has('key1')).toBe(false);
  });

  it('should clear all keys', async () => {
    const storage = new IndexedDBAdapter({
      dbName: 'test-db-6',
      storeName: 'test-store',
    });

    await storage.set('key1', 'value1');
    await storage.set('key2', 'value2');
    await storage.set('key3', 'value3');

    let keys = await storage.keys();
    expect(keys.length).toBe(3);

    await storage.clear();
    keys = await storage.keys();
    expect(keys.length).toBe(0);
  });

  it('should get all keys', async () => {
    const storage = new IndexedDBAdapter({
      dbName: 'test-db-7',
      storeName: 'test-store',
    });

    await storage.clear();
    await storage.set('key1', 'value1');
    await storage.set('key2', 'value2');
    await storage.set('key3', 'value3');

    const keys = await storage.keys();
    expect(keys).toContain('key1');
    expect(keys).toContain('key2');
    expect(keys).toContain('key3');
  });

  it('should handle complex objects', async () => {
    const storage = new IndexedDBAdapter({
      dbName: 'test-db-8',
      storeName: 'test-store',
    });

    const complex = {
      user: {
        name: 'John',
        address: {
          street: '123 Main St',
          city: 'NYC',
        },
      },
      items: [1, 2, 3],
      date: new Date('2024-01-01'),
    };

    await storage.set('complex', complex);
    const retrieved = await storage.get('complex');
    expect(retrieved).toEqual(complex);
  });
});

describe('IndexedDBAdapter - Queryable Operations', () => {
  it('should get all values', async () => {
    const storage = new IndexedDBAdapter({
      dbName: 'test-query-1',
      storeName: 'test-store',
    });

    await storage.clear();
    await storage.set('key1', { id: 1, name: 'John' });
    await storage.set('key2', { id: 2, name: 'Jane' });
    await storage.set('key3', { id: 3, name: 'Bob' });

    const all = await storage.getAll();
    expect(all.length).toBe(3);
  });

  it('should get many values by keys', async () => {
    const storage = new IndexedDBAdapter({
      dbName: 'test-query-2',
      storeName: 'test-store',
    });

    await storage.clear();
    await storage.set('key1', 'value1');
    await storage.set('key2', 'value2');
    await storage.set('key3', 'value3');

    const values = await storage.getMany(['key1', 'key3', 'nonexistent']);
    expect(values.length).toBe(3);
    expect(values[0]).toBe('value1');
    expect(values[1]).toBe('value3');
    expect(values[2]).toBe(null);
  });

  it('should set many values at once', async () => {
    const storage = new IndexedDBAdapter({
      dbName: 'test-query-3',
      storeName: 'test-store',
    });

    await storage.clear();
    await storage.setMany([
      ['key1', 'value1'],
      ['key2', 'value2'],
      ['key3', 'value3'],
    ]);

    const keys = await storage.keys();
    expect(keys.length).toBe(3);
    expect(await storage.get('key1')).toBe('value1');
    expect(await storage.get('key2')).toBe('value2');
  });

  it('should remove many keys at once', async () => {
    const storage = new IndexedDBAdapter({
      dbName: 'test-query-4',
      storeName: 'test-store',
    });

    await storage.clear();
    await storage.set('key1', 'value1');
    await storage.set('key2', 'value2');
    await storage.set('key3', 'value3');
    await storage.set('key4', 'value4');

    await storage.removeMany(['key1', 'key3']);

    expect(await storage.has('key1')).toBe(false);
    expect(await storage.has('key2')).toBe(true);
    expect(await storage.has('key3')).toBe(false);
    expect(await storage.has('key4')).toBe(true);
  });

  it('should query with filter function', async () => {
    interface User {
      id: number;
      name: string;
      age: number;
    }

    const storage = new IndexedDBAdapter<User>({
      dbName: 'test-query-5',
      storeName: 'test-store',
    });

    await storage.clear();
    await storage.set('user1', { id: 1, name: 'John', age: 30 });
    await storage.set('user2', { id: 2, name: 'Jane', age: 25 });
    await storage.set('user3', { id: 3, name: 'Bob', age: 35 });

    const results = await storage.query((user: User) => user.age > 28);
    expect(results.length).toBe(2);
    expect(results.some((u: User) => u.name === 'John')).toBe(true);
    expect(results.some((u: User) => u.name === 'Bob')).toBe(true);
  });

  it('should query with query object', async () => {
    interface User {
      id: number;
      name: string;
      age: number;
    }

    const storage = new IndexedDBAdapter<User>({
      dbName: 'test-query-6',
      storeName: 'test-store',
    });

    await storage.clear();
    await storage.set('user1', { id: 1, name: 'John', age: 30 });
    await storage.set('user2', { id: 2, name: 'Jane', age: 25 });
    await storage.set('user3', { id: 3, name: 'Bob', age: 35 });

    const results = await storage.query({
      where: { name: 'Jane' },
    });

    expect(results.length).toBe(1);
    expect(results[0]).toEqual({ id: 2, name: 'Jane', age: 25 });
  });
});

describe('IndexedDBAdapter - Type Safety', () => {
  it('should preserve types with generic get', async () => {
    interface User {
      name: string;
      age: number;
    }

    const storage = new IndexedDBAdapter({
      dbName: 'test-types-1',
      storeName: 'test-store',
    });

    const user: User = { name: 'John', age: 30 };
    await storage.set('user', user);

    const retrieved = await storage.get<User>('user');
    expect(retrieved).toEqual(user);
  });
});

// Run all tests
runTests();
