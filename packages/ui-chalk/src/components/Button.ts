/**
 * Chalkboard Button Component
 */

import { createElement } from '@sldm/core';
import { cn } from '@sldm/utils';

export interface ChalkButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: (e: Event) => void;
  children?: unknown;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function ChalkButton(props: ChalkButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    onClick,
    children,
    className,
    type = 'button',
    ...rest
  } = props;

  const classes = cn(
    'chalk-button',
    `chalk-button--${variant}`,
    `chalk-button--${size}`,
    'chalk-text',
    {
      'chalk-button--disabled': disabled,
    },
    className
  );

  return createElement(
    'button',
    {
      className: classes,
      disabled,
      type,
      onClick: disabled ? undefined : onClick,
      ...rest,
    },
    children
  );
}
