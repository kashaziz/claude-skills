# LucidReactor UI Component Importer

Import pre-built React components from the LucidReactor UI library directly into your project.

## Quick Start

### Basic Usage

Simply tell Claude what you want:

```
Add the BlogHero component from lucidreactor-ui
List components in lucidreactor-ui
```

Or reference the skill explicitly:

```
Using lucidreactor-ui, add the blog-hero component
```

## Available Components

### Blog Components

| Component | Description | Key Features |
|-----------|-------------|--------------|
| **BlogHero** | Hero header for blog posts | Gradient overlay, category badge, scroll indicator |
| **BlogCallout** | Status-colored callout boxes | Info/success/warning/error variants |
| **BlogPullQuote** | Styled pull quotes | Author attribution, multiple variants |
| **BlogRelatedPosts** | Related posts carousel | Hover effects, customizable grid |

## What This Skill Does

1. **Fetches** the component source from GitHub or local repository
2. **Creates** the appropriate directory structure in your project
3. **Copies** the component file to `src/components/{category}/`
4. **Adds** required utilities (like `cn` helper) if missing
5. **Shows** import statement and usage example

## Component Details

All components:
- ✅ Built with **TypeScript** (full type definitions)
- ✅ Styled with **Tailwind CSS**
- ✅ Support **dark mode** via CSS variables
- ✅ Follow **shadcn/ui** patterns
- ✅ Include **accessibility** features

## After Installation

The skill will tell you:
1. Where the component was created
2. How to import it
3. Required dependencies to install
4. Basic usage example

### Common Dependencies

```bash
npm install lucide-react clsx tailwind-merge
```

## Examples

### Adding a Single Component

```
User: Add the BlogHero component
Claude: [Fetches and copies BlogHero.tsx to your project]
        [Shows import statement and usage example]
```

### Listing All Components

```
User: List all lucidreactor-ui components
Claude: [Shows organized list with descriptions]
```

## Component Source

Components are fetched from:
- **GitHub**: `kashaziz/lucidreactor-ui` (when published)
- **Local**: `~/work/kashif/lucidreactor-ui/` (fallback)

## Coming Soon

- Marketing/landing page components
- Form components (SearchBar, FileUpload)
- Layout components (Header, Footer)

## Need Help?

Ask Claude:
- "Show me how to use the BlogHero component"
- "What props does BlogCallout accept?"
- "How do I customize the BlogRelatedPosts grid?"
