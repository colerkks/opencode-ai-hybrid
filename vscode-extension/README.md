# Hybrid Architecture for OpenCode

VS Code extension providing GUI for the three-layer architecture (Global + Skill + Project) hybrid-arch plugin.

## Features

### 🏗️ Three-Layer Architecture Dashboard
- **Global Layer**: System-wide configurations and skills (`~/.config/opencode/`)
- **Skill Layer**: User-specific skills (`~/.opencode/skills/`)
- **Project Layer**: Project-specific configurations (`./.opencode/`)

### 📊 Dashboard Panel
Visual dashboard showing:
- Skill counts per layer
- Skill details (name, version, description)
- Configuration paths
- Real-time status updates

### 🌲 Explorer Sidebar
Tree view in VS Code explorer:
- Expandable layers (Global, Skill, Project)
- List of installed skills
- Direct skill opening
- Refresh capability

### ⌨️ Commands
All commands available via Command Palette (`Ctrl+Shift+P`):

| Command | Description | Keybinding |
|---------|-------------|------------|
| `Hybrid Arch: Show Dashboard` | Open dashboard panel | `Ctrl+Shift+H` |
| `Hybrid Arch: Initialize Project` | Create `.opencode/` structure | - |
| `Hybrid Arch: Show Status` | Quick status notification | - |
| `Hybrid Arch: Reload Configuration` | Reload and refresh | - |
| `Hybrid Arch: Install Skill` | Install new skill | - |

## Installation

### From VSIX (Local)

```bash
cd vscode-extension
npm install
npm run compile
npm run package
# Install hybrid-arch-opencode-1.0.0-kyle.1.vsix in VS Code
```

### From Marketplace (Future)

Search "Hybrid Architecture for OpenCode" in VS Code extensions.

## Usage

### 1. Initialize Project
```bash
Ctrl+Shift+P → Hybrid Arch: Initialize Project
```
This creates:
```
.opencode/
├── hybrid-arch.json    # Configuration
├── skills/             # Project-specific skills
└── commands/           # Custom commands
```

### 2. Open Dashboard
```bash
Ctrl+Shift+H
# or
Ctrl+Shift+P → Hybrid Arch: Show Dashboard
```

### 3. View Skills in Sidebar
- Open Explorer sidebar (`Ctrl+Shift+E`)
- Find "Hybrid Arch" section
- Expand layers to see installed skills

## Configuration

Settings available in VS Code preferences:

```json
{
  "hybridArch.opencodePath": "opencode",
  "hybridArch.showNotifications": true,
  "hybridArch.autoReload": true
}
```

## Integration with OpenCode Plugin

This extension works alongside the OpenCode hybrid-arch plugin:
- Reads the same configuration files
- Displays skills discovered by the plugin
- Provides GUI for plugin commands

## Development

```bash
cd vscode-extension

# Install dependencies
npm install

# Compile
npm run compile

# Watch for changes
npm run watch

# Run tests
npm test

# Package
npm run package
```

## Architecture

```
vscode-extension/
├── src/
│   ├── extension.ts           # Entry point
│   ├── types.ts               # Type definitions
│   ├── core/
│   │   └── ConfigManager.ts   # Config loading
│   ├── panels/
│   │   └── DashboardPanel.ts  # WebView panel
│   └── providers/
│       └── HybridArchProvider.ts  # Tree view
├── package.json               # Extension manifest
└── tsconfig.json             # TypeScript config
```

## Requirements

- VS Code 1.74.0 or higher
- OpenCode CLI (optional, for advanced features)

## Release Notes

### 1.0.0-kyle.1
- Initial release
- Dashboard panel with three-layer view
- Explorer sidebar integration
- Project initialization
- Status and reload commands

## License

MIT

## Links

- Repository: https://github.com/colerkks/opencode-ai-hybrid
- Issues: https://github.com/colerkks/opencode-ai-hybrid/issues
