# @sldm/ssr

> Server-side rendering for Solidum applications

## Installation

```bash
npm install @sldm/ssr @sldm/core
# or
pnpm add @sldm/ssr @sldm/core
```

## Features

- 🖥️ **Server-Side Rendering** - Render on the server
- ⚡ **Fast** - Pre-rendered HTML for better performance
- 🔄 **Hydration** - Client-side takeover

## Quick Start

```typescript
import { renderToString } from '@sldm/ssr';
import { createElement } from '@sldm/core';

function App() {
  return createElement('h1', {}, 'Hello from SSR!');
}

// Render to HTML string
const html = renderToString(App);
console.log(html); // <h1>Hello from SSR!</h1>
```

## API

### `renderToString(component)`

Renders component to HTML string.

## License

MIT © Matthias Kluth
