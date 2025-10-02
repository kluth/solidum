import { createElement } from '@solidum/core';
import { Container, Stack, Button, Card } from '@solidum/ui';

export function HomePage() {
  return createElement(
    'div',
    { className: 'home-page' },

    // Hero Section
    createElement(
      'section',
      {
        className: 'hero',
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '6rem 0',
          textAlign: 'center'
        }
      },
      createElement(
        Container,
        { maxWidth: 'lg' },
        createElement(
          Stack,
          { spacing: 'lg', align: 'center' },
          createElement('h1', {
            style: {
              fontSize: '4rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }
          }, 'Solidum'),
          createElement('p', {
            style: {
              fontSize: '1.5rem',
              opacity: '0.9',
              marginBottom: '2rem'
            }
          }, 'A Fine-Grained Reactive JavaScript Framework'),
          createElement(
            Stack,
            { direction: 'horizontal', spacing: 'md' },
            createElement(
              Button,
              { variant: 'secondary', size: 'lg' },
              'Get Started'
            ),
            createElement(
              Button,
              { variant: 'outline', size: 'lg' },
              'View on GitHub'
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
          background: '#f9fafb'
        }
      },
      createElement(
        Container,
        { maxWidth: 'lg' },
        createElement('h2', {
          style: {
            fontSize: '2.5rem',
            textAlign: 'center',
            marginBottom: '3rem'
          }
        }, 'Why Solidum?'),
        createElement(
          'div',
          {
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }
          },
          // Feature 1
          createElement(
            Card,
            { padding: 'lg', hoverable: true },
            createElement('h3', {
              style: {
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#667eea'
              }
            }, '⚡ Fine-Grained Reactivity'),
            createElement('p', {
              style: { color: '#6b7280' }
            }, 'Efficient updates with atom, computed, and effect primitives. Only what changes gets updated.')
          ),
          // Feature 2
          createElement(
            Card,
            { padding: 'lg', hoverable: true },
            createElement('h3', {
              style: {
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#667eea'
              }
            }, '🎯 Simple API'),
            createElement('p', {
              style: { color: '#6b7280' }
            }, 'Intuitive and easy to learn. Start building reactive applications in minutes.')
          ),
          // Feature 3
          createElement(
            Card,
            { padding: 'lg', hoverable: true },
            createElement('h3', {
              style: {
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#667eea'
              }
            }, '📦 Lightweight'),
            createElement('p', {
              style: { color: '#6b7280' }
            }, 'Small bundle size with zero dependencies. Perfect for performance-critical applications.')
          ),
          // Feature 4
          createElement(
            Card,
            { padding: 'lg', hoverable: true },
            createElement('h3', {
              style: {
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#667eea'
              }
            }, '🔧 Extensible'),
            createElement('p', {
              style: { color: '#6b7280' }
            }, 'Build your own UI libraries, state management solutions, and more on top of Solidum.')
          ),
          // Feature 5
          createElement(
            Card,
            { padding: 'lg', hoverable: true },
            createElement('h3', {
              style: {
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#667eea'
              }
            }, '✨ Type-Safe'),
            createElement('p', {
              style: { color: '#6b7280' }
            }, 'Fully typed with TypeScript for excellent developer experience and fewer bugs.')
          ),
          // Feature 6
          createElement(
            Card,
            { padding: 'lg', hoverable: true },
            createElement('h3', {
              style: {
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#667eea'
              }
            }, '🧪 Well-Tested'),
            createElement('p', {
              style: { color: '#6b7280' }
            }, 'Comprehensive test suite with 100+ tests ensuring reliability and stability.')
          )
        )
      )
    ),

    // Quick Example Section
    createElement(
      'section',
      { style: { padding: '4rem 0' } },
      createElement(
        Container,
        { maxWidth: 'md' },
        createElement('h2', {
          style: {
            fontSize: '2.5rem',
            textAlign: 'center',
            marginBottom: '2rem'
          }
        }, 'Quick Example'),
        createElement(
          'pre',
          {
            style: {
              background: '#1f2937',
              color: '#f3f4f6',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              overflow: 'auto'
            }
          },
          createElement('code', null, `import { atom, computed, effect } from '@solidum/core';

// Create reactive state
const count = atom(0);
const doubled = computed(() => count() * 2);

// React to changes
effect(() => {
  console.log(\`Count: \${count()}, Doubled: \${doubled()}\`);
});

// Update state
count(5); // Console: Count: 5, Doubled: 10`)
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
          textAlign: 'center'
        }
      },
      createElement(
        Container,
        {},
        createElement('p', {}, 'Built with ❤️ using Solidum'),
        createElement('p', {
          style: { marginTop: '0.5rem', opacity: '0.7' }
        }, 'MIT License © 2025')
      )
    )
  );
}
