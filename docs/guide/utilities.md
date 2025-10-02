# Component Utilities

Solidum provides helpful utilities for building component libraries.

## mergeProps()

Intelligently merge props objects:

```typescript
import { mergeProps } from '@sldm/core';

const merged = mergeProps(
  { className: 'base', onClick: handler1 },
  { className: 'extra', onClick: handler2 }
);

// Result:
// {
//   className: 'base extra',
//   onClick: [both handlers chained]
// }
```

### Class Merging

Classes are concatenated:

```typescript
const props = mergeProps({ className: 'btn' }, { className: 'btn-primary' });
// { className: 'btn btn-primary' }
```

### Style Merging

Style objects are merged:

```typescript
const props = mergeProps(
  { style: { color: 'red', fontSize: '16px' } },
  { style: { fontSize: '18px', fontWeight: 'bold' } }
);
// { style: { color: 'red', fontSize: '18px', fontWeight: 'bold' } }
```

### Event Handler Chaining

Event handlers are chained:

```typescript
const handler1 = () => console.log('First');
const handler2 = () => console.log('Second');

const props = mergeProps({ onClick: handler1 }, { onClick: handler2 });

props.onClick(); // Logs: "First", "Second"
```

## cn()

Conditional class name builder:

```typescript
import { cn } from '@sldm/core';

// Strings
cn('foo', 'bar'); // 'foo bar'

// Objects
cn('btn', {
  'btn-primary': isPrimary,
  'btn-disabled': isDisabled,
});

// Arrays
cn(['foo', 'bar'], 'baz'); // 'foo bar baz'

// Mixed
cn('btn', isActive && 'active', { disabled: isDisabled }, ['extra', 'classes']);
```

### Real-World Example

```typescript
function Button({ variant = 'primary', size = 'md', disabled, className, ...props }) {
  return createElement(
    'button',
    mergeProps(
      {
        className: cn(
          'btn',
          `btn-${variant}`,
          `btn-${size}`,
          { 'btn-disabled': disabled },
          className
        ),
        disabled,
      },
      props
    )
  );
}
```

## Learn More

- [API Reference](/api/utilities)
- [Examples](/examples/button-library)
