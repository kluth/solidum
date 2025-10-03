/**
 * Theme Switcher Component
 */

import { createElement } from '@sldm/core';
import { Button } from '@sldm/ui';

import { getTheme, setTheme } from './theme-store.js';

export function ThemeSwitcher() {
  const handleToggle = () => {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'default' ? 'chalk' : 'default';
    setTheme(newTheme);
  };

  // Access theme reactively during render
  const currentTheme = getTheme();
  const buttonText = currentTheme === 'chalk' ? '📐 Switch to Default' : '🎨 Switch to Chalkboard';
  const buttonVariant = currentTheme === 'chalk' ? 'success' : 'primary';

  return createElement(
    'div',
    {
      className: 'theme-switcher',
      style: {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '1000',
      },
    },
    createElement(Button, { variant: buttonVariant, size: 'sm', onClick: handleToggle }, buttonText)
  );
}
