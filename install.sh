#!/usr/bin/env bash
set -euo pipefail

# OpenCode AI Hybrid Architecture Installer
# Version: 3.0.0

echo "=========================================="
echo "OpenCode AI Hybrid Architecture Installer"
echo "=========================================="
echo ""

REPO_URL="https://github.com/colerkks/opencode-ai-hybrid"
INSTALL_DIR="${HOME}/.opencode-ai-hybrid"
CONFIG_DIR="${HOME}/.config/opencode"
MCP_CONFIG_DIR="${HOME}/.config/mcp"

echo "[INFO] Checking prerequisites..."

# Check for git
if ! command -v git &> /dev/null; then
    echo "[ERROR] git is required but not installed"
    exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is required but not installed"
    exit 1
fi

echo "[SUCCESS] Prerequisites check passed"

# Clone repository
echo "[INFO] Cloning repository..."
if [[ -d "$INSTALL_DIR" ]]; then
    echo "[WARNING] Directory already exists, updating..."
    cd "$INSTALL_DIR" && git pull
else
    git clone "$REPO_URL" "$INSTALL_DIR"
fi

echo "[SUCCESS] Repository ready"

# Install mcpx
echo "[INFO] Installing mcpx..."
if command -v bun &> /dev/null; then
    bun install -g github:cs50victor/mcpx
elif command -v cargo &> /dev/null; then
    cargo install mcpx
else
    echo "[WARNING] Installing bun first..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
    bun install -g github:cs50victor/mcpx
fi

if command -v mcpx &> /dev/null; then
    echo "[SUCCESS] mcpx installed"
    mcpx --version
fi

# Install skills CLI
echo "[INFO] Installing npx skills..."
SKILLS_DIR="${HOME}/vercel-skills"
if [[ ! -d "$SKILLS_DIR" ]]; then
    git clone https://github.com/vercel-labs/skills.git "$SKILLS_DIR"
fi

cd "$SKILLS_DIR"
if command -v bun &> /dev/null; then
    bun install
    mkdir -p "${HOME}/.bun/bin"
    echo '#!/bin/bash
cd ~/vercel-skills && bun run src/cli.ts "$@"' > "${HOME}/.bun/bin/skills"
    chmod +x "${HOME}/.bun/bin/skills"
    echo "[SUCCESS] skills CLI installed"
fi

# Setup AGENTS.md
echo "[INFO] Setting up AGENTS.md..."
mkdir -p "$CONFIG_DIR"
if [[ -f "$INSTALL_DIR/config/AGENTS.md" ]]; then
  cp "$INSTALL_DIR/config/AGENTS.md" "$CONFIG_DIR/AGENTS.md"
  echo "[SUCCESS] AGENTS.md installed"
else
  echo "[WARNING] Missing $INSTALL_DIR/config/AGENTS.md (repo may be incomplete)"
fi

# Setup MCP config
echo "[INFO] Setting up MCP configuration..."
mkdir -p "$MCP_CONFIG_DIR"
if [[ -f "$INSTALL_DIR/config/mcp.json" ]]; then
    cp "$INSTALL_DIR/config/mcp.json" "$MCP_CONFIG_DIR/.mcp.json"
    echo "[SUCCESS] MCP configuration installed"
fi

# Setup Hybrid Arch global config
echo "[INFO] Setting up Hybrid Arch global config..."
if [[ -f "$INSTALL_DIR/config/hybrid-arch.json" ]]; then
  cp "$INSTALL_DIR/config/hybrid-arch.json" "$CONFIG_DIR/hybrid-arch.json"
  echo "[SUCCESS] hybrid-arch.json installed"
else
  echo "[WARNING] Missing $INSTALL_DIR/config/hybrid-arch.json"
fi

# Setup skills
echo "[INFO] Installing skills..."
mkdir -p "$CONFIG_DIR/skills"
cp -r "$INSTALL_DIR/skills/"* "$CONFIG_DIR/skills/" 2>/dev/null || true
echo "[SUCCESS] Skills installed"

# Build and setup OpenCode plugin
echo "[INFO] Building OpenCode plugin..."
if [[ -d "$INSTALL_DIR/plugins/opencode-ai-hybrid-plugin" ]]; then
  cd "$INSTALL_DIR/plugins/opencode-ai-hybrid-plugin"
  
  # Install dependencies if needed
  if [[ ! -d "node_modules" ]]; then
    echo "[INFO] Installing plugin dependencies..."
    npm install
  fi
  
  # Build plugin
  echo "[INFO] Compiling plugin..."
  npm run build
  
  # Install plugin
  echo "[INFO] Installing OpenCode plugin..."
  mkdir -p "$CONFIG_DIR/plugins/opencode-ai-hybrid"
  rm -rf "$CONFIG_DIR/plugins/opencode-ai-hybrid/dist" 2>/dev/null || true
  cp -r "$INSTALL_DIR/plugins/opencode-ai-hybrid-plugin/dist" "$CONFIG_DIR/plugins/opencode-ai-hybrid/"
  
  # Create entry point
  cat > "$CONFIG_DIR/plugins/opencode-ai-hybrid.js" <<'EOF'
export { default } from "./opencode-ai-hybrid/dist/index.js";
EOF
  
  echo "[SUCCESS] OpenCode plugin installed and built"
else
  echo "[WARNING] Plugin source not found at $INSTALL_DIR/plugins/opencode-ai-hybrid-plugin"
fi

# Setup auto-loader
echo "[INFO] Setting up auto-loader..."
mkdir -p "$CONFIG_DIR"
cat > "$CONFIG_DIR/HYBRID_PLUGIN_GUIDE.md" <<'GUIDE_EOF'
# OpenCode AI Hybrid 插件自动加载指南

## 🚀 自动加载说明

本插件已配置为自动加载。安装完成后，只需重启 OpenCode 即可。

## ✅ 验证插件是否加载

1. **Toast 提示**：打开 OpenCode 后，右上角会显示 "Hybrid Arch Loaded"
2. **命令可用**：输入 `/arch-status` 查看状态
3. **自动初始化**：插件会自动注入架构上下文

## 🔧 如果插件未加载

1. **完全退出 OpenCode**（Cmd+Q 或 Alt+F4）
2. **重新打开 OpenCode**
3. **等待 10 秒**让插件初始化
4. **查看提示**：右上角应出现加载成功的提示

## 🆘 需要帮助？

运行诊断工具：
```bash
~/.opencode-ai-hybrid/bin/diagnose-plugin.sh
```

或重新安装：
```bash
~/.opencode-ai-hybrid/bin/setup-plugin.sh
```
GUIDE_EOF

echo "[SUCCESS] Auto-loader guide created"

echo ""
echo "=========================================="
echo "Installation Complete!"
echo "=========================================="
echo ""
echo "🎉 插件已配置为自动加载！"
echo ""
echo "Next steps:"
echo "  1. 🔄 完全退出 OpenCode（Cmd+Q 或 Alt+F4）"
echo "  2. 🚀 重新打开 OpenCode"
echo "  3. ⏱️ 等待 10 秒，查看右上角 'Hybrid Arch Loaded' 提示"
echo "  4. 💻 尝试命令: /arch-status"
echo ""
echo "如果插件未自动加载："
echo "  → 运行诊断: ~/.opencode-ai-hybrid/bin/diagnose-plugin.sh"
echo "  → 重新安装: ~/.opencode-ai-hybrid/bin/setup-plugin.sh"
echo ""
echo "📖 文档: $INSTALL_DIR/README.md"
echo "📚 指南: $CONFIG_DIR/HYBRID_PLUGIN_GUIDE.md"
echo ""
