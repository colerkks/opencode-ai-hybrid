# opencode-ai-hybrid (Kyle1.0)

An OpenCode Desktop-compatible plugin that implements **Global + Skill + Project** hybrid architecture.

What you get:
- Three-layer config discovery and merge (Project > Skill > Global)
- Skill discovery from `.opencode/skills`, `~/.opencode/skills`, `~/.config/opencode/skills`
- Dynamic registration of discovered skills as OpenCode tools (e.g. `skills_nextjs_docs_router`)
- Project command scaffold `.opencode/commands/{arch-status,arch-reload,arch-init}.md`
- Session-created context injection + toast hint

## Install

This repo installs it for you via the root `install.sh`.

If you want to install manually (Global plugin directory):

1. Copy `dist/` into:
   - `~/.config/opencode/plugins/opencode-ai-hybrid/dist/`
2. Create `~/.config/opencode/plugins/opencode-ai-hybrid.js`:

```js
export { default } from "./opencode-ai-hybrid/dist/index.js";
```

Restart OpenCode Desktop.

## Usage

Run these commands inside OpenCode:
- `/arch-init`
- `/arch-status`
- `/arch-reload`

## Notes

- OpenCode plugins cannot currently render a custom sidebar tree panel. We approximate the "panel" requirement with a toast + deterministic `/arch-status` output.
