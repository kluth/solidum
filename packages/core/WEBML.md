# WebML - Web Markup Language

WebML is Solid's template system that separates logic from presentation by using separate `.ts` (logic) and `.webml` (template) files.

## Philosophy

**Separation of Concerns:** Logic stays in TypeScript, markup stays in WebML templates. This makes components:
- Easier to maintain
- Easier to understand
- Easier to test
- More reusable

## Quick Start

### 1. Create a Template (.webml file)

```html
<!-- Button.webml -->
<button
  class="{{classes}}"
  {{#if disabled}}disabled{{/if}}
  type="button"
  {{#if onClick}}onclick="{{onClick}}"{{/if}}
  {{restAttrs}}
>
  {{children}}
</button>
```

### 2. Create Component Logic (.ts file)

```typescript
// Button.ts
import { renderTemplate } from '@sldm/core';
import { cn } from '@sldm/utils';
import template from './Button.webml.js';  // Compiled template

export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  children?: unknown;
  className?: string;
  onClick?: (e: Event) => void;
}

export function Button(props: ButtonProps) {
  const { variant = 'primary', disabled, children, className, onClick, ...rest } = props;

  // Logic: compute classes
  const classes = cn(
    'button',
    `button--${variant}`,
    { 'button--disabled': disabled },
    className
  );

  // Logic: prepare attributes
  const restAttrs = Object.entries(rest)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  // Pass computed values to template
  return renderTemplate(template({
    classes,
    disabled,
    onClick,
    restAttrs,
    children
  }));
}
```

### 3. Build

WebML templates are automatically compiled during build:

```bash
pnpm build  # Runs prebuild step that compiles .webml files
```

## Template Syntax

### Variables

```html
<div class="{{className}}">
  {{content}}
</div>
```

Compiles to:
```javascript
webml`<div class="${props.className}">${props.content}</div>`
```

### Conditionals

```html
{{#if condition}}
  <p>Condition is true</p>
{{/if}}
```

Compiles to:
```javascript
webml`${props.condition ? `<p>Condition is true</p>` : ''}`
```

### Iteration

```html
<ul>
  {{#each items}}
    <li>{{item}}</li>
  {{/each}}
</ul>
```

Compiles to:
```javascript
webml`<ul>${props.items.map((item, index) => `<li>${item}</li>`).join('')}</ul>`
```

Available in loops:
- `{{item}}` - current item
- `{{@index}}` - current index

### Dynamic Attributes

Pass pre-computed attribute strings:

```typescript
// Component logic
const attrs = Object.entries(rest).map(([k, v]) => `${k}="${v}"`).join(' ');

// Template
<div {{attrs}}></div>
```

## Best Practices

### 1. Keep Logic in TypeScript

❌ **Bad:**
```html
<div class="container {{#if isPrimary}}container--primary{{/if}}">
```

✅ **Good:**
```typescript
// Component.ts
const classes = cn('container', { 'container--primary': isPrimary });

// Component.webml
<div class="{{classes}}">
```

### 2. Prepare Data for Templates

Templates should receive ready-to-render data:

```typescript
// ❌ Bad: Complex logic in template
template({ user, formatDate: (d) => new Date(d).toLocalString() })

// ✅ Good: Prepare data first
const formattedDate = new Date(user.createdAt).toLocalString();
template({ user, formattedDate })
```

### 3. Use Type-Safe Props

```typescript
export interface CardProps {
  padding?: 'sm' | 'md' | 'lg';  // Type-safe
  children?: unknown;
}

// TypeScript ensures type safety
const templateProps: Record<string, unknown> = {
  classes: computeClasses(props),
  children: props.children
};
```

### 4. Handle Events in Logic

```typescript
// Component.ts
function handleClick(e: Event) {
  e.preventDefault();
  // Handle click logic
}

// Pass to template
template({ onClick: handleClick })

// Component.webml
<button onclick="{{onClick}}">Click</button>
```

## Advanced Patterns

### Component Composition

```typescript
// Parent.ts
import { renderTemplate } from '@sldm/core';
import template from './Parent.webml.js';
import { Child } from './Child.js';

export function Parent(props) {
  const child = Child({ message: 'Hello' });

  return renderTemplate(template({
    child  // Pass rendered child
  }));
}

// Parent.webml
<div class="parent">
  {{child}}
</div>
```

### Conditional Sections

```typescript
// Card.ts
const header = props.title
  ? renderTemplate(headerTemplate({ title: props.title }))
  : null;

template({
  header,  // Will be empty if null
  body: props.children
});

// Card.webml
<div class="card">
  {{header}}
  <div class="card-body">{{body}}</div>
</div>
```

### Dynamic Classes

```typescript
import { cn } from '@sldm/utils';

const classes = cn(
  'button',
  `button--${variant}`,
  `button--${size}`,
  {
    'button--disabled': disabled,
    'button--loading': loading,
    'button--active': active
  },
  className
);
```

## Compiler

The WebML compiler runs as a prebuild step:

```json
{
  "scripts": {
    "prebuild": "node scripts/compile-webml.js",
    "build": "tsc"
  }
}
```

It converts `.webml` files to `.webml.ts` files that export a template function:

```typescript
// Button.webml.ts (generated)
import { webml } from '@sldm/core';

export default function template(props: any) {
  return webml`<button class="${props.classes}">${props.children}</button>`;
}
```

## Migration Guide

### From createElement to WebML

**Before:**
```typescript
import { createElement } from '@sldm/core';

export function Button(props) {
  return createElement('button', {
    className: cn('button', props.className),
    onClick: props.onClick
  }, props.children);
}
```

**After:**
```typescript
// Button.ts
import { renderTemplate } from '@sldm/core';
import template from './Button.webml.js';

export function Button(props) {
  const classes = cn('button', props.className);
  return renderTemplate(template({
    classes,
    onClick: props.onClick,
    children: props.children
  }));
}

// Button.webml
<button class="{{classes}}" onclick="{{onClick}}">
  {{children}}
</button>
```

### Gradual Migration

WebML components are fully compatible with createElement components:

```typescript
// New WebML component
import { Button } from './Button.js';  // Uses WebML

// Old createElement component
import { Card } from './Card.js';  // Uses createElement

// They work together seamlessly
export function App() {
  return Card({},
    Button({ onClick: () => {} }, 'Click me')
  );
}
```

## API Reference

### `webml`

Tagged template literal for creating WebML templates:

```typescript
import { webml } from '@sldm/core';

const template = webml`<div>${content}</div>`;
```

### `renderTemplate`

Renders a WebML template result:

```typescript
import { renderTemplate } from '@sldm/core';

const element = renderTemplate(template(props));
```

Returns a VNode-compatible structure that works with both WebML and createElement components.

### Template Helpers

#### `when(condition, template)`

Conditional rendering helper:

```typescript
import { when } from '@sldm/core';

webml`
  <div>
    ${when(isVisible, () => webml`<p>Visible!</p>`)}
  </div>
`
```

#### `map(array, template)`

Array mapping helper:

```typescript
import { map } from '@sldm/core';

webml`
  <ul>
    ${map(items, (item, index) => webml`<li>${item.name}</li>`)}
  </ul>
`
```

## FAQ

**Q: Why WebML instead of JSX?**
A: WebML provides true separation of concerns. Logic stays in TypeScript, markup stays in templates. This makes code more maintainable and easier to understand.

**Q: Can I use WebML with existing createElement components?**
A: Yes! WebML components are fully compatible with createElement components. You can migrate gradually.

**Q: Do I need to learn a new syntax?**
A: WebML syntax is minimal and familiar:
- `{{variable}}` - variables
- `{{#if}}...{{/if}}` - conditionals
- `{{#each}}...{{/each}}` - loops

**Q: How do I handle complex logic?**
A: Keep logic in TypeScript! Compute values, format data, handle events in your `.ts` file, then pass results to the template.

**Q: Is it performant?**
A: Yes! Templates are compiled at build time, and the runtime uses native template literals which are highly optimized.

## Examples

See the migrated components for examples:
- `packages/ui/src/components/Button.{ts,webml}`
- `packages/ui/src/components/Card.{ts,webml}`
- `packages/ui/src/components/Container.{ts,webml}`

## Contributing

To add WebML support to new components:

1. Create a `.webml` template file
2. Update the `.ts` component to use `renderTemplate`
3. Run the compiler: `node scripts/compile-webml.js`
4. Build and test

The prebuild step handles compilation automatically during normal builds.
