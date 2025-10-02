import { createElement } from '@solidum/core';
import { cn } from '@solidum/utils';

export interface StackProps {
  direction?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  children?: unknown;
  className?: string;
  [key: string]: unknown;
}

export function Stack(props: StackProps) {
  const {
    direction = 'vertical',
    spacing = 'md',
    align = 'stretch',
    justify = 'start',
    wrap = false,
    children,
    className,
    ...rest
  } = props;

  const classes = cn(
    'solidum-stack',
    `solidum-stack--${direction}`,
    `solidum-stack--spacing-${spacing}`,
    `solidum-stack--align-${align}`,
    `solidum-stack--justify-${justify}`,
    {
      'solidum-stack--wrap': wrap,
    },
    className
  );

  return createElement('div', { className: classes, ...rest }, children);
}
