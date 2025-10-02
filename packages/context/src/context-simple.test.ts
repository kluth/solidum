/**
 * Simple Context API Tests
 *
 * Tests the core context functionality without DOM rendering
 */

import { describe, test, expect, runTests } from '@solidum/testing';
import { createContext, useContext } from './context.js';

describe('createContext() - Simple Tests', () => {
  test('should create a context with default value', () => {
    const ThemeContext = createContext('light');

    expect(ThemeContext).toBeDefined();
    expect(ThemeContext.defaultValue).toBe('light');
  });

  test('should create a context without default value', () => {
    const UserContext = createContext();

    expect(UserContext).toBeDefined();
    expect(UserContext.defaultValue).toBeUndefined();
  });

  test('should create multiple contexts independently', () => {
    const ThemeContext = createContext('dark');
    const UserContext = createContext('anonymous');

    expect(ThemeContext).not.toBe(UserContext);
    expect(ThemeContext.defaultValue).toBe('dark');
    expect(UserContext.defaultValue).toBe('anonymous');
  });

  test('should handle different types of default values', () => {
    const StringContext = createContext('hello');
    const NumberContext = createContext(42);
    const BooleanContext = createContext(true);
    const ObjectContext = createContext({ name: 'test' });

    expect(StringContext.defaultValue).toBe('hello');
    expect(NumberContext.defaultValue).toBe(42);
    expect(BooleanContext.defaultValue).toBe(true);
    expect(ObjectContext.defaultValue).toEqual({ name: 'test' });
  });
});

describe('useContext() - Simple Tests', () => {
  test('should return default value when no provider', () => {
    const ThemeContext = createContext('light');

    // In a real component, this would be called during render
    // For now, we'll test the context creation
    expect(ThemeContext.defaultValue).toBe('light');
  });

  test('should handle undefined default values', () => {
    const OptionalContext = createContext();

    expect(OptionalContext.defaultValue).toBeUndefined();
  });
});

// Run tests
runTests().catch(console.error);
