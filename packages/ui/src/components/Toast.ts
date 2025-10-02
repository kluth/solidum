import { createElement, cn, useState } from '@solidum/core';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  animated?: boolean;
  onClose?: () => void;
}

export function Toast(props: ToastProps) {
  const {
    message,
    type = 'info',
    duration = 3000,
    position = 'top-right',
    animated = true,
    onClose,
  } = props;

  const visible = useState(true);

  // Auto-hide after duration
  if (duration > 0) {
    setTimeout(() => {
      visible(false);
      setTimeout(() => onClose?.(), 300); // Wait for animation
    }, duration);
  }

  if (!visible()) return null;

  return createElement(
    'div',
    {
      className: cn(
        'solidum-toast',
        `solidum-toast--${type}`,
        `solidum-toast--${position}`,
        {
          'solidum-toast--animated': animated,
          'solidum-toast--visible': visible(),
        }
      ),
    },
    createElement('span', { className: 'solidum-toast-icon' }, getIcon(type)),
    createElement('span', { className: 'solidum-toast-message' }, message),
    createElement(
      'button',
      {
        className: 'solidum-toast-close',
        onClick: () => {
          visible(false);
          setTimeout(() => onClose?.(), 300);
        },
      },
      '✕'
    )
  );
}

function getIcon(type: string): string {
  switch (type) {
    case 'success': return '✓';
    case 'error': return '✕';
    case 'warning': return '⚠';
    case 'info': return 'ℹ';
    default: return 'ℹ';
  }
}
