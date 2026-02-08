#!/usr/bin/env bash
# OpenCode AI Hybrid Plugin Auto-Setup Script
# This script ensures the plugin is automatically loaded when OpenCode starts

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_NAME="opencode-ai-hybrid"
CONFIG_DIR="${HOME}/.config/opencode"
PLUGIN_DIR="${CONFIG_DIR}/plugins/${PLUGIN_NAME}"
PLUGIN_ENTRY="${CONFIG_DIR}/plugins/${PLUGIN_NAME}.js"

echo "=========================================="
echo "OpenCode AI Hybrid Plugin Auto-Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if OpenCode is installed
check_opencode_installed() {
    print_status "Checking OpenCode installation..."
    
    local opencode_found=false
    local opencode_path=""
    
    # Check common locations
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if [[ -d "/Applications/OpenCode.app" ]]; then
            opencode_found=true
            opencode_path="/Applications/OpenCode.app"
        elif [[ -d "$HOME/Applications/OpenCode.app" ]]; then
            opencode_found=true
            opencode_path="$HOME/Applications/OpenCode.app"
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v opencode &> /dev/null; then
            opencode_found=true
            opencode_path=$(which opencode)
        fi
    fi
    
    if [[ "$opencode_found" == true ]]; then
        print_success "OpenCode found at: $opencode_path"
        return 0
    else
        print_warning "OpenCode Desktop not found in standard locations"
        return 1
    fi
}

# Check plugin installation
check_plugin_installed() {
    print_status "Checking plugin installation..."
    
    if [[ -d "$PLUGIN_DIR" ]] && [[ -f "$PLUGIN_ENTRY" ]]; then
        print_success "Plugin is installed at: $PLUGIN_DIR"
        return 0
    else
        print_error "Plugin not properly installed"
        return 1
    fi
}

# Install or update plugin
install_plugin() {
    print_status "Installing/updating plugin..."
    
    # Create plugin directory
    mkdir -p "$PLUGIN_DIR"
    
    # Build plugin if needed
    if [[ -d "$SCRIPT_DIR/../plugins/opencode-ai-hybrid-plugin" ]]; then
        cd "$SCRIPT_DIR/../plugins/opencode-ai-hybrid-plugin"
        
        if [[ ! -d "dist" ]] || [[ "src/index.ts" -nt "dist/index.js" ]]; then
            print_status "Building plugin..."
            npm install
            npm run build
        fi
        
        # Copy dist files
        rm -rf "$PLUGIN_DIR/dist" 2>/dev/null || true
        cp -r dist "$PLUGIN_DIR/"
        print_success "Plugin files copied"
    fi
    
    # Create entry point
    cat > "$PLUGIN_ENTRY" <<'EOF'
export { default } from "./opencode-ai-hybrid/dist/index.js";
EOF
    
    print_success "Plugin entry point created at: $PLUGIN_ENTRY"
}

# Create OpenCode configuration if not exists
setup_opencode_config() {
    print_status "Setting up OpenCode configuration..."
    
    mkdir -p "$CONFIG_DIR"
    
    # Create or update settings.json
    local settings_file="$CONFIG_DIR/settings.json"
    
    if [[ -f "$settings_file" ]]; then
        print_status "Existing settings.json found, checking plugin configuration..."
        # Check if plugin is in settings
        if grep -q "opencode-ai-hybrid" "$settings_file" 2>/dev/null; then
            print_success "Plugin already in OpenCode settings"
        else
            print_warning "Plugin not found in settings.json, manual activation may be needed"
        fi
    else
        print_status "Creating default settings.json..."
        cat > "$settings_file" <<EOF
{
  "plugins": {
    "opencode-ai-hybrid": {
      "enabled": true,
      "autoLoad": true
    }
  },
  "hybridArch": {
    "autoInit": true,
    "showToast": true
  }
}
EOF
        print_success "Created settings.json with plugin configuration"
    fi
}

# Create auto-loader script
create_autoloader() {
    print_status "Creating auto-loader script..."
    
    local autoloader_dir="$CONFIG_DIR/autoload"
    mkdir -p "$autoloader_dir"
    
    cat > "$autoloader_dir/hybrid-arch.sh" <<'EOF'
#!/bin/bash
# Auto-loader for OpenCode AI Hybrid Plugin
# This script runs when OpenCode starts

HYBRID_DIR="${HOME}/.opencode-ai-hybrid"
PLUGIN_DIR="${HOME}/.config/opencode/plugins/opencode-ai-hybrid"

# Check if plugin needs update
if [[ -d "$HYBRID_DIR/plugins/opencode-ai-hybrid-plugin" ]]; then
    cd "$HYBRID_DIR/plugins/opencode-ai-hybrid-plugin"
    
    # Check if source is newer than dist
    if [[ "src/index.ts" -nt "dist/index.js" ]]; then
        echo "[Hybrid Arch] Plugin update detected, rebuilding..."
        npm run build 2>/dev/null || true
        cp -r dist "$PLUGIN_DIR/"
        echo "[Hybrid Arch] Plugin updated successfully"
    fi
fi

# Verify plugin is properly linked
if [[ ! -f "${HOME}/.config/opencode/plugins/opencode-ai-hybrid.js" ]]; then
    echo "[Hybrid Arch] Plugin entry missing, recreating..."
    cat > "${HOME}/.config/opencode/plugins/opencode-ai-hybrid.js" <<'PLUGIN_EOF'
export { default } from "./opencode-ai-hybrid/dist/index.js";
PLUGIN_EOF
    echo "[Hybrid Arch] Plugin entry recreated"
fi

echo "[Hybrid Arch] Auto-loader completed"
EOF
    
    chmod +x "$autoloader_dir/hybrid-arch.sh"
    print_success "Auto-loader script created"
}

# Create user guide
create_user_guide() {
    print_status "Creating user guide..."
    
    cat > "$CONFIG_DIR/HYBRID_PLUGIN_GUIDE.md" <<'EOF'
# OpenCode AI Hybrid 插件使用指南

## 🚀 自动加载说明

本插件已配置为自动加载模式。正常情况下，您无需手动操作。

## ✅ 验证插件是否加载

打开 OpenCode 后，查看以下迹象：

1. **Toast 提示**：右上角会显示 "Hybrid Arch Loaded" 提示
2. **命令可用**：尝试输入 `/arch-status`
3. **上下文注入**：插件会自动注入架构上下文到对话中

## 🔧 如果插件未自动加载

### 方法 1：重启 OpenCode
完全退出 OpenCode（包括菜单栏图标），然后重新打开。

### 方法 2：手动激活
在 OpenCode 中执行：
```bash
# 检查插件状态
ls -la ~/.config/opencode/plugins/

# 重新安装插件
~/.opencode-ai-hybrid/bin/setup-plugin.sh
```

### 方法 3：诊断问题
运行诊断工具：
```bash
cd ~/.opencode-ai-hybrid
./bin/diagnose-plugin.sh
```

## 📝 常见问题

### Q: 安装后没有看到插件提示
A: 请确保：
1. 完全退出 OpenCode（Cmd+Q 或 Alt+F4）
2. 重新打开 OpenCode
3. 等待 5-10 秒让插件初始化

### Q: 命令 `/arch-init` 不存在
A: 插件可能未正确加载。尝试：
1. 检查插件文件是否存在：`ls ~/.config/opencode/plugins/opencode-ai-hybrid/`
2. 重新运行安装脚本：`curl -fsSL ... | bash`
3. 手动创建入口文件：参见上方的手动激活方法

### Q: 如何更新插件？
A: 插件会自动检测更新。您也可以手动更新：
```bash
cd ~/.opencode-ai-hybrid
git pull origin main
./install.sh
```

## 🆘 获取帮助

- 📧 Issues: https://github.com/colerkks/opencode-ai-hybrid/issues
- 💬 Discussions: https://github.com/colerkks/opencode-ai-hybrid/discussions
- 📖 文档: https://github.com/colerkks/opencode-ai-hybrid/blob/main/README.md
EOF
    
    print_success "用户指南已创建: $CONFIG_DIR/HYBRID_PLUGIN_GUIDE.md"
}

# Main execution
main() {
    echo ""
    
    # Check prerequisites
    check_opencode_installed || true
    
    # Install/update plugin
    install_plugin
    
    # Setup configuration
    setup_opencode_config
    
    # Create auto-loader
    create_autoloader
    
    # Create user guide
    create_user_guide
    
    # Verify installation
    if check_plugin_installed; then
        echo ""
        print_success "✅ 插件自动配置完成！"
        echo ""
        echo "下一步："
        echo "  1. 完全退出 OpenCode（Cmd+Q 或 Alt+F4）"
        echo "  2. 重新打开 OpenCode"
        echo "  3. 等待 5-10 秒，查看右上角提示"
        echo "  4. 尝试命令: /arch-status"
        echo ""
        echo "详细指南: $CONFIG_DIR/HYBRID_PLUGIN_GUIDE.md"
        echo ""
    else
        print_error "❌ 插件配置失败，请检查错误信息"
        exit 1
    fi
}

# Run main function
main "$@"
