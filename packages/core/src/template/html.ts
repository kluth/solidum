/**
 * WebML Template Literal System
 *
 * Provides a way to create DOM elements using template literals instead of createElement
 */

export interface TemplateResult {
  template: string;
  values: unknown[];
  type: 'webml';
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
    type: 'webml'
  };
}

/**
 * Render a template result to a DOM element
 */
export function render(result: TemplateResult, container?: HTMLElement): HTMLElement {
  if (!result || result.type !== 'webml') {
    throw new Error('Invalid template result');
  }

  // Split template by placeholders
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
        // We'll attach the function after creating the element
      } else if (Array.isArray(value)) {
        // Render array of children
        htmlString += value.map(v => renderValue(v)).join('');
      } else if (isTemplateResult(value)) {
        // Nested template
        const nestedEl = render(value);
        htmlString += nestedEl.outerHTML;
      } else if (value instanceof HTMLElement) {
        // Actual DOM element
        htmlString += value.outerHTML;
      } else {
        // Primitive value
        htmlString += escapeHtml(String(value));
      }
    }
  }

  // Create DOM element from HTML string
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

  return element;
}

function renderValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  } else if (isTemplateResult(value)) {
    return render(value).outerHTML;
  } else if (value instanceof HTMLElement) {
    return value.outerHTML;
  } else {
    return escapeHtml(String(value));
  }
}

function isTemplateResult(value: unknown): value is TemplateResult {
  return typeof value === 'object' && value !== null && 'type' in value && (value as TemplateResult).type === 'webml';
}

function escapeHtml(text: string): string {
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
      allElements.forEach((el) => {
        Array.from(el.attributes).forEach((attr) => {
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
export function when<T>(
  condition: boolean | undefined | null,
  template: () => T
): T | null {
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
export function map<T, R>(
  items: T[],
  template: (item: T, index: number) => R
): R[] {
  return items.map(template);
}
