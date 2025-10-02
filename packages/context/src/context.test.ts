/**
 * TDD Tests for Context API
 *
 * Tests written FIRST before implementation!
 */

import { describe, test, expect, runTests } from '@solidum/testing';
import { atom } from '@solidum/core';
import { createContext, useContext } from './context.js';
import { createElement } from '@solidum/core';
import { mount, onMount } from '@solidum/core';

// Mock container
function createContainer() {
  const children: unknown[] = [];
  return {
    children,
    appendChild: (child: unknown) => children.push(child),
    removeChild: (child: unknown) => {
      const index = children.indexOf(child);
      if (index > -1) children.splice(index, 1);
    },
  };
}

// Mock document
function createMockDoc() {
  return {
    createElement: (tag: string) => ({
      tagName: tag.toUpperCase(),
      children: [] as unknown[],
      attributes: {} as Record<string, any>,
      style: {} as Record<string, any>,
      appendChild: function (child: unknown) {
        this.children.push(child);
      },
      setAttribute: function () {},
      addEventListener: function () {},
    }),
    createTextNode: (text: string) => ({ textContent: text }),
    createDocumentFragment: () => ({
      children: [] as unknown[],
      appendChild: function (child: unknown) {
        this.children.push(child);
      },
    }),
  };
}

describe('createContext()', () => {
  test('should create context with default value', () => {
    const ctx = createContext<string>('default');

    expect(ctx).not.toBeNull();
    expect(typeof ctx.Provider).toBe('function');
  });

  test('should provide and consume context value', () => {
    const ThemeContext = createContext<string>();
    let consumedValue: string | undefined;

    function Consumer() {
      consumedValue = useContext(ThemeContext);
      return createElement('div', null);
    }

    function Provider() {
      return createElement(ThemeContext.Provider, { value: 'dark' }, createElement(Consumer, null));
    }

    const container = createContainer();
    mount(
      container as unknown as Element,
      () => createElement(Provider, null),
      createMockDoc() as unknown as Document
    );

    expect(consumedValue).toBe('dark');
  });

  test('should use default value when no provider', () => {
    const ThemeContext = createContext<string>('light');
    let consumedValue: string | undefined;

    function Consumer() {
      consumedValue = useContext(ThemeContext);
      return createElement('div', null);
    }

    const container = createContainer();
    mount(
      container as unknown as Element,
      () => createElement(Consumer, null),
      createMockDoc() as unknown as Document
    );

    expect(consumedValue).toBe('light');
  });

  test('should support reactive context values', () => {
    const CountContext = createContext<() => number>();
    let consumedCount: (() => number) | undefined;

    function Consumer() {
      consumedCount = useContext(CountContext);
      return createElement('div', null);
    }

    function Provider() {
      const count = atom(5);

      return createElement(CountContext.Provider, { value: count }, createElement(Consumer, null));
    }

    const container = createContainer();
    mount(
      container as unknown as Element,
      () => createElement(Provider, null),
      createMockDoc() as unknown as Document
    );

    expect(consumedCount?.()).toBe(5);
  });

  test('should support nested providers', () => {
    const ThemeContext = createContext<string>();
    const values: string[] = [];

    function Consumer({ label }: { label: string }) {
      const theme = useContext(ThemeContext);
      values.push(`${label}:${theme}`);
      return createElement('div', null);
    }

    function App() {
      return createElement(
        ThemeContext.Provider,
        { value: 'dark' },
        createElement(Consumer, { label: 'outer' }),
        createElement(
          ThemeContext.Provider,
          { value: 'light' },
          createElement(Consumer, { label: 'inner' })
        ),
        createElement(Consumer, { label: 'outer2' })
      );
    }

    const container = createContainer();
    mount(
      container as unknown as Element,
      () => createElement(App, null),
      createMockDoc() as unknown as Document
    );

    expect(values).toEqual(['outer:dark', 'inner:light', 'outer2:dark']);
  });

  test('should update consumers when context value changes', () => {
    const CountContext = createContext<() => number>();
    const values: number[] = [];

    function Consumer() {
      const count = useContext(CountContext);
      values.push(count());
      return createElement('div', null, String(count()));
    }

    let updateCount: ((value?: number) => number) | undefined;

    function Provider() {
      const count = atom(0);
      updateCount = count;

      return createElement(CountContext.Provider, { value: count }, createElement(Consumer, null));
    }

    const container = createContainer();
    mount(
      container as unknown as Element,
      () => createElement(Provider, null),
      createMockDoc() as unknown as Document
    );

    expect(values[0]).toBe(0);

    // Update context value
    updateCount?.(1);

    // Consumer should re-render with new value
    expect(container.children.length).toBe(1);
  });

  test('should throw error when useContext called outside component', () => {
    const ThemeContext = createContext<string>();

    let error: Error | null = null;
    try {
      useContext(ThemeContext);
    } catch (e) {
      error = e as Error;
    }

    expect(error).not.toBeNull();
    expect(error?.message).toBe('useContext() can only be called during component render');
  });

  test('should support multiple contexts', () => {
    const ThemeContext = createContext<string>();
    const UserContext = createContext<string>();
    let theme: string | undefined;
    let user: string | undefined;

    function Consumer() {
      theme = useContext(ThemeContext);
      user = useContext(UserContext);
      return createElement('div', null);
    }

    function App() {
      return createElement(
        ThemeContext.Provider,
        { value: 'dark' },
        createElement(UserContext.Provider, { value: 'Alice' }, createElement(Consumer, null))
      );
    }

    const container = createContainer();
    mount(
      container as unknown as Element,
      () => createElement(App, null),
      createMockDoc() as unknown as Document
    );

    expect(theme).toBe('dark');
    expect(user).toBe('Alice');
  });
});

// Run tests
runTests().catch(console.error);
