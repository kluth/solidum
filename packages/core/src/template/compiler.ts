/**
 * WebML Template Compiler
 *
 * Compiles .webml template files into JavaScript modules
 */

export interface WebMLCompilerOptions {
  filename?: string;
  sourcemap?: boolean;
}

/**
 * Compile a WebML template string into JavaScript code
 *
 * @example
 * Input (.webml):
 * ```html
 * <button class="{{className}}" {{#if disabled}}disabled{{/if}}>
 *   {{children}}
 * </button>
 * ```
 *
 * Output (.js):
 * ```js
 * import { webml } from '@sldm/core';
 * export default function(props) {
 *   return webml`<button class="${props.className}" ${props.disabled ? 'disabled' : ''}>${props.children}</button>`;
 * }
 * ```
 */
export function compileWebML(template: string, _options: WebMLCompilerOptions = {}): string {
  // Parse the template and convert WebML syntax to template literals
  let compiled = template.trim();

  // Convert {{variable}} to ${props.variable}
  compiled = compiled.replace(/\{\{([^#/}][^}]*)\}\}/g, (_match, variable) => {
    const trimmed = variable.trim();
    return `\${props.${trimmed}}`;
  });

  // Convert {{#if condition}} ... {{/if}} to ${props.condition ? '...' : ''}
  compiled = compiled.replace(
    /\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_match, condition, content) => {
      const trimmedCondition = condition.trim();
      const trimmedContent = content.trim();
      return `\${props.${trimmedCondition} ? \`${trimmedContent}\` : ''}`;
    }
  );

  // Convert {{#each array}} ... {{/each}} to ${props.array.map(item => `...`).join('')}
  compiled = compiled.replace(
    /\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
    (_match, array, content) => {
      const trimmedArray = array.trim();
      // Replace {{item}} and {{@index}} in content
      let itemContent = content.trim();
      itemContent = itemContent.replace(/\{\{item\}\}/g, '${item}');
      itemContent = itemContent.replace(/\{\{@index\}\}/g, '${index}');
      return `\${props.${trimmedArray}.map((item, index) => \`${itemContent}\`).join('')}`;
    }
  );

  // Generate the module code
  const moduleCode = `import { webml } from '@sldm/core';

export default function template(props) {
  return webml\`${compiled}\`;
}
`;

  return moduleCode;
}

/**
 * Compile a .webml file and return the JavaScript module code
 */
export function compileWebMLFile(content: string, filename: string): string {
  return compileWebML(content, { filename });
}
