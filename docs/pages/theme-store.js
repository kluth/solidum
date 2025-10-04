/**
 * Theme management store
 */
import { atom } from '@sldm/core';
const isBrowser = typeof window !== 'undefined';
const themeAtom = atom(isBrowser ? localStorage.getItem('solidum-theme') || 'default' : 'default');
export function getTheme() {
  return themeAtom();
}
export function setTheme(theme) {
  if (!isBrowser) return;
  themeAtom(theme);
  localStorage.setItem('solidum-theme', theme);
  // Update stylesheet
  const existingLink = document.getElementById('theme-stylesheet');
  if (existingLink) {
    existingLink.href = theme === 'chalk' ? './chalk-styles.css' : './styles.css';
  }
  // Update body class
  document.body.classList.remove('chalk-theme', 'default-theme');
  document.body.classList.add(`${theme}-theme`);
  // Trigger re-render
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}
export function onThemeChange(callback) {
  if (!isBrowser) return () => {};
  const handler = event => {
    const customEvent = event;
    callback(customEvent.detail.theme);
  };
  window.addEventListener('themechange', handler);
  // Return cleanup function
  return () => window.removeEventListener('themechange', handler);
}
