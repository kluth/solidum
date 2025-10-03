/**
 * WebML Template Literal System
 *
 * Provides a way to create DOM elements using template literals instead of createElement
 * Works in both browser and SSR (Node.js) environments
 */

// Lazy-loaded SSR renderToString to avoid circular dependency
let ssrRenderToString: ((vnode: unknown) => string) | null = null;
let ssrAttempted = false;

function getSSRRenderer(): ((vnode: unknown) => string) | null {
  if (!ssrAttempted && typeof window === 'undefined') {
    ssrAttempted = true;
    try {
      // Use require for synchronous loading in Node.js

      const ssr = require('@sldm/ssr');
      ssrRenderToString = ssr.renderToString;
    } catch {
      // SSR package not available or in browser
    }
  }
  return ssrRenderToString;
}

export interface TemplateResult {
  template: string;
  values: unknown[];
  type: 'webml';
}

/**
 * VNode structure returned by render function
 * Compatible with standard VNode interface
 */
export interface WebMLVNode {
  type: string;
  props: Record<string, unknown>;
  children: WebMLVNode[];
  _html?: string; // HTML string for SSR
  _element?: HTMLElement; // DOM element for browser
  _isWebMLNode: true;
}

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Tagged template literal for creating WebML templates
 *
 * @example
 * ```typescript
 * const button = webml`
 *   <button class="${className}" onclick="${handleClick}">
 *     ${children}
 *   </button>
 * `;
 * ```
 */
export function webml(strings: TemplateStringsArray, ...values: unknown[]): TemplateResult {
  return {
    template: strings.join('{{}}'),
    values,
    type: 'webml',
  };
}

/**
 * Render a template result to a DOM element (browser) or VNode (SSR)
 * Returns a VNode-compatible structure for compatibility with createElement
 */
export function render(result: TemplateResult, container?: HTMLElement): WebMLVNode {
  if (!result || result.type !== 'webml') {
    throw new Error('Invalid template result');
  }

  // Build HTML string from template
  const htmlString = buildHtmlString(result);

  // SSR mode: Return VNode structure without creating DOM
  if (!isBrowser()) {
    // Extract tag name from HTML string
    const tagMatch = htmlString.match(/^<(\w+)/);
    const tagName = tagMatch ? tagMatch[1] : 'div';

    return {
      type: tagName.toLowerCase(),
      props: {},
      children: [],
      _html: htmlString, // Store HTML for SSR
      _isWebMLNode: true,
    };
  }

  // Browser mode: Create actual DOM elements
  const template = document.createElement('template');
  template.innerHTML = htmlString.trim();
  const element = template.content.firstElementChild as HTMLElement;

  if (!element) {
    throw new Error('Template did not produce a valid element');
  }

  // Attach event handlers
  attachEventHandlers(element, result.values);

  // If container provided, append to it
  if (container) {
    container.appendChild(element);
  }

  // Return VNode-like structure for compatibility
  return {
    type: element.tagName.toLowerCase(),
    props: {},
    children: [],
    _element: element, // Store actual element for access
    _isWebMLNode: true,
  };
}

/**
 * Build HTML string from template result
 */
function buildHtmlString(result: TemplateResult): string {
  const parts = result.template.split('{{}}');
  let htmlString = '';

  // Interleave template parts with values
  for (let i = 0; i < parts.length; i++) {
    htmlString += parts[i];

    if (i < result.values.length) {
      const value = result.values[i];

      // Handle different value types
      if (value === null || value === undefined) {
        // Skip null/undefined
      } else if (typeof value === 'function') {
        // Store function reference for later (event handlers)
        const fnId = `fn_${Math.random().toString(36).substr(2, 9)}`;
        htmlString += fnId;
      } else if (Array.isArray(value)) {
        // Render array of children
        htmlString += value.map(v => renderValue(v)).join('');
      } else if (isTemplateResult(value)) {
        // Nested template
        const nestedEl = render(value);
        if (isBrowser() && nestedEl._element) {
          htmlString += nestedEl._element.outerHTML;
        } else if (nestedEl._html) {
          htmlString += nestedEl._html;
        }
      } else if (isBrowser() && value instanceof HTMLElement) {
        // Actual DOM element (browser only)
        htmlString += value.outerHTML;
      } else if (isWebMLVNode(value)) {
        // VNode with HTML string (SSR) or element (browser)
        if (value._html) {
          htmlString += value._html;
        } else if (isBrowser() && value._element) {
          htmlString += value._element.outerHTML;
        }
      } else if (isVNode(value)) {
        // Regular VNode from createElement - needs SSR rendering
        const renderer = getSSRRenderer();
        if (!isBrowser() && renderer) {
          htmlString += renderer(value);
        } else if (!isBrowser()) {
          // eslint-disable-next-line no-console
          console.warn('WebML: VNode children require @sldm/ssr package in SSR mode');
        }
      } else {
        // Primitive value
        htmlString += escapeHtml(String(value));
      }
    }
  }

  return htmlString;
}

function renderValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  } else if (isTemplateResult(value)) {
    const rendered = render(value);
    if (rendered._html) {
      return rendered._html;
    } else if (isBrowser() && rendered._element) {
      return rendered._element.outerHTML;
    }
    return '';
  } else if (isBrowser() && value instanceof HTMLElement) {
    return value.outerHTML;
  } else if (isWebMLVNode(value)) {
    if (value._html) {
      return value._html;
    } else if (isBrowser() && value._element) {
      return value._element.outerHTML;
    }
    return '';
  } else if (isVNode(value)) {
    // Regular VNode from createElement
    const renderer = getSSRRenderer();
    if (!isBrowser() && renderer) {
      return renderer(value);
    }
    return '';
  } else {
    return escapeHtml(String(value));
  }
}

function isTemplateResult(value: unknown): value is TemplateResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    (value as TemplateResult).type === 'webml'
  );
}

function isWebMLVNode(value: unknown): value is WebMLVNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    '_isWebMLNode' in value &&
    (value as WebMLVNode)._isWebMLNode === true
  );
}

/**
 * Check if value looks like a VNode (created by createElement)
 */
function isVNode(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    !isWebMLVNode(value) &&
    !isTemplateResult(value)
  );
}

function escapeHtml(text: string): string {
  // SSR: Manual escaping
  if (!isBrowser()) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Browser: Use DOM
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function attachEventHandlers(element: HTMLElement, values: unknown[]): void {
  // Find all function values and attach them as event handlers
  const allElements = [element, ...element.querySelectorAll('*')];

  values.forEach((value, _index) => {
    if (typeof value === 'function') {
      const fnId = `fn_${Math.random().toString(36).substr(2, 9)}`;

      // Find elements with this function ID in their attributes
      allElements.forEach(el => {
        Array.from(el.attributes).forEach(attr => {
          if (attr.value === fnId || attr.value.includes(fnId)) {
            // Extract event name from attribute (e.g., "onclick" -> "click")
            const eventName = attr.name.replace(/^on/, '');

            // Attach the event listener
            el.addEventListener(eventName, value as EventListener);

            // Remove the attribute
            el.removeAttribute(attr.name);
          }
        });
      });
    }
  });
}

/**
 * Helper for conditional rendering
 *
 * @example
 * ```typescript
 * webml`
 *   <div>
 *     ${when(isVisible, () => webml`<p>I'm visible!</p>`)}
 *   </div>
 * `
 * ```
 */
export function when<T>(condition: boolean | undefined | null, template: () => T): T | null {
  return condition ? template() : null;
}

/**
 * Helper for mapping arrays to templates
 *
 * @example
 * ```typescript
 * webml`
 *   <ul>
 *     ${map(items, item => webml`<li>${item.name}</li>`)}
 *   </ul>
 * `
 * ```
 */
export function map<T, R>(items: T[], template: (item: T, index: number) => R): R[] {
  return items.map(template);
}
