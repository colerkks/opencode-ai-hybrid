---
name: nextjs-docs-router
version: 1.0.0
description: Next.js 文档检索路由与门禁 - 强制优先使用检索而非训练数据
author: rkkco
tags:
  - nextjs
  - documentation
  - routing
  - best-practices
agents:
  - opencode
  - cursor
  - claude-code
triggers:
  - next.js
  - nextjs
  - app router
  - server components
  - use cache
required_tools:
  - mcpx
---

# Next.js 文档检索路由与门禁

## 核心原则

**IMPORTANT: 对于任何 Next.js 任务，优先使用检索主导的推理而非预训练主导的推理。**

## 工作流程

### 1. 任务识别
当涉及以下关键词时，激活本 Skill：
- Next.js / Nextjs
- App Router
- Server Components
- Client Components
- 'use cache'
- cacheLife / cacheTag
- connection()
- forbidden() / unauthorized()
- after()
- cookies() / headers()

### 2. 强制检索流程

**步骤 1**: 检查 `.next-docs/` 目录
```bash
ls -la .next-docs/
```

**步骤 2**: 根据任务类型查阅对应文档

| 任务类型 | 查阅文档 |
|---------|---------|
| 'use cache' 指令 | `.next-docs/nextjs-16-api-reference.md` |
| connection() | `.next-docs/nextjs-16-api-reference.md` |
| cookies()/headers() | `.next-docs/nextjs-16-api-reference.md` |
| 项目结构 | `.next-docs/project-structure.md` |
| 快速参考 | `.next-docs/cheatsheet.md` |

**步骤 3**: 执行操作前确认
- 是否已查阅相关文档？
- 是否了解 API 的最新用法？
- 是否处理了破坏性变更？

### 3. 常见 API 速查

#### 'use cache' 指令
```typescript
// ✅ 正确：文件最顶部
'use cache'

import { cacheLife, cacheTag } from 'next/cache'

export async function getData() {
  cacheLife({ stale: 3600, revalidate: 3600, expire: 86400 })
  cacheTag('posts')
  return fetch('https://api.example.com/data')
}
```

#### connection() - 强制动态渲染
```typescript
import { connection } from 'next/server'

export default async function Page() {
  await connection()
  return <div>Dynamic Content</div>
}
```

#### 异步 cookies()/headers()
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

### 4. 错误预防

#### 错误 1: 'use cache' 位置错误
**诊断**: 构建时报错 "The 'use cache' directive must be at the top of the file"  
**解决**: 'use cache' 必须位于文件最顶部，任何代码之前

#### 错误 2: cookies() 同步调用
**诊断**: TypeScript 报错或运行时 cookie 值为 undefined  
**解决**: 使用 `await cookies()`，cookies() 是异步函数

#### 错误 3: 缺少 Suspense 边界
**诊断**: 构建报错 "Uncached data was accessed outside of <Suspense>"  
**解决**: 为动态页面添加 `loading.tsx`

### 5. 验证清单

实施变更后，验证：
- [ ] 代码遵循 Next.js 16 最佳实践
- [ ] 已查阅 `.next-docs/` 相关文档
- [ ] 无 TypeScript 错误
- [ ] 构建通过 (`npm run build`)
- [ ] 类型检查通过 (`npx tsc --noEmit`)

## 依赖

- mcpx (用于按需工具发现)
- .next-docs/ 目录 (项目级文档索引)

## 迭代记录

| 日期 | 版本 | 变更 |
|------|------|------|
| 2026-02-08 | 1.0.0 | 初始版本，集成 Next.js 16 新 API |

## 参考

- [Next.js 官方文档](https://nextjs.org/docs)
- [Vercel AGENTS.md 研究](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)
