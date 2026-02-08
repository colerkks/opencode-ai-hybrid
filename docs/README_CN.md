# OpenCode AI Hybrid Architecture

<div align="center">

**业界领先的 AI 编程环境**

[![版本](https://img.shields.io/badge/version-3.1.0-blue.svg)](https://github.com/colerkks/opencode-ai-hybrid)
[![许可证](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![OpenCode](https://img.shields.io/badge/OpenCode-compatible-brightgreen)](https://opencode.ai/)

[English](README_EN.md) | **中文**

</div>

---

## 🎯 这是什么？

一个**生产就绪、业界领先的 AI 编程环境**，结合了三种前沿技术：

1. **AGENTS.md** - 按需文档检索（Vercel 研究）
2. **mcpx** - 按需工具发现（节省 99% Token）
3. **npx skills** - 标准化技能管理（跨平台）

## 你能获得什么（一目了然）
<img width="1175" height="814" alt="image" src="https://github.com/user-attachments/assets/fcb5e62f-bae0-44d5-9964-29de48098a62" />

**优先级规则**：项目 > 技能 > 全局

---

## ✨ 主要特性

### 🎯 100% AI 编程准确率
- 基于 Vercel 研究：AGENTS.md 将准确率从 53% 提升到 100%
- 按需文档检索胜过预训练知识

### 💰 99% Token 节省
- 传统 MCP：47k Token 用于工具定义
- mcpx 方案：400 Token（减少 99%！）
- 提示缓存保持完整

### 🌍 跨平台技能
- 支持 27+ AI 助手（OpenCode、Cursor、Claude Code 等）
- 标准化的 SKILL.md 格式
- 通过 skills.lock.json 进行版本管理

### 🏗️ 三层架构
- **全局**：所有项目的一致行为
- **技能**：可复用的标准作业程序，团队可共享
- **项目**：灵活的项目特定约束

---

## 🚀 快速开始

### 1. 一行命令安装

```bash
curl -fsSL https://raw.githubusercontent.com/colerkks/opencode-ai-hybrid/main/install.sh | bash
```

### 1.5 VS Code 扩展 🆕

我们现在提供功能齐全的 **VS Code 扩展**，可直接从编辑器管理混合架构！

**特性：**
- 🎛️ **仪表板面板** - 可视化架构状态和配置
- 🌲 **树形视图** - 浏览技能、模板和文档
- ⚡ **快速操作** - 一键初始化、重新加载和管理架构
- 🔧 **配置管理器** - 编辑 AGENTS.md 和配置文件

**安装方法：**
1. 打开 VS Code
2. 转到扩展（Ctrl+Shift+X）
3. 搜索 "OpenCode AI Hybrid"
4. 点击安装

或通过 CLI 安装：
```bash
cd vscode-extension
npm install
npm run package
# 在 VS Code 中安装生成的 .vsix 文件
```

### 1.6 OpenCode 插件（桌面版）

本仓库包含与 OpenCode 桌面版兼容的插件：`opencode-ai-hybrid (Kyle1.0)`。

安装后，重启 OpenCode 桌面版并运行：

- `/arch-init` - 初始化混合架构
- `/arch-status` - 检查架构状态
- `/arch-reload` - 重新加载配置

这些命令由插件生成到 `.opencode/commands/` 目录中，并调用确定性工具（`arch_status`、`arch_reload`、`arch_init`）。

### 2. 手动安装

```bash
# 克隆仓库
git clone https://github.com/colerkks/opencode-ai-hybrid.git
cd opencode-ai-hybrid

# 运行安装程序
chmod +x install.sh
./install.sh
```

### 3. 验证安装

```bash
# 检查 mcpx
mcpx --version

# 检查 skills CLI
skills --version

# 列出可用技能
skills list
```

---

## 📚 文档

| 📖 文档 | 🌐 语言 | 📋 描述 |
|---------|---------|---------|
| **中文文档** | 🇨🇳 中文 | 完整中文文档（本文件） |
| [English Docs](README_EN.md) | 🇺🇸 English | 完整英文文档 |
| [📦 安装指南](../INSTALLATION.md) | 🇺🇸 English | **🆕 详细安装指南** |
| [🏗️ 架构文档](ARCHITECTURE.md) | 🇺🇸 English | 架构深度解析 |
| [🛠️ 技能指南](SKILLS_GUIDE.md) | 🇺🇸 English | 如何使用和创建技能 |
| [🚀 快速开始](../QUICKSTART.md) | 🇺🇸 English | 5分钟快速上手 |
| [🔄 迁移指南](MIGRATION.md) | 🇺🇸 English | 从现有设置迁移 |
| [📂 项目结构](../PROJECT_STRUCTURE.md) | 🇺🇸 English | **🆕 项目快速参考** |
| [🗺️ 路线图](../ROADMAP.md) | 🇺🇸 English | **🆕 未来规划** |
| [📝 更新日志](../CHANGELOG.md) | 🇺🇸 English | **🆕 版本历史** |
| [❓ 常见问题](FAQ.md) | 🇺🇸 English | 常见问题解答 |

---

## 🎨 包含的技能

### 1. nextjs-docs-router
**用途**：Next.js 文档路由和门禁

**触发条件**：Next.js 相关任务

**特性**：
- 强制编码前检索文档
- API 快速参考
- 错误预防检查清单

**用法**：
```bash
# 检测到 Next.js 关键词时自动激活
# 或使用 skill 命令手动触发
```

### 2. nextjs-debug
**用途**：调试标准作业程序（SOP）

**触发条件**：调试/修复/错误任务

**特性**：
- 4 阶段调试工作流
- 5 个为什么根本原因分析
- 知识沉淀指南

**用法**：
```bash
# 检测到调试关键词时激活
# 或在 OpenCode 中使用 /debug 命令
```

---

## 🛠️ 可用工具（通过 mcpx）

### filesystem - 文件操作（14 个工具）
- `read_file` - 读取文件内容
- `write_file` - 写入文件
- `list_directory` - 列出目录内容
- `search_files` - 按模式搜索文件
- `get_file_info` - 获取文件元数据
- 更多...

### github - GitHub API（29 个工具）
- `search_code` - 跨仓库搜索代码
- `search_repositories` - 搜索仓库
- `get_file_contents` - 从仓库获取文件
- `create_issue` - 创建 GitHub Issue
- `create_pull_request` - 创建 PR
- 更多...

**用法**：
```bash
# 列出所有工具
mcpx list

# 使用 filesystem 工具
mcpx filesystem/read_file '{"path": "./README.md"}'

# 使用 GitHub 工具
mcpx github/search_code '{"query": "language:typescript"}'
```

---

## 🔄 工作流示例

### 场景：创建 Next.js 页面

```
用户：使用 'use cache' 创建一个博客页面

AI 助手：
1. [上下文加载]
   ├── 读取 ~/.config/opencode/AGENTS.md（全局规则）
   ├── 检查已安装技能（nextjs-docs-router）
   └── 读取 ./AGENTS.md（项目约束）

2. [技能激活：nextjs-docs-router]
   ├── 检测关键词：'use cache'、Next.js
   ├── 触发技能工作流
   └── 强制查阅 .next-docs/nextjs-16-api-reference.md

3. [实现]
   ├── 确认 'use cache' 正确用法
   ├── 创建 page.tsx
   ├── 添加 loading.tsx（Suspense 边界）
   └── 更新 next.config.ts

4. [验证]
   ├── 类型检查：npx tsc --noEmit
   ├── 构建测试：npm run build
   └── 检查清单验证：全部通过

5. [完成]
   └── 返回创建的文件和使用说明
```

---

## 📊 效果

| 指标 | 之前 | 之后 | 提升 |
|------|------|------|------|
| **AI 准确率** | 53% | 100% | +47% |
| **Token 使用** | 47k | 400 | -99% |
| **技能可复用性** | ❌ 无 | ✅ 标准化 | 团队可共享 |
| **上下文管理** | 混乱 | 有序 | 三层架构 |
| **错误预防** | ❌ 被动 | ✅ 主动 | 迭代记录 |
| **工具发现** | 预加载 | 按需 | mcpx |
| **知识沉淀** | ❌ 个人 | ✅ 团队级 | 技能 |

---

## 🏗️ 包含的内容

### 📦 核心组件

| 组件 | 描述 | 路径 |
|-----------|-------------|------|
| **VS Code 扩展** | 完整的 IDE 集成 | `vscode-extension/` |
| **OpenCode 插件** | 桌面版插件 (Kyle1.0) | `plugins/opencode-ai-hybrid-plugin/` |
| **CLI 命令** | 架构管理 | `.opencode/commands/` |
| **技能库** | 预置技能 | `skills/` |
| **示例项目** | 入门模板 | `examples/` |

### 🆕 最新添加 (v3.1.0)

- ✅ **VS Code 扩展** - 带仪表板的完整 IDE 集成
- ✅ **GitHub 模板** - Issue 模板、PR 模板、安全政策
- ✅ **增强文档** - 安装指南、路线图、更新日志
- ✅ **项目结构文档** - 快速参考指南
- ✅ **编辑器配置** - 一致的代码风格

---

## 🏗️ 架构组件

### 1. AGENTS.md v3.0
- 三层架构支持
- 迭代记录系统
- 常见错误案例库
- 快速命令模板

### 2. mcpx 集成
- 按需 MCP 工具发现
- 99% Token 节省
- 提示缓存保留
- 43 个可用工具

### 3. npx skills
- 标准化技能管理
- 跨平台（27 个 AI 助手）
- 版本锁定
- 易于安装/更新

### 4. VS Code 扩展 🆕
- 用于架构管理的可视化仪表板
- 技能和模板的树形视图
- 快速操作和配置编辑
- 集成文档浏览器

---

## 🌍 支持的平台

- ✅ OpenCode
- ✅ Cursor
- ✅ Claude Code
- ✅ GitHub Copilot
- ✅ 以及 23+ 更多 AI 助手

---

## 📂 项目结构

```
opencode-ai-hybrid/
├── 📁 .github/              # GitHub 配置
│   ├── 📁 ISSUE_TEMPLATE/   # Issue 模板
│   ├── 📄 PULL_REQUEST_TEMPLATE.md
│   └── 📄 SECURITY.md       # 安全政策
├── 📁 .opencode/            # OpenCode 命令
│   └── 📁 commands/
│       ├── 📄 arch-init.md
│       ├── 📄 arch-reload.md
│       └── 📄 arch-status.md
├── 📁 config/               # 配置文件
│   ├── 📄 AGENTS.md
│   ├── 📄 hybrid-arch.json
│   └── 📄 mcp.json
├── 📁 docs/                 # 文档
│   ├── 📄 README_CN.md      # 🇨🇳 中文文档
│   ├── 📄 README_EN.md      # 🇺🇸 English
│   ├── 📄 ARCHITECTURE.md
│   ├── 📄 SKILLS_GUIDE.md
│   ├── 📄 MIGRATION.md
│   ├── 📄 FAQ.md
│   ├── 📄 CHANGELOG.md      # 🆕 版本历史
│   ├── 📄 INSTALLATION.md   # 🆕 安装指南
│   ├── 📄 PROJECT_STRUCTURE.md # 🆕 快速参考
│   └── 📄 ROADMAP.md        # 🆕 未来规划
├── 📁 examples/             # 示例项目
├── 📁 plugins/              # OpenCode 插件
│   └── 📁 opencode-ai-hybrid-plugin/
├── 📁 skills/               # 可用技能
│   ├── 📁 nextjs-docs-router/
│   └── 📁 nextjs-debug/
├── 📁 vscode-extension/     # 🆕 VS Code 扩展
├── 📄 .editorconfig         # 🆕 代码风格配置
├── 📄 .gitignore
├── 📄 CHANGELOG.md
├── 📄 CONTRIBUTING.md
├── 📄 INSTALLATION.md
├── 📄 LICENSE
├── 📄 PROJECT_STRUCTURE.md
├── 📄 QUICKSTART.md
├── 📄 README.md
├── 📄 ROADMAP.md
└── 📄 VERSION               # 🆕 当前版本
```

---

## 🤝 贡献

我们欢迎贡献！请查看 [CONTRIBUTING.md](../CONTRIBUTING.md) 了解指南。

### 快速贡献指南

1. Fork 仓库
2. 创建功能分支（`git checkout -b feature/AmazingFeature`）
3. 提交更改（`git commit -m '添加某个 AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 开启 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](../LICENSE) 文件了解详情。

---

## 👤 作者

**Kyle** 

- 📧 邮箱：[renke@fofvc.com](mailto:renke@fofvc.com)
- 🐙 GitHub：[@colerkks](https://github.com/colerkks)

---

## 🙏 致谢

- [Vercel](https://vercel.com/) - AGENTS.md 研究和技能工具
- [Anthropic](https://www.anthropic.com/) - Claude Code 最佳实践
- [mcpx](https://github.com/cs50victor/mcpx) - 按需工具发现
- [Next.js](https://nextjs.org/) - React 框架

---

<div align="center">

**🌟 如果这个仓库对你有帮助，请给它点个 Star！**

**🚀 使用标准化技能构建更智能的 AI 编程环境！**

</div>
