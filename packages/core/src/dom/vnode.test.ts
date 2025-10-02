/**
 * TDD Tests for createElement() and VNode
 *
 * Tests written FIRST before implementation!
 */

import { describe, test, expect, runTests } from '@sldm/testing';

import { createElement, Fragment } from './vnode.js';

describe('createElement()', () => {
  test('should create element vnode', () => {
    const vnode = createElement('div', null);

    expect(vnode.type).toBe('div');
    expect(vnode.props).toEqual({});
    expect(vnode.children).toEqual([]);
  });

  test('should create element with props', () => {
    const vnode = createElement('div', { class: 'container', id: 'app' });

    expect(vnode.type).toBe('div');
    expect(vnode.props.class).toBe('container');
    expect(vnode.props.id).toBe('app');
  });

  test('should handle null/undefined props', () => {
    const vnode1 = createElement('div', null);
    const vnode2 = createElement('div', undefined);

    expect(vnode1.props).toEqual({});
    expect(vnode2.props).toEqual({});
  });

  test('should create element with children', () => {
    const vnode = createElement(
      'div',
      null,
      createElement('span', null, 'Hello'),
      createElement('span', null, 'World')
    );

    expect(vnode.children.length).toBe(2);
    expect(vnode.children[0].type).toBe('span');
    expect(vnode.children[1].type).toBe('span');
  });

  test('should flatten nested arrays in children', () => {
    const vnode = createElement(
      'div',
      null,
      [createElement('span', null, '1'), createElement('span', null, '2')],
      createElement('span', null, '3')
    );

    expect(vnode.children.length).toBe(3);
  });

  test('should filter out null and undefined children', () => {
    const vnode = createElement(
      'div',
      null,
      createElement('span', null),
      null,
      undefined,
      createElement('span', null)
    );

    expect(vnode.children.length).toBe(2);
  });

  test('should convert non-object children to text nodes', () => {
    const vnode = createElement('div', null, 'Hello', 42, true);

    expect(vnode.children.length).toBe(3);
    expect(vnode.children[0]).toEqual({
      type: 'TEXT_NODE',
      props: {},
      children: [],
      text: 'Hello',
    });
    expect(vnode.children[1]).toEqual({
      type: 'TEXT_NODE',
      props: {},
      children: [],
      text: '42',
    });
    expect(vnode.children[2]).toEqual({
      type: 'TEXT_NODE',
      props: {},
      children: [],
      text: 'true',
    });
  });

  test('should handle Fragment', () => {
    const vnode = createElement(
      Fragment,
      null,
      createElement('div', null),
      createElement('span', null)
    );

    expect(vnode.type).toBe(Fragment);
    expect(vnode.children.length).toBe(2);
  });

  test('should handle component functions', () => {
    const MyComponent = (props: { text: string }) => createElement('div', null, props.text);
    const vnode = createElement(MyComponent, { text: 'Hello' });

    expect(vnode.type).toBe(MyComponent);
    expect(vnode.props.text).toBe('Hello');
  });

  test('should preserve function props (event handlers)', () => {
    const onClick = () => {
      // eslint-disable-next-line no-console
      console.log('clicked');
    };
    const vnode = createElement('button', { onClick });

    expect(vnode.props.onClick).toBe(onClick);
  });

  test('should handle style object', () => {
    const vnode = createElement('div', {
      style: { color: 'red', fontSize: '16px' },
    });

    expect(vnode.props.style).toEqual({ color: 'red', fontSize: '16px' });
  });

  test('should handle nested children structure', () => {
    const vnode = createElement(
      'ul',
      null,
      createElement('li', null, 'Item 1'),
      createElement('li', null, 'Item 2'),
      createElement('li', null, 'Item 3')
    );

    expect(vnode.children.length).toBe(3);
    expect(vnode.children[0].children[0]).toEqual({
      type: 'TEXT_NODE',
      props: {},
      children: [],
      text: 'Item 1',
    });
  });
});

// Run tests
runTests().catch(error => {
  // eslint-disable-next-line no-console
  console.error(error);
});
