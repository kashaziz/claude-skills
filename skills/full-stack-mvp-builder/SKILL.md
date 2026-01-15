---
name: full-stack-mvp-builder
description: Generates production-ready full-stack MVP code with Astro frontend + Django/FastAPI/Express/Astro Edge backend. Builds complete codebases with authentication, CRUD operations, tests, and deployment configs.
author: Kashif Aziz
---

# Full-Stack MVP Builder Skill

---

## Choose Your Mode

This skill offers two execution modes to match your workflow:

### 🚀 One-Shot Mode (Fast & Automated)

**Best for:** Experienced developers, clear requirements, rapid prototyping

**Timeline:** 15-20 minutes to complete codebase
**User involvement:** Minimal (just requirement confirmation)
**Output:** Complete codebase (phases 0.5-7) generated in one execution

**How to trigger:**
Start your prompt with `"One-shot mode:"` OR provide a detailed prompt (>50 words with specific fields/schema)

**Required in prompt:**
- App description and main actions
- Main resource/entity with fields
- Backend choice (Express/Django/FastAPI/Astro Edge) OR "auto-select"
- Deployment platform (Render/Vercel/CloudFlare) OR "auto-select"

**Example prompt:**
```
One-shot mode: Build a task manager with Express backend, deploy to Render.

Tasks have:
- title (string, required, max 200 chars)
- description (text, optional)
- due_date (date, required)
- status (enum: pending/completed)
- priority (enum: low/medium/high)

Users can create, edit, complete, and delete their own tasks only.
```

**What happens:**
1. Claude extracts and confirms requirements (1 message)
2. Generates all code phases 0.5-7 without stopping
3. Outputs complete codebase with setup script
4. You run `./setup.sh` and your app is ready

---

### 🎯 Step-by-Step Mode (Guided & Interactive)

**Best for:** Learning, exploring options, complex requirements, unclear needs

**Timeline:** 30-45 minutes to complete codebase
**User involvement:** High (approval after each phase)
**Output:** Codebase generated phase-by-phase with explanations

**How to trigger:**
Start your prompt with `"Step-by-step mode:"` OR provide a brief prompt (<30 words)

**Minimal prompt needed:**
Just describe what you want to build in 1-2 sentences.

**Example prompt:**
```
Step-by-step mode: Build a task manager for freelancers.
```

**What happens:**
1. Claude asks clarifying questions (backend, fields, deployment)
2. Generates Phase 1, shows summary, waits for approval
3. You review and say "continue" or "modify X"
4. Repeats for each phase (1-7)
5. You control the pace and can customize each phase

---

### 🤔 Not Sure Which Mode?

**Choose One-Shot if:**
- ✅ "I know exactly what I want"
- ✅ "I want to see the full thing, then iterate"
- ✅ "Speed is my priority"
- ✅ You're comfortable with generated defaults

**Choose Step-by-Step if:**
- ✅ "I'm still figuring out requirements"
- ✅ "I want to understand each decision"
- ✅ "I might need custom architecture"
- ✅ You want to learn as you build

**Default:** If you don't specify a mode, Claude will detect from your prompt style and suggest the best fit.

---

## What This Skill Does

This skill **generates complete source code** for a full-stack web application. When invoked, Claude will:

1. **Extract** requirements from your prompt (or ask questions in step-by-step mode)
2. **Generate** all source code files (backend API + frontend UI + tests)
3. **Provide** setup automation (`setup.sh` script)
4. **Output** deployment configuration for your chosen platform

**You receive:** A complete codebase ready to run with `./setup.sh && npm run dev`

**You do NOT receive:** A deployed application (you deploy it yourself)

---

## Prerequisites

Before using this skill, verify you have:

```bash
# Required
node --version    # Node.js 18+ required
npm --version     # npm 9+ required
git --version     # Git required

# For Django/FastAPI backends
python --version  # Python 3.9+ required

# Optional (for local PostgreSQL)
docker --version  # Docker for local database
```

---

## How the UI is Generated

The frontend uses **Astro** with **Tailwind CSS**. UI components are generated as:

1. **Astro Components** (`.astro` files) - Server-rendered, zero JavaScript by default
2. **Tailwind CSS** - Utility-first styling, responsive design included
3. **Optional: Shadcn/ui** - Pre-built accessible components (if requested)

**What you get:**
- `src/pages/` - Route pages (index, login, dashboard, resource CRUD)
- `src/components/` - Reusable UI components (Header, Footer, Forms, Cards)
- `src/layouts/` - Page layouts (MainLayout, AuthLayout)
- Responsive design (mobile-first)
- Dark mode support (via Tailwind)

**The UI is NOT a template** - it's generated specifically for your app's requirements.

---

## Workflow Overview

```
User Request → Claude Generates Code → You Run Locally → You Deploy

Phase 0:   Design system setup (Tailwind + optional Shadcn/ui) - Optional
Phase 0.5: Environment variables template
Phase 1-7: Complete codebase (backend + frontend + tests) - Core MVP
Phase 7.5: Security checklist review (manual) - MANDATORY before production
Phase 8:   UI Polish (optional) - Skip real-time features unless needed
Phase 9:   Deployment checklist and platform config
```

**Timeline:**
- Code generation (Phases 1-7): ~3.5 hours of Claude interaction
- Your setup time: 15-30 minutes (install deps, run migrations)
- Security review (Phase 7.5): 2-4 hours (manual checklist)
- Total to production-ready MVP: 8-18 hours (70% automated, 30% manual)

**For detailed phase-by-phase instructions, see [full-stack-mvp-builder-skill.md](full-stack-mvp-builder-skill.md).**

---

## When to Use This Skill

**Use when:**
- Building a new full-stack web application from scratch
- Need CRUD operations with authentication
- Want production-ready code (not a tutorial)
- Deploying to Render, Vercel, CloudFlare, DigitalOcean, AWS, or Azure

**Do NOT use for:**
- Mobile apps (iOS/Android)
- Desktop applications
- Static sites only (use plain Astro)
- Microservices architecture

---

## Input Requirements

**Required:**
1. **App description** - What the app does (e.g., "task manager", "blog", "invoice tracker")
2. **Main resource** - Primary data entity (e.g., "tasks", "posts", "invoices")

**Optional:**
3. **Backend choice** - Django, FastAPI, Express, or Astro Edge (Claude will recommend if not specified)
4. **Deployment platform** - Render, Vercel, CloudFlare, DigitalOcean, AWS, Azure

---

## Backend Selection

| Scenario | Recommended Backend |
|----------|---------------------|
| JavaScript/TypeScript team | Express.js + Prisma |
| Python team, need admin panel | Django |
| Python team, API-first | FastAPI |
| Minimal DevOps, startup speed | Astro Edge + Supabase |

See [BACKEND_QUICK_REFERENCE.md](BACKEND_QUICK_REFERENCE.md) for setup commands.

---

## What Gets Generated

### Backend (Express.js example)
```
backend/
├── src/
│   ├── index.ts           # Express app entry
│   ├── routes/
│   │   ├── auth.ts        # Login, signup, token refresh
│   │   └── [resource].ts  # CRUD endpoints
│   ├── middleware/
│   │   └── auth.ts        # JWT validation
│   └── db/
│       └── prisma.ts      # Database client
├── prisma/
│   └── schema.prisma      # Database schema
├── .env.example           # Environment template
└── package.json
```

### Frontend (Astro)
```
frontend/
├── src/
│   ├── pages/
│   │   ├── index.astro        # Landing page
│   │   ├── login.astro        # Login form
│   │   ├── dashboard.astro    # User dashboard
│   │   └── [resource]/
│   │       ├── index.astro    # List view
│   │       ├── [id].astro     # Detail view
│   │       └── create.astro   # Create form
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Form.astro
│   │   └── Card.astro
│   ├── layouts/
│   │   └── MainLayout.astro
│   └── lib/
│       └── api.ts             # API client
├── tailwind.config.js
└── astro.config.mjs
```

### Tests
```
tests/
└── e2e/
    └── flow.spec.ts       # Playwright E2E tests
```

### Deployment
```
render.yaml / vercel.json / wrangler.toml
docker-compose.yml (for local PostgreSQL)
```

---

## Deliverables Summary

| Phase | What You Get | Required? |
|-------|--------------|-----------|
| Phase 0 | Tailwind config, component library setup | Optional |
| Phase 0.5 | `.env.example` with all required variables | Yes |
| Phase 1 | Project scaffold, backend skeleton | Yes |
| Phase 2 | Database schema, migrations | Yes |
| Phase 3 | Authentication (JWT login/signup) | Yes |
| Phase 4 | CRUD API endpoints for your resource | Yes |
| Phase 5 | Astro pages, layouts, routing | Yes |
| Phase 6 | API integration, forms, Playwright tests | Yes |
| Phase 7 | Error handling, deployment config | Yes |
| Phase 7.5 | Security checklist (you review manually) | **MANDATORY** |
| Phase 8 | UI polish, loading states, error handling | Optional |
| Phase 9 | Deployment checklist and platform config | Yes |

---

## Sample Prompts

### One-Shot Mode Examples

**Simple Task Manager (Express.js):**
```
One-shot mode: Build a task manager with Express backend, deploy to Render.

Tasks have:
- title (string, required, max 200 chars)
- description (text, optional)
- due_date (date, required)
- status (enum: pending/completed)
- priority (enum: low/medium/high)

Users can create, edit, complete, and delete their own tasks.
```

**Invoice Tracker (FastAPI):**
```
One-shot mode: Build an invoice tracker for freelancers with FastAPI, deploy to Vercel.

Resources:
1. Client: name, email, company, phone (optional)
2. Invoice: client_id (FK), amount (decimal), description, due_date, status (draft/sent/paid/overdue), invoice_number (auto-generated)

Features:
- Users create clients and invoices
- Dashboard shows: total outstanding, paid this month, overdue count
- Filter invoices by status and date range
- Email invoice to client (future: send via email)
```

**Blog Platform (Astro Edge):**
```
One-shot mode: Build a blog platform with Astro Edge + Supabase, deploy to CloudFlare.

Resources:
1. Post: title, slug (auto-generated), content (markdown), published_at, status (draft/published)
2. Comment: post_id (FK), author_name, author_email, content, approved (boolean)

Features:
- Public: view published posts, add comments
- Admin: CRUD posts, approve/delete comments
- RSS feed for posts
```

**Auto-Select Backend:**
```
One-shot mode: Build a recipe sharing app, auto-select backend, deploy to Render.

Resources:
- Recipe: title, ingredients (array), instructions (text), prep_time, cook_time, servings, image_url (optional)

Features:
- Users can create, edit, delete their own recipes
- Public can view all published recipes
- Search by ingredients and title
- Filter by prep time and servings
```

---

### Step-by-Step Mode Examples

**Minimal Prompt (Guided):**
```
Step-by-step mode: Build a task manager for freelancers.
```
*Claude will ask about backend, fields, features, deployment*

**Brief Description:**
```
Step-by-step mode: Build an app to track my gym workouts and progress.
```
*Claude will guide you through defining workout structure, exercises, sets, etc.*

**Learning Mode:**
```
Step-by-step mode: I want to learn how to build a full-stack app.
Let's create something simple like a note-taking app.
```
*Claude will explain each phase and teach you the architecture*

---

## Example Output

**User says:**
> "Build a task manager app. Users can create, edit, and delete tasks. Use Express backend, deploy to Render."

**Claude generates:**
1. Express.js backend with Prisma (Task model, CRUD routes, JWT auth)
2. Astro frontend with Tailwind (task list, create form, edit form)
3. Playwright tests (login flow, CRUD operations)
4. `render.yaml` deployment config
5. Security checklist for review

**You then:**
1. Copy the generated code to your project
2. Run `npm install` in both backend and frontend (or `pip install -r requirements.txt` for Python)
3. Start PostgreSQL: `docker-compose up -d`
4. Run migrations: `npx prisma migrate dev` (or `python manage.py migrate` for Django)
5. Start dev servers: `npm run dev` (or `python manage.py runserver` for Django)
6. Review security checklist (Phase 7.5 - mandatory before production)
7. Deploy to your chosen platform (Render, Vercel, CloudFlare, etc.)

---

## Detailed Documentation

**Primary Reference (Required Reading):**
- **[full-stack-mvp-builder-skill.md](full-stack-mvp-builder-skill.md)** - Complete phase-by-phase implementation guide with execution rules, token budgets, mode detection, and common pitfalls

**Mode-Specific Guides:**
- **[REQUIREMENTS_EXTRACTION_GUIDE.md](REQUIREMENTS_EXTRACTION_GUIDE.md)** - How to extract and structure requirements from prompts (critical for One-Shot Mode)

**Supporting References:**
- **[BACKEND_QUICK_REFERENCE.md](BACKEND_QUICK_REFERENCE.md)** - Setup commands for each backend (Express, FastAPI, Django, Astro Edge)
- **[MULTI_CLOUD_DEPLOYMENT_GUIDE.md](MULTI_CLOUD_DEPLOYMENT_GUIDE.md)** - Deployment instructions for 6 platforms (Render, Vercel, CloudFlare, DigitalOcean, AWS, Azure)
- **[SECURITY_HARDENING_CHECKLIST.md](SECURITY_HARDENING_CHECKLIST.md)** - Production security audit checklist (required for Phase 7.5)

**Templates:**
- **[templates/setup.sh.template](templates/setup.sh.template)** - Automated setup script template (generate in One-Shot Mode)
- **[templates/verify.sh.template](templates/verify.sh.template)** - Automated verification script template (generate in One-Shot Mode)
- **[templates/README.md](templates/README.md)** - Template usage documentation

---

## Execution Instructions

**When executing this skill, Claude should:**

### 1. Mode Detection (First Step)

**Detect execution mode from the user's prompt:**

**Explicit mode triggers:**
- Prompt starts with "One-shot mode:" → Use One-Shot Mode
- Prompt starts with "Step-by-step mode:" → Use Step-by-Step Mode

**Implicit mode detection:**
- Prompt is detailed (>50 words) AND includes specific fields/schema → Suggest One-Shot Mode
- Prompt is brief (<30 words) → Suggest Step-by-Step Mode
- Prompt includes "auto-select" → One-Shot Mode (user wants defaults)

**If ambiguous, ask:**
```
"I can generate this app in two ways:

🚀 One-Shot Mode: Complete codebase in 15-20 min (all phases at once)
   → Best if you have clear requirements

🎯 Step-by-Step Mode: Guided with approval after each phase (30-45 min)
   → Best if you want to review as we build

Which do you prefer?"
```

---

### 2. One-Shot Mode Execution

**When in One-Shot Mode:**

**Step 1: Extract & Confirm Requirements (1 message only)**
```
📋 Extracted Requirements:
- App: [App name/description]
- Backend: [Express/Django/FastAPI/Astro Edge] (detected from prompt OR auto-selected)
- Database: PostgreSQL (default) or Supabase (if Astro Edge)
- Main Resources:
  * [Resource1]: [field1 (type), field2 (type), ...]
  * [Resource2]: [field1 (type), field2 (type), ...]
- Relationships: [e.g., "User has many Tasks"]
- Auth: JWT (email/password)
- Features: [CRUD, search, filters, etc.]
- Deployment: [Render/Vercel/CloudFlare] (detected from prompt OR auto-selected)

✅ Starting code generation (phases 0.5-7)...
```

**Step 2: Generate All Phases Sequentially (NO STOPS)**
- Phase 0.5: Environment setup (`.env.example`, secrets generation)
- Phase 1: Project scaffold (monorepo structure, configs)
- Phase 2: Database schema (models, migrations)
- Phase 3: Authentication (JWT, login/signup endpoints)
- Phase 4: CRUD API endpoints (all resources)
- Phase 5: Frontend pages (Astro + Tailwind)
- Phase 6: Integration + E2E tests (Playwright)
- Phase 7: Deployment config + error handling

**Step 3: Output Complete Package**
- All file contents (full files, no snippets)
- `setup.sh` - Automated setup script
- `verify.sh` - Automated verification script
- `README.md` - Quick start guide
- Deployment configs for chosen platform

**Step 4: Summary**
```
✅ Complete codebase generated!

📂 Created:
- [N] files
- [LOC] lines of code
- Backend: [tech stack]
- Frontend: [tech stack]
- Tests: [N] E2E test suites

⏱️ Next steps (15 minutes):
1. Run: chmod +x setup.sh && ./setup.sh
2. Visit: http://localhost:4321
3. Deploy: [platform-specific command]

📖 See README.md for detailed setup instructions
🔒 IMPORTANT: Review SECURITY_HARDENING_CHECKLIST.md before production
```

**Do NOT:**
- Ask for approval between phases
- Stop to explain decisions
- Wait for user input during generation
- Generate phases separately

---

### 3. Step-by-Step Mode Execution

**When in Step-by-Step Mode:**

**Step 1: Gather Requirements (Interactive)**

Ask clarifying questions:
```
"Let me gather some details about your app:

1. What's your primary development language?
   - JavaScript/TypeScript (→ Express.js)
   - Python with admin panel (→ Django)
   - Python API-first (→ FastAPI)
   - Minimal DevOps (→ Astro Edge + Supabase)

2. What are the main data entities?
   Example for task manager: Task (title, description, due_date, status)

3. What actions can users perform?
   - Create, read, update, delete?
   - Any special features? (search, filters, real-time, file uploads)

4. Deployment preference?
   - Render (recommended - free tier + PostgreSQL)
   - Vercel (serverless)
   - CloudFlare (edge)
   - Other
"
```

Wait for user responses, then confirm:
```
✅ Configuration Summary:
[Show extracted requirements similar to one-shot]

Ready to start Phase 1?
```

**Step 2: Generate Phase-by-Phase**

For each phase (0.5, 1-7):
1. Generate the phase code
2. Show summary of what was created
3. **Wait for user approval**

After each phase:
```
✅ Phase [N] Complete: [Phase Name]

Created:
- file1.ext - [brief description]
- file2.ext - [brief description]

What was implemented:
- [Key feature 1]
- [Key feature 2]

👉 Next: Phase [N+1] - [Phase Name]

Options:
- "continue" or "next" → Proceed to Phase [N+1]
- "modify X" → Adjust current phase
- "show me [file]" → Display specific file
- "skip phase 8" → Skip optional phases
```

**Do:**
- Wait for explicit approval before continuing
- Allow modifications to current phase
- Explain each phase briefly
- Show clear progress indicators

---

### 4. Common Instructions (Both Modes)

**Always:**
1. **Reference the detailed guide:** Use [full-stack-mvp-builder-skill.md](full-stack-mvp-builder-skill.md) for technical implementation details
2. **Follow the phase structure:** Execute phases 0.5, 1-7 in order (Phase 0 optional, Phase 8-9 optional)
3. **Generate complete files:** Full file contents only, no snippets or placeholders
4. **Include tests:** Playwright E2E tests for all user flows
5. **Use platform-agnostic examples:** Use `$PROD_URL` placeholders, not hardcoded URLs
6. **Auto-select smart defaults when needed:**
   - Backend auto-selection logic: JavaScript team → Express, Python + admin → Django, Python API → FastAPI, Minimal ops → Astro Edge
   - Deployment auto-selection: Astro Edge → CloudFlare, Django/FastAPI → Render, Express → Render or Vercel

## Constraints

**Always:**
- Generate full file contents (no snippets)
- Include error handling in all endpoints
- Use environment variables for all secrets (never hardcode)
- Generate Playwright E2E tests with compact output format
- Follow security best practices (see SECURITY_HARDENING_CHECKLIST.md)
- Use platform-agnostic placeholders (e.g., `$PROD_URL` instead of specific platform URLs)
- Include input validation (Zod/Pydantic) in all API endpoints
- Reference the detailed guide for technical implementation

**Never:**
- Hardcode secrets, API keys, or URLs in code
- Use `CORS: *` in production examples (use specific origins)
- Skip authentication on protected routes
- Generate code without tests
- Explain code (code should be self-documenting)
- Create separate test-only phases (tests inline with features)

**For troubleshooting common issues, see the "Common Pitfalls & Solutions" section in [full-stack-mvp-builder-skill.md](full-stack-mvp-builder-skill.md).**

---

*Last Updated: January 15, 2026*  
*Created by: Kashif Aziz*
