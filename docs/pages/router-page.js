import { createElement, atom } from '@sldm/core';
import { Container, Card, Stack, Badge } from '@sldm/ui';
import { Navigation } from '../components/Navigation.js';
export function RouterPage() {
  // Interactive demo state
  const currentRoute = atom(window.location.pathname);
  return createElement(
    'div',
    { className: 'router-page' },
    Navigation(),
    // Hero Section
    createElement(
      'section',
      {
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '6rem 0 4rem',
          textAlign: 'center',
        },
      },
      createElement(
        Container,
        { maxWidth: 'lg' },
        createElement(
          'h1',
          {
            style: {
              fontSize: '4rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            },
          },
          '🛣️ Router'
        ),
        createElement(
          'p',
          {
            style: {
              fontSize: '1.5rem',
              opacity: '0.9',
              marginBottom: '2rem',
            },
          },
          'Client-side routing with dynamic parameters and nested routes'
        ),
        createElement(
          Stack,
          { direction: 'horizontal', spacing: 'md', align: 'center' },
          createElement(Badge, { variant: 'secondary', size: 'lg' }, 'v0.3.0'),
          createElement(Badge, { variant: 'success', size: 'lg' }, 'Hash & History')
        )
      )
    ),
    // Features Section
    createElement(
      'section',
      {
        style: {
          padding: '4rem 0',
          background: '#f9fafb',
        },
      },
      createElement(
        Container,
        { maxWidth: 'xl' },
        createElement(
          'h2',
          {
            style: {
              fontSize: '2.5rem',
              marginBottom: '2rem',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            },
          },
          '✨ Features'
        ),
        createElement(
          'div',
          {
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            },
          },
          createElement(
            Card,
            { padding: 'lg', hoverable: true, bordered: true },
            createElement(
              'h3',
              {
                style: {
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#667eea',
                },
              },
              '🎯 Dynamic Routes'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280', marginBottom: '1rem' } },
              'Support for dynamic route parameters like /users/:id and wildcards'
            ),
            createElement(
              'pre',
              {
                style: {
                  background: '#1f2937',
                  color: '#f3f4f6',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                },
              },
              createElement(
                'code',
                null,
                `routes: {
  '/users/:id': 'UserPage',
  '/posts/:slug': 'PostPage',
  '/*': 'NotFoundPage'
}`
              )
            )
          ),
          createElement(
            Card,
            { padding: 'lg', hoverable: true, bordered: true },
            createElement(
              'h3',
              {
                style: {
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#667eea',
                },
              },
              '📍 Navigation'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280', marginBottom: '1rem' } },
              'Programmatic navigation and route matching'
            ),
            createElement(
              'pre',
              {
                style: {
                  background: '#1f2937',
                  color: '#f3f4f6',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                },
              },
              createElement(
                'code',
                null,
                `import { navigate } from '@sldm/router';

navigate('/users/123');
navigate('/about', { replace: true });`
              )
            )
          ),
          createElement(
            Card,
            { padding: 'lg', hoverable: true, bordered: true },
            createElement(
              'h3',
              {
                style: {
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#667eea',
                },
              },
              '🔄 Hash & History'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280', marginBottom: '1rem' } },
              'Support for both hash-based and history API routing'
            ),
            createElement(
              'pre',
              {
                style: {
                  background: '#1f2937',
                  color: '#f3f4f6',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                },
              },
              createElement(
                'code',
                null,
                `createRouter({
  mode: 'hash', // or 'history'
  routes: { ... }
})`
              )
            )
          ),
          createElement(
            Card,
            { padding: 'lg', hoverable: true, bordered: true },
            createElement(
              'h3',
              {
                style: {
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#667eea',
                },
              },
              '🎨 Base Path'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280', marginBottom: '1rem' } },
              'Deploy to subdirectories with basePath support'
            ),
            createElement(
              'pre',
              {
                style: {
                  background: '#1f2937',
                  color: '#f3f4f6',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                },
              },
              createElement(
                'code',
                null,
                `createRouter({
  basePath: '/my-app',
  routes: { ... }
})`
              )
            )
          )
        )
      )
    ),
    // Usage Example
    createElement(
      'section',
      {
        style: {
          padding: '4rem 0',
          background: 'white',
        },
      },
      createElement(
        Container,
        { maxWidth: 'xl' },
        createElement(
          'h2',
          {
            style: {
              fontSize: '2.5rem',
              marginBottom: '2rem',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            },
          },
          '📝 Usage Example'
        ),
        createElement(
          Card,
          { padding: 'lg', bordered: true },
          createElement(
            'pre',
            {
              style: {
                background: '#1f2937',
                color: '#f3f4f6',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                overflow: 'auto',
                fontSize: '0.9rem',
              },
            },
            createElement(
              'code',
              null,
              `import { createRouter, navigate } from '@sldm/router';
import { mount } from '@sldm/core';

// Define your page components
const HomePage = () => /* ... */;
const AboutPage = () => /* ... */;
const UserPage = () => /* ... */;

const pageComponents = {
  HomePage,
  AboutPage,
  UserPage,
};

// Create router
const router = createRouter({
  routes: {
    '/': 'HomePage',
    '/about': 'AboutPage',
    '/users/:id': 'UserPage',
  },
});

// Listen for route changes
window.addEventListener('routechange', () => {
  const currentPage = router.getCurrentPage();
  const PageComponent = pageComponents[currentPage];

  const root = document.getElementById('app');
  root.innerHTML = '';
  mount(root, PageComponent);
});

// Navigate programmatically
navigate('/users/123');

// Access route parameters
const params = router.getParams(); // { id: '123' }`
            )
          )
        )
      )
    ),
    // Footer
    createElement(
      'footer',
      {
        style: {
          background: '#1f2937',
          color: 'white',
          padding: '2rem 0',
          textAlign: 'center',
        },
      },
      createElement(
        Container,
        {},
        createElement('p', {}, 'Built with ❤️ using Solidum'),
        createElement(
          'p',
          { style: { marginTop: '0.5rem', opacity: '0.7' } },
          'MIT License © 2025'
        )
      )
    )
  );
}
