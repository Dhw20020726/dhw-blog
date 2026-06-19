---
title: React 入门教程
---

# React 入门教程

React 是 Meta 开发的用于构建用户界面的 JavaScript 库。

## 核心概念

- **JSX**：JavaScript 语法扩展，允许在 JS 中编写 HTML 标记
- **组件**：函数组件是 React 的首选方式
- **状态管理**：通过 `useState` Hook 管理状态
- **副作用**：通过 `useEffect` Hook 处理数据获取、订阅等

## 创建项目

```bash
npm create vite@latest my-app -- --template react
```

## 第一个组件

```jsx
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return <Welcome name="React" />;
}
```
