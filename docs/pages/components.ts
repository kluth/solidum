import { createElement } from '@sldm/core';
import { navigate } from '@sldm/router';
import { Container, Card, Button, Badge } from '@sldm/ui';

export function ComponentsPage() {
  return createElement(
    'div',
    { className: 'components-page' },

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
          '🎨 Rich UI Library'
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
          '20+ production-ready components with wild interactive features'
        ),
        createElement(
          Button,
          {
            variant: 'secondary',
            size: 'lg',
            onClick: () => navigate('/'),
          },
          '← Back to Home'
        )
      )
    ),

    // Components Grid
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            },
          },

          // Chart3D Component
          createElement(
            Card,
            { padding: 'lg', hoverable: true, bordered: true },
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
                    margin: 0,
                    color: '#667eea',
                  },
                },
                '📊 Chart3D'
              ),
              createElement(Badge, { variant: 'gradient', size: 'sm', glow: true }, 'Wild!')
            ),
            createElement(
              'p',
              {
                style: { color: '#6b7280', marginBottom: '1rem' },
              },
              'Interactive 3D charts with drag-to-rotate functionality.'
            ),
            createElement(
              'div',
              {
                style: { fontSize: '0.9rem', color: '#9ca3af' },
              },
              'Features: Animated, Interactive, Responsive'
            )
          ),

          // DataTable Component
          createElement(
            Card,
            { padding: 'lg', hoverable: true, bordered: true },
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
                    margin: 0,
                    color: '#667eea',
                  },
                },
                '📋 DataTable'
              ),
              createElement(Badge, { variant: 'gradient', size: 'sm', glow: true }, 'Wild!')
            ),
            createElement(
              'p',
              {
                style: { color: '#6b7280', marginBottom: '1rem' },
              },
              'Drag-and-drop table with sorting and filtering.'
            ),
            createElement(
              'div',
              {
                style: { fontSize: '0.9rem', color: '#9ca3af' },
              },
              'Features: Draggable, Sortable, Filterable'
            )
          ),

          // GlassCard Component
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
              '✨ GlassCard'
            ),
            createElement(
              'p',
              {
                style: { color: '#6b7280', marginBottom: '1rem' },
              },
              'Glassmorphism effects with backdrop blur and gradients.'
            ),
            createElement(
              'div',
              {
                style: { fontSize: '0.9rem', color: '#9ca3af' },
              },
              'Features: Blur effects, Gradient tints, Animations'
            )
          ),

          // Modal Component
          createElement(
            Card,
            { padding: 'lg', hoverable: true, bordered: true },
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
                    margin: 0,
                    color: '#667eea',
                  },
                },
                '🪟 Modal'
              ),
              createElement(Badge, { variant: 'success', size: 'sm' }, 'Interactive')
            ),
            createElement(
              'p',
              {
                style: { color: '#6b7280', marginBottom: '1rem' },
              },
              'Accessible modal dialogs with backdrop and animations.'
            ),
            createElement(
              'div',
              {
                style: { fontSize: '0.9rem', color: '#9ca3af' },
              },
              'Features: Accessible, Animated, Backdrop'
            )
          ),

          // Button Component
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
              '🔘 Button'
            ),
            createElement(
              'p',
              {
                style: { color: '#6b7280', marginBottom: '1rem' },
              },
              'Flexible button component with multiple variants and sizes.'
            ),
            createElement(
              'div',
              {
                style: { fontSize: '0.9rem', color: '#9ca3af' },
              },
              'Features: Variants, Sizes, States, Icons'
            )
          ),

          // Switch Component
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
              '🔀 Switch'
            ),
            createElement(
              'p',
              {
                style: { color: '#6b7280', marginBottom: '1rem' },
              },
              'Toggle switch component with smooth animations.'
            ),
            createElement(
              'div',
              {
                style: { fontSize: '0.9rem', color: '#9ca3af' },
              },
              'Features: Animated, Accessible, Customizable'
            )
          )
        )
      )
    )
  );
}
