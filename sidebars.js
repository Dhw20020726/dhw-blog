module.exports = {
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
      link: { type: 'generated-index', title: 'Angular', description: 'Angular 前端框架相关文章' },
      items: ['angular/intro', 'angular/components'],
    },
    {
      type: 'category',
      label: 'SpringBoot',
      collapsed: false,
      link: { type: 'generated-index', title: 'SpringBoot', description: 'Spring Boot 后端框架相关文章' },
      items: ['springboot/intro', 'springboot/rest-api'],
    },
    {
      type: 'category',
      label: 'React',
      collapsed: false,
      link: { type: 'generated-index', title: 'React', description: 'React 前端库相关文章' },
      items: ['react/intro', 'react/hooks'],
    },
  ],
};
