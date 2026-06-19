// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'docusaurus-guide',
      label: 'Docusaurus 知识点',
    },
    {
      type: 'category',
      label: 'Angular',
      collapsed: false,
      items: ['angular/intro', 'angular/components'],
    },
    {
      type: 'category',
      label: 'SpringBoot',
      collapsed: true,
      items: ['springboot/intro', 'springboot/rest-api'],
    },
    {
      type: 'category',
      label: 'React',
      collapsed: true,
      items: ['react/intro', 'react/hooks'],
    },
  ],
};

module.exports = sidebars;
