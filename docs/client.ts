import { mount } from '@sldm/core';
import { createRouter } from '@sldm/router';

import { AIDebuggerPage } from './pages/ai-debugger-page.js';
import { ComponentsPage } from './pages/components.js';
import { ContextPage } from './pages/context-page.js';
import { GettingStartedPage } from './pages/getting-started.js';
import { HomePage } from './pages/index.js';
import { ReactivityPage } from './pages/reactivity.js';
import { RouterPage } from './pages/router-page.js';
import { SSRPage } from './pages/ssr-page.js';
import { StoragePage } from './pages/storage-page.js';
import { StorePage } from './pages/store-page.js';
import { getTheme } from './pages/theme-store.js';
import { WebAIPage } from './pages/web-ai-page.js';

// Page components mapping
const pageComponents = {
  HomePage,
  GettingStartedPage,
  ReactivityPage,
  RouterPage,
  StorePage,
  ContextPage,
  StoragePage,
  SSRPage,
  WebAIPage,
  AIDebuggerPage,
  ComponentsPage,
};

// Detect base path for GitHub Pages deployment
const basePath = window.location.pathname.includes('/solidum') ? '/solidum' : '';

// Initialize router
const router = createRouter({
  routes: {
    '/': 'HomePage',
    '/getting-started': 'GettingStartedPage',
    '/reactivity': 'ReactivityPage',
    '/router': 'RouterPage',
    '/store': 'StorePage',
    '/context': 'ContextPage',
    '/storage': 'StoragePage',
    '/ssr': 'SSRPage',
    '/web-ai': 'WebAIPage',
    '/ai-debugger': 'AIDebuggerPage',
    '/components': 'ComponentsPage',
  },
  basePath,
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
      // eslint-disable-next-line no-console
      console.error('Mount error:', e);
    }
  }
}
