---
title: React Hooks 详解
---

# React Hooks 详解

Hooks 是 React 16.8 引入的特性，让函数组件拥有状态和生命周期能力。

## useState

```jsx
const [count, setCount] = useState(0);
```

## useEffect

```jsx
useEffect(() => {
  document.title = `点击了 ${count} 次`;
  return () => { /* 清理 */ };
}, [count]);
```

## useContext

```jsx
const ThemeContext = createContext('light');
const theme = useContext(ThemeContext);
```

## 自定义 Hook

```jsx
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return size;
}
```

**注意**：只在函数组件顶层调用 Hook，不要在循环或条件中调用。
