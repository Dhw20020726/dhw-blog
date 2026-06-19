# dhw-blog

基于 Docusaurus 3.x 的技术博客，涵盖 Angular、Spring Boot 和 React。

## 快速开始

```bash
npm install
npm start      # http://localhost:3000
npm build      # 生产构建
```

## 搜索

```bash
npm run index:generate   # 生成 Algolia 索引
npm run index:upload     # 上传到 Algolia
npm run index:all        # 生成 + 上传
```

## 部署

Push 到 main 分支后 GitHub Actions 自动构建并部署。
