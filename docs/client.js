/* eslint-env browser */
/* global document, window */
import { mount } from '@sldm/core';
import { HomePage } from './pages/index.js';
import { ReactivityPage } from './pages/reactivity.js';
import { ComponentsPage } from './pages/components.js';
import { createRouter } from '@sldm/router';

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
  document.addEventListener('DOMContentLoaded', () => {
    mountApp();
  });
} else {
  mountApp();
}

// Listen for route changes
window.addEventListener('routechange', () => {
  mountApp();
});

function mountApp() {
  const root = document.getElementById('app');
  if (root) {
    root.innerHTML = '';
    try {
      const currentPage = router.getCurrentPage();
      const PageComponent = pageComponents[currentPage] || HomePage;
      mount(root, PageComponent);
    } catch (e) {
      console.error('Mount error:', e);
    }
  }
}
