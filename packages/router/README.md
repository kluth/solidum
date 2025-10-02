# @solidum/router

> Simple SPA router for Solidum applications

## Installation

```bash
npm install @solidum/router @solidum/core
# or
pnpm add @solidum/router @solidum/core
```

## Features

- 🚀 **Simple API** - Easy to use routing
- 📍 **Reactive** - Built on Solidum's reactivity system
- 🔗 **Programmatic Navigation** - Navigate via function calls
- 📦 **Tiny** - Minimal footprint

## Quick Start

```typescript
import { createRouter, navigate } from '@solidum/router';
import { mount } from '@solidum/core';

// Define routes
const router = createRouter({
  routes: {
    '/': 'HomePage',
    '/about': 'AboutPage',
    '/users/:id': 'UserPage'
  }
});

// Get current route info
const currentPath = router.getCurrentPath(); // '/'
const currentPage = router.getCurrentPage(); // 'HomePage'

// Navigate programmatically
navigate('/about');

// Listen for route changes
window.addEventListener('routechange', (event) => {
  console.log('Navigated to:', event.detail.path);
});
```

## API

### `createRouter(options)`

Creates a router instance.

```typescript
const router = createRouter({
  routes: {
    '/': 'HomePage',
    '/products': 'ProductsPage',
    '/products/:id': 'ProductDetailPage'
  },
  initialPath: window.location.pathname
});
```

### `navigate(path)`

Navigate to a new route.

```typescript
navigate('/products/123');
```

### Router Methods

- `router.getCurrentPath()` - Get current path
- `router.getCurrentPage()` - Get current page component name

## License

MIT © Matthias Kluth
