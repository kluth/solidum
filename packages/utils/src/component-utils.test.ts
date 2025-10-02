/**
 * TDD Tests for Component Utilities
 *
 * Tests written FIRST before implementation!
 */

import { describe, test, expect, runTests } from '@solidum/testing';

import { mergeProps, cn } from './component-utils.js';

describe('mergeProps()', () => {
  test('should merge simple props', () => {
    const merged = mergeProps({ id: 'foo', name: 'bar' }, { name: 'baz', value: 42 });

    expect(merged).toEqual({ id: 'foo', name: 'baz', value: 42 });
  });

  test('should merge className props', () => {
    const merged = mergeProps({ className: 'foo bar' }, { className: 'baz' });

    expect(merged.className).toBe('foo bar baz');
  });

  test('should merge class props', () => {
    const merged = mergeProps({ class: 'foo bar' }, { class: 'baz' });

    expect(merged.class).toBe('foo bar baz');
  });

  test('should merge style objects', () => {
    const merged = mergeProps(
      { style: { color: 'red', fontSize: '12px' } },
      { style: { fontSize: '14px', fontWeight: 'bold' } }
    );

    expect(merged.style).toEqual({
      color: 'red',
      fontSize: '14px',
      fontWeight: 'bold',
    });
  });

  test('should merge event handlers', () => {
    const calls: string[] = [];

    const handler1 = () => calls.push('handler1');
    const handler2 = () => calls.push('handler2');

    const merged = mergeProps({ onClick: handler1 }, { onClick: handler2 });

    merged.onClick();

    expect(calls).toEqual(['handler1', 'handler2']);
  });

  test('should handle undefined and null values', () => {
    const merged = mergeProps({ id: 'foo', name: null }, { name: undefined, value: 42 });

    expect(merged).toEqual({ id: 'foo', value: 42 });
  });

  test('should merge multiple sources', () => {
    const merged = mergeProps({ id: 'foo' }, { className: 'bar' }, { className: 'baz', value: 42 });

    expect(merged).toEqual({
      id: 'foo',
      className: 'bar baz',
      value: 42,
    });
  });

  test('should handle empty objects', () => {
    const merged = mergeProps({}, { id: 'foo' }, {});

    expect(merged).toEqual({ id: 'foo' });
  });
});

describe('cn()', () => {
  test('should concatenate string classes', () => {
    const result = cn('foo', 'bar', 'baz');

    expect(result).toBe('foo bar baz');
  });

  test('should handle conditional classes with object', () => {
    const result = cn('foo', {
      bar: true,
      baz: false,
      qux: true,
    });

    expect(result).toBe('foo bar qux');
  });

  test('should filter out falsy values', () => {
    const result = cn('foo', null, undefined, false, '', 'bar');

    expect(result).toBe('foo bar');
  });

  test('should handle mixed string and object arguments', () => {
    const result = cn('base', { active: true, disabled: false }, 'extra', { hover: true });

    expect(result).toBe('base active extra hover');
  });

  test('should handle empty input', () => {
    const result = cn();

    expect(result).toBe('');
  });

  test('should handle only falsy values', () => {
    const result = cn(null, undefined, false, '');

    expect(result).toBe('');
  });

  test('should handle arrays of classes', () => {
    const result = cn(['foo', 'bar'], 'baz');

    expect(result).toBe('foo bar baz');
  });

  test('should handle nested arrays', () => {
    const result = cn(['foo', ['bar', 'baz']], 'qux');

    expect(result).toBe('foo bar baz qux');
  });

  test('should handle complex real-world scenario', () => {
    const variant = 'primary';
    const size = 'lg';
    const isActive = true;
    const isDisabled = false;

    const result = cn('btn', `btn-${variant}`, `btn-${size}`, {
      'btn-active': isActive,
      'btn-disabled': isDisabled,
    });

    expect(result).toBe('btn btn-primary btn-lg btn-active');
  });
});

// Run tests
runTests().catch(error => {
  // eslint-disable-next-line no-console
  console.error(error);
});
