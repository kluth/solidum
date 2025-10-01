/**
 * TDD Tests for render() function
 *
 * Tests written FIRST before implementation!
 *
 * Note: These tests require a DOM environment (JSDOM or browser)
 */

import { describe, test, expect, runTests } from '@solidum/testing';
import { createElement } from './vnode.js';
import { render } from './render.js';

// Mock DOM for testing (simplified)
function createMockDocument() {
  const elements: any[] = [];

  return {
    createElement: (tag: string) => {
      const el = {
        tagName: tag.toUpperCase(),
        attributes: {} as Record<string, string>,
        children: [] as any[],
        textContent: '',
        style: {} as Record<string, string>,
        eventListeners: {} as Record<string, Function>,
        setAttribute: function (name: string, value: string) {
          this.attributes[name] = value;
        },
        appendChild: function (child: any) {
          this.children.push(child);
        },
        addEventListener: function (event: string, handler: Function) {
          this.eventListeners[event] = handler;
        },
      };
      elements.push(el);
      return el;
    },
    createTextNode: (text: string) => {
      const node = {
        nodeType: 3,
        textContent: text,
      };
      elements.push(node);
      return node;
    },
  };
}

describe('render()', () => {
  test('should render simple element', () => {
    const doc = createMockDocument();
    const vnode = createElement('div', null);
    const dom = render(vnode, doc as any);

    expect(dom.tagName).toBe('DIV');
  });

  test('should render element with attributes', () => {
    const doc = createMockDocument();
    const vnode = createElement('div', { class: 'container', id: 'app' });
    const dom = render(vnode, doc as any) as any;

    expect(dom.attributes.class).toBe('container');
    expect(dom.attributes.id).toBe('app');
  });

  test('should render text node', () => {
    const doc = createMockDocument();
    const vnode = createElement('span', null, 'Hello World');
    const dom = render(vnode, doc as any) as any;

    expect(dom.tagName).toBe('SPAN');
    expect(dom.children.length).toBe(1);
    expect(dom.children[0].textContent).toBe('Hello World');
  });

  test('should render nested elements', () => {
    const doc = createMockDocument();
    const vnode = createElement(
      'div',
      null,
      createElement('span', null, 'Child 1'),
      createElement('span', null, 'Child 2')
    );
    const dom = render(vnode, doc as any) as any;

    expect(dom.tagName).toBe('DIV');
    expect(dom.children.length).toBe(2);
    expect(dom.children[0].tagName).toBe('SPAN');
    expect(dom.children[1].tagName).toBe('SPAN');
  });

  test('should handle style object', () => {
    const doc = createMockDocument();
    const vnode = createElement('div', {
      style: { color: 'red', fontSize: '16px' },
    });
    const dom = render(vnode, doc as any) as any;

    expect(dom.style.color).toBe('red');
    expect(dom.style.fontSize).toBe('16px');
  });

  test('should bind event handlers', () => {
    const doc = createMockDocument();
    let clicked = false;
    const onClick = () => {
      clicked = true;
    };

    const vnode = createElement('button', { onClick });
    const dom = render(vnode, doc as any) as any;

    expect(dom.eventListeners.click).toBe(onClick);
  });

  test('should handle className prop', () => {
    const doc = createMockDocument();
    const vnode = createElement('div', { className: 'test-class' });
    const dom = render(vnode, doc as any) as any;

    expect(dom.attributes.class).toBe('test-class');
  });

  test('should handle boolean attributes', () => {
    const doc = createMockDocument();
    const vnode = createElement('input', { disabled: true, checked: false });
    const dom = render(vnode, doc as any) as any;

    expect(dom.attributes.disabled).toBe('true');
  });

  test('should skip null/undefined props', () => {
    const doc = createMockDocument();
    const vnode = createElement('div', {
      id: 'test',
      title: null,
      'data-value': undefined,
    });
    const dom = render(vnode, doc as any) as any;

    expect(dom.attributes.id).toBe('test');
    expect(dom.attributes.title).toBe(undefined);
    expect(dom.attributes['data-value']).toBe(undefined);
  });

  test('should handle mixed children', () => {
    const doc = createMockDocument();
    const vnode = createElement(
      'div',
      null,
      'Text before',
      createElement('span', null, 'In span'),
      'Text after'
    );
    const dom = render(vnode, doc as any) as any;

    expect(dom.children.length).toBe(3);
    expect(dom.children[0].textContent).toBe('Text before');
    expect(dom.children[1].tagName).toBe('SPAN');
    expect(dom.children[2].textContent).toBe('Text after');
  });
});

// Run tests
runTests().catch(console.error);
