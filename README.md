<div align="center">

# 🚀 OpenCode AI Hybrid Architecture

**The Industry-Leading AI Programming Environment**

[![Version](https://img.shields.io/badge/version-3.1.1-blue.svg)](https://github.com/colerkks/opencode-ai-hybrid)
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

## What you get (in one picture)
<img width="1439" height="899" alt="image" src="https://github.com/user-attachments/assets/3a30a31f-8a90-4edd-aa1a-34ad0948c93c" />

**Priority Rule**: Project > Skill > Global

---

## ✨ Key Features

### 🎯 100% AI Coding Accuracy
- **Verified by Vercel**: AGENTS.md achieves 100% pass rate vs 53% baseline
- [See Evidence](docs/EVIDENCE.md#1-ai-coding-accuracy-100-vs-53) - Independent benchmark study
- Document-on-demand retrieval beats pre-trained knowledge

### 💰 99% Token Savings
- **Proven reduction**: 47k tokens → 400 tokens (99% savings)
- [See Evidence](docs/EVIDENCE.md#2-token-savings-99-reduction) - Calculation methodology
- [Run Benchmark](benchmarks/run-benchmarks.sh) - Verify yourself
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

### 1.5 VS Code Extension 🆕

We now provide a full-featured **VS Code Extension** for managing the hybrid architecture directly from your editor!

**Features:**
- 🎛️ **Dashboard Panel** - Visual architecture status and configuration
- 🌲 **Tree View** - Browse skills, templates, and documentation
- ⚡ **Quick Actions** - Initialize, reload, and manage architecture with one click
- 🔧 **Config Manager** - Edit AGENTS.md and configuration files

**Installation:**
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "OpenCode AI Hybrid"
4. Click Install

Or install from CLI:
```bash
cd vscode-extension
npm install
npm run package
# Install the generated .vsix file in VS Code
```

### 1.6 OpenCode Plugin (Desktop)

This repo includes an OpenCode Desktop-compatible plugin: `opencode-ai-hybrid (Kyle1.0)`.

After installing, restart OpenCode Desktop and run:

- `/arch-init` - Initialize hybrid architecture
- `/arch-status` - Check architecture status
- `/arch-reload` - Reload configuration

These commands are generated into `.opencode/commands/` by the plugin and call deterministic tools (`arch_status`, `arch_reload`, `arch_init`).

### 1.7 Configuration Safety (Important)

From the latest fixes, installer/update/uninstall scripts are non-destructive to OpenCode core settings:

- Plugin-owned config lives at `~/.config/opencode/opencode-ai-hybrid/`
- Global `~/.config/opencode/AGENTS.md` is no longer overwritten by default
- Global `~/.config/opencode/skills/` is no longer deleted on uninstall
- Global `~/.config/mcp/.mcp.json` is no longer overwritten or removed

Legacy global paths are still read as fallback for backward compatibility.

### 🆕 Automatic Project Initialization

The plugin now features **full auto-initialization**. When you open any project:

1. ✅ Automatically detects project root
2. ✅ Creates/fills `skills.lock.json` with default skills
3. ✅ Auto-reloads to apply changes
4. ✅ Respects existing project configuration

**No manual `/arch-init` needed!** Just open a project and start coding.

See [Auto-Init Guide](docs/AUTO_INIT.md) for details.

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

## 🔄 Maintenance

### Upgrade to Latest Version

```bash
~/.opencode-ai-hybrid/bin/update.sh
```

Or download and run directly:

```bash
curl -fsSL https://raw.githubusercontent.com/colerkks/opencode-ai-hybrid/main/bin/update.sh | bash
```

### Uninstall

```bash
~/.opencode-ai-hybrid/bin/uninstall.sh
```

Or download and run directly:

```bash
curl -fsSL https://raw.githubusercontent.com/colerkks/opencode-ai-hybrid/main/bin/uninstall.sh | bash
```

For detailed maintenance instructions, see [MAINTENANCE.md](docs/MAINTENANCE.md).

---

## 📚 Documentation

### 🚀 Quick Access

| 📖 Document | 🌐 Language | 📋 Description |
|-------------|-------------|----------------|
| [中文完整文档](docs/README_CN.md) | 🇨🇳 中文 | 完整的架构说明、安装指南和使用教程 |
| [English Docs](docs/README_EN.md) | 🇺🇸 English | Complete architecture guide and documentation |
| [📦 Installation](docs/INSTALLATION.md) | 🇺🇸 English | **🆕 Detailed setup guide** |
| [🏗️ Architecture](docs/ARCHITECTURE.md) | 🇺🇸 English | Deep dive into three-layer architecture |
| [🛠️ Skills Guide](docs/SKILLS_GUIDE.md) | 🇺🇸 English | Create and use skills guide |
| [🚀 Quick Start](docs/QUICKSTART.md) | 🇺🇸 English | Get started in 5 minutes |
| [🔄 Migration](docs/MIGRATION.md) | 🇺🇸 English | Migrate from existing setups |
| [📂 Structure](docs/PROJECT_STRUCTURE.md) | 🇺🇸 English | **🆕 Project quick reference** |
| [🗺️ Roadmap](docs/ROADMAP.md) | 🇺🇸 English | **🆕 Future plans** |
| [📝 Changelog](CHANGELOG.md) | 🇺🇸 English | **🆕 Version history** |
| [❓ FAQ](docs/FAQ.md) | 🇺🇸 English | Frequently asked questions |

### 📁 Document Structure

```
docs/
├── README_CN.md        # 中文文档 (Complete Chinese)
├── README_EN.md        # English Docs (Complete English)
├── ARCHITECTURE.md     # Architecture deep dive
├── SKILLS_GUIDE.md     # Skill creation guide
├── MIGRATION.md        # Migration instructions
├── FAQ.md              # 15+ Q&A
├── CHANGELOG.md        # Version history
├── INSTALLATION.md     # Detailed installation guide
├── PROJECT_STRUCTURE.md # Quick reference
└── ROADMAP.md          # Future plans
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
   ├── Read ~/.config/opencode/opencode-ai-hybrid/AGENTS.md (Plugin-owned global rules)
   ├── Check installed Skills (nextjs-docs-router)
   └── Read ./AGENTS.md (Project constraints, highest priority)

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

## 🏗️ What's Included

### 📦 Core Components

| Component | Description | Path |
|-----------|-------------|------|
| **VS Code Extension** | Full IDE integration | `vscode-extension/` |
| **OpenCode Plugin** | Desktop plugin (Kyle1.0) | `plugins/opencode-ai-hybrid-plugin/` |
| **CLI Commands** | Architecture management | `.opencode/commands/` |
| **Skills Library** | Pre-built skills | `skills/` |
| **Example Projects** | Starter templates | `examples/` |

### 🆕 Latest Additions (v3.1.0)

- ✅ **VS Code Extension** - Full IDE integration with dashboard
- ✅ **GitHub Templates** - Issue templates, PR template, Security policy
- ✅ **Enhanced Documentation** - Installation guide, Roadmap, Changelog
- ✅ **Project Structure Docs** - Quick reference guide
- ✅ **Editor Config** - Consistent coding style

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

### 4. VS Code Extension 🆕
- Visual dashboard for architecture management
- Tree view for skills and templates
- Quick actions and configuration editing
- Integrated documentation browser

---

## 🌍 Supported Platforms

- ✅ OpenCode
- ✅ Cursor
- ✅ Claude Code
- ✅ GitHub Copilot
- ✅ And 23+ more AI assistants

---

## 📂 Project Structure

```
opencode-ai-hybrid/
├── 📁 .github/              # GitHub configuration
│   ├── 📁 ISSUE_TEMPLATE/   # Issue templates
│   ├── 📄 PULL_REQUEST_TEMPLATE.md
│   └── 📄 SECURITY.md       # Security policy
├── 📁 .opencode/            # OpenCode commands
│   └── 📁 commands/
│       ├── 📄 arch-init.md
│       ├── 📄 arch-reload.md
│       └── 📄 arch-status.md
├── 📁 config/               # Plugin-owned defaults (installed to ~/.config/opencode/opencode-ai-hybrid/)
│   ├── 📄 AGENTS.md
│   ├── 📄 hybrid-arch.json
│   └── 📄 mcp.json
├── 📁 docs/                 # Documentation
│   ├── 📄 README_CN.md      # 🇨🇳 中文文档
│   ├── 📄 README_EN.md      # 🇺🇸 English
│   ├── 📄 ARCHITECTURE.md
│   ├── 📄 SKILLS_GUIDE.md
│   ├── 📄 MIGRATION.md
│   ├── 📄 FAQ.md
│   ├── 📄 CHANGELOG.md      # 🆕 Version history
│   ├── 📄 INSTALLATION.md   # 🆕 Setup guide
│   ├── 📄 PROJECT_STRUCTURE.md # 🆕 Quick reference
│   └── 📄 ROADMAP.md        # 🆕 Future plans
├── 📁 examples/             # Example projects
├── 📁 plugins/              # OpenCode plugins
│   └── 📁 opencode-ai-hybrid-plugin/
├── 📁 skills/               # Available skills
│   ├── 📁 nextjs-docs-router/
│   └── 📁 nextjs-debug/
├── 📁 vscode-extension/     # 🆕 VS Code extension
├── 📄 .editorconfig         # 🆕 Coding style config
├── 📄 .gitignore
├── 📄 CHANGELOG.md
├── 📄 CONTRIBUTING.md
├── 📄 INSTALLATION.md
├── 📄 LICENSE
├── 📄 PROJECT_STRUCTURE.md
├── 📄 QUICKSTART.md
├── 📄 README.md
├── 📄 ROADMAP.md
└── 📄 VERSION               # 🆕 Current version
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

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

<div align="center">

**🌟 Star this repo if it helps you!**

**🚀 Build smarter AI programming environments with standardized skills!**

</div>
