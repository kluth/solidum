import { renderTemplate } from '@sldm/core';
import { cn } from '@sldm/utils';
import template from './Card.webml.js';

export interface CardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
  hoverable?: boolean;
  children?: unknown;
  className?: string;
  [key: string]: unknown;
}

export function Card(props: CardProps) {
  const {
    padding = 'md',
    bordered = true,
    hoverable = false,
    children,
    className,
    ...rest
  } = props;

  const classes = cn(
    'solidum-card',
    `solidum-card--padding-${padding}`,
    {
      'solidum-card--bordered': bordered,
      'solidum-card--hoverable': hoverable,
    },
    className
  );

  const restAttrs = Object.entries(rest)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  const templateProps = {
    classes,
    restAttrs,
    children
  };

  return renderTemplate(template(templateProps));
}
