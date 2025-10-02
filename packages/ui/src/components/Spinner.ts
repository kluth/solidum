import { createElement } from '@sldm/core';
import { cn } from '@sldm/utils';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'bars' | 'ring';
  color?: 'primary' | 'secondary' | 'white';
  label?: string;
  className?: string;
}

export function Spinner(props: SpinnerProps) {
  const { size = 'md', variant = 'default', color = 'primary', label, className } = props;

  return createElement(
    'div',
    { className: cn('solidum-spinner-wrapper', className) },
    createElement('div', {
      className: cn(
        'solidum-spinner',
        `solidum-spinner--${size}`,
        `solidum-spinner--${variant}`,
        `solidum-spinner--${color}`
      ),
      role: 'status',
      'aria-label': label || 'Loading',
    }),
    label && createElement('span', { className: 'solidum-spinner-label' }, label)
  );
}
