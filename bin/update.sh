#!/usr/bin/env bash
# OpenCode AI Hybrid Plugin Update Script
# Updates the plugin to the latest version

set -euo pipefail

PLUGIN_NAME="opencode-ai-hybrid"
INSTALL_DIR="${HOME}/.opencode-ai-hybrid"
CONFIG_DIR="${HOME}/.config/opencode"
HYBRID_CONFIG_DIR="${CONFIG_DIR}/opencode-ai-hybrid"

echo "=========================================="
echo "OpenCode AI Hybrid Updater"
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

# Check if installation exists
check_installation() {
    if [[ ! -d "$INSTALL_DIR" ]]; then
        print_error "Installation not found at: $INSTALL_DIR"
        echo ""
        echo "To install fresh, run:"
        echo "  curl -fsSL https://raw.githubusercontent.com/colerkks/opencode-ai-hybrid/main/install.sh | bash"
        exit 1
    fi
    
    print_success "Found installation at: $INSTALL_DIR"
}

# Get current version
get_current_version() {
    cd "$INSTALL_DIR"
    local version=$(git describe --tags --always 2>/dev/null || echo "unknown")
    echo "Current version: $version"
}

# Check for updates
check_for_updates() {
    print_header "Checking for Updates..."
    
    cd "$INSTALL_DIR"
    
    # Fetch latest changes
    git fetch origin --quiet
    
    local local_commit=$(git rev-parse HEAD)
    local remote_commit=$(git rev-parse origin/main 2>/dev/null || echo "")
    
    if [[ -z "$remote_commit" ]]; then
        print_error "Cannot check for updates (no remote)"
        return 1
    fi
    
    if [[ "$local_commit" == "$remote_commit" ]]; then
        print_success "Already up to date!"
        return 0
    else
        print_warning "Updates available"
        echo "  Local:  ${local_commit:0:7}"
        echo "  Remote: ${remote_commit:0:7}"
        return 2
    fi
}

# Backup current installation
backup_current() {
    print_header "Creating Backup..."
    
    local backup_dir="${INSTALL_DIR}.backup.$(date +%Y%m%d_%H%M%S)"
    
    # Only backup plugin-owned config files, not user/global OpenCode files
    mkdir -p "$backup_dir"
    
    if [[ -f "$HYBRID_CONFIG_DIR/AGENTS.md" ]]; then
        cp "$HYBRID_CONFIG_DIR/AGENTS.md" "$backup_dir/"
    fi
    
    if [[ -f "$HYBRID_CONFIG_DIR/hybrid-arch.json" ]]; then
        cp "$HYBRID_CONFIG_DIR/hybrid-arch.json" "$backup_dir/"
    fi

    if [[ -f "$HYBRID_CONFIG_DIR/mcp.json" ]]; then
        cp "$HYBRID_CONFIG_DIR/mcp.json" "$backup_dir/"
    fi
    
    print_success "Backup created: $backup_dir"
}

# Update repository
update_repo() {
    print_header "Updating Repository..."
    
    cd "$INSTALL_DIR"
    
    # Stash any local changes
    git stash push -m "Auto-stash before update" || true
    
    # Pull latest changes
    if git pull origin main; then
        print_success "Repository updated"
    else
        print_error "Failed to update repository"
        return 1
    fi
    
    # Show new version
    local new_version=$(git describe --tags --always 2>/dev/null || echo "unknown")
    echo "New version: $new_version"
}

# Rebuild plugin
rebuild_plugin() {
    print_header "Rebuilding Plugin..."
    
    local plugin_dir="$INSTALL_DIR/plugins/opencode-ai-hybrid-plugin"
    
    if [[ ! -d "$plugin_dir" ]]; then
        print_warning "Plugin source not found, skipping rebuild"
        return 0
    fi
    
    cd "$plugin_dir"
    
    # Install dependencies if needed
    if [[ ! -d "node_modules" ]]; then
        print_header "Installing dependencies..."
        npm install
    fi
    
    # Build plugin
    print_header "Building plugin..."
    npm run build
    
    print_success "Plugin rebuilt"
}

# Install updated plugin
install_updated_plugin() {
    print_header "Installing Updated Plugin..."
    
    local plugin_source="$INSTALL_DIR/plugins/opencode-ai-hybrid-plugin/dist"
    local plugin_target="$CONFIG_DIR/plugins/$PLUGIN_NAME"
    
    if [[ -d "$plugin_source" ]]; then
        # Install new plugin dist atomically
        local tmp_target="$plugin_target.new.$$"
        rm -rf "$tmp_target" 2>/dev/null || true
        mkdir -p "$tmp_target"
        cp -r "$plugin_source" "$tmp_target/"

        rm -rf "$plugin_target" 2>/dev/null || true
        mkdir -p "$plugin_target"
        cp -r "$tmp_target/dist" "$plugin_target/"
        rm -rf "$tmp_target" 2>/dev/null || true
        
        # Ensure entry point exists
        if [[ ! -f "$CONFIG_DIR/plugins/$PLUGIN_NAME.js" ]]; then
            cat > "$CONFIG_DIR/plugins/$PLUGIN_NAME.js" <<'EOF'
export { default } from "./opencode-ai-hybrid/dist/index.js";
EOF
        fi
        
        print_success "Plugin updated"
    else
        print_warning "Plugin dist not found, skipping plugin update"
    fi
}

# Update global configuration
update_global_config() {
    print_header "Updating Global Configuration..."
    mkdir -p "$HYBRID_CONFIG_DIR"
    
    # Update plugin-owned AGENTS.md if newer version exists
    if [[ -f "$INSTALL_DIR/config/AGENTS.md" ]]; then
        if [[ ! -f "$HYBRID_CONFIG_DIR/AGENTS.md" ]] || [[ "$INSTALL_DIR/config/AGENTS.md" -nt "$HYBRID_CONFIG_DIR/AGENTS.md" ]]; then
            cp "$INSTALL_DIR/config/AGENTS.md" "$HYBRID_CONFIG_DIR/AGENTS.md"
            print_success "Updated plugin-owned AGENTS.md"
        fi
    fi
    
    # Update plugin-owned hybrid-arch.json
    if [[ -f "$INSTALL_DIR/config/hybrid-arch.json" ]]; then
        cp "$INSTALL_DIR/config/hybrid-arch.json" "$HYBRID_CONFIG_DIR/hybrid-arch.json"
        print_success "Updated plugin-owned hybrid-arch.json"
    fi

    # Update plugin-owned MCP reference
    if [[ -f "$INSTALL_DIR/config/mcp.json" ]]; then
        cp "$INSTALL_DIR/config/mcp.json" "$HYBRID_CONFIG_DIR/mcp.json"
        print_success "Updated plugin-owned mcp.json"
    fi
    
    # Install new built-in skills without overwriting existing user skills
    if [[ -d "$INSTALL_DIR/skills" ]]; then
        mkdir -p "$CONFIG_DIR/skills"
        for skill_dir in "$INSTALL_DIR/skills/"*; do
            if [[ ! -d "$skill_dir" ]]; then
                continue
            fi

            local skill_name
            skill_name="$(basename "$skill_dir")"
            local target_dir="$CONFIG_DIR/skills/$skill_name"
            if [[ -d "$target_dir" ]]; then
                print_warning "Skill exists, skipping overwrite: $skill_name"
                continue
            fi

            cp -r "$skill_dir" "$target_dir"
            print_success "Installed new skill: $skill_name"
        done
    fi
}

# Show changelog
show_changelog() {
    print_header "Recent Changes"
    
    cd "$INSTALL_DIR"
    
    echo "Latest commits:"
    git log --oneline -5
    
    echo ""
    if [[ -f "CHANGELOG.md" ]]; then
        echo "See full changelog: $INSTALL_DIR/CHANGELOG.md"
    fi
}

# Generate update report
generate_report() {
    print_header "Update Summary"
    
    echo ""
    echo "✓ Repository updated"
    echo "✓ Plugin rebuilt and installed"
    echo "✓ Plugin-owned configuration updated"
    echo ""
    
    echo "Next steps:"
    echo "  1. Restart your terminal"
    echo "  2. If using OpenCode Desktop, restart it"
    echo "  3. Verify update: /arch-status"
    echo ""
    
    echo "If you encounter issues:"
    echo "  → Run diagnostic: ~/.opencode-ai-hybrid/bin/diagnose-plugin.sh"
    echo "  → Or reinstall: ~/.opencode-ai-hybrid/bin/setup-plugin.sh"
    echo ""
}

# Main update process
main() {
    check_installation
    
    get_current_version
    
    if ! check_for_updates; then
        # Return code 0 = up to date, 2 = updates available
        if [[ $? -eq 0 ]]; then
            exit 0
        fi
    fi
    
    echo ""
    echo -n "Proceed with update? [Y/n] "
    read -r response
    if [[ "$response" =~ ^[Nn]$ ]]; then
        echo "Update cancelled."
        exit 0
    fi
    
    backup_current
    update_repo
    rebuild_plugin
    install_updated_plugin
    update_global_config
    show_changelog
    generate_report
    
    print_success "Update complete!"
}

# Run
main "$@"
