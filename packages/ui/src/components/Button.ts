import { renderTemplate } from '@sldm/core';
import { cn } from '@sldm/utils';
import template from './Button.webml.js';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children?: unknown;
  className?: string;
  onClick?: (e: Event) => void;
  [key: string]: unknown;
}

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    children,
    className,
    onClick,
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

  // Prepare template props
  const restAttrs = Object.entries(rest)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  const templateProps = {
    classes,
    disabled,
    onClick,
    restAttrs,
    children
  };

  return renderTemplate(template(templateProps));
}
