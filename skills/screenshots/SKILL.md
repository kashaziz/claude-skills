---
name: screenshots
description: Share screenshots from the project's screenshots folder with Claude for analysis and discussion
tags: [images, screenshots, visual, analysis]
---

# Screenshots Skill

You are helping the user share and analyze screenshots from their project.

## Task

The user has invoked the screenshots skill to view and discuss screenshots from the current project.

## Arguments Handling

The skill accepts optional arguments in this format:
- `/screenshots` - Show latest screenshot only (default)
- `/screenshots N` - Show latest N screenshots (e.g., `/screenshots 3`)
- `/screenshots all` - Show all screenshots in the folder
- `/screenshots pattern "glob"` - Show screenshots matching a pattern (e.g., `/screenshots pattern "login*.png"`)
- `/screenshots specific "filename"` - Show a specific screenshot

Parse the arguments if provided, otherwise default to showing the latest screenshot.

## Steps to Execute

### 1. Locate Screenshots Folder

Search for the screenshots folder in the current project using these common locations (in order of priority):
1. `./screenshots/`
2. `./docs/screenshots/`
3. `./.screenshots/`
4. `./assets/screenshots/`
5. `./public/screenshots/`

Use the Glob tool to check which folder exists:
```
pattern: "**/screenshots"
```

If no screenshots folder is found, inform the user and suggest creating one at `./screenshots/`.

### 2. Find Relevant Screenshots

Based on the arguments:

**Default (no args) - Latest screenshot:**
- Use Glob to find all image files: `screenshots/*.{png,jpg,jpeg,gif,webp}`
- Use Bash `ls -t` to sort by modification time
- Select the most recent one

**Number (e.g., "3") - Latest N screenshots:**
- Find all image files
- Sort by modification time (newest first)
- Select the first N screenshots

**"all" - All screenshots:**
- Find all image files in screenshots folder
- Include all of them (warn if more than 10)

**"pattern" - Pattern matching:**
- Use Glob with the provided pattern
- Example: `screenshots/login*.png`

**"specific" - Specific file:**
- Check if file exists in screenshots folder
- Read that specific file

### 3. Read and Display Screenshots

For each screenshot found:
1. Use the Read tool to view the image (Read tool supports images)
2. Include the filename and timestamp in your response
3. Provide context about what you observe in each screenshot

### 4. Analyze and Discuss

After displaying the screenshots:
- Describe what you see in each screenshot
- Ask the user what they'd like to discuss or analyze
- Offer to help with:
  - UI/UX feedback
  - Bug identification
  - Design suggestions
  - Documentation
  - Comparison between screenshots
  - Creating tickets or tasks based on what's shown

## Important Notes

- **Image Support**: Use the Read tool to view images directly (Claude Code supports image viewing)
- **File Formats**: Support common formats: PNG, JPG, JPEG, GIF, WebP
- **Performance**: If more than 10 screenshots match, warn the user and ask if they want to proceed
- **Relative Paths**: Always use paths relative to the current working directory
- **Error Handling**: If no screenshots found, provide helpful guidance

## Example Workflow

1. User runs `/screenshots 3`
2. You locate `./screenshots/` folder
3. You find 15 total screenshots
4. You use Bash to get the 3 most recent: `ls -t screenshots/*.{png,jpg} | head -3`
5. You read each of the 3 screenshots with the Read tool
6. You display them with context: "Here are the 3 most recent screenshots from your project..."
7. You analyze what you see and ask how you can help

## Response Format

Structure your response like this:

```
I found [N] screenshot(s) in `./screenshots/`.

Showing [description of which ones]:

---

**Screenshot 1**: `filename.png` (Modified: YYYY-MM-DD HH:MM)
[Display the image using Read tool]

[Your analysis of what you see]

---

**Screenshot 2**: `filename2.png` (Modified: YYYY-MM-DD HH:MM)
[Display the image using Read tool]

[Your analysis of what you see]

---

How can I help you with these screenshots? I can:
- Provide UI/UX feedback
- Identify potential issues
- Suggest improvements
- Help document features shown
- Compare different versions
```

## Edge Cases

- **No screenshots folder**: "I don't see a screenshots folder. Would you like me to help you create one at `./screenshots/`?"
- **Empty folder**: "The screenshots folder exists but is empty. Add some screenshots and try again!"
- **Too many matches**: "Found 47 screenshots. That's a lot! Did you want to narrow it down? Try `/screenshots 5` or `/screenshots pattern 'feature-name*.png'`"
- **Invalid pattern**: "I couldn't find any screenshots matching that pattern. Here are all available screenshots: [list]"

## Tips for Users

After completing the task, you can optionally mention:
- "Tip: Organize screenshots with descriptive names like `feature-login-success.png` for easier filtering"
- "Tip: Use `/screenshots pattern` to focus on specific features or dates"
- "Tip: Keep screenshots in `./screenshots/` for consistency across your projects"
