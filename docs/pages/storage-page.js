import { createElement } from '@sldm/core';
import { Container, Card, Badge, Tabs } from '@sldm/ui';
import { Navigation } from '../components/Navigation.js';
export function StoragePage() {
  return createElement(
    'div',
    { className: 'storage-page' },
    Navigation(),
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
          '💾 Storage'
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
          'Persist data with LocalStorage, IndexedDB, and more'
        ),
        createElement(Badge, { variant: 'secondary', size: 'lg' }, 'Reactive')
      )
    ),
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
          '📦 Storage Types'
        ),
        createElement(Tabs, {
          tabs: [
            {
              id: 'localstorage',
              label: 'LocalStorage',
              icon: '📝',
              content: createElement(
                Card,
                { padding: 'lg' },
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
                    `import { createLocalStorage } from '@sldm/storage';

const storage = createLocalStorage('my-app');

// Set values
await storage.set('user', { name: 'Alice', age: 30 });

// Get values
const user = await storage.get('user');

// Remove values
await storage.remove('user');

// Clear all
await storage.clear();`
                  )
                )
              ),
            },
            {
              id: 'indexeddb',
              label: 'IndexedDB',
              icon: '🗄️',
              content: createElement(
                Card,
                { padding: 'lg' },
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
                    `import { createIndexedDB } from '@sldm/storage';

const storage = createIndexedDB('my-app', 'users');

// Store complex objects
await storage.set('user-123', {
  id: 123,
  name: 'Alice',
  preferences: { theme: 'dark' },
  createdAt: new Date(),
});

// Query by key
const user = await storage.get('user-123');`
                  )
                )
              ),
            },
          ],
          variant: 'pills',
          animated: true,
        })
      )
    ),
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
      createElement(Container, {}, createElement('p', {}, 'Built with ❤️ using Solidum'))
    )
  );
}
