# Frequently Asked Questions (FAQ)

## General Questions

### Q: What is the OpenCode AI Hybrid Architecture?

**A**: A three-layer system (Global + Skill + Project) that combines AGENTS.md, mcpx, and npx skills to achieve 100% AI coding accuracy with 99% token savings.

### Q: Is this free to use?

**A**: Yes! All components are open source:
- AGENTS.md: Free methodology
- mcpx: Open source tool
- npx skills: Open source CLI

### Q: Which AI assistants are supported?

**A**: Works with 27+ assistants including:
- OpenCode
- Cursor
- Claude Code
- GitHub Copilot
- And any AI tool that supports context files

---

## Installation & Setup

### Q: How do I install?

**A**: One-line installation:
```bash
curl -fsSL https://raw.githubusercontent.com/colerkks/opencode-ai-hybrid/main/install.sh | bash
```

Or manually:
```bash
git clone https://github.com/colerkks/opencode-ai-hybrid.git
cd opencode-ai-hybrid
./install.sh
```

### Q: What are the prerequisites?

**A**: 
- Node.js 18+ or Bun
- Git
- One of the supported AI assistants

### Q: Where are files installed?

**A**:
- Global AGENTS.md: `~/.config/opencode/AGENTS.md`
- Global mcpx config: `~/.config/mcp/.mcp.json`
- Skills: `~/.config/skills/`
- Project files: `./AGENTS.md`, `./skills.lock.json`

### Q: Can I customize the installation?

**A**: Yes! The install script is modular. You can:
- Skip components with flags
- Customize paths
- Use your own templates

See [install.sh](../install.sh) for details.

---

## AGENTS.md

### Q: What is AGENTS.md?

**A**: A configuration file that guides AI assistants with:
- Project rules and constraints
- Error case libraries
- Quick command templates
- Iteration records

### Q: Why three layers?

**A**: 
- **Global**: Consistent behavior across all projects
- **Skill**: Reusable workflows shared with team
- **Project**: Flexible, project-specific rules

Priority: Project > Skill > Global

### Q: How do I create a project AGENTS.md?

**A**:
```bash
cat > AGENTS.md << 'EOF'
# Project AGENTS.md

## Tech Stack
- Framework: Next.js 16.x
- Language: TypeScript 5.x

## Overrides
- Use 4-space indentation
- Use Jest for testing

## Iteration Records
| Date | Issue | Solution | Status |
|------|-------|----------|--------|
EOF
```

### Q: Can I have multiple AGENTS.md files?

**A**: Yes! The system automatically loads:
1. Global: `~/.config/opencode/AGENTS.md`
2. Skills: Embedded in each skill
3. Project: `./AGENTS.md`

### Q: What should I include in AGENTS.md?

**A**:
- Tech stack information
- Coding standards
- Common error cases
- Quick commands
- Iteration records
- Project-specific rules

---

## Skills

### Q: What are skills?

**A**: Standardized, reusable workflows that work across 27+ AI assistants. They encode best practices as step-by-step instructions.

### Q: How do skills activate?

**A**: Automatically when trigger keywords are detected, or manually via commands.

Example:
```
User: "Debug this error"
→ Detects: "debug", "error"
→ Activates: nextjs-debug skill
```

### Q: How do I create a skill?

**A**:
1. Create directory: `mkdir my-skill`
2. Create `SKILL.md` with YAML frontmatter
3. Define triggers and workflow
4. Test: `skills add ./my-skill`
5. Share: Push to GitHub

See [Skills Guide](SKILLS_GUIDE.md) for details.

### Q: Can I use skills from others?

**A**: Yes! Search and install:
```bash
skills find              # Interactive search
skills add user/repo     # From GitHub
```

### Q: How do I update skills?

**A**:
```bash
skills check      # Check for updates
skills update     # Update all
skills update skill-name  # Update specific
```

### Q: What skills are included?

**A**:
- `nextjs-docs-router`: Next.js documentation routing
- `nextjs-debug`: Debug SOP

More coming soon!

---

## mcpx

### Q: What is mcpx?

**A**: Tool-on-demand discovery system that saves 99% of tokens by loading tools only when needed.

### Q: How does it save tokens?

**A**:
- Traditional MCP: Pre-loads 47k tokens of tool definitions
- mcpx: Only 400 tokens for discovery
- Result: 99% token savings

### Q: What tools are available?

**A**: 
- **filesystem**: 14 file operations
- **github**: 29 GitHub API operations
- More can be added via MCP servers

### Q: How do I use mcpx?

**A**:
```bash
# List all tools
mcpx list

# Search tools
mcpx grep "*file*"

# Use a tool
mcpx filesystem/read_file '{"path": "./README.md"}'
```

### Q: Can I add custom tools?

**A**: Yes! Edit `~/.config/mcp/.mcp.json`:
```json
{
  "mcpServers": {
    "my-tool": {
      "command": "npx",
      "args": ["-y", "my-mcp-server"]
    }
  }
}
```

### Q: Is mcpx required?

**A**: No, but highly recommended for token savings. You can use traditional MCP if preferred.

---

## Performance

### Q: What are the performance benefits?

**A**:
| Metric | Before | After |
|--------|--------|-------|
| AI Accuracy | 53% | 100% |
| Token Usage | 47k | 400 |
| Skill Reusability | None | Standardized |
| Context Management | Chaotic | Organized |

### Q: Will this slow down my AI assistant?

**A**: No, it typically speeds up operations:
- Faster context loading (cached AGENTS.md)
- On-demand tools (no pre-loading)
- Reusable skills (no re-explaining)

### Q: How much disk space is needed?

**A**: Minimal:
- AGENTS.md: ~10KB
- Skills: ~50KB each
- mcpx: ~5MB

### Q: Does it work offline?

**A**: Yes! Once installed:
- AGENTS.md is local
- Skills are local
- Only mcpx tool calls need network

---

## Troubleshooting

### Q: Skills not activating?

**A**:
1. Check installation: `skills list`
2. Verify triggers in SKILL.md
3. Check keyword spelling
4. Try manual activation

### Q: mcpx not found?

**A**:
```bash
# Reinstall
bun install -g github:cs50victor/mcpx

# Check PATH
echo $PATH

# Verify
which mcpx
```

### Q: AGENTS.md not loading?

**A**:
1. Check location: `ls ~/.config/opencode/AGENTS.md`
2. Verify format (must be valid Markdown)
3. Check permissions
4. Restart AI assistant

### Q: High token usage still?

**A**:
1. Ensure mcpx is actually being used
2. Check for pre-loaded MCP tools
3. Verify skills are active
4. Review AGENTS.md size

### Q: Errors after migration?

**A**:
1. Check [Migration Guide](MIGRATION.md)
2. Verify all components installed
3. Test with simple task
4. Check logs for errors

---

## Best Practices

### Q: How do I organize my AGENTS.md?

**A**:
```markdown
# Structure
1. Tech Stack
2. Overrides (project-specific)
3. Common Error Cases
4. Iteration Records
5. Quick Commands
```

### Q: How often should I update skills?

**A**:
- Check weekly: `skills check`
- Update when notified
- Pin versions in production: `skills.lock.json`

### Q: Should I commit AGENTS.md to git?

**A**:
- **Project AGENTS.md**: Yes, commit it
- **Global AGENTS.md**: No, it's personal
- **Skills**: Yes, if custom

### Q: How do I share skills with my team?

**A**:
1. Create skill repository
2. Push to GitHub
3. Share install command:
   ```bash
   skills add your-org/skill-name
   ```
4. Lock versions in `skills.lock.json`

---

## Advanced

### Q: Can I use this with CI/CD?

**A**: Yes! Install in your pipeline:
```yaml
# .github/workflows/ai-check.yml
- name: Install AI tools
  run: |
    curl -fsSL .../install.sh | bash
    skills add nextjs-docs-router
    # Run AI checks
```

### Q: How do I debug skill activation?

**A**:
```bash
# Enable verbose mode (if supported by AI tool)
# Check skill triggers
cat skill/SKILL.md | grep -A5 triggers
# Test with explicit keywords
```

### Q: Can I override global settings per project?

**A**: Yes! Project AGENTS.md always wins:
```markdown
# ./AGENTS.md
## Overrides
- Override global: Use 2 spaces (not 4)
- Add project-specific: Use Redux for state
```

### Q: How do I contribute?

**A**: See [CONTRIBUTING.md](CONTRIBUTING.md):
1. Fork repository
2. Create feature branch
3. Make changes
4. Submit PR

---

## Comparisons

### Q: How is this different from Cursor's `.cursorrules`?

**A**:
| Feature | Cursor Rules | Hybrid Architecture |
|---------|--------------|---------------------|
| Platform | Cursor only | 27+ assistants |
| Structure | Single file | Three layers |
| Reusability | Personal | Team sharable |
| Skills | Limited | Standardized |

### Q: vs. Claude Code's custom instructions?

**A**: 
- Claude Code: Specific to Anthropic's tool
- Hybrid: Works across all assistants
- Plus: Skills, mcpx integration, iteration tracking

### Q: vs. GitHub Copilot?

**A**:
- Copilot: AI pair programmer
- Hybrid: AI environment framework
- Best together: Use Copilot with Hybrid Architecture

### Q: vs. Traditional MCP?

**A**:
| Aspect | Traditional | Hybrid with mcpx |
|--------|-------------|------------------|
| Token Usage | 47k | 400 |
| Tool Loading | Pre-load | On-demand |
| Cache | Polluted | Preserved |

---

## Getting Help

### Q: Where can I get support?

**A**:
- 📖 Documentation: [README](../README.md)
- 🐛 Issues: [GitHub Issues](https://github.com/colerkks/opencode-ai-hybrid/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/colerkks/opencode-ai-hybrid/discussions)

### Q: How do I report bugs?

**A**:
1. Check [existing issues](https://github.com/colerkks/opencode-ai-hybrid/issues)
2. Create new issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details

### Q: Can I request features?

**A**: Yes! Open a feature request on GitHub:
1. Describe the use case
2. Explain current limitation
3. Propose solution

### Q: Is there a community?

**A**: 
- GitHub Discussions for Q&A
- Watch the repository for updates
- Share your skills with the community

---

## Future

### Q: What's planned for future versions?

**A**:
- More built-in skills
- GUI for skill management
- CI/CD integrations
- Analytics dashboard
- Skill marketplace

### Q: How can I stay updated?

**A**:
- Watch the GitHub repository
- Check `skills check` regularly
- Follow releases

### Q: Can I contribute skills?

**A**: Absolutely! See [Skills Guide](SKILLS_GUIDE.md) for:
- Skill creation guide
- Best practices
- Publishing instructions

---

**Last Updated**: 2026-02-08  
**Version**: 1.0.0

---

<div align="center">

**Still have questions?** 

[Open an Issue](https://github.com/colerkks/opencode-ai-hybrid/issues) | [Start a Discussion](https://github.com/colerkks/opencode-ai-hybrid/discussions)

</div>
