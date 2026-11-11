# Claude Skills Overview

Production-ready Claude skills packaged for distribution. Each skill is a specialized capability that extends Claude's functionality for specific tasks.

## Available Skills

### 1. SEO Content Writer (`content-writer`)
**Purpose**: Create SEO-optimized content that ranks well and converts readers into clients.

**Specializes in:**
- Case studies with quantified outcomes
- Portfolio pieces showcasing technical expertise
- Thought leadership blog posts
- LinkedIn articles with engagement focus
- Landing pages for service offerings

**Key Features:**
- E-E-A-T framework (Experience, Expertise, Authoritativeness, Trust)
- Search intent analysis (problem-aware, solution-aware, provider-aware)
- Humanized writing (no AI patterns, no em-dashes)
- Interactive discovery process
- Platform-specific adaptations

**Use When:** Creating business content, case studies, or blog posts that need to demonstrate expertise and attract clients

📂 **Files**: 6 files including SKILL.md, README.md, implementation guides, and examples

---

### 2. Full-Stack MVP Builder (`full-stack-mvp-builder`)
**Purpose**: Generate production-ready full-stack MVP web applications with complete codebases.

**Tech Stack:**
- **Frontend**: Astro + Tailwind CSS
- **Backend Options**: Express.js, FastAPI, Django, Astro Edge
- **Deployment**: Render, Vercel, CloudFlare, DigitalOcean, AWS, Azure

**Key Features:**
- Complete authentication systems
- CRUD operations with validation
- Database integration
- API endpoints with documentation
- Tests and deployment configs
- Security hardening checklists

**Use When:** Building a full-stack web application from scratch with production-ready code

📂 **Files**: 9 files including SKILL.md, backend guides, deployment guides, security checklists, and templates

---

### 3. LucidReactor UI (`lucidreactor-ui`)
**Purpose**: Import pre-built React components from the LucidReactor UI library into your project.

**Available Components:**
- **BlogHero** - Hero headers with gradient overlays
- **BlogCallout** - Status-colored callout boxes
- **BlogPullQuote** - Styled pull quotes with attribution
- **BlogRelatedPosts** - Related posts carousels

**Key Features:**
- TypeScript components with full type definitions
- Tailwind CSS styling
- Dark mode support
- shadcn/ui patterns
- Automatic dependency detection

**Use When:** Building blog or content-heavy websites that need polished, production-ready components

📂 **Files**: 2 files including SKILL.md and README.md

---

### 4. Screenshots (`screenshots`)
**Purpose**: Share and analyze screenshots from your project with Claude for visual feedback.

**Capabilities:**
- View latest N screenshots
- Pattern-based filtering
- Visual analysis and feedback
- UI/UX suggestions
- Bug identification
- Documentation assistance

**Key Features:**
- Automatic screenshot folder detection
- Multiple format support (PNG, JPG, GIF, WebP)
- Timestamp-based sorting
- Pattern matching with globs
- Automated capture script included

**Use When:** Getting feedback on UI/UX, identifying visual bugs, comparing designs, or documenting features

📂 **Files**: 6 files including SKILL.md, README.md, workflow guides, and automation script

---

## Skill Directory Structure

```
skills/
├── content-writer/
│   ├── SKILL.md (required)
│   ├── README.md (user guide)
│   ├── QUICK_START.md
│   ├── IMPLEMENTATION_GUIDE.md
│   ├── GET_STARTED.md
│   └── EXAMPLE_OUTPUT.md
│
├── full-stack-mvp-builder/
│   ├── SKILL.md (required)
│   ├── README.md (user guide)
│   ├── BACKEND_QUICK_REFERENCE.md
│   ├── MULTI_CLOUD_DEPLOYMENT_GUIDE.md
│   ├── SECURITY_HARDENING_CHECKLIST.md
│   ├── REQUIREMENTS_EXTRACTION_GUIDE.md
│   ├── CHANGELOG.md
│   ├── full-stack-mvp-builder-skill.md
│   └── templates/
│
├── lucidreactor-ui/
│   ├── SKILL.md (required)
│   └── README.md (user guide)
│
└── screenshots/
    ├── SKILL.md (required)
    ├── README.md (user guide)
    ├── SCREENSHOT_CAPTURE_GUIDE.md
    ├── SCREENSHOTS_SKILL_GUIDE.md
    ├── QUICK_SCREENSHOT_WORKFLOW.md
    └── capture-screenshots.cjs
```

## Using Skills

### Method 1: Direct Reference
```
Using ~/.claude/skills/content-writer/SKILL.md, write a case study
```

### Method 2: Slash Command (if configured)
```
/content --type case-study
/screenshots 3
```

### Method 3: Natural Language
```
Add the BlogHero component from lucidreactor-ui
Show me the latest screenshots
Help me build a full-stack MVP with FastAPI backend
```

## Packaging Skills for Distribution

Use the packaging script to create distributable ZIP files:

```bash
./scripts/package-skill.sh content-writer 1.0.0
./scripts/package-skill.sh full-stack-mvp-builder 1.2.0
./scripts/package-skill.sh lucidreactor-ui 0.1.0
./scripts/package-skill.sh screenshots 1.0.0
```

Output: `dist/<skill-name>-v<version>.zip`

## File Requirements

Each skill directory must contain:
- **SKILL.md** (required) - Entry point with instructions for Claude
- **README.md** (recommended) - User-facing quick start guide
- Supporting `.md` files - Additional documentation as needed

## Skill Design Principles

1. **Clear Purpose**: Each skill solves a specific problem
2. **Interactive**: Skills ask clarifying questions when needed
3. **Comprehensive**: Include all necessary context and examples
4. **Production-Ready**: Output is ready for real-world use
5. **Well-Documented**: Clear instructions for both Claude and users

## Contributing New Skills

When adding a new skill:
1. Create directory: `skills/<skill-name>/`
2. Add required `SKILL.md` with clear instructions
3. Add user-facing `README.md`
4. Include supporting documentation as needed
5. Test the skill thoroughly
6. Package with `./scripts/package-skill.sh`

## Version History

- **content-writer v1.0.0** - SEO content writer with humanization focus
- **full-stack-mvp-builder v1.2.0** - Multi-backend MVP generator
- **lucidreactor-ui v0.1.0** - React component importer
- **screenshots v1.0.0** - Screenshot analysis and feedback

## License

All skills are licensed under the MIT License (see LICENSE file in root).
