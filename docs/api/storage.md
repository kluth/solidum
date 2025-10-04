# Storage API Reference

Vollst�ndige API-Dokumentation f�r @sldm/storage.

## Table of Contents

- [Synchronous Storage](#synchronous-storage)
  - [IStorage Interface](#istorage-interface)
  - [createStorage()](#createstorage)
  - [LocalStorageAdapter](#localstorageadapter)
  - [SessionStorageAdapter](#sessionstorageadapter)
  - [MemoryStorageAdapter](#memorystorageadapter)
- [Asynchronous Storage](#asynchronous-storage)
  - [IAsyncStorage Interface](#iasyncstorage-interface)
  - [IndexedDBAdapter](#indexeddbadapter)
  - [IQueryableStorage Interface](#iqueryablestorage-interface)
  - [IDatabaseStorage Interface](#idatabasestorage-interface)
- [Types](#types)
- [Error Handling](#error-handling)

## Synchronous Storage

### IStorage Interface

Basis-Interface f�r synchrone Storage-Adapter.

**Interface:**

```typescript
interface IStorage {
  get<T extends StorableValue>(key: string): T | null;
  set<T extends StorableValue>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
  has(key: string): boolean;
  keys(): string[];
}
```

**Methods:**

#### get()

Ruft einen Wert aus dem Storage ab.

```typescript
get<T extends StorableValue>(key: string): T | null
```

**Parameters:**

- `key` - Der Schl�ssel des abzurufenden Werts

**Returns:** Der gespeicherte Wert oder `null` wenn nicht gefunden

**Example:**

```typescript
const storage = createStorage({ adapter: localStorageAdapter() });

const user = storage.get<User>('user');
if (user) {
  console.log(user.name);
}
```

---

#### set()

Speichert einen Wert im Storage.

```typescript
set<T extends StorableValue>(key: string, value: T): void
```

**Parameters:**

- `key` - Der Schl�ssel unter dem gespeichert werden soll
- `value` - Der zu speichernde Wert

**Example:**

```typescript
storage.set('user', {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
});

storage.set('theme', 'dark');
storage.set('count', 42);
```

---

#### remove()

Entfernt einen Wert aus dem Storage.

```typescript
remove(key: string): void
```

**Parameters:**

- `key` - Der zu entfernende Schl�ssel

**Example:**

```typescript
storage.remove('user');
```

---

#### clear()

L�scht alle Werte aus dem Storage.

```typescript
clear(): void
```

**Example:**

```typescript
storage.clear();
```

---

#### has()

Pr�ft ob ein Schl�ssel im Storage existiert.

```typescript
has(key: string): boolean
```

**Parameters:**

- `key` - Der zu pr�fende Schl�ssel

**Returns:** `true` wenn der Schl�ssel existiert

**Example:**

```typescript
if (storage.has('user')) {
  const user = storage.get('user');
}
```

---

#### keys()

Gibt alle Schl�ssel im Storage zur�ck.

```typescript
keys(): string[]
```

**Returns:** Array aller Schl�ssel

**Example:**

```typescript
const allKeys = storage.keys();
console.log('Stored keys:', allKeys);
```

---

### createStorage()

Factory-Funktion zum Erstellen einer Storage-Instanz.

**Signature:**

```typescript
function createStorage(options: {
  adapter: IStorage;
  prefix?: string;
  serialize?: boolean;
}): IStorage;
```

**Parameters:**

```typescript
interface StorageOptions {
  adapter: IStorage; // Storage-Adapter (localStorage, sessionStorage, etc.)
  prefix?: string; // Prefix f�r alle Keys (default: '')
  serialize?: boolean; // JSON Serialisierung (default: true)
}
```

**Returns:** `IStorage` - Storage-Instanz

**Example:**

```typescript
import { createStorage, localStorageAdapter } from '@sldm/storage';

const storage = createStorage({
  adapter: localStorageAdapter(),
  prefix: 'myapp:',
  serialize: true,
});

storage.set('user', { name: 'John' });
// Tats�chlicher Key in localStorage: "myapp:user"
```

---

### LocalStorageAdapter

Adapter f�r `window.localStorage`.

**Factory Function:**

```typescript
function localStorageAdapter(): IStorage;
```

**Example:**

```typescript
import { LocalStorageAdapter } from '@sldm/storage';

const storage = new LocalStorageAdapter();

storage.set('theme', 'dark');
const theme = storage.get('theme');
```

**Features:**

-  Persistent (�berlebt Browser-Neustart)
-  Shared zwischen Tabs
- L Synchronous only
- =� ~5-10MB Limit

---

### SessionStorageAdapter

Adapter f�r `window.sessionStorage`.

**Factory Function:**

```typescript
function sessionStorageAdapter(): IStorage;
```

**Example:**

```typescript
import { SessionStorageAdapter } from '@sldm/storage';

const storage = new SessionStorageAdapter();

storage.set('tempData', {
  /* ... */
});
```

**Features:**

-  Session-basiert (gel�scht beim Tab-Schlie�en)
- L NICHT shared zwischen Tabs
- L Synchronous only
- =� ~5-10MB Limit

---

### MemoryStorageAdapter

In-Memory Storage (RAM).

**Factory Function:**

```typescript
function memoryStorageAdapter(): IStorage;
```

**Example:**

```typescript
import { MemoryStorageAdapter } from '@sldm/storage';

const storage = new MemoryStorageAdapter();

storage.set('cache', largeObject);
```

**Features:**

-  Sehr schnell
-  Keine Gr��enbeschr�nkung
- L Nicht persistent (verloren bei Reload)
- L Nicht shared
- =� Gut f�r: Caching, Testing

---

## Asynchronous Storage

### IAsyncStorage Interface

Interface f�r asynchrone Storage-Adapter.

**Interface:**

```typescript
interface IAsyncStorage {
  get<T extends StorableValue>(key: string): Promise<T | null>;
  set<T extends StorableValue>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  keys(): Promise<string[]>;
}
```

Alle Methods sind identisch zu `IStorage`, nur asynchron.

---

### IndexedDBAdapter

Adapter f�r IndexedDB (Browser-Datenbank).

**Class:**

```typescript
class IndexedDBAdapter implements IAsyncStorage {
  constructor(options: IndexedDBOptions);
}
```

**Options:**

```typescript
interface IndexedDBOptions {
  dbName: string; // Datenbank-Name
  storeName: string; // Object Store Name
  version?: number; // DB Version (default: 1)
  indexes?: IndexDefinition[]; // Indexes
}

interface IndexDefinition {
  name: string; // Index-Name
  keyPath: string | string[]; // Key Path
  unique?: boolean; // Eindeutig?
  multiEntry?: boolean; // Multi-Entry?
}
```

**Example:**

```typescript
import { IndexedDBAdapter } from '@sldm/storage';

const storage = new IndexedDBAdapter({
  dbName: 'myapp',
  storeName: 'cache',
  version: 1,
  indexes: [
    { name: 'timestamp', keyPath: 'timestamp' },
    { name: 'category', keyPath: 'category' },
  ],
});

// Async operations
await storage.set('user', { name: 'John', timestamp: Date.now() });
const user = await storage.get('user');
```

**Features:**

-  Gro�e Storage-Kapazit�t (~50MB+)
-  Strukturierte Daten
-  Indexes f�r schnelle Queries
-  Transaktionen
- L Async only
- =� Gut f�r: Offline-Apps, gro�e Datasets

---

### IQueryableStorage Interface

Erweiterte Interface f�r querybare Storage-Backends.

**Interface:**

```typescript
interface IQueryableStorage<T extends StorableValue = StorableValue> extends IAsyncStorage {
  query(filter: QueryFilter<T>): Promise<T[]>;
  getAll(): Promise<T[]>;
  getMany(keys: string[]): Promise<(T | null)[]>;
  setMany(entries: [string, T][]): Promise<void>;
  removeMany(keys: string[]): Promise<void>;
}
```

**Methods:**

#### query()

Filtert Werte nach Kriterien.

```typescript
query(filter: QueryFilter<T>): Promise<T[]>
```

**Parameters:**

```typescript
type QueryFilter<T> = ((value: T) => boolean) | QueryObject<T>;

interface QueryObject<T> {
  where?: Partial<T>; // Filter-Bedingungen
  orderBy?: keyof T; // Sortier-Feld
  order?: 'asc' | 'desc'; // Sortier-Richtung
  limit?: number; // Max. Anzahl
  offset?: number; // Skip Anzahl
}
```

**Example:**

```typescript
// Function filter
const activeUsers = await storage.query(user => user.active === true);

// Object filter
const results = await storage.query({
  where: { status: 'active' },
  orderBy: 'createdAt',
  order: 'desc',
  limit: 10,
});
```

---

#### getAll()

Gibt alle Werte zur�ck.

```typescript
getAll(): Promise<T[]>
```

**Example:**

```typescript
const allUsers = await storage.getAll();
```

---

#### getMany()

Ruft mehrere Werte gleichzeitig ab.

```typescript
getMany(keys: string[]): Promise<(T | null)[]>
```

**Example:**

```typescript
const values = await storage.getMany(['user1', 'user2', 'user3']);
```

---

#### setMany()

Speichert mehrere Werte gleichzeitig.

```typescript
setMany(entries: [string, T][]): Promise<void>
```

**Example:**

```typescript
await storage.setMany([
  ['user1', { name: 'John' }],
  ['user2', { name: 'Jane' }],
  ['user3', { name: 'Bob' }],
]);
```

---

#### removeMany()

Entfernt mehrere Schl�ssel gleichzeitig.

```typescript
removeMany(keys: string[]): Promise<void>
```

**Example:**

```typescript
await storage.removeMany(['user1', 'user2', 'user3']);
```

---

### IDatabaseStorage Interface

Datenbank-�hnliche Interface mit CRUD-Operationen.

**Interface:**

```typescript
interface IDatabaseStorage<T extends RecordWithId = RecordWithId> extends IQueryableStorage<T> {
  create(value: Omit<T, 'id'>): Promise<T>;
  update(id: string, value: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<T | null>;
  count(filter?: QueryFilter<T>): Promise<number>;
}

interface RecordWithId {
  id: string;
  [key: string]: any;
}
```

**Methods:**

#### create()

Erstellt einen neuen Record mit auto-generierter ID.

```typescript
create(value: Omit<T, 'id'>): Promise<T>
```

**Example:**

```typescript
const newUser = await db.create({
  name: 'John Doe',
  email: 'john@example.com',
});
console.log(newUser.id); // Auto-generated
```

---

#### update()

Aktualisiert einen existierenden Record.

```typescript
update(id: string, value: Partial<T>): Promise<T>
```

**Example:**

```typescript
const updated = await db.update('user-123', {
  name: 'Jane Doe',
});
```

---

#### delete()

L�scht einen Record.

```typescript
delete(id: string): Promise<void>
```

**Example:**

```typescript
await db.delete('user-123');
```

---

#### findById()

Findet einen Record anhand der ID.

```typescript
findById(id: string): Promise<T | null>
```

**Example:**

```typescript
const user = await db.findById('user-123');
if (user) {
  console.log(user.name);
}
```

---

#### count()

Z�hlt Records mit optionalem Filter.

```typescript
count(filter?: QueryFilter<T>): Promise<number>
```

**Example:**

```typescript
// Alle Records
const total = await db.count();

// Mit Filter
const activeCount = await db.count({
  where: { active: true },
});
```

---

## Types

### StorableValue

Union-Type aller speicherbaren Werte.

```typescript
type StorableValue = string | number | boolean | null | Date | StorableArray | StorableObject;

interface StorableObject {
  [key: string]: StorableValue;
}

interface StorableArray extends Array<StorableValue> {}
```

**Example:**

```typescript
// G�ltige Werte
const str: StorableValue = 'hello';
const num: StorableValue = 42;
const bool: StorableValue = true;
const date: StorableValue = new Date();
const obj: StorableValue = { name: 'John', age: 30 };
const arr: StorableValue = [1, 2, 3, 'four'];

// Ung�ltige Werte
const fn: StorableValue = () => {}; // L Error
const symbol: StorableValue = Symbol(); // L Error
```

---

### StorageType

Enum der verf�gbaren Storage-Typen.

```typescript
type StorageType = 'local' | 'session' | 'memory' | 'indexeddb';
```

---

### StorageOptions

Konfigurations-Optionen f�r Storage.

```typescript
interface StorageOptions {
  prefix?: string; // Key-Prefix (default: '')
  serialize?: boolean; // JSON Serialisierung (default: true)
}
```

**Example:**

```typescript
const storage = createStorage({
  adapter: localStorageAdapter(),
  prefix: 'app:',
  serialize: true,
});

storage.set('user', { name: 'John' });
// localStorage key: "app:user"
// localStorage value: '{"name":"John"}'
```

---

### IndexedDBOptions

Konfigurations-Optionen f�r IndexedDB.

```typescript
interface IndexedDBOptions {
  dbName: string; // Datenbank-Name
  storeName: string; // Store-Name
  version?: number; // Version (default: 1)
  indexes?: IndexDefinition[];
}

interface IndexDefinition {
  name: string; // Index-Name
  keyPath: string | string[];
  unique?: boolean; // Eindeutig? (default: false)
  multiEntry?: boolean; // Multi-Entry? (default: false)
}
```

**Example:**

```typescript
const options: IndexedDBOptions = {
  dbName: 'myapp',
  storeName: 'users',
  version: 2,
  indexes: [
    { name: 'email', keyPath: 'email', unique: true },
    { name: 'age', keyPath: 'age' },
    { name: 'tags', keyPath: 'tags', multiEntry: true },
  ],
};
```

---

### QueryFilter

Filter f�r Queries.

```typescript
type QueryFilter<T extends StorableValue> = ((value: T) => boolean) | QueryObject<T>;

interface QueryObject<T extends StorableValue> {
  where?: T extends StorableObject ? Partial<T> : never;
  orderBy?: T extends StorableObject ? keyof T : never;
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}
```

**Example:**

```typescript
// Function filter
const filter1: QueryFilter<User> = user => user.age > 18;

// Object filter
const filter2: QueryFilter<User> = {
  where: { status: 'active', role: 'admin' },
  orderBy: 'createdAt',
  order: 'desc',
  limit: 20,
  offset: 0,
};
```

---

### RecordWithId

Base-Type f�r Database Records.

```typescript
interface RecordWithId extends StorableObject {
  id: string;
}
```

**Example:**

```typescript
interface User extends RecordWithId {
  name: string;
  email: string;
  age: number;
}

const user: User = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
};
```

---

## Error Handling

### Storage Errors

```typescript
try {
  storage.set('key', value);
} catch (error) {
  if (error instanceof Error) {
    if (error.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded');
    } else {
      console.error('Storage error:', error.message);
    }
  }
}
```

### Async Storage Errors

```typescript
try {
  await asyncStorage.set('key', value);
} catch (error) {
  if (error instanceof Error) {
    console.error('Async storage error:', error.message);
  }
}
```

### IndexedDB Errors

```typescript
try {
  const storage = new IndexedDBAdapter({
    dbName: 'myapp',
    storeName: 'cache',
  });

  await storage.set('key', value);
} catch (error) {
  if (error instanceof Error) {
    if (error.name === 'VersionError') {
      console.error('IndexedDB version conflict');
    } else if (error.name === 'QuotaExceededError') {
      console.error('IndexedDB quota exceeded');
    } else {
      console.error('IndexedDB error:', error.message);
    }
  }
}
```

---

## Common Patterns

### Adapter Selection

```typescript
import {
  createStorage,
  localStorageAdapter,
  sessionStorageAdapter,
  memoryStorageAdapter,
} from '@sldm/storage';

function createAppStorage(type: 'persistent' | 'session' | 'memory') {
  let adapter;

  switch (type) {
    case 'persistent':
      adapter = localStorageAdapter();
      break;
    case 'session':
      adapter = sessionStorageAdapter();
      break;
    case 'memory':
      adapter = memoryStorageAdapter();
      break;
  }

  return createStorage({
    adapter,
    prefix: 'app:',
  });
}
```

### Migration Pattern

```typescript
async function migrateStorage(from: IStorage, to: IAsyncStorage): Promise<void> {
  const keys = from.keys();

  for (const key of keys) {
    const value = from.get(key);
    if (value !== null) {
      await to.set(key, value);
    }
  }
}

// Usage
const oldStorage = createStorage({ adapter: localStorageAdapter() });
const newStorage = new IndexedDBAdapter({ dbName: 'app', storeName: 'data' });

await migrateStorage(oldStorage, newStorage);
```

### Batch Operations

```typescript
async function batchUpdate<T>(
  storage: IQueryableStorage<T>,
  updates: [string, T][]
): Promise<void> {
  // More efficient than individual sets
  await storage.setMany(updates);
}

// Usage
await batchUpdate(storage, [
  ['user1', { name: 'John' }],
  ['user2', { name: 'Jane' }],
  ['user3', { name: 'Bob' }],
]);
```

---

## Siehe auch

- [Storage Guide](/docs/guide/storage.md)
- [Core Primitives](/docs/guide/core.md)
- [Examples](/docs/examples/storage.md)
