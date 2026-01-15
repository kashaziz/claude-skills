# Template Files Documentation

This directory contains template files that are used to generate automation scripts for the full-stack-mvp-builder skill.

---

## Available Templates

### 1. setup.sh.template

**Purpose:** Automates the complete project setup process

**When to generate:** Always in One-Shot Mode, optional in Step-by-Step Mode

**What it does:**
- Checks prerequisites (Node.js, Python, Docker)
- Installs backend dependencies (npm/pip)
- Installs frontend dependencies (npm)
- Copies .env.example to .env files
- Generates JWT secrets automatically
- Starts PostgreSQL with Docker
- Runs database migrations
- Builds frontend

**Template Variables:**
```
{{APP_NAME}} - Name of the application
{{DB_NAME}} - Database name
{{BACKEND_PORT}} - Backend port (3001 for Express, 8000 for Django/FastAPI)
{{#if_backend_express}} ... {{/if_backend_express}}
{{#if_backend_django}} ... {{/if_backend_django}}
{{#if_backend_fastapi}} ... {{/if_backend_fastapi}}
```

**Usage Example:**
```bash
# Generated setup.sh
chmod +x setup.sh
./setup.sh
```

---

### 2. verify.sh.template

**Purpose:** Verifies that all services are running correctly

**When to generate:** Always in One-Shot Mode, recommended in Step-by-Step Mode

**What it does:**
- Checks if backend port is listening
- Checks if frontend port is listening
- Checks if PostgreSQL port is listening
- Tests backend health endpoint
- Tests frontend loads
- Tests API authentication endpoints
- Tests CORS configuration
- Verifies database connection
- Checks required files exist

**Template Variables:**
```
{{APP_NAME}} - Name of the application
{{BACKEND_PORT}} - Backend port (3001 or 8000)
{{#if_has_database}} ... {{/if_has_database}}
{{#if_has_cors}} ... {{/if_has_cors}}
{{#if_backend_express}} ... {{/if_backend_express}}
{{#if_backend_django}} ... {{/if_backend_django}}
{{#if_backend_fastapi}} ... {{/if_backend_fastapi}}
```

**Usage Example:**
```bash
# After starting services
./verify.sh
```

---

## How to Use Templates in Code Generation

### One-Shot Mode

In One-Shot Mode, **always generate** both setup.sh and verify.sh scripts.

**Steps:**
1. Extract requirements from user prompt
2. Determine backend type (Express/Django/FastAPI)
3. Replace template variables with actual values
4. Output customized setup.sh and verify.sh to project root

**Example:**
```
User prompt: "Build a task manager with Express backend..."

1. Load setup.sh.template
2. Replace variables:
   - {{APP_NAME}} → "task-manager"
   - {{DB_NAME}} → "taskmanager"
   - {{BACKEND_PORT}} → "3001"
   - Keep only Express-specific sections
3. Output as setup.sh in project root
4. Repeat for verify.sh.template
```

### Step-by-Step Mode

In Step-by-Step Mode, generate scripts at **Phase 7 (Deployment & Setup)**.

User can request earlier if they want to test as they build.

---

## Template Variable Reference

### Common Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `{{APP_NAME}}` | Application name (kebab-case) | `task-manager` |
| `{{DB_NAME}}` | Database name (no dashes) | `taskmanager` |
| `{{BACKEND_PORT}}` | Backend server port | `3001` or `8000` |

### Conditional Blocks

Use these to include/exclude backend-specific code:

```bash
{{#if_backend_express}}
# Express-specific commands
npm install
npx prisma migrate dev
{{/if_backend_express}}

{{#if_backend_django}}
# Django-specific commands
pip install -r requirements.txt
python manage.py migrate
{{/if_backend_django}}

{{#if_backend_fastapi}}
# FastAPI-specific commands
pip install -r requirements.txt
alembic upgrade head
{{/if_backend_fastapi}}

{{#if_backend_astro_edge}}
# Astro Edge-specific (no separate backend)
{{/if_backend_astro_edge}}
```

### Feature Flags

```bash
{{#if_has_database}}
# PostgreSQL setup commands
docker-compose up -d
{{/if_has_database}}

{{#if_has_cors}}
# Test CORS configuration
curl -H "Origin: $FRONTEND_URL" $BACKEND_URL/api/health
{{/if_has_cors}}
```

---

## Customization Guidelines

### When to Modify Templates

**Modify when:**
- Adding new backend framework support
- Adding new deployment platform support
- Adding new testing/verification steps
- Improving error handling

**Don't modify when:**
- Changing specific project details (use variables instead)
- Adding project-specific logic (generate inline instead)

### Adding New Variables

1. Define variable in template with `{{VARIABLE_NAME}}`
2. Document in this README
3. Update generation logic to replace variable
4. Test with all backend types

### Adding New Conditional Blocks

1. Use consistent naming: `{{#if_feature_name}} ... {{/if_feature_name}}`
2. Document in this README
3. Update generation logic to handle condition
4. Test with multiple combinations

---

## Testing Templates

Before using templates in production:

1. **Test all backend types:**
   - Express.js project
   - Django project
   - FastAPI project
   - Astro Edge project

2. **Test all scenarios:**
   - Fresh install (no .env files)
   - Partial install (.env exists)
   - Without Docker (manual PostgreSQL)

3. **Verify outputs:**
   - setup.sh executes without errors
   - verify.sh catches common issues
   - All services start correctly

---

## Template Maintenance

**Review templates when:**
- Node.js/Python version requirements change
- Package managers change (npm → pnpm)
- Database setup process changes
- New environment variables are required
- Security best practices evolve

**Keep templates:**
- Simple and focused
- Well-commented
- Cross-platform compatible (macOS + Linux)
- Idempotent (safe to run multiple times)

---

## FAQ

**Q: What if user doesn't have Docker?**
A: Scripts detect this and show manual setup instructions for PostgreSQL.

**Q: Can templates be used outside this skill?**
A: Yes! They're generic enough for any Astro + backend project.

**Q: What about Windows support?**
A: Templates are Bash scripts (macOS/Linux). For Windows, recommend WSL or show manual setup steps.

**Q: How do I add a new backend framework?**
A: Add new conditional blocks like `{{#if_backend_newframework}}`, update docs, test thoroughly.

---

*Version 1.0 | January 15, 2026*
