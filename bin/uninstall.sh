#!/usr/bin/env bash
# OpenCode AI Hybrid Plugin Uninstall Script
# Complete removal of all plugin components

set -euo pipefail

PLUGIN_NAME="opencode-ai-hybrid"
INSTALL_DIR="${HOME}/.opencode-ai-hybrid"
CONFIG_DIR="${HOME}/.config/opencode"
MCP_CONFIG_DIR="${HOME}/.config/mcp"
HYBRID_CONFIG_DIR="${CONFIG_DIR}/opencode-ai-hybrid"

echo "=========================================="
echo "OpenCode AI Hybrid Uninstaller"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Ask for confirmation
confirm() {
    echo ""
    echo "This will remove:"
    echo "  • Plugin files from: $CONFIG_DIR/plugins/"
    echo "  • Installation directory: $INSTALL_DIR"
    echo "  • Plugin-owned config: $HYBRID_CONFIG_DIR"
    echo ""
    echo "It will NOT delete OpenCode global AGENTS.md, global skills, or global MCP config."
    echo ""
    echo -n "Are you sure you want to uninstall? [y/N] "
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Uninstall cancelled."
        exit 0
    fi
}

# Remove plugin files
remove_plugin() {
    print_header "Removing Plugin Files..."
    
    # Remove plugin directory
    if [[ -d "$CONFIG_DIR/plugins/$PLUGIN_NAME" ]]; then
        rm -rf "$CONFIG_DIR/plugins/$PLUGIN_NAME"
        print_success "Removed plugin directory"
    else
        print_warning "Plugin directory not found"
    fi
    
    # Remove plugin entry point
    if [[ -f "$CONFIG_DIR/plugins/$PLUGIN_NAME.js" ]]; then
        rm -f "$CONFIG_DIR/plugins/$PLUGIN_NAME.js"
        print_success "Removed plugin entry point"
    fi
    
    # Remove user guide
    if [[ -f "$CONFIG_DIR/HYBRID_PLUGIN_GUIDE.md" ]]; then
        rm -f "$CONFIG_DIR/HYBRID_PLUGIN_GUIDE.md"
        print_success "Removed user guide"
    fi
}

# Remove installation directory
remove_installation() {
    print_header "Removing Installation Directory..."
    
    if [[ -d "$INSTALL_DIR" ]]; then
        echo "Removing: $INSTALL_DIR"
        rm -rf "$INSTALL_DIR"
        print_success "Removed installation directory"
    else
        print_warning "Installation directory not found"
    fi
}

# Remove global configuration
remove_global_config() {
    print_header "Removing Plugin-Owned Configuration..."

    if [[ -d "$HYBRID_CONFIG_DIR" ]]; then
        rm -rf "$HYBRID_CONFIG_DIR"
        print_success "Removed plugin-owned config directory"
    else
        print_warning "Plugin-owned config directory not found"
    fi

    if [[ -f "$CONFIG_DIR/hybrid-arch.json" ]]; then
        print_warning "Kept legacy global file: $CONFIG_DIR/hybrid-arch.json"
        print_warning "Remove manually only if you are sure no other setup uses it"
    fi

    if [[ -f "$CONFIG_DIR/AGENTS.md" ]]; then
        print_warning "Kept global OpenCode AGENTS.md"
    fi

    if [[ -d "$CONFIG_DIR/skills" ]]; then
        print_warning "Kept global skills directory"
    fi
}

# Remove MCP configuration
remove_mcp_config() {
    print_header "MCP Configuration"

    if [[ -f "$MCP_CONFIG_DIR/.mcp.json" ]]; then
        print_warning "Kept global MCP configuration: $MCP_CONFIG_DIR/.mcp.json"
    else
        print_warning "Global MCP configuration not found"
    fi
}

# Clean up shell configuration
cleanup_shell() {
    print_header "Cleaning Up Shell Configuration..."
    
    # Check for PATH modifications in common files
    local shell_files=(
        "$HOME/.bashrc"
        "$HOME/.zshrc"
        "$HOME/.bash_profile"
        "$HOME/.zprofile"
    )
    
    for file in "${shell_files[@]}"; do
        if [[ -f "$file" ]]; then
            # Check if our PATH modifications exist
            if grep -q "opencode-ai-hybrid" "$file" 2>/dev/null; then
                echo "Found references in: $file"
                echo "Please manually review and remove these lines:"
                grep -n "opencode-ai-hybrid" "$file" || true
                echo ""
            fi
        fi
    done
}

# Generate uninstall report
generate_report() {
    print_header "Uninstall Summary"
    
    echo ""
    echo "The following have been removed:"
    echo "  ✓ Plugin files"
    echo "  ✓ Installation directory"
    echo "  ✓ Plugin-owned configuration"
    echo ""
    echo "The following were intentionally kept:"
    echo "  • Global OpenCode AGENTS.md"
    echo "  • Global OpenCode skills"
    echo "  • Global MCP configuration"
    echo ""
    
    echo "Next steps:"
    echo "  1. Restart your terminal"
    echo "  2. If using OpenCode Desktop, restart it"
    echo "  3. Verify plugin commands no longer work: /arch-status"
    echo ""
    
    echo "To reinstall in the future:"
    echo "  curl -fsSL https://raw.githubusercontent.com/colerkks/opencode-ai-hybrid/main/install.sh | bash"
    echo ""
}

# Main
main() {
    echo "This script will completely uninstall OpenCode AI Hybrid."
    echo ""
    
    confirm
    
    remove_plugin
    remove_installation
    remove_global_config
    remove_mcp_config
    cleanup_shell
    
    generate_report
    
    print_success "Uninstall complete!"
}

# Run
main "$@"
