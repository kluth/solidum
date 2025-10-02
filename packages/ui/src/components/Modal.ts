import { createElement, cn } from '@solidum/core';
import { Button } from './Button.js';

export interface ModalProps {
  open: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
  backdrop?: boolean;
  animated?: boolean;
  children?: any;
  className?: string;
  onClose?: () => void;
  [key: string]: any;
}

export function Modal(props: ModalProps) {
  const {
    open,
    title,
    size = 'md',
    showClose = true,
    backdrop = true,
    animated = true,
    children,
    className,
    onClose,
    ...rest
  } = props;

  if (!open) return null;

  return createElement(
    'div',
    {
      className: cn('solidum-modal-overlay', {
        'solidum-modal-overlay--animated': animated,
      }),
      onClick: backdrop ? onClose : undefined,
    },
    createElement(
      'div',
      {
        className: cn(
          'solidum-modal',
          `solidum-modal--${size}`,
          {
            'solidum-modal--animated': animated,
          },
          className
        ),
        onClick: (e: Event) => e.stopPropagation(),
        ...rest,
      },
      // Header
      (title || showClose) && createElement(
        'div',
        { className: 'solidum-modal-header' },
        title && createElement('h3', { className: 'solidum-modal-title' }, title),
        showClose && createElement(
          Button,
          {
            variant: 'ghost',
            size: 'sm',
            className: 'solidum-modal-close',
            onClick: onClose,
          },
          '✕'
        )
      ),
      // Body
      createElement('div', { className: 'solidum-modal-body' }, children)
    )
  );
}
