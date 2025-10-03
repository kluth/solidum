# @sldm/storage

> Unified storage abstraction for localStorage, sessionStorage, IndexedDB, and databases

A lightweight, type-safe storage abstraction layer that provides a consistent API across different storage backends. Perfect for web applications that need flexible storage options with a unified interface.

## Features

- **Unified API**: Same interface for all storage types
- **Type-safe**: Full TypeScript support with generics
- **Multiple backends**: localStorage, sessionStorage, in-memory, and more
- **Prefix support**: Namespace your keys to avoid conflicts
- **Auto-serialization**: Automatic JSON serialization/deserialization
- **SSR-friendly**: Memory storage for server-side rendering
- **Zero dependencies**: Core package has no runtime dependencies
- **Fully tested**: 100% test coverage with TDD approach

## Installation

```bash
npm install @sldm/storage
# or
pnpm add @sldm/storage
# or
yarn add @sldm/storage
```

## Quick Start

```typescript
import { createStorage } from '@sldm/storage';

// Create a storage instance
const storage = createStorage('local'); // or 'session', 'memory'

// Store values
storage.set('user', { name: 'John', age: 30 });
storage.set('token', 'abc123');

// Retrieve values
const user = storage.get('user'); // { name: 'John', age: 30 }
const token = storage.get('token'); // 'abc123'

// Check if key exists
if (storage.has('user')) {
  console.log('User data found');
}

// Remove a key
storage.remove('token');

// Clear all keys
storage.clear();

// Get all keys
const keys = storage.keys(); // ['user']
```

## Storage Types

### LocalStorage

```typescript
import { LocalStorageAdapter } from '@sldm/storage';

const storage = new LocalStorageAdapter();
storage.set('key', 'value');
```

### SessionStorage

```typescript
import { SessionStorageAdapter } from '@sldm/storage';

const storage = new SessionStorageAdapter();
storage.set('key', 'value');
```

### Memory Storage

Perfect for testing or SSR environments:

```typescript
import { MemoryStorageAdapter } from '@sldm/storage';

const storage = new MemoryStorageAdapter();
storage.set('key', 'value');
```

### Using the Factory

The factory automatically falls back to memory storage if the requested storage is unavailable:

```typescript
import { createStorage } from '@sldm/storage';

// Automatically falls back to memory storage on server
const storage = createStorage('local');
```

## Advanced Usage

### Type Safety

```typescript
interface User {
  name: string;
  age: number;
  email: string;
}

const storage = createStorage('local');

// Type-safe storage
storage.set<User>('user', { name: 'John', age: 30, email: 'john@example.com' });

// Type-safe retrieval
const user = storage.get<User>('user');
// user is typed as User | null
```

### Prefixed Keys

Avoid key conflicts by using prefixes:

```typescript
import { LocalStorageAdapter } from '@sldm/storage';

// App-specific storage
const appStorage = new LocalStorageAdapter('myapp:');
appStorage.set('user', { name: 'John' });
// Stores as 'myapp:user' in localStorage

// Component-specific storage
const componentStorage = new LocalStorageAdapter('myapp:component:');
componentStorage.set('state', { count: 0 });
// Stores as 'myapp:component:state'

// Clear only clears prefixed keys
appStorage.clear(); // Only clears 'myapp:*' keys
```

### Complex Data Types

Automatically handles serialization:

```typescript
const storage = createStorage('local');

// Objects
storage.set('config', {
  theme: 'dark',
  notifications: true,
  settings: {
    fontSize: 16,
    language: 'en'
  }
});

// Arrays
storage.set('items', [1, 2, 3, 4, 5]);

// Nested structures
storage.set('data', {
  users: [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ],
  metadata: {
    total: 2,
    page: 1
  }
});
```

## API Reference

### IStorage Interface

All storage adapters implement this interface:

```typescript
interface IStorage {
  get<T = any>(key: string): T | null;
  set<T = any>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
  has(key: string): boolean;
  keys(): string[];
}
```

### Methods

#### `get<T>(key: string): T | null`

Retrieve a value from storage. Returns `null` if the key doesn't exist.

```typescript
const value = storage.get('key');
const user = storage.get<User>('user');
```

#### `set<T>(key: string, value: T): void`

Store a value. Automatically serializes to JSON.

```typescript
storage.set('key', 'value');
storage.set('user', { name: 'John' });
```

**Note**: Setting a value to `undefined` will remove the key.

#### `remove(key: string): void`

Remove a key from storage.

```typescript
storage.remove('key');
```

#### `clear(): void`

Remove all keys from storage. If a prefix is set, only removes prefixed keys.

```typescript
storage.clear();
```

#### `has(key: string): boolean`

Check if a key exists in storage.

```typescript
if (storage.has('user')) {
  // Key exists
}
```

#### `keys(): string[]`

Get all keys in storage. Returns full keys including prefix if set.

```typescript
const allKeys = storage.keys();
```

### createStorage(type, prefix?)

Factory function to create storage instances with automatic fallback.

```typescript
function createStorage(
  type: 'local' | 'session' | 'memory' | 'indexeddb',
  prefix?: string
): IStorage
```

**Parameters:**
- `type`: Storage type to create
- `prefix`: Optional prefix for all keys

**Returns:** Storage instance implementing `IStorage`

## Use Cases

### User Preferences

```typescript
const preferences = createStorage('local', 'prefs:');

preferences.set('theme', 'dark');
preferences.set('language', 'en');
preferences.set('notifications', true);
```

### Session Management

```typescript
const session = createStorage('session', 'auth:');

session.set('token', 'eyJhbGc...');
session.set('user', { id: 1, name: 'John' });
session.set('expiresAt', Date.now() + 3600000);
```

### Shopping Cart

```typescript
const cart = createStorage('local', 'cart:');

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

const items = cart.get<CartItem[]>('items') || [];
items.push({ id: 1, name: 'Product', quantity: 1, price: 29.99 });
cart.set('items', items);
```

### Form State Persistence

```typescript
const formStorage = createStorage('session', 'form:checkout:');

// Auto-save form data
formStorage.set('step1', {
  email: 'user@example.com',
  name: 'John Doe'
});

// Restore on page reload
const savedData = formStorage.get('step1');
```

## Error Handling

The storage adapters handle errors gracefully:

```typescript
const storage = createStorage('local');

// Circular references throw an error
const obj: any = { name: 'test' };
obj.self = obj;

try {
  storage.set('circular', obj);
} catch (error) {
  console.error('Failed to serialize:', error);
}
```

## Browser Support

- **localStorage**: All modern browsers
- **sessionStorage**: All modern browsers
- **MemoryStorage**: Works everywhere (Node.js, browsers, SSR)

## Coming Soon

- **IndexedDB adapter**: For large data storage
- **Database adapters**: SQL and NoSQL database support
- **Async API**: Promise-based API for async storage backends
- **Encryption**: Built-in encryption support
- **Compression**: Automatic compression for large values
- **Expiration**: TTL support for automatic cleanup

## License

MIT © Matthias Kluth

## Links

- [Documentation](https://kluth.github.io/solidum)
- [GitHub](https://github.com/kluth/solidum)
- [Issues](https://github.com/kluth/solidum/issues)
