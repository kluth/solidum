# @sldm/ui-chalk

Chalkboard-style UI component library for Solidum - a hand-drawn aesthetic inspired by classroom chalkboards.

## Features

- 🎨 Hand-drawn chalkboard aesthetic
- ✏️ Chalk-like text effects with dust particles
- 📐 Wobbly borders for authentic feel
- 🎯 Fully typed TypeScript components
- 🎭 Multiple color variants (yellow, blue, green, red)
- 📦 Tree-shakeable and lightweight

## Installation

```bash
pnpm add @sldm/ui-chalk @sldm/core @sldm/utils
```

## Usage

### Import Styles

Import the stylesheet in your app:

```typescript
import '@sldm/ui-chalk/styles.css';
```

### Components

#### ChalkContainer

```typescript
import { ChalkContainer } from '@sldm/ui-chalk';

ChalkContainer({ size: 'lg' }, 'Content goes here');
```

#### ChalkHeading

```typescript
import { ChalkHeading } from '@sldm/ui-chalk';

ChalkHeading(
  {
    level: 1,
    color: 'yellow',
    underline: true,
  },
  'Welcome to Chalkboard UI'
);
```

#### ChalkButton

```typescript
import { ChalkButton } from '@sldm/ui-chalk';

ChalkButton(
  {
    variant: 'primary',
    size: 'md',
    onClick: () => console.log('Clicked!'),
  },
  'Click Me'
);
```

#### ChalkCard

```typescript
import { ChalkCard } from '@sldm/ui-chalk';

ChalkCard(
  {
    variant: 'yellow',
  },
  'Card content with chalkboard styling'
);
```

## Theming

The chalkboard theme uses CSS custom properties for easy customization:

```css
:root {
  --chalk-board: #2a3e2e; /* Dark green chalkboard */
  --chalk-white: #f4f1de; /* Chalk white */
  --chalk-yellow: #f2cc8f; /* Yellow chalk */
  --chalk-blue: #81b29a; /* Blue chalk */
  --chalk-green: #a8dadc; /* Green chalk */
  --chalk-red: #e07a5f; /* Red chalk */
}
```

## Examples

Create a chalkboard-themed page:

```typescript
import {
  ChalkContainer,
  ChalkHeading,
  ChalkCard,
  ChalkButton,
} from '@sldm/ui-chalk';

ChalkContainer(
  { size: 'lg' },
  ChalkHeading({ level: 1, color: 'yellow', underline: true }, 'My Chalkboard App'),
  ChalkCard(
    { variant: 'blue' },
    'Welcome to the chalkboard theme!',
    ChalkButton({ variant: 'success', onClick: () => alert('Hello!') }, 'Say Hello')
  )
);
```

## License

MIT © Matthias Kluth
