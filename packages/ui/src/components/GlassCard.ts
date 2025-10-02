import { createElement } from '@solidum/core';
import { cn } from '@solidum/utils';

export interface GlassCardProps {
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  tint?: 'light' | 'dark' | 'primary' | 'gradient';
  bordered?: boolean;
  hoverable?: boolean;
  glow?: boolean;
  animated?: boolean;
  children?: unknown;
  className?: string;
  [key: string]: unknown;
}

export function GlassCard(props: GlassCardProps) {
  const {
    blur = 'md',
    tint = 'light',
    bordered = true,
    hoverable = true,
    glow = false,
    animated = true,
    children,
    className,
    ...rest
  } = props;

  return createElement(
    'div',
    {
      className: cn(
        'solidum-glass-card',
        `solidum-glass-card--blur-${blur}`,
        `solidum-glass-card--tint-${tint}`,
        {
          'solidum-glass-card--bordered': bordered,
          'solidum-glass-card--hoverable': hoverable,
          'solidum-glass-card--glow': glow,
          'solidum-glass-card--animated': animated,
        },
        className
      ),
      ...rest,
    },
    children
  );
}
