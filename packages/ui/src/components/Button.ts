import { createElement } from '@solidum/core';
import { mergeProps, cn } from '@solidum/utils';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children?: any;
  className?: string;
  onClick?: (e: Event) => void;
  [key: string]: any;
}

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    children,
    className,
    ...rest
  } = props;

  const classes = cn(
    'solidum-button',
    `solidum-button--${variant}`,
    `solidum-button--${size}`,
    {
      'solidum-button--disabled': disabled,
    },
    className
  );

  return createElement(
    'button',
    mergeProps(
      {
        className: classes,
        disabled,
        type: 'button',
      },
      rest
    ),
    children
  );
}
