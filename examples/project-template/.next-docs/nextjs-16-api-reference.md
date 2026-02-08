# Next.js 16 新 API 参考

> 这些 API 在模型训练数据中不存在，必须通过检索获取

---

## 1. 'use cache' 指令

用于标记函数或组件为可缓存。

### 基本用法

```typescript
'use cache'

export async function getData() {
  // 此函数的结果会被自动缓存
  return fetch('https://api.example.com/data')
}
```

### 在组件中使用

```typescript
'use cache'

export default async function CachedComponent() {
  const data = await getData()
  return <div>{data}</div>
}
```

---

## 2. connection() - 动态渲染标记

强制页面使用动态渲染。

```typescript
import { connection } from 'next/server'

export default async function Page() {
  await connection() // 强制动态渲染
  
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store'
  })
  
  return <div>{data}</div>
}
```

**用途**：当你需要确保某些动态数据在每次请求时都被获取时使用。

---

## 3. forbidden() / unauthorized()

用于处理权限相关的导航。

```typescript
import { forbidden, unauthorized } from 'next/navigation'

export default async function AdminPage() {
  const user = await getUser()
  
  if (!user) {
    unauthorized() // 触发 401 未授权页面
  }
  
  if (!user.isAdmin) {
    forbidden() // 触发 403 禁止访问页面
  }
  
  return <div>Admin Panel</div>
}
```

### 配合 error.tsx 使用

```typescript
// app/unauthorized.tsx
export default function Unauthorized() {
  return (
    <div>
      <h1>401 - Unauthorized</h1>
      <p>请先登录</p>
    </div>
  )
}

// app/forbidden.tsx  
export default function Forbidden() {
  return (
    <div>
      <h1>403 - Forbidden</h1>
      <p>你没有权限访问此页面</p>
    </div>
  )
}
```

---

## 4. cacheLife() / cacheTag()

精细控制缓存行为。

```typescript
import { cacheLife, cacheTag } from 'next/cache'

export async function getPosts() {
  'use cache'
  
  // 设置缓存生命周期
  cacheLife({
    stale: 3600,    // 1小时后变为 stale
    revalidate: 900, // 15分钟后重新验证
    expire: 86400    // 24小时后过期
  })
  
  // 添加缓存标签，用于手动刷新
  cacheTag('posts')
  
  return fetch('https://api.example.com/posts')
}
```

### 配合 updateTag() 使用

```typescript
import { updateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  'use server'
  
  // 创建新文章
  await db.posts.create({
    title: formData.get('title'),
    content: formData.get('content')
  })
  
  // 刷新缓存
  updateTag('posts')
  
  revalidatePath('/posts')
}
```

---

## 5. after() - 响应后执行

在发送响应后执行代码，适合日志、分析等不影响响应的操作。

```typescript
import { after } from 'next/server'

export default async function Page() {
  const data = await fetchData()
  
  // 在发送响应后执行
  after(async () => {
    await analytics.track('page_view', {
      path: '/dashboard',
      userId: data.userId
    })
    
    await logger.info('Page rendered', {
      duration: Date.now() - startTime
    })
  })
  
  return <Dashboard data={data} />
}
```

**注意**：`after()` 中的代码不会阻塞响应发送。

---

## 6. 异步 cookies() / headers()

Next.js 15+ 中 `cookies()` 和 `headers()` 变为异步函数。

```typescript
import { cookies, headers } from 'next/headers'

export default async function Page() {
  // 注意：需要使用 await
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')
  
  return (
    <div>
      <p>Token: {token?.value}</p>
      <p>User Agent: {userAgent}</p>
    </div>
  )
}
```

### 在 Server Actions 中使用

```typescript
'use server'

import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const cookieStore = await cookies()
  
  // 设置 cookie
  cookieStore.set('token', 'abc123', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  })
}
```

---

## 7. 动态 API 标记

使用 `dynamic` 导出控制路由行为。

```typescript
// 强制动态渲染
export const dynamic = 'force-dynamic'

// 强制静态渲染
export const dynamic = 'force-static'

// 自动决定（默认）
export const dynamic = 'auto'

export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}
```

---

## 8. 配置文件更新

使用 `'use cache'` 需要在 `next.config.ts` 中启用：

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,  // 启用动态 IO 和缓存功能
  },
}

export default nextConfig
```

---

## 参考

- [Next.js 官方文档](https://nextjs.org/docs)
- [Next.js 15/16 发布说明](https://nextjs.org/blog)
