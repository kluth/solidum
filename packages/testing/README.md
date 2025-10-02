# @sldm/testing

> Testing utilities and test runner for Solidum

## Installation

```bash
npm install @sldm/testing --save-dev
# or
pnpm add @sldm/testing -D
```

## Features

- 🧪 **Test Runner** - Built-in test framework
- ⚡ **Fast** - Lightweight and quick
- 📊 **Reporting** - Clear test output

## Quick Start

```typescript
import { describe, test, expect } from '@sldm/testing';
import { atom } from '@sldm/core';

describe('atom()', () => {
  test('should create reactive atom', () => {
    const count = atom(0);
    expect(count()).toBe(0);
  });

  test('should update value', () => {
    const count = atom(0);
    count(5);
    expect(count()).toBe(5);
  });
});
```

## API

- `describe(name, fn)` - Group tests
- `test(name, fn)` - Define a test
- `expect(value)` - Assertions

## License

MIT © Matthias Kluth
