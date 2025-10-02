import { createElement, useState } from '@solidum/core';
import { cn } from '@solidum/utils';
import { Stack } from './Stack.js';

export interface SidebarItem {
  text: string;
  link: string;
  items?: SidebarItem[];
}

export interface SidebarSection {
  text: string;
  items: SidebarItem[];
  collapsed?: boolean;
}

export interface SidebarProps {
  sections: SidebarSection[];
  currentPath: string;
  className?: string;
}

function SidebarLink({ item, currentPath }: { item: SidebarItem; currentPath: string }) {
  const isActive = currentPath === item.link;

  return createElement(
    'a',
    {
      href: item.link,
      className: cn('solidum-sidebar-link', {
        'solidum-sidebar-link--active': isActive,
      }),
    },
    item.text
  );
}

function SidebarGroup({ section, currentPath }: { section: SidebarSection; currentPath: string }) {
  const collapsed = useState(section.collapsed ?? false);

  return createElement(
    'div',
    { className: 'solidum-sidebar-group' },
    createElement(
      'div',
      {
        className: 'solidum-sidebar-group-title',
        onClick: () => collapsed(!collapsed()),
      },
      section.text
    ),
    !collapsed() &&
      createElement(
        Stack,
        { spacing: 'xs', className: 'solidum-sidebar-group-items' },
        ...(section.items || []).map((item: SidebarItem) =>
          createElement(SidebarLink, { item, currentPath })
        )
      )
  );
}

export function Sidebar(props: SidebarProps) {
  const { sections, currentPath, className } = props;

  return createElement(
    'aside',
    { className: cn('solidum-sidebar', className) },
    createElement(
      Stack,
      { spacing: 'lg' },
      ...sections.map((section: SidebarSection) =>
        createElement(SidebarGroup, { section, currentPath })
      )
    )
  );
}
