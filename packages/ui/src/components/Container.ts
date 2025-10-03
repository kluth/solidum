import { renderTemplate } from '@sldm/core';
import { cn } from '@sldm/utils';
import template from './Container.webml.js';

export interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  children?: unknown;
  className?: string;
  [key: string]: unknown;
}

export function Container(props: ContainerProps) {
  const { maxWidth = 'lg', padding = true, children, className, ...rest } = props;

  const classes = cn(
    'solidum-container',
    `solidum-container--${maxWidth}`,
    {
      'solidum-container--padding': padding,
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
