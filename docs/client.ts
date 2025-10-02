import { mount } from '@solidum/core';
import { HomePage } from './pages/index.js';
import { ReactivityPage } from './pages/reactivity.js';
import { ComponentsPage } from './pages/components.js';
import { createRouter, navigate } from '@solidum/router';

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

// Mount the app when DOM is ready
if (document.readyState === 'loading') {
  console.log('📌 Adding DOMContentLoaded listener...');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOMContentLoaded fired!');
    mountApp();
  });
} else {
  console.log('⚡ DOM already ready, mounting immediately...');
  mountApp();
}

// Listen for route changes
window.addEventListener('routechange', event => {
  const customEvent = event as CustomEvent<{ path: string; component: string }>;
  console.log('🔄 Route changed to:', customEvent.detail.path);
  mountApp();
});

function mountApp() {
  const root = document.getElementById('app');
  console.log('📍 Root element:', root);
  if (root) {
    console.log('🧹 Clearing SSR content...');
    root.innerHTML = '';
    console.log('🎯 Calling mount...');
    try {
      const currentPath = router.getCurrentPath();
      const currentPage = router.getCurrentPage();
      console.log('🛣️ Current path:', currentPath);
      console.log('📄 Current page:', currentPage);
      console.log('🗺️ Available routes:', Object.keys(pageComponents));
      
      const PageComponent = pageComponents[currentPage as keyof typeof pageComponents] || HomePage;
      console.log('📄 Mounting page:', currentPage, 'Component:', PageComponent.name);

      mount(root, PageComponent);
      console.log('✨ Mount completed!');
    } catch (e) {
      console.error('❌ Mount error:', e);
    }
  }
}
