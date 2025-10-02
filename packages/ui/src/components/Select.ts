import { createElement, cn, useState } from '@solidum/core';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  [key: string]: any;
}

export function Select(props: SelectProps) {
  const {
    options,
    value,
    placeholder = 'Select an option',
    disabled = false,
    error = false,
    className,
    onChange,
    ...rest
  } = props;

  const isOpen = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  return createElement(
    'div',
    { className: cn('solidum-select-wrapper', className) },
    createElement(
      'button',
      {
        type: 'button',
        className: cn('solidum-select-trigger', {
          'solidum-select-trigger--open': isOpen(),
          'solidum-select-trigger--error': error,
          'solidum-select-trigger--disabled': disabled,
        }),
        disabled,
        onClick: () => !disabled && isOpen(!isOpen()),
        ...rest,
      },
      createElement('span', {}, selectedOption?.label || placeholder),
      createElement('span', { className: 'solidum-select-arrow' }, isOpen() ? '▲' : '▼')
    ),
    isOpen() && createElement(
      'div',
      { className: 'solidum-select-dropdown' },
      ...options.map(option =>
        createElement(
          'button',
          {
            type: 'button',
            className: cn('solidum-select-option', {
              'solidum-select-option--selected': option.value === value,
              'solidum-select-option--disabled': option.disabled,
            }),
            disabled: option.disabled,
            onClick: () => {
              if (!option.disabled) {
                onChange?.(option.value);
                isOpen(false);
              }
            },
          },
          option.label
        )
      )
    )
  );
}
