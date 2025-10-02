import { createElement, useState } from '@solidum/core';
import { cn } from '@solidum/utils';

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  disabled?: boolean;
  showValue?: boolean;
  showTicks?: boolean;
  gradient?: boolean;
  animated?: boolean;
  className?: string;
  onChange?: (value: number) => void;
  [key: string]: any;
}

export function Slider(props: SliderProps) {
  const {
    min = 0,
    max = 100,
    step = 1,
    value = 50,
    disabled = false,
    showValue = true,
    showTicks = false,
    gradient = false,
    animated = true,
    className,
    onChange,
    ...rest
  } = props;

  const currentValue = useState(value);

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const newValue = parseFloat(target.value);
    currentValue(newValue);
    onChange?.(newValue);
  };

  const percentage = ((currentValue() - min) / (max - min)) * 100;

  return createElement(
    'div',
    { className: cn('solidum-slider-wrapper', className) },
    createElement(
      'div',
      { className: 'solidum-slider-container' },
      createElement('input', {
        type: 'range',
        min,
        max,
        step,
        value: currentValue(),
        disabled,
        className: cn('solidum-slider', {
          'solidum-slider--gradient': gradient,
          'solidum-slider--animated': animated,
          'solidum-slider--disabled': disabled,
        }),
        onInput: handleInput,
        style: {
          background: gradient
            ? `linear-gradient(to right, #667eea 0%, #764ba2 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
            : undefined,
        },
        ...rest,
      }),
      showTicks && createElement(
        'div',
        { className: 'solidum-slider-ticks' },
        ...Array.from({ length: Math.floor((max - min) / step) + 1 }, () =>
          createElement('div', { className: 'solidum-slider-tick' })
        )
      )
    ),
    showValue && createElement(
      'div',
      { className: 'solidum-slider-value' },
      currentValue().toFixed(step < 1 ? 1 : 0)
    )
  );
}
