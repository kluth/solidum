# @sldm/ui

> Production-ready UI component library for Solidum

## Installation

```bash
npm install @sldm/ui @sldm/core
# or
pnpm add @sldm/ui @sldm/core
```

## Features

- 🎨 **20+ Components** - Rich set of interactive components
- ✨ **Wild Features** - 3D charts, drag-and-drop tables, glassmorphism
- 🎯 **Fully Reactive** - Built on Solidum's fine-grained reactivity
- 🎭 **Zero Dependencies** - Only depends on @sldm/core
- 📱 **Responsive** - Mobile-friendly components
- 🌈 **Themeable** - Customizable styles

## Components

### Layout

- Container, Stack, Card, GlassCard

### Forms

- Button, Input, Select, Switch, Slider

### Display

- Badge, Avatar, Progress, Spinner, Tabs, Accordion

### Wild Features

- **Chart3D** - Interactive 3D charts with drag-to-rotate
- **DataTable** - Sortable, draggable rows
- **ParticleBackground** - Mouse-interactive particles
- **CodeBlock** - Syntax-highlighted code

## Quick Start

```typescript
import { createElement } from '@sldm/core';
import { Button, Card, Container } from '@sldm/ui';
import '@sldm/ui/styles.css';

function App() {
  return createElement(
    Container,
    { maxWidth: 'lg' },
    createElement(
      Card,
      { padding: 'lg', hoverable: true },
      createElement('h1', {}, 'Hello Solidum!'),
      createElement(
        Button,
        {
          variant: 'primary',
          onClick: () => alert('Clicked!'),
        },
        'Click me'
      )
    )
  );
}
```

## Import Styles

```typescript
// Import CSS in your main entry file
import '@sldm/ui/styles.css';
```

## Documentation

Visit [https://kluth.github.io/solidum/components](https://kluth.github.io/solidum/components) for component docs.

## License

MIT © Matthias Kluth
