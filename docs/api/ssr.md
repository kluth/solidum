# SSR API Reference

Vollst�ndige API-Dokumentation f�r @sldm/ssr (Server-Side Rendering).

## Table of Contents

- [Core Functions](#core-functions)
  - [renderToString()](#rendertostring)
  - [createHtmlTemplate()](#createhtmltemplate)
  - [escapeHtml()](#escapehtml)
  - [renderAttributes()](#renderattributes)
- [Types](#types)
- [Server Setup](#server-setup)
- [Client Hydration](#client-hydration)

## Core Functions

### renderToString()

Rendert eine Komponente zu einem HTML-String.

**Signature:**

```typescript
function renderToString(
  vnode: VNode | VNode[] | string | number | null | undefined | boolean
): string;
```

**Parameters:**

- `vnode` - Virtual Node, Array, Primitive oder null/undefined

**Returns:** `string` - HTML-String

**Example:**

```typescript
import { renderToString } from '@sldm/ssr';
import { createElement } from '@sldm/core';

function App() {
  return createElement('div', { class: 'app' }, [
    createElement('h1', {}, 'Hello SSR'),
    createElement('p', {}, 'Server-rendered content'),
  ]);
}

const html = renderToString(createElement(App, {}));
// '<div class="app"><h1>Hello SSR</h1><p>Server-rendered content</p></div>'
```

**Features:**

-  Komponenten-Funktionen
-  HTML-Elemente
-  Fragments
-  Arrays
-  Primitives (string, number, boolean)
-  Null/Undefined (rendert nichts)
-  Auto-escaping f�r Sicherheit

---

#### Rendering verschiedener VNode-Typen

**HTML-Elemente:**

```typescript
const vnode = createElement('div', { class: 'container' }, 'Content');
const html = renderToString(vnode);
// '<div class="container">Content</div>'
```

**Komponenten:**

```typescript
function Button({ text }: { text: string }) {
  return createElement('button', {}, text);
}

const html = renderToString(createElement(Button, { text: 'Click me' }));
// '<button>Click me</button>'
```

**Arrays:**

```typescript
const items = ['Apple', 'Banana', 'Cherry'];
const html = renderToString(items.map(item => createElement('li', {}, item)));
// '<li>Apple</li><li>Banana</li><li>Cherry</li>'
```

**Fragments:**

```typescript
import { Fragment } from '@sldm/core';

const html = renderToString(
  createElement(Fragment, null, createElement('h1', {}, 'Title'), createElement('p', {}, 'Content'))
);
// '<h1>Title</h1><p>Content</p>'
```

**Primitives:**

```typescript
renderToString('Hello'); // 'Hello'
renderToString(42); // '42'
renderToString(true); // ''
renderToString(false); // ''
renderToString(null); // ''
renderToString(undefined); // ''
```

---

### createHtmlTemplate()

Erstellt ein vollst�ndiges HTML-Dokument mit Content.

**Signature:**

```typescript
function createHtmlTemplate(
  content: string,
  title?: string,
  styles?: string,
  scripts?: string
): string;
```

**Parameters:**

- `content` - Der gerenderte HTML-Content
- `title` - Seiten-Titel (default: 'Solidum App')
- `styles` - CSS-Datei URL (optional)
- `scripts` - JavaScript-Datei URL (optional)

**Returns:** `string` - Vollst�ndiges HTML-Dokument

**Example:**

```typescript
import { renderToString, createHtmlTemplate } from '@sldm/ssr';

function App() {
  return createElement('div', { id: 'app' }, 'Hello World');
}

const content = renderToString(createElement(App, {}));

const html = createHtmlTemplate(content, 'My App', '/styles/main.css', '/dist/client.js');
```

**Generated HTML:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
    <link rel="stylesheet" href="/styles/main.css" />
  </head>
  <body>
    <div id="app">Hello World</div>
    <script src="/dist/client.js"></script>
  </body>
</html>
```

---

### escapeHtml()

Escaped HTML-Zeichen f�r sichere Ausgabe.

**Signature:**

```typescript
function escapeHtml(text: string | number): string;
```

**Parameters:**

- `text` - Der zu escapende Text

**Returns:** `string` - Escaped Text

**Escaped Characters:**

- `&` � `&amp;`
- `<` � `&lt;`
- `>` � `&gt;`
- `"` � `&quot;`
- `'` � `&#039;`

**Example:**

```typescript
import { escapeHtml } from '@sldm/ssr';

escapeHtml('Hello <script>alert("XSS")</script>');
// 'Hello &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'

escapeHtml('Tom & Jerry');
// 'Tom &amp; Jerry'

escapeHtml(42);
// '42'
```

**Usage in Components:**

```typescript
function UserGreeting({ name }: { name: string }) {
  // Auto-escaped by renderToString
  return createElement('h1', {}, `Welcome, ${name}!`);
}

// Safe even with malicious input
renderToString(
  createElement(UserGreeting, {
    name: '<script>alert("xss")</script>',
  })
);
// '<h1>Welcome, &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;!</h1>'
```

---

### renderAttributes()

Rendert Props zu HTML-Attributen.

**Signature:**

```typescript
function renderAttributes(props: Record<string, unknown> | undefined): string;
```

**Parameters:**

- `props` - Props-Objekt

**Returns:** `string` - Attribute-String (mit f�hrendem Leerzeichen wenn nicht leer)

**Example:**

```typescript
import { renderAttributes } from '@sldm/ssr';

renderAttributes({
  id: 'app',
  class: 'container',
  'data-value': '123',
});
// ' id="app" class="container" data-value="123"'

renderAttributes({
  disabled: true,
  hidden: false,
  checked: true,
});
// ' disabled checked'

renderAttributes({
  style: {
    color: 'red',
    fontSize: '16px',
    backgroundColor: '#fff',
  },
});
// ' style="color: red; font-size: 16px; background-color: #fff"'
```

**Special Cases:**

```typescript
// className � class
renderAttributes({ className: 'btn' });
// ' class="btn"'

// Boolean attributes
renderAttributes({ disabled: true }); // ' disabled'
renderAttributes({ disabled: false }); // ''

// Null/Undefined (skip)
renderAttributes({ value: null }); // ''
renderAttributes({ value: undefined }); // ''

// Style object � string
renderAttributes({
  style: {
    color: 'red',
    fontSize: 16,
    marginTop: '1rem',
  },
});
// ' style="color: red; font-size: 16; margin-top: 1rem"'
```

---

## Types

### VNode

Virtual Node Interface.

```typescript
interface VNode {
  type: string | symbol | Function; // Element-Tag, Fragment oder Komponente
  props?: Record<string, unknown>; // Properties/Attributes
  children?: unknown[]; // Child-Elemente
  text?: string; // Text-Content (f�r TEXT_NODE)
  _html?: string; // Pre-rendered HTML (f�r WebML)
  _isWebMLNode?: boolean; // WebML-Marker
}
```

**Example:**

```typescript
const vnode: VNode = {
  type: 'div',
  props: { class: 'container', id: 'app' },
  children: [
    { type: 'h1', props: {}, children: ['Title'] },
    { type: 'p', props: {}, children: ['Content'] },
  ],
};
```

---

## Server Setup

### Express Server

```typescript
import express from 'express';
import { renderToString, createHtmlTemplate } from '@sldm/ssr';
import { createElement } from '@sldm/core';
import App from './App';

const server = express();

// Serve static files
server.use(express.static('public'));

// SSR route
server.get('*', (req, res) => {
  // Render app with current URL
  const content = renderToString(createElement(App, { url: req.url }));

  // Create full HTML
  const html = createHtmlTemplate(content, 'My App', '/styles.css', '/client.js');

  res.send(html);
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

---

### Node.js HTTP Server

```typescript
import http from 'http';
import { renderToString, createHtmlTemplate } from '@sldm/ssr';
import { createElement } from '@sldm/core';
import App from './App';

const server = http.createServer((req, res) => {
  const content = renderToString(createElement(App, { url: req.url }));

  const html = createHtmlTemplate(content, 'My App', '/styles.css', '/client.js');

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

server.listen(3000);
```

---

### With Data Fetching

```typescript
import express from 'express';
import { renderToString, createHtmlTemplate } from '@sldm/ssr';

const server = express();

server.get('/user/:id', async (req, res) => {
  try {
    // Fetch data on server
    const user = await fetchUser(req.params.id);

    // Render with data
    const content = renderToString(createElement(UserProfile, { user }));

    const html = createHtmlTemplate(content, `${user.name} - Profile`, '/styles.css', '/client.js');

    res.send(html);
  } catch (error) {
    res.status(404).send('User not found');
  }
});
```

---

### With State Injection

```typescript
server.get('*', async (req, res) => {
  // Fetch initial data
  const initialData = await fetchInitialData(req.url);

  // Render app
  const content = renderToString(createElement(App, { initialData }));

  // Inject state into HTML
  const html = createHtmlTemplate(content, 'My App').replace(
    '</body>',
    `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}</script></body>`
  );

  res.send(html);
});
```

---

## Client Hydration

### Basic Hydration

```typescript
// client.ts
import { mount, createElement } from '@sldm/core';
import App from './App';

// Get initial data from server
const initialData = (window as any).__INITIAL_DATA__;

// Mount/Hydrate app
mount(createElement(App, { initialData }), document.getElementById('app')!);
```

---

### With Router

```typescript
// client.ts
import { mount, createElement } from '@sldm/core';
import { createRouter } from '@sldm/router';
import App from './App';

const router = createRouter({
  routes: [
    { path: '/', component: HomePage },
    { path: '/about', component: AboutPage },
  ],
  mode: 'history',
});

mount(createElement(App, { router }), document.getElementById('app')!);
```

---

## Best Practices

### 1. Escape User Content

```typescript
//  RICHTIG: Auto-escaped
function UserComment({ text }: { text: string }) {
  return createElement('p', {}, text);
}

// L FALSCH: Direct innerHTML (XSS risk)
function UserComment({ text }: { text: string }) {
  return createElement('p', {
    dangerouslySetInnerHTML: { __html: text },
  });
}
```

---

### 2. Handle Async Data on Server

```typescript
//  RICHTIG: Fetch on server, pass as prop
server.get('/products', async (req, res) => {
  const products = await fetchProducts();
  const html = renderToString(createElement(ProductList, { products }));
  res.send(createHtmlTemplate(html));
});

// L FALSCH: Fetch in component (doesn't work in SSR)
function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts); // Won't run on server!
  }, []);

  // ...
}
```

---

### 3. Void Elements

```typescript
//  RICHTIG: Self-closing tags automatisch erkannt
renderToString(createElement('br', {}));
// '<br>'

renderToString(createElement('img', { src: 'image.jpg', alt: 'Photo' }));
// '<img src="image.jpg" alt="Photo">'

// Liste der void elements:
// area, base, br, col, embed, hr, img, input,
// link, meta, param, source, track, wbr
```

---

### 4. Meta Tags f�r SEO

```typescript
function createSEOTemplate(
  content: string,
  meta: {
    title: string;
    description: string;
    image?: string;
    url?: string;
  }
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}">

  <!-- Open Graph -->
  <meta property="og:title" content="${escapeHtml(meta.title)}">
  <meta property="og:description" content="${escapeHtml(meta.description)}">
  ${meta.image ? `<meta property="og:image" content="${meta.image}">` : ''}
  ${meta.url ? `<meta property="og:url" content="${meta.url}">` : ''}

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(meta.title)}">
  <meta name="twitter:description" content="${escapeHtml(meta.description)}">
  ${meta.image ? `<meta name="twitter:image" content="${meta.image}">` : ''}
</head>
<body>
  <div id="app">${content}</div>
  <script src="/client.js"></script>
</body>
</html>`;
}
```

---

## Error Handling

### Component Errors

```typescript
function ErrorBoundary({ children }: { children: unknown }) {
  try {
    return createElement(Fragment, null, children);
  } catch (error) {
    console.error('SSR Error:', error);
    return createElement('div', { class: 'error' }, [
      createElement('h1', {}, 'Error'),
      createElement('p', {}, 'Something went wrong'),
    ]);
  }
}

// Usage
const html = renderToString(createElement(ErrorBoundary, {}, [createElement(App, {})]));
```

---

### Server Errors

```typescript
server.get('*', async (req, res) => {
  try {
    const content = renderToString(createElement(App, { url: req.url }));

    const html = createHtmlTemplate(content);
    res.send(html);
  } catch (error) {
    console.error('SSR Error:', error);

    // Send error page
    res.status(500).send(createHtmlTemplate('<h1>500 - Server Error</h1>', 'Error'));
  }
});
```

---

## Performance Tips

### 1. Streaming (Advanced)

F�r gro�e Seiten k�nnen Sie Streaming nutzen:

```typescript
import { Readable } from 'stream';

server.get('*', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });

  // Send header
  res.write('<!DOCTYPE html><html><head><title>My App</title></head><body>');

  // Stream content in chunks
  const content = renderToString(createElement(App, {}));
  res.write(content);

  // Send footer
  res.write('<script src="/client.js"></script></body></html>');
  res.end();
});
```

---

### 2. Caching

```typescript
const cache = new Map<string, string>();

server.get('/static/:page', (req, res) => {
  const { page } = req.params;
  const cacheKey = `page:${page}`;

  // Check cache
  if (cache.has(cacheKey)) {
    return res.send(cache.get(cacheKey));
  }

  // Render
  const html = createHtmlTemplate(renderToString(createElement(StaticPage, { page })));

  // Cache for 1 hour
  cache.set(cacheKey, html);
  setTimeout(() => cache.delete(cacheKey), 3600000);

  res.send(html);
});
```

---

## Siehe auch

- [SSR Guide](/docs/guide/ssr.md)
- [Core API](/docs/api/components.md)
- [Router API](/docs/api/router.md)
- [Examples](/docs/examples/ssr.md)
