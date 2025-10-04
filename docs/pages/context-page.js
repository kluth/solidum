import { createElement } from '@sldm/core';
import { Container, Card, Badge } from '@sldm/ui';
import { Navigation } from '../components/Navigation.js';
export function ContextPage() {
  return createElement(
    'div',
    { className: 'context-page' },
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
          '🔄 Context'
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
          'Share data across component trees without prop drilling'
        ),
        createElement(Badge, { variant: 'secondary', size: 'lg' }, 'Type-Safe')
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
              '🎯 No Prop Drilling'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280' } },
              'Pass data deep into component trees without manually threading props through every level.'
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
              '✅ Type-Safe'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280' } },
              'Full TypeScript support with type inference for context values.'
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
              '⚡ Reactive'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280' } },
              "Built on Solidum's reactivity - context updates automatically propagate to consumers."
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
              '🔒 Scoped'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280' } },
              'Each context is scoped to its provider subtree - perfect for nested components.'
            )
          )
        )
      )
    ),
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
          '📝 Usage'
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
              `import { createContext, useContext } from '@sldm/context';
import { createElement, atom } from '@sldm/core';

// Create context
const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  toggle: () => void;
}>();

// Provider component
function ThemeProvider({ children }) {
  const theme = atom<'light' | 'dark'>('light');

  const value = {
    theme: theme(),
    toggle: () => theme(theme() === 'light' ? 'dark' : 'light'),
  };

  return createElement(
    ThemeContext.Provider,
    { value },
    children
  );
}

// Consumer component
function ThemedButton() {
  const themeCtx = useContext(ThemeContext);

  return createElement('button', {
    style: {
      background: themeCtx.theme === 'dark' ? '#1f2937' : '#ffffff',
      color: themeCtx.theme === 'dark' ? '#ffffff' : '#1f2937',
    },
    onClick: themeCtx.toggle,
  }, 'Toggle Theme');
}`
            )
          )
        )
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
