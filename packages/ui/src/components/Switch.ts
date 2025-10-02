import { createElement, cn, useState } from '@solidum/core';

export interface SwitchProps {
  checked?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
  onChange?: (checked: boolean) => void;
  [key: string]: any;
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
        className: cn(
          'solidum-switch',
          `solidum-switch--${size}`,
          {
            'solidum-switch--checked': isChecked(),
            'solidum-switch--disabled': disabled,
          }
        ),
        disabled,
        onClick: handleToggle,
        ...rest,
      },
      createElement('span', { className: 'solidum-switch-thumb' })
    ),
    label && createElement('span', { className: 'solidum-switch-label' }, label)
  );
}
