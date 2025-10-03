/**
 * Chalkboard Container Component
 */

import { createElement } from '@sldm/core';
import { cn } from '@sldm/utils';

export interface ChalkContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children?: unknown;
  className?: string;
}

export function ChalkContainer(props: ChalkContainerProps) {
  const { size = 'lg', children, className, ...rest } = props;

  const classes = cn(
    'chalk-container',
    `chalk-container--${size}`,
    'chalk-theme',
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
