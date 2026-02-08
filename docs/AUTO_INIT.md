# Auto-Initialization System

## Overview

OpenCode AI Hybrid now features **full auto-initialization**. When you open any project in OpenCode, the plugin automatically:

1. ✅ **Detects project root** (not subdirectories)
2. ✅ **Creates `skills.lock.json`** if missing
3. ✅ **Fills empty lockfile** with default skills
4. ✅ **Respects existing config** (Project > Skill > Global)
5. ✅ **Auto reloads** to apply changes
6. ✅ **Shows status** in toast notification

## How It Works

### Opening a New Project

```
User opens OpenCode in /my-project/docs/
    ↓
Plugin detects project root: /my-project (found .git)
    ↓
No skills.lock.json found
    ↓
Auto-creates skills.lock.json with default skills
    ↓
Auto-reloads to apply skills
    ↓
Toast: "Auto-init: created skills.lock.json with nextjs-docs-router, nextjs-debug"
```

## Configuration

Default behavior is controlled by `~/.config/opencode/hybrid-arch.json`:

```json
{
  "default_skills": ["nextjs-docs-router", "nextjs-debug"],
  "auto_apply_defaults": true,
  "auto_reload": true
}
```

## Verification

After opening a project, verify auto-init worked:

```bash
# In OpenCode, run:
/arch-status

# Should show:
# - Project root: correct path
# - Skills: default skills loaded
# - No "Skill layer empty" warning
```

## Technical Details

- **Project Detection**: Walks up directory tree looking for `.git`, `package.json`, etc.
- **Skills Injection**: Creates new lockfile OR fills empty one with defaults
- **Auto Reload**: Automatically reloads after applying skills
- **Backward Compatible**: Respects existing skills.lock.json

*This system makes OpenCode AI Hybrid truly "zero-config".*