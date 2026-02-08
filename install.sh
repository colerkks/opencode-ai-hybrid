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

# Setup OpenCode plugin (Desktop-safe local plugin install)
echo "[INFO] Installing OpenCode plugin (opencode-ai-hybrid)..."
mkdir -p "$CONFIG_DIR/plugins/opencode-ai-hybrid"
if [[ -d "$INSTALL_DIR/plugins/opencode-ai-hybrid-plugin/dist" ]]; then
  rm -rf "$CONFIG_DIR/plugins/opencode-ai-hybrid/dist" 2>/dev/null || true
  cp -r "$INSTALL_DIR/plugins/opencode-ai-hybrid-plugin/dist" "$CONFIG_DIR/plugins/opencode-ai-hybrid/"
  cat > "$CONFIG_DIR/plugins/opencode-ai-hybrid.js" <<'EOF'
export { default } from "./opencode-ai-hybrid/dist/index.js";
EOF
  echo "[SUCCESS] OpenCode plugin installed"
else
  echo "[WARNING] Missing plugin dist at $INSTALL_DIR/plugins/opencode-ai-hybrid-plugin/dist"
fi

echo ""
echo "=========================================="
echo "Installation Complete!"
echo "=========================================="
echo ""
echo "Quick start:"
echo "  1. Restart your terminal"
echo "  2. Run: mcpx list"
echo "  3. Run: skills list"
echo "  4. Restart OpenCode Desktop, then run: /arch-init"
echo ""
echo "Documentation: $INSTALL_DIR/README.md"
echo ""
