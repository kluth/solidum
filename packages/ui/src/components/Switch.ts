import { createElement, useState } from '@solidum/core';
import { cn } from '@solidum/utils';

export interface SwitchProps {
  checked?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (checked: boolean) => void;
  [key: string]: unknown;
}

export function Switch(props: SwitchProps) {
  const {
    checked = false,
    disabled = false,
    size = 'md',
    label,
    className,
    onChange,
    ...rest
  } = props;

  const isChecked = useState(checked);

  const handleToggle = () => {
    if (!disabled) {
      const newValue = !isChecked();
      isChecked(newValue);
      onChange?.(newValue);
    }
  };

  return createElement(
    'label',
    { className: cn('solidum-switch-wrapper', className) },
    createElement(
      'button',
      {
        type: 'button',
        role: 'switch',
        'aria-checked': isChecked(),
        className: cn('solidum-switch', `solidum-switch--${size}`, {
          'solidum-switch--checked': isChecked(),
          'solidum-switch--disabled': disabled,
        }),
        disabled,
        onClick: handleToggle,
        ...rest,
      },
      createElement('span', { className: 'solidum-switch-thumb' })
    ),
    label && createElement('span', { className: 'solidum-switch-label' }, label)
  );
}
