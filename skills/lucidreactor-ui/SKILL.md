# LucidReactor UI Component Importer

Import components from the LucidReactor UI library into your project.

## Usage

To use this skill, reference it in your message:

```
Using ~/.claude/skills/lucidreactor-ui/SKILL.md, add the blog-hero component
Using ~/.claude/skills/lucidreactor-ui/SKILL.md, list all available components
```

Or more naturally:

```
Add the BlogHero component from lucidreactor-ui
List components in lucidreactor-ui
```

## Instructions

When the user requests to add a component from lucidreactor-ui:

### 1. Fetch Component Source

Fetch from GitHub (when published) or local file:
- **GitHub**: `https://raw.githubusercontent.com/kashaziz/lucidreactor-ui/main/packages/ui/src/components/{category}/{ComponentName}.tsx`
- **Local**: `~/work/kashif/lucidreactor-ui/packages/ui/src/components/{category}/{ComponentName}.tsx`

### 2. Available Components

#### Blog Components (`blog/`)
- **BlogHero.tsx** - Hero header with gradient overlay for blog posts
- **BlogCallout.tsx** - Status-colored callout boxes (info, success, warning, error)
- **BlogPullQuote.tsx** - Pull quotes with accent styling and author attribution
- **BlogRelatedPosts.tsx** - Related posts carousel with hover effects

#### Coming Soon
- **marketing/** - Marketing/landing page components
- **forms/** - Form components (SearchBar, FileUpload, etc.)
- **layout/** - Layout components (Header, Footer, etc.)

### 3. Copy Component to Project

- **Target directory**: `src/components/{category}/`
- Create directory if it doesn't exist
- Write the component file with the same name

### 4. Copy Utilities (if needed)

Check if `src/lib/utils.ts` exists in the target project.

If not, create it with the `cn` utility:

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 5. Show Success Message

After copying, inform the user:

1. **Component location**: Where the file was created
2. **Import statement**: How to import it
   ```tsx
   import { ComponentName } from '@/components/{category}/{ComponentName}';
   ```
3. **Required dependencies**: List any packages that need to be installed
   - `lucide-react` - Icons (most components)
   - `clsx` - Class name utility
   - `tailwind-merge` - Tailwind class merging
   - `@radix-ui/*` - UI primitives (some components)

4. **Usage example**: Basic usage of the component

## When User Lists Components

Show all available components organized by category:

```
🎨 LucidReactor UI Components

Blog Components:
  • BlogHero - Hero header with gradient overlay
  • BlogCallout - Status-colored callout boxes
  • BlogPullQuote - Pull quotes with accent styling
  • BlogRelatedPosts - Related posts carousel

Usage: "Add the BlogHero component from lucidreactor-ui"
```

## Component Details

### BlogHero
Hero header with gradient overlay, category badge, and scroll indicator.

**Props**: title, subtitle, image, category, readTime, date, author, gradient

**Dependencies**: lucide-react

### BlogCallout
Status-colored callout boxes for highlighting important information.

**Props**: children, variant (info/success/warning/error), title

**Dependencies**: lucide-react

### BlogPullQuote
Styled pull quotes with optional author attribution.

**Props**: children, author, role, variant (default/accent/bordered)

**Dependencies**: lucide-react

### BlogRelatedPosts
Related posts carousel with hover effects and customizable grid.

**Props**: posts, title, columns (2/3/4)

**Dependencies**: lucide-react

## Notes

- All components use Tailwind CSS for styling
- All components are TypeScript with full type definitions
- All components support dark mode via CSS variables
- Components follow shadcn/ui patterns and conventions
- Local file path should be used when GitHub repo is not yet public
