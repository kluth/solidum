# Server-Side Rendering (SSR) Guide

Server-Side Rendering mit @sldm/ssr ermöglicht es, Solidum-Anwendungen auf dem Server zu rendern für bessere Performance, SEO und initiales Laden.

## Inhaltsverzeichnis

- [Was ist SSR?](#was-ist-ssr)
- [Vorteile von SSR](#vorteile-von-ssr)
- [Installation](#installation)
- [Grundkonzepte](#grundkonzepte)
- [Basis Setup](#basis-setup)
- [Server-Komponenten](#server-komponenten)
- [Client Hydration](#client-hydration)
- [Data Fetching](#data-fetching)
- [Streaming SSR](#streaming-ssr)
- [SEO Optimierung](#seo-optimierung)
- [Performance](#performance)
- [Erweiterte Beispiele](#erweiterte-beispiele)

## Was ist SSR?

Server-Side Rendering bedeutet, dass HTML auf dem Server generiert wird, bevor es an den Browser gesendet wird. Im Gegensatz zum Client-Side Rendering, wo JavaScript im Browser das HTML erzeugt.

### Ablauf

```
1. Client → Request → Server
2. Server → Rendert Component zu HTML
3. Server → Sendet HTML + JS zum Client
4. Client → Zeigt HTML an (First Paint)
5. Client → Hydratisiert mit JavaScript
6. Client → App ist interaktiv
```

## Vorteile von SSR

### ✅ Schnelleres Initial Loading

Benutzer sehen sofort Inhalt, noch bevor JavaScript geladen ist.

### ✅ SEO-Freundlich

Suchmaschinen können den vollständigen Inhalt crawlen.

### ✅ Performance auf schwachen Geräten

HTML wird server-seitig generiert, weniger JavaScript-Arbeit auf dem Client.

### ✅ Social Media Sharing

Meta-Tags und Open Graph werden korrekt gerendert.

## Installation

```bash
pnpm add @sldm/ssr
# oder
solidum add ssr
```

## Grundkonzepte

### renderToString()

Rendert eine Komponente zu einem HTML-String:

```typescript
import { renderToString } from '@sldm/ssr';

const html = renderToString(App, { props: { title: 'Meine App' } });
```

### renderToStream()

Rendert eine Komponente als Stream für schnelleres Time-to-First-Byte:

```typescript
import { renderToStream } from '@sldm/ssr';

const stream = renderToStream(App, { props: { title: 'Meine App' } });
```

### hydrate()

"Erweckt" das Server-gerenderte HTML auf dem Client zum Leben:

```typescript
import { hydrate } from '@sldm/ssr';

hydrate(App, document.getElementById('app'), { props: { title: 'Meine App' } });
```

## Basis Setup

### 1. Server-Datei (server.ts)

```typescript
import express from 'express';
import { renderToString } from '@sldm/ssr';
import { App } from './App';

const server = express();

// Statische Assets servieren
server.use('/assets', express.static('dist/client'));

// SSR Route
server.get('*', async (req, res) => {
  try {
    // Komponente rendern
    const html = renderToString(App, {
      props: {
        url: req.url,
      },
    });

    // HTML-Template
    const page = `
      <!DOCTYPE html>
      <html lang="de">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Meine SSR App</title>
          <link rel="stylesheet" href="/assets/style.css">
        </head>
        <body>
          <div id="app">${html}</div>
          <script type="module" src="/assets/client.js"></script>
        </body>
      </html>
    `;

    res.send(page);
  } catch (error) {
    console.error('SSR Error:', error);
    res.status(500).send('Server Error');
  }
});

server.listen(3000, () => {
  console.log('Server läuft auf http://localhost:3000');
});
```

### 2. Client-Datei (client.ts)

```typescript
import { hydrate } from '@sldm/ssr';
import { App } from './App';

// Hydratisiere die Server-gerenderte App
hydrate(App, document.getElementById('app'), {
  props: {
    url: window.location.pathname,
  },
});
```

### 3. App-Komponente (App.ts)

```typescript
import { createElement, atom } from '@sldm/core';
import { createRouter, RouterView } from '@sldm/router';

export function App({ url }: { url: string }) {
  const router = createRouter({
    routes: [
      { path: '/', component: HomePage },
      { path: '/about', component: AboutPage },
      { path: '/blog/:slug', component: BlogPost },
    ],
    initialUrl: url, // Wichtig für SSR!
  });

  return createElement('div', { class: 'app' }, [
    createElement(Header, {}),
    createElement(RouterView, { router }),
    createElement(Footer, {}),
  ]);
}
```

## Server-Komponenten

### Isomorphe Komponenten

Komponenten, die sowohl auf Server als auch Client funktionieren:

```typescript
import { createElement, atom, computed } from '@sldm/core';

export function Counter({ initialCount = 0 }: { initialCount?: number }) {
  const count = atom(initialCount);

  // ✅ Funktioniert auf Server und Client
  const doubled = computed(() => count() * 2);

  return createElement('div', {}, [
    createElement('p', {}, `Count: ${count()}`),
    createElement('p', {}, `Doubled: ${doubled()}`),
    // Buttons funktionieren nur nach Hydration
    createElement(
      'button',
      {
        onclick: () => count(count() + 1),
      },
      '+'
    ),
  ]);
}
```

### Server-Only Code

Code, der nur auf dem Server laufen soll:

```typescript
import { createElement } from '@sldm/core';
import fs from 'fs'; // Node.js API

export function BlogPost({ slug }: { slug: string }) {
  let content = '';

  // Nur auf Server ausführen
  if (typeof window === 'undefined') {
    content = fs.readFileSync(`./posts/${slug}.md`, 'utf-8');
  }

  return createElement('article', {}, [createElement('div', { innerHTML: content })]);
}
```

### Client-Only Code

Code, der nur im Browser laufen soll:

```typescript
import { createElement, atom, effect } from '@sldm/core';

export function LocalStorageDemo() {
  const value = atom('');

  // Nur im Browser ausführen
  effect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('demo-value');
      if (saved) value(saved);
    }
  });

  effect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo-value', value());
    }
  });

  return createElement('input', {
    value: value(),
    oninput: e => value(e.target.value),
  });
}
```

## Client Hydration

### Hydration verstehen

Hydration "erweckt" das statische HTML zum Leben:

```typescript
// Server: Rendert zu HTML
const html = renderToString(App, { props: { count: 5 } });
// Output: <div><p>Count: 5</p><button>+</button></div>

// Client: Macht HTML interaktiv
hydrate(App, root, { props: { count: 5 } });
// Jetzt funktioniert der Button!
```

### Hydration Mismatch vermeiden

```typescript
// ❌ Schlecht: Zeit unterscheidet sich zwischen Server/Client
function BadComponent() {
  const time = new Date().toISOString();
  return createElement('p', {}, `Zeit: ${time}`);
}

// ✅ Gut: Konsistenter State
function GoodComponent({ serverTime }: { serverTime: string }) {
  const time = atom(serverTime);

  // Nur auf Client aktualisieren
  effect(() => {
    if (typeof window !== 'undefined') {
      setInterval(() => time(new Date().toISOString()), 1000);
    }
  });

  return createElement('p', {}, `Zeit: ${time()}`);
}
```

### Hydration mit Props

```typescript
// Server
const props = { user: { name: 'Max', id: 123 } };
const html = renderToString(App, { props });

// Props in HTML einbetten
const page = `
  <div id="app">${html}</div>
  <script id="props" type="application/json">
    ${JSON.stringify(props)}
  </script>
  <script type="module" src="/client.js"></script>
`;

// Client
const propsEl = document.getElementById('props');
const props = JSON.parse(propsEl.textContent);
hydrate(App, document.getElementById('app'), { props });
```

## Data Fetching

### Server-seitig laden

```typescript
import express from 'express';
import { renderToString } from '@sldm/ssr';

server.get('/blog/:slug', async (req, res) => {
  // Lade Daten auf dem Server
  const post = await db.posts.findOne({ slug: req.params.slug });

  if (!post) {
    return res.status(404).send('Not Found');
  }

  // Render mit Daten
  const html = renderToString(BlogPost, {
    props: { post },
  });

  res.send(renderPage(html, { post }));
});
```

### Komponente mit Daten

```typescript
interface Post {
  title: string;
  content: string;
  author: string;
}

export function BlogPost({ post }: { post: Post }) {
  return createElement('article', {}, [
    createElement('h1', {}, post.title),
    createElement('p', { class: 'author' }, `Von ${post.author}`),
    createElement('div', { innerHTML: post.content }),
  ]);
}
```

### Async Data Loading

```typescript
import { renderToStringAsync } from '@sldm/ssr';

// Async Komponente
export async function UserProfile({ userId }: { userId: string }) {
  // Lade Daten
  const user = await fetchUser(userId);

  return createElement('div', {}, [
    createElement('h1', {}, user.name),
    createElement('p', {}, user.email),
  ]);
}

// Server
server.get('/users/:id', async (req, res) => {
  const html = await renderToStringAsync(UserProfile, {
    props: { userId: req.params.id },
  });

  res.send(renderPage(html));
});
```

## Streaming SSR

### Chunk-by-Chunk rendern

```typescript
import { renderToStream } from '@sldm/ssr';

server.get('*', async (req, res) => {
  // Sende HTML-Header sofort
  res.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Streaming SSR</title>
      </head>
      <body>
        <div id="app">
  `);

  // Stream App-Content
  const stream = renderToStream(App, {
    props: { url: req.url },
  });

  stream.on('data', chunk => {
    res.write(chunk);
  });

  stream.on('end', () => {
    res.write(`
        </div>
        <script src="/client.js"></script>
      </body>
    </html>
    `);
    res.end();
  });

  stream.on('error', error => {
    console.error('Stream error:', error);
    res.status(500).end();
  });
});
```

### Suspense-ähnliches Verhalten

```typescript
export function ProductPage({ productId }: { productId: string }) {
  return createElement('div', {}, [
    createElement('h1', {}, 'Produkt'),

    // Sofort rendern
    createElement(ProductHeader, { productId }),

    // Mit Fallback für langsame Daten
    createElement(
      Suspense,
      {
        fallback: createElement(LoadingSkeleton, {}),
      },
      [createElement(ProductDetails, { productId }), createElement(ProductReviews, { productId })]
    ),
  ]);
}
```

## SEO Optimierung

### Meta-Tags

```typescript
import { Head } from '@sldm/ssr';

export function BlogPost({ post }: { post: Post }) {
  return createElement('div', {}, [
    createElement(Head, {}, [
      createElement('title', {}, post.title),
      createElement('meta', {
        name: 'description',
        content: post.excerpt,
      }),
      createElement('meta', {
        property: 'og:title',
        content: post.title,
      }),
      createElement('meta', {
        property: 'og:description',
        content: post.excerpt,
      }),
      createElement('meta', {
        property: 'og:image',
        content: post.image,
      }),
    ]),

    createElement('article', {}, [
      // ... Post Content
    ]),
  ]);
}
```

### Sitemap generieren

```typescript
import { renderToString } from '@sldm/ssr';

server.get('/sitemap.xml', async (req, res) => {
  const posts = await db.posts.findAll();

  const urls = [
    { loc: 'https://example.com/', priority: 1.0 },
    { loc: 'https://example.com/about', priority: 0.8 },
    ...posts.map(post => ({
      loc: `https://example.com/blog/${post.slug}`,
      lastmod: post.updatedAt,
      priority: 0.6,
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      url => `
    <url>
      <loc>${url.loc}</loc>
      ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
      <priority>${url.priority}</priority>
    </url>
  `
    )
    .join('')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});
```

### Strukturierte Daten

```typescript
export function ProductPage({ product }: { product: Product }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
    },
  };

  return createElement('div', {}, [
    createElement('script', {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(structuredData),
    }),
    createElement('h1', {}, product.name),
    // ... Rest
  ]);
}
```

## Performance

### Caching

```typescript
import { LRUCache } from 'lru-cache';

const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 Minuten
});

server.get('/blog/:slug', async (req, res) => {
  const { slug } = req.params;

  // Cache prüfen
  let html = cache.get(slug);

  if (!html) {
    const post = await db.posts.findOne({ slug });
    html = renderToString(BlogPost, { props: { post } });
    cache.set(slug, html);
  }

  res.send(renderPage(html));
});
```

### Partial Hydration

```typescript
// Nur interaktive Teile hydratisieren
export function ProductPage({ product }: { product: Product }) {
  return createElement('div', {}, [
    // Statisch (nicht hydratisiert)
    createElement('h1', {}, product.name),
    createElement('img', { src: product.image }),

    // Interaktiv (hydratisiert)
    createElement('div', { 'data-hydrate': 'true' }, [
      createElement(AddToCartButton, { productId: product.id }),
    ]),

    // Statisch
    createElement('p', {}, product.description),

    // Interaktiv
    createElement('div', { 'data-hydrate': 'true' }, [
      createElement(ReviewForm, { productId: product.id }),
    ]),
  ]);
}

// Client: Nur markierte Teile hydratisieren
document.querySelectorAll('[data-hydrate="true"]').forEach(el => {
  const component = componentMap[el.dataset.component];
  hydrate(component, el);
});
```

### Resource Hints

```typescript
function renderPage(html: string, { preload = [] }: { preload?: string[] }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        ${preload.map(url => `<link rel="preload" href="${url}" as="script">`).join('')}
        <link rel="prefetch" href="/api/popular-products">
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
  `;
}
```

## Erweiterte Beispiele

### Vollständiges E-Commerce Setup

```typescript
// server.ts
import express from 'express';
import { renderToString } from '@sldm/ssr';
import { App } from './App';
import { ProductService } from './services/ProductService';

const server = express();
const products = new ProductService();

// Product Detail Page
server.get('/products/:id', async (req, res) => {
  const product = await products.getById(req.params.id);

  if (!product) {
    return res.status(404).send('Product not found');
  }

  const html = renderToString(App, {
    props: {
      route: 'product',
      product,
    },
  });

  res.send(
    renderPage(html, {
      title: product.name,
      description: product.description,
      image: product.mainImage,
      price: product.price,
    })
  );
});

// Category Page
server.get('/category/:slug', async (req, res) => {
  const category = await products.getCategory(req.params.slug);
  const items = await products.getByCategory(req.params.slug);

  const html = renderToString(App, {
    props: {
      route: 'category',
      category,
      products: items,
    },
  });

  res.send(
    renderPage(html, {
      title: category.name,
      description: category.description,
    })
  );
});

function renderPage(html: string, meta: any) {
  return `
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${meta.title} | Mein Shop</title>
        <meta name="description" content="${meta.description}">

        <!-- Open Graph -->
        <meta property="og:title" content="${meta.title}">
        <meta property="og:description" content="${meta.description}">
        ${meta.image ? `<meta property="og:image" content="${meta.image}">` : ''}

        <!-- Preload critical resources -->
        <link rel="preload" href="/assets/style.css" as="style">
        <link rel="preload" href="/assets/app.js" as="script">

        <link rel="stylesheet" href="/assets/style.css">
      </head>
      <body>
        <div id="app">${html}</div>
        <script id="initial-data" type="application/json">
          ${JSON.stringify({ ...meta })}
        </script>
        <script type="module" src="/assets/app.js"></script>
      </body>
    </html>
  `;
}
```

### Internationalisierung (i18n)

```typescript
import { renderToString } from '@sldm/ssr';
import { i18n } from './i18n';

server.get('/:lang/*', async (req, res) => {
  const { lang } = req.params;
  const path = req.params[0];

  // Lade Übersetzungen
  const translations = await i18n.load(lang);

  const html = renderToString(App, {
    props: {
      url: path,
      lang,
      translations,
    },
  });

  res.send(renderPage(html, { lang }));
});

// App mit i18n
export function App({ lang, translations }: any) {
  const t = (key: string) => translations[key] || key;

  return createElement('div', { lang }, [
    createElement('h1', {}, t('welcome')),
    createElement('p', {}, t('description')),
  ]);
}
```

## Best Practices

### 1. Isomorphe Komponenten schreiben

```typescript
// ✅ Gut: Funktioniert überall
export function Component() {
  const isClient = typeof window !== 'undefined';
  return createElement('div', {}, isClient ? 'Client' : 'Server');
}

// ❌ Vermeiden: Nimmt window an
export function BadComponent() {
  return createElement('div', {}, window.location.href);
}
```

### 2. Data Fetching auf Server

```typescript
// ✅ Gut: Daten auf Server laden
server.get('/page', async (req, res) => {
  const data = await fetchData();
  const html = renderToString(Component, { props: { data } });
  res.send(renderPage(html));
});

// ❌ Vermeiden: Fetch in Komponente
export function Component() {
  effect(() => {
    fetch('/api/data').then(/* ... */);
  });
}
```

### 3. Fehlerbehandlung

```typescript
server.get('*', async (req, res) => {
  try {
    const html = renderToString(App, { props: { url: req.url } });
    res.send(renderPage(html));
  } catch (error) {
    console.error('SSR Error:', error);

    // Fallback zu Client-Side Rendering
    res.send(
      renderPage('<div id="app"></div>', {
        title: 'App lädt...',
      })
    );
  }
});
```

## Siehe auch

- [API-Referenz](/docs/api/ssr.md)
- [Performance Guide](/docs/guide/performance.md)
- [SEO Best Practices](/docs/guide/seo.md)
