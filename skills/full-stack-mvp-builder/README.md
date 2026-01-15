# Full-Stack MVP Builder

Generate production-ready full-stack MVP web applications with Astro frontend + your choice of backend.

## Choose Your Mode

This skill offers two ways to generate your app:

### 🚀 One-Shot Mode (15-20 minutes)
**Best for:** Clear requirements, experienced developers, rapid prototyping

Complete codebase generated in one continuous execution. Just provide a detailed prompt with your requirements and get a ready-to-run app.

**Example:**
```
One-shot mode: Build a task manager with Express backend, deploy to Render.

Tasks have: title, description, due_date, status (pending/completed), priority (low/medium/high)

Users can create, edit, complete, and delete their own tasks.
```

### 🎯 Step-by-Step Mode (30-45 minutes)
**Best for:** Exploration, learning, complex requirements, custom architecture

Guided generation with approval after each phase. Claude asks questions and you review code as it's built.

**Example:**
```
Step-by-step mode: Build a task manager for freelancers.
```

**Not sure which to choose?** See [SKILL.md](SKILL.md#choose-your-mode) for detailed comparison.

---

## Try It Out

Copy one of these prompts to test the skill:

### One-Shot Mode Examples

**Task Manager:**
```
One-shot mode: Build a task manager with Express backend, deploy to Render.

Tasks have: title, description, due_date, status (pending/completed), priority (low/medium/high)
Users can create, edit, complete, and delete their own tasks.
```

**Invoice Tracker:**
```
One-shot mode: Build an invoice tracker with FastAPI, deploy to Vercel.

Resources:
1. Client: name, email, company
2. Invoice: client_id (FK), amount, description, due_date, status

Dashboard shows total outstanding, paid this month, overdue count.
```

**Blog Platform:**
```
One-shot mode: Build a blog with Astro Edge + Supabase, deploy to CloudFlare.

Post: title, content, published_at, status
Comment: post_id (FK), author_name, content
```

### Step-by-Step Mode Examples

**Minimal:**
```
Step-by-step mode: Build a task manager for freelancers.
```

**Learning:**
```
Step-by-step mode: Teach me full-stack development with a note-taking app.
```

---

## Quick Start

### Prerequisites
```bash
node --version    # 18+ required
python --version  # 3.9+ (for Django/FastAPI)
docker --version  # Optional, for local PostgreSQL
```

### One-Shot Mode (Automated Setup)

1. **Give Claude your requirements** (see examples above)

2. **Claude generates** complete codebase with `setup.sh` script

3. **Run the setup script:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

   This automatically:
   - Installs all dependencies
   - Generates JWT secrets
   - Starts PostgreSQL
   - Runs database migrations
   - Builds the frontend

4. **Start your app:**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev

   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

5. **Verify everything works:**
   ```bash
   ./verify.sh
   ```

### Step-by-Step Mode (Manual Setup)

1. **Give Claude your requirements** (brief prompt)

2. **Answer questions** about backend, features, deployment

3. **Approve each phase** as Claude generates code

4. **Follow setup instructions** provided at the end

---

## What You Get

| Component | Technology | Files |
|-----------|------------|-------|
| **Backend API** | Express/Django/FastAPI | Routes, auth, CRUD endpoints |
| **Frontend UI** | Astro + Tailwind | Pages, components, layouts |
| **Database** | PostgreSQL + Prisma/SQLAlchemy | Schema, migrations |
| **Auth** | JWT tokens | Login, signup, protected routes |
| **Tests** | Playwright | E2E user flow tests |
| **Deploy** | Render/Vercel/CloudFlare | Platform config files |

---

## Backend Options

| Backend | Best For | Setup Time |
|---------|----------|------------|
| **Express.js** | JavaScript teams | 5 min |
| **FastAPI** | Python, async APIs | 8 min |
| **Django** | Python, admin panels | 10 min |
| **Astro Edge** | Serverless, minimal ops | 3 min |

---

## FAQ

**Q: How is the UI generated?**
A: Astro components (`.astro` files) with Tailwind CSS. Responsive, mobile-first design. Optional Shadcn/ui components if you want pre-built accessible UI.

**Q: What database does it use?**
A: PostgreSQL by default. SQLite for local development. Supabase for Astro Edge.

**Q: How long does code generation take?**
A: ~30 minutes of Claude interaction to generate all code. Then 15-30 minutes for you to install dependencies and run locally.

**Q: What platforms can I deploy to?**
A: Render (recommended), Vercel, CloudFlare, DigitalOcean, AWS, Azure.

**Q: Is the generated code production-ready?**
A: Yes, but you must complete the security checklist (Phase 7.5) before deploying to production.

**Q: What if I need real-time features?**
A: WebSocket support is available for Express (Socket.io) and FastAPI. Not included by default - specify if needed.

---

## Files in This Package

| File | Purpose |
|------|---------|
| **SKILL.md** | Main entry point - workflow and deliverables |
| **BACKEND_QUICK_REFERENCE.md** | Setup commands for each backend |
| **full-stack-mvp-builder-skill.md** | Complete phase-by-phase implementation guide |
| **MULTI_CLOUD_DEPLOYMENT_GUIDE.md** | Deployment instructions for 6 platforms |
| **SECURITY_HARDENING_CHECKLIST.md** | Production security audit checklist |

---

## Default Ports (Local Development)

| Service | Port |
|---------|------|
| Astro Frontend | 4321 |
| Express Backend | 3001 |
| Django/FastAPI Backend | 8000 |
| PostgreSQL | 5432 |

---

## Troubleshooting

**CORS errors:**
```bash
# Ensure backend CORS allows frontend origin
# Express: cors({ origin: 'http://localhost:4321' })
# Django: CORS_ALLOWED_ORIGINS = ['http://localhost:4321']
```

**Database connection failed:**
```bash
docker-compose ps          # Check PostgreSQL is running
docker-compose logs postgres  # Check for errors
```

**Port already in use:**
```bash
lsof -ti:3001 | xargs kill -9  # Kill process on port 3001
```

---

## Links

- **Astro Docs:** https://docs.astro.build
- **Express Docs:** https://expressjs.com
- **FastAPI Docs:** https://fastapi.tiangolo.com
- **Django Docs:** https://docs.djangoproject.com
- **Tailwind Docs:** https://tailwindcss.com

---

*Version 1.0.0 | January 15, 2026*  
*Created by: Kashif Aziz*
