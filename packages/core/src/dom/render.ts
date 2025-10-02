/**
 * DOM Rendering
 *
 * Convert VNodes to real DOM elements
 */

import type { VNode, ComponentFunction } from './vnode.js';
import { Fragment } from './vnode.js';
import { pushContext, popContext, enterRender, exitRender } from '../context/context.js';
import { _getOrCreateComponentId, _setComponentId, _clearComponentId } from '../reactive/state.js';

/**
 * Check if an element name is an SVG element
 */
function isSVGElement(elementName: string): boolean {
  const svgElements = [
    'svg', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'path',
    'text', 'tspan', 'textPath', 'g', 'defs', 'clipPath', 'mask', 'pattern',
    'linearGradient', 'radialGradient', 'stop', 'image', 'use', 'symbol',
    'marker', 'foreignObject', 'switch', 'foreignObject', 'animate',
    'animateTransform', 'set', 'animateMotion', 'mpath', 'script', 'style',
    'title', 'desc', 'metadata', 'a', 'altGlyph', 'altGlyphDef', 'altGlyphItem',
    'glyph', 'glyphRef', 'hkern', 'vkern', 'font', 'font-face', 'font-face-format',
    'font-face-name', 'font-face-src', 'font-face-uri', 'missing-glyph',
    'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite',
    'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight',
    'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
    'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology',
    'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
    'feTurbulence', 'filter', 'hatch', 'hatchpath', 'mesh', 'meshgradient',
    'meshpatch', 'meshrow', 'radialGradient', 'solidcolor', 'view'
  ];
  return svgElements.includes(elementName.toLowerCase());
}

/**
 * Render a VNode to a DOM element
 */
export function render(
  vnode: VNode,
  document: Document = window.document
): Node | DocumentFragment {
  // Handle text nodes
  if (vnode.type === 'TEXT_NODE') {
    return document.createTextNode(vnode.text || '');
  }

  // Handle fragments
  if (vnode.type === Fragment) {
    // Check if this fragment has context metadata (from Context.Provider)
    const hasContext = '__contextId' in vnode && '__contextValue' in vnode;

    if (hasContext) {
      // Push context before rendering children
      pushContext((vnode as any).__contextId, (vnode as any).__contextValue);
    }

    try {
      const fragment = document.createDocumentFragment();
      for (const child of vnode.children) {
        fragment.appendChild(render(child, document));
      }
      return fragment;
    } finally {
      if (hasContext) {
        // Pop context after rendering children
        popContext();
      }
    }
  }

  // Handle component functions
  if (typeof vnode.type === 'function') {
    enterRender();

    // Set component ID for useState hooks
    const componentId = _getOrCreateComponentId(vnode.type, vnode.props);
    _setComponentId(componentId);

    try {
      // Merge children into props for component access
      const propsWithChildren = {
        ...vnode.props,
        children: vnode.children.length === 1 ? vnode.children[0] : vnode.children.length > 0 ? vnode.children : undefined,
      };

      const componentVNode = (vnode.type as ComponentFunction)(propsWithChildren);
      if (componentVNode) {
        return render(componentVNode, document);
      }
      // Component returned null
      return document.createTextNode('');
    } finally {
      _clearComponentId();
      exitRender();
    }
  }

  // Handle regular elements
  const elementName = vnode.type as string;
  const element = isSVGElement(elementName) 
    ? document.createElementNS('http://www.w3.org/2000/svg', elementName)
    : document.createElement(elementName);

  // Set props/attributes
  setProps(element, vnode.props);

  // Render children
  for (const child of vnode.children) {
    element.appendChild(render(child, document));
  }

  return element;
}

/**
 * Set properties and attributes on a DOM element
 */
function setProps(element: Element, props: Record<string, any>): void {
  for (const [key, value] of Object.entries(props)) {
    if (value == null) continue; // Skip null/undefined

    // Handle special props
    if (key === 'children') {
      // Handled separately
      continue;
    } else if (key === 'className') {
      // className -> class
      element.setAttribute('class', value);
    } else if (key === 'style' && typeof value === 'object') {
      // Style object
      setStyle(element as HTMLElement, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      // Event handlers (onClick -> click)
      const eventName = key.substring(2).toLowerCase();
      element.addEventListener(eventName, value as EventListener);
    } else if (typeof value === 'boolean') {
      // Boolean attributes
      if (value) {
        element.setAttribute(key, String(value));
      }
    } else {
      // Regular attributes
      element.setAttribute(key, String(value));
    }
  }
}

/**
 * Set inline styles on an element
 */
function setStyle(element: HTMLElement, styles: Record<string, string>): void {
  for (const [property, value] of Object.entries(styles)) {
    if (value != null) {
      // Direct assignment for compatibility with both real and mock DOM
      (element.style as any)[property] = value;
    }
  }
}
