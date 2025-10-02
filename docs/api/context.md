# Context API

## createContext()

Creates a new context.

```typescript
function createContext<T>(defaultValue?: T): Context<T>
```

## useContext()

Consumes a context value.

```typescript
function useContext<T>(context: Context<T>): T
```
