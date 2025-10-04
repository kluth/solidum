# Router Guide

Der @sldm/router ist ein leichtgewichtiger, reaktiver Router für Single-Page Applications (SPAs) mit Solidum.

## Inhaltsverzeichnis

- [Installation](#installation)
- [Grundkonzepte](#grundkonzepte)
- [Erste Schritte](#erste-schritte)
- [Routen Definitionen](#routen-definitionen)
- [Navigation](#navigation)
- [Route Parameter](#route-parameter)
- [Query Parameter](#query-parameter)
- [Nested Routes](#nested-routes)
- [Route Guards](#route-guards)
- [Lazy Loading](#lazy-loading)
- [404 Handling](#404-handling)
- [Erweiterte Beispiele](#erweiterte-beispiele)

## Installation

```bash
pnpm add @sldm/router
# oder
solidum add router
```

## Grundkonzepte

Der Router basiert auf drei Kernkonzepten:

1. **Routes** - Definieren die URL-Struktur Ihrer App
2. **Router** - Verwaltet die Navigation und den aktuellen Zustand
3. **Link/Navigate** - Komponenten und Funktionen für die Navigation

## Erste Schritte

### Einfachste Router-Setup

```typescript
import { createRouter, Route } from '@sldm/router';
import { mount } from '@sldm/core';

// 1. Definiere deine Routen
const routes: Route[] = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/about',
    component: AboutPage,
  },
  {
    path: '/contact',
    component: ContactPage,
  },
];

// 2. Erstelle den Router
const router = createRouter({
  routes,
  mode: 'hash', // oder 'history'
});

// 3. Erstelle die App-Komponente
function App() {
  return createElement('div', { class: 'app' }, [
    createElement(Navigation, {}),
    createElement(RouterView, { router }),
  ]);
}

// 4. Mounte die App
mount(App, document.getElementById('app'));
```

## Routen Definitionen

### Basis Route

```typescript
const route: Route = {
  path: '/users',
  component: UsersPage,
  name: 'users', // Optional: Name für programmatische Navigation
};
```

### Route mit Meta-Daten

```typescript
const route: Route = {
  path: '/admin',
  component: AdminPage,
  meta: {
    requiresAuth: true,
    title: 'Admin Panel',
    roles: ['admin', 'superuser'],
  },
};
```

### Route mit Kindern (Nested)

```typescript
const route: Route = {
  path: '/dashboard',
  component: DashboardLayout,
  children: [
    {
      path: 'overview',
      component: DashboardOverview,
    },
    {
      path: 'stats',
      component: DashboardStats,
    },
    {
      path: 'settings',
      component: DashboardSettings,
    },
  ],
};
```

## Navigation

### Deklarative Navigation mit Link

```typescript
import { Link } from '@sldm/router';

function Navigation() {
  return createElement('nav', {}, [
    createElement(Link, { to: '/', class: 'nav-link' }, 'Home'),
    createElement(Link, { to: '/about', class: 'nav-link' }, 'Über uns'),
    createElement(Link, { to: '/contact', class: 'nav-link' }, 'Kontakt'),
  ]);
}
```

### Programmatische Navigation

```typescript
import { useRouter } from '@sldm/router';

function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    const success = await login(email(), password());

    if (success) {
      // Navigiere zur Dashboard-Seite
      router.push('/dashboard');

      // Oder mit Namen
      router.push({ name: 'dashboard' });

      // Mit Parametern
      router.push({ name: 'user-profile', params: { id: '123' } });
    }
  };

  return createElement('form', { onsubmit: handleLogin }, [
    // ... Form-Felder
  ]);
}
```

### Navigation mit State

```typescript
// Navigiere mit zusätzlichem State
router.push({
  path: '/success',
  state: { message: 'Login erfolgreich!' },
});

// Im Ziel-Component
function SuccessPage() {
  const router = useRouter();
  const message = router.currentRoute().state?.message;

  return createElement('div', {}, [
    createElement('h1', {}, 'Erfolg!'),
    createElement('p', {}, message),
  ]);
}
```

## Route Parameter

### Parameter Definition

```typescript
const routes: Route[] = [
  {
    path: '/users/:id',
    component: UserProfile,
  },
  {
    path: '/posts/:category/:slug',
    component: BlogPost,
  },
];
```

### Parameter Zugriff

```typescript
import { useParams } from '@sldm/router';

function UserProfile() {
  const params = useParams();
  const userId = computed(() => params().id);

  // Lade Benutzerdaten basierend auf ID
  effect(() => {
    loadUser(userId());
  });

  return createElement('div', {}, [
    createElement('h1', {}, `Benutzer ${userId()}`),
    // ... Rest des Profils
  ]);
}
```

### Optionale Parameter

```typescript
const route: Route = {
  path: '/products/:id?',
  component: ProductsPage,
};

function ProductsPage() {
  const params = useParams();
  const productId = computed(() => params().id);

  return createElement('div', {}, [
    productId()
      ? createElement(ProductDetail, { id: productId() })
      : createElement(ProductList, {}),
  ]);
}
```

## Query Parameter

### Query Parameter lesen

```typescript
import { useQuery } from '@sldm/router';

function SearchPage() {
  const query = useQuery();
  const searchTerm = computed(() => query().q || '');
  const page = computed(() => parseInt(query().page || '1'));
  const filter = computed(() => query().filter || 'all');

  effect(() => {
    search(searchTerm(), page(), filter());
  });

  return createElement('div', {}, [
    createElement('h1', {}, `Suche: ${searchTerm()}`),
    // ... Suchergebnisse
  ]);
}
```

### Query Parameter setzen

```typescript
function SearchPage() {
  const router = useRouter();
  const searchTerm = atom('');

  const updateSearch = () => {
    router.push({
      path: '/search',
      query: { q: searchTerm(), page: '1' },
    });
  };

  return createElement('div', {}, [
    createElement('input', {
      value: searchTerm(),
      oninput: e => searchTerm(e.target.value),
    }),
    createElement('button', { onclick: updateSearch }, 'Suchen'),
  ]);
}
```

## Nested Routes

### Layout mit verschachtelten Routen

```typescript
const routes: Route[] = [
  {
    path: '/app',
    component: AppLayout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'profile',
        component: Profile,
      },
      {
        path: 'settings',
        component: Settings,
        children: [
          {
            path: 'account',
            component: AccountSettings,
          },
          {
            path: 'security',
            component: SecuritySettings,
          },
        ],
      },
    ],
  },
];
```

### Layout-Komponente mit RouterView

```typescript
function AppLayout() {
  return createElement('div', { class: 'app-layout' }, [
    createElement('aside', { class: 'sidebar' }, [createElement(Sidebar, {})]),
    createElement('main', { class: 'content' }, [
      // Hier werden die Kind-Routen gerendert
      createElement(RouterView, {}),
    ]),
  ]);
}
```

## Route Guards

### Globale Guards

```typescript
const router = createRouter({
  routes,
  beforeEach: (to, from) => {
    // Prüfe ob Route Authentifizierung benötigt
    if (to.meta?.requiresAuth && !isAuthenticated()) {
      return '/login'; // Umleitung
    }

    // Logging
    console.log(`Navigation: ${from.path} -> ${to.path}`);

    // Erlaube Navigation
    return true;
  },
  afterEach: (to, from) => {
    // Aktualisiere Seiten-Titel
    document.title = to.meta?.title || 'Meine App';

    // Analytics
    trackPageView(to.path);
  },
});
```

### Per-Route Guards

```typescript
const route: Route = {
  path: '/admin',
  component: AdminPage,
  beforeEnter: (to, from) => {
    if (!hasRole('admin')) {
      return '/403'; // Forbidden
    }
    return true;
  },
};
```

### Component Guards

```typescript
function UserEditPage() {
  const hasUnsavedChanges = atom(false);

  // Warne vor Navigation wenn ungespeicherte Änderungen
  onBeforeRouteLeave(() => {
    if (hasUnsavedChanges()) {
      return confirm('Ungespeicherte Änderungen gehen verloren. Fortfahren?');
    }
    return true;
  });

  return createElement('form', {}, [
    // ... Form
  ]);
}
```

## Lazy Loading

### Code-Splitting mit dynamischen Imports

```typescript
const routes: Route[] = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/heavy-feature',
    component: () => import('./pages/HeavyFeature'),
  },
  {
    path: '/admin',
    component: () => import('./pages/Admin'),
  },
];
```

### Lazy Loading mit Loading-State

```typescript
function lazyLoad(importFn: () => Promise<any>) {
  return function LazyComponent() {
    const Component = atom(null);
    const loading = atom(true);
    const error = atom(null);

    effect(() => {
      importFn()
        .then(module => {
          Component(module.default);
          loading(false);
        })
        .catch(err => {
          error(err);
          loading(false);
        });
    });

    return createElement('div', {}, [
      loading() && createElement(LoadingSpinner, {}),
      error() && createElement(ErrorDisplay, { error: error() }),
      Component() && createElement(Component(), {}),
    ]);
  };
}

// Verwendung
const routes: Route[] = [
  {
    path: '/dashboard',
    component: lazyLoad(() => import('./pages/Dashboard')),
  },
];
```

## 404 Handling

### Catch-All Route

```typescript
const routes: Route[] = [
  // ... andere Routen
  {
    path: '*',
    component: NotFoundPage,
  },
];

function NotFoundPage() {
  const router = useRouter();

  return createElement('div', { class: 'not-found' }, [
    createElement('h1', {}, '404 - Seite nicht gefunden'),
    createElement('p', {}, `Die Seite "${router.currentRoute().path}" existiert nicht.`),
    createElement(Link, { to: '/' }, 'Zur Startseite'),
  ]);
}
```

## Erweiterte Beispiele

### Multi-Layout App

```typescript
// Auth-Layout (Login, Register)
function AuthLayout() {
  return createElement('div', { class: 'auth-layout' }, [
    createElement('div', { class: 'auth-box' }, [createElement(RouterView, {})]),
  ]);
}

// App-Layout (Dashboard, Profile, etc.)
function AppLayout() {
  return createElement('div', { class: 'app-layout' }, [
    createElement(Header, {}),
    createElement('div', { class: 'main' }, [
      createElement(Sidebar, {}),
      createElement(RouterView, {}),
    ]),
  ]);
}

// Routes
const routes: Route[] = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', component: LoginPage },
      { path: 'register', component: RegisterPage },
    ],
  },
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'profile', component: Profile },
      { path: 'settings', component: Settings },
    ],
  },
];
```

### Tab-Navigation

```typescript
function ProfilePage() {
  const router = useRouter();
  const activeTab = computed(() => {
    const path = router.currentRoute().path;
    return path.split('/').pop();
  });

  return createElement('div', { class: 'profile' }, [
    createElement('div', { class: 'tabs' }, [
      createElement(
        Link,
        {
          to: '/profile/overview',
          class: activeTab() === 'overview' ? 'active' : '',
        },
        'Übersicht'
      ),
      createElement(
        Link,
        {
          to: '/profile/posts',
          class: activeTab() === 'posts' ? 'active' : '',
        },
        'Beiträge'
      ),
      createElement(
        Link,
        {
          to: '/profile/settings',
          class: activeTab() === 'settings' ? 'active' : '',
        },
        'Einstellungen'
      ),
    ]),
    createElement('div', { class: 'tab-content' }, [createElement(RouterView, {})]),
  ]);
}
```

### Breadcrumbs

```typescript
function Breadcrumbs() {
  const router = useRouter();

  const breadcrumbs = computed(() => {
    const route = router.currentRoute();
    const paths = route.path.split('/').filter(Boolean);

    return paths.map((path, index) => ({
      name: path,
      path: '/' + paths.slice(0, index + 1).join('/'),
    }));
  });

  return createElement('nav', { class: 'breadcrumbs' }, [
    createElement(Link, { to: '/' }, 'Home'),
    ...breadcrumbs().map(crumb =>
      createElement('span', {}, [
        createElement('span', {}, ' / '),
        createElement(Link, { to: crumb.path }, crumb.name),
      ])
    ),
  ]);
}
```

### Scroll-Verhalten

```typescript
const router = createRouter({
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    // Zurück zum gespeicherten Position (Browser Back/Forward)
    if (savedPosition) {
      return savedPosition;
    }

    // Scroll zu Anker
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }

    // Scroll nach oben bei neuer Route
    return { top: 0, left: 0 };
  },
});
```

## Best Practices

### 1. Route-Namen verwenden

```typescript
// ✅ Gut: Mit Namen
router.push({ name: 'user-profile', params: { id: '123' } });

// ❌ Vermeiden: Hardcoded Pfade
router.push('/users/123');
```

### 2. Meta-Daten nutzen

```typescript
const routes: Route[] = [
  {
    path: '/admin',
    component: AdminPage,
    meta: {
      title: 'Admin',
      requiresAuth: true,
      roles: ['admin'],
      layout: 'admin-layout',
    },
  },
];
```

### 3. Loading States

```typescript
function UserProfile() {
  const params = useParams();
  const user = atom(null);
  const loading = atom(true);

  effect(() => {
    loading(true);
    fetchUser(params().id)
      .then(user)
      .finally(() => loading(false));
  });

  if (loading()) {
    return createElement(LoadingSpinner, {});
  }

  return createElement('div', {}, [
    // ... User Profile
  ]);
}
```

### 4. Error Boundaries

```typescript
function RouterErrorBoundary({ children }: { children: any }) {
  const error = atom(null);

  try {
    return children;
  } catch (err) {
    error(err);
    return createElement(ErrorPage, { error: error() });
  }
}
```

## Siehe auch

- [API-Referenz](/docs/api/router.md)
- [Quick Start Guide](/docs/guide/quick-start.md)
- [Navigation Examples](/docs/examples/navigation.md)
