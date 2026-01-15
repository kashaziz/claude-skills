# Backend Quick Reference

Copy-paste commands for setting up each backend option.

---

## Decision Tree

```
What's your team's primary language?

├─ JavaScript/TypeScript
│  └─ Express.js + Prisma
│
├─ Python
│  ├─ Need auto-generated admin panel?
│  │  └─ Django
│  └─ API-first, async preferred?
│     └─ FastAPI
│
└─ Want zero server management?
   └─ Astro Edge + Supabase
```

---

## Express.js Setup

**Time:** 5 minutes

```bash
mkdir backend && cd backend
npm init -y
npm install express cors dotenv zod @prisma/client bcryptjs jsonwebtoken
npm install -D typescript ts-node @types/express @types/node @types/bcryptjs @types/jsonwebtoken nodemon prisma

npx tsc --init
npx prisma init
```

**Environment (.env):**
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/appdb"
JWT_SECRET=  # Generate: openssl rand -hex 32
PORT=3001
```

**Run:**
```bash
npm run dev  # http://localhost:3001
```

---

## FastAPI Setup

**Time:** 8 minutes

```bash
mkdir backend && cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install fastapi uvicorn sqlalchemy alembic psycopg2-binary python-jose passlib python-dotenv pydantic[email]

alembic init alembic
```

**Environment (.env):**
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/appdb"
SECRET_KEY=  # Generate: openssl rand -hex 32
```

**Run:**
```bash
uvicorn main:app --reload --port 8000
# http://localhost:8000
# Docs: http://localhost:8000/docs
```

---

## Django Setup

**Time:** 10 minutes

```bash
mkdir backend && cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install django djangorestframework djangorestframework-simplejwt django-cors-headers python-decouple psycopg2-binary

django-admin startproject config .
python manage.py startapp api
```

**Environment (.env):**
```bash
SECRET_KEY=  # Generate: openssl rand -hex 32
DEBUG=True
DB_NAME=appdb
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

**Run:**
```bash
python manage.py migrate
python manage.py runserver 8000
# http://localhost:8000
# Admin: http://localhost:8000/admin
```

---

## Astro Edge Setup

**Time:** 3 minutes

```bash
npm create astro@latest frontend
cd frontend
npm install @supabase/supabase-js
npm install -D @astrojs/vercel  # Or @astrojs/cloudflare
```

**Environment (.env):**
```bash
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_KEY="your-anon-key"
SUPABASE_SERVICE_KEY="your-service-key"  # Server-side only
```

**Run:**
```bash
npm run dev  # http://localhost:4321
```

---

## Frontend (Astro) Setup

Same for all backends:

```bash
npm create astro@latest frontend
cd frontend
npx astro add tailwind
npm install nanostores  # Optional: state management
```

**Run:**
```bash
npm run dev  # http://localhost:4321
```

---

## Database Setup

### PostgreSQL with Docker

```bash
# Create docker-compose.yml in project root
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF

# Start
docker-compose up -d

# Verify
docker-compose ps
```

### Supabase (for Astro Edge)

1. Go to supabase.com
2. Create new project
3. Copy Project URL and API keys to `.env`

---

## Port Reference

| Service | Default Port |
|---------|-------------|
| Astro Frontend | 4321 |
| Express Backend | 3001 |
| FastAPI Backend | 8000 |
| Django Backend | 8000 |
| PostgreSQL | 5432 |

---

## Test Your Setup

### Express
```bash
curl http://localhost:3001/health
```

### FastAPI
```bash
curl http://localhost:8000/health
# Swagger: http://localhost:8000/docs
```

### Django
```bash
curl http://localhost:8000/api/health/
# Admin: http://localhost:8000/admin/
```

### Astro Edge
```bash
curl http://localhost:4321/api/health
```

---

## Common Issues

### CORS Errors

**Express:**
```typescript
app.use(cors({ origin: 'http://localhost:4321' }));
```

**FastAPI:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4321"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Django:**
```python
CORS_ALLOWED_ORIGINS = ["http://localhost:4321"]
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
docker-compose ps

# Check connection string
psql postgresql://postgres:postgres@localhost:5432/appdb

# Restart PostgreSQL
docker-compose restart postgres
```

### Port Already in Use

```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9

# Or use different port
# Express: PORT=3002 npm run dev
# FastAPI: uvicorn main:app --port 8001
# Django: python manage.py runserver 8001
```

### Migrations Not Applied

```bash
# Express (Prisma)
npx prisma migrate dev

# FastAPI (Alembic)
alembic upgrade head

# Django
python manage.py migrate
```

---

*January 15, 2026*
