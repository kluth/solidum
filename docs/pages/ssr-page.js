import { createElement } from '@sldm/core';
import { Container, Card, Badge } from '@sldm/ui';
import { Navigation } from '../components/Navigation.js';
export function SSRPage() {
  return createElement(
    'div',
    { className: 'ssr-page' },
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
          '🖥️ Server-Side Rendering'
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
          'Render Solidum components to HTML on the server'
        ),
        createElement(Badge, { variant: 'success', size: 'lg' }, 'Fast!')
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
              `import { renderToString } from '@sldm/ssr';
import { HomePage } from './pages/index.js';

// Render component to HTML string
const html = renderToString(HomePage());

// Use in your HTML template
const page = \`<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <div id="app">\${html}</div>
  <script src="/app.js"></script>
</body>
</html>\`;

// Send to client
res.send(page);`
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
      createElement(Container, {}, createElement('p', {}, 'Built with ❤️ using Solidum'))
    )
  );
}
