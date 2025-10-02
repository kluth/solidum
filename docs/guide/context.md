# Context API

The Context API provides dependency injection, allowing you to pass data through the component tree without prop drilling.

## Creating a Context

```typescript
import { createContext } from '@sldm/core';

const ThemeContext = createContext();
```

## Providing Values

Use the Provider component to provide values:

```typescript
function App() {
  const theme = atom({ mode: 'dark', primary: '#667eea' });

  return createElement(ThemeContext.Provider, { value: theme }, createElement(Dashboard));
}
```

## Consuming Values

Use `useContext` to access context values:

```typescript
function Button() {
  const theme = useContext(ThemeContext);

  return createElement(
    'button',
    {
      style: { color: theme().primary },
    },
    'Click me'
  );
}
```

## Default Values

Provide default values for contexts:

```typescript
const ThemeContext = createContext({
  mode: 'light',
  primary: '#667eea',
});
```

## Multiple Contexts

You can use multiple contexts:

```typescript
function App() {
  return createElement(
    ThemeContext.Provider,
    { value: themeValue },
    createElement(UserContext.Provider, { value: userValue }, createElement(Dashboard))
  );
}
```

## Learn More

- [API Reference](/api/context)
- [Examples](/examples/counter)
