/* eslint-env browser */
import { mount } from '@solidum/core';
import { HomePage } from './pages/index.js';
import { ReactivityPage } from './pages/reactivity.js';
import { ComponentsPage } from './pages/components.js';
import { createRouter } from '@solidum/router';
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
}
else {
    console.log('⚡ DOM already ready, mounting immediately...');
    mountApp();
}
// Listen for route changes
window.addEventListener('routechange', event => {
    const customEvent = event;
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
            const currentPage = router.getCurrentPage();
            const PageComponent = pageComponents[currentPage] || HomePage;
            console.log('📄 Mounting page:', currentPage);
            mount(root, PageComponent);
            console.log('✨ Mount completed!');
        }
        catch (e) {
            console.error('❌ Mount error:', e);
        }
    }
}
