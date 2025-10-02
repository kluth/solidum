import { createElement, cn } from '@solidum/core';

export interface CardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
  hoverable?: boolean;
  children?: any;
  className?: string;
  [key: string]: any;
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
