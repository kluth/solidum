/**
 * Theme Switcher Component
 */
import { createElement } from '@sldm/core';
import { Button } from '@sldm/ui';
import { getTheme, setTheme } from './theme-store.js';
export function ThemeSwitcher() {
    const currentTheme = getTheme();
    const handleToggle = () => {
        const newTheme = currentTheme === 'default' ? 'chalk' : 'default';
        setTheme(newTheme);
    };
    return createElement('div', {
        className: 'theme-switcher',
        style: {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '1000',
        },
    }, createElement(Button, {
        variant: currentTheme === 'chalk' ? 'success' : 'primary',
        size: 'sm',
        onClick: handleToggle,
        children: currentTheme === 'chalk' ? '📐 Switch to Default' : '🎨 Switch to Chalkboard',
    }));
}
