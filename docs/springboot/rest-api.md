---
title: Spring Boot REST API 开发
---

# Spring Boot REST API 开发

Spring Boot 结合 Spring MVC 注解可以快速构建 RESTful 服务。

## 常用注解

- `@RestController`：标记 REST 控制器
- `@GetMapping` / `@PostMapping` / `@PutMapping` / `@DeleteMapping`：HTTP 方法映射
- `@PathVariable`：URL 路径变量
- `@RequestBody`：请求体绑定
- `@RequestParam`：查询参数

## CRUD 示例

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    public List<User> list() { /* ... */ }

    @GetMapping("/{id}")
    public User get(@PathVariable Long id) { /* ... */ }

    @PostMapping
    public User create(@RequestBody User user) { /* ... */ }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { /* ... */ }
}
```

建议封装统一的响应类，包含状态码、消息和数据。
