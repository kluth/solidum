import { mount } from '@sldm/core';
import { createRouter } from '@sldm/router';

import { ComponentsPage } from './pages/components.js';
import { HomePage } from './pages/index.js';
import { ReactivityPage } from './pages/reactivity.js';
import { setTheme, getTheme } from './pages/theme-store.js';

// eslint-disable-next-line no-console
console.log('🚀 Solidum client.js loaded!', 'readyState:', document.readyState);

// Page components mapping
const pageComponents = {
  HomePage,
  ReactivityPage,
  ComponentsPage,
};

// Initialize router
const router = createRouter({
  routes: {
    '/': 'HomePage',
    '/reactivity': 'ReactivityPage',
    '/components': 'ComponentsPage',
  },
});

// Initialize theme on load
function initializeTheme() {
  const theme = getTheme();
  const link = document.createElement('link');
  link.id = 'theme-stylesheet';
  link.rel = 'stylesheet';
  link.href = theme === 'chalk' ? './chalk-styles.css' : './styles.css';
  document.head.appendChild(link);

  document.body.classList.add(`${theme}-theme`);
}

// Mount the app when DOM is ready
if (document.readyState === 'loading') {
  // eslint-disable-next-line no-console
  console.log('📌 Adding DOMContentLoaded listener...');
  document.addEventListener('DOMContentLoaded', () => {
    // eslint-disable-next-line no-console
    console.log('✅ DOMContentLoaded fired!');
    initializeTheme();
    mountApp();
  });
} else {
  // eslint-disable-next-line no-console
  console.log('⚡ DOM already ready, mounting immediately...');
  initializeTheme();
  mountApp();
}

// Listen for route changes
window.addEventListener('routechange', event => {
  const customEvent = event as CustomEvent<{ path: string; component: string }>;
  // eslint-disable-next-line no-console
  console.log('🔄 Route changed to:', customEvent.detail.path);
  mountApp();
});

// Listen for theme changes
window.addEventListener('themechange', () => {
  // eslint-disable-next-line no-console
  console.log('🎨 Theme changed, remounting...');
  mountApp();
});

function mountApp() {
  const root = document.getElementById('app');
  // eslint-disable-next-line no-console
  console.log('📍 Root element:', root);
  if (root) {
    // eslint-disable-next-line no-console
    console.log('🧹 Clearing SSR content...');
    root.innerHTML = '';
    // eslint-disable-next-line no-console
    console.log('🎯 Calling mount...');
    try {
      const currentPath = router.getCurrentPath();
      const currentPage = router.getCurrentPage();
      // eslint-disable-next-line no-console
      console.log('🛣️ Current path:', currentPath);
      // eslint-disable-next-line no-console
      console.log('📄 Current page:', currentPage);
      // eslint-disable-next-line no-console
      console.log('🗺️ Available routes:', Object.keys(pageComponents));

      const PageComponent = pageComponents[currentPage as keyof typeof pageComponents] || HomePage;
      // eslint-disable-next-line no-console
      console.log('📄 Mounting page:', currentPage, 'Component:', PageComponent.name);

      mount(root, PageComponent);
      // eslint-disable-next-line no-console
      console.log('✨ Mount completed!');
    } catch (e) {
      console.error('❌ Mount error:', e);
    }
  }
}
