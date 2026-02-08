# Next.js 项目结构与最佳实践

---

## App Router 文件约定

### 核心文件

| 文件 | 用途 |
|------|------|
| `page.tsx` | 页面组件，定义路由 UI |
| `layout.tsx` | 布局组件，包裹子路由 |
| `loading.tsx` | 加载状态 UI |
| `error.tsx` | 错误边界处理 |
| `not-found.tsx` | 404 页面 |
| `template.tsx` | 重新挂载的布局 |
| `default.tsx` | 并行路由的默认 UI |
| `route.ts` | API 路由处理器 |

### 特殊文件示例

**layout.tsx**
```typescript
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-layout">
      <nav>Dashboard Nav</nav>
      <main>{children}</main>
    </div>
  )
}
```

**loading.tsx**
```typescript
export default function Loading() {
  return (
    <div className="loading">
      <Spinner />
      <p>加载中...</p>
    </div>
  )
}
```

**error.tsx**
```typescript
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="error">
      <h2>出错了!</h2>
      <button onClick={() => reset()}>重试</button>
    </div>
  )
}
```

---

## 数据获取模式

### Server Component 获取数据

```typescript
// app/page.tsx
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 } // ISR: 1小时后重新验证
  })
  
  return <Component data={data} />
}
```

### Client Component 获取数据

```typescript
'use client'

import useSWR from 'swr'

export default function ClientComponent() {
  const { data, error } = useSWR('/api/data', fetcher)
  
  if (error) return <div>加载失败</div>
  if (!data) return <div>加载中...</div>
  
  return <div>{data}</div>
}
```

### Server Actions

```typescript
// app/actions.ts
'use server'

export async function createTodo(formData: FormData) {
  'use server'
  
  const title = formData.get('title')
  
  await db.todo.create({
    data: { title, completed: false }
  })
  
  revalidatePath('/todos')
}

// app/page.tsx
import { createTodo } from './actions'

export default function Page() {
  return (
    <form action={createTodo}>
      <input name="title" />
      <button type="submit">添加</button>
    </form>
  )
}
```

---

## 路由组与布局

### 路由组（不影响 URL）

```
app/
├── (marketing)/           # 路由组
│   ├── layout.tsx         # 营销页面专用布局
│   ├── page.tsx           # /
│   ├── about/
│   │   └── page.tsx       # /about
│   └── contact/
│       └── page.tsx       # /contact
├── (shop)/                # 另一个路由组
│   ├── layout.tsx         # 商城页面专用布局
│   ├── page.tsx           # /
│   └── products/
│       └── page.tsx       # /products
└── layout.tsx             # 根布局
```

### 平行路由（@folder）

```
app/
└── @team/
    ├── settings/
    │   └── page.tsx       # 并行显示 settings
    └── page.tsx           # 默认 team 视图
```

```typescript
// layout.tsx
export default function Layout({
  children,
  team,
}: {
  children: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <div className="flex">
      <div className="w-1/2">{children}</div>
      <div className="w-1/2">{team}</div>
    </div>
  )
}
```

---

## 拦截路由与模态框

### 拦截路由模式

```
app/
├── feed/
│   └── page.tsx           # 正常的 feed 页面
└── (.)feed/               # 从其他页面导航时拦截
    └── page.tsx           # 模态框版本
```

| 模式 | 用途 |
|------|------|
| `(.)` | 同一级别拦截 |
| `(..)` | 上一级拦截 |
| `(..)(..)` | 上两级拦截 |
| `(...)` | 从根拦截 |

---

## 缓存策略

### 全局缓存配置

```typescript
// next.config.js
module.exports = {
  experimental: {
    staleTimes: {
      dynamic: 30,    // 动态页面缓存30秒
      static: 180,    // 静态页面缓存3分钟
    },
  },
}
```

### 细粒度缓存控制

```typescript
import { revalidatePath, revalidateTag } from 'next/cache'

// 重新验证特定路径
revalidatePath('/posts')

// 重新验证带标签的缓存
revalidateTag('posts')

// 在 Server Action 中使用
export async function createPost(data: FormData) {
  'use server'
  
  await db.post.create({ data })
  
  revalidateTag('posts')
  revalidatePath('/posts')
}
```

---

## 图片优化

```typescript
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="/photo.jpg"
      alt="照片"
      width={800}
      height={600}
      priority        // 优先加载
      quality={75}    // 图片质量
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  )
}
```

### 远程图片

```typescript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
    ],
  },
}
```

---

## 字体优化

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

---

## 元数据 API

```typescript
import { Metadata } from 'next'

// 静态元数据
export const metadata: Metadata = {
  title: '页面标题',
  description: '页面描述',
  openGraph: {
    title: 'OG 标题',
    images: ['/og-image.png'],
  },
}

// 动态元数据
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id)
  
  return {
    title: product.name,
    description: product.description,
  }
}
```

---

## 中间件

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 检查认证
  const token = request.cookies.get('token')
  
  if (!token && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // 国际化
  const locale = request.headers.get('accept-language')?.split(',')[0]
  
  // 重写
  if (request.nextUrl.pathname === '/old-path') {
    return NextResponse.rewrite(new URL('/new-path', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## 测试

### Vitest 配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
})
```

### 组件测试

```typescript
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Page from './page'

test('Page', () => {
  render(<Page />)
  expect(screen.getByRole('heading', { level: 1 })).toBeDefined()
})
```

---

## 部署检查清单

- [ ] `output: 'export'` 仅在需要静态导出时
- [ ] 图片使用 `<Image>` 组件
- [ ] 环境变量已配置
- [ ] 错误边界已设置
- [ ] 加载状态已处理
- [ ] 元数据已配置
- [ ] 测试通过
- [ ] 构建成功
