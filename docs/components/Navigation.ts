import { createElement } from '@sldm/core';
import { navigate } from '@sldm/router';
import { Container, Button, Badge } from '@sldm/ui';

interface NavLink {
  path: string;
  label: string;
  icon: string;
  badge?: string;
}

const navLinks: NavLink[] = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/getting-started', label: 'Getting Started', icon: '🚀' },
  { path: '/reactivity', label: 'Core & Reactivity', icon: '⚡' },
  { path: '/router', label: 'Router', icon: '🛣️' },
  { path: '/store', label: 'Store', icon: '📦' },
  { path: '/context', label: 'Context', icon: '🔄' },
  { path: '/storage', label: 'Storage', icon: '💾' },
  { path: '/ssr', label: 'SSR', icon: '🖥️' },
  { path: '/web-ai', label: 'Web AI', icon: '🤖', badge: 'Chrome' },
  { path: '/ai-debugger', label: 'AI Debugger', icon: '🐛', badge: 'NEW' },
  { path: '/testing', label: 'Testing', icon: '🧪' },
  { path: '/components', label: 'UI Components', icon: '🎨' },
  { path: '/ui-chalk', label: 'UI Chalk', icon: '✏️' },
  { path: '/integrations', label: 'Integrations', icon: '🔌' },
];

export function Navigation() {
  const currentPath =
    typeof window !== 'undefined' ? window.location.pathname.replace(/^\/solidum/, '') : '/';

  return createElement(
    'nav',
    {
      style: {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      },
    },
    createElement(
      Container,
      { maxWidth: 'xl' },
      createElement(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 0',
            flexWrap: 'wrap',
            gap: '1rem',
          },
        },

        // Logo
        createElement(
          'div',
          {
            style: {
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer',
            },
            onClick: () => navigate('/'),
          },
          'Solidum'
        ),

        // Navigation Links - Desktop
        createElement(
          'div',
          {
            className: 'nav-links-desktop',
            style: {
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              flex: '1',
              justifyContent: 'center',
            },
          },
          ...navLinks.map(link =>
            createElement(
              'div',
              {
                key: link.path,
                style: {
                  position: 'relative',
                },
              },
              createElement(
                Button,
                {
                  variant: currentPath === link.path ? 'primary' : 'ghost',
                  size: 'sm',
                  onClick: () => navigate(link.path),
                  style: {
                    fontSize: '0.875rem',
                  },
                },
                `${link.icon} ${link.label}`
              ),
              link.badge
                ? createElement(
                    Badge,
                    {
                      variant: link.badge === 'NEW' ? 'gradient' : 'info',
                      size: 'xs',
                      style: {
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        fontSize: '0.625rem',
                        padding: '0.125rem 0.25rem',
                      },
                    },
                    link.badge
                  )
                : null
            )
          )
        ),

        // GitHub Link
        createElement(
          Button,
          {
            variant: 'outline',
            size: 'sm',

            onClick: () => window.open('https://github.com/kluth/solidum', '_blank'),
          },
          '⭐ GitHub'
        )
      )
    )
  );
}
