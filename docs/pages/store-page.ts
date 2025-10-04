import { createElement, atom, computed, effect } from '@sldm/core';
import { navigate } from '@sldm/router';
import { Container, Card, Button, Stack, Badge, GlassCard } from '@sldm/ui';
import { Navigation } from '../components/Navigation.js';

export function StorePage() {
  // Live demo store
  const count = atom(0);
  const doubled = computed(() => count() * 2);

  return createElement(
    'div',
    { className: 'store-page' },

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
          '📦 Store'
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
          'Global state management built on fine-grained reactivity'
        ),
        createElement(Badge, { variant: 'secondary', size: 'lg' }, 'Reactive')
      )
    ),

    // Live Interactive Demo
    createElement(
      'section',
      {
        style: {
          padding: '4rem 0',
          background: '#1a1a2e',
          color: 'white',
        },
      },
      createElement(
        Container,
        { maxWidth: 'lg' },
        createElement(
          'h2',
          {
            style: {
              fontSize: '2.5rem',
              marginBottom: '2rem',
              textAlign: 'center',
            },
          },
          '🎮 Live Demo'
        ),

        createElement(
          GlassCard,
          {
            blur: 'lg',
            tint: 'dark',
            glow: true,
            padding: 'xl',
          },
          createElement(
            'div',
            { style: { textAlign: 'center' } },
            createElement(
              'div',
              {
                style: {
                  fontSize: '3rem',
                  marginBottom: '1rem',
                },
              },
              'Count: ',
              count
            ),
            createElement(
              'div',
              {
                style: {
                  fontSize: '2rem',
                  marginBottom: '2rem',
                  opacity: '0.8',
                },
              },
              'Doubled: ',
              doubled
            ),
            createElement(
              Stack,
              { direction: 'horizontal', spacing: 'md', align: 'center' },
              createElement(
                Button,
                {
                  variant: 'primary',
                  size: 'lg',
                  onClick: () => count(count() + 1),
                },
                '+ Increment'
              ),
              createElement(
                Button,
                {
                  variant: 'danger',
                  size: 'lg',
                  onClick: () => count(count() - 1),
                },
                '- Decrement'
              ),
              createElement(
                Button,
                {
                  variant: 'secondary',
                  size: 'lg',
                  onClick: () => count(0),
                },
                '↻ Reset'
              )
            )
          )
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
              '⚡ Fine-Grained Updates'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280', marginBottom: '1rem' } },
              'Only components that use changed data are re-rendered. No virtual DOM diffing needed.'
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
                `const store = createStore({
  count: 0,
  user: { name: 'Alice' }
});`
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
              '🎯 Simple API'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280', marginBottom: '1rem' } },
              'Read with store.count, update with store.count = 10. No reducers or actions needed.'
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
                `// Read
console.log(store.count);

// Update
store.count = 10;
store.user.name = 'Bob';`
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
              '🔄 Reactive Computed'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280', marginBottom: '1rem' } },
              'Derive values that automatically update when dependencies change.'
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
                `const doubled = computed(() =>
  store.count * 2
);`
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
              '🔍 Deep Reactivity'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280', marginBottom: '1rem' } },
              'Nested objects and arrays are automatically reactive.'
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
                `store.todos.push({
  text: 'Learn Solidum',
  done: false
});`
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
              `import { createStore } from '@sldm/store';
import { createElement, mount } from '@sldm/core';

// Create store
const store = createStore({
  count: 0,
  todos: [],
  user: { name: 'Alice', email: 'alice@example.com' }
});

// Component using store
function Counter() {
  return createElement('div', {},
    createElement('h2', {}, 'Count: ', store.count),
    createElement('button', {
      onClick: () => store.count++
    }, 'Increment')
  );
}

// Component automatically re-renders when store.count changes
mount(document.body, Counter);`
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
