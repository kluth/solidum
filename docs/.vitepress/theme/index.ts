import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // Custom slots if needed
    })
  },
  enhanceApp({ app, router, siteData }) {
    // App level customizations
  }
} satisfies Theme
