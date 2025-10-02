import { createElement, useState } from '@solidum/core';
import { cn } from '@solidum/utils';

export interface AccordionItem {
  id: string;
  title: string;
  content: any;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  animated?: boolean;
  className?: string;
}

function AccordionItemComponent({ item, isOpen, toggle, animated }: any) {
  return createElement(
    'div',
    { className: cn('solidum-accordion-item', { 'solidum-accordion-item--open': isOpen() }) },
    createElement(
      'button',
      {
        type: 'button',
        className: 'solidum-accordion-header',
        onClick: toggle,
      },
      createElement('span', {}, item.title),
      createElement('span', { className: 'solidum-accordion-icon' }, isOpen() ? '−' : '+')
    ),
    createElement(
      'div',
      {
        className: cn('solidum-accordion-content', {
          'solidum-accordion-content--open': isOpen(),
          'solidum-accordion-content--animated': animated,
        }),
      },
      createElement('div', { className: 'solidum-accordion-body' }, item.content)
    )
  );
}

export function Accordion(props: AccordionProps) {
  const { items, allowMultiple = false, animated = true, className } = props;

  const openItems = useState<Set<string>>(
    new Set(items.filter(item => item.defaultOpen).map(item => item.id))
  );

  const toggle = (itemId: string) => {
    const current = openItems();
    const newSet = new Set(current);

    if (newSet.has(itemId)) {
      newSet.delete(itemId);
    } else {
      if (!allowMultiple) {
        newSet.clear();
      }
      newSet.add(itemId);
    }

    openItems(newSet);
  };

  return createElement(
    'div',
    { className: cn('solidum-accordion', className) },
    ...items.map(item =>
      createElement(AccordionItemComponent, {
        item,
        isOpen: () => openItems().has(item.id),
        toggle: () => toggle(item.id),
        animated,
      })
    )
  );
}
