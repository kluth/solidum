import { mount } from '@sldm/core';
import { createRouter } from '@sldm/router';

import { ComponentsPage } from './pages/components.js';
import { HomePage } from './pages/index.js';
import { ReactivityPage } from './pages/reactivity.js';
import { setTheme, getTheme } from './pages/theme-store.js';

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
  document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    mountApp();
  });
} else {
  initializeTheme();
  mountApp();
}

// Listen for route changes
window.addEventListener('routechange', () => {
  mountApp();
});

// Listen for theme changes
window.addEventListener('themechange', () => {
  mountApp();
});

function mountApp() {
  const root = document.getElementById('app');
  if (root) {
    root.innerHTML = '';
    try {
      const currentPage = router.getCurrentPage();
      const PageComponent = pageComponents[currentPage as keyof typeof pageComponents] || HomePage;
      mount(root, PageComponent);
    } catch (e) {
      console.error('Mount error:', e);
    }
  }
}
