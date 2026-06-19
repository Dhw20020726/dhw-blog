import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const topics = [
  { title: 'Angular', description: '企业级前端框架，基于 TypeScript，适合大型单页应用。', to: '/docs/angular/intro', color: '#dd0031' },
  { title: 'SpringBoot', description: 'Spring 快速开发框架，自动配置、内嵌服务器。', to: '/docs/springboot/intro', color: '#6db33f' },
  { title: 'React', description: '声明式 UI 库，组件化、虚拟 DOM、丰富生态。', to: '/docs/react/intro', color: '#61dafb' },
];

export default function Home() {
  return (
    <Layout description="Tech blog about Angular, Spring Boot and React">
      <main className="homeLayout">
        <section className="homeHero">
          <div className="homeHeroContent">
            <h1>Dev Blog</h1>
            <p className="homeHeroTagline">Angular · Spring Boot · React</p>
          </div>
        </section>
        <section className="homeTopics">
          <div className="homeTopicsGrid">
            {topics.map((t) => (
              <Link key={t.title} to={t.to} className="homeTopicCard" style={{ borderTopColor: t.color }}>
                <h2>{t.title}</h2>
                <p>{t.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
