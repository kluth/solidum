/**
 * Chalkboard Heading Component
 */

import { createElement } from '@sldm/core';
import { cn } from '@sldm/utils';

export interface ChalkHeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  underline?: boolean;
  color?: 'white' | 'yellow' | 'blue' | 'green' | 'red';
  children?: unknown;
  className?: string;
}

export function ChalkHeading(props: ChalkHeadingProps) {
  const { level = 1, underline = false, color = 'white', children, className, ...rest } = props;

  const classes = cn(
    'chalk-heading',
    `chalk-heading--${level}`,
    `chalk-text-${color}`,
    {
      'chalk-underline': underline,
    },
    className
  );

  const tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return createElement(
    tag,
    {
      className: classes,
      ...rest,
    },
    children
  );
}
