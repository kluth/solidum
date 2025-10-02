import { createElement } from '@solidum/core';
import { cn } from '@solidum/utils';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'circle' | 'rounded' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy';
  bordered?: boolean;
  glow?: boolean;
  className?: string;
  [key: string]: unknown;
}

export function Avatar(props: AvatarProps) {
  const {
    src,
    alt = '',
    fallback,
    size = 'md',
    variant = 'circle',
    status,
    bordered = false,
    glow = false,
    className,
    ...rest
  } = props;

  const initials = fallback || alt.slice(0, 2).toUpperCase();

  return createElement(
    'div',
    {
      className: cn(
        'solidum-avatar',
        `solidum-avatar--${size}`,
        `solidum-avatar--${variant}`,
        {
          'solidum-avatar--bordered': bordered,
          'solidum-avatar--glow': glow,
        },
        className
      ),
      ...rest,
    },
    src
      ? createElement('img', {
          src,
          alt,
          className: 'solidum-avatar-image',
        })
      : createElement('span', { className: 'solidum-avatar-fallback' }, initials),
    status &&
      createElement('span', {
        className: cn('solidum-avatar-status', `solidum-avatar-status--${status}`),
      })
  );
}
