---
title: Spring Boot 快速开始
---

# Spring Boot 快速开始

Spring Boot 基于 Spring 框架，通过自动配置和起步依赖简化 Java 企业级应用搭建。

## 核心特性

- **自动配置**：根据类路径依赖自动配置 Spring 应用
- **起步依赖**：一站式依赖管理，如 `spring-boot-starter-web`
- **内嵌服务器**：内置 Tomcat、Jetty，无需部署 WAR
- **Actuator**：生产就绪的监控和管理端点

## Hello World

```java
@SpringBootApplication
@RestController
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello Spring Boot!";
    }
}
```

运行 `mvn spring-boot:run` 即可启动。
