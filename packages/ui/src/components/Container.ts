import { createElement, cn } from '@solidum/core';

export interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  children?: any;
  className?: string;
  [key: string]: any;
}

export function Container(props: ContainerProps) {
  const {
    maxWidth = 'lg',
    padding = true,
    children,
    className,
    ...rest
  } = props;

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
