# Quick Start Guide

Get started with OpenCode AI Hybrid Architecture in 5 minutes!

## Prerequisites

- Git
- Node.js 18+ or Bun
- An AI assistant (OpenCode, Cursor, Claude Code, etc.)

## Installation

### One-Line Install

```bash
curl -fsSL https://raw.githubusercontent.com/yourusername/opencode-ai-hybrid/main/install.sh | bash
```

Note: the correct URL is:

```bash
curl -fsSL https://raw.githubusercontent.com/colerkks/opencode-ai-hybrid/main/install.sh | bash
```

### Manual Install

```bash
# 1. Clone the repository
git clone https://github.com/colerkks/opencode-ai-hybrid.git
cd opencode-ai-hybrid

# 2. Run installer
chmod +x install.sh
./install.sh
```

## Verify Installation

```bash
# Check mcpx
mcpx --version

# Check skills CLI
skills --version

# List available tools
mcpx list

# List installed skills
skills list
```

## Create Your First Project

```bash
# 1. Copy project template
cp -r ~/.opencode-ai-hybrid/templates/nextjs-app ./my-project
cd my-project

# 2. Install dependencies
pnpm install

# 3. Start OpenCode
opencode
```

## Using the Architecture

### 1. Ask AI to Create Something

```
You: Create a blog page with caching

AI: 
1. [Activates nextjs-docs-router skill]
2. Consults .next-docs/ for 'use cache'
3. Creates page.tsx with proper caching
4. Adds loading.tsx for Suspense
5. Verifies with type-check and build
```

### 2. Debug an Issue

```
You: I have a build error

AI:
1. [Activates nextjs-debug skill]
2. Collects error information
3. Checks AGENTS.md error cases
4. Applies fix from iteration records
5. Updates knowledge base
```

### 3. Use Quick Commands

```
/plan      → Create detailed task plan
/review    → Strict code review
/debug     → Auto-diagnose and fix
/prove     → Verify functionality
/techdebt  → Find and eliminate debt

/arch-init   → Initialize Hybrid Architecture (plugin)
/arch-status → Show current architecture status
/arch-reload → Reload configs and skills
```

## Next Steps

- Read the [full documentation](README.md)
- Learn about the [architecture](docs/ARCHITECTURE.md)
- Check out [more skills](skills/)
- [Contribute](CONTRIBUTING.md) your own skills!

## Troubleshooting

### mcpx not found

```bash
# Install bun
curl -fsSL https://bun.sh/install | bash

# Install mcpx
bun install -g github:cs50victor/mcpx
```

### skills not found

```bash
# Make sure ~/.bun/bin is in PATH
export PATH="$HOME/.bun/bin:$PATH"

# Or reinstall
./install.sh
```

### AGENTS.md not loading

```bash
# Check location
ls ~/.config/opencode/AGENTS.md

# Reinstall
cd ~/opencode-ai-hybrid
./install.sh
```

## Get Help

- 📖 [Documentation](docs/)
- 🐛 [Issues](https://github.com/yourusername/opencode-ai-hybrid/issues)
- 💬 [Discussions](https://github.com/yourusername/opencode-ai-hybrid/discussions)

---

**Ready to build?** Open OpenCode and type `/plan` to start! 🚀
