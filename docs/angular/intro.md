---
title: Angular 入门指南
---

# Angular 入门指南

Angular 是由 Google 维护的开源前端框架，基于 TypeScript 构建，适合开发大型企业级单页应用。

## 核心概念

- **组件（Components）**：Angular 应用的基本构建块
- **模块（Modules）**：通过 NgModule 组织组件、指令、管道和服务
- **服务与依赖注入**：Angular 内置强大的 DI 机制
- **路由（Router）**：支持懒加载、路由守卫等高级特性

## 环境搭建

```bash
npm install -g @angular/cli
ng new my-app
cd my-app
ng serve
```

## 第一个组件

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  template: '<h1>Hello Angular!</h1>',
})
export class HelloComponent {}
```
