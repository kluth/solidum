import { createElement } from '@solidum/core';
import { cn } from '@solidum/utils';

export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'striped' | 'animated';
  showLabel?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error';
  glow?: boolean;
  className?: string;
}

export function Progress(props: ProgressProps) {
  const {
    value,
    max = 100,
    size = 'md',
    variant = 'default',
    showLabel = false,
    color = 'primary',
    glow = false,
    className,
  } = props;

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return createElement(
    'div',
    { className: cn('solidum-progress-wrapper', className) },
    createElement(
      'div',
      {
        className: cn(
          'solidum-progress',
          `solidum-progress--${size}`,
          `solidum-progress--${variant}`,
          `solidum-progress--${color}`,
          {
            'solidum-progress--glow': glow,
          }
        ),
        role: 'progressbar',
        'aria-valuenow': value,
        'aria-valuemin': 0,
        'aria-valuemax': max,
      },
      createElement('div', {
        className: 'solidum-progress-bar',
        style: { width: `${percentage}%` },
      })
    ),
    showLabel &&
      createElement('span', { className: 'solidum-progress-label' }, `${Math.round(percentage)}%`)
  );
}
