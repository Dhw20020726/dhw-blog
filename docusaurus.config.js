const { themes } = require('prism-react-renderer');
const { hydrateAlgoliaEnv, resolveAlgoliaEnv } = require('./scripts/utils/env');

hydrateAlgoliaEnv();
const algoliaEnv = resolveAlgoliaEnv();
const isAlgoliaReady = Boolean(algoliaEnv.appId && algoliaEnv.searchApiKey && algoliaEnv.indexName);

const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Dev Blog',
  tagline: 'Angular · Spring Boot · React',
  url: 'https://dhw20020726.github.io',
  baseUrl: '/dhw-blog/',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: { onBrokenMarkdownLinks: 'warn' },
  },
  organizationName: 'Dhw20020726',
  projectName: 'dhw-blog',

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/docs',
          remarkPlugins: [require('./plugins/heading-anchors')],
        },
        blog: false,
        theme: { customCss: require.resolve('./src/css/custom.css') },
      },
    ],
  ],

  themeConfig: {
    algolia: isAlgoliaReady ? {
      appId: algoliaEnv.appId,
      apiKey: algoliaEnv.searchApiKey,
      indexName: algoliaEnv.indexName,
      contextualSearch: true,
      searchParameters: {},
    } : undefined,
    navbar: { title: 'Dev Blog', hideOnScroll: true },
    docs: { sidebar: { hideable: true, autoCollapseCategories: true } },
    prism: { theme: lightCodeTheme, darkTheme: darkCodeTheme },
  },
};

module.exports = config;
