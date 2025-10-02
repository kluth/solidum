import { mount } from '@solidum/core';
import { HomePage } from './pages/index.js';

console.log('🚀 Solidum client.js loaded!', 'readyState:', document.readyState);

// Mount the app when DOM is ready
if (document.readyState === 'loading') {
  console.log('📌 Adding DOMContentLoaded listener...');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOMContentLoaded fired!');
    const root = document.getElementById('app');
    console.log('📍 Root element:', root);
    if (root) {
      console.log('🧹 Clearing SSR content...');
      root.innerHTML = '';
      console.log('🎯 Calling mount...');
      try {
        mount(root, HomePage);
        console.log('✨ Mount completed!');
      } catch (e) {
        console.error('❌ Mount error:', e);
      }
    }
  });
} else {
  console.log('⚡ DOM already ready, mounting immediately...');
  const root = document.getElementById('app');
  console.log('📍 Root element:', root);
  if (root) {
    console.log('🧹 Clearing SSR content...');
    root.innerHTML = '';
    console.log('🎯 Calling mount...');
    try {
      mount(root, HomePage);
      console.log('✨ Mount completed!');
    } catch (e) {
      console.error('❌ Mount error:', e);
    }
  }
}
