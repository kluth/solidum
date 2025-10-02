import { createElement, cn } from '@solidum/core';

export interface LinkProps {
  href: string;
  external?: boolean;
  underline?: boolean;
  variant?: 'default' | 'primary' | 'muted';
  children?: any;
  className?: string;
  [key: string]: any;
}

export function Link(props: LinkProps) {
  const {
    href,
    external = false,
    underline = true,
    variant = 'default',
    children,
    className,
    ...rest
  } = props;

  const classes = cn(
    'solidum-link',
    `solidum-link--${variant}`,
    {
      'solidum-link--underline': underline,
      'solidum-link--external': external,
    },
    className
  );

  const extraProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return createElement(
    'a',
    {
      href,
      className: classes,
      ...extraProps,
      ...rest,
    },
    children
  );
}
