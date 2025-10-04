import { createElement } from '@sldm/core';
import { Container, Card, Stack, Badge } from '@sldm/ui';
import { Navigation } from '../components/Navigation.js';
export function WebAIPage() {
  return createElement(
    'div',
    { className: 'web-ai-page' },
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
          '🤖 Web AI'
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
          'Integrate Google Gemini Nano AI directly in the browser'
        ),
        createElement(
          Stack,
          { direction: 'horizontal', spacing: 'md', align: 'center' },
          createElement(Badge, { variant: 'info', size: 'lg' }, 'Chrome 127+'),
          createElement(Badge, { variant: 'success', size: 'lg' }, 'Built-in AI')
        )
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
              '🧠 Gemini Nano'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280' } },
              "Use Google's built-in AI directly in Chrome - no API keys, no server needed!"
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
              '⚡ Reactive Integration'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280' } },
              'Reactive AI client with atom-based state management for seamless integration.'
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
              '🔒 Privacy First'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280' } },
              'All processing happens locally in the browser. Your data never leaves your device.'
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
              '💾 Built-in Caching'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280' } },
              'Smart caching for improved performance and reduced redundant AI calls.'
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
              `import { createWebAIClient } from '@sldm/web-ai';

// Create AI client
const aiClient = createWebAIClient();

// Check availability
if (await aiClient.isAvailable()) {
  // Generate text
  const response = await aiClient.generate(
    'Explain fine-grained reactivity in simple terms'
  );

  console.log(response);

  // Streaming responses
  for await (const chunk of aiClient.generateStream(prompt)) {
    console.log(chunk);
  }
}

// Reactive state
console.log('Loading:', aiClient.isLoading());
console.log('Error:', aiClient.error());`
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
