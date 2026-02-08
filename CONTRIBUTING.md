# Contributing to OpenCode AI Hybrid Architecture

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## 🎯 How Can I Contribute?

### 1. Report Bugs

If you find a bug, please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node.js version, etc.)

### 2. Suggest Enhancements

Have an idea to improve the project? Open an issue with:
- Clear use case
- Proposed solution
- Why it would be beneficial

### 3. Add New Skills

Skills are the heart of this project! To add a new skill:

1. Create a new directory under `skills/`
2. Write a `SKILL.md` file with YAML frontmatter
3. Include clear triggers and instructions
4. Test the skill thoroughly
5. Submit a PR

**Example skill structure:**
```
skills/my-awesome-skill/
├── SKILL.md          # Required: Main skill file
├── examples/         # Optional: Usage examples
└── tests/           # Optional: Test cases
```

**SKILL.md template:**
```markdown
---
name: my-awesome-skill
version: 1.0.0
description: What this skill does
author: your-name
tags:
  - tag1
  - tag2
agents:
  - opencode
  - cursor
triggers:
  - keyword1
  - keyword2
required_tools:
  - mcpx
---

# Skill Title

## Purpose
What this skill does and when to use it.

## Workflow
Step-by-step instructions.

## Examples
Usage examples.

## References
Links to relevant documentation.
```

### 4. Improve Documentation

- Fix typos
- Clarify instructions
- Add translations
- Create tutorials

### 5. Share Your Experience

- Write blog posts
- Create video tutorials
- Present at meetups
- Share on social media

## 📝 Pull Request Process

1. **Fork the repository**
2. **Create a branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit**: `git commit -m 'Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### PR Guidelines

- One logical change per PR
- Update documentation if needed
- Add tests for new features
- Ensure all tests pass
- Follow existing code style

## 🧪 Testing

Before submitting a PR:

```bash
# Test installation
./install.sh

# Verify components
mcpx --version
skills --version

# Test skills
skills list
```

## 🎨 Code Style

- Use clear, descriptive names
- Add comments for complex logic
- Follow existing formatting
- Keep functions focused

## 📋 Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

**Example:**
```
feat(skills): add react-component skill

Add skill for generating React components with best practices.

Closes #123
```

## 🌟 Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Added to contributors page

## 📞 Questions?

- Open an issue
- Start a discussion
- Contact maintainers

Thank you for contributing! 🚀
