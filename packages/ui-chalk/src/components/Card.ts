/**
 * Chalkboard Card Component
 */

import { createElement } from '@sldm/core';
import { cn } from '@sldm/utils';

export interface ChalkCardProps {
  variant?: 'default' | 'yellow' | 'blue' | 'green';
  children?: unknown;
  className?: string;
}

export function ChalkCard(props: ChalkCardProps) {
  const { variant = 'default', children, className, ...rest } = props;

  const classes = cn(
    'chalk-card',
    'chalk-box',
    `chalk-card--${variant}`,
    {
      'chalk-text-yellow': variant === 'yellow',
      'chalk-text-blue': variant === 'blue',
      'chalk-text-green': variant === 'green',
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
