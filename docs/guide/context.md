# Context Guide

Umfassender Guide für Dependency Injection mit @sldm/context.

## Table of Contents

- [Installation](#installation)
- [Grundkonzepte](#grundkonzepte)
- [Quick Start](#quick-start)
- [Context erstellen](#context-erstellen)
- [Context Provider](#context-provider)
- [Context Consumer](#context-consumer)
- [Default Values](#default-values)
- [Mehrere Contexts](#mehrere-contexts)
- [Nested Providers](#nested-providers)
- [Best Practices](#best-practices)
- [Real-World Examples](#real-world-examples)

## Installation

```bash
pnpm add @sldm/context
```

Der Context ist auch in `@sldm/core` enthalten:

```typescript
import { createContext, useContext } from '@sldm/core';
```

## Grundkonzepte

Die **Context API** ermöglicht **Dependency Injection** in Solidum. Sie löst das "Prop Drilling" Problem:

**Problem: Prop Drilling**

```typescript
function App() {
  const theme = atom('dark');

  return createElement(
    Layout,
    { theme },
    createElement(
      Sidebar,
      { theme },
      createElement(
        Menu,
        { theme },
        createElement(MenuItem, { theme }) // 4 Ebenen tief!
      )
    )
  );
}
```

**Lösung: Context API**

```typescript
function App() {
  const theme = atom('dark');

  return createElement(
    ThemeContext.Provider,
    { value: theme },
    createElement(
      Layout,
      {},
      createElement(
        Sidebar,
        {},
        createElement(
          Menu,
          {},
          createElement(MenuItem, {}) // Kein Prop Drilling!
        )
      )
    )
  );
}

function MenuItem() {
  const theme = useContext(ThemeContext); // Direkter Zugriff!
  // ...
}
```

### Wann Context verwenden?

**✅ Verwende Context für:**

- Theme-Daten (dark/light mode)
- User-Authentifizierung
- Lokalisierung (i18n)
- Global Configuration
- Shared Services (Router, etc.)

**❌ Nicht verwenden für:**

- Lokalen Component State
- Häufig ändernde Daten (kann Performance beeinträchtigen)
- Wenn Props drilling nur 1-2 Ebenen tief ist

## Quick Start

### Einfaches Theme-Beispiel

```typescript
import { createContext, useContext, createElement, atom } from '@sldm/core';

// 1. Context erstellen
const ThemeContext = createContext<'light' | 'dark'>();

// 2. Provider in App verwenden
function App() {
  const theme = atom<'light' | 'dark'>('dark');

  return createElement(ThemeContext.Provider, { value: theme }, [
    createElement(Header, {}),
    createElement(Content, {}),
    createElement(Footer, {}),
  ]);
}

// 3. Context in Komponenten konsumieren
function Header() {
  const theme = useContext(ThemeContext);

  return createElement(
    'header',
    {
      class: theme() === 'dark' ? 'dark-theme' : 'light-theme',
    },
    'My App'
  );
}

function Content() {
  const theme = useContext(ThemeContext);

  return createElement(
    'main',
    {
      style: {
        backgroundColor: theme() === 'dark' ? '#1a1a1a' : '#ffffff',
        color: theme() === 'dark' ? '#ffffff' : '#000000',
      },
    },
    'Content goes here'
  );
}
```

## Context erstellen

### Typisierter Context

```typescript
// Type definieren
interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
  fontSize: number;
}

// Context mit Type erstellen
const ThemeContext = createContext<Theme>();

// Mit Default Value
const ThemeContext = createContext<Theme>({
  mode: 'light',
  primaryColor: '#667eea',
  fontSize: 16,
});
```

### Context mit Atom

```typescript
import { Atom } from '@sldm/core';

// Context für reaktiven Atom
const ThemeContext = createContext<Atom<Theme>>();

function App() {
  const theme = atom<Theme>({
    mode: 'dark',
    primaryColor: '#667eea',
    fontSize: 16,
  });

  return createElement(ThemeContext.Provider, { value: theme }, [
    // Children...
  ]);
}

function ThemedButton() {
  const theme = useContext(ThemeContext);

  // Reaktiv! UI updated wenn theme() sich ändert
  return createElement(
    'button',
    {
      style: {
        backgroundColor: theme().primaryColor,
        fontSize: `${theme().fontSize}px`,
      },
    },
    'Click me'
  );
}
```

## Context Provider

### Basic Provider

```typescript
const ThemeContext = createContext<Theme>();

function App() {
  const themeValue: Theme = {
    mode: 'dark',
    primaryColor: '#667eea',
    fontSize: 16,
  };

  return createElement(ThemeContext.Provider, { value: themeValue }, [createElement(Content, {})]);
}
```

### Provider mit State

```typescript
function App() {
  const theme = atom<Theme>({
    mode: 'dark',
    primaryColor: '#667eea',
    fontSize: 16,
  });

  const toggleTheme = () => {
    theme({
      ...theme(),
      mode: theme().mode === 'dark' ? 'light' : 'dark',
    });
  };

  return createElement(ThemeContext.Provider, { value: { theme, toggleTheme } }, [
    createElement(ThemeSwitcher, {}),
    createElement(Content, {}),
  ]);
}
```

### Provider mit Methods

```typescript
interface ThemeContextValue {
  theme: Atom<Theme>;
  setMode: (mode: 'light' | 'dark') => void;
  setPrimaryColor: (color: string) => void;
  reset: () => void;
}

const ThemeContext = createContext<ThemeContextValue>();

function App() {
  const theme = atom<Theme>(defaultTheme);

  const contextValue: ThemeContextValue = {
    theme,
    setMode: mode => {
      theme({ ...theme(), mode });
    },
    setPrimaryColor: color => {
      theme({ ...theme(), primaryColor: color });
    },
    reset: () => {
      theme(defaultTheme);
    },
  };

  return createElement(ThemeContext.Provider, { value: contextValue }, [
    // Children...
  ]);
}
```

## Context Consumer

### useContext Hook

```typescript
function MyComponent() {
  // Context abrufen
  const themeContext = useContext(ThemeContext);

  // Verwenden
  const currentMode = themeContext.theme().mode;

  return createElement(
    'div',
    {
      class: `theme-${currentMode}`,
    },
    'Content'
  );
}
```

### Destructuring

```typescript
function MyComponent() {
  const { theme, setMode, setPrimaryColor } = useContext(ThemeContext);

  const handleToggle = () => {
    setMode(theme().mode === 'dark' ? 'light' : 'dark');
  };

  return createElement(
    'button',
    {
      onclick: handleToggle,
    },
    `Switch to ${theme().mode === 'dark' ? 'light' : 'dark'} mode`
  );
}
```

### Reaktiver Zugriff

```typescript
function ThemedCard() {
  const { theme } = useContext(ThemeContext);

  // Reaktiv: Re-rendert wenn theme sich ändert
  return createElement(
    'div',
    {
      style: {
        backgroundColor: theme().mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
        color: theme().mode === 'dark' ? '#fff' : '#000',
        padding: '20px',
      },
    },
    [createElement('h2', {}, 'Card Title'), createElement('p', {}, 'Card content')]
  );
}
```

## Default Values

### Context mit Default

```typescript
const ThemeContext = createContext<Theme>({
  mode: 'light',
  primaryColor: '#667eea',
  fontSize: 16,
});

// Kann OHNE Provider verwendet werden
function Component() {
  const theme = useContext(ThemeContext);
  // Falls kein Provider: Verwendet Default Value
  console.log(theme.mode); // 'light'
}
```

### Ohne Default Value

```typescript
const UserContext = createContext<User | null>();

function Component() {
  const user = useContext(UserContext);

  // ACHTUNG: Kann null sein wenn kein Provider!
  if (!user) {
    throw new Error('Component must be used within UserContext.Provider');
  }

  return createElement('div', {}, user.name);
}
```

### Safe Context Pattern

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const UserContext = createContext<User | null>(null);

// Helper Hook mit Error Handling
function useUser(): User {
  const user = useContext(UserContext);

  if (!user) {
    throw new Error('useUser must be used within UserProvider');
  }

  return user;
}

// Verwendung
function Profile() {
  const user = useUser(); // Type-safe, guaranteed non-null
  return createElement('div', {}, user.name);
}
```

## Mehrere Contexts

### Multiple Context Providers

```typescript
const ThemeContext = createContext<Theme>();
const UserContext = createContext<User | null>();
const I18nContext = createContext<I18n>();

function App() {
  const theme = atom<Theme>(defaultTheme);
  const user = atom<User | null>(null);
  const i18n = createI18n('de');

  return createElement(
    ThemeContext.Provider,
    { value: theme },
    createElement(
      UserContext.Provider,
      { value: user },
      createElement(I18nContext.Provider, { value: i18n }, [createElement(Dashboard, {})])
    )
  );
}

// Komponente mit mehreren Contexts
function Dashboard() {
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);
  const i18n = useContext(I18nContext);

  return createElement(
    'div',
    {
      style: { backgroundColor: theme().primaryColor },
    },
    [
      user()
        ? createElement('p', {}, `${i18n.t('welcome')}, ${user()!.name}`)
        : createElement('p', {}, i18n.t('please_login')),
    ]
  );
}
```

### Context Composition

```typescript
// Combine multiple contexts into one
interface AppContext {
  theme: Atom<Theme>;
  user: Atom<User | null>;
  router: Router;
}

const AppContext = createContext<AppContext>();

function AppProvider({ children }: { children: unknown }) {
  const theme = atom<Theme>(defaultTheme);
  const user = atom<User | null>(null);
  const router = createRouter({
    /* ... */
  });

  const value: AppContext = { theme, user, router };

  return createElement(AppContext.Provider, { value }, children);
}

// Simpler usage
function App() {
  return createElement(AppProvider, {}, [createElement(Dashboard, {})]);
}

function Dashboard() {
  const { theme, user, router } = useContext(AppContext);
  // Alles in einem Context!
}
```

## Nested Providers

### Provider Override

```typescript
const ThemeContext = createContext<Theme>();

function App() {
  const globalTheme = atom<Theme>({ mode: 'dark', primaryColor: '#667eea' });

  return createElement(ThemeContext.Provider, { value: globalTheme }, [
    createElement(Header, {}), // Uses global theme

    // Override for specific section
    createElement(
      ThemeContext.Provider,
      { value: atom({ mode: 'light', primaryColor: '#ff6b6b' }) },
      [
        createElement(Sidebar, {}), // Uses overridden theme!
      ]
    ),

    createElement(Content, {}), // Uses global theme again
  ]);
}
```

### Scoped Context

```typescript
function Dialog() {
  const parentTheme = useContext(ThemeContext);

  // Dialog hat eigenen Theme-Context
  const dialogTheme = atom<Theme>({
    ...parentTheme(),
    mode: 'light', // Always light for dialog
  });

  return createElement(ThemeContext.Provider, { value: dialogTheme }, [
    createElement('div', { class: 'dialog' }, [
      createElement(DialogHeader, {}),
      createElement(DialogContent, {}),
    ]),
  ]);
}
```

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

### 2. Custom Hooks für Contexts

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
function Component() {
  const theme = useTheme(); // Safe!
}

// ❌ FALSCH: Direkter useContext ohne Validierung
function Component() {
  const theme = useContext(ThemeContext); // Kann undefined sein!
}
```

### 3. Context Splitting

```typescript
// ✅ RICHTIG: Separate Contexts für verschiedene Concerns
const ThemeContext = createContext<Theme>();
const UserContext = createContext<User | null>();
const AuthContext = createContext<AuthMethods>();

// ❌ FALSCH: Ein riesiger "God Context"
const AppContext = createContext<{
  theme: Theme;
  user: User | null;
  auth: AuthMethods;
  router: Router;
  i18n: I18n;
  // ... 20 weitere Properties
}>();
```

### 4. Minimize Context Updates

```typescript
// ✅ RICHTIG: Separate Atoms für State und Methods
interface ThemeContextValue {
  theme: Atom<Theme>; // Ändert sich
  setTheme: (theme: Theme) => void; // Ändert sich NICHT
  toggleMode: () => void; // Ändert sich NICHT
}

// ❌ FALSCH: Alles in einem Objekt das sich ändert
function App() {
  const theme = atom<Theme>(defaultTheme);

  // PROBLEM: Neues Objekt bei jedem Render!
  const value = {
    theme: theme(),
    setTheme: (t: Theme) => theme(t),
  };

  return createElement(ThemeContext.Provider, { value } /* ... */);
}
```

### 5. Provider Composition

```typescript
// ✅ RICHTIG: Composable Providers
function Providers({ children }: { children: unknown }) {
  return createElement(
    ThemeProvider,
    {},
    createElement(UserProvider, {}, createElement(RouterProvider, {}, children))
  );
}

function App() {
  return createElement(Providers, {}, [createElement(Dashboard, {})]);
}

// ❌ FALSCH: Provider Chaos in App
function App() {
  return createElement(
    ThemeContext.Provider,
    { value: theme },
    createElement(
      UserContext.Provider,
      { value: user },
      createElement(
        RouterContext.Provider,
        { value: router },
        // 10 weitere Provider...
        createElement(Dashboard, {})
      )
    )
  );
}
```

## Real-World Examples

### Theme System

```typescript
interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  fontSize: {
    small: number;
    medium: number;
    large: number;
  };
}

interface ThemeContextValue {
  theme: Atom<Theme>;
  setMode: (mode: 'light' | 'dark') => void;
  setPrimaryColor: (color: string) => void;
  reset: () => void;
}

const defaultTheme: Theme = {
  mode: 'light',
  primaryColor: '#667eea',
  secondaryColor: '#764ba2',
  fontSize: {
    small: 12,
    medium: 16,
    large: 20,
  },
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Custom Hook
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Provider Component
function ThemeProvider({ children }: { children: unknown }) {
  const theme = atom<Theme>(defaultTheme);

  const value: ThemeContextValue = {
    theme,
    setMode: mode => {
      theme({ ...theme(), mode });
    },
    setPrimaryColor: color => {
      theme({ ...theme(), primaryColor: color });
    },
    reset: () => {
      theme(defaultTheme);
    },
  };

  return createElement(ThemeContext.Provider, { value }, children);
}

// App
function App() {
  return createElement(ThemeProvider, {}, [
    createElement(Header, {}),
    createElement(Content, {}),
    createElement(ThemeSettings, {}),
  ]);
}

// Themed Components
function Header() {
  const { theme } = useTheme();

  return createElement(
    'header',
    {
      style: {
        backgroundColor: theme().primaryColor,
        color: '#fff',
        padding: '20px',
      },
    },
    'My Application'
  );
}

function ThemeSettings() {
  const { theme, setMode, setPrimaryColor, reset } = useTheme();

  return createElement('div', { class: 'settings' }, [
    createElement('h2', {}, 'Theme Settings'),

    createElement(
      'button',
      {
        onclick: () => setMode(theme().mode === 'dark' ? 'light' : 'dark'),
      },
      `Switch to ${theme().mode === 'dark' ? 'Light' : 'Dark'} Mode`
    ),

    createElement('input', {
      type: 'color',
      value: theme().primaryColor,
      oninput: (e: Event) => setPrimaryColor((e.target as HTMLInputElement).value),
    }),

    createElement(
      'button',
      {
        onclick: reset,
      },
      'Reset to Default'
    ),
  ]);
}
```

### Authentication Context

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextValue {
  user: Atom<User | null>;
  isAuthenticated: Computed<boolean>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

function AuthProvider({ children }: { children: unknown }) {
  const user = atom<User | null>(null);
  const isAuthenticated = computed(() => user() !== null);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const userData = await response.json();
    user(userData);
  };

  const logout = () => {
    user(null);
  };

  const hasRole = (role: string) => {
    return user()?.role === role;
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    login,
    logout,
    hasRole,
  };

  return createElement(AuthContext.Provider, { value }, children);
}

// Usage
function App() {
  return createElement(AuthProvider, {}, [createElement(AppContent, {})]);
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return createElement('div', {}, [
    isAuthenticated() ? createElement(Dashboard, {}) : createElement(LoginPage, {}),
  ]);
}

function Dashboard() {
  const { user, logout, hasRole } = useAuth();

  return createElement('div', {}, [
    createElement('h1', {}, `Welcome, ${user()!.name}`),
    createElement('p', {}, `Email: ${user()!.email}`),

    hasRole('admin') && createElement('a', { href: '/admin' }, 'Admin Panel'),

    createElement('button', { onclick: logout }, 'Logout'),
  ]);
}

function LoginPage() {
  const { login } = useAuth();
  const email = atom('');
  const password = atom('');
  const error = atom<string | null>(null);

  const handleSubmit = async () => {
    try {
      await login(email(), password());
    } catch (err) {
      error((err as Error).message);
    }
  };

  return createElement('div', { class: 'login' }, [
    createElement('h1', {}, 'Login'),

    error() && createElement('div', { class: 'error' }, error()),

    createElement('input', {
      type: 'email',
      value: email(),
      oninput: (e: Event) => email((e.target as HTMLInputElement).value),
      placeholder: 'Email',
    }),

    createElement('input', {
      type: 'password',
      value: password(),
      oninput: (e: Event) => password((e.target as HTMLInputElement).value),
      placeholder: 'Password',
    }),

    createElement('button', { onclick: handleSubmit }, 'Login'),
  ]);
}
```

### Internationalization (i18n) Context

```typescript
interface I18nContextValue {
  locale: Atom<string>;
  t: (key: string, params?: Record<string, string>) => string;
  setLocale: (locale: string) => void;
  availableLocales: string[];
}

const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: 'Welcome',
    welcome_user: 'Welcome, {name}',
    logout: 'Logout',
  },
  de: {
    welcome: 'Willkommen',
    welcome_user: 'Willkommen, {name}',
    logout: 'Abmelden',
  },
};

const I18nContext = createContext<I18nContextValue | null>(null);

function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

function I18nProvider({ children }: { children: unknown }) {
  const locale = atom('en');

  const t = (key: string, params?: Record<string, string>): string => {
    let text = translations[locale()]?.[key] || key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }

    return text;
  };

  const setLocale = (newLocale: string) => {
    if (translations[newLocale]) {
      locale(newLocale);
    }
  };

  const value: I18nContextValue = {
    locale,
    t,
    setLocale,
    availableLocales: Object.keys(translations),
  };

  return createElement(I18nContext.Provider, { value }, children);
}

// Usage
function App() {
  return createElement(I18nProvider, {}, [createElement(Header, {}), createElement(Content, {})]);
}

function Header() {
  const { t, locale, setLocale, availableLocales } = useI18n();

  return createElement('header', {}, [
    createElement('h1', {}, t('welcome')),

    createElement(
      'select',
      {
        value: locale(),
        onchange: (e: Event) => setLocale((e.target as HTMLSelectElement).value),
      },
      availableLocales.map(l => createElement('option', { value: l }, l.toUpperCase()))
    ),
  ]);
}

function UserGreeting({ userName }: { userName: string }) {
  const { t } = useI18n();

  return createElement('p', {}, t('welcome_user', { name: userName }));
}
```

---

## Siehe auch

- [Context API Reference](/docs/api/context.md)
- [Store Pattern](/docs/guide/store.md)
- [Core Primitives](/docs/guide/core.md)
- [Quick Start](/docs/guide/quick-start.md)
