import { webml, renderTemplate } from '@sldm/core';
import { cn } from '@sldm/utils';

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

  const template = webml`
    <button
      class="${classes}"
      ${disabled ? 'disabled' : ''}
      type="button"
      ${onClick ? `onclick="${onClick}"` : ''}
      ${Object.entries(rest).map(([key, value]) => `${key}="${value}"`).join(' ')}
    >
      ${children}
    </button>
  `;

  return renderTemplate(template);
}
