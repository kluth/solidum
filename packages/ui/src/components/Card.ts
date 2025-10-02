import { createElement } from '@sldm/core';
import { cn } from '@sldm/utils';

export interface CardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
  hoverable?: boolean;
  children?: unknown;
  className?: string;
  [key: string]: unknown;
}

export function Card(props: CardProps) {
  const {
    padding = 'md',
    bordered = true,
    hoverable = false,
    children,
    className,
    ...rest
  } = props;

  const classes = cn(
    'solidum-card',
    `solidum-card--padding-${padding}`,
    {
      'solidum-card--bordered': bordered,
      'solidum-card--hoverable': hoverable,
    },
    className
  );

  return createElement('div', { className: classes, ...rest }, children);
}
