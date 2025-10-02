import { createElement, useState } from '@sldm/core';
import { cn } from '@sldm/utils';

import { Stack } from './Stack.js';

export interface NavItem {
  text: string;
  link: string;
}

export interface NavigationProps {
  logo?: string;
  title: string;
  items: NavItem[];
  currentPath: string;
  className?: string;
}

export function Navigation(props: NavigationProps) {
  const { logo, title, items, currentPath, className } = props;
  const mobileMenuOpen = useState(false);

  return createElement(
    'nav',
    { className: cn('solidum-nav', className) },
    createElement(
      'div',
      { className: 'solidum-nav-container' },
      // Logo and title
      createElement(
        'div',
        { className: 'solidum-nav-brand' },
        logo &&
          createElement('img', {
            src: logo,
            alt: title,
            className: 'solidum-nav-logo',
          }),
        createElement('span', { className: 'solidum-nav-title' }, title)
      ),

      // Desktop navigation
      createElement(
        Stack,
        {
          direction: 'horizontal',
          spacing: 'md',
          className: 'solidum-nav-items',
        },
        ...items.map((item: NavItem) =>
          createElement(
            'a',
            {
              href: item.link,
              className: cn('solidum-nav-link', {
                'solidum-nav-link--active': currentPath.startsWith(item.link),
              }),
            },
            item.text
          )
        )
      ),

      // Mobile menu button
      createElement(
        'button',
        {
          className: 'solidum-nav-mobile-toggle',
          onClick: () => mobileMenuOpen(!mobileMenuOpen()),
        },
        '☰'
      )
    ),

    // Mobile menu
    mobileMenuOpen() &&
      createElement(
        'div',
        { className: 'solidum-nav-mobile-menu' },
        ...items.map((item: NavItem) =>
          createElement(
            'a',
            {
              href: item.link,
              className: cn('solidum-nav-mobile-link', {
                'solidum-nav-mobile-link--active': currentPath.startsWith(item.link),
              }),
              onClick: () => mobileMenuOpen(false),
            },
            item.text
          )
        )
      )
  );
}
