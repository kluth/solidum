import { createElement } from '@solidum/core';
import { Container, Card, Button } from '@solidum/ui';

export function ReactivityPage() {
  return createElement(
    'div',
    { className: 'reactivity-page' },

    // Hero Section
    createElement(
      'section',
      {
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '4rem 0',
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
              fontSize: '3.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            },
          },
          '⚡ Fine-Grained Reactivity'
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
          'Efficient updates with atom, computed, and effect primitives'
        ),
        createElement(
          Button,
          {
            variant: 'secondary',
            size: 'lg',
            onClick: () => window.history.back(),
          },
          '← Back to Home'
        )
      )
    ),

    // Content Section
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
          'div',
          {
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            },
          },

          // Atom Card
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
              '🔬 Atom'
            ),
            createElement(
              'p',
              {
                style: { color: '#6b7280', marginBottom: '1rem' },
              },
              'Reactive primitives that hold state and notify subscribers when changed.'
            ),
            createElement(
              'pre',
              {
                style: {
                  background: '#1f2937',
                  color: '#f3f4f6',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  overflow: 'auto',
                },
              },
              createElement(
                'code',
                null,
                `const count = atom(0);
count(5); // Update value
console.log(count()); // Read value`
              )
            )
          ),

          // Computed Card
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
              '🧮 Computed'
            ),
            createElement(
              'p',
              {
                style: { color: '#6b7280', marginBottom: '1rem' },
              },
              'Derived values that automatically update when their dependencies change.'
            ),
            createElement(
              'pre',
              {
                style: {
                  background: '#1f2937',
                  color: '#f3f4f6',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  overflow: 'auto',
                },
              },
              createElement(
                'code',
                null,
                `const doubled = computed(() => 
  count() * 2);`
              )
            )
          ),

          // Effect Card
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
              '⚡ Effect'
            ),
            createElement(
              'p',
              {
                style: { color: '#6b7280', marginBottom: '1rem' },
              },
              'Side effects that run when reactive dependencies change.'
            ),
            createElement(
              'pre',
              {
                style: {
                  background: '#1f2937',
                  color: '#f3f4f6',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  overflow: 'auto',
                },
              },
              createElement(
                'code',
                null,
                `effect(() => {
  console.log('Count:', count());
});`
              )
            )
          )
        )
      )
    )
  );
}
