# Context API Reference

Vollständige API-Dokumentation für @sldm/context.

## Table of Contents

- [createContext()](#createcontext)
- [useContext()](#usecontext)
- [Context Interface](#context-interface)
- [Types](#types)
- [Best Practices](#best-practices)

## createContext()

Erstellt einen neuen Context für Dependency Injection.

**Signature:**

```typescript
function createContext<T>(defaultValue?: T): Context<T>;
```

**Parameters:**

- `defaultValue` - Optionaler Default-Wert wenn kein Provider vorhanden ist

**Returns:** `Context<T>` - Context-Objekt mit Provider

**Example:**

```typescript
import { createContext } from '@sldm/context';

// Ohne Default-Wert
const ThemeContext = createContext<Theme>();

// Mit Default-Wert
const ThemeContext = createContext<Theme>({
  mode: 'light',
  primaryColor: '#667eea',
});

// Mit komplexem Type
interface AppConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
}

const ConfigContext = createContext<AppConfig>({
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
});
```

---

### Mit TypeScript

```typescript
// Einfacher Type
const UserContext = createContext<User | null>(null);

// Union Type
const ThemeContext = createContext<'light' | 'dark'>('light');

// Interface
interface AuthContextValue {
  user: Atom<User | null>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Generic Type
interface ListContext<T> {
  items: Atom<T[]>;
  addItem: (item: T) => void;
  removeItem: (id: string) => void;
}

function createListContext<T>() {
  return createContext<ListContext<T> | null>(null);
}

const TodoListContext = createListContext<Todo>();
```

---

## useContext()

Konsumiert einen Context-Wert innerhalb einer Komponente.

**Signature:**

```typescript
function useContext<T>(context: Context<T>): T;
```

**Parameters:**

- `context` - Das Context-Objekt von `createContext()`

**Returns:** `T` - Der Context-Wert

**Throws:** Error wenn:

- Nicht innerhalb eines Component-Renders aufgerufen
- Kein Provider vorhanden und kein Default-Wert gesetzt

**Example:**

```typescript
import { useContext, createElement } from '@sldm/core';

const ThemeContext = createContext<Theme>();

function Button() {
  // Context konsumieren
  const theme = useContext(ThemeContext);

  return createElement(
    'button',
    {
      style: {
        backgroundColor: theme.primaryColor,
        color: theme.textColor,
      },
    },
    'Click me'
  );
}
```

---

### Error Handling

```typescript
// ❌ OHNE Default: Kann Error werfen
const UserContext = createContext<User>();

function Profile() {
  const user = useContext(UserContext);
  // Error wenn kein Provider!
  return createElement('div', {}, user.name);
}

// ✅ MIT Default: Sicher
const UserContext = createContext<User | null>(null);

function Profile() {
  const user = useContext(UserContext);

  if (!user) {
    return createElement('div', {}, 'Not logged in');
  }

  return createElement('div', {}, user.name);
}

// ✅ MIT Custom Hook: Best Practice
function useUser() {
  const user = useContext(UserContext);

  if (!user) {
    throw new Error('useUser must be used within UserProvider');
  }

  return user;
}

function Profile() {
  const user = useUser(); // Garantiert non-null
  return createElement('div', {}, user.name);
}
```

---

## Context Interface

Das zurückgegebene Context-Objekt.

**Interface:**

```typescript
interface Context<T> {
  id: symbol; // Eindeutige Context-ID
  defaultValue: T | undefined; // Default-Wert
  Provider: ComponentFunction<{
    // Provider-Komponente
    value: T;
    children?: unknown;
  }>;
}
```

---

### Provider

Die Provider-Komponente macht den Context-Wert für Child-Komponenten verfügbar.

**Props:**

```typescript
interface ProviderProps<T> {
  value: T; // Der zu teilende Wert
  children?: unknown; // Child-Komponenten
}
```

**Example:**

```typescript
import { createElement } from '@sldm/core';

const ThemeContext = createContext<Theme>();

function App() {
  const theme = atom<Theme>({
    mode: 'dark',
    primaryColor: '#667eea',
  });

  return createElement(ThemeContext.Provider, { value: theme }, [
    createElement(Header, {}),
    createElement(Content, {}),
    createElement(Footer, {}),
  ]);
}

// Header, Content, Footer können jetzt useContext(ThemeContext) verwenden
```

---

### Nested Providers

```typescript
function App() {
  const theme = atom<Theme>(defaultTheme);
  const user = atom<User | null>(null);
  const config = { apiUrl: '/api' };

  return createElement(
    ThemeContext.Provider,
    { value: theme },
    createElement(
      UserContext.Provider,
      { value: user },
      createElement(ConfigContext.Provider, { value: config }, [createElement(Dashboard, {})])
    )
  );
}
```

---

### Provider Override

Provider können überschrieben werden für spezifische Sub-Trees:

```typescript
function App() {
  const globalTheme = atom({ mode: 'dark' });

  return createElement(ThemeContext.Provider, { value: globalTheme }, [
    createElement(Header, {}), // Verwendet globalTheme

    // Überschreiben für Dialog
    createElement(ThemeContext.Provider, { value: atom({ mode: 'light' }) }, [
      createElement(Dialog, {}), // Verwendet light theme!
    ]),

    createElement(Footer, {}), // Verwendet globalTheme wieder
  ]);
}
```

---

## Types

### Context

Das Context-Objekt Type.

```typescript
interface Context<T> {
  id: symbol;
  defaultValue: T | undefined;
  Provider: ComponentFunction<{
    value: T;
    children?: unknown;
  }>;
}
```

---

### ComponentFunction

Type für Komponenten-Funktionen.

```typescript
type ComponentFunction<Props = {}> = (props: Props) => VNode | null;
```

---

## Best Practices

### 1. Type-Safe Contexts

```typescript
// ✅ RICHTIG: Typisiert und mit Default
interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
}

const ThemeContext = createContext<Theme>({
  mode: 'light',
  primaryColor: '#667eea',
});

// ❌ FALSCH: Untypisiert
const ThemeContext = createContext();
```

---

### 2. Custom Hooks

```typescript
// ✅ RICHTIG: Custom Hook mit Validierung
function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}

// Usage
function Button() {
  const theme = useTheme(); // Type-safe, guaranteed non-null
  // ...
}

// ❌ FALSCH: Direkter useContext ohne Validierung
function Button() {
  const theme = useContext(ThemeContext); // Kann undefined sein!
  // ...
}
```

---

### 3. Provider-Komponenten

```typescript
// ✅ RICHTIG: Wrapper-Komponente für Provider
interface ThemeProviderProps {
  children: unknown;
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = atom<Theme>(defaultTheme);

  const value = {
    theme,
    setMode: (mode: 'light' | 'dark') => {
      theme({ ...theme(), mode });
    },
  };

  return createElement(ThemeContext.Provider, { value }, children);
}

// Usage
function App() {
  return createElement(ThemeProvider, {}, [createElement(Content, {})]);
}

// ❌ FALSCH: Direkt Provider verwenden überall
function App() {
  return createElement(
    ThemeContext.Provider,
    {
      value: {
        /* repeated logic */
      },
    },
    [
      /* ... */
    ]
  );
}
```

---

### 4. Context Splitting

```typescript
// ✅ RICHTIG: Separate Contexts für verschiedene Concerns
const ThemeContext = createContext<Theme>();
const UserContext = createContext<User | null>();
const AuthContext = createContext<AuthMethods>();

// ❌ FALSCH: Ein riesiger God Context
const AppContext = createContext<{
  theme: Theme;
  user: User | null;
  auth: AuthMethods;
  router: Router;
  // ... 20 weitere Properties
}>();
```

---

### 5. Minimize Re-Renders

```typescript
// ✅ RICHTIG: Separate Atoms
interface ThemeContextValue {
  theme: Atom<Theme>; // Ändert sich
  setTheme: (t: Theme) => void; // Ändert sich NICHT
}

function ThemeProvider({ children }: { children: unknown }) {
  const theme = atom<Theme>(defaultTheme);

  // Value-Objekt ändert sich nicht
  const value: ThemeContextValue = {
    theme,
    setTheme: t => theme(t),
  };

  return createElement(ThemeContext.Provider, { value }, children);
}

// ❌ FALSCH: Neues Objekt bei jedem Render
function ThemeProvider({ children }: { children: unknown }) {
  const theme = atom<Theme>(defaultTheme);

  // PROBLEM: Neues Objekt = alle Consumer re-rendern!
  const value = {
    theme: theme(),
    setTheme: (t: Theme) => theme(t),
  };

  return createElement(ThemeContext.Provider, { value }, children);
}
```

---

## Common Patterns

### Theme Context

```typescript
interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
}

interface ThemeContextValue {
  theme: Atom<Theme>;
  setMode: (mode: 'light' | 'dark') => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme requires ThemeProvider');
  return context;
}

function ThemeProvider({ children }: { children: unknown }) {
  const theme = atom<Theme>({ mode: 'light', primaryColor: '#667eea' });

  const value: ThemeContextValue = {
    theme,
    setMode: mode => theme({ ...theme(), mode }),
    toggleMode: () =>
      theme({
        ...theme(),
        mode: theme().mode === 'dark' ? 'light' : 'dark',
      }),
  };

  return createElement(ThemeContext.Provider, { value }, children);
}
```

---

### Auth Context

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: Atom<User | null>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: Computed<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth requires AuthProvider');
  return context;
}

function AuthProvider({ children }: { children: unknown }) {
  const user = atom<User | null>(null);
  const isAuthenticated = computed(() => user() !== null);

  const login = async (email: string, password: string) => {
    const userData = await loginAPI(email, password);
    user(userData);
  };

  const logout = () => {
    user(null);
  };

  const value: AuthContextValue = {
    user,
    login,
    logout,
    isAuthenticated,
  };

  return createElement(AuthContext.Provider, { value }, children);
}
```

---

### Router Context

```typescript
interface RouterContextValue {
  currentRoute: Atom<RouteLocation>;
  navigate: (path: string) => void;
  goBack: () => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function useRouter() {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useRouter requires RouterProvider');
  return context;
}

function RouterProvider({ children }: { children: unknown }) {
  const currentRoute = atom<RouteLocation>({ path: '/', params: {} });

  const value: RouterContextValue = {
    currentRoute,
    navigate: path => {
      currentRoute({ path, params: {} });
      window.history.pushState(null, '', path);
    },
    goBack: () => {
      window.history.back();
    },
  };

  return createElement(RouterContext.Provider, { value }, children);
}
```

---

## Internal API

### enterRender()

Markiert den Beginn eines Component-Renders (internal).

```typescript
function enterRender(): void;
```

**Note:** Wird automatisch von Solidum aufgerufen. Nicht manuell verwenden.

---

### exitRender()

Markiert das Ende eines Component-Renders (internal).

```typescript
function exitRender(): void;
```

**Note:** Wird automatisch von Solidum aufgerufen. Nicht manuell verwenden.

---

### pushContext()

Fügt einen Context-Wert zum Stack hinzu (internal).

```typescript
function pushContext(id: symbol, value: unknown): void;
```

**Note:** Wird automatisch vom Provider aufgerufen. Nicht manuell verwenden.

---

### popContext()

Entfernt einen Context-Wert vom Stack (internal).

```typescript
function popContext(): void;
```

**Note:** Wird automatisch vom Provider aufgerufen. Nicht manuell verwenden.

---

## Performance Tips

### 1. Split Contexts

Splitte große Contexts in kleinere für bessere Performance:

```typescript
// ❌ SCHLECHT: Ein großer Context
const AppContext = createContext<{
  theme: Theme;
  user: User;
  settings: Settings;
  notifications: Notification[];
}>();

// ✅ GUT: Separate Contexts
const ThemeContext = createContext<Theme>();
const UserContext = createContext<User>();
const SettingsContext = createContext<Settings>();
const NotificationsContext = createContext<Notification[]>();
```

---

### 2. Memoize Provider Values

```typescript
// ✅ RICHTIG: Value-Objekt bleibt stabil
function MyProvider({ children }: { children: unknown }) {
  const data = atom(initialData);

  const value = {
    data, // Atom (stabil)
    update: d => data(d), // Funktion (stabil)
  };

  return createElement(MyContext.Provider, { value }, children);
}
```

---

### 3. Avoid Inline Objects

```typescript
// ❌ SCHLECHT: Neues Objekt bei jedem Render
function App() {
  const theme = atom(defaultTheme);

  return createElement(
    ThemeContext.Provider,
    {
      value: { theme: theme(), set: t => theme(t) }, // Neu jedes Mal!
    },
    children
  );
}

// ✅ GUT: Stabiles Objekt
function App() {
  const theme = atom(defaultTheme);

  const value = { theme, set: (t: Theme) => theme(t) };

  return createElement(ThemeContext.Provider, { value }, children);
}
```

---

## Siehe auch

- [Context Guide](/docs/guide/context.md)
- [Core Primitives](/docs/guide/core.md)
- [Store Pattern](/docs/guide/store.md)
