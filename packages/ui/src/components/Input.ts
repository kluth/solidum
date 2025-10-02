import { createElement, useState } from '@sldm/core';
import { cn } from '@sldm/utils';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  animated?: boolean;
  className?: string;
  // eslint-disable-next-line no-unused-vars
  onInput?: (value: string) => void;
  [key: string]: unknown;
}

export function Input(props: InputProps) {
  const {
    type = 'text',
    placeholder,
    value = '',
    disabled = false,
    error = false,
    helperText,
    leftIcon,
    rightIcon,
    animated = true,
    className,
    onInput,
    ...rest
  } = props;

  const focused = useState(false);

  const containerClasses = cn(
    'solidum-input-container',
    {
      'solidum-input-container--focused': focused(),
      'solidum-input-container--error': error,
      'solidum-input-container--disabled': disabled,
      'solidum-input-container--animated': animated,
    },
    className
  );

  return createElement(
    'div',
    { className: 'solidum-input-wrapper' },
    createElement(
      'div',
      { className: containerClasses },
      leftIcon &&
        createElement(
          'span',
          { className: 'solidum-input-icon solidum-input-icon--left' },
          leftIcon
        ),
      createElement('input', {
        type,
        placeholder,
        value,
        disabled,
        className: cn('solidum-input', {
          'solidum-input--has-left-icon': leftIcon,
          'solidum-input--has-right-icon': rightIcon,
        }),
        onFocus: () => focused(true),
        onBlur: () => focused(false),
        onInput: (e: Event) => onInput?.((e.target as HTMLInputElement).value),
        ...rest,
      }),
      rightIcon &&
        createElement(
          'span',
          { className: 'solidum-input-icon solidum-input-icon--right' },
          rightIcon
        )
    ),
    helperText &&
      createElement(
        'span',
        { className: cn('solidum-input-helper', { 'solidum-input-helper--error': error }) },
        helperText
      )
  );
}
