# Router API Reference

Vollständige API-Dokumentation für @sldm/router.

## Table of Contents

- [createRouter()](#createrouter)
- [Router](#router)
- [Route](#route)
- [RouterView](#routerview)
- [Link](#link)
- [useRouter()](#userouter)
- [useRoute()](#useroute)
- [useParams()](#useparams)
- [useQuery()](#usequery)
- [Navigation Guards](#navigation-guards)
- [Types](#types)

## createRouter()

Erstellt eine neue Router-Instanz.

### Signature

```typescript
function createRouter(options: RouterOptions): Router;
```

### Parameters

```typescript
interface RouterOptions {
  routes: Route[]; // Array von Route-Definitionen
  mode?: 'hash' | 'history'; // Routing-Modus (default: 'hash')
  base?: string; // Basis-Pfad für die App
  initialUrl?: string; // Initial URL (für SSR)
  scrollBehavior?: ScrollBehavior; // Scroll-Verhalten
  beforeEach?: NavigationGuard; // Globaler Before-Guard
  afterEach?: AfterNavigationGuard; // Globaler After-Guard
}
```

### Returns

`Router` - Router-Instanz

### Example

```typescript
import { createRouter } from '@sldm/router';

const router = createRouter({
  routes: [
    { path: '/', component: HomePage },
    { path: '/about', component: AboutPage },
  ],
  mode: 'history',
  base: '/app',
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
  beforeEach: (to, from) => {
    console.log(`Navigating to ${to.path}`);
    return true;
  },
});
```

## Router

Die Router-Instanz verwaltet Navigation und Routing-State.

### Properties

```typescript
interface Router {
  readonly currentRoute: Computed<RouteLocation>; // Aktuelle Route (reaktiv)
  readonly routes: Route[]; // Alle Routen
  readonly mode: 'hash' | 'history'; // Routing-Modus
}
```

### Methods

#### push()

Navigiert zu einer neuen Route.

```typescript
router.push(location: string | RouteLocationRaw): Promise<void>
```

**Parameters:**

- `location` - Pfad als String oder Objekt mit `path`, `name`, `params`, `query`

**Example:**

```typescript
// Als String
await router.push('/users/123');

// Als Objekt mit Pfad
await router.push({ path: '/users/123' });

// Mit Namen
await router.push({ name: 'user-profile', params: { id: '123' } });

// Mit Query
await router.push({ path: '/search', query: { q: 'solidum' } });

// Mit State
await router.push({ path: '/success', state: { message: 'Done!' } });
```

#### replace()

Ersetzt die aktuelle Route (ohne History-Eintrag).

```typescript
router.replace(location: string | RouteLocationRaw): Promise<void>
```

**Example:**

```typescript
await router.replace('/login');
```

#### back()

Geht eine Seite zurück in der History.

```typescript
router.back(): void
```

**Example:**

```typescript
router.back();
```

#### forward()

Geht eine Seite vorwärts in der History.

```typescript
router.forward(): void
```

#### go()

Geht n Schritte in der History.

```typescript
router.go(n: number): void
```

**Parameters:**

- `n` - Anzahl der Schritte (negativ = zurück, positiv = vorwärts)

**Example:**

```typescript
router.go(-2); // 2 Seiten zurück
router.go(1); // 1 Seite vorwärts
```

#### resolve()

Löst eine Route-Location zu einer vollständigen Route auf.

```typescript
router.resolve(location: RouteLocationRaw): RouteLocation
```

**Example:**

```typescript
const route = router.resolve({ name: 'user-profile', params: { id: '123' } });
console.log(route.path); // /users/123
```

#### beforeEach()

Registriert einen globalen Before-Guard.

```typescript
router.beforeEach(guard: NavigationGuard): () => void
```

**Returns:** Function zum Deregistrieren

**Example:**

```typescript
const unregister = router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    return '/login';
  }
  return true;
});

// Später: Guard entfernen
unregister();
```

#### afterEach()

Registriert einen globalen After-Guard.

```typescript
router.afterEach(guard: AfterNavigationGuard): () => void
```

**Example:**

```typescript
router.afterEach((to, from) => {
  document.title = to.meta?.title || 'My App';
  trackPageView(to.path);
});
```

## Route

Route-Definition beschreibt eine einzelne Route.

### Properties

```typescript
interface Route {
  path: string; // URL-Pfad (z.B. '/users/:id')
  component: Component | (() => Promise<Component>); // Komponente oder Lazy-Load Funktion
  name?: string; // Eindeutiger Name
  children?: Route[]; // Nested Routes
  meta?: RouteMeta; // Benutzerdefinierte Meta-Daten
  beforeEnter?: NavigationGuard; // Route-spezifischer Guard
  redirect?: string | RouteLocation; // Redirect zu anderer Route
  alias?: string | string[]; // Alternative Pfade
}
```

### Example

```typescript
const route: Route = {
  path: '/users/:id',
  name: 'user-profile',
  component: UserProfile,
  meta: {
    requiresAuth: true,
    title: 'User Profile',
  },
  beforeEnter: (to, from) => {
    if (!hasPermission('view-users')) {
      return '/403';
    }
    return true;
  },
};
```

### Nested Routes

```typescript
const route: Route = {
  path: '/dashboard',
  component: DashboardLayout,
  children: [
    {
      path: 'overview', // /dashboard/overview
      component: Overview,
    },
    {
      path: 'stats', // /dashboard/stats
      component: Stats,
    },
  ],
};
```

### Lazy Loading

```typescript
const route: Route = {
  path: '/admin',
  component: () => import('./pages/Admin'), // Lazy-loaded
};
```

## RouterView

Komponente die die aktuelle Route rendert.

### Props

```typescript
interface RouterViewProps {
  router?: Router; // Router-Instanz (optional wenn injected)
  name?: string; // Named View (default: 'default')
  fallback?: any; // Fallback während Lazy-Load
}
```

### Example

```typescript
// Einfach
createElement(RouterView, { router });

// Mit Named View
createElement(RouterView, { router, name: 'sidebar' });

// Mit Fallback
createElement(RouterView, {
  router,
  fallback: createElement(LoadingSpinner, {}),
});
```

### Multiple Named Views

```typescript
const routes: Route[] = [
  {
    path: '/user/:id',
    components: {
      default: UserProfile,
      sidebar: UserSidebar,
      footer: UserFooter,
    },
  },
];

// Rendering
createElement('div', {}, [
  createElement(RouterView, { router, name: 'default' }),
  createElement('aside', {}, [createElement(RouterView, { router, name: 'sidebar' })]),
  createElement('footer', {}, [createElement(RouterView, { router, name: 'footer' })]),
]);
```

## Link

Komponente für Navigation-Links.

### Props

```typescript
interface LinkProps {
  to: string | RouteLocationRaw; // Ziel
  activeClass?: string; // CSS-Klasse wenn aktiv
  exactActiveClass?: string; // CSS-Klasse wenn exakt aktiv
  replace?: boolean; // Replace statt Push
  custom?: boolean; // Custom Rendering
  ariaCurrentValue?: string; // aria-current Wert
  [key: string]: any; // Weitere Props werden durchgereicht
}
```

### Example

```typescript
// Einfach
createElement(Link, { to: '/about' }, 'About');

// Mit activeClass
createElement(
  Link,
  {
    to: '/about',
    activeClass: 'active',
  },
  'About'
);

// Mit Objekt-Location
createElement(
  Link,
  {
    to: { name: 'user', params: { id: '123' } },
  },
  'View User'
);

// Replace Mode
createElement(
  Link,
  {
    to: '/login',
    replace: true,
  },
  'Login'
);
```

### Custom Rendering

```typescript
createElement(
  Link,
  {
    to: '/about',
    custom: true,
  },
  ({ href, navigate, isActive }) =>
    createElement(
      'a',
      {
        href,
        onclick: navigate,
        class: isActive ? 'active' : '',
      },
      'About'
    )
);
```

## useRouter()

Hook um auf die Router-Instanz zuzugreifen.

### Signature

```typescript
function useRouter(): Router;
```

### Returns

`Router` - Aktuelle Router-Instanz

### Example

```typescript
function MyComponent() {
  const router = useRouter();

  const goHome = () => {
    router.push('/');
  };

  const goBack = () => {
    router.back();
  };

  return createElement('div', {}, [
    createElement('button', { onclick: goHome }, 'Home'),
    createElement('button', { onclick: goBack }, 'Zurück'),
  ]);
}
```

## useRoute()

Hook um auf die aktuelle Route zuzugreifen.

### Signature

```typescript
function useRoute(): Computed<RouteLocation>;
```

### Returns

`Computed<RouteLocation>` - Reaktiver Zugriff auf aktuelle Route

### Example

```typescript
function MyComponent() {
  const route = useRoute();

  effect(() => {
    console.log('Current path:', route().path);
    console.log('Current params:', route().params);
    console.log('Current query:', route().query);
  });

  return createElement('div', {}, [createElement('p', {}, `Path: ${route().path}`)]);
}
```

## useParams()

Hook um auf Route-Parameter zuzugreifen.

### Signature

```typescript
function useParams(): Computed<RouteParams>;
```

### Returns

`Computed<RouteParams>` - Reaktive Route-Parameter

### Example

```typescript
// Route: /users/:id
function UserProfile() {
  const params = useParams();
  const userId = computed(() => params().id);

  effect(() => {
    loadUser(userId());
  });

  return createElement('div', {}, [createElement('h1', {}, `User ID: ${userId()}`)]);
}
```

## useQuery()

Hook um auf Query-Parameter zuzugreifen.

### Signature

```typescript
function useQuery(): Computed<RouteQuery>;
```

### Returns

`Computed<RouteQuery>` - Reaktive Query-Parameter

### Example

```typescript
// URL: /search?q=solidum&page=2
function SearchPage() {
  const query = useQuery();
  const searchTerm = computed(() => query().q || '');
  const page = computed(() => parseInt(query().page || '1'));

  effect(() => {
    search(searchTerm(), page());
  });

  return createElement('div', {}, [
    createElement('p', {}, `Searching for: ${searchTerm()}`),
    createElement('p', {}, `Page: ${page()}`),
  ]);
}
```

## Navigation Guards

### NavigationGuard

Guard-Funktion die vor Navigation ausgeführt wird.

```typescript
type NavigationGuard = (
  to: RouteLocation,
  from: RouteLocation
) => boolean | string | RouteLocation | Promise<boolean | string | RouteLocation>;
```

**Return Values:**

- `true` - Erlaube Navigation
- `false` - Verhindere Navigation
- `string` - Redirect zu diesem Pfad
- `RouteLocation` - Redirect zu dieser Location

**Example:**

```typescript
const authGuard: NavigationGuard = (to, from) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return '/login';
  }
  return true;
};
```

### AfterNavigationGuard

Guard-Funktion die nach Navigation ausgeführt wird.

```typescript
type AfterNavigationGuard = (to: RouteLocation, from: RouteLocation) => void;
```

**Example:**

```typescript
const analyticsGuard: AfterNavigationGuard = (to, from) => {
  document.title = to.meta?.title || 'My App';
  trackPageView(to.path);
};
```

### onBeforeRouteEnter

Component-Guard vor dem Betreten.

```typescript
function onBeforeRouteEnter(
  guard: (to: RouteLocation, from: RouteLocation) => boolean | string | RouteLocation
): void;
```

### onBeforeRouteLeave

Component-Guard vor dem Verlassen.

```typescript
function onBeforeRouteLeave(
  guard: (to: RouteLocation, from: RouteLocation) => boolean | string | RouteLocation
): void;
```

**Example:**

```typescript
function EditPage() {
  const hasChanges = atom(false);

  onBeforeRouteLeave((to, from) => {
    if (hasChanges()) {
      return confirm('Ungespeicherte Änderungen. Fortfahren?');
    }
    return true;
  });

  // ...
}
```

## Types

### RouteLocation

Beschreibt eine aufgelöste Route-Location.

```typescript
interface RouteLocation {
  path: string; // Vollständiger Pfad
  name?: string; // Route-Name
  params: RouteParams; // Route-Parameter
  query: RouteQuery; // Query-Parameter
  hash: string; // URL-Hash
  fullPath: string; // Pfad mit Query und Hash
  matched: RouteRecord[]; // Gematchte Route-Records
  meta: RouteMeta; // Zusammengeführte Meta-Daten
  redirectedFrom?: RouteLocation; // Original-Location bei Redirect
  state?: any; // History-State
}
```

### RouteLocationRaw

Unaufgelöste Route-Location (User-Input).

```typescript
type RouteLocationRaw =
  | string
  | {
      path?: string;
      name?: string;
      params?: RouteParams;
      query?: RouteQuery;
      hash?: string;
      state?: any;
      replace?: boolean;
    };
```

### RouteParams

Route-Parameter als Key-Value-Objekt.

```typescript
type RouteParams = Record<string, string | string[]>;
```

### RouteQuery

Query-Parameter als Key-Value-Objekt.

```typescript
type RouteQuery = Record<string, string | string[] | null>;
```

### RouteMeta

Benutzerdefinierte Meta-Daten.

```typescript
interface RouteMeta extends Record<string, any> {
  title?: string;
  requiresAuth?: boolean;
  roles?: string[];
  [key: string]: any;
}
```

### ScrollBehavior

Funktion die Scroll-Verhalten definiert.

```typescript
type ScrollBehavior = (
  to: RouteLocation,
  from: RouteLocation,
  savedPosition: ScrollPosition | null
) => ScrollPosition | Promise<ScrollPosition> | false;

interface ScrollPosition {
  top?: number;
  left?: number;
  el?: string | Element;
  behavior?: ScrollBehavior;
}
```

**Example:**

```typescript
const scrollBehavior: ScrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition;
  }

  if (to.hash) {
    return { el: to.hash, behavior: 'smooth' };
  }

  return { top: 0, left: 0 };
};
```

## Siehe auch

- [Router Guide](/docs/guide/router.md)
- [Navigation Examples](/docs/examples/navigation.md)
- [Quick Start](/docs/guide/quick-start.md)
