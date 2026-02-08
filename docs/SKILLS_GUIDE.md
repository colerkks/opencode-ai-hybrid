# Skills Guide

## Overview

This guide explains how to use, create, and manage skills in the OpenCode AI Hybrid Architecture.

## Table of Contents

- [What are Skills?](#what-are-skills)
- [Using Skills](#using-skills)
- [Creating Skills](#creating-skills)
- [Skill Format](#skill-format)
- [Best Practices](#best-practices)

---

## What are Skills?

Skills are **standardized, reusable workflows** that work across 27+ AI assistants. They provide:

- **Consistent behavior** across different AI tools
- **Best practices** encoded as step-by-step instructions
- **Team collaboration** through version-controlled SOPs
- **Automatic activation** based on keywords

### Included Skills

#### 1. nextjs-docs-router

**Purpose**: Force document retrieval before Next.js coding

**Triggers**:
- `nextjs`, `next.js`, `app router`
- `server components`, `client components`
- `'use cache'`, `cacheLife`, `cacheTag`
- `connection()`, `forbidden()`, `unauthorized()`
- `after()`, `cookies()`, `headers()`

**What it does**:
1. Detects Next.js related keywords
2. Forces consultation of `.next-docs/` files
3. Provides API quick reference
4. Prevents common errors

#### 2. nextjs-debug

**Purpose**: Standardized debugging workflow

**Triggers**:
- `debug`, `fix`, `error`, `bug`
- `build fail`, `build error`
- `typescript error`, `type error`

**What it does**:
1. **Phase 1**: Collect Information
   - Error logs and stack traces
   - Recent changes
   - Environment details

2. **Phase 2**: Root Cause Analysis
   - Apply 5 Whys methodology
   - Identify true cause

3. **Phase 3**: Fix Implementation
   - Minimal viable fix
   - Verify no regression

4. **Phase 4**: Knowledge沉淀
   - Update iteration records
   - Document in error case library

---

## Using Skills

### Installation

```bash
# List installed skills
skills list

# Search for skills
skills find

# Search with keyword
skills find nextjs

# Install a skill
skills add nextjs-docs-router

# Install from GitHub
skills add username/repo

# Install from local path
skills add ./local-skills/my-skill
```

### Version Management

```bash
# Check for updates
skills check

# Update all skills
skills update

# Update specific skill
skills update nextjs-docs-router

# Remove skill
skills remove nextjs-docs-router
```

### Project-Level Locking

Create `skills.lock.json` to lock versions:

```json
{
  "skills": {
    "nextjs-docs-router": "1.0.0",
    "nextjs-debug": "1.0.0"
  },
  "updatedAt": "2026-02-08"
}
```

### Automatic Activation

Skills activate automatically when trigger keywords are detected:

```
User: "I need to debug this TypeScript error"
       ↓
AI detects: "debug", "TypeScript", "error"
       ↓
Activates: nextjs-debug skill
       ↓
Follows 4-phase debug workflow
```

---

## Creating Skills

### Step 1: Initialize

```bash
# Create skill directory
mkdir -p my-skill
cd my-skill

# Create SKILL.md
cat > SKILL.md << 'EOF'
---
name: my-skill
version: 1.0.0
description: Description of what this skill does
agents:
  - opencode
  - cursor
  - claude-code
triggers:
  - keyword1
  - keyword2
---

# Skill Content Here

## When to Use

Explain when this skill should be activated.

## Workflow

### Step 1: [Action]
Detailed instructions...

### Step 2: [Action]
Detailed instructions...

## Examples

```typescript
// Example code
```

## Troubleshooting

Common issues and solutions...
EOF
```

### Step 2: Define Metadata

**Required YAML Frontmatter**:

```yaml
---
name: skill-name           # Unique identifier
version: 1.0.0            # Semantic versioning
description: Brief description
agents:                   # Supported AI assistants
  - opencode
  - cursor
  - claude-code
  - github-copilot
triggers:                 # Activation keywords
  - keyword1
  - keyword2
  - "multi-word trigger"
categories:               # Optional categorization
  - nextjs
  - debugging
---
```

### Step 3: Write Content

**Structure**:

```markdown
## When to Use

Clear criteria for skill activation.

## Workflow

### Phase 1: [Name]
1. **Action**: What to do
2. **Tools**: Which tools to use
3. **Output**: Expected result

### Phase 2: [Name]
...

## Examples

### Example 1: [Scenario]
```
[Code example]
```

### Example 2: [Scenario]
...

## Common Pitfalls

- ❌ Don't do this
- ✅ Do this instead

## References

- [Link to docs](url)
```

### Step 4: Test

```bash
# Install locally
skills add ./my-skill

# Verify installation
skills list

# Test with sample prompt
# "Trigger keyword here"
```

### Step 5: Publish

```bash
# Commit to git
git init
git add .
git commit -m "Initial skill release"

# Push to GitHub
git remote add origin https://github.com/username/my-skill.git
git push -u origin main

# Tag release
git tag v1.0.0
git push origin v1.0.0
```

---

## Skill Format

### Complete Example

```markdown
---
name: react-component-creator
version: 1.2.0
description: Create React components with TypeScript following best practices
agents:
  - opencode
  - cursor
  - claude-code
triggers:
  - create component
  - new component
  - react component
  - add component
categories:
  - react
  - typescript
  - frontend
---

# React Component Creator

## When to Use

Use this skill when:
- Creating new React components
- Refactoring existing components
- Adding TypeScript types to components

## Workflow

### Phase 1: Analyze Requirements

**Input**: Component name, props, location

**Actions**:
1. Check existing component structure
2. Determine if Server or Client component needed
3. Identify required props interface

**Output**: Component specification

### Phase 2: Generate Component

**Actions**:
1. Create file at `components/{ComponentName}.tsx`
2. Add TypeScript interface for props
3. Implement component logic
4. Add JSDoc comments

**Template**:
```typescript
interface {ComponentName}Props {
  // Define props here
}

/**
 * {ComponentName} component
 * @description Brief description
 */
export function {ComponentName}({ ...props }: {ComponentName}Props) {
  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

### Phase 3: Add Tests

**Actions**:
1. Create test file `components/{ComponentName}.test.tsx`
2. Add basic rendering test
3. Add prop interaction tests

### Phase 4: Export

**Actions**:
1. Add export to `components/index.ts`
2. Verify import works

## Examples

### Example 1: Button Component
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary' 
}: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}
```

## Best Practices

- ✅ Use TypeScript for all components
- ✅ Add proper prop types
- ✅ Include JSDoc comments
- ✅ Write tests for complex logic
- ❌ Don't use `any` type
- ❌ Don't skip prop validation

## Troubleshooting

### Issue: Component not importing
**Solution**: Check if export added to index.ts

### Issue: Type errors
**Solution**: Verify interface matches usage

## References

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [React Documentation](https://react.dev/)
```

---

## Best Practices

### 1. Clear Triggers

- Use specific, unambiguous keywords
- Include variations (e.g., `debug`, `fix`, `troubleshoot`)
- Test trigger detection

### 2. Step-by-Step Instructions

- Break down into phases
- Each phase has clear input/output
- Include decision points

### 3. Concrete Examples

- Provide 2-3 real-world examples
- Show input → output
- Include edge cases

### 4. Error Handling

- Document common pitfalls
- Provide troubleshooting section
- Include error prevention tips

### 5. Version Management

- Use semantic versioning
- Document breaking changes
- Maintain changelog

### 6. Testing

- Test with actual AI assistant
- Verify trigger detection
- Check output quality

---

## Tips for Different Skill Types

### Documentation Skills
- Link to authoritative sources
- Provide quick reference tables
- Include common error prevention

### Debug Skills
- Use systematic approach (5 Whys)
- Include information gathering phase
- Force knowledge沉淀

### Code Generation Skills
- Provide templates
- Include validation steps
- Show before/after examples

### Workflow Skills
- Define clear entry/exit criteria
- Include verification steps
- Document success metrics

---

## Advanced Features

### Conditional Logic

```markdown
## Decision Tree

IF task involves database:
  → Use database skill
ELSE IF task involves API:
  → Use API skill
ELSE:
  → Use general coding skill
```

### Tool Integration

```markdown
## Tools Required

- filesystem: For file operations
- github: For repository operations
- websearch: For documentation lookup
```

### Cross-Platform Compatibility

```markdown
## Agent-Specific Notes

### OpenCode
- Use `todowrite` for task tracking
- Support background tasks

### Cursor
- Follow Cursor-specific patterns
- Use `.cursorrules` if available

### Claude Code
- Support both sync and async modes
- Use proper error handling
```

---

## Resources

- [Vercel Skills Documentation](https://github.com/vercel-labs/skills)
- [SKILL.md Specification](https://github.com/vercel-labs/skills/blob/main/SKILL.md)
- [Skill Examples](https://github.com/vercel-labs/skills/tree/main/examples)

---

**Last Updated**: 2026-02-08  
**Version**: 1.0.0
