# OpenCode AI Hybrid (Global)

This is the plugin-owned AGENTS.md installed to `~/.config/opencode/opencode-ai-hybrid/AGENTS.md` by `install.sh`.

## Global Rules

- Prefer retrieval-led reasoning when framework APIs are involved.
- Never read secrets: `.env`, credentials, tokens.
- For OpenCode plugin usage:
  - Use `/arch-init` once per project
  - Use `/arch-status` to verify effective rules/docs/skills

## Three-Layer Priority

- Project (`./AGENTS.md`, `.opencode/hybrid-arch.json`) overrides
- Skill (`skills.lock.json`, `.opencode/skills/`) overrides
- Global (this file, `~/.config/opencode/opencode-ai-hybrid/hybrid-arch.json`) is the base
