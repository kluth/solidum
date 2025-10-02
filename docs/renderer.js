/**
 * Simple server-side renderer for Solidum
 * Renders VNodes to HTML strings
 */

import { _getOrCreateComponentId, _setComponentId, _clearComponentId } from '@solidum/core';

const voidElements = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

function renderAttributes(props) {
  if (!props) return '';

  const attrs = [];
  for (const [key, value] of Object.entries(props)) {
    // Skip special props
    if (key === 'children' || key.startsWith('on') || key.startsWith('__')) {
      continue;
    }

    if (key === 'className') {
      attrs.push(`class="${escapeHtml(value)}"`);
    } else if (key === 'style' && typeof value === 'object') {
      const styleStr = Object.entries(value)
        .map(([k, v]) => `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${v}`)
        .join('; ');
      attrs.push(`style="${escapeHtml(styleStr)}"`);
    } else if (typeof value === 'boolean') {
      if (value) attrs.push(key);
    } else if (value != null) {
      attrs.push(`${key}="${escapeHtml(value)}"`);
    }
  }

  return attrs.length ? ' ' + attrs.join(' ') : '';
}

export function renderToString(vnode) {
  // Handle null/undefined
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

  // Handle TEXT_NODE type
  if (vnode.type === 'TEXT_NODE' && vnode.text) {
    return escapeHtml(vnode.text);
  }

  // Handle component functions
  if (typeof vnode.type === 'function') {
    // Set up component context for useState hooks
    const componentId = _getOrCreateComponentId(vnode.type, vnode.props);
    _setComponentId(componentId);
    
    try {
      // Pass children as part of props
      const propsWithChildren = {
        ...(vnode.props || {}),
        children: vnode.children
      };
      const result = vnode.type(propsWithChildren);
      return renderToString(result);
    } finally {
      _clearComponentId();
    }
  }

  // Handle fragments
  if (vnode.type === Symbol.for('solidum.fragment') || typeof vnode.type === 'symbol') {
    return renderToString(vnode.children || []);
  }

  // Handle DOM elements
  if (typeof vnode.type === 'string') {
    const tag = vnode.type;
    const attrs = renderAttributes(vnode.props);
    const children = vnode.children || [];

    if (voidElements.has(tag)) {
      return `<${tag}${attrs}>`;
    }

    const childrenHtml = renderToString(children);
    return `<${tag}${attrs}>${childrenHtml}</${tag}>`;
  }

  return '';
}
