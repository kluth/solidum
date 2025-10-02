# Installation

## Package Manager

Install Solidum via your preferred package manager:

::: code-group

```bash [npm]
npm install @sldm/core
```

```bash [pnpm]
pnpm add @sldm/core
```

```bash [yarn]
yarn add @sldm/core
```

```bash [bun]
bun add @sldm/core
```

:::

## TypeScript

Solidum is written in TypeScript and includes type definitions out of the box.

### tsconfig.json

Recommended TypeScript configuration:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## Build Tools

### Vite

Solidum works great with Vite:

```bash
npm create vite@latest my-solidum-app
cd my-solidum-app
npm install @sldm/core
```

**vite.config.ts:**

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  // Your Vite config
});
```

### Webpack

For Webpack projects:

**webpack.config.js:**

```javascript
module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

### esbuild

Using esbuild:

```bash
esbuild src/index.ts --bundle --outfile=dist/bundle.js
```

## CDN

For quick prototyping, you can use Solidum via CDN:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Solidum App</title>
  </head>
  <body>
    <div id="app"></div>

    <script type="module">
      import { atom, createElement, mount } from 'https://esm.sh/@sldm/core';

      const count = atom(0);

      function Counter() {
        return createElement(
          'div',
          null,
          createElement('h1', null, `Count: ${count()}`),
          createElement(
            'button',
            {
              onClick: () => count(count() + 1),
            },
            'Increment'
          )
        );
      }

      mount(document.getElementById('app'), () => createElement(Counter));
    </script>
  </body>
</html>
```

## Project Structure

Recommended project structure:

```
my-solidum-app/
├── src/
│   ├── components/
│   │   ├── Counter.ts
│   │   └── TodoList.ts
│   ├── stores/
│   │   └── todoStore.ts
│   ├── utils/
│   │   └── helpers.ts
│   ├── index.ts
│   └── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts (or webpack.config.js)
```

## Testing Setup

Install testing utilities:

```bash
npm install -D @sldm/testing
```

See the [Testing Guide](/guide/testing) for more details.

## Next Steps

- Follow the [Quick Start](/guide/quick-start) guide
- Learn about [Reactivity](/guide/reactivity)
- Explore [Examples](/examples/counter)
