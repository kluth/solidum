import { createElement, useState } from '@solidum/core';
import { cn } from '@solidum/utils';

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

  const handleTabChange = (tabId: string, event: Event) => {
    activeTab(tabId);
    onChange?.(tabId);

    // TEMPORARY: Directly manipulate DOM until reactivity is fixed
    const button = event.currentTarget as HTMLButtonElement;
    const tabsContainer = button.closest('.solidum-tabs');
    if (tabsContainer) {
      // Update button states
      const allButtons = tabsContainer.querySelectorAll('.solidum-tab');
      allButtons.forEach(btn => {
        btn.classList.remove('solidum-tab--active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('solidum-tab--active');
      button.setAttribute('aria-selected', 'true');

      // Update panel visibility
      const allPanels = tabsContainer.querySelectorAll('.solidum-tabs-content');
      allPanels.forEach((panel, index) => {
        if (tabs[index]?.id === tabId) {
          (panel as HTMLElement).style.display = 'block';
          panel.classList.add('solidum-tabs-content--active');
        } else {
          (panel as HTMLElement).style.display = 'none';
          panel.classList.remove('solidum-tabs-content--active');
        }
      });
    }
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
            onClick: (e: Event) => !tab.disabled && handleTabChange(tab.id, e),
          },
          tab.icon && createElement('span', { className: 'solidum-tab-icon' }, tab.icon),
          tab.label
        )
      )
    ),
    // Tab contents - render all, show active with CSS
    createElement(
      'div',
      { className: 'solidum-tabs-panels' },
      ...tabs.map(tab =>
        createElement(
          'div',
          {
            className: cn('solidum-tabs-content', {
              'solidum-tabs-content--active': tab.id === activeTab(),
              'solidum-tabs-content--animated': animated,
            }),
            role: 'tabpanel',
            style: {
              display: tab.id === activeTab() ? 'block' : 'none',
            },
          },
          tab.content
        )
      )
    )
  );
}
