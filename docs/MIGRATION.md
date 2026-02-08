# Migration Guide

This guide helps you migrate from existing setups to the OpenCode AI Hybrid Architecture.

## Table of Contents

- [From Traditional MCP](#from-traditional-mcp)
- [From Plain AGENTS.md](#from-plain-agentsmd)
- [From Custom Scripts](#from-custom-scripts)
- [From Other AI Assistants](#from-other-ai-assistants)
- [Migration Checklist](#migration-checklist)

---

## From Traditional MCP

### Current Setup

```javascript
// Traditional MCP - Pre-loads all tools
const mcpServer = {
  tools: [
    { name: 'read_file', /* 400 lines of schema */ },
    { name: 'write_file', /* 400 lines of schema */ },
    // ... 40+ more tools
  ]
}
// Total: ~47,000 tokens
```

### Problems

1. **Massive token usage** - 47k tokens just for tool definitions
2. **Cache pollution** - Every tool change invalidates cache
3. **Slow startup** - Must load all tools upfront
4. **Context bloat** - Unnecessary tools in every request

### Migration Steps

#### Step 1: Install mcpx

```bash
# Install mcpx
bun install -g github:cs50victor/mcpx

# Or with npm
npm install -g github:cs50victor/mcpx
```

#### Step 2: Configure MCP

Create `~/.config/mcp/.mcp.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

#### Step 3: Update AI Assistant Config

**Before**:
```json
{
  "mcpServers": {
    "filesystem": { /* full config */ },
    "github": { /* full config */ }
  }
}
```

**After**:
```json
{
  "mcpServers": {}  // Empty! mcpx handles discovery
}
```

#### Step 4: Update Skills

**Before**:
```markdown
Use filesystem tools to read files.
```

**After**:
```markdown
Use mcpx to discover and use filesystem tools:
```bash
mcpx filesystem/read_file '{"path": "./file.md"}'
```
```

#### Step 5: Test

```bash
# List available tools
mcpx list

# Test filesystem
mcpx filesystem/read_file '{"path": "./README.md"}'

# Test GitHub
mcpx github/search_code '{"query": "language:typescript"}'
```

### Benefits After Migration

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Token Usage | 47k | 400 | -99% |
| Cache Hits | Low | High | +95% |
| Startup Time | 5s | 0.5s | -90% |
| Tool Access | All | On-demand | More focused |

---

## From Plain AGENTS.md

### Current Setup

```markdown
# AGENTS.md

## Rules
1. Use TypeScript
2. Follow ESLint
3. Write tests
```

### Problems

1. **No structure** - Flat rules hard to maintain
2. **No versioning** - Changes not tracked
3. **No iteration tracking** - Same errors repeat
4. **No skill integration** - Can't reuse patterns

### Migration Steps

#### Step 1: Backup Current AGENTS.md

```bash
cp AGENTS.md AGENTS.md.backup
```

#### Step 2: Create Three-Layer Structure

**Global Layer** (`~/.config/opencode/AGENTS.md`):
```markdown
# Global AGENTS.md

## Universal Rules
- Use TypeScript for all projects
- Follow semantic versioning
- Document all changes

## Available Skills
- nextjs-docs-router
- nextjs-debug

## Quick Commands
- `/plan` - Create task plan
- `/debug` - Debug workflow
- `/review` - Code review
```

**Skill Layer** (Auto-managed):
```bash
# Install skills
skills add nextjs-docs-router
skills add nextjs-debug
```

**Project Layer** (`./AGENTS.md`):
```markdown
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
| 2026-02-08 | Example | Fix | ✅ |
```

#### Step 3: Convert Rules to Skills

**Before** (in AGENTS.md):
```markdown
## Debug Process
1. Check logs
2. Find root cause
3. Fix issue
4. Document
```

**After** (as Skill):
```bash
# Create skill
cat > skills/nextjs-debug/SKILL.md << 'EOF'
---
name: nextjs-debug
version: 1.0.0
triggers: [debug, fix, error]
---

## 4-Phase Debug Workflow
...
EOF

# Install
skills add ./skills/nextjs-debug
```

#### Step 4: Add Iteration Records

Create error case library in project AGENTS.md:

```markdown
## Common Error Cases

### Error 1: 'use cache' Position
**Problem**: Directive not working
**Cause**: Wrong position in file
**Solution**: Move to top
```

#### Step 5: Test Integration

```bash
# Verify global AGENTS.md
ls ~/.config/opencode/AGENTS.md

# List skills
skills list

# Test skill activation
# "Debug this TypeScript error"
```

---

## From Custom Scripts

### Current Setup

```bash
#!/bin/bash
# custom-setup.sh

# Install dependencies
npm install

# Setup linting
npx eslint --init

# Create folders
mkdir -p src/components src/pages
```

### Problems

1. **Platform-specific** - Only works on your machine
2. **No AI integration** - Scripts don't guide AI
3. **Hard to maintain** - Updates require new scripts
4. **No versioning** - Can't track changes

### Migration Steps

#### Step 1: Identify Script Functions

```bash
# List what your scripts do
cat custom-setup.sh | grep -E "^(npm|npx|mkdir|cp)"

# Example output:
# npm install
# npx eslint --init
# mkdir -p src/components
# cp template/* ./
```

#### Step 2: Convert to Skills

**Setup Skill**:
```markdown
---
name: project-setup
version: 1.0.0
triggers: [setup, init, create project]
---

# Project Setup

## When to Use
Initializing a new project with standard structure.

## Workflow

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Linting
```bash
npx eslint --init
```

### Step 3: Create Structure
```bash
mkdir -p src/components src/pages src/lib
```

### Step 4: Copy Templates
```bash
cp node_modules/my-templates/* ./
```

## Verification
- [ ] package.json exists
- [ ] node_modules installed
- [ ] Folders created
```

#### Step 3: Install Skill

```bash
skills add ./skills/project-setup
```

#### Step 4: Replace Scripts

**Before**:
```bash
./custom-setup.sh
```

**After**:
```
User: "Setup a new Next.js project"
AI: [Activates project-setup skill]
    → Follows workflow
    → Executes setup
```

#### Step 5: Version Control

```bash
git add skills/project-setup
git commit -m "Add project setup skill"
git tag v1.0.0
```

---

## From Other AI Assistants

### Cursor

**Current**: `.cursorrules` file

**Migration**:
1. Keep `.cursorrules` for Cursor-specific settings
2. Extract common patterns to Skills
3. Use AGENTS.md for universal rules

```markdown
# .cursorrules (Cursor-specific)
- Use VS Code settings
- Follow Cursor's AI features
```

```markdown
# AGENTS.md (Universal)
- Use TypeScript
- Follow project structure
```

### Claude Code

**Current**: Custom instructions

**Migration**:
1. Convert instructions to AGENTS.md format
2. Use Skills for reusable workflows
3. Leverage Claude Code's bash capabilities

### GitHub Copilot

**Current**: Limited customization

**Migration**:
1. Use AGENTS.md for context
2. Create Skills for common patterns
3. Combine with Copilot's suggestions

---

## Migration Checklist

### Pre-Migration

- [ ] Backup existing configuration
- [ ] Document current workflow
- [ ] List all custom scripts/tools
- [ ] Identify pain points

### During Migration

- [ ] Install mcpx
- [ ] Set up three-layer AGENTS.md
- [ ] Install core skills
- [ ] Convert custom scripts to skills
- [ ] Test each component
- [ ] Update documentation

### Post-Migration

- [ ] Verify all tools work
- [ ] Test skill activation
- [ ] Check token usage
- [ ] Train team on new workflow
- [ ] Archive old configurations
- [ ] Monitor for issues

### Verification Tests

```bash
# Test mcpx
mcpx list
mcpx filesystem/read_file '{"path": "./test.txt"}'

# Test skills
skills list
skills check

# Test AGENTS.md
# Create test project with ./AGENTS.md

# Test integration
# Run common tasks and verify behavior
```

---

## Common Migration Issues

### Issue 1: Tools Not Found

**Symptom**: `mcpx: command not found`

**Solution**:
```bash
# Reinstall mcpx
bun install -g github:cs50victor/mcpx

# Check PATH
echo $PATH | grep -o bun

# Verify installation
which mcpx
```

### Issue 2: Skills Not Activating

**Symptom**: Keywords don't trigger skills

**Solution**:
```bash
# Check skill installation
skills list

# Verify triggers
skil skill/path/SKILL.md | grep triggers

# Reinstall skill
skills remove skill-name
skills add skill-name
```

### Issue 3: AGENTS.md Not Loading

**Symptom**: AI doesn't follow AGENTS.md rules

**Solution**:
```bash
# Check file location
ls ~/.config/opencode/AGENTS.md
ls ./AGENTS.md

# Verify format
cat AGENTS.md | head -20

# Check permissions
ls -la AGENTS.md
```

### Issue 4: Token Usage Still High

**Symptom**: No improvement in token usage

**Solution**:
```bash
# Verify mcpx is being used
# Check that tools are called via mcpx
# Not direct tool calls

# Check MCP configuration
# Ensure pre-loaded tools are removed
```

---

## Rollback Plan

If migration fails:

```bash
# 1. Restore backups
cp AGENTS.md.backup AGENTS.md

# 2. Uninstall new tools
npm uninstall -g mcpx

# 3. Remove skills
skills remove nextjs-docs-router
skills remove nextjs-debug

# 4. Restore old configuration
cp ~/.config/mcp/.mcp.json.backup ~/.config/mcp/.mcp.json

# 5. Verify old setup works
# Run previous workflows
```

---

## Timeline Recommendations

### Week 1: Setup
- Install mcpx and skills
- Create basic AGENTS.md structure
- Test in non-critical project

### Week 2: Migration
- Migrate one project
- Convert critical scripts
- Train team members

### Week 3: Optimization
- Refine skills
- Add iteration records
- Document learnings

### Week 4: Full Adoption
- Migrate all projects
- Archive old setups
- Share with team

---

## Support

- 📖 [Architecture Documentation](ARCHITECTURE.md)
- 🛠️ [Skills Guide](SKILLS_GUIDE.md)
- ❓ [FAQ](FAQ.md)
- 🐛 [GitHub Issues](https://github.com/colerkks/opencode-ai-hybrid/issues)

---

**Last Updated**: 2026-02-08  
**Version**: 1.0.0
