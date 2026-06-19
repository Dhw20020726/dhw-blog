---
title: Angular 组件详解
---

# Angular 组件详解

组件是 Angular 应用的核心。每个组件由 TypeScript 类、HTML 模板和 CSS 样式三部分组成。

## 组件装饰器

```typescript
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {
  @Input() user: User;
  @Output() updated = new EventEmitter<User>();
}
```

## 数据绑定

- **插值** `{{ value }}`
- **属性绑定** `[property]="value"`
- **事件绑定** `(event)="handler()"`
- **双向绑定** `[(ngModel)]="value"`

## 组件通信

父子组件通过 `@Input()` 和 `@Output()` 传递数据，不相关组件使用共享服务通信。
