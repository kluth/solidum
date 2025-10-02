# Store API

## createStore()

Creates a centralized store.

```typescript
function createStore<State, Actions, Getters, Effects>(
  config: StoreConfig<State, Actions, Getters, Effects>
): Store<State, Actions, Getters, Effects>
```
