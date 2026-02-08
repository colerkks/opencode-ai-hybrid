# Next.js 16 新 API 速查表

快速参考 - Next.js 16 新增 API

---

## 🔥 核心新 API

### 1. 'use cache' 指令
```typescript
'use cache'

export async function getData() {
  return fetch('https://api.example.com/data')
}
```

### 2. connection() - 强制动态渲染
```typescript
import { connection } from 'next/server'

export default async function Page() {
  await connection()
  return <div>Dynamic Content</div>
}
```

### 3. forbidden() / unauthorized()
```typescript
import { forbidden, unauthorized } from 'next/navigation'

if (!user) unauthorized()
if (!user.isAdmin) forbidden()
```

### 4. cacheLife() / cacheTag()
```typescript
import { cacheLife, cacheTag } from 'next/cache'

export async function getData() {
  'use cache'
  cacheLife({ hours: 1 })
  cacheTag('posts')
  return fetch('https://api.example.com/posts')
}
```

### 5. after() - 响应后执行
```typescript
import { after } from 'next/server'

export default async function Page() {
  after(async () => {
    await analytics.track('page_view')
  })
  return <div>Content</div>
}
```

### 6. 异步 cookies() / headers()
```typescript
import { cookies, headers } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')
  
  return <div>...</div>
}
```

---

## ⚠️ 关键变化

### Next.js 15+ 破坏性变更

1. **cookies() / headers() 变为异步**
   ```typescript
   // ❌ 旧写法
   const token = cookies().get('token')
   
   // ✅ 新写法
   const cookieStore = await cookies()
   const token = cookieStore.get('token')
   ```

2. **params 和 searchParams 变为异步**
   ```typescript
   // ❌ 旧写法
   export default function Page({ params }) {
     const { id } = params
   }
   
   // ✅ 新写法
   export default async function Page({ params }) {
     const { id } = await params
   }
   ```

---

## 📁 文件结构模板

```
my-app/
├── app/
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── loading.tsx        # 加载状态
│   ├── error.tsx          # 错误边界
│   ├── not-found.tsx      # 404
│   ├── globals.css        # 全局样式
│   ├── (auth)/            # 路由组
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   └── api/               # API 路由
│       └── route.ts
├── components/
│   ├── ui/               # 基础组件
│   └── features/         # 功能组件
├── lib/
│   └── utils.ts
├── hooks/
│   └── use-auth.ts
├── types/
│   └── index.ts
├── public/
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 常用命令

```bash
# 创建项目
npx create-next-app@latest my-app --typescript --tailwind --app

# 开发
npm run dev

# 构建
npm run build

# 生产启动
npm start

# 类型检查
npx tsc --noEmit

# 添加 AGENTS.md 文档
npx @next/codemod@canary agents-md
```

---

## 🔍 故障排除

| 问题 | 解决方案 |
|------|---------|
| cookies() 报错 | 添加 `await`：const cookieStore = await cookies() |
| params 报错 | 添加 `await`：const { id } = await params |
| 'use cache' 不生效 | 在 next.config.ts 中启用 experimental.dynamicIO |
| build 失败 | 检查所有异步 API 是否使用了 await |

---

## 📖 参考链接

- [Next.js Docs](https://nextjs.org/docs)
- [Next.js 15 Blog](https://nextjs.org/blog/next-15)
- [Next.js 16 Blog](https://nextjs.org/blog/next-16)
