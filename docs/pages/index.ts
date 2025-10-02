import { createElement } from '@solidum/core';
import {
  Container,
  Stack,
  Button,
  Card,
  Badge,
  Avatar,
  Progress,
  Spinner,
  GlassCard,
  Chart3D,
  DataTable,
  Tabs,
  Switch
} from '@solidum/ui';
import { navigate } from '@solidum/router';

export function HomePage() {
  // Sample data for Chart3D
  const chartData = [
    { x: 1, y: 20, z: 10, label: 'A' },
    { x: 2, y: 35, z: 15, label: 'B' },
    { x: 3, y: 25, z: 8, label: 'C' },
    { x: 4, y: 45, z: 20, label: 'D' },
    { x: 5, y: 30, z: 12, label: 'E' },
  ];

  // Sample data for DataTable
  const tableColumns = [
    { key: 'name', header: 'Component', sortable: true },
    { key: 'category', header: 'Category', sortable: true },
    { key: 'interactive', header: 'Interactive', render: (val: boolean) => val ? '✓' : '✗' }
  ];

  const tableData = [
    { name: 'Chart3D', category: 'Data Display', interactive: true },
    { name: 'DataTable', category: 'Data Display', interactive: true },
    { name: 'ParticleBackground', category: 'Effects', interactive: true },
    { name: 'GlassCard', category: 'Layout', interactive: false },
    { name: 'Modal', category: 'Feedback', interactive: true },
  ];

  return createElement(
    'div',
    {
      className: 'home-page',
      style: { position: 'relative', overflow: 'hidden' }
    },

    // Hero Section with Glassmorphism
    createElement(
      'section',
      {
        className: 'hero',
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '8rem 0',
          textAlign: 'center',
          position: 'relative'
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
              fontSize: '4.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }
          }, 'Solidum'),
          createElement('p', {
            style: {
              fontSize: '1.75rem',
              opacity: '0.95',
              marginBottom: '0.5rem',
              fontWeight: '500'
            }
          }, 'A Fine-Grained Reactive JavaScript Framework'),
          createElement('p', {
            style: {
              fontSize: '1.25rem',
              opacity: '0.85',
              marginBottom: '2rem'
            }
          }, '✨ Now with 20+ Wild Interactive Components ✨'),
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

    // Live Demo Section - Wild Components Showcase
    createElement(
      'section',
      {
        style: {
          padding: '4rem 0',
          background: '#1a1a2e',
          color: 'white',
          position: 'relative'
        }
      },
      createElement(
        Container,
        { maxWidth: 'xl' },
        createElement('h2', {
          style: {
            fontSize: '3rem',
            textAlign: 'center',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }
        }, '🔥 Wild Interactive Components'),
        createElement('p', {
          style: {
            textAlign: 'center',
            fontSize: '1.25rem',
            marginBottom: '3rem',
            opacity: '0.8'
          }
        }, 'Drag, rotate, and interact with these components!'),

        // Tabs for different demos
        createElement(Tabs, {
          tabs: [
            {
              id: 'chart3d',
              label: '3D Chart',
              icon: '📊',
              content: createElement('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '2rem',
                  background: '#0a0e27',
                  borderRadius: '1rem'
                }
              },
                createElement(Chart3D, {
                  data: chartData,
                  type: 'bar',
                  width: 700,
                  height: 450,
                  interactive: true,
                  animated: true,
                  showGrid: true
                })
              )
            },
            {
              id: 'datatable',
              label: 'Drag & Drop Table',
              icon: '📋',
              content: createElement(DataTable, {
                columns: tableColumns,
                data: tableData,
                draggableRows: true,
                sortable: true,
                striped: true,
                hoverable: true,
                animated: true
              })
            },
            {
              id: 'glassmorphism',
              label: 'Glassmorphism',
              icon: '✨',
              content: createElement('div', {
                style: {
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  padding: '3rem',
                  borderRadius: '1rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '2rem'
                }
              },
                createElement(GlassCard, {
                  blur: 'lg',
                  tint: 'light',
                  hoverable: true,
                  glow: true,
                  animated: true
                },
                  createElement('h3', { style: { marginBottom: '1rem', color: '#1a1a2e' } }, 'Light Glass'),
                  createElement('p', { style: { color: '#4a4a6a' } }, 'Hover me for effects!')
                ),
                createElement(GlassCard, {
                  blur: 'xl',
                  tint: 'dark',
                  hoverable: true,
                  bordered: true
                },
                  createElement('h3', { style: { marginBottom: '1rem' } }, 'Dark Glass'),
                  createElement('p', { style: { opacity: '0.8' } }, 'With backdrop blur')
                ),
                createElement(GlassCard, {
                  blur: 'md',
                  tint: 'gradient',
                  hoverable: true,
                  glow: true,
                  animated: true
                },
                  createElement('h3', { style: { marginBottom: '1rem' } }, 'Gradient Glass'),
                  createElement('p', { style: { opacity: '0.9' } }, 'Animated float effect')
                )
              )
            }
          ],
          variant: 'pills',
          animated: true
        })
      )
    ),

    // Features Section
    createElement(
      'section',
      {
        style: {
          padding: '5rem 0',
          background: '#f9fafb'
        }
      },
      createElement(
        Container,
        { maxWidth: 'xl' },
        createElement('h2', {
          style: {
            fontSize: '3rem',
            textAlign: 'center',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }
        }, 'Why Solidum?'),
        createElement('p', {
          style: {
            textAlign: 'center',
            fontSize: '1.25rem',
            marginBottom: '3rem',
            color: '#6b7280'
          }
        }, 'A complete framework with everything you need'),
        createElement(
          'div',
          {
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem'
            }
          },
          // Feature 1 - Enhanced with badge
          createElement(
            Card,
            { 
              padding: 'lg', 
              hoverable: true, 
              bordered: true,
              onClick: () => navigate('/reactivity'),
              style: { cursor: 'pointer' }
            },
            createElement('div', {
              style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }
            },
              createElement('h3', {
                style: {
                  fontSize: '1.5rem',
                  color: '#667eea',
                  margin: 0
                }
              }, '⚡ Fine-Grained Reactivity'),
              createElement(Badge, { variant: 'gradient', size: 'sm', glow: true }, 'Core')
            ),
            createElement('p', {
              style: { color: '#6b7280', marginBottom: '1rem' }
            }, 'Efficient updates with atom, computed, and effect primitives. Only what changes gets updated.'),
            createElement(Progress, { value: 95, variant: 'gradient', showLabel: true, glow: true })
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
            { padding: 'lg', hoverable: true, bordered: true },
            createElement('div', {
              style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }
            },
              createElement('h3', {
                style: {
                  fontSize: '1.5rem',
                  color: '#667eea',
                  margin: 0
                }
              }, '🧪 Well-Tested'),
              createElement(Badge, { variant: 'success', size: 'sm' }, '104 Tests')
            ),
            createElement('p', {
              style: { color: '#6b7280' }
            }, 'Comprehensive test suite with 100+ tests ensuring reliability and stability.')
          ),

          // NEW Feature 7 - UI Library
          createElement(
            Card,
            { 
              padding: 'lg', 
              hoverable: true, 
              bordered: true,
              onClick: () => navigate('/components'),
              style: { cursor: 'pointer' }
            },
            createElement('div', {
              style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }
            },
              createElement('h3', {
                style: {
                  fontSize: '1.5rem',
                  color: '#667eea',
                  margin: 0
                }
              }, '🎨 Rich UI Library'),
              createElement(Badge, { variant: 'gradient', size: 'sm', pulse: true }, 'NEW!')
            ),
            createElement('p', {
              style: { color: '#6b7280', marginBottom: '1rem' }
            }, '20+ production-ready components including 3D charts, drag-and-drop tables, and particle effects.'),
            createElement('div', {
              style: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }
            },
              createElement(Avatar, { size: 'sm', fallback: 'UI', status: 'online', glow: true }),
              createElement(Avatar, { size: 'sm', fallback: '3D', variant: 'rounded' }),
              createElement(Avatar, { size: 'sm', fallback: 'DND', status: 'online' }),
              createElement(Spinner, { size: 'sm', variant: 'default' })
            )
          ),

          // NEW Feature 8 - Interactive
          createElement(
            Card,
            { padding: 'lg', hoverable: true, bordered: true },
            createElement('div', {
              style: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }
            },
              createElement('h3', {
                style: {
                  fontSize: '1.5rem',
                  color: '#667eea',
                  margin: 0
                }
              }, '🎮 Interactive'),
              createElement(Badge, { variant: 'warning', size: 'sm', glow: true }, 'Wild!')
            ),
            createElement('p', {
              style: { color: '#6b7280', marginBottom: '1rem' }
            }, 'Drag-to-rotate 3D charts, reorderable tables, mouse-interactive particles, and more!'),
            createElement(Switch, { size: 'md', label: 'Try me!' })
          )
        )
      )
    ),

    // Component Stats Section
    createElement(
      'section',
      {
        style: {
          padding: '4rem 0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      },
      createElement(
        Container,
        { maxWidth: 'lg' },
        createElement('h2', {
          style: {
            fontSize: '3rem',
            textAlign: 'center',
            marginBottom: '3rem',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }
        }, '📊 Component Library Stats'),
        createElement('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }
        },
          createElement(GlassCard, {
            blur: 'lg',
            tint: 'light',
            bordered: true
          },
            createElement('div', { style: { fontSize: '3.5rem', marginBottom: '0.5rem', color: '#667eea' } }, '20+'),
            createElement('div', { style: { fontSize: '1.25rem', fontWeight: '500', color: '#1a1a2e' } }, 'Components')
          ),
          createElement(GlassCard, {
            blur: 'lg',
            tint: 'light',
            bordered: true
          },
            createElement('div', { style: { fontSize: '3.5rem', marginBottom: '0.5rem', color: '#764ba2' } }, '4'),
            createElement('div', { style: { fontSize: '1.25rem', fontWeight: '500', color: '#1a1a2e' } }, 'Wild Features')
          ),
          createElement(GlassCard, {
            blur: 'lg',
            tint: 'light',
            bordered: true
          },
            createElement('div', { style: { fontSize: '3.5rem', marginBottom: '0.5rem', color: '#667eea' } }, '1.6k'),
            createElement('div', { style: { fontSize: '1.25rem', fontWeight: '500', color: '#1a1a2e' } }, 'CSS Lines')
          ),
          createElement(GlassCard, {
            blur: 'lg',
            tint: 'light',
            bordered: true
          },
            createElement('div', { style: { fontSize: '3.5rem', marginBottom: '0.5rem', color: '#764ba2' } }, '0'),
            createElement('div', { style: { fontSize: '1.25rem', fontWeight: '500', color: '#1a1a2e' } }, 'Dependencies')
          )
        )
      )
    ),

    // Quick Example Section
    createElement(
      'section',
      { style: { padding: '5rem 0' } },
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
