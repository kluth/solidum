/**
 * @sldm/ssr - Server-Side Rendering Utilities
 *
 * Provides utilities for rendering Solidum components to HTML strings
 * on the server side.
 */

import { _getOrCreateComponentId, _setComponentId, _clearComponentId } from '@sldm/core';

// Types
export interface VNode {
  type: string | symbol | Function;
  props?: Record<string, unknown>;
  children?: unknown[];
  text?: string;
}

/**
 * HTML escape utility
 */
export function escapeHtml(text: string | number): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

/**
 * Render attributes to HTML string
 */
export function renderAttributes(props: Record<string, unknown> | undefined): string {
  if (!props) return '';

  const attrs = [];
  for (const [key, value] of Object.entries(props)) {
    if (value === true) {
      attrs.push(key);
    } else if (value === false || value === null || value === undefined) {
      // Skip falsy values
    } else if (key === 'className' && typeof value === 'string') {
      attrs.push(`class="${escapeHtml(value)}"`);
    } else if (key === 'style' && typeof value === 'object') {
      const styles = Object.entries(value)
        .map(([k, v]) => `${k}: ${v}`)
        .join('; ');
      attrs.push(`style="${escapeHtml(styles)}"`);
    } else if (typeof value === 'string' || typeof value === 'number') {
      attrs.push(`${key}="${escapeHtml(value)}"`);
    }
  }

  return attrs.length ? ' ' + attrs.join(' ') : '';
}

/**
 * Void elements that don't need closing tags
 */
const voidElements = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

/**
 * Render a VNode to HTML string
 */
export function renderToString(
  vnode: VNode | VNode[] | string | number | null | undefined | boolean
): string {
  // Handle null/undefined/false
  if (vnode == null || vnode === false) {
    return '';
  }

  // Handle primitives
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return escapeHtml(vnode);
  }

  // Handle arrays
  if (Array.isArray(vnode)) {
    return vnode.map(renderToString).join('');
  }

  // At this point, vnode should be a VNode
  const node = vnode as VNode;

  // Handle TEXT_NODE type
  if (node.type === 'TEXT_NODE' && node.text) {
    return escapeHtml(node.text);
  }

  // Handle component functions
  if (typeof node.type === 'function') {
    // Set up component context for useState hooks
    const componentId = _getOrCreateComponentId(node.type, node.props);
    _setComponentId(componentId);

    try {
      // Pass children as part of props
      const propsWithChildren = {
        ...(node.props || {}),
        children: node.children,
      };
      const result = node.type(propsWithChildren);
      return renderToString(result);
    } finally {
      _clearComponentId();
    }
  }

  // Handle fragments
  if (node.type === Symbol.for('solidum.fragment') || typeof node.type === 'symbol') {
    return renderToString((node.children || []) as VNode[]);
  }

  // Handle DOM elements
  if (typeof node.type === 'string') {
    const tag = node.type;
    const attrs = renderAttributes(node.props);
    const children = node.children || [];

    if (voidElements.has(tag)) {
      return `<${tag}${attrs}>`;
    }

    const childrenHtml = renderToString(children as VNode[]);
    return `<${tag}${attrs}>${childrenHtml}</${tag}>`;
  }

  return '';
}

/**
 * Create HTML template with content
 */
export function createHtmlTemplate(
  content: string,
  title: string = 'Solidum App',
  styles?: string,
  scripts?: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  ${styles ? `<link rel="stylesheet" href="${styles}">` : ''}
</head>
<body>
  <div id="app">${content}</div>
  ${scripts ? `<script src="${scripts}"></script>` : ''}
</body>
</html>`;
}
