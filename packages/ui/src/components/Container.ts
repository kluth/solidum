import { createElement } from '@solidum/core';
import { cn } from '@solidum/utils';

export interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  children?: unknown;
  className?: string;
  [key: string]: unknown;
}

export function Container(props: ContainerProps) {
  const { maxWidth = 'lg', padding = true, children, className, ...rest } = props;

  const classes = cn(
    'solidum-container',
    `solidum-container--${maxWidth}`,
    {
      'solidum-container--padding': padding,
    },
    className
  );

  return createElement('div', { className: classes, ...rest }, children);
}
