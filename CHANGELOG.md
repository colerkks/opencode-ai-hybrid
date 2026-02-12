# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- No entries yet.

## [3.1.1] - 2026-02-13

### Fixed
- Prevent installer and updater from overwriting OpenCode global files by default (`~/.config/opencode/AGENTS.md`, `~/.config/opencode/hybrid-arch.json`, `~/.config/mcp/.mcp.json`).
- Prevent uninstaller from deleting global OpenCode skills and MCP configuration.
- Prevent skill installation/update from overwriting existing user skill directories with the same name.

### Changed
- Store plugin-owned defaults under `~/.config/opencode/opencode-ai-hybrid/`.
- Load plugin-owned global config first, with legacy global path fallback for backward compatibility.
- Refresh README and maintenance/installation/quickstart docs to match non-destructive install/update/uninstall behavior.

## [3.1.0] - 2026-02-08

### Added
- VS Code extension for hybrid architecture management
- OpenCode plugin system infrastructure
- CLI commands for architecture management (`/arch-init`, `/arch-status`)
- GitHub issue templates (bug report, feature request)
- GitHub PR template
- Security policy
- Project structure documentation

### Changed
- Updated README with clearer architecture diagrams
- Improved installation script

## [3.0.0] - 2026-02-08

### Added
- Three-layer hybrid architecture (Global > Skill > Project)
- AGENTS.md v3.0 with iteration records
- mcpx integration for on-demand tool discovery
- npx skills support for standardized skill management
- Next.js documentation router skill
- Next.js debug skill
- Example project template
- Multi-language documentation (Chinese & English)

### Changed
- Migrated from single-layer to three-layer architecture
- Reorganized project structure
- Updated all documentation

## [2.0.0] - 2026-02-01

### Added
- Initial skill system implementation
- MCP tool integration
- Basic AGENTS.md support

## [1.0.0] - 2026-01-15

### Added
- Initial release
- Basic architecture documentation
- Installation scripts

[Unreleased]: https://github.com/colerkks/opencode-ai-hybrid/compare/v3.1.1...HEAD
[3.1.1]: https://github.com/colerkks/opencode-ai-hybrid/compare/v3.1.0...v3.1.1
[3.1.0]: https://github.com/colerkks/opencode-ai-hybrid/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/colerkks/opencode-ai-hybrid/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/colerkks/opencode-ai-hybrid/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/colerkks/opencode-ai-hybrid/releases/tag/v1.0.0
