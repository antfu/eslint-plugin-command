import { fileURLToPath } from 'node:url'
import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import fg from 'fast-glob'
import { version } from '../../package.json'
import vite from './vite.config'

const root = fileURLToPath(new URL('../../', import.meta.url))

const commands = fg.sync('src/commands/*.md', {
  cwd: root,
})

const GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Getting Started', link: '/guide/' },
  { text: 'Installation', link: '/guide/install' },
]

const COMMANDS: DefaultTheme.NavItemWithLink[] = commands.map(file => ({
  text: file.split('/').pop()!.replace('.md', ''),
  link: `/commands/${file.split('/').pop()!.replace('.md', '')}`,
}))

const VERSIONS: (DefaultTheme.NavItemWithLink | DefaultTheme.NavItemChildren)[] = [
  { text: `v${version} (current)`, link: '/' },
  { text: `Release Notes`, link: 'https://github.com/antfu/eslint-plugin-command/releases' },
  { text: `Contributing`, link: 'https://github.com/antfu/eslint-plugin-command/blob/main/CONTRIBUTING.md' },
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'ESLint Plugin Command',
  description: 'Comment-as-command for one-off codemod with ESLint.',
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },

  },

  rewrites: {
    ...Object.fromEntries(commands.map(file => [
      file,
      `commands/${file.split('/').pop()}`,
    ])),
    // rewrite docs markdown because we set the `srcDir` to the root of the monorepo
    'docs/:name(.+).md': ':name.md',
  },

  cleanUrls: true,
  srcDir: root,
  vite,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      {
        text: 'Guide',
        items: [
          {
            items: GUIDES,
          },
        ],
      },
      {
        text: 'Commands',
        items: COMMANDS,
      },
      {
        text: `v${version}`,
        items: VERSIONS,
      },
    ],

    sidebar: Object.assign(
      {},
      {
        '/': [
          {
            text: 'Guide',
            items: GUIDES,
          },
          {
            text: 'Commands',
            items: COMMANDS,
          },
        ],
      },
    ),

    editLink: {
      pattern: 'https://github.com/antfu/eslint-plugin-command/edit/main/:path',
      text: 'Suggest changes to this page',
    },

    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/antfu/eslint-plugin-command' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-PRESENT Anthony Fu.',
    },
  },

  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Anthony Fu' }],
    ['meta', { property: 'og:title', content: 'ESLint Plugin Command' }],
    ['meta', { property: 'og:image', content: 'https://eslint-plugin-command.antfu.me/og.png' }],
    ['meta', { property: 'og:description', content: 'Comment-as-command for one-off codemod with ESLint.' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://eslint-plugin-command.antfu.me/og.png' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
  ],
})
