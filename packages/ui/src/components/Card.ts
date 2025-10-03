import { createElement } from '@sldm/core';
import { cn } from '@sldm/utils';

export interface CardProps {
  bordered?: boolean;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children?: unknown;
  className?: string;
  [key: string]: unknown;
}

export function Card(props: CardProps) {
  const {
    bordered = true,
    hoverable = false,
    padding = 'md',
    children,
    className,
    ...rest
  } = props;

  const classes = cn(
    'solidum-card',
    {
      'solidum-card--bordered': bordered,
      'solidum-card--hoverable': hoverable,
      [`solidum-card--padding-${padding}`]: padding,
    },
    className
  );

  return createElement(
    'div',
    {
      className: classes,
      ...rest,
    },
    children
  );
}
