#!/usr/bin/env bash
# OpenCode AI Hybrid Plugin Uninstall Script
# Complete removal of all plugin components

set -euo pipefail

PLUGIN_NAME="opencode-ai-hybrid"
INSTALL_DIR="${HOME}/.opencode-ai-hybrid"
CONFIG_DIR="${HOME}/.config/opencode"
MCP_CONFIG_DIR="${HOME}/.config/mcp"

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
    echo "  • Global configuration: $CONFIG_DIR/AGENTS.md"
    echo "  • MCP configuration"
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
    print_header "Removing Global Configuration..."
    
    # Backup prompt
    if [[ -f "$CONFIG_DIR/AGENTS.md" ]]; then
        echo ""
        echo -n "Keep global AGENTS.md as backup? [Y/n] "
        read -r keep_agents
        if [[ "$keep_agents" =~ ^[Nn]$ ]]; then
            rm -f "$CONFIG_DIR/AGENTS.md"
            print_success "Removed global AGENTS.md"
        else
            backup_file="$CONFIG_DIR/AGENTS.md.backup.$(date +%Y%m%d)"
            mv "$CONFIG_DIR/AGENTS.md" "$backup_file"
            print_success "Backed up AGENTS.md to: $backup_file"
        fi
    fi
    
    # Remove hybrid-arch.json
    if [[ -f "$CONFIG_DIR/hybrid-arch.json" ]]; then
        rm -f "$CONFIG_DIR/hybrid-arch.json"
        print_success "Removed hybrid-arch.json"
    fi
    
    # Remove skills
    if [[ -d "$CONFIG_DIR/skills" ]]; then
        echo ""
        echo -n "Remove installed skills? [y/N] "
        read -r remove_skills
        if [[ "$remove_skills" =~ ^[Yy]$ ]]; then
            rm -rf "$CONFIG_DIR/skills"
            print_success "Removed skills directory"
        else
            print_warning "Skills directory kept"
        fi
    fi
}

# Remove MCP configuration
remove_mcp_config() {
    print_header "Removing MCP Configuration..."
    
    if [[ -f "$MCP_CONFIG_DIR/.mcp.json" ]]; then
        echo ""
        echo -n "Remove MCP configuration? [y/N] "
        read -r remove_mcp
        if [[ "$remove_mcp" =~ ^[Yy]$ ]]; then
            rm -f "$MCP_CONFIG_DIR/.mcp.json"
            print_success "Removed MCP configuration"
        else
            print_warning "MCP configuration kept"
        fi
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
    echo "  ✓ Global configuration (optional)"
    echo "  ✓ MCP configuration (optional)"
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
