#!/usr/bin/env bash
# OpenCode AI Hybrid Plugin Diagnostic Tool

set -euo pipefail

echo "=========================================="
echo "OpenCode AI Hybrid Plugin Diagnostics"
echo "=========================================="
echo ""
echo "Checking installation..."
echo ""

# Check plugin directory
PLUGIN_DIR="${HOME}/.config/opencode/plugins/opencode-ai-hybrid"
PLUGIN_ENTRY="${HOME}/.config/opencode/plugins/opencode-ai-hybrid.js"
INSTALL_DIR="${HOME}/.opencode-ai-hybrid"

if [ -d "$PLUGIN_DIR" ]; then
    echo "✓ Plugin directory exists"
else
    echo "✗ Plugin directory missing: $PLUGIN_DIR"
fi

if [ -f "$PLUGIN_ENTRY" ]; then
    echo "✓ Plugin entry point exists"
else
    echo "✗ Plugin entry point missing: $PLUGIN_ENTRY"
fi

if [ -d "$INSTALL_DIR" ]; then
    echo "✓ Installation directory exists"
else
    echo "✗ Installation directory missing"
fi

echo ""
echo "For help, run: $INSTALL_DIR/bin/setup-plugin.sh"
echo "Or visit: https://github.com/colerkks/opencode-ai-hybrid/issues"
