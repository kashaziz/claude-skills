# Requirements Extraction Guide

This guide explains how to extract and structure requirements from user prompts for the full-stack-mvp-builder skill.

---

## Requirements Template

When extracting requirements (especially in One-Shot mode), use this standardized format:

```markdown
📋 Extracted Requirements:

**App:** [App name/description]

**Backend:** [Express/Django/FastAPI/Astro Edge] (auto-selected based on: [reason])

**Database:** [PostgreSQL/Supabase/SQLite]

**Main Resources:**
  * [Resource1]:
    - [field1] (type, constraints)
    - [field2] (type, constraints)
    - [field3] (type, constraints)
  * [Resource2]:
    - [field1] (type, constraints)
    - [field2] (type, constraints)

**Relationships:**
  - [Resource1] belongs to User
  - User has many [Resource1]
  - [Resource1] has many [Resource2]

**Authentication:**
  - Type: JWT (email/password)
  - User fields: email, password_hash, name, created_at
  - Protected routes: all CRUD operations

**Features:**
  - Core: CRUD operations on all resources
  - [Additional feature 1]
  - [Additional feature 2]
  - [Additional feature 3]

**Business Rules:**
  - [Rule 1: e.g., "Users can only access their own tasks"]
  - [Rule 2: e.g., "Tasks with past due dates are marked overdue"]

**Deployment:** [Render/Vercel/CloudFlare] (auto-selected based on: [reason])

**UI Components:** Astro + Tailwind CSS + Shadcn/ui
```

---

## Extraction Examples

### Example 1: Simple Task Manager

**User Prompt:**
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

**Extracted Requirements:**
```markdown
📋 Extracted Requirements:

**App:** Task Manager - Personal productivity app for managing tasks

**Backend:** Express.js (explicitly requested by user)

**Database:** PostgreSQL

**Main Resources:**
  * Task:
    - id (UUID, primary key, auto-generated)
    - user_id (UUID, foreign key, required)
    - title (string, max 200 chars, required)
    - description (text, optional, nullable)
    - due_date (date, required)
    - status (enum: 'pending', 'completed', default: 'pending')
    - priority (enum: 'low', 'medium', 'high', default: 'medium')
    - created_at (timestamp, auto-generated)
    - updated_at (timestamp, auto-updated)

**Relationships:**
  - Task belongs to User
  - User has many Tasks

**Authentication:**
  - Type: JWT (email/password)
  - User fields: id, email, password_hash, name, created_at
  - Protected routes: all task CRUD operations

**Features:**
  - Core: Create, read, update, delete tasks
  - Filter tasks by status (pending/completed)
  - Filter tasks by priority (low/medium/high)
  - Mark task as complete (status update)
  - User-scoped data (users only see their own tasks)

**Business Rules:**
  - Users can only create, view, edit, and delete their own tasks
  - Tasks cannot be created without a due date
  - Status can only be 'pending' or 'completed'
  - Priority must be 'low', 'medium', or 'high'

**Deployment:** Render (explicitly requested, includes free PostgreSQL)

**UI Components:** Astro + Tailwind CSS + Shadcn/ui
```

---

### Example 2: Invoice Tracker with Multiple Resources

**User Prompt:**
```
One-shot mode: Build an invoice tracker for freelancers with FastAPI, deploy to Vercel.

Resources:
1. Client: name, email, company, phone (optional)
2. Invoice: client_id (FK), amount (decimal), description, due_date, status (draft/sent/paid/overdue), invoice_number (auto-generated)

Features:
- Users create clients and invoices
- Dashboard shows: total outstanding, paid this month, overdue count
- Filter invoices by status and date range
```

**Extracted Requirements:**
```markdown
📋 Extracted Requirements:

**App:** Invoice Tracker - Freelancer invoicing and client management system

**Backend:** FastAPI (explicitly requested by user)

**Database:** PostgreSQL

**Main Resources:**
  * Client:
    - id (UUID, primary key, auto-generated)
    - user_id (UUID, foreign key, required)
    - name (string, max 200 chars, required)
    - email (email, required, validated)
    - company (string, max 200 chars, optional, nullable)
    - phone (string, max 20 chars, optional, nullable)
    - created_at (timestamp, auto-generated)
    - updated_at (timestamp, auto-updated)

  * Invoice:
    - id (UUID, primary key, auto-generated)
    - user_id (UUID, foreign key, required)
    - client_id (UUID, foreign key, required)
    - invoice_number (string, unique, auto-generated format: INV-YYYY-NNNN)
    - amount (decimal(10,2), required, min: 0.01)
    - description (text, optional, nullable)
    - due_date (date, required)
    - status (enum: 'draft', 'sent', 'paid', 'overdue', default: 'draft')
    - created_at (timestamp, auto-generated)
    - updated_at (timestamp, auto-updated)

**Relationships:**
  - Client belongs to User
  - User has many Clients
  - Invoice belongs to User
  - Invoice belongs to Client
  - User has many Invoices
  - Client has many Invoices

**Authentication:**
  - Type: JWT (email/password)
  - User fields: id, email, password_hash, name, created_at
  - Protected routes: all client and invoice operations

**Features:**
  - Core: CRUD operations on Clients and Invoices
  - Dashboard with aggregated data:
    * Total outstanding (sum of unpaid/sent invoices)
    * Paid this month (sum of paid invoices in current month)
    * Overdue count (count of invoices past due_date with status != 'paid')
  - Filter invoices by status (draft/sent/paid/overdue)
  - Filter invoices by date range (created_at or due_date)
  - Auto-generate unique invoice numbers (INV-2026-0001, INV-2026-0002, etc.)

**Business Rules:**
  - Users can only access their own clients and invoices
  - Invoices cannot be created without a client
  - Invoice status automatically changes to 'overdue' if due_date < today AND status != 'paid'
  - Invoice numbers are unique across all users
  - Amount must be positive (> 0)
  - Cannot delete client if they have associated invoices

**Deployment:** Vercel (explicitly requested, requires serverless-compatible setup)

**UI Components:** Astro + Tailwind CSS + Shadcn/ui
```

---

### Example 3: Auto-Select Backend

**User Prompt:**
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

**Extracted Requirements:**
```markdown
📋 Extracted Requirements:

**App:** Recipe Sharing Platform - Community recipe collection with search

**Backend:** Express.js (auto-selected - reason: Default choice for versatility, fast setup, good for public/private data model)

**Database:** PostgreSQL

**Main Resources:**
  * Recipe:
    - id (UUID, primary key, auto-generated)
    - user_id (UUID, foreign key, required)
    - title (string, max 200 chars, required)
    - ingredients (JSON array of strings, required, min: 1 item)
    - instructions (text, required, min: 10 chars)
    - prep_time (integer, minutes, required, min: 0)
    - cook_time (integer, minutes, required, min: 0)
    - servings (integer, required, min: 1, max: 100)
    - image_url (string, URL format, optional, nullable)
    - published (boolean, default: false)
    - created_at (timestamp, auto-generated)
    - updated_at (timestamp, auto-updated)

**Relationships:**
  - Recipe belongs to User
  - User has many Recipes

**Authentication:**
  - Type: JWT (email/password)
  - User fields: id, email, password_hash, name, avatar_url (optional), created_at
  - Protected routes: Create, edit, delete recipes
  - Public routes: View published recipes, search

**Features:**
  - Core: CRUD operations on Recipes (authenticated)
  - Public listing: View all recipes where published = true
  - Search functionality:
    * Search by title (case-insensitive, partial match)
    * Search by ingredients (any ingredient contains search term)
  - Filter recipes:
    * By prep_time (range: 0-30 min, 30-60 min, 60+ min)
    * By servings (range: 1-2, 3-4, 5+ servings)
  - Publish/unpublish recipes (toggle published status)
  - Upload recipe image (optional)

**Business Rules:**
  - Users can only edit/delete their own recipes
  - All users can view published recipes (no auth required)
  - Unpublished recipes are only visible to recipe owner
  - Recipes must have at least 1 ingredient
  - Prep time and cook time can be 0 (e.g., no-cook recipes)
  - Search returns max 50 results, sorted by created_at DESC

**Deployment:** Render (explicitly requested, includes free PostgreSQL)

**UI Components:** Astro + Tailwind CSS + Shadcn/ui
```

---

## Field Type Mapping

When extracting field types from user descriptions, use these mappings:

| User Says | Database Type | Validation |
|-----------|---------------|------------|
| "string", "text (short)" | VARCHAR(200) | max_length, required |
| "text", "description" | TEXT | optional, nullable |
| "email" | VARCHAR(255) | email format, unique |
| "password" | VARCHAR(255) | hashed (bcrypt), min 12 chars |
| "date" | DATE | ISO format (YYYY-MM-DD) |
| "datetime", "timestamp" | TIMESTAMP | ISO 8601 with timezone |
| "number", "integer" | INTEGER | min, max constraints |
| "decimal", "money", "price" | DECIMAL(10,2) | min: 0, max constraints |
| "boolean", "yes/no" | BOOLEAN | true/false |
| "enum", "status" | ENUM or VARCHAR | allowed values list |
| "array", "list" | JSON | validate array structure |
| "image", "photo" | VARCHAR(500) | URL format, optional |
| "file" | VARCHAR(500) | URL to storage (S3, Cloudinary) |
| "ID", "foreign key" | UUID | references other table |

---

## Auto-Selection Logic

### Backend Auto-Selection

Use this logic when user requests "auto-select" or doesn't specify backend:

```python
# Priority 1: Explicit keywords
if "express" in prompt.lower() or "node" in prompt.lower():
    return "Express.js"
elif "django" in prompt.lower():
    return "Django"
elif "fastapi" in prompt.lower():
    return "FastAPI"
elif "serverless" in prompt.lower() or "edge" in prompt.lower():
    return "Astro Edge + Supabase"

# Priority 2: Language hints
elif "javascript" in prompt.lower() or "typescript" in prompt.lower():
    return "Express.js"
elif "python" in prompt.lower():
    if "admin" in prompt.lower() or "cms" in prompt.lower():
        return "Django"
    else:
        return "FastAPI"

# Priority 3: Feature hints
elif "real-time" in prompt.lower() or "websocket" in prompt.lower():
    return "FastAPI"  # Native WebSocket support
elif "admin panel" in prompt.lower():
    return "Django"  # Built-in admin

# Default
else:
    return "Express.js"  # Most versatile, fastest setup
```

### Deployment Auto-Selection

```python
if backend == "Astro Edge":
    return "CloudFlare"  # Natural fit for edge functions
elif backend in ["Django", "FastAPI"]:
    return "Render"  # Free PostgreSQL included
elif backend == "Express":
    if "serverless" in prompt.lower():
        return "Vercel"
    else:
        return "Render"
else:
    return "Render"  # Safe default with free tier
```

---

## Validation Checklist

Before confirming extracted requirements, verify:

- [ ] All user-specified fields are included
- [ ] Field types are appropriate (string, number, date, etc.)
- [ ] Required vs optional is clear
- [ ] Relationships between resources are defined
- [ ] Authentication strategy is specified
- [ ] Business rules are captured
- [ ] Backend choice is justified (if auto-selected)
- [ ] Deployment platform is justified (if auto-selected)
- [ ] No ambiguities remain

If any ambiguities exist in step-by-step mode, ask clarifying questions.

In one-shot mode, make reasonable assumptions and document them.

---

*Version 1.0 | January 15, 2026*
