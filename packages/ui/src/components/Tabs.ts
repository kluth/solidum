import { createElement, useState } from '@sldm/core';
import { cn } from '@sldm/utils';

export interface Tab {
  id: string;
  label: string;
  content: unknown;
  disabled?: boolean;
  icon?: string;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'line' | 'enclosed' | 'pills';
  animated?: boolean;
  className?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (tabId: string) => void;
}

export function Tabs(props: TabsProps) {
  const { tabs, defaultTab, variant = 'line', animated = true, className, onChange } = props;

  const activeTab = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    activeTab(tabId);
    onChange?.(tabId);
  };

  return createElement(
    'div',
    { className: cn('solidum-tabs', `solidum-tabs--${variant}`, className) },
    // Tab list
    createElement(
      'div',
      { className: 'solidum-tabs-list', role: 'tablist' },
      ...tabs.map(tab =>
        createElement(
          'button',
          {
            type: 'button',
            role: 'tab',
            'aria-selected': tab.id === activeTab(),
            className: cn('solidum-tab', {
              'solidum-tab--active': tab.id === activeTab(),
              'solidum-tab--disabled': tab.disabled,
            }),
            disabled: tab.disabled,
            onClick: () => !tab.disabled && handleTabChange(tab.id),
          },
          tab.icon && createElement('span', { className: 'solidum-tab-icon' }, tab.icon),
          tab.label
        )
      )
    ),
    // Tab content - render active tab only
    createElement(
      'div',
      { className: 'solidum-tabs-panels' },
      createElement(
        'div',
        {
          className: cn('solidum-tabs-content', 'solidum-tabs-content--active', {
            'solidum-tabs-content--animated': animated,
          }),
          role: 'tabpanel',
        },
        tabs.find(tab => tab.id === activeTab())?.content
      )
    )
  );
}
