# Screenshots Skill - Complete Guide

## ✅ Setup Complete!

The global `/screenshots` skill has been installed and is ready to use in this project and all future projects.

## What Was Created

### 1. Global Skill
**Location**: `~/.claude/skills/screenshots.md`
- Works in **any project** automatically
- No per-project configuration needed
- Invoked with `/screenshots` command

### 2. Current Project Setup
**Location**: `./screenshots/` folder
- Ready to receive your screenshots
- Includes README with usage guide
- Tracked in Git (optional)

### 3. Setup Script (For Future Projects)
**Location**: `~/.claude/scripts/setup-screenshots.sh`
- Run in any new project to create screenshots folder
- Automatically creates README
- Optional .gitignore configuration

## How to Use

### Basic Commands

```bash
# Show the latest screenshot
/screenshots

# Show the latest 3 screenshots
/screenshots 3

# Show all screenshots in the folder
/screenshots all

# Show screenshots matching a pattern
/screenshots pattern "login*.png"

# Show a specific screenshot
/screenshots specific "dashboard-error.png"
```

### Step-by-Step Example

1. **Take a Screenshot**
   - Use your OS screenshot tool (macOS: Cmd+Shift+4, Windows: Win+Shift+S)
   - Or use browser DevTools screenshot feature

2. **Save to Screenshots Folder**
   ```bash
   # Save with a descriptive name
   screenshots/voice-search-microphone-active.png
   ```

3. **Invoke the Skill in Claude Code**
   ```bash
   /screenshots
   ```

4. **Claude Will**:
   - Locate your screenshots folder
   - Find and display the screenshot(s)
   - Analyze what's shown in the images
   - Ask how you'd like help

## Parameters Explained

### No Parameters (Default)
```bash
/screenshots
```
Shows **the most recent** screenshot only.

### Number Parameter
```bash
/screenshots 5
```
Shows the **latest N screenshots** sorted by modification time (newest first).

### "all" Parameter
```bash
/screenshots all
```
Shows **all screenshots** in the folder. Claude will warn if there are more than 10.

### "pattern" Parameter
```bash
/screenshots pattern "feature-login*.png"
```
Shows screenshots matching the **glob pattern**. Useful for filtering by feature or date.

### "specific" Parameter
```bash
/screenshots specific "bug-checkout-error.png"
```
Shows **one specific screenshot** by exact filename.

## Advanced Use Cases

### 1. Design Review
```bash
# Compare homepage iterations
/screenshots pattern "homepage-v*.png"
```
Then ask Claude: "Which design feels most intuitive and why?"

### 2. Bug Investigation
```bash
# Show error screenshot
/screenshots specific "payment-error-console.png"
```
Then ask: "Help me debug this payment flow error based on the console output shown."

### 3. Responsive Testing
```bash
# Show all mobile views
/screenshots pattern "mobile-*.png"
```
Then ask: "Review these mobile screens for responsive design issues."

### 4. Feature Documentation
```bash
# Get latest 3 features implemented
/screenshots 3
```
Then ask: "Create user-facing documentation for these features."

### 5. Before/After Comparison
```bash
# Show related screenshots
/screenshots pattern "header-redesign*.png"
```
Then ask: "Compare the before and after designs. What improved?"

## Organizing Screenshots

### Recommended Naming Conventions

**Format**: `[component]-[state]-[detail].png`

**Examples**:
```
scanner-dialog-camera-active.png
database-table-mobile-view.png
checkout-flow-payment-error.png
settings-page-dark-mode.png
homepage-hero-before-redesign.png
homepage-hero-after-redesign.png
```

### Optional Folder Structure

For large projects, organize by feature:

```
screenshots/
├── voice-search/
│   ├── idle.png
│   ├── listening.png
│   └── results.png
├── manual-search/
│   ├── empty-state.png
│   ├── autocomplete.png
│   └── results.png
└── bugs/
    ├── checkout-error-20260124.png
    └── camera-permission-denied.png
```

Then use patterns:
```bash
/screenshots pattern "voice-search/*.png"
/screenshots pattern "bugs/*.png"
```

## Setting Up in New Projects

### Option 1: Run Setup Script
```bash
~/.claude/scripts/setup-screenshots.sh
```

This creates:
- `screenshots/` folder
- `screenshots/README.md`
- Optionally updates `.gitignore`

### Option 2: Manual Setup
```bash
mkdir screenshots
```

That's it! The skill works automatically.

## Git Integration

### Option A: Track All Screenshots (Default)
Good for documentation, design references, and permanent records.

```bash
# Screenshots are committed to Git
git add screenshots/
git commit -m "Add feature screenshots for documentation"
```

### Option B: Ignore Screenshots
Good for temporary debugging, large files, or sensitive data.

Add to `.gitignore`:
```gitignore
# Ignore all screenshot images
screenshots/*.png
screenshots/*.jpg
screenshots/*.jpeg

# But keep the folder structure
!screenshots/.gitkeep
!screenshots/README.md
```

### Option C: Selective Tracking
Keep documentation screenshots, ignore temporary ones.

```
screenshots/
├── docs/           # Tracked in Git
│   └── features/
└── temp/           # Ignored in Git (add to .gitignore)
    └── debugging/
```

## Skill Architecture

### How It Works

1. **Skill Invocation**: You type `/screenshots [args]`
2. **Skill Loading**: Claude loads `~/.claude/skills/screenshots.md`
3. **Folder Detection**: Skill searches for screenshots folder in common locations:
   - `./screenshots/` (recommended)
   - `./docs/screenshots/`
   - `./.screenshots/`
   - `./assets/screenshots/`
   - `./public/screenshots/`
4. **File Discovery**: Uses Glob and Bash tools to find matching images
5. **Image Reading**: Uses Read tool to view images (Read supports images)
6. **Analysis**: Claude analyzes images and responds

### Supported Formats

- PNG (`.png`)
- JPEG (`.jpg`, `.jpeg`)
- GIF (`.gif`)
- WebP (`.webp`)

## Troubleshooting

### "I don't see a screenshots folder"
**Solution**: Create one:
```bash
mkdir screenshots
# Or use the setup script
~/.claude/scripts/setup-screenshots.sh
```

### "The screenshots folder is empty"
**Solution**: Add some screenshots to the folder and try again.

### "Found too many screenshots"
**Solution**: Use parameters to narrow down:
```bash
# Instead of /screenshots all
/screenshots 5
# Or use pattern
/screenshots pattern "feature-name*.png"
```

### "Skill not found"
**Solution**: Verify the skill file exists:
```bash
ls -la ~/.claude/skills/screenshots.md
```

If missing, recreate it from the documentation.

### "Can't find specific screenshot"
**Solution**: List all screenshots first:
```bash
ls screenshots/
```
Then use the exact filename with `/screenshots specific "exact-name.png"`

## Best Practices

### 1. Descriptive Names
❌ `screenshot1.png`, `image.png`, `temp.png`
✅ `checkout-payment-error.png`, `mobile-menu-open.png`

### 2. Regular Cleanup
- Delete outdated screenshots
- Archive old design iterations
- Keep only relevant recent screenshots

### 3. Add Context in Filenames
Include dates for time-sensitive bugs:
```
checkout-error-20260124.png
performance-before-optimization-20260120.png
```

### 4. Use Patterns Effectively
Group related screenshots with consistent naming:
```
feature-login-step1.png
feature-login-step2.png
feature-login-step3.png
```
Then: `/screenshots pattern "feature-login*.png"`

### 5. Annotate When Needed
Use annotation tools to add:
- Arrows pointing to specific elements
- Text labels for clarity
- Circles highlighting important areas

## Integration with Other Tools

### With /commit
```bash
# After adding feature screenshots
/screenshots 3
# Review with Claude
/commit  # Claude suggests: "Add feature screenshots for X, Y, Z"
```

### With Bug Tracking
```bash
# Capture error state
/screenshots specific "error-500.png"
# Discuss with Claude to create detailed bug report
```

### With Documentation
```bash
# Get all feature screenshots
/screenshots pattern "feature-*.png"
# Ask Claude to generate user documentation based on screenshots
```

## FAQ

**Q: Does this work in all my projects?**
A: Yes! It's a global skill. Just create a `screenshots/` folder in each project.

**Q: Can I have multiple screenshots folders?**
A: Yes, but the skill looks for one primary folder. Use subfolders for organization.

**Q: What if my screenshots folder is elsewhere?**
A: The skill checks common locations. If yours is different, you can modify the skill file.

**Q: Can I customize the skill?**
A: Yes! Edit `~/.claude/skills/screenshots.md` to change behavior or add features.

**Q: Will this work in non-Git projects?**
A: Yes! The screenshots folder works independently of Git.

**Q: How many screenshots is too many?**
A: Claude will warn if you try to load more than 10 at once. Use parameters to filter.

## Next Steps

1. **Take Some Screenshots**: Capture your app's current state
2. **Try the Skill**: Run `/screenshots` to see it in action
3. **Experiment with Parameters**: Try different commands to see what works best
4. **Set Up Other Projects**: Use the setup script in your other projects

---

**The skill is ready to use! Start by taking a screenshot and running `/screenshots` to test it out.**
