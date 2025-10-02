# Testing

Solidum includes lightweight testing utilities for testing reactive code and DOM components.

## Installation

```bash
npm install -D @solidum/testing
```

## Basic Testing

```typescript
import { describe, test, expect, runTests } from '@solidum/testing';
import { atom, computed } from '@solidum/core';

describe('Counter', () => {
  test('should increment', () => {
    const count = atom(0);
    count(count() + 1);
    expect(count()).toBe(1);
  });

  test('should compute doubled value', () => {
    const count = atom(5);
    const doubled = computed(() => count() * 2);
    expect(doubled()).toBe(10);
  });
});

runTests();
```

## DOM Testing

Test components with jsdom-based utilities:

```typescript
import { createDOMEnvironment, DOMEvents } from '@solidum/testing';

describe('Button Component', () => {
  test('should handle clicks', () => {
    const env = createDOMEnvironment();

    try {
      let clicked = false;
      const button = env.document.createElement('button');
      button.onclick = () => {
        clicked = true;
      };

      DOMEvents.click(button);

      expect(clicked).toBe(true);
    } finally {
      env.cleanup();
    }
  });
});
```

## User Interactions

Simulate realistic user interactions:

```typescript
import { UserInteraction, DOMWait } from '@solidum/testing';

test('should type into input', async () => {
  const input = document.createElement('input');

  await UserInteraction.type(input, 'Hello');

  expect(input.value).toBe('Hello');
});
```

## Async Testing

Test async effects and operations:

```typescript
import { DOMWait } from '@solidum/testing';

test('should update after delay', async () => {
  const data = atom(null);

  setTimeout(() => data('loaded'), 10);

  await DOMWait.wait(20);

  expect(data()).toBe('loaded');
});
```

## Learn More

- [Testing API Reference](/api/testing)
- [Examples](/examples/testing)
