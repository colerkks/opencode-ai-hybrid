<div align="center">

# 🚀 OpenCode AI Hybrid Architecture

**The Industry-Leading AI Programming Environment**

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/colerkks/opencode-ai-hybrid)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![OpenCode](https://img.shields.io/badge/OpenCode-compatible-brightgreen)](https://opencode.ai/)

**[中文](docs/README_CN.md)** | [English](README_EN.md)

</div>

---

## 🎯 What is This?

A **production-ready, industry-leading AI programming environment** that combines three cutting-edge technologies:

1. **AGENTS.md** - Document-on-demand retrieval (Vercel Research)
2. **mcpx** - Tool-on-demand discovery (99% token savings)
3. **npx skills** - Standardized skill management (Cross-platform)

### The Hybrid Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Project Layer (Highest Priority)                           │
│  ├── AGENTS.md              # Project-specific rules        │
│  ├── .next-docs/            # Documentation index           │
│  └── skills.lock.json       # Skill version locking         │
├─────────────────────────────────────────────────────────────┤
│  Skill Layer (Middle Priority)                              │
│  ├── nextjs-docs-router     # Next.js documentation routing │
│  ├── nextjs-debug          # Debug SOP                      │
│  └── [More skills...]      # Extensible                     │
├─────────────────────────────────────────────────────────────┤
│  Global Layer (Base Priority)                               │
│  ├── AGENTS.md             # Global behavior rules          │
│  ├── mcpx config           # On-demand tool discovery       │
│  └── npx skills            # Skill management               │
└─────────────────────────────────────────────────────────────┘
```

**Priority Rule**: Project > Skill > Global

---

## ✨ Key Features

### 🎯 100% AI Coding Accuracy
- Based on Vercel research: AGENTS.md improves accuracy from 53% to 100%
- Document-on-demand retrieval beats pre-trained knowledge

### 💰 99% Token Savings
- Traditional MCP: 47k tokens for tool definitions
- mcpx approach: 400 tokens (99% reduction!)
- Prompt cache stays intact

### 🌍 Cross-Platform Skills
- Works with 27+ AI assistants (OpenCode, Cursor, Claude Code, etc.)
- Standardized SKILL.md format
- Version management with skills.lock.json

### 🏗️ Three-Layer Architecture
- **Global**: Consistent behavior across all projects
- **Skill**: Reusable SOPs, team sharable
- **Project**: Flexible project-specific constraints

---

## 🚀 Quick Start

### 1. One-Line Installation

```bash
curl -fsSL https://raw.githubusercontent.com/colerkks/opencode-ai-hybrid/main/install.sh | bash
```

### 2. Manual Installation

```bash
# Clone the repository
git clone https://github.com/colerkks/opencode-ai-hybrid.git
cd opencode-ai-hybrid

# Run installer
chmod +x install.sh
./install.sh
```

### 3. Verify Installation

```bash
# Check mcpx
mcpx --version

# Check skills CLI
skills --version

# List available skills
skills list
```

---

## 📚 Documentation

### 🚀 Quick Access

| 📖 Document | 🌐 Language | 📋 Description |
|-------------|-------------|----------------|
| [中文完整文档](docs/README_CN.md) | 🇨🇳 中文 | 完整的架构说明、安装指南和使用教程 |
| [English Docs](docs/README_EN.md) | 🇺🇸 English | Complete architecture guide and documentation |
| [Architecture](docs/ARCHITECTURE.md) | 🇺🇸 English | Deep dive into three-layer architecture |
| [Skills Guide](docs/SKILLS_GUIDE.md) | 🇺🇸 English | Create and use skills guide |
| [Migration Guide](docs/MIGRATION.md) | 🇺🇸 English | Migrate from existing setups |
| [FAQ](docs/FAQ.md) | 🇺🇸 English | Frequently asked questions |

### 📁 Document Structure

```
docs/
├── README_CN.md        # 中文文档 (Complete Chinese)
├── README_EN.md        # English Docs (Complete English)
├── ARCHITECTURE.md     # Architecture deep dive
├── SKILLS_GUIDE.md     # Skill creation guide
├── MIGRATION.md        # Migration instructions
└── FAQ.md              # 15+ Q&A
```

---

## 🎨 Included Skills

### 1. nextjs-docs-router
**Purpose**: Next.js documentation routing and gating

**Triggers**: Next.js related tasks

**Features**:
- Forces document retrieval before coding
- API quick reference
- Error prevention checklist

**Usage**:
```bash
# Automatically activated when Next.js keywords detected
# Or manually trigger with skill command
```

### 2. nextjs-debug
**Purpose**: Debug standard operating procedure (SOP)

**Triggers**: Debug/fix/error tasks

**Features**:
- 4-phase debug workflow
- 5 Whys root cause analysis
- Knowledge沉淀 guidelines

**Usage**:
```bash
# Activated when debug keywords detected
# Or use /debug command in OpenCode
```

---

## 🛠️ Available Tools (via mcpx)

### filesystem - File Operations (14 tools)
- `read_file` - Read file contents
- `write_file` - Write to file
- `list_directory` - List directory contents
- `search_files` - Search files by pattern
- `get_file_info` - Get file metadata
- And more...

### github - GitHub API (29 tools)
- `search_code` - Search code across repos
- `search_repositories` - Search repositories
- `get_file_contents` - Get file from repo
- `create_issue` - Create GitHub issue
- `create_pull_request` - Create PR
- And more...

**Usage**:
```bash
# List all tools
mcpx list

# Use filesystem tool
mcpx filesystem/read_file '{"path": "./README.md"}'

# Use GitHub tool
mcpx github/search_code '{"query": "language:typescript"}'
```

---

## 🔄 Workflow Example

### Scenario: Create Next.js Page

```
User: Create a blog page using 'use cache'

AI Assistant:
1. [Context Loading]
   ├── Read ~/.config/opencode/AGENTS.md (Global rules)
   ├── Check installed Skills (nextjs-docs-router)
   └── Read ./AGENTS.md (Project constraints)

2. [Skill Activation: nextjs-docs-router]
   ├── Detect keywords: 'use cache', Next.js
   ├── Trigger skill workflow
   └── Force consult .next-docs/nextjs-16-api-reference.md

3. [Implementation]
   ├── Confirm 'use cache' correct usage
   ├── Create page.tsx
   ├── Add loading.tsx (Suspense boundary)
   └── Update next.config.ts

4. [Verification]
   ├── Type check: npx tsc --noEmit
   ├── Build test: npm run build
   └── Checklist verification: All passed

5. [Completion]
   └── Return created files and instructions
```

---

## 📊 Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **AI Accuracy** | 53% | 100% | +47% |
| **Token Usage** | 47k | 400 | -99% |
| **Skill Reusability** | ❌ None | ✅ Standardized | Team sharable |
| **Context Management** | Chaotic | Organized | Three-layer |
| **Error Prevention** | ❌ Reactive | ✅ Proactive | Iteration records |
| **Tool Discovery** | Pre-load | On-demand | mcpx |
| **Knowledge沉淀** | ❌ Personal | ✅ Team-level | Skills |

---

## 🏗️ Architecture Components

### 1. AGENTS.md v3.0
- Three-layer architecture support
- Iteration record system
- Common error case library
- Quick command templates

### 2. mcpx Integration
- On-demand MCP tool discovery
- 99% token savings
- Prompt cache preservation
- 43 tools available

### 3. npx skills
- Standardized skill management
- Cross-platform (27 AI assistants)
- Version locking
- Easy installation/updates

---

## 🌍 Supported Platforms

- ✅ OpenCode
- ✅ Cursor
- ✅ Claude Code
- ✅ GitHub Copilot
- ✅ And 23+ more AI assistants

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Vercel](https://vercel.com/) - AGENTS.md research and skills tool
- [Anthropic](https://www.anthropic.com/) - Claude Code best practices
- [mcpx](https://github.com/cs50victor/mcpx) - On-demand tool discovery
- [Next.js](https://nextjs.org/) - The React Framework

---

## 👤 Author

**Kyle** 

- 📧 Email: [renke@fofvc.com](mailto:renke@fofvc.com)
- 🐙 GitHub: [@colerkks](https://github.com/colerkks)

---

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/colerkks/opencode-ai-hybrid/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/colerkks/opencode-ai-hybrid/discussions)
- 📖 Wiki: [GitHub Wiki](https://github.com/colerkks/opencode-ai-hybrid/wiki)

---

<div align="center">

**🌟 Star this repo if it helps you!**

**🚀 Build smarter AI programming environments with standardized skills!**

</div>
