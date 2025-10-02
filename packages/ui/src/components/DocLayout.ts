import { createElement, type ComponentFunction } from '@solidum/core';

import { Navigation } from './Navigation.js';
import type { NavigationProps } from './Navigation.js';
import { Sidebar } from './Sidebar.js';
import type { SidebarProps } from './Sidebar.js';

export interface DocLayoutProps {
  navigation: NavigationProps;
  sidebar?: SidebarProps;
  children?: unknown;
}

export function DocLayout(props: DocLayoutProps) {
  const { navigation, sidebar, children } = props;

  return createElement(
    'div',
    { className: 'solidum-doc-layout' },
    // Top navigation
    createElement(
      Navigation as unknown as ComponentFunction,
      navigation as unknown as Record<string, unknown>
    ),

    // Main content area
    createElement(
      'div',
      { className: 'solidum-doc-layout-main' },
      // Sidebar
      sidebar &&
        createElement(
          'div',
          { className: 'solidum-doc-layout-sidebar' },
          createElement(
            Sidebar as unknown as ComponentFunction,
            sidebar as unknown as Record<string, unknown>
          )
        ),

      // Content
      createElement('main', { className: 'solidum-doc-layout-content' }, children)
    )
  );
}
