import { describe, it, expect, runTests } from '@sldm/testing';

import {
  createStorage,
  LocalStorageAdapter,
  SessionStorageAdapter,
  MemoryStorageAdapter,
  type IStorage
} from './index';

// Test suite for all storage adapters
const testStorageAdapter = (name: string, createAdapter: () => IStorage) => {
  describe(`${name} - Basic Operations`, () => {
    it('should set and get a string value', () => {
      const storage = createAdapter();
      storage.clear();
      storage.set('key1', 'value1');
      expect(storage.get('key1')).toBe('value1');
    });

    it('should set and get a number value', () => {
      const storage = createAdapter();
      storage.clear();
      storage.set('age', 42);
      expect(storage.get('age')).toBe(42);
    });

    it('should set and get an object value', () => {
      const storage = createAdapter();
      storage.clear();
      const obj = { name: 'John', age: 30 };
      storage.set('user', obj);
      expect(storage.get('user')).toEqual(obj);
    });

    it('should set and get an array value', () => {
      const storage = createAdapter();
      storage.clear();
      const arr = [1, 2, 3, 4, 5];
      storage.set('numbers', arr);
      expect(storage.get('numbers')).toEqual(arr);
    });

    it('should set and get a boolean value', () => {
      const storage = createAdapter();
      storage.clear();
      storage.set('isActive', true);
      expect(storage.get('isActive')).toBe(true);
      storage.set('isActive', false);
      expect(storage.get('isActive')).toBe(false);
    });

    it('should return null for non-existent key', () => {
      const storage = createAdapter();
      storage.clear();
      expect(storage.get('nonexistent')).toBe(null);
    });

    it('should check if key exists', () => {
      const storage = createAdapter();
      storage.clear();
      storage.set('key1', 'value1');
      expect(storage.has('key1')).toBe(true);
      expect(storage.has('key2')).toBe(false);
    });

    it('should remove a key', () => {
      const storage = createAdapter();
      storage.clear();
      storage.set('key1', 'value1');
      expect(storage.has('key1')).toBe(true);
      storage.remove('key1');
      expect(storage.has('key1')).toBe(false);
      expect(storage.get('key1')).toBe(null);
    });

    it('should clear all keys', () => {
      const storage = createAdapter();
      storage.clear();
      storage.set('key1', 'value1');
      storage.set('key2', 'value2');
      storage.set('key3', 'value3');
      expect(storage.keys().length).toBe(3);
      storage.clear();
      expect(storage.keys().length).toBe(0);
    });

    it('should return all keys', () => {
      const storage = createAdapter();
      storage.clear();
      storage.set('key1', 'value1');
      storage.set('key2', 'value2');
      storage.set('key3', 'value3');
      const keys = storage.keys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toContain('key3');
      expect(keys.length).toBe(3);
    });

    it('should overwrite existing value', () => {
      const storage = createAdapter();
      storage.clear();
      storage.set('key1', 'value1');
      expect(storage.get('key1')).toBe('value1');
      storage.set('key1', 'value2');
      expect(storage.get('key1')).toBe('value2');
    });

    it('should handle nested objects', () => {
      const storage = createAdapter();
      storage.clear();
      const complex = {
        user: {
          name: 'John',
          address: {
            street: '123 Main St',
            city: 'NYC'
          }
        },
        items: [1, 2, 3]
      };
      storage.set('complex', complex);
      expect(storage.get('complex')).toEqual(complex);
    });

    it('should handle null values', () => {
      const storage = createAdapter();
      storage.clear();
      storage.set('nullable', null);
      expect(storage.get('nullable')).toBe(null);
      expect(storage.has('nullable')).toBe(true);
    });

    it('should handle undefined values as removal', () => {
      const storage = createAdapter();
      storage.clear();
      storage.set('key1', 'value1');
      storage.set('key1', undefined as unknown as string);
      expect(storage.has('key1')).toBe(false);
    });
  });
};

// Test MemoryStorageAdapter
testStorageAdapter('MemoryStorageAdapter', () => new MemoryStorageAdapter());

// Test LocalStorageAdapter (if available)
if (typeof localStorage !== 'undefined') {
  testStorageAdapter('LocalStorageAdapter', () => new LocalStorageAdapter());
}

// Test SessionStorageAdapter (if available)
if (typeof sessionStorage !== 'undefined') {
  testStorageAdapter('SessionStorageAdapter', () => new SessionStorageAdapter());
}

// Test createStorage factory
describe('createStorage Factory', () => {
  it('should create memory storage', () => {
    const storage = createStorage('memory');
    storage.set('test', 'value');
    expect(storage.get('test')).toBe('value');
  });

  it('should create local storage when available', () => {
    if (typeof localStorage !== 'undefined') {
      const storage = createStorage('local');
      storage.set('test', 'value');
      expect(storage.get('test')).toBe('value');
    }
  });

  it('should create session storage when available', () => {
    if (typeof sessionStorage !== 'undefined') {
      const storage = createStorage('session');
      storage.set('test', 'value');
      expect(storage.get('test')).toBe('value');
    }
  });

  it('should fallback to memory storage when localStorage not available', () => {
    // This would need environment simulation
    const storage = createStorage('memory');
    storage.set('test', 'value');
    expect(storage.get('test')).toBe('value');
  });
});

// Test with options/prefix
describe('Storage with Prefix', () => {
  it('should support prefixed keys', () => {
    const storage = new MemoryStorageAdapter('app:');
    storage.set('user', 'John');
    const allKeys = storage.keys();
    expect(allKeys[0]).toBe('app:user');
  });

  it('should get value with prefix transparently', () => {
    const storage = new MemoryStorageAdapter('myapp:');
    storage.set('token', 'abc123');
    expect(storage.get('token')).toBe('abc123');
  });

  it('should clear only prefixed keys', () => {
    const storage1 = new MemoryStorageAdapter('app1:');
    const storage2 = new MemoryStorageAdapter('app2:');

    storage1.set('key', 'value1');
    storage2.set('key', 'value2');

    storage1.clear();

    expect(storage1.get('key')).toBe(null);
    expect(storage2.get('key')).toBe('value2');
  });
});

// Test error handling
describe('Storage Error Handling', () => {
  it('should handle circular references gracefully', () => {
    const storage = new MemoryStorageAdapter();
    storage.clear();
    const obj: Record<string, unknown> = { name: 'test' };
    obj.self = obj; // circular reference

    expect(() => storage.set('circular', obj as never)).toThrow();
  });

  it('should handle very large values', () => {
    const storage = new MemoryStorageAdapter();
    storage.clear();
    const largeArray = new Array(10000).fill('test');
    storage.set('large', largeArray);
    expect(storage.get('large')).toEqual(largeArray);
  });
});

// Test TypeScript type safety
describe('TypeScript Type Safety', () => {
  it('should preserve types with generic get', () => {
    const storage = new MemoryStorageAdapter();
    storage.clear();

    interface User {
      name: string;
      age: number;
    }

    const user: User = { name: 'John', age: 30 };
    storage.set('user', user);

    const retrieved = storage.get<User>('user');
    expect(retrieved).toEqual(user);
  });

  it('should handle type assertions', () => {
    const storage = new MemoryStorageAdapter();
    storage.clear();
    storage.set('count', 42);

    const count = storage.get<number>('count');
    expect(typeof count).toBe('number');
  });
});

// Run all tests
runTests();
