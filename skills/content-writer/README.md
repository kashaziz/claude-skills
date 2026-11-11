# Skills Directory

This directory contains custom skills and workflows for Claude Code to enhance productivity and maintain consistency across the HalalCodeCheck project.

## Available Skills

### 🎨 SEO Content Writer
**Command**: `/content` (when configured) or use prompt templates
**Purpose**: Generate high-quality, SEO-optimized content that ranks well and converts readers

**What it does**:
- Creates blog posts, landing pages, emails, and social media content
- Asks discovery questions to understand your needs
- Provides complete SEO packages (metadata, keywords, linking strategy)
- Writes in a natural, human-like tone that passes AI detection
- Follows conversion optimization best practices

**Key files**:
- `seo-content-writer.md` - Full skill definition and process
- `IMPLEMENTATION_GUIDE.md` - Detailed setup and usage guide
- `QUICK_START.md` - Copy-paste templates for immediate use

**Quick start**: See `QUICK_START.md` for templates you can use right now.

---

## How to Use Skills

### Method 1: Direct Prompt (Easiest)
Simply reference the skill in your request:
```
Using skills/seo-content-writer.md, create a blog post about [topic]
```

### Method 2: Task Agent
Use Claude Code's Task tool:
```
Task: "Follow the process in skills/seo-content-writer.md to create [content type] about [topic]"
```

### Method 3: Custom Command (Advanced)
Configure as a custom skill in Claude Code to use as `/content` command. See individual skill documentation for setup.

---

## Creating New Skills

To add a new skill to this directory:

1. **Create skill definition file**: `[skill-name].md`
2. **Document the process**: Clear steps, examples, expected outputs
3. **Add implementation guide**: Setup instructions and usage examples
4. **Update this README**: Add skill to the list above

### Skill Template Structure
```markdown
# [Skill Name]

## Purpose
What this skill does and when to use it

## Skill Definition
The actual prompt/process

## Usage
How to invoke and use the skill

## Examples
Real-world use cases and outputs

## Advanced Features
Additional capabilities

## Best Practices
Tips for getting the best results
```

---

## Skill Guidelines

When creating or using skills:

1. **Be specific**: Clear instructions lead to better outputs
2. **Provide context**: Reference project docs when relevant
3. **Iterate**: Start simple, then refine and expand
4. **Document**: Keep track of what works well
5. **Stay consistent**: Follow project conventions (CLAUDE.md, style_guide.md, content_guide.md)

---

## Project Integration

All skills should be aware of and reference:
- `CLAUDE.md` - Project instructions and conventions
- `planning/content_guide.md` - Features, messaging, technical specs
- `planning/style_guide.md` - Design system, brand voice, UI components
- `planning/system_updates.md` - Change log (update after using skills)

---

## Feedback & Improvements

Found a way to improve a skill? Suggestions for new skills?

1. Update the skill documentation
2. Add your improvements
3. Document changes in `planning/system_updates.md`

---

## Current Skill Roadmap

### Potential Future Skills
- **Code Review**: Automated code quality checks
- **Test Generator**: Create unit/integration tests
- **Documentation Writer**: Generate technical docs from code
- **Accessibility Checker**: Audit for WCAG compliance
- **Performance Optimizer**: Identify and fix performance issues
- **i18n Content**: Multi-language content generation

Want to contribute? Create a skill definition and add it to this directory!

---

## Quick Reference

| Skill | File | Use Case |
|-------|------|----------|
| SEO Content Writer | `seo-content-writer.md` | Blog posts, landing pages, emails, social |

---

**Last Updated**: 2026-01-25
