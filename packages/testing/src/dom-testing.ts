/**
 * Lightweight DOM Testing Utilities
 *
 * Provides Playwright-like testing mechanics without the bloat
 */

import { JSDOM } from 'jsdom';

/**
 * DOM testing environment
 */
export interface DOMTestEnvironment {
  window: Window;
  document: Document;
  cleanup: () => void;
}

/**
 * Create a DOM testing environment
 */
export function createDOMEnvironment(): DOMTestEnvironment {
  const jsdom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true,
    resources: 'usable',
  });

  const window = jsdom.window as unknown as Window;
  const document = window.document;

  // Setup global references
  (global as Record<string, unknown>).window = window;
  (global as Record<string, unknown>).document = document;
  (global as Record<string, unknown>).HTMLElement = (
    window as unknown as Record<string, unknown>
  ).HTMLElement;
  (global as Record<string, unknown>).Element = (
    window as unknown as Record<string, unknown>
  ).Element;
  (global as Record<string, unknown>).Node = (window as unknown as Record<string, unknown>).Node;

  return {
    window,
    document,
    cleanup: () => {
      jsdom.window.close();
      delete (global as Record<string, unknown>).window;
      delete (global as Record<string, unknown>).document;
      delete (global as Record<string, unknown>).HTMLElement;
      delete (global as Record<string, unknown>).Element;
      delete (global as Record<string, unknown>).Node;
    },
  };
}

/**
 * Query options
 */
export interface QueryOptions {
  container?: Element | Document;
  timeout?: number;
}

/**
 * Query utilities for finding elements
 */
export class DOMQueries {
  // eslint-disable-next-line no-unused-vars
  constructor(private container: Element | Document = document) {}

  /**
   * Get element by test ID
   */
  getByTestId(testId: string): Element {
    const element = this.container.querySelector(`[data-testid="${testId}"]`);
    if (!element) {
      throw new Error(`Unable to find element with testId: ${testId}`);
    }
    return element;
  }

  /**
   * Query element by test ID (returns null if not found)
   */
  queryByTestId(testId: string): Element | null {
    return this.container.querySelector(`[data-testid="${testId}"]`);
  }

  /**
   * Get element by text content
   */
  getByText(text: string | RegExp): Element {
    const elements = Array.from(this.container.querySelectorAll('*'));
    const element = elements.find(el => {
      const textContent = el.textContent || '';
      if (typeof text === 'string') {
        return textContent.includes(text);
      }
      return text.test(textContent);
    });

    if (!element) {
      throw new Error(`Unable to find element with text: ${text}`);
    }
    return element;
  }

  /**
   * Query element by text content (returns null if not found)
   */
  queryByText(text: string | RegExp): Element | null {
    const elements = Array.from(this.container.querySelectorAll('*'));
    return (
      elements.find(el => {
        const textContent = el.textContent || '';
        if (typeof text === 'string') {
          return textContent.includes(text);
        }
        return text.test(textContent);
      }) || null
    );
  }

  /**
   * Get element by role
   */
  getByRole(role: string): Element {
    const element = this.container.querySelector(`[role="${role}"]`);
    if (!element) {
      throw new Error(`Unable to find element with role: ${role}`);
    }
    return element;
  }

  /**
   * Query element by role (returns null if not found)
   */
  queryByRole(role: string): Element | null {
    return this.container.querySelector(`[role="${role}"]`);
  }

  /**
   * Get element by placeholder
   */
  getByPlaceholder(placeholder: string): Element {
    const element = this.container.querySelector(`[placeholder="${placeholder}"]`);
    if (!element) {
      throw new Error(`Unable to find element with placeholder: ${placeholder}`);
    }
    return element;
  }

  /**
   * Query element by placeholder (returns null if not found)
   */
  queryByPlaceholder(placeholder: string): Element | null {
    return this.container.querySelector(`[placeholder="${placeholder}"]`);
  }

  /**
   * Get all elements by test ID
   */
  getAllByTestId(testId: string): Element[] {
    const elements = Array.from(this.container.querySelectorAll(`[data-testid="${testId}"]`));
    if (elements.length === 0) {
      throw new Error(`Unable to find elements with testId: ${testId}`);
    }
    return elements;
  }

  /**
   * Get all elements by text content
   */
  getAllByText(text: string | RegExp): Element[] {
    const elements = Array.from(this.container.querySelectorAll('*')).filter(el => {
      const textContent = el.textContent || '';
      if (typeof text === 'string') {
        return textContent.includes(text);
      }
      return text.test(textContent);
    });

    if (elements.length === 0) {
      throw new Error(`Unable to find elements with text: ${text}`);
    }
    return elements;
  }
}

/**
 * Event simulation utilities
 */
export class DOMEvents {
  /**
   * Click an element
   */
  static click(element: Element): void {
    const event = new Event('click', { bubbles: true, cancelable: true });
    element.dispatchEvent(event);
  }

  /**
   * Input text into an element
   */
  static input(element: Element, value: string): void {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.value = value;
      const event = new Event('input', { bubbles: true, cancelable: true });
      element.dispatchEvent(event);
    } else {
      throw new Error('Element is not an input or textarea');
    }
  }

  /**
   * Change value of an element
   */
  static change(element: Element, value: string): void {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.value = value;
      const event = new Event('change', { bubbles: true, cancelable: true });
      element.dispatchEvent(event);
    } else {
      throw new Error('Element is not an input or textarea');
    }
  }

  /**
   * Submit a form
   */
  static submit(element: Element): void {
    if (element instanceof HTMLFormElement) {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      element.dispatchEvent(event);
    } else {
      throw new Error('Element is not a form');
    }
  }

  /**
   * Focus an element
   */
  static focus(element: Element): void {
    if (element instanceof HTMLElement) {
      element.focus();
      const event = new FocusEvent('focus', { bubbles: true });
      element.dispatchEvent(event);
    }
  }

  /**
   * Blur an element
   */
  static blur(element: Element): void {
    if (element instanceof HTMLElement) {
      element.blur();
      const event = new FocusEvent('blur', { bubbles: true });
      element.dispatchEvent(event);
    }
  }

  /**
   * Fire a keyboard event
   */
  static keyboard(
    element: Element,
    key: string,
    eventType: 'keydown' | 'keyup' | 'keypress' = 'keydown'
  ): void {
    const event = new KeyboardEvent(eventType, {
      key,
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(event);
  }

  /**
   * Fire a mouse event
   */
  static mouse(
    element: Element,
    eventType: 'mousedown' | 'mouseup' | 'mousemove' | 'mouseenter' | 'mouseleave',
    options: MouseEventInit = {}
  ): void {
    const event = new MouseEvent(eventType, {
      bubbles: true,
      cancelable: true,
      ...options,
    });
    element.dispatchEvent(event);
  }
}

/**
 * Wait utilities
 */
export class DOMWait {
  /**
   * Wait for a condition to be true
   */
  static async waitFor(
    callback: () => boolean | Promise<boolean>,
    options: { timeout?: number; interval?: number } = {}
  ): Promise<void> {
    const { timeout = 5000, interval = 50 } = options;
    const startTime = Date.now();

    while (true) {
      const result = await callback();
      if (result) {
        return;
      }

      if (Date.now() - startTime > timeout) {
        throw new Error(`Timeout waiting for condition after ${timeout}ms`);
      }

      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }

  /**
   * Wait for an element to appear
   */
  static async waitForElement(
    selector: string,
    options: { container?: Element | Document; timeout?: number } = {}
  ): Promise<Element> {
    const { container = document, timeout = 5000 } = options;

    return new Promise((resolve, reject) => {
      const element = container.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = container.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Timeout waiting for element: ${selector} after ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * Wait for an element to be removed
   */
  static async waitForElementToBeRemoved(
    element: Element,
    options: { timeout?: number } = {}
  ): Promise<void> {
    const { timeout = 5000 } = options;

    if (!element.isConnected) {
      return;
    }

    return new Promise((resolve, reject) => {
      const parent = element.parentElement;
      if (!parent) {
        resolve();
        return;
      }

      const observer = new MutationObserver(() => {
        if (!element.isConnected) {
          observer.disconnect();
          resolve();
        }
      });

      observer.observe(parent, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Timeout waiting for element to be removed after ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * Wait for a specific amount of time
   */
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Assertion utilities for DOM elements
 */
export class DOMAssertions {
  /**
   * Assert element is visible
   */
  static isVisible(element: Element): boolean {
    if (!(element instanceof HTMLElement)) {
      return false;
    }

    // Check if element is in DOM
    if (!element.isConnected) {
      return false;
    }

    // Check computed styles
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }

    return true;
  }

  /**
   * Assert element has text content
   */
  static hasTextContent(element: Element, text: string | RegExp): boolean {
    const textContent = element.textContent || '';
    if (typeof text === 'string') {
      return textContent.includes(text);
    }
    return text.test(textContent);
  }

  /**
   * Assert element has attribute
   */
  static hasAttribute(element: Element, attribute: string, value?: string): boolean {
    if (!element.hasAttribute(attribute)) {
      return false;
    }
    if (value !== undefined) {
      return element.getAttribute(attribute) === value;
    }
    return true;
  }

  /**
   * Assert element has class
   */
  static hasClass(element: Element, className: string): boolean {
    return element.classList.contains(className);
  }

  /**
   * Assert element is disabled
   */
  static isDisabled(element: Element): boolean {
    if (element instanceof HTMLButtonElement || element instanceof HTMLInputElement) {
      return element.disabled;
    }
    return element.hasAttribute('disabled');
  }

  /**
   * Assert element is enabled
   */
  static isEnabled(element: Element): boolean {
    return !DOMAssertions.isDisabled(element);
  }

  /**
   * Assert input has value
   */
  static hasValue(element: Element, value: string): boolean {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      return element.value === value;
    }
    return false;
  }

  /**
   * Assert element is checked (checkbox/radio)
   */
  static isChecked(element: Element): boolean {
    if (element instanceof HTMLInputElement) {
      return element.checked;
    }
    return false;
  }

  /**
   * Assert element is focused
   */
  static isFocused(element: Element): boolean {
    return document.activeElement === element;
  }
}

/**
 * Render helper for component testing
 */
export interface RenderResult {
  container: HTMLElement;
  queries: DOMQueries;
  // eslint-disable-next-line no-unused-vars
  rerender: (component: () => unknown) => void;
  unmount: () => void;
}

/**
 * Render a component for testing
 */
export function render(
  component: () => unknown,
  options: { document?: Document } = {}
): RenderResult {
  const doc = options.document || document;
  const container = doc.createElement('div');
  doc.body.appendChild(container);

  // We'll need to import mount from core, but for now let's assume it's available
  let dispose: (() => void) | undefined;

  // eslint-disable-next-line no-unused-vars
  const renderComponent = (_comp: () => unknown) => {
    if (dispose) {
      dispose();
    }
    // This would need actual mount implementation
    // dispose = mount(container, _comp, doc);
  };

  renderComponent(component);

  return {
    container,
    queries: new DOMQueries(container),
    rerender: renderComponent,
    unmount: () => {
      if (dispose) {
        dispose();
      }
      container.remove();
    },
  };
}

/**
 * Helper to create a scoped query instance
 */
export function within(element: Element): DOMQueries {
  return new DOMQueries(element);
}

/**
 * User interaction simulation (more realistic than raw events)
 */
export class UserInteraction {
  /**
   * Simulate user clicking an element
   */
  static async click(element: Element): Promise<void> {
    DOMEvents.mouse(element, 'mousedown');
    await DOMWait.wait(10);
    DOMEvents.mouse(element, 'mouseup');
    await DOMWait.wait(10);
    DOMEvents.click(element);
  }

  /**
   * Simulate user typing into an input
   */
  static async type(
    element: Element,
    text: string,
    options: { delay?: number } = {}
  ): Promise<void> {
    const { delay = 0 } = options;

    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
      throw new Error('Element must be an input or textarea');
    }

    DOMEvents.focus(element);

    for (const char of text) {
      await DOMWait.wait(delay);
      DOMEvents.keyboard(element, char, 'keydown');
      element.value += char;
      DOMEvents.input(element, element.value);
      DOMEvents.keyboard(element, char, 'keyup');
    }
  }

  /**
   * Simulate user clearing an input
   */
  static async clear(element: Element): Promise<void> {
    if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
      throw new Error('Element must be an input or textarea');
    }

    DOMEvents.focus(element);
    element.value = '';
    DOMEvents.input(element, '');
  }

  /**
   * Simulate user selecting an option
   */
  static async selectOption(element: Element, value: string): Promise<void> {
    if (!(element instanceof HTMLSelectElement)) {
      throw new Error('Element must be a select');
    }

    element.value = value;
    DOMEvents.change(element, value);
  }

  /**
   * Simulate user hovering over an element
   */
  static async hover(element: Element): Promise<void> {
    DOMEvents.mouse(element, 'mouseenter');
    await DOMWait.wait(10);
    DOMEvents.mouse(element, 'mousemove');
  }

  /**
   * Simulate user unhovering from an element
   */
  static async unhover(element: Element): Promise<void> {
    DOMEvents.mouse(element, 'mouseleave');
  }
}

/**
 * Screen utility for debugging
 */
export class Screen extends DOMQueries {
  constructor() {
    super(document.body);
  }

  /**
   * Debug print the current DOM
   */
  debug(element?: Element): void {
    const el = element || document.body;
    // eslint-disable-next-line no-console
    console.log(el.innerHTML);
  }

  /**
   * Log all text content
   */
  logTestingPlaygroundURL(): void {
    // eslint-disable-next-line no-console
    console.log('DOM Testing Environment');
    // eslint-disable-next-line no-console
    console.log(document.body.innerHTML);
  }
}

/**
 * Global screen instance (lazy)
 */
let _screen: Screen | null = null;
export const screen = {
  get value(): Screen {
    if (!_screen) {
      _screen = new Screen();
    }
    return _screen;
  },
  getByTestId(testId: string) {
    return this.value.getByTestId(testId);
  },
  queryByTestId(testId: string) {
    return this.value.queryByTestId(testId);
  },
  getByText(text: string | RegExp) {
    return this.value.getByText(text);
  },
  queryByText(text: string | RegExp) {
    return this.value.queryByText(text);
  },
  getByRole(role: string) {
    return this.value.getByRole(role);
  },
  queryByRole(role: string) {
    return this.value.queryByRole(role);
  },
  getByPlaceholder(placeholder: string) {
    return this.value.getByPlaceholder(placeholder);
  },
  queryByPlaceholder(placeholder: string) {
    return this.value.queryByPlaceholder(placeholder);
  },
  getAllByTestId(testId: string) {
    return this.value.getAllByTestId(testId);
  },
  getAllByText(text: string | RegExp) {
    return this.value.getAllByText(text);
  },
  debug(element?: Element) {
    return this.value.debug(element);
  },
  logTestingPlaygroundURL() {
    return this.value.logTestingPlaygroundURL();
  },
};
