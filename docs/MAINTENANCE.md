# Maintenance Guide

Complete guide for uninstalling, upgrading, and maintaining the OpenCode AI Hybrid Architecture.

---

## Table of Contents

1. [Uninstallation](#uninstallation)
2. [Upgrade](#upgrade)
3. [Backup & Restore](#backup--restore)
4. [Troubleshooting](#troubleshooting)
5. [Maintenance Tasks](#maintenance-tasks)

---

## Uninstallation

### Quick Uninstall

Run the uninstaller script:

```bash
~/.opencode-ai-hybrid/bin/uninstall.sh
```

Or download and run directly:

```bash
curl -fsSL https://raw.githubusercontent.com/colerkks/opencode-ai-hybrid/main/bin/uninstall.sh | bash
```

### What Gets Removed

The uninstaller will remove:

| Component | Location | Optional |
|-----------|----------|----------|
| **Plugin files** | `~/.config/opencode/plugins/opencode-ai-hybrid/` | No |
| **Plugin entry** | `~/.config/opencode/plugins/opencode-ai-hybrid.js` | No |
| **Installation** | `~/.opencode-ai-hybrid/` | No |
| **Global AGENTS.md** | `~/.config/opencode/AGENTS.md` | Yes (backup offered) |
| **Hybrid config** | `~/.config/opencode/hybrid-arch.json` | No |
| **MCP config** | `~/.config/mcp/.mcp.json` | Yes |
| **Skills** | `~/.config/opencode/skills/` | Yes |

### Manual Uninstall

If you prefer to uninstall manually:

```bash
# 1. Remove plugin files
rm -rf ~/.config/opencode/plugins/opencode-ai-hybrid
rm -f ~/.config/opencode/plugins/opencode-ai-hybrid.js

# 2. Remove installation directory
rm -rf ~/.opencode-ai-hybrid

# 3. Remove global config (optional)
rm -f ~/.config/opencode/AGENTS.md
rm -f ~/.config/opencode/hybrid-arch.json

# 4. Remove MCP config (optional)
rm -f ~/.config/mcp/.mcp.json

# 5. Remove skills (optional)
rm -rf ~/.config/opencode/skills
```

### Verify Uninstallation

After uninstalling, verify:

```bash
# Check plugin is gone
ls ~/.config/opencode/plugins/opencode-ai-hybrid 2>&1
# Should output: No such file or directory

# Check commands don't work
# In OpenCode: /arch-status
# Should output: Command not found
```

---

## Upgrade

### Quick Upgrade

Run the updater script:

```bash
~/.opencode-ai-hybrid/bin/update.sh
```

Or download and run directly:

```bash
curl -fsSL https://raw.githubusercontent.com/colerkks/opencode-ai-hybrid/main/bin/update.sh | bash
```

### What Happens During Upgrade

1. **Backup** - Current configuration is backed up
2. **Check** - Compares local version with remote
3. **Update** - Pulls latest code from GitHub
4. **Rebuild** - Recompiles the plugin
5. **Install** - Copies new plugin files
6. **Configure** - Updates global settings

### Manual Upgrade

```bash
# 1. Navigate to installation directory
cd ~/.opencode-ai-hybrid

# 2. Backup current config
cp ~/.config/opencode/AGENTS.md ~/AGENTS.md.backup

# 3. Pull latest changes
git pull origin main

# 4. Rebuild plugin
cd plugins/opencode-ai-hybrid-plugin
npm install
npm run build

# 5. Reinstall plugin
cp -r dist ~/.config/opencode/plugins/opencode-ai-hybrid/

# 6. Update global config
cp config/AGENTS.md ~/.config/opencode/
cp config/hybrid-arch.json ~/.config/opencode/

# 7. Restart OpenCode
```

### Version Management

Check current version:

```bash
cd ~/.opencode-ai-hybrid
git describe --tags --always
```

Check for updates:

```bash
cd ~/.opencode-ai-hybrid
git fetch origin
git log HEAD..origin/main --oneline
```

Rollback to previous version:

```bash
cd ~/.opencode-ai-hybrid
# View available versions
git tag

# Checkout specific version
git checkout v3.0.0

# Rebuild and reinstall
./install.sh
```

---

## Backup & Restore

### Backup Configuration

Create a backup:

```bash
# Create backup directory
mkdir -p ~/opencode-hybrid-backup-$(date +%Y%m%d)

# Backup config files
cp ~/.config/opencode/AGENTS.md ~/opencode-hybrid-backup-$(date +%Y%m%d)/
cp ~/.config/opencode/hybrid-arch.json ~/opencode-hybrid-backup-$(date +%Y%m%d)/ 2>/dev/null || true

# Backup skills
cp -r ~/.config/opencode/skills ~/opencode-hybrid-backup-$(date +%Y%m%d)/ 2>/dev/null || true

# Backup project-specific configs (optional)
find . -name ".opencode" -type d -exec cp -r {} ~/opencode-hybrid-backup-$(date +%Y%m%d)/ \; 2>/dev/null || true
```

### Restore Configuration

Restore from backup:

```bash
# Restore global config
cp ~/opencode-hybrid-backup-YYYYMMDD/AGENTS.md ~/.config/opencode/
cp ~/opencode-hybrid-backup-YYYYMMDD/hybrid-arch.json ~/.config/opencode/

# Restore skills
cp -r ~/opencode-hybrid-backup-YYYYMMDD/skills ~/.config/opencode/

# Restart OpenCode
```

---

## Troubleshooting

### Plugin Not Loading After Upgrade

**Symptoms:**
- OpenCode starts but no "Hybrid Arch Loaded" toast
- Commands like `/arch-status` not found

**Solutions:**

1. **Restart OpenCode completely**
   - Quit entirely (Cmd+Q / Alt+F4)
   - Wait 5 seconds
   - Reopen

2. **Reinstall plugin**
   ```bash
   ~/.opencode-ai-hybrid/bin/setup-plugin.sh
   ```

3. **Check plugin files**
   ```bash
   ls -la ~/.config/opencode/plugins/opencode-ai-hybrid/
   cat ~/.config/opencode/plugins/opencode-ai-hybrid.js
   ```

4. **Run diagnostics**
   ```bash
   ~/.opencode-ai-hybrid/bin/diagnose-plugin.sh
   ```

### Partial Upgrade Failure

**Symptoms:**
- Some features work, others don't
- Mixed old/new behavior

**Solution:**

Force complete reinstall:

```bash
# 1. Backup config
cp ~/.config/opencode/AGENTS.md ~/AGENTS.md.backup

# 2. Uninstall
~/.opencode-ai-hybrid/bin/uninstall.sh

# 3. Reinstall
curl -fsSL https://raw.githubusercontent.com/colerkks/opencode-ai-hybrid/main/install.sh | bash

# 4. Restore custom config (if needed)
cp ~/AGENTS.md.backup ~/.config/opencode/AGENTS.md
```

### Configuration Conflicts

**Symptoms:**
- Unexpected behavior
- Errors about conflicting settings

**Solution:**

Reset to defaults:

```bash
# Backup first
cp ~/.config/opencode/AGENTS.md ~/AGENTS.md.custom

# Reset to default
curl -fsSL https://raw.githubusercontent.com/colerkks/opencode-ai-hybrid/main/config/AGENTS.md > ~/.config/opencode/AGENTS.md

# Merge your custom rules (manual)
vim ~/.config/opencode/AGENTS.md
```

---

## Maintenance Tasks

### Regular Maintenance (Monthly)

```bash
# 1. Check for updates
~/.opencode-ai-hybrid/bin/update.sh

# 2. Clean old backups
find ~ -name "opencode-hybrid-backup-*" -mtime +30 -exec rm -rf {} \;

# 3. Verify installation
~/.opencode-ai-hybrid/bin/diagnose-plugin.sh

# 4. Update skills
skills update
```

### Cleanup Tasks

Remove old build artifacts:

```bash
# Clean plugin build files
cd ~/.opencode-ai-hybrid/plugins/opencode-ai-hybrid-plugin
rm -rf node_modules dist
npm install
npm run build
```

Clear caches:

```bash
# Clear OpenCode cache (if applicable)
# Note: This varies by OpenCode version

# Clear npm cache
npm cache clean --force
```

### Health Check

Run complete health check:

```bash
#!/bin/bash
# health-check.sh

echo "OpenCode AI Hybrid Health Check"
echo "================================"

# Check installation
if [[ -d ~/.opencode-ai-hybrid ]]; then
    echo "✓ Installation directory exists"
    cd ~/.opencode-ai-hybrid
    echo "  Version: $(git describe --tags --always 2>/dev/null || echo 'unknown')"
else
    echo "✗ Installation directory missing"
fi

# Check plugin
if [[ -d ~/.config/opencode/plugins/opencode-ai-hybrid ]]; then
    echo "✓ Plugin installed"
else
    echo "✗ Plugin not installed"
fi

# Check config
if [[ -f ~/.config/opencode/AGENTS.md ]]; then
    echo "✓ Global AGENTS.md exists"
else
    echo "✗ Global AGENTS.md missing"
fi

# Check tools
if command -v mcpx &> /dev/null; then
    echo "✓ mcpx installed: $(mcpx --version 2>/dev/null || echo 'unknown')"
else
    echo "✗ mcpx not installed"
fi

if command -v skills &> /dev/null; then
    echo "✓ skills CLI installed"
else
    echo "✗ skills CLI not installed"
fi

echo ""
echo "For issues, run: ~/.opencode-ai-hybrid/bin/diagnose-plugin.sh"
```

---

## Quick Reference

| Task | Command |
|------|---------|
| **Install** | `curl -fsSL .../install.sh \| bash` |
| **Uninstall** | `~/.opencode-ai-hybrid/bin/uninstall.sh` |
| **Update** | `~/.opencode-ai-hybrid/bin/update.sh` |
| **Diagnose** | `~/.opencode-ai-hybrid/bin/diagnose-plugin.sh` |
| **Reinstall Plugin** | `~/.opencode-ai-hybrid/bin/setup-plugin.sh` |
| **Check Version** | `cd ~/.opencode-ai-hybrid && git describe --tags` |
| **Force Reinstall** | Uninstall → Install |

---

## Support

If you encounter issues during maintenance:

1. **Check documentation**: [README.md](README.md)
2. **Run diagnostics**: `~/.opencode-ai-hybrid/bin/diagnose-plugin.sh`
3. **Search issues**: [GitHub Issues](https://github.com/colerkks/opencode-ai-hybrid/issues)
4. **Ask community**: [GitHub Discussions](https://github.com/colerkks/opencode-ai-hybrid/discussions)

---

*Last Updated: February 8, 2026*