import { createElement, atom, computed, effect } from '@sldm/core';
import { navigate } from '@sldm/router';
import { Container, Card, Button, Stack, Badge, Tabs, CodeBlock } from '@sldm/ui';
import type { ComponentFunction } from '@sldm/core';
import { Navigation } from '../components/Navigation.js';

export function GettingStartedPage() {
  return createElement(
    'div',
    { className: 'getting-started-page' },

    // Navigation
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
          '🚀 Getting Started'
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
          'Build reactive applications with Solidum in minutes'
        )
      )
    ),

    // Installation Section
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
          '📦 Installation'
        ),

        createElement(Tabs as unknown as ComponentFunction, {
          tabs: [
            {
              id: 'core',
              label: 'Core Package',
              icon: '⚡',
              content: createElement(
                Card,
                { padding: 'lg' },
                createElement(
                  'h3',
                  { style: { marginBottom: '1rem', fontSize: '1.5rem' } },
                  'Install Core Framework'
                ),
                createElement(
                  'pre',
                  {
                    style: {
                      background: '#1f2937',
                      color: '#f3f4f6',
                      padding: '1.5rem',
                      borderRadius: '0.5rem',
                      overflow: 'auto',
                      fontSize: '1rem',
                      marginBottom: '1rem',
                    },
                  },
                  createElement('code', null, 'npm install @sldm/core')
                ),
                createElement(
                  'p',
                  { style: { color: '#6b7280', marginBottom: '1rem' } },
                  'The core package includes fine-grained reactivity primitives: atom(), computed(), effect(), and the component system.'
                )
              ),
            },
            {
              id: 'ui',
              label: 'UI Components',
              icon: '🎨',
              content: createElement(
                Card,
                { padding: 'lg' },
                createElement(
                  'h3',
                  { style: { marginBottom: '1rem', fontSize: '1.5rem' } },
                  'Install UI Libraries'
                ),
                createElement(
                  'pre',
                  {
                    style: {
                      background: '#1f2937',
                      color: '#f3f4f6',
                      padding: '1.5rem',
                      borderRadius: '0.5rem',
                      overflow: 'auto',
                      fontSize: '1rem',
                      marginBottom: '1rem',
                    },
                  },
                  createElement(
                    'code',
                    null,
                    '# Glassmorphism UI\nnpm install @sldm/ui\n\n# Chalk/Hand-drawn UI\nnpm install @sldm/ui-chalk'
                  )
                ),
                createElement(
                  'p',
                  { style: { color: '#6b7280' } },
                  '20+ production-ready components with glassmorphism effects and chalk/hand-drawn styles.'
                )
              ),
            },
            {
              id: 'full',
              label: 'Full Stack',
              icon: '🔥',
              content: createElement(
                Card,
                { padding: 'lg' },
                createElement(
                  'h3',
                  { style: { marginBottom: '1rem', fontSize: '1.5rem' } },
                  'Install All Packages'
                ),
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
                      marginBottom: '1rem',
                    },
                  },
                  createElement(
                    'code',
                    null,
                    `npm install @sldm/core @sldm/ui @sldm/router \\
  @sldm/store @sldm/context @sldm/storage \\
  @sldm/ssr @sldm/web-ai @sldm/debug \\
  @sldm/testing @sldm/integrations`
                  )
                ),
                createElement(
                  'p',
                  { style: { color: '#6b7280' } },
                  'Everything you need for modern web development: reactivity, UI, routing, state management, SSR, AI, debugging, and more!'
                )
              ),
            },
          ],
          variant: 'pills',
          animated: true,
        })
      )
    ),

    // Quick Start Section
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
          '⚡ Quick Start'
        ),

        createElement(
          'div',
          {
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2rem',
            },
          },

          // Step 1: Reactivity
          createElement(
            Card,
            { padding: 'lg', bordered: true, hoverable: true },
            createElement(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                },
              },
              createElement(
                'h3',
                { style: { fontSize: '1.5rem', color: '#667eea', margin: 0 } },
                '1️⃣ Reactivity'
              ),
              createElement(Badge, { variant: 'gradient', size: 'sm' }, 'Core')
            ),
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
                `import { atom, computed, effect } from '@sldm/core';

const count = atom(0);
const doubled = computed(() => count() * 2);

effect(() => {
  console.log(\`\${count()} * 2 = \${doubled()}\`);
});

count(5); // Logs: 5 * 2 = 10`
              )
            )
          ),

          // Step 2: Components
          createElement(
            Card,
            { padding: 'lg', bordered: true, hoverable: true },
            createElement(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                },
              },
              createElement(
                'h3',
                { style: { fontSize: '1.5rem', color: '#667eea', margin: 0 } },
                '2️⃣ Components'
              ),
              createElement(Badge, { variant: 'success', size: 'sm' }, 'UI')
            ),
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
                `import { mount, createElement, atom } from '@sldm/core';
import { Button, Card } from '@sldm/ui';

function Counter() {
  const count = atom(0);

  return createElement(Card, { padding: 'lg' },
    createElement('h2', {}, 'Count: ', count),
    createElement(Button, {
      onClick: () => count(count() + 1)
    }, 'Increment')
  );
}

mount(document.body, Counter);`
              )
            )
          ),

          // Step 3: Routing
          createElement(
            Card,
            { padding: 'lg', bordered: true, hoverable: true },
            createElement(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                },
              },
              createElement(
                'h3',
                { style: { fontSize: '1.5rem', color: '#667eea', margin: 0 } },
                '3️⃣ Routing'
              ),
              createElement(Badge, { variant: 'info', size: 'sm' }, 'Router')
            ),
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

const router = createRouter({
  routes: {
    '/': 'HomePage',
    '/about': 'AboutPage',
    '/users/:id': 'UserPage',
  },
});

// Navigate programmatically
navigate('/users/123');`
              )
            )
          )
        )
      )
    ),

    // Next Steps Section
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
          '🎯 Next Steps'
        ),

        createElement(
          'div',
          {
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            },
          },

          createElement(
            Card,
            {
              padding: 'lg',
              hoverable: true,
              bordered: true,
              onClick: () => navigate('/reactivity'),
              style: { cursor: 'pointer' },
            },
            createElement(
              'h3',
              {
                style: {
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#667eea',
                },
              },
              '⚡ Learn Reactivity'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280' } },
              'Master fine-grained reactivity with atom(), computed(), and effect()'
            )
          ),

          createElement(
            Card,
            {
              padding: 'lg',
              hoverable: true,
              bordered: true,
              onClick: () => navigate('/components'),
              style: { cursor: 'pointer' },
            },
            createElement(
              'h3',
              {
                style: {
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#667eea',
                },
              },
              '🎨 Explore Components'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280' } },
              'Discover 20+ interactive UI components with wild features'
            )
          ),

          createElement(
            Card,
            {
              padding: 'lg',
              hoverable: true,
              bordered: true,
              onClick: () => navigate('/router'),
              style: { cursor: 'pointer' },
            },
            createElement(
              'h3',
              {
                style: {
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#667eea',
                },
              },
              '🛣️ Setup Routing'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280' } },
              'Add client-side routing with dynamic parameters and nested routes'
            )
          ),

          createElement(
            Card,
            {
              padding: 'lg',
              hoverable: true,
              bordered: true,
              onClick: () => navigate('/ai-debugger'),
              style: { cursor: 'pointer' },
            },
            createElement(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                },
              },
              createElement(
                'h3',
                {
                  style: {
                    fontSize: '1.5rem',
                    color: '#667eea',
                    margin: 0,
                  },
                },
                '🐛 Try AI Debugger'
              ),
              createElement(Badge, { variant: 'gradient', size: 'sm', pulse: true }, 'NEW!')
            ),
            createElement(
              'p',
              { style: { color: '#6b7280' } },
              'Intelligent debugging with AI-powered error analysis and fixes'
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
