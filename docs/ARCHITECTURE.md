# Architecture Documentation

## Overview

The OpenCode AI Hybrid Architecture implements a **three-layer architecture** that optimizes AI-assisted programming through document retrieval, tool discovery, and standardized skills.

```
┌─────────────────────────────────────────────────────────────┐
│  Project Layer (Highest Priority)                           │
│  - Project-specific constraints                             │
│  - Local documentation sources (.next-docs/)                │
│  - Skill version locking (skills.lock.json)                 │
├─────────────────────────────────────────────────────────────┤
│  Skill Layer (Middle Priority)                              │
│  - Reusable Standard Operating Procedures (SOPs)            │
│  - Cross-platform compatible (27 AI assistants)             │
│  - Version managed and team sharable                        │
├─────────────────────────────────────────────────────────────┤
│  Global Layer (Base Priority)                               │
│  - Universal behavior rules                                 │
│  - On-demand tool discovery (mcpx)                          │
│  - Skill management (npx skills)                            │
└─────────────────────────────────────────────────────────────┘
```

## Priority System

**Rule**: Project > Skill > Global

When conflicts occur:
1. Project configuration always wins
2. Skills override global defaults
3. Global provides fallback behavior

## Components

### 1. AGENTS.md v3.0

**Purpose**: Document-on-demand retrieval system

**Key Features**:
- Three-layer architecture support
- Iteration record system
- Common error case library
- Quick command templates

**Location**:
- Global: `~/.config/opencode/AGENTS.md`
- Project: `./AGENTS.md`

### 2. mcpx

**Purpose**: On-demand MCP tool discovery

**Benefits**:
- 99% token savings (47k → 400 tokens)
- Prompt cache preservation
- Dynamic tool loading

**Available Tools**:
- filesystem: 14 file operations
- github: 29 GitHub API operations

**Usage**:
```bash
mcpx list                          # List all tools
mcpx filesystem/read_file          # Use filesystem tool
mcpx github/search_code            # Use GitHub tool
```

### 3. npx skills

**Purpose**: Standardized skill management

**Supported Platforms**:
- OpenCode
- Cursor
- Claude Code
- GitHub Copilot
- And 23+ more

**Commands**:
```bash
skills list                        # List installed skills
skills find                        # Search for skills
skills add <package>              # Install skill
skills update                     # Update all skills
```

## Data Flow

### Normal Workflow

```
User Request
    ↓
Load Context
├── Global AGENTS.md (base rules)
├── Active Skills (SOPs)
└── Project AGENTS.md (overrides)
    ↓
Route Task
├── Next.js task → Force .next-docs/ retrieval
├── Tool operation → mcpx discover
└── Complex flow → Skill workflow
    ↓
Execute
    ↓
Verify
    ↓
Record
└── Update iteration records / skills
```

## Knowledge沉淀 Path

```
Personal Experience
    ↓ (generalize)
Global AGENTS.md
    ↓ (productize)
Skill (reusable SOP)
    ↓ (version)
skills.lock.json
    ↓ (practice)
Project Best Practices
```

## Configuration Files

### Global Configuration

```
~/.config/opencode/
├── AGENTS.md              # Global behavior rules
└── skills/                # Installed skills

~/.config/mcp/
└── .mcp.json             # MCP server configuration
```

### Project Configuration

```
my-project/
├── AGENTS.md             # Project-specific rules
├── .next-docs/           # Documentation index
├── skills.lock.json      # Skill version locking
└── .opencode/            # OpenCode config (optional)
```

## Best Practices

### 1. Project Setup

Always create these files for new projects:

```bash
# 1. Project AGENTS.md
cat > AGENTS.md << 'EOF'
# Project AGENTS.md

## Tech Stack
- Framework: Next.js 16.x
- Language: TypeScript 5.x
- Package Manager: pnpm

## Overrides
- Use 4-space indentation (not 2)
- Use Jest for testing (not Vitest)
EOF

# 2. Documentation index
mkdir -p .next-docs

# 3. Skill locking
cat > skills.lock.json << 'EOF'
{
  "skills": {
    "nextjs-docs-router": "1.0.0",
    "nextjs-debug": "1.0.0"
  }
}
EOF
```

### 2. Skill Development

When creating new skills:

1. **Clear triggers**: Define specific keywords
2. **Step-by-step**: Provide exact workflow
3. **Examples**: Include usage examples
4. **Tests**: Verify skill works
5. **Documentation**: Explain when to use

### 3. Iteration Records

Always update after fixing issues:

```markdown
## Iteration Records

| Date | Issue | Root Cause | Solution | Status |
|------|-------|------------|----------|--------|
| 2026-02-08 | 'use cache' not working | Wrong position | Move to top | ✅ |
```

## Performance

### Token Savings

| Approach | Tokens | Savings |
|----------|--------|---------|
| Traditional MCP | 47,000 | Baseline |
| mcpx | 400 | 99% |

### Accuracy Improvement

| Metric | Before | After |
|--------|--------|-------|
| AI Coding Accuracy | 53% | 100% |

## Security Considerations

### 1. Tool Access
- All tools via mcpx (auditable)
- Minimum privilege principle
- No direct tool calls in skills

### 2. Configuration
- No secrets in AGENTS.md
- Use environment variables
- Lock skill versions

### 3. Code Review
- Review skill changes
- Verify tool permissions
- Test before deployment

## Troubleshooting

### Issue: Skills not triggering

**Check**:
1. `skills list` shows installed skills
2. Trigger keywords match
3. skills.lock.json has correct versions

**Fix**:
```bash
skills check          # Check for updates
skills update         # Update skills
```

### Issue: mcpx not found

**Check**:
```bash
which mcpx
mcpx --version
```

**Fix**:
```bash
bun install -g github:cs50victor/mcpx
```

### Issue: AGENTS.md not loading

**Check**:
```bash
ls ~/.config/opencode/AGENTS.md
ls ./AGENTS.md
```

**Fix**:
```bash
./install.sh  # Re-run installer
```

## Future Enhancements

1. **More Skills**: Expand skill library
2. **CI Integration**: Automated testing
3. **Analytics**: Usage tracking
4. **GUI**: Visual skill management
5. **Marketplace**: Skill sharing platform

## References

- [Vercel AGENTS.md Research](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)
- [mcpx Documentation](https://github.com/cs50victor/mcpx)
- [Vercel Skills](https://github.com/vercel-labs/skills)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Last Updated**: 2026-02-08  
**Version**: 3.0.0
