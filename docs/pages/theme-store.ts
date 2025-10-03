/**
 * Theme management store
 */

import { atom } from '@sldm/core';

export type Theme = 'default' | 'chalk';

const isBrowser = typeof window !== 'undefined';
const themeAtom = atom<Theme>(
  isBrowser ? ((localStorage.getItem('solidum-theme') as Theme) || 'default') : 'default'
);

export function getTheme(): Theme {
  return themeAtom();
}

export function setTheme(theme: Theme): void {
  if (!isBrowser) return;

  themeAtom(theme);
  localStorage.setItem('solidum-theme', theme);

  // Update stylesheet
  const existingLink = document.getElementById('theme-stylesheet') as HTMLLinkElement;
  if (existingLink) {
    existingLink.href = theme === 'chalk' ? '/chalk-styles.css' : '/styles.css';
  }

  // Update body class
  document.body.classList.remove('chalk-theme', 'default-theme');
  document.body.classList.add(`${theme}-theme`);

  // Trigger re-render
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

export function onThemeChange(callback: (theme: Theme) => void): () => void {
  if (!isBrowser) return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{ theme: Theme }>;
    callback(customEvent.detail.theme);
  };

  window.addEventListener('themechange', handler);

  // Return cleanup function
  return () => window.removeEventListener('themechange', handler);
}
