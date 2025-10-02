package templates

import (
	"fmt"
	"strings"
)

func ComponentTemplate(name string) string {
	return fmt.Sprintf(`import { createElement } from '@sldm/core';

export interface %sProps {
  // Add your props here
}

export function %s(props: %sProps) {
  return createElement('div', { className: '%s' },
    createElement('h2', {}, '%s Component'),
    createElement('p', {}, 'Start building your component here!')
  );
}
`, name, name, name, toLowerKebab(name), name)
}

func PageTemplate(name string) string {
	return fmt.Sprintf(`import { createElement } from '@sldm/core';
import { Container } from '@sldm/ui';

export function %sPage() {
  return createElement(Container, { maxWidth: 'lg' },
    createElement('div', { className: '%s-page' },
      createElement('h1', {}, '%s'),
      createElement('p', {}, 'Welcome to %s page!')
    )
  );
}
`, name, toLowerKebab(name), name, name)
}

func MainTemplate(template string, withUI bool) string {
	uiImport := ""
	if withUI {
		uiImport = "\nimport '@sldm/ui/styles.css';"
	}

	if template == "spa" {
		return fmt.Sprintf(`import { mount } from '@sldm/core';
import { createRouter, navigate } from '@sldm/router';%s
import { App } from './components/App';

const router = createRouter({
  routes: {
    '/': 'HomePage',
  }
});

mount(document.getElementById('app')!, App);
`, uiImport)
	}

	return fmt.Sprintf(`import { mount } from '@sldm/core';%s
import { App } from './components/App';

mount(document.getElementById('app')!, App);
`, uiImport)
}

func AppComponentTemplate(withUI bool) string {
	if withUI {
		return `import { createElement, useState } from '@sldm/core';
import { Button, Card, Container, Stack } from '@sldm/ui';

export function App() {
  const count = useState(0);

  return createElement(Container, { maxWidth: 'md' },
    createElement(Stack, { spacing: 'lg', align: 'center' },
      createElement('h1', {}, 'Welcome to Solidum!'),
      createElement(Card, { padding: 'lg' },
        createElement('p', {}, ` + "`Count: ${count()}`" + `),
        createElement(Button, {
          onClick: () => count(count() + 1)
        }, 'Increment')
      )
    )
  );
}
`
	}

	return `import { createElement, useState } from '@sldm/core';

export function App() {
  const count = useState(0);

  return createElement('div', { className: 'app' },
    createElement('h1', {}, 'Welcome to Solidum!'),
    createElement('p', {}, ` + "`Count: ${count()}`" + `),
    createElement('button', {
      onClick: () => count(count() + 1)
    }, 'Increment')
  );
}
`
}

func IndexHTMLTemplate(name string, withUI bool) string {
	css := ""
	if withUI {
		css = `
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: flex;
        place-items: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      #app {
        flex: 1;
      }
    </style>`
	}

	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>%s</title>%s
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
`, name, css)
}

func TSConfigTemplate() string {
	return `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
`
}

func GitIgnoreTemplate() string {
	return `node_modules
dist
.DS_Store
*.log
.env
.env.local
`
}

func ReadmeTemplate(name string) string {
	return fmt.Sprintf(`# %s

A Solidum application built with fine-grained reactivity.

## Getting Started

Install dependencies:

` + "```bash" + `
pnpm install
` + "```" + `

Run development server:

` + "```bash" + `
pnpm dev
` + "```" + `

Build for production:

` + "```bash" + `
pnpm build
` + "```" + `

## Learn More

- [Solidum Documentation](https://kluth.github.io/solidum)
- [Solidum GitHub](https://github.com/kluth/solidum)

## License

MIT
`, name)
}

func toLowerKebab(s string) string {
	result := ""
	for i, r := range s {
		if i > 0 && r >= 'A' && r <= 'Z' {
			result += "-"
		}
		result += string(r)
	}
	return strings.ToLower(result)
}

func ViteConfigTemplate() string {
	return `import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2020',
  },
});
`
}
