# Screenshots Skill

Share and analyze screenshots from your project with Claude for instant visual feedback, UI/UX analysis, and documentation.

## Quick Start

### Basic Usage

```bash
/screenshots              # Show latest screenshot
/screenshots 3            # Show latest 3 screenshots
/screenshots all          # Show all screenshots
/screenshots pattern "login*.png"    # Show matching screenshots
/screenshots specific "dashboard.png" # Show specific screenshot
```

## What This Skill Does

1. **Locates** your project's screenshots folder
2. **Finds** relevant screenshots based on your criteria
3. **Displays** images with context (filename, timestamp)
4. **Analyzes** what it sees in each screenshot
5. **Offers** help with UI/UX feedback, bugs, or documentation

## Screenshots Folder

The skill searches for screenshots in these locations (in order):
1. `./screenshots/` (recommended)
2. `./docs/screenshots/`
3. `./.screenshots/`
4. `./assets/screenshots/`
5. `./public/screenshots/`

**Tip**: Use `./screenshots/` in your project root for consistency.

## Use Cases

### 1. Get UI/UX Feedback
```
/screenshots 2
"What do you think of the navigation design?"
```

### 2. Identify Bugs
```
/screenshots pattern "error*.png"
"Can you spot any issues in these error screens?"
```

### 3. Compare Versions
```
/screenshots pattern "v1-dashboard.png v2-dashboard.png"
"Compare these two dashboard versions"
```

### 4. Document Features
```
/screenshots pattern "onboarding*.png"
"Help me write documentation for this onboarding flow"
```

### 5. Create Tickets
```
/screenshots
"Create a GitHub issue for the alignment problem you see here"
```

## Supported Formats

- PNG
- JPG/JPEG
- GIF
- WebP

## Examples

### Example 1: Latest Screenshot
```
User: /screenshots
Claude: Shows the most recent screenshot with analysis
```

### Example 2: Multiple Screenshots
```
User: /screenshots 5
Claude: Shows 5 most recent screenshots, analyzes each one
```

### Example 3: Pattern Matching
```
User: /screenshots pattern "login-*.png"
Claude: Shows all screenshots matching the pattern
```

### Example 4: Specific File
```
User: /screenshots specific "dashboard-final.png"
Claude: Shows that specific screenshot
```

## What Claude Can Help With

After viewing screenshots, Claude can:
- ✅ Provide UI/UX feedback
- ✅ Identify potential issues or bugs
- ✅ Suggest design improvements
- ✅ Help document features shown
- ✅ Compare different versions
- ✅ Create tickets or tasks
- ✅ Generate test cases
- ✅ Review accessibility concerns

## Best Practices

### Organize Your Screenshots

Use descriptive filenames:
```
✅ feature-login-success.png
✅ bug-mobile-overflow-2024-01-15.png
✅ v2-dashboard-dark-mode.png

❌ screenshot1.png
❌ image.png
❌ temp.png
```

### Keep It Organized

```
screenshots/
├── features/
│   ├── login-*.png
│   └── dashboard-*.png
├── bugs/
│   └── error-*.png
└── designs/
    └── mockup-*.png
```

## Additional Guides

This skill includes comprehensive guides:
- **SCREENSHOT_CAPTURE_GUIDE.md** - How to capture and organize screenshots
- **SCREENSHOTS_SKILL_GUIDE.md** - Detailed skill usage and examples
- **QUICK_SCREENSHOT_WORKFLOW.md** - Fast workflows for common tasks
- **capture-screenshots.cjs** - Automated screenshot capture script

## Troubleshooting

### No Screenshots Folder Found
```
Claude: "I don't see a screenshots folder. Would you like me to
         help you create one at ./screenshots/?"
```

### Empty Folder
```
Claude: "The screenshots folder exists but is empty.
         Add some screenshots and try again!"
```

### Too Many Matches
```
Claude: "Found 47 screenshots. That's a lot!
         Try /screenshots 5 or narrow with a pattern."
```

## Tips

- **Organize**: Use descriptive names for easier filtering
- **Pattern matching**: Focus on specific features with `/screenshots pattern`
- **Consistency**: Keep all screenshots in `./screenshots/` across projects
- **Timestamp**: Screenshots are automatically sorted by modification time
- **Automation**: Use the included `capture-screenshots.cjs` script for automated captures

## Need Help?

Ask Claude:
- "How do I capture screenshots systematically?"
- "Help me organize my screenshots folder"
- "What's the best way to name screenshots?"
