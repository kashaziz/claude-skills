# Full-Stack MVP Builder Skill v1.0

**Optimization Goal:** Maximum output with minimum tokens. Ship production-ready MVPs in 10 phases (70% automated).

---

## 0. EXECUTION MODE SELECTION

This skill supports two execution modes. **Detect and select the appropriate mode before starting any generation.**

### Mode Detection Logic

**1. Explicit Triggers (Priority 1):**
```
Prompt starts with "One-shot mode:" → ONE-SHOT MODE
Prompt starts with "Step-by-step mode:" → STEP-BY-STEP MODE
```

**2. Implicit Detection (Priority 2):**
```
IF prompt_length > 50 words AND contains_field_definitions:
    → Suggest ONE-SHOT MODE
ELIF prompt_length < 30 words:
    → Suggest STEP-BY-STEP MODE
ELIF "auto-select" in prompt:
    → ONE-SHOT MODE (user wants defaults)
ELSE:
    → Ask user to choose
```

**3. Ask User (Priority 3):**
```
"I can generate this app in two ways:

🚀 One-Shot Mode: Complete codebase in 15-20 min (all phases at once)
   → Best if you have clear requirements

🎯 Step-by-Step Mode: Guided with approval after each phase (30-45 min)
   → Best if you want to review as we build

Which do you prefer?"
```

---

### Mode Characteristics

| Aspect | One-Shot Mode | Step-by-Step Mode |
|--------|---------------|-------------------|
| **User Involvement** | Minimal (confirm once) | High (approve each phase) |
| **Timeline** | 15-20 minutes | 30-45 minutes |
| **Stops** | None (continuous) | After each phase |
| **Best For** | Clear requirements | Exploration, learning |
| **Output** | Complete codebase | Incremental with explanations |
| **Questions** | None (or ask all upfront) | Throughout process |

---

### One-Shot Mode Execution Pattern

```
1. Requirements Extraction & Confirmation (1 message)
   ↓
2. Generate Phase 0.5 (Environment setup)
   ↓
3. Generate Phase 1 (Project scaffold)
   ↓
4. Generate Phase 2 (Database schema)
   ↓
5. Generate Phase 3 (Authentication)
   ↓
6. Generate Phase 4 (CRUD API)
   ↓
7. Generate Phase 5 (Frontend pages)
   ↓
8. Generate Phase 6 (Integration + tests)
   ↓
9. Generate Phase 7 (Deployment config)
   ↓
10. Output setup.sh, verify.sh, README.md
    ↓
11. Summary & Next Steps

⚠️ NO STOPS between steps 2-10
```

---

### Step-by-Step Mode Execution Pattern

```
1. Gather Requirements (Interactive Q&A)
   ↓
   [WAIT FOR USER]
   ↓
2. Confirm Configuration
   ↓
   [WAIT FOR USER APPROVAL]
   ↓
3. Generate Phase 0.5
   ↓
   [WAIT - Show summary, ask "continue?"]
   ↓
4. Generate Phase 1
   ↓
   [WAIT - Show summary, ask "continue?"]
   ↓
5. ... Repeat for each phase ...
   ↓
   [WAIT after EACH phase]
   ↓
10. Final Summary

⚠️ STOP and WAIT after EVERY phase
```

---

### Auto-Selection Logic

When user requests "auto-select" for backend or deployment:

**Backend Auto-Selection:**
```python
if "JavaScript" in prompt or "TypeScript" in prompt:
    backend = "Express.js"
elif "Python" in prompt and ("admin" in prompt or "django" in prompt):
    backend = "Django"
elif "Python" in prompt and ("API" in prompt or "async" in prompt):
    backend = "FastAPI"
elif "serverless" in prompt or "edge" in prompt:
    backend = "Astro Edge + Supabase"
else:
    # Default recommendation
    backend = "Express.js"  # Most versatile, fastest setup
```

**Deployment Auto-Selection:**
```python
if backend == "Astro Edge":
    deployment = "CloudFlare"
elif backend in ["Django", "FastAPI"]:
    deployment = "Render"  # Free PostgreSQL included
elif backend == "Express":
    deployment = "Render"  # Or Vercel if user prefers serverless
else:
    deployment = "Render"  # Safe default
```

---

## 0.1 PRE-EXECUTION: Understand the Full Timeline

| Phase | Name | Duration | Automation | Reality |
|-------|------|----------|-----------|---------|
| 0 | Design System | 30m | 100% | Figma OR Shadcn/ui |
| 0.5 | Secrets & Env | 15m | 100% | .env setup + platform config |
| 1-7 | Core Build | 3-5h | 100% | Code generated + tested |
| 7.5 | Security Audit | 2-4h | 30% | Manual review (code + checklist) |
| 8 | UI Polish | 2-4h | 50% | Manual refinement (skip real-time unless needed) |
| 9 | Deployment | 1-2h | 80% | Platform-specific config |
| **Total** | **Production Ready** | **8-18h** | **~70%** | **Professional MVP** |

**Reality:** 70% automated, 30% manual (security, UX, deployment tuning)

---

## Phase 0: Design System & Component Library (Optional but Recommended: 30m)

**Goal:** Consistent design system to prevent UI rewrites later.

**Recommended Approach: Shadcn/ui (15 min setup)**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card form dialog input select table toast
```

**Result:** 40+ production-ready components in `src/components/ui/` with WCAG AA accessibility built-in.

**Alternative:** Custom design system with Tailwind config (color palette, typography, spacing) or use pre-made Astro templates.

**Output Files:**
- `src/components/ui/` - Component library
- `src/layouts/` - MainLayout, AuthLayout
- `tailwind.config.js` - Design tokens

---

## Phase 0.5: Secrets Management & Environment Setup (15m)

**Goal:** Secure environment variable management across dev/staging/production.

**File Structure:**
- `.env.example` - Git-tracked template (no real values)
- `.env.local` - Git-ignored, local development
- `.env.staging` - Git-ignored, staging environment
- `.env.production` - NEVER created (use platform UI)

**Key Steps:**
1. Create `.env.example` with all required variables (no real secrets)
2. Add `.env*` to `.gitignore`
3. Load env vars in backend (Django: `decouple`, FastAPI: `pydantic.BaseSettings`, Express: `dotenv`)
4. Set production secrets in platform UI (Render/Vercel/CloudFlare/AWS/Azure)
5. Rotate secrets quarterly (JWT_SECRET, database passwords, API keys)

**Generate JWT Secret:**
```bash
openssl rand -hex 32
```

**Checklist:**
- [ ] .env.example created (no real values)
- [ ] .env* in .gitignore
- [ ] JWT_SECRET generated and set
- [ ] Production secrets in platform vault (not code)
- [ ] Rotation strategy documented

---

## 1. Tech Stack Selection

### Frontend Stack (Astro)
- **Framework:** Astro (static-first, islands architecture, zero JS by default)
- **Components:** React/Vue islands (optional, only where needed)
- **Styling:** Tailwind CSS + CSS modules
- **State:** Nanostores (lightweight) or Zustand (if React islands)
- **API Client:** `fetch` + custom hooks or TanStack Query (conditional)
- **Build:** Astro built-in (SSG/SSR)
- **Testing:** Playwright (headless E2E)

### Backend Stack (Choose One)

#### Option A: Django (Python)
- **Framework:** Django + Django REST Framework
- **Database:** PostgreSQL (primary) or SQLite (dev)
- **ORM:** Django ORM
- **Auth:** Django Allauth or custom JWT (djangorestframework-simplejwt)
- **Validation:** Pydantic (via djangorestframework-spectacular) or built-in
- **Real-time:** Django Channels (if WebSocket needed) OR simple polling
- **Deploy:** Gunicorn + Render/Railway
- **Testing:** pytest-django + Playwright
- **Best for:** Large teams, complex business logic, admin scaffolding

#### Option B: FastAPI (Python)
- **Framework:** FastAPI + Pydantic
- **Database:** PostgreSQL (primary) or SQLite (dev)
- **ORM:** SQLAlchemy + Alembic (migrations)
- **Auth:** Python-jose (JWT) + passlib (hashing)
- **Validation:** Pydantic (built-in)
- **Real-time:** WebSockets (FastAPI native) OR polling
- **Deploy:** Uvicorn + Render/Railway
- **Testing:** pytest + Playwright
- **Best for:** API-first, async workloads, modern Python projects

#### Option C: Express.js (Node.js)
- **Framework:** Express + TypeScript
- **Database:** PostgreSQL (primary) or SQLite (dev)
- **ORM:** Prisma (recommended) or Sequelize/TypeORM
- **Auth:** jsonwebtoken (JWT) + bcrypt (hashing)
- **Validation:** Zod or joi
- **Real-time:** Socket.io (WebSockets) OR polling
- **Deploy:** Node.js runtime + Render/Railway/Vercel
- **Testing:** Jest + Supertest + Playwright
- **Best for:** Full-stack JS teams, monorepo speed, existing Node infrastructure

#### Option D: Astro Edge Functions + API Routes (Serverless-First)
- **Framework:** Astro + Vercel/Netlify Edge Functions
- **Database:** Supabase (Postgres) or MongoDB Atlas
- **ORM:** Optional (Prisma Edge Client for Supabase)
- **Auth:** Supabase Auth or custom JWT
- **Validation:** Zod (lightweight)
- **Real-time:** Supabase Realtime or simple polling
- **Deploy:** Vercel/Netlify (zero-config)
- **Testing:** Playwright (no separate backend server)
- **Best for:** Minimal ops, rapid deployment, serverless-native, startups

---

### Backend Choice Decision Tree

```
What's your priority?

├─ Team already knows JavaScript?
│  └─ Express.js (TypeScript for safety)
│
├─ Minimize DevOps overhead?
│  └─ Astro Edge Functions + Supabase
│
├─ Python-focused team?
│  ├─ Need admin scaffolding, ORM batteries?
│  │  └─ Django
│  └─ API-first, async, modern?
│     └─ FastAPI
│
├─ Complex business logic, scaling to 50+ engineers?
│  └─ Django
│
├─ Single developer, rapid iteration?
│  └─ Astro Edge Functions (fastest setup)
│
└─ Monorepo, single language preference?
   └─ Express.js
```

**Quick Recommendation Table:**

| Scenario | Backend | Why |
|----------|---------|-----|
| Full-JS team, fast | Express + Prisma | Monorepo, TypeScript, familiar |
| Python-heavy org | Django | Batteries included, hire pool |
| Modern async Python | FastAPI | Clean, performant, growing ecosystem |
| Startup, minimal ops | Astro Edge + Supabase | Deploy with `npm run build`, no server |
| Solo dev, MVP | Astro API Routes | Built-in, no separate backend |
| Real-time app | FastAPI/Express (WebSockets) | Native support |

---

## 2. Adaptive Phase Plan

### Complexity Tiers
- **Tier 1 (Simple CRUD):** Phases 1-6
- **Tier 2 (Features + Real-time):** Phases 1-7 + optional Phase 8
- **Tier 3 (Complex + Admin):** Full plan, add Phase 9-10

### Core Phases

| Phase | Name | Duration | Deliverables |
|-------|------|----------|--------------|
| 1 | Setup + API Scaffold | 30m | Monorepo, env, backend skeleton |
| 2 | Database Schema + ORM | 20m | Models, migrations, fixtures |
| 3 | Auth (JWT/OAuth) | 25m | Login, signup, token refresh |
| 4 | Core API Endpoints | 40m | Full CRUD for main resource |
| 5 | Astro Frontend + Routing | 25m | Pages, layouts, SSR setup |
| 6 | API Integration + E2E Flow | 40m | Form submission, list view, Playwright tests |
| 7 | Error Handling + Deployment | 30m | Env config, error boundaries, deploy ready |
| 8 | *[Optional]* UI Polish | 2-4h | UI refinement, loading states, error handling (skip real-time unless needed) |
| 9 | *[Optional]* Admin Panel | 35m | CRUD interface for admins |
| 10 | *[Optional]* Analytics + Monitoring | 25m | Events, dashboards, error tracking |

**Total (Core):** ~210 minutes (~3.5 hours for MVP)

---

## 3. Execution Rules (Token Budget: 15k-20k)

### Code Output
- **Format:** Full file only (no snippets)
- **Header:** `[File: path/to/file]`
- **Language:** TypeScript/Python (production-ready)
- **No explanations:** Code is self-documenting

### Testing
- **Tool:** Playwright (headless, fast)
- **Output:** Compact pass/fail with assertions
- **Format:**
  ```
  ✅ [Login Flow]: form visible → submit → redirect to dashboard (3/3 pass)
  ✅ [Create Item]: navigate → fill form → submit → item in list (4/4 pass)
  ❌ [Validation]: empty field error not displayed (1 fail)
  ```

### Git Commits
- **Format:** `<type>: <subject>` (one-liner)
- **Example:** `feat: setup monorepo + django/fastapi base`
- **Hash:** Realistic 7-char hash only

### Skip Entirely
- ❌ Detailed browser screenshots
- ❌ Prose descriptions of test interactions
- ❌ Separate test-only phases
- ❌ Full README chapters (template only)
- ❌ Security audit phase (inline review)
- ❌ Performance optimization phase (check Lighthouse inline)

### Include Inline
- ✅ WCAG accessibility checks (Phase 6)
- ✅ Input validation (Zod/Pydantic - Phase 4)
- ✅ Error boundaries (Phase 7)
- ✅ Lighthouse 85+ baseline (Phase 7)

---

## 4. Phase Execution Template

```markdown
## Phase X: [Phase Name]

### Context
- Tier: [1/2/3]
- Duration: [Xm]
- Focus: [What is built]

### Tech Checklist
- [ ] Framework setup
- [ ] Config files
- [ ] TypeScript/Python types
- [ ] Tests written

### Files Created/Modified
1. `path/file.ext` — description
2. `path/file.ext` — description

---

[File: path/to/file.ext]
\`\`\`language
code here
\`\`\`

---

### Testing
\`\`\`
✅ [Test Name]: assertion 1, assertion 2 passed
\`\`\`

### Lighthouse (if applicable)
- Performance: 88/100
- Accessibility: 92/100
- Best Practices: 90/100

### Git Commit
a1b2c3d - "feat: what was done"

---
```

---

## 5. Tech Stack Initialization

For detailed setup commands for each backend (Express.js, FastAPI, Django, Astro Edge), see **[BACKEND_QUICK_REFERENCE.md](BACKEND_QUICK_REFERENCE.md)**.

**Quick Setup Times:**
- Express.js: 5 minutes
- FastAPI: 8 minutes
- Django: 10 minutes
- Astro Edge + Supabase: 3 minutes (fastest)

---

## 6. Per-Phase Breakdown

### Phase 1: Setup + API Scaffold
**Goal:** Monorepo ready, backend skeleton, env config.

**Backend Files:**
- `requirements.txt` (Django/FastAPI deps)
- `config/settings.py` (Django) OR `main.py` (FastAPI)
- `.env.example`
- `docker-compose.yml` (PostgreSQL)
- `.gitignore`, `pyproject.toml` (Python project config)

**Frontend Files:**
- `astro.config.mjs`
- `src/pages/` (index.astro)
- `src/layouts/Base.astro`
- `tailwind.config.js`

**Tests:** Docker compose up → PostgreSQL accessible

---

### Phase 2: Database Schema + ORM
**Goal:** Models, migrations, fixtures ready.

**Files:**
- `api/models.py` (Django) OR `app/models.py` (FastAPI)
- `alembic/versions/` (FastAPI migrations)
- `api/fixtures.py` (sample data)

**Tests:**
```
✅ [Models]: table creation, relationship integrity (2/2 pass)
✅ [Fixtures]: seed data loaded (1/1 pass)
```

---

### Phase 3: Auth (JWT/OAuth)
**Goal:** Login, signup, token refresh working.

**Files:**
- `api/auth.py` (auth logic)
- `api/views.py` (Django) OR `api/routes/auth.py` (FastAPI)
- `middleware/` (JWT verification)
- `api/serializers.py` (Django) OR Pydantic schemas

**Tests:**
```
✅ [Signup]: POST /auth/signup → 201, user created (2/2 pass)
✅ [Login]: POST /auth/login → 200, JWT token returned (2/2 pass)
✅ [Protected]: GET /api/profile with token → 200 (1/1 pass)
❌ [Invalid Token]: expired token → 401 (expected)
```

---

### Phase 4: Core API Endpoints
**Goal:** Full CRUD for main resource (e.g., Tasks, Projects, Posts).

**Files:**
- `api/routes/[resource].py` (FastAPI) OR `api/views.py` (Django)
- Validation schemas (Pydantic/serializers)
- Query filtering, pagination

**Tests:**
```
✅ [CRUD]: POST (create), GET (list), GET (detail), PUT (update), DELETE (2/5 pass)
✅ [Pagination]: page=2&limit=10 → correct results (1/1 pass)
✅ [Filters]: ?status=active → filtered list (1/1 pass)
```

---

### Phase 5: Astro Frontend + Routing
**Goal:** Pages structure, layouts, client-side routing.

**Files:**
- `src/pages/index.astro`
- `src/pages/[resource]/index.astro` (list)
- `src/pages/[resource]/[id].astro` (detail)
- `src/layouts/MainLayout.astro`
- `src/components/Header.astro`, `Nav.astro`

**Tests:**
```
✅ [Navigation]: home → list page → detail page (2/2 pass)
✅ [Responsive]: mobile (320px) and desktop (1200px) layouts (2/2 pass)
```

---

### Phase 6: API Integration + E2E Flow
**Goal:** Full user flow working end-to-end with Playwright tests.

**Files:**
- `src/pages/[resource]/create.astro` (form)
- `src/lib/api.ts` (fetch wrapper)
- `playwright.config.ts`
- `tests/e2e/full-flow.spec.ts`

**Playwright Test Example:**
Test the full user flow: login → create → list → edit → delete. Use compact assertions and test results format shown below.

**Test Results:**
```
✅ [Full Flow]: login → create → list → edit → delete (5/5 pass)
✅ [Error Handling]: invalid form → error message displayed (1/1 pass)
✅ [Accessibility]: ARIA labels present, keyboard navigation works (2/2 pass)
```

**Lighthouse:**
- Performance: 89/100
- Accessibility: 93/100
- Best Practices: 91/100

---

### Phase 7: Error Handling + Deployment
**Goal:** Production-ready, deployed to chosen platform.

**Files:**
- `.env.example` (production env template - no secrets)
- Platform-specific config (`vercel.json`, `render.yaml`, `wrangler.toml`, etc.)
- `api/middleware.py` (error handlers, logging, rate limiting)
- `src/components/ErrorBoundary.astro`
- `docker/Dockerfile` (backend, if using containerized deployment)

**Deployment Checklist:**
- [ ] ENV variables set in production platform UI (not in code)
- [ ] CORS configured for production domain
- [ ] Database migrations run in production
- [ ] Static files compiled (Astro `npm run build`)
- [ ] Backend deployed and health check passing
- [ ] SSL/HTTPS enabled (automatic on most platforms)
- [ ] Error logging configured (Sentry or platform logs)

**Test:**
```
✅ [Live URL]: GET $PROD_URL → 200 (1/1 pass)
✅ [API]: POST $PROD_URL/api/auth/login → 200, token returned (1/1 pass)
✅ [Full Flow]: login → create on live (1/1 pass)
```

**Note:** Replace `$PROD_URL` with your actual production URL (e.g., `https://your-app.render.com`, `https://your-app.vercel.app`, etc.)

---

### Phase 7.5: Security Hardening & Production Audit (2-4 hours - MANDATORY)

**Goal:** Identify and fix security vulnerabilities before deploying to production.

**Reality:** This phase is NOT fully automated. Use checklist + manual review. Budget 2-4 hours.

For comprehensive security checklist covering authentication, API security, database security, deployment security, and infrastructure security, see **[SECURITY_HARDENING_CHECKLIST.md](SECURITY_HARDENING_CHECKLIST.md)**.

**Key Areas to Review:**
- JWT security (strong secrets, proper expiry, httpOnly cookies)
- Password security (bcrypt/argon2, min length 12, rate limiting)
- CORS configuration (specific origins, not "*")
- Input validation (SQL injection, XSS, CSRF prevention)
- Rate limiting (100 req/min public, 5 req/min auth)
- HTTPS/TLS (all endpoints, valid certificates)
- Database security (ORM usage, encrypted credentials)
- Environment variables (no hardcoded secrets)
- Playwright security tests (CORS, JWT validation, rate limiting, SQL injection)

**Testing:**
```
✅ [Security Checklist]: All items reviewed and passing
✅ [Playwright Security Tests]: CORS, JWT, rate limiting, SQL injection tests pass
```

**Git Commit:**
abc1234 - "security: hardening checklist + playwright tests + production audit"

---

### Optional Phases

**Phase 8: UI Polish** - Refine UI/UX, add loading states, improve error messages, optimize performance. Most MVPs skip real-time features initially - add WebSockets/polling only if live updates are required.

**Phase 9: Admin Panel** - Admin CRUD interface for managing users/resources. Files: `src/pages/admin/`, `api/admin_routes.py`, `src/middleware/adminAuth.ts`

**Phase 10: Analytics + Monitoring** - Event tracking, error logs, dashboard. Files: `src/lib/analytics.ts`, `api/events.py`, `src/pages/analytics/`, `sentry.init()`

---

## 9. Deployment

For comprehensive deployment instructions across 6 platforms (Render, Vercel, CloudFlare, DigitalOcean, AWS, Azure), see **[MULTI_CLOUD_DEPLOYMENT_GUIDE.md](MULTI_CLOUD_DEPLOYMENT_GUIDE.md)**.

**Quick Platform Decision:**
- **Free tier / Easiest:** Vercel or CloudFlare (15m setup)
- **Recommended for full-stack:** Render (20m setup, free tier available)
- **Enterprise scale:** AWS or Azure (1-2h setup)

---

## Phase 9: Deployment Checklist (1-2 hours)

### Pre-Deployment

- [ ] Environment variables set in platform UI
- [ ] Database migrations run successfully
- [ ] Static files compiled (Astro `npm run build`)
- [ ] API endpoints tested locally
- [ ] Playwright E2E tests pass
- [ ] Security audit checklist complete
- [ ] DNS configured (if using custom domain)
- [ ] SSL certificate valid (auto-renewed)
- [ ] Backup strategy documented

### Deployment

- [ ] Backend deployed and responding (curl /health → 200)
- [ ] Frontend deployed and accessible
- [ ] Database accessible from backend
- [ ] API calls from frontend working (Network tab, no 500 errors)
- [ ] Login flow working end-to-end
- [ ] CORS working (no "Access-Control-Allow-Origin" errors)
- [ ] Authentication persisting (JWT tokens working)

### Post-Deployment

- [ ] Monitor error logs (Sentry, platform dashboard)
- [ ] Performance baseline captured (Lighthouse)
- [ ] Backup tested (can restore from backup)
- [ ] Team notified of live URL
- [ ] Incident response plan activated
- [ ] Monitoring alerts configured

### Test Script

```bash
#!/bin/bash
PROD_API="https://api-prod.example.com"
PROD_FRONTEND="https://app-prod.example.com"

echo "Testing production deployment..."

# 1. API Health
curl -I $PROD_API/health
echo "✅ API responding"

# 2. Frontend loads
curl -I $PROD_FRONTEND
echo "✅ Frontend loads"

# 3. CORS headers
curl -I -H "Origin: $PROD_FRONTEND" $PROD_API/api/users
echo "✅ CORS configured"

# 4. Auth working
TOKEN=$(curl -X POST $PROD_API/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}' \
  | jq -r '.token')
echo "✅ Auth token obtained: $TOKEN"

# 5. Protected endpoint
curl -H "Authorization: Bearer $TOKEN" $PROD_API/api/users
echo "✅ Protected endpoint accessible"

echo "All checks passed! ✅"
```

---

## 10. Token Budget & Time Estimates

**Note:** Token usage varies significantly based on app complexity, backend choice, and Claude model. These are rough estimates.

| Phase | Name | Estimated Tokens | Duration | Automation |
|-------|------|------------------|----------|------------|
| 0 | Design System | 0.5-1k | 30m | 100% |
| 0.5 | Secrets & Env | 0.5-1k | 15m | 100% |
| 1 | Setup | 2-3k | 30m | 100% |
| 2 | Database | 1.5-2.5k | 20m | 100% |
| 3 | Auth | 2-3k | 25m | 100% |
| 4 | API | 2.5-4k | 40m | 100% |
| 5 | Frontend | 2-3k | 25m | 100% |
| 6 | Integration | 3.5-5k | 40m | 100% |
| 7 | Deployment | 1-2k | 30m | 100% |
| 7.5 | Security Audit | Manual | 2-4h | 30% (manual review) |
| 8 | UI Polish | 1-2k | 2-4h | 50% (manual tuning) |
| **MVP (Phases 1-7)** | **~15-22k** | **~3.5h** | **100%** |
| **Production Ready** | **~17-25k** | **~8-18h** | **~70%** |

**Reality:**
- Phases 0, 1-7: Fully automated (100% token-generated)
- Phase 7.5 (Security): Manual review required (2-4 hours)
- Phase 8 (UI Polish): Manual refinement needed (2-4 hours)
- **Total manual effort: 4-8 hours (security audit, UX refinement, deployment tuning)**

---

---

## 10. Quick Reference Checklist

- [ ] Backend choice: Django or FastAPI? _(specified upfront)_
- [ ] Database: PostgreSQL _(default)_ or SQLite _(dev only)_?
- [ ] Auth: JWT _(default)_ or OAuth _(specify provider)_?
- [ ] Real-time: Yes (WebSockets/polling) or No?
- [ ] Admin panel: Required?
- [ ] Deployment: Render, Railway, or Vercel?
- [ ] Tier: Simple CRUD (1), Feature-rich (2), or Complex (3)?

---

## 11. Rules Summary

✅ **Do:**
- Full code files only (no snippets)
- Playwright E2E tests (compact output)
- One commit per phase
- Skip unnecessary phases
- Inline accessibility/validation
- Include error handling in all endpoints
- Use environment variables for all secrets

❌ **Don't:**
- Explain code
- Long test descriptions
- Separate test phases
- Full README prose
- Optimize before Phase 7
- Hardcode secrets or URLs
- Skip input validation

---

## 12. Common Pitfalls & Solutions

**Database Connection Issues:**
- Problem: `Connection refused` or `timeout`
- Solution: Ensure PostgreSQL is running (`docker-compose up -d`), check `DATABASE_URL` format, verify port 5432 is accessible

**CORS Errors:**
- Problem: `Access-Control-Allow-Origin` errors in browser
- Solution: Configure CORS to allow frontend origin (not `*`), ensure credentials are set correctly

**JWT Token Issues:**
- Problem: `401 Unauthorized` on protected routes
- Solution: Verify token is sent in `Authorization: Bearer <token>` header, check token expiry, ensure `JWT_SECRET` matches

**Migration Failures:**
- Problem: Database migrations fail or conflict
- Solution: Reset database if in dev (`python manage.py flush` or `npx prisma migrate reset`), check migration files are in order

**Build Failures:**
- Problem: Frontend build fails or backend won't start
- Solution: Check Node.js/Python versions match requirements, ensure all dependencies installed, verify environment variables are set

**Deployment Issues:**
- Problem: App works locally but fails in production
- Solution: Verify all environment variables set in platform UI, check build logs, ensure database is accessible from production environment

---

**Start:** User provides app requirements + tech choice → Skill executes Phase 1 immediately.

**End:** 7 phases complete, live URL, Playwright tests passing, ready for production.

---

*Last Updated: January 15, 2026*
