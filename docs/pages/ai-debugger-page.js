import { createElement } from '@sldm/core';
import { Container, Card, Stack, Badge, Tabs } from '@sldm/ui';
import { Navigation } from '../components/Navigation.js';
export function AIDebuggerPage() {
  return createElement(
    'div',
    { className: 'ai-debugger-page' },
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
          '🐛 AI Debugger'
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
          'Intelligent debugging with AI-powered error analysis and fixes'
        ),
        createElement(
          Stack,
          { direction: 'horizontal', spacing: 'md', align: 'center' },
          createElement(Badge, { variant: 'gradient', size: 'lg', pulse: true }, 'NEW!'),
          createElement(Badge, { variant: 'info', size: 'lg' }, 'Chrome 127+'),
          createElement(Badge, { variant: 'success', size: 'lg' }, 'v0.3.0')
        )
      )
    ),
    // Features Overview
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
          '🌟 Features'
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
                '🔍 AI Error Analysis'
              ),
              createElement(Badge, { variant: 'gradient', size: 'sm', glow: true }, 'Smart')
            ),
            createElement(
              'p',
              { style: { color: '#6b7280', marginBottom: '1rem' } },
              'Automatically analyze errors with detailed insights, possible causes, and suggested fixes using Google Gemini Nano.'
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
              '💡 Debug Hints'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280' } },
              'Get intelligent code review hints and improvement suggestions for your code.'
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
              '🔧 Fix Suggestions'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280' } },
              'Receive automatic fix proposals with code examples tailored to your specific error.'
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
              '⚡ Auto-Analysis Mode'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280' } },
              "Automatically analyze errors as they're logged to the console."
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
              '💾 Smart Caching'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280' } },
              'Built-in caching for improved performance - identical errors analyzed only once.'
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
              '🔄 Fallback Support'
            ),
            createElement(
              'p',
              { style: { color: '#6b7280' } },
              'Works with or without AI availability. Provides stack trace analysis when AI is unavailable.'
            )
          )
        )
      )
    ),
    // Usage Examples
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
          '📝 Usage Examples'
        ),
        createElement(Tabs, {
          tabs: [
            {
              id: 'basic',
              label: 'Basic Usage',
              icon: '🚀',
              content: createElement(
                Card,
                { padding: 'lg' },
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
                    `import { createAIDebugger } from '@sldm/debug';

const aiDebugger = createAIDebugger({
  enableAutoAnalysis: true,
});

try {
  // Your code
  riskyOperation();
} catch (error) {
  const analysis = await aiDebugger.analyzeError(error, {
    code: sourceCode,
    file: 'app.ts',
    line: 42,
  });

  console.log('Summary:', analysis.summary);
  console.log('Causes:', analysis.possibleCauses);
  console.log('Fixes:', analysis.suggestedFixes);
  console.log('Severity:', analysis.severity);
}`
                  )
                )
              ),
            },
            {
              id: 'hints',
              label: 'Debug Hints',
              icon: '💡',
              content: createElement(
                Card,
                { padding: 'lg' },
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
                    `// Get debug hints for code
const hints = await aiDebugger.getDebugHints(
  \`function calculate(a, b) {
    return a / b;
  }\`,
  'This function sometimes returns Infinity'
);

hints.forEach(hint => {
  console.log(\`[\${hint.type}] \${hint.message}\`);
  if (hint.suggestion) {
    console.log('Suggestion:', hint.suggestion);
  }
});`
                  )
                )
              ),
            },
            {
              id: 'fixes',
              label: 'Fix Suggestions',
              icon: '🔧',
              content: createElement(
                Card,
                { padding: 'lg' },
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
                    `// Get AI-powered fix suggestion
const fix = await aiDebugger.suggestFix(
  error,
  problematicCode
);

console.log('Explanation:', fix.explanation);
console.log('Suggested Code:');
console.log(fix.suggestedCode);`
                  )
                )
              ),
            },
            {
              id: 'auto',
              label: 'Auto-Analysis',
              icon: '⚡',
              content: createElement(
                Card,
                { padding: 'lg' },
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
                    `// Enable auto-analysis mode
const aiDebugger = createAIDebugger({
  enableAutoAnalysis: true,
  autoAnalysisLevel: 'error', // or 'warn', 'all'
});

// Errors are now automatically analyzed!
try {
  throw new Error('Something went wrong');
} catch (error) {
  console.error(error);
  // AI analysis happens automatically
  // and is logged to console
}`
                  )
                )
              ),
            },
          ],
          variant: 'pills',
          animated: true,
        })
      )
    ),
    // Prerequisites
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
        { maxWidth: 'lg' },
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
          '⚙️ Prerequisites'
        ),
        createElement(
          Card,
          { padding: 'lg', bordered: true },
          createElement(
            'ul',
            {
              style: {
                fontSize: '1.1rem',
                lineHeight: '2',
                color: '#4b5563',
              },
            },
            createElement('li', {}, '✅ Chrome 127+ with AI features enabled'),
            createElement('li', {}, '✅ @sldm/web-ai package installed'),
            createElement('li', {}, '✅ Internet connection for first-time AI model download'),
            createElement('li', {}, '💡 Falls back gracefully when AI unavailable')
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
