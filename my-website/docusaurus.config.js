// @ts-check

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AI & Data Science Academy',
  tagline: 'From Python foundations to intelligent AI systems',
  favicon: 'img/favicon.ico',
  future: {v4: true},
  url: 'https://ai-data-science-book.example.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  customFields: {
    apiUrl: process.env.BOOK_API_URL ?? (process.env.VERCEL ? '' : 'http://localhost:8000'),
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {respectPrefersColorScheme: true},
      navbar: {
        title: 'AI & DS Academy',
        logo: {
          alt: 'AI and Data Science Academy logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'bookSidebar',
            position: 'left',
            label: 'Read the Book',
          },
          {to: '/docs/course-roadmap', label: 'Roadmap', position: 'right'},
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Learn',
            items: [
              {label: 'Start the Book', to: '/docs/'},
              {label: 'Course Roadmap', to: '/docs/course-roadmap'},
            ],
          },
          {
            title: 'Core Path',
            items: [
              {label: 'Python Foundations', to: '/docs/python-foundations'},
              {label: 'Machine Learning', to: '/docs/machine-learning'},
              {label: 'Generative AI', to: '/docs/generative-ai'},
            ],
          },
          {
            title: 'Advanced',
            items: [
              {label: 'MLOps', to: '/docs/mlops'},
              {label: 'Agentic AI', to: '/docs/agentic-ai'},
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} AI & Data Science Academy. Built for curious learners.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
