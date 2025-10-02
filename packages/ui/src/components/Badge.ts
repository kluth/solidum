import { createElement } from '@solidum/core';
import { cn } from '@solidum/utils';

export interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  pulse?: boolean;
  glow?: boolean;
  children?: any;
  className?: string;
  [key: string]: any;
}

export function Badge(props: BadgeProps) {
  const {
    variant = 'primary',
    size = 'md',
    dot = false,
    pulse = false,
    glow = false,
    children,
    className,
    ...rest
  } = props;

  return createElement(
    'span',
    {
      className: cn(
        'solidum-badge',
        `solidum-badge--${variant}`,
        `solidum-badge--${size}`,
        {
          'solidum-badge--dot': dot,
          'solidum-badge--pulse': pulse,
          'solidum-badge--glow': glow,
        },
        className
      ),
      ...rest,
    },
    children
  );
}
