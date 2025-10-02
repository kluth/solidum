/**
 * DOM and Component Integration Tests
 *
 * Tests the DOM rendering and component system using lightweight DOM testing utilities
 */

import { describe, test, expect, runTests, createDOMEnvironment, DOMEvents, DOMAssertions, UserInteraction, DOMWait } from '@solidum/testing';
import { atom } from '../reactive/atom.js';
import { computed } from '../reactive/computed.js';
import { effect } from '../reactive/effect.js';
import { createElement } from './vnode.js';
import { render } from './render.js';
import { mount, onMount, onCleanup } from './mount.js';

describe('DOM Rendering', () => {
  test('should render simple element', () => {
    const env = createDOMEnvironment();

    try {
      const vnode = createElement('div', { className: 'test' }, 'Hello World');
      const element = render(vnode, env.document) as HTMLElement;

      expect(element.tagName).toBe('DIV');
      expect(element.className).toBe('test');
      expect(element.textContent).toBe('Hello World');
    } finally {
      env.cleanup();
    }
  });

  test('should render nested elements', () => {
    const env = createDOMEnvironment();

    try {
      const vnode = createElement(
        'div',
        { id: 'parent' },
        createElement('span', { className: 'child' }, 'Child 1'),
        createElement('span', { className: 'child' }, 'Child 2')
      );

      const element = render(vnode, env.document) as HTMLElement;

      expect(element.tagName).toBe('DIV');
      expect(element.id).toBe('parent');
      expect(element.children.length).toBe(2);
      expect((element.children[0] as HTMLElement).textContent).toBe('Child 1');
      expect((element.children[1] as HTMLElement).textContent).toBe('Child 2');
    } finally {
      env.cleanup();
    }
  });

  test('should handle event listeners', () => {
    const env = createDOMEnvironment();

    try {
      let clicked = false;
      const handleClick = () => {
        clicked = true;
      };

      const vnode = createElement('button', { onClick: handleClick }, 'Click Me');
      const element = render(vnode, env.document) as HTMLElement;

      DOMEvents.click(element);

      expect(clicked).toBe(true);
    } finally {
      env.cleanup();
    }
  });

  test('should set style attributes', () => {
    const env = createDOMEnvironment();

    try {
      const vnode = createElement(
        'div',
        { style: { color: 'red', fontSize: '16px' } },
        'Styled'
      );
      const element = render(vnode, env.document) as HTMLElement;

      expect(element.style.color).toBe('red');
      expect(element.style.fontSize).toBe('16px');
    } finally {
      env.cleanup();
    }
  });

  test('should handle boolean attributes', () => {
    const env = createDOMEnvironment();

    try {
      const vnode = createElement('button', { disabled: true }, 'Disabled Button');
      const element = render(vnode, env.document) as HTMLElement;

      expect(DOMAssertions.isDisabled(element)).toBe(true);
    } finally {
      env.cleanup();
    }
  });
});

describe('Component System', () => {
  test('should render component function', () => {
    const env = createDOMEnvironment();

    try {
      function Greeting({ name }: { name: string }) {
        return createElement('h1', null, `Hello, ${name}!`);
      }

      const vnode = createElement(Greeting, { name: 'World' });
      const element = render(vnode, env.document) as HTMLElement;

      expect(element.tagName).toBe('H1');
      expect(element.textContent).toBe('Hello, World!');
    } finally {
      env.cleanup();
    }
  });

  test('should pass props to components', () => {
    const env = createDOMEnvironment();

    try {
      function Card({ title, content }: { title: string; content: string }) {
        return createElement(
          'div',
          { className: 'card' },
          createElement('h2', null, title),
          createElement('p', null, content)
        );
      }

      const vnode = createElement(Card, { title: 'Test Title', content: 'Test Content' });
      const element = render(vnode, env.document) as HTMLElement;

      expect(element.tagName).toBe('DIV');
      expect(DOMAssertions.hasClass(element, 'card')).toBe(true);
      expect(element.querySelector('h2')?.textContent).toBe('Test Title');
      expect(element.querySelector('p')?.textContent).toBe('Test Content');
    } finally {
      env.cleanup();
    }
  });

  test('should pass children to components', () => {
    const env = createDOMEnvironment();

    try {
      function Container({ children }: { children?: any }) {
        return createElement('div', { className: 'container' }, children);
      }

      const vnode = createElement(
        Container,
        null,
        createElement('span', null, 'Child 1'),
        createElement('span', null, 'Child 2')
      );

      const element = render(vnode, env.document) as HTMLElement;

      expect(element.tagName).toBe('DIV');
      expect(element.children.length).toBe(2);
    } finally {
      env.cleanup();
    }
  });
});

describe('Reactive DOM Updates', () => {
  test('should update DOM when atom changes', async () => {
    const env = createDOMEnvironment();

    try {
      const count = atom(0);
      const container = env.document.createElement('div');
      env.document.body.appendChild(container);

      let renderCount = 0;
      let dispose: (() => void) | undefined;

      function Counter() {
        renderCount++;
        return createElement('div', null, `Count: ${count()}`);
      }

      dispose = mount(container, () => createElement(Counter, null), env.document);

      expect(container.textContent).toBe('Count: 0');
      expect(renderCount).toBe(1);

      // Update atom
      count(5);

      // Wait for DOM update
      await DOMWait.wait(50);

      expect(container.textContent).toBe('Count: 5');

      if (dispose) dispose();
    } finally {
      env.cleanup();
    }
  });

  test('should handle user interactions', async () => {
    const env = createDOMEnvironment();

    try {
      const count = atom(0);
      const container = env.document.createElement('div');
      env.document.body.appendChild(container);

      function Counter() {
        return createElement(
          'div',
          null,
          createElement('div', { 'data-testid': 'count' }, `Count: ${count()}`),
          createElement(
            'button',
            {
              'data-testid': 'increment',
              onClick: () => count(count() + 1),
            },
            'Increment'
          )
        );
      }

      mount(container, () => createElement(Counter, null), env.document);

      const button = container.querySelector('[data-testid="increment"]') as HTMLElement;
      expect(button).not.toBeNull();

      // Click button
      await UserInteraction.click(button);
      await DOMWait.wait(50);

      const countDisplay = container.querySelector('[data-testid="count"]');
      expect(countDisplay?.textContent).toBe('Count: 1');
    } finally {
      env.cleanup();
    }
  });

  test('should handle input changes', async () => {
    const env = createDOMEnvironment();

    try {
      const text = atom('');
      const container = env.document.createElement('div');
      env.document.body.appendChild(container);

      function TextInput() {
        return createElement(
          'div',
          null,
          createElement('input', {
            type: 'text',
            'data-testid': 'input',
            value: text(),
            onInput: (e: any) => text(e.target.value),
          }),
          createElement('div', { 'data-testid': 'display' }, text())
        );
      }

      mount(container, () => createElement(TextInput, null), env.document);

      const input = container.querySelector('[data-testid="input"]') as HTMLInputElement;
      expect(input).not.toBeNull();

      // Type into input
      await UserInteraction.type(input, 'Hello');
      await DOMWait.wait(50);

      const display = container.querySelector('[data-testid="display"]');
      expect(display?.textContent).toBe('Hello');
    } finally {
      env.cleanup();
    }
  });
});

describe('Component Lifecycle', () => {
  test('should call onMount when component mounts', async () => {
    const env = createDOMEnvironment();

    try {
      let mounted = false;
      const container = env.document.createElement('div');
      env.document.body.appendChild(container);

      function Component() {
        onMount(() => {
          mounted = true;
        });

        return createElement('div', null, 'Mounted');
      }

      mount(container, () => createElement(Component, null), env.document);

      await DOMWait.wait(10);

      expect(mounted).toBe(true);
    } finally {
      env.cleanup();
    }
  });

  test('should call onCleanup when component unmounts', async () => {
    const env = createDOMEnvironment();

    try {
      let cleaned = false;
      const container = env.document.createElement('div');
      env.document.body.appendChild(container);

      function Component() {
        onMount(() => {
          onCleanup(() => {
            cleaned = true;
          });
        });

        return createElement('div', null, 'Component');
      }

      const dispose = mount(container, () => createElement(Component, null), env.document);

      await DOMWait.wait(10);
      expect(cleaned).toBe(false);

      // Unmount
      dispose();

      await DOMWait.wait(10);
      expect(cleaned).toBe(true);
    } finally {
      env.cleanup();
    }
  });

  test('should cleanup effects on unmount', async () => {
    const env = createDOMEnvironment();

    try {
      const count = atom(0);
      let effectRuns = 0;
      let cleaned = false;

      const container = env.document.createElement('div');
      env.document.body.appendChild(container);

      function Component() {
        onMount(() => {
          const dispose = effect(() => {
            count(); // Track count
            effectRuns++;
          });

          onCleanup(() => {
            dispose();
            cleaned = true;
          });
        });

        return createElement('div', null, 'Component');
      }

      const dispose = mount(container, () => createElement(Component, null), env.document);

      await DOMWait.wait(10);
      expect(effectRuns).toBeGreaterThan(0);

      const initialRuns = effectRuns;

      // Unmount
      dispose();
      await DOMWait.wait(10);

      // Update count after unmount
      count(5);
      await DOMWait.wait(10);

      // Effect should not run after unmount
      expect(effectRuns).toBe(initialRuns);
      expect(cleaned).toBe(true);
    } finally {
      env.cleanup();
    }
  });
});

describe('Computed in DOM', () => {
  test('should use computed values in components', async () => {
    const env = createDOMEnvironment();

    try {
      const firstName = atom('John');
      const lastName = atom('Doe');
      const container = env.document.createElement('div');
      env.document.body.appendChild(container);

      function FullName() {
        const fullName = computed(() => `${firstName()} ${lastName()}`);
        return createElement('div', { 'data-testid': 'name' }, fullName());
      }

      mount(container, () => createElement(FullName, null), env.document);

      const nameDisplay = container.querySelector('[data-testid="name"]');
      expect(nameDisplay?.textContent).toBe('John Doe');

      // Update first name
      firstName('Jane');
      await DOMWait.wait(50);

      expect(nameDisplay?.textContent).toBe('Jane Doe');

      // Update last name
      lastName('Smith');
      await DOMWait.wait(50);

      expect(nameDisplay?.textContent).toBe('Jane Smith');
    } finally {
      env.cleanup();
    }
  });
});

// Run tests
runTests().catch(console.error);
