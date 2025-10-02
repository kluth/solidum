import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Solidum',
  description: 'A fine-grained reactive JavaScript framework for building user interfaces',

  base: '/solidum/',

  head: [
    ['link', { rel: 'icon', href: '/solidum/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#667eea' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: 'Solidum' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'API', link: '/api/reactive' },
      { text: 'Examples', link: '/examples/counter' },
      {
        text: 'v0.1.0',
        items: [
          { text: 'Changelog', link: '/changelog' },
          { text: 'Contributing', link: '/contributing' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Solidum?', link: '/guide/introduction' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Installation', link: '/guide/installation' }
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Reactivity', link: '/guide/reactivity' },
            { text: 'Components', link: '/guide/components' },
            { text: 'Context', link: '/guide/context' },
            { text: 'Store Pattern', link: '/guide/store' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Component Utilities', link: '/guide/utilities' },
            { text: 'Testing', link: '/guide/testing' },
            { text: 'Best Practices', link: '/guide/best-practices' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Reactive Primitives', link: '/api/reactive' },
            { text: 'Context API', link: '/api/context' },
            { text: 'Store', link: '/api/store' },
            { text: 'Components', link: '/api/components' },
            { text: 'Utilities', link: '/api/utilities' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Counter', link: '/examples/counter' },
            { text: 'Todo App', link: '/examples/todo-app' },
            { text: 'Form Validation', link: '/examples/form-validation' },
            { text: 'Shopping Cart', link: '/examples/shopping-cart' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kluth/solidum' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/kluth/solidum/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    }
  }
})
