---
name: nextjs-debug
version: 1.0.0
description: Next.js 调试标准作业流程 - 系统化诊断和修复问题
author: rkkco
tags:
  - nextjs
  - debugging
  - troubleshooting
  - best-practices
agents:
  - opencode
  - cursor
  - claude-code
triggers:
  - debug
  - fix
  - error
  - build fail
  - typescript error
required_tools:
  - mcpx
---

# Next.js 调试标准作业流程 (SOP)

## 目标

提供系统化的 Next.js 问题诊断和修复流程，确保：
1. 快速定位问题根本原因
2. 实施最小化修复
3. 更新知识库防止复发

## 触发条件

当遇到以下情况时激活本 Skill：
- 构建失败 (`npm run build`)
- TypeScript 错误
- 运行时错误
- 新 API 不生效
- 缓存问题
- Suspense 错误

## 调试流程

### 阶段 1: 信息收集 (2分钟)

**1.1 收集错误信息**
```bash
# 完整错误日志
npm run build 2>&1 | tee build.log

# TypeScript 检查
npx tsc --noEmit 2>&1 | tee ts.log
```

**1.2 识别错误类型**
- [ ] 构建错误 (Build error)
- [ ] 类型错误 (Type error)
- [ ] 运行时错误 (Runtime error)
- [ ] 警告 (Warning)

**1.3 收集上下文**
- Next.js 版本: `package.json` 中的 `next`
- React 版本: `package.json` 中的 `react`
- 相关文件路径
- 最近的变更

### 阶段 2: 问题诊断 (3分钟)

**2.1 查阅 AGENTS.md 错误案例库**

检查全局 AGENTS.md 的 `## ❌ 常见错误案例库`：

| 错误关键词 | 对应案例 |
|-----------|---------|
| 'use cache' must be at the top | 错误 1: 'use cache' 位置错误 |
| cookies() undefined | 错误 2: cookies() 同步调用 |
| Date.now() before accessing dynamic data | 错误 3: Server Component 中使用 Date.now() |
| outside of <Suspense> | 错误 4: 缺少 loading.tsx |
| cacheLife Object literal may only specify known properties | 错误 5: cacheLife 参数格式错误 |

**2.2 查阅项目文档**
检查 `.next-docs/` 目录：
```bash
# 根据错误类型查阅
ls .next-docs/
cat .next-docs/nextjs-16-api-reference.md | grep -A 5 "错误关键词"
```

**2.3 分析根本原因**
使用 5 Whys 方法：
1. 发生了什么错误？
2. 为什么会发生？
3. 为什么会导致这个问题？
4. 更深层的根本原因是什么？
5. 如何系统性防止？

### 阶段 3: 修复实施 (5分钟)

**3.1 最小化修复原则**
- ✅ 只修改必要的代码
- ✅ 保持原有架构
- ❌ 不要借机重构
- ❌ 不要引入新功能

**3.2 修复检查清单**

修复前：
- [ ] 已理解根本原因
- [ ] 已查阅相关文档
- [ ] 已确定修复方案

修复中：
- [ ] 一次只改一个地方
- [ ] 保留修改记录

修复后：
- [ ] 构建通过
- [ ] 类型检查通过
- [ ] 功能验证通过

**3.3 常见修复模板**

#### 修复: 'use cache' 位置
```typescript
// ❌ 错误
import { cacheLife } from 'next/cache'
'use cache'

// ✅ 正确
'use cache'
import { cacheLife } from 'next/cache'
```

#### 修复: cookies() 异步
```typescript
// ❌ 错误
const token = cookies().get('token')

// ✅ 正确
const cookieStore = await cookies()
const token = cookieStore.get('token')
```

#### 修复: 添加 loading.tsx
```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  )
}
```

### 阶段 4: 验证与记录 (2分钟)

**4.1 验证修复**
```bash
# 1. 类型检查
npx tsc --noEmit

# 2. 构建测试
npm run build

# 3. 功能验证
# （根据具体情况）
```

**4.2 更新知识库**

根据修复的通用性，决定记录位置：

**如果问题具有通用性** → 更新 Skill：
```bash
# 编辑 ~/opencode-skills/skills/nextjs-debug/SKILL.md
# 添加新的错误案例到 "常见修复模板"
```

**如果问题与项目特定** → 更新项目 AGENTS.md：
```bash
# 编辑 ./AGENTS.md
# 添加新的迭代记录
```

**如果问题是个人经验** → 更新全局 AGENTS.md：
```bash
# 编辑 ~/.config/opencode/AGENTS.md
# 添加新的迭代记录和错误案例
```

**4.3 记录格式**

```markdown
## 🔄 迭代记录（持续更新）

| 日期 | 问题描述 | 根本原因 | 解决方案 | 状态 |
|------|---------|---------|---------|------|
| 2026-02-08 | [新问题] | [原因] | [方案] | ✅ |
```

## 工具使用

### 使用 mcpx 辅助调试

```bash
# 查看文件信息
mcpx filesystem/get_file_info '{"path": "./next.config.ts"}'

# 读取构建日志
mcpx filesystem/read_file '{"path": "./build.log"}'

# 搜索相关文件
mcpx filesystem/search_files '{"path": ".", "pattern": "*.tsx"}'
```

## 升级路径

### 从旧版本迁移

如果遇到旧代码需要迁移：

1. **识别版本差异**
   - 检查 `package.json` 中的 Next.js 版本
   - 查阅 `.next-docs/` 中的版本升级文档

2. **逐步迁移**
   - 一次迁移一个 API
   - 每次迁移后验证
   - 记录迁移经验

3. **验证清单**
   - [ ] 所有页面正常渲染
   - [ ] 所有 API 路由正常工作
   - [ ] 构建无警告
   - [ ] 性能无退化

## 依赖

- AGENTS.md (全局/项目级配置)
- .next-docs/ (项目级文档)
- mcpx (按需工具发现)

## 验收标准

调试任务完成的标准：
- [ ] 问题已定位根本原因
- [ ] 修复已实施并验证
- [ ] 知识库已更新
- [ ] 无回归问题
- [ ] 经验已沉淀（Skill/项目/全局）

## 迭代记录

| 日期 | 版本 | 变更 |
|------|------|------|
| 2026-02-08 | 1.0.0 | 初始版本，建立系统化调试流程 |

## 参考

- [Claude Code 最佳实践](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Next.js 升级指南](https://nextjs.org/docs/app/building-your-application/upgrading)
