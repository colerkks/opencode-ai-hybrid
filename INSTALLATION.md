# Installation Guide

## System Requirements

- **Operating System**: macOS, Linux, or Windows (with WSL recommended)
- **Node.js**: Version 18 or higher
- **Git**: Version 2.30 or higher
- **OpenCode**: Latest version

## Installation Methods

### Method 1: One-Line Installation (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/colerkks/opencode-ai-hybrid/main/install.sh | bash
```

This will:
- Install all dependencies
- Configure mcpx
- Set up global AGENTS.md
- Install default skills

### Method 2: Manual Installation

1. Clone the repository:
```bash
git clone https://github.com/colerkks/opencode-ai-hybrid.git
cd opencode-ai-hybrid
```

2. Run the installer:
```bash
chmod +x install.sh
./install.sh
```

### Method 3: OpenCode Plugin (Desktop)

1. Install the plugin in OpenCode Desktop
2. Restart OpenCode
3. Use commands:
   - `/arch-init` - Initialize hybrid architecture
   - `/arch-status` - Check architecture status

## Verification

After installation, verify everything is working:

```bash
# Check mcpx
mcpx --version

# Check skills CLI
skills --version

# List available skills
skills list

# Check OpenCode integration
opencode --version
```

## Post-Installation Setup

### 1. Configure mcpx

Edit `~/.config/mcp/.mcp.json`:

```json
{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/your/projects"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}
```

### 2. Set Up GitHub Token (Optional)

For GitHub API access:

```bash
export GITHUB_TOKEN=your_github_token
```

### 3. Configure Global AGENTS.md

The installer creates `~/.config/opencode/AGENTS.md`. Customize it for your workflow.

## Troubleshooting

### Issue: mcpx command not found

**Solution**:
```bash
npm install -g mcpx
```

### Issue: skills command not found

**Solution**:
```bash
npm install -g @vercel/skills
```

### Issue: Permission denied on install.sh

**Solution**:
```bash
chmod +x install.sh
```

### Issue: OpenCode not detecting skills

**Solution**:
1. Restart OpenCode
2. Check `skills.lock.json` exists in project root
3. Run `skills list` to verify installation

## Updating

To update to the latest version:

```bash
cd opencode-ai-hybrid
git pull origin main
./install.sh
```

## Uninstallation

To remove the hybrid architecture:

```bash
# Remove global config
rm -rf ~/.config/opencode

# Remove skills
npm uninstall -g @vercel/skills

# Remove mcpx
npm uninstall -g mcpx
```

## Next Steps

- Read the [Quick Start Guide](QUICKSTART.md)
- Check out [Example Projects](examples/)
- Learn about [Skills](docs/SKILLS_GUIDE.md)

## Support

- 📧 Email: renke@fofvc.com
- 🐛 Issues: [GitHub Issues](https://github.com/colerkks/opencode-ai-hybrid/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/colerkks/opencode-ai-hybrid/discussions)
