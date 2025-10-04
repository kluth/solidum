# Storage Guide

Der @sldm/storage bietet eine einheitliche API für verschiedene Storage-Backends mit Reaktivität und Type-Safety.

## Inhaltsverzeichnis

- [Installation](#installation)
- [Grundkonzepte](#grundkonzepte)
- [Quick Start](#quick-start)
- [Storage Adapter](#storage-adapter)
- [Reaktive Storage](#reaktive-storage)
- [Erweiterte Features](#erweiterte-features)
- [Best Practices](#best-practices)
- [Beispiele](#beispiele)

## Installation

```bash
pnpm add @sldm/storage
# oder
solidum add storage
```

## Grundkonzepte

### Storage Abstraction

@sldm/storage bietet eine einheitliche Schnittstelle für:

- **localStorage** - Browser-basierter Key-Value Storage
- **sessionStorage** - Session-basierter Storage
- **IndexedDB** - Browser-Datenbank für große Datenmengen
- **Memory** - In-Memory Storage für Tests
- **Custom Adapters** - Eigene Implementierungen

### Vorteile

✅ **Einheitliche API** - Gleicher Code für verschiedene Backends
✅ **Type-Safe** - Vollständige TypeScript-Unterstützung
✅ **Reaktiv** - Automatische UI-Updates bei Änderungen
✅ **Serialisierung** - Automatische JSON-Konvertierung
✅ **Versionierung** - Schema-Migration Support
✅ **Encryption** - Optional verschlüsselte Daten

## Quick Start

### LocalStorage Adapter

```typescript
import { createStorage, localStorageAdapter } from '@sldm/storage';

// Storage erstellen
const storage = createStorage({
  adapter: localStorageAdapter(),
  prefix: 'myapp:', // Optional: Präfix für Keys
});

// Daten speichern
await storage.set('user', { name: 'Max', age: 30 });

// Daten abrufen
const user = await storage.get('user');
console.log(user); // { name: 'Max', age: 30 }

// Daten löschen
await storage.remove('user');

// Alle Keys abrufen
const keys = await storage.keys();

// Alles löschen
await storage.clear();
```

### Mit TypeScript

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  settings: UserSettings;
}

interface UserSettings {
  theme: 'light' | 'dark';
  language: 'de' | 'en';
  notifications: boolean;
}

// Type-safe Storage
const userStorage = createStorage<User>({
  adapter: localStorageAdapter(),
  prefix: 'users:',
});

// TypeScript kennt die Typen
const user = await userStorage.get('current');
console.log(user?.settings.theme); // ✓ Type-safe
```

## Storage Adapter

### LocalStorage

Browser localStorage - persistiert dauerhaft:

```typescript
import { localStorageAdapter } from '@sldm/storage';

const storage = createStorage({
  adapter: localStorageAdapter(),
  prefix: 'app:',
});

// Speichert: localStorage['app:user'] = '{"name":"Max"}'
await storage.set('user', { name: 'Max' });
```

### SessionStorage

Browser sessionStorage - nur für aktuelle Session:

```typescript
import { sessionStorageAdapter } from '@sldm/storage';

const storage = createStorage({
  adapter: sessionStorageAdapter(),
});

// Daten bleiben nur bis Tab geschlossen wird
await storage.set('tempData', { value: 123 });
```

### IndexedDB

Für große Datenmengen und komplexe Queries:

```typescript
import { indexedDBAdapter } from '@sldm/storage';

const storage = createStorage({
  adapter: indexedDBAdapter({
    database: 'myapp',
    store: 'users',
    version: 1,
  }),
});

// Kann Megabytes an Daten speichern
await storage.set('largeDataset', hugeArray);

// Mit Indizes
const storage = createStorage({
  adapter: indexedDBAdapter({
    database: 'myapp',
    store: 'users',
    indexes: [
      { name: 'email', unique: true },
      { name: 'age', unique: false },
    ],
  }),
});

// Query by Index
const users = await storage.query({ index: 'age', value: 30 });
```

### Memory Adapter

Für Tests und Server-Side Rendering:

```typescript
import { memoryAdapter } from '@sldm/storage';

const storage = createStorage({
  adapter: memoryAdapter(),
});

// Daten nur im RAM, nicht persistiert
await storage.set('test', { value: 123 });
```

### Custom Adapter

Eigenen Adapter erstellen:

```typescript
import { StorageAdapter } from '@sldm/storage';

class RedisAdapter implements StorageAdapter {
  constructor(private redis: RedisClient) {}

  async get(key: string): Promise<any> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any): Promise<void> {
    await this.redis.set(key, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async clear(): Promise<void> {
    await this.redis.flushdb();
  }

  async keys(): Promise<string[]> {
    return await this.redis.keys('*');
  }

  async has(key: string): Promise<boolean> {
    return (await this.redis.exists(key)) === 1;
  }
}

// Verwendung
const storage = createStorage({
  adapter: new RedisAdapter(redisClient),
});
```

## Reaktive Storage

### Mit Solidum Reaktivität

Storage-Werte als reaktive Atoms:

```typescript
import { createReactiveStorage } from '@sldm/storage';
import { effect } from '@sldm/core';

const storage = createReactiveStorage({
  adapter: localStorageAdapter(),
});

// Reaktiver Wert
const user = storage.atom('user', { name: 'Max', age: 30 });

// UI aktualisiert sich automatisch
effect(() => {
  console.log('User:', user());
});

// Änderung triggert Effect
user({ name: 'Anna', age: 25 });
```

### Komponente mit reaktivem Storage

```typescript
import { createElement } from '@sldm/core';
import { createReactiveStorage } from '@sldm/storage';

const storage = createReactiveStorage({
  adapter: localStorageAdapter(),
  prefix: 'settings:',
});

function SettingsPage() {
  const theme = storage.atom('theme', 'light');
  const language = storage.atom('language', 'de');
  const notifications = storage.atom('notifications', true);

  return createElement('div', { class: 'settings' }, [
    createElement('h1', {}, 'Einstellungen'),

    // Theme Switcher
    createElement('div', { class: 'setting' }, [
      createElement('label', {}, 'Theme'),
      createElement(
        'select',
        {
          value: theme(),
          onchange: e => theme(e.target.value),
        },
        [
          createElement('option', { value: 'light' }, 'Hell'),
          createElement('option', { value: 'dark' }, 'Dunkel'),
        ]
      ),
    ]),

    // Language Switcher
    createElement('div', { class: 'setting' }, [
      createElement('label', {}, 'Sprache'),
      createElement(
        'select',
        {
          value: language(),
          onchange: e => language(e.target.value),
        },
        [
          createElement('option', { value: 'de' }, 'Deutsch'),
          createElement('option', { value: 'en' }, 'English'),
        ]
      ),
    ]),

    // Notifications Toggle
    createElement('div', { class: 'setting' }, [
      createElement('label', {}, 'Benachrichtigungen'),
      createElement('input', {
        type: 'checkbox',
        checked: notifications(),
        onchange: e => notifications(e.target.checked),
      }),
    ]),
  ]);
}
```

### Storage Sync über Tabs

```typescript
import { createReactiveStorage } from '@sldm/storage';

const storage = createReactiveStorage({
  adapter: localStorageAdapter(),
  sync: true, // Synchronisiert über Tabs
});

const counter = storage.atom('counter', 0);

// In Tab 1
counter(5);

// In Tab 2: counter() ist automatisch 5
```

## Erweiterte Features

### Verschlüsselung

```typescript
import { createStorage, encryptedAdapter } from '@sldm/storage';

const storage = createStorage({
  adapter: encryptedAdapter({
    adapter: localStorageAdapter(),
    key: 'my-secret-key-32-chars-long!!',
    algorithm: 'AES-GCM',
  }),
});

// Daten werden verschlüsselt gespeichert
await storage.set('sensitive', { password: 'geheim' });
```

### Kompression

```typescript
import { createStorage, compressedAdapter } from '@sldm/storage';

const storage = createStorage({
  adapter: compressedAdapter({
    adapter: localStorageAdapter(),
    algorithm: 'gzip',
  }),
});

// Große Daten werden komprimiert
await storage.set('largeArray', new Array(10000).fill({ data: '...' }));
```

### TTL (Time To Live)

```typescript
import { createStorage } from '@sldm/storage';

const storage = createStorage({
  adapter: localStorageAdapter(),
  ttl: 60 * 60 * 1000, // 1 Stunde
});

// Läuft nach 1 Stunde ab
await storage.set('session', { token: 'abc123' });

// Per-Key TTL
await storage.set('tempData', { value: 123 }, { ttl: 5 * 60 * 1000 }); // 5 Min
```

### Versionierung & Migration

```typescript
import { createStorage, withMigrations } from '@sldm/storage';

const storage = createStorage({
  adapter: withMigrations({
    adapter: localStorageAdapter(),
    version: 3,
    migrations: {
      1: data => {
        // v0 -> v1: Füge email hinzu
        return { ...data, email: '' };
      },
      2: data => {
        // v1 -> v2: Rename field
        const { oldName, ...rest } = data;
        return { ...rest, name: oldName };
      },
      3: data => {
        // v2 -> v3: Neue Struktur
        return {
          profile: { name: data.name, email: data.email },
          settings: {},
        };
      },
    },
  }),
});
```

### Batch Operations

```typescript
import { createStorage } from '@sldm/storage';

const storage = createStorage({
  adapter: localStorageAdapter(),
});

// Mehrere Werte auf einmal setzen
await storage.setMany({
  'user:1': { name: 'Max' },
  'user:2': { name: 'Anna' },
  'user:3': { name: 'Tom' },
});

// Mehrere Werte abrufen
const users = await storage.getMany(['user:1', 'user:2', 'user:3']);

// Mehrere Werte löschen
await storage.removeMany(['user:1', 'user:2']);
```

### Namespaces

```typescript
import { createStorage } from '@sldm/storage';

const storage = createStorage({
  adapter: localStorageAdapter(),
});

// Namespaced Storages
const userStorage = storage.namespace('users');
const settingsStorage = storage.namespace('settings');

// Keys werden automatisch geprefixed
await userStorage.set('current', { name: 'Max' }); // users:current
await settingsStorage.set('theme', 'dark'); // settings:theme
```

### Query & Filter

```typescript
import { createStorage } from '@sldm/storage';

const storage = createStorage({
  adapter: indexedDBAdapter({
    database: 'myapp',
    store: 'products',
  }),
});

// Alle Einträge
const all = await storage.getAll();

// Filtern
const filtered = await storage.filter(product => product.price < 100);

// Sortieren
const sorted = await storage.sort((a, b) => b.price - a.price);

// Query mit Index
const results = await storage.query({
  index: 'category',
  value: 'electronics',
});
```

## Best Practices

### 1. Type-Safety nutzen

```typescript
// ✅ Gut: Definiere Typen
interface AppSettings {
  theme: 'light' | 'dark';
  language: string;
}

const settings = createStorage<AppSettings>({
  adapter: localStorageAdapter(),
});

// ✓ Type-safe
const currentTheme = (await settings.get('default'))?.theme;

// ❌ Schlecht: Any-Types
const storage = createStorage({ adapter: localStorageAdapter() });
const data = await storage.get('key'); // any
```

### 2. Defaults verwenden

```typescript
// ✅ Gut: Mit Default-Werten
const theme = (await storage.get('theme')) ?? 'light';

// Oder mit Helper
function getWithDefault<T>(key: string, defaultValue: T): Promise<T> {
  return storage.get(key).then(value => value ?? defaultValue);
}

const theme = await getWithDefault('theme', 'light');
```

### 3. Error Handling

```typescript
// ✅ Gut: Fehler abfangen
try {
  await storage.set('data', largeObject);
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    console.error('Storage voll!');
    // Cleanup alte Daten
    await storage.clear();
  } else {
    console.error('Storage Error:', error);
  }
}
```

### 4. Cleanup

```typescript
// ✅ Gut: Alte Daten regelmäßig löschen
async function cleanup() {
  const keys = await storage.keys();

  for (const key of keys) {
    const data = await storage.get(key);

    // Lösche alte Einträge
    if (data.timestamp < Date.now() - 30 * 24 * 60 * 60 * 1000) {
      await storage.remove(key);
    }
  }
}

// Cleanup bei App-Start
cleanup();
```

### 5. Namespacing

```typescript
// ✅ Gut: Verschiedene Prefixes für verschiedene Daten
const userStorage = createStorage({
  adapter: localStorageAdapter(),
  prefix: 'user:',
});

const cacheStorage = createStorage({
  adapter: localStorageAdapter(),
  prefix: 'cache:',
});

// ❌ Vermeiden: Alles im selben Namespace
const storage = createStorage({ adapter: localStorageAdapter() });
await storage.set('user-data', user);
await storage.set('cache-data', cache);
```

## Beispiele

### Shopping Cart

```typescript
import { createReactiveStorage } from '@sldm/storage';
import { computed } from '@sldm/core';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

const storage = createReactiveStorage({
  adapter: localStorageAdapter(),
  prefix: 'cart:',
});

const items = storage.atom<CartItem[]>('items', []);

// Berechnete Werte
const total = computed(() => items().reduce((sum, item) => sum + item.price * item.quantity, 0));

const itemCount = computed(() => items().reduce((sum, item) => sum + item.quantity, 0));

// Actions
function addToCart(product: Product) {
  const existing = items().find(item => item.productId === product.id);

  if (existing) {
    items(
      items().map(item =>
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  } else {
    items([
      ...items(),
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      },
    ]);
  }
}

function removeFromCart(productId: string) {
  items(items().filter(item => item.productId !== productId));
}

function updateQuantity(productId: string, quantity: number) {
  items(items().map(item => (item.productId === productId ? { ...item, quantity } : item)));
}

function clearCart() {
  items([]);
}

// Komponente
function ShoppingCart() {
  return createElement('div', { class: 'cart' }, [
    createElement('h2', {}, `Warenkorb (${itemCount()})`),

    createElement(
      'div',
      { class: 'items' },
      items().map(item =>
        createElement('div', { class: 'item', key: item.productId }, [
          createElement('span', {}, item.name),
          createElement('input', {
            type: 'number',
            value: item.quantity,
            min: 1,
            onchange: e => updateQuantity(item.productId, parseInt(e.target.value)),
          }),
          createElement('span', {}, `${item.price * item.quantity}€`),
          createElement(
            'button',
            {
              onclick: () => removeFromCart(item.productId),
            },
            'Entfernen'
          ),
        ])
      )
    ),

    createElement('div', { class: 'total' }, [createElement('strong', {}, `Gesamt: ${total()}€`)]),

    createElement(
      'button',
      {
        onclick: clearCart,
        disabled: items().length === 0,
      },
      'Warenkorb leeren'
    ),
  ]);
}
```

### Form Autosave

```typescript
import { createReactiveStorage } from '@sldm/storage';
import { effect, atom } from '@sldm/core';

const storage = createReactiveStorage({
  adapter: localStorageAdapter(),
  prefix: 'form:',
});

function ContactForm() {
  // Form State
  const name = atom('');
  const email = atom('');
  const message = atom('');

  // Lade gespeicherte Daten
  effect(() => {
    const saved = storage.get('contact');
    if (saved) {
      name(saved.name || '');
      email(saved.email || '');
      message(saved.message || '');
    }
  });

  // Auto-Save bei Änderungen
  effect(() => {
    const data = {
      name: name(),
      email: email(),
      message: message(),
    };

    // Debounce Save
    const timeout = setTimeout(() => {
      storage.set('contact', data);
    }, 500);

    return () => clearTimeout(timeout);
  });

  const handleSubmit = async () => {
    await submitForm({ name: name(), email: email(), message: message() });

    // Clear nach Submit
    storage.remove('contact');
    name('');
    email('');
    message('');
  };

  return createElement('form', { onsubmit: handleSubmit }, [
    createElement('input', {
      value: name(),
      oninput: e => name(e.target.value),
      placeholder: 'Name',
    }),
    createElement('input', {
      value: email(),
      oninput: e => email(e.target.value),
      placeholder: 'Email',
    }),
    createElement('textarea', {
      value: message(),
      oninput: e => message(e.target.value),
      placeholder: 'Nachricht',
    }),
    createElement('button', { type: 'submit' }, 'Senden'),
  ]);
}
```

### Offline-First App

```typescript
import { createStorage } from '@sldm/storage';

const cache = createStorage({
  adapter: indexedDBAdapter({
    database: 'offline-app',
    store: 'cache',
  }),
  ttl: 24 * 60 * 60 * 1000, // 24 Stunden
});

async function fetchWithCache<T>(url: string): Promise<T> {
  // Prüfe Cache
  const cached = await cache.get(url);
  if (cached) {
    console.log('From cache:', url);
    return cached;
  }

  // Fetch von Server
  try {
    const response = await fetch(url);
    const data = await response.json();

    // In Cache speichern
    await cache.set(url, data);

    return data;
  } catch (error) {
    console.error('Fetch failed, no cache available:', error);
    throw error;
  }
}

// Background Sync
async function syncWhenOnline() {
  const pendingActions = (await storage.get('pending-actions')) ?? [];

  if (navigator.onLine && pendingActions.length > 0) {
    for (const action of pendingActions) {
      try {
        await fetch(action.url, {
          method: action.method,
          body: JSON.stringify(action.data),
        });

        // Remove from pending
        pendingActions.shift();
        await storage.set('pending-actions', pendingActions);
      } catch (error) {
        console.error('Sync failed:', error);
        break;
      }
    }
  }
}

// Sync bei Online-Event
window.addEventListener('online', syncWhenOnline);
```

## Siehe auch

- [API-Referenz](/docs/api/storage.md)
- [IndexedDB Guide](/docs/guide/indexeddb.md)
- [Performance Best Practices](/docs/guide/performance.md)
