/**
 * TDD Tests for mount() and lifecycle hooks
 *
 * Tests written FIRST before implementation!
 */

import { describe, test, expect, runTests } from '@solidum/testing';

import { atom } from '../reactive/atom.js';

import { mount, onMount, onCleanup } from './mount.js';
import { createElement } from './vnode.js';

// Simple mock container
function createContainer() {
  const children: unknown[] = [];
  return {
    children,
    appendChild: (child: unknown) => children.push(child),
    removeChild: (child: unknown) => {
      const index = children.indexOf(child);
      if (index > -1) children.splice(index, 1);
    },
    innerHTML: '',
  };
}

// Mock document
function createMockDoc() {
  return {
    createElement: (tag: string) => ({
      tagName: tag.toUpperCase(),
      children: [] as unknown[],
      attributes: {} as Record<string, unknown>,
      style: {} as Record<string, unknown>,
      appendChild: function (child: unknown) {
        this.children.push(child);
      },
      setAttribute: function (name: string, value: unknown) {
        this.attributes[name] = value;
      },
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

describe('mount()', () => {
  test('should mount a simple element', () => {
    const container = createContainer();
    const vnode = () => createElement('div', null, 'Hello');

    mount(container as unknown as Element, vnode, createMockDoc() as unknown as Document);

    expect(container.children.length).toBe(1);
    expect(container.children[0].tagName).toBe('DIV');
  });

  test('should mount with reactive updates', () => {
    const container = createContainer();
    const count = atom(0);

    mount(
      container as unknown as Element,
      () => createElement('div', null, `Count: ${count()}`),
      createMockDoc() as unknown as Document
    );

    // Initial render
    expect(container.children.length).toBe(1);

    // Update should trigger re-render
    count(1);

    // Should still be mounted
    expect(container.children.length).toBe(1);
  });

  test('should call onMount hook', () => {
    const container = createContainer();
    let mounted = false;

    function TestComponent() {
      onMount(() => {
        mounted = true;
      });

      return createElement('div', null, 'Test');
    }

    mount(
      container as unknown as Element,
      () => createElement(TestComponent, null),
      createMockDoc() as unknown as Document
    );

    expect(mounted).toBe(true);
  });

  test('should call onCleanup hook on unmount', () => {
    const container = createContainer();
    let cleaned = false;

    function TestComponent() {
      onCleanup(() => {
        cleaned = true;
      });

      return createElement('div', null, 'Test');
    }

    const dispose = mount(
      container as unknown as Element,
      () => createElement(TestComponent, null),
      createMockDoc() as unknown as Document
    );

    expect(cleaned).toBe(false);

    dispose();

    expect(cleaned).toBe(true);
  });

  test('should support multiple onMount hooks', () => {
    const container = createContainer();
    const calls: number[] = [];

    function TestComponent() {
      onMount(() => calls.push(1));
      onMount(() => calls.push(2));
      onMount(() => calls.push(3));

      return createElement('div', null);
    }

    mount(
      container as unknown as Element,
      () => createElement(TestComponent, null),
      createMockDoc() as unknown as Document
    );

    expect(calls).toEqual([1, 2, 3]);
  });

  test('should support multiple onCleanup hooks', () => {
    const container = createContainer();
    const calls: number[] = [];

    function TestComponent() {
      onCleanup(() => calls.push(1));
      onCleanup(() => calls.push(2));
      onCleanup(() => calls.push(3));

      return createElement('div', null);
    }

    const dispose = mount(
      container as unknown as Element,
      () => createElement(TestComponent, null),
      createMockDoc() as unknown as Document
    );

    dispose();

    expect(calls).toEqual([1, 2, 3]);
  });

  test('should handle nested components with lifecycle', () => {
    const container = createContainer();
    const mountCalls: string[] = [];
    const cleanupCalls: string[] = [];

    function Child() {
      onMount(() => mountCalls.push('child'));
      onCleanup(() => cleanupCalls.push('child'));
      return createElement('div', null, 'Child');
    }

    function Parent() {
      onMount(() => mountCalls.push('parent'));
      onCleanup(() => cleanupCalls.push('parent'));
      return createElement('div', null, createElement(Child, null));
    }

    const dispose = mount(
      container as unknown as Element,
      () => createElement(Parent, null),
      createMockDoc() as unknown as Document
    );

    expect(mountCalls).toEqual(['parent', 'child']);

    dispose();

    expect(cleanupCalls).toEqual(['parent', 'child']);
  });
});

// Run tests
runTests().catch(console.error);
