import { createElement, cn, useState } from '@solidum/core';

export interface Tab {
  id: string;
  label: string;
  content: any;
  disabled?: boolean;
  icon?: string;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'line' | 'enclosed' | 'pills';
  animated?: boolean;
  className?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs(props: TabsProps) {
  const {
    tabs,
    defaultTab,
    variant = 'line',
    animated = true,
    className,
    onChange,
  } = props;

  const activeTab = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    activeTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab())?.content;

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
    // Tab content
    createElement(
      'div',
      {
        className: cn('solidum-tabs-content', {
          'solidum-tabs-content--animated': animated,
        }),
        role: 'tabpanel',
      },
      activeTabContent
    )
  );
}
