import { mount } from '@solidum/core';
import { HomePage } from './pages/index.js';

console.log('🚀 Solidum client.js loaded!', 'readyState:', document.readyState);

// Mount the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('app');
    if (root) {
      // Clear SSR content and mount interactive version
      root.innerHTML = '';
      mount(root, HomePage);
    }
  });
} else {
  const root = document.getElementById('app');
  if (root) {
    root.innerHTML = '';
    mount(root, HomePage);
  }
}
