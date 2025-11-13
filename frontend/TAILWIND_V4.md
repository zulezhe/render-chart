# Tailwind CSS v4 升级指南

本项目已升级到 Tailwind CSS v4.1.17，这是 Tailwind CSS 的最新版本，带来了许多重要的改进和新功能。

## 🚀 主要变化

### 1. 配置文件格式

**v3 (旧版本)**:
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**v4 (新版本)**:
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
```

### 2. CSS 导入方式

**v3 (旧版本)**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**v4 (新版本)**:
```css
@import "tailwindcss";
```

### 3. 改进的样式组织

我们创建了一个集中的样式系统 (`src/lib/utils.ts`):

```typescript
// 常用样式组合
export const styles = {
  button: {
    base: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium...',
    variants: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      // ...
    },
    sizes: {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      // ...
    },
  },
  card: {
    base: 'rounded-lg border bg-card text-card-foreground shadow-sm',
    header: 'flex flex-col space-y-1.5 p-6',
    // ...
  },
  // ...
}
```

### 4. 动画系统改进

内置的动画助手：

```typescript
export const animations = {
  fadeIn: 'animate-fade-in',
  slideDown: 'animate-slide-down',
  scaleUp: 'animate-scale-up',
  hoverLift: 'hover:scale-105 transition-transform duration-200',
  cardShadow: 'shadow-card hover:shadow-lg transition-shadow duration-300',
}
```

## 📦 组件更新方式

### Button 组件

**使用新的样式系统**:
```typescript
import { styles } from "@/lib/utils"

const buttonVariants = cva(
  styles.button.base,  // 使用预定义的基础样式
  {
    variants: {
      variant: {
        default: styles.button.variants.default,
        secondary: styles.button.variants.secondary,
        // ...
      },
      size: {
        default: styles.button.sizes.default,
        sm: styles.button.sizes.sm,
        // ...
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Card 组件

**使用新的样式系统和动画**:
```typescript
import { styles, animations } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        styles.card.base,        // 使用预定义的卡片基础样式
        animations.cardShadow,   // 添加卡片阴影动画
        className
      )}
      {...props}
    />
  )
)
```

## 🎨 样式变体生成器

创建了一个便利的样式变体生成器：

```typescript
export function styleVariants<T extends Record<string, string>>(variants: T) {
  return (key: keyof T, defaultClass = '') => {
    return variants[key] || defaultClass
  }
}

// 使用示例
const buttonStyles = styleVariants({
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  secondary: 'bg-gray-500 text-white hover:bg-gray-600',
})

const className = buttonStyles('primary') // 'bg-blue-500 text-white hover:bg-blue-600'
```

## 🔧 迁移步骤

1. **配置文件更新**: ✅ 已完成
   - 将 `tailwind.config.js` 重命名为 `tailwind.config.ts`
   - 添加 TypeScript 类型导入
   - 使用 `satisfies Config` 确保类型安全

2. **CSS 导入更新**: ✅ 已完成
   - 将三个 `@tailwind` 指令替换为单个 `@import "tailwindcss"`

3. **样式系统重构**: ✅ 已完成
   - 创建集中的样式定义
   - 添加动画助手
   - 创建响应式助手

4. **组件更新**: ✅ 已部分完成
   - Button 组件已更新
   - Card 组件已更新
   - 其他组件可以按相同模式更新

## 🎯 优势

1. **更好的 TypeScript 支持**: 配置文件现在是 TypeScript 原生支持
2. **更简洁的 CSS 导入**: 单个导入语句替代三个指令
3. **更好的样式组织**: 集中的样式系统便于维护
4. **改进的开发体验**: 更好的类型安全和自动补全
5. **性能优化**: v4 带来了构建时和运行时的性能改进

## 🛠️ 开发建议

1. **使用预定义样式**: 优先使用 `styles` 对象中的预定义样式
2. **保持一致性**: 新组件应该遵循相同的模式
3. **利用动画系统**: 使用 `animations` 对象中的预定义动画
4. **渐进式迁移**: 可以逐步将现有组件迁移到新的样式系统

## 📚 更多信息

- [Tailwind CSS v4 官方文档](https://tailwindcss.com/docs/v4-beta)
- [迁移指南](https://tailwindcss.com/docs/v4-beta/migrating)
- [新功能介绍](https://tailwindcss.com/docs/v4-beta/new-features)