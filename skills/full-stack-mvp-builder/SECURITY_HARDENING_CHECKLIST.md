# Production Security Hardening Checklist

**Status:** ☐ Not Started | ⊙ In Progress | ✅ Complete

---

## Authentication & Authorization (12 items)

### JWT Security
- [ ] **JWT_SECRET is strong** (min 32 chars, random, alphanumeric + symbols)
  - Test: `echo $JWT_SECRET | wc -c` → should be 32+
  - Generate: `openssl rand -hex 32`
  - ❌ Don't use: "my-secret-123" or "password"

- [ ] **JWT_SECRET rotated quarterly**
  - Document rotation dates
  - Keep previous secret for 7 days (token grace period)
  - Alert team of rotation

- [ ] **Access token expiry is reasonable** (1-24 hours)
  - Not too short (annoying UX)
  - Not too long (security risk if leaked)
  - Recommended: 1 hour

- [ ] **Refresh tokens are httpOnly cookies** (not localStorage)
  - Test: Browser DevTools → Application → Cookies
  - Should see `HttpOnly` flag
  - Frontend should NOT access via JavaScript

- [ ] **Token validation on every protected request**
  - Check: middleware validates JWT signature
  - Check: verify token hasn't expired
  - Check: verify user still exists in database

- [ ] **Expired tokens return 401** (not 500 or silent failure)
  - Test: Wait for token to expire, make request
  - Should receive 401, not 500
  - Frontend should redirect to login

**Django Implementation:**
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,  # Create new refresh token on use
    'ALGORITHM': 'HS256',
}
```

**FastAPI Implementation:**
```python
from datetime import timedelta, datetime, timezone

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    # ... rest of JWT creation
```

---

### Password Security
- [ ] **Passwords hashed with bcrypt or argon2** (NOT plaintext)
  - Test: Query database → SELECT password_hash FROM users
  - Should see hash like: `$2b$12$...`
  - ❌ Never see plaintext password

- [ ] **Password validation enforced**
  - Min length: 12 characters
  - Require: uppercase + lowercase + number + symbol
  - Reject: common passwords ("password123")
  - Test: Try registering with "weak" password → should fail

- [ ] **Passwords NEVER logged or error messages**
  - Test: Try wrong password, check logs
  - Logs should NOT contain user input
  - Error message: "Invalid email or password" (generic)

**Django Implementation:**
```python
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {'min_length': 12}
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Hashing
from django.contrib.auth.hashers import make_password
hashed = make_password("userpassword")
```

### Rate Limiting
- [ ] **Login endpoint rate limited** (5 attempts, 15 min lockout)
  - Test: Try 6 logins with wrong password
  - 6th should return 429 (Too Many Requests)

- [ ] **Rate limiting cached** (Redis, not in-memory)
  - Test: Kill server, rate limit should persist
  - In-memory: resets on app restart (bad)

- [ ] **Public endpoints rate limited** (100-1000 req/min)
  - Test: Send 200 requests in 1 minute
  - After limit: 429 response

**Django Implementation:**
```python
from django_ratelimit.decorators import ratelimit

@ratelimit(key='ip', rate='5/15m', method='POST')
def login_view(request):
    # Login logic
```

**Express Implementation:**
```typescript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,  // 5 requests
  message: 'Too many login attempts, please try again later',
  store: redisStore,  // Use Redis, not memory
});

app.post('/api/auth/login', loginLimiter, authController.login);
```

### RBAC (Role-Based Access Control)
- [ ] **User roles defined** (admin, user, moderator, guest)
  - Database: roles table exists
  - Each user has role assigned
  - Test: Check user role in database

- [ ] **Permissions checked before sensitive operations**
  - Test: User tries to access /admin → 403 Forbidden
  - Test: User tries to delete other user → 403 Forbidden
  - Check middleware validates permissions

- [ ] **User cannot access other user's data**
  - Test: User A logs in, tries to access User B's profile
  - API should return 404 or 403, NOT User B's data
  - Implementation: Always filter by current_user

**Django Implementation:**
```python
from django.contrib.auth.decorators import permission_required

@permission_required('admin.change_user', raise_exception=True)
def admin_view(request):
    # Admin-only logic
```

**FastAPI Implementation:**
```python
async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = verify_token(token)
    return user

async def admin_only(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@app.get("/api/admin/users")
async def list_users(admin: User = Depends(admin_only)):
    # Admin-only logic
```

---

## API Security (10 items)

### CORS Configuration
- [ ] **CORS only allows specific origins** (NOT "*")
  - ❌ Bad: `CORS_ALLOWED_ORIGINS = ["*"]`
  - ✅ Good: `CORS_ALLOWED_ORIGINS = ["https://app.example.com"]`
  - Test: `curl -H "Origin: https://evil.com" API_URL` → should fail

- [ ] **Credentials allowed only if origin whitelisted**
  - Setting: `CORS_ALLOW_CREDENTIALS = True`
  - Only set if origin is whitelisted
  - Test: Verify cookies sent in cross-origin request

- [ ] **Preflight requests handled (OPTIONS method)**
  - Automatically handled by framework
  - No manual action usually needed

**Django Implementation:**
```python
CORS_ALLOWED_ORIGINS = [
    "https://app.example.com",
    "https://admin.example.com",
]
CORS_ALLOW_CREDENTIALS = True
```

**Express Implementation:**
```typescript
import cors from 'cors';

app.use(cors({
  origin: ['https://app.example.com', 'https://admin.example.com'],
  credentials: true,
}));
```

### Input Validation
- [ ] **All user input validated**
  - Check type (string, number, boolean)
  - Check length (max, min)
  - Check format (email, URL, phone)
  - Check value (enum, range)

- [ ] **SQL injection prevented** (use ORM/parameterized queries)
  - Test: Try injecting `'; DROP TABLE users; --`
  - Should fail with validation error
  - Never see SQL error in response

- [ ] **XSS prevented**
  - All output escaped by framework
  - Astro/React automatically escape
  - Test: Comment with `<script>alert('xss')</script>`
  - Should display as text, not execute

- [ ] **CSRF protected** (CSRF tokens on forms)
  - All POST/PUT/DELETE require CSRF token
  - Token changes per request
  - Test: POST without token → 403

**Django Implementation:**
```python
from django import forms
from django.views.decorators.csrf import csrf_protect

class UserForm(forms.ModelForm):
    email = forms.EmailField()
    name = forms.CharField(max_length=100)
    
    class Meta:
        model = User
        fields = ['email', 'name']

@csrf_protect
def create_user(request):
    # CSRF token automatically included
```

**FastAPI Implementation:**
```python
from pydantic import BaseModel, validator, EmailStr

class UserCreate(BaseModel):
    email: EmailStr  # Validates email format
    name: str = Field(..., max_length=100)
    
    @validator('name')
    def name_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v
```

### File Uploads
- [ ] **File type validated**
  - Whitelist allowed types: pdf, jpg, png
  - Reject: exe, zip, script files
  - Test: Upload .exe file → should fail

- [ ] **File size limited** (max 10MB)
  - Check: file size before upload
  - Reject large files with 413 error

- [ ] **Filename sanitized**
  - Don't use user-supplied filename
  - Generate random name: `uuid.uuid4().hex`
  - Store original name if needed (in database)

**Implementation:**
```python
import os
import uuid

def upload_file(file):
    # Validate type
    allowed = ['pdf', 'jpg', 'png']
    ext = file.filename.split('.')[-1].lower()
    if ext not in allowed:
        raise ValueError('File type not allowed')
    
    # Validate size
    if file.size > 10 * 1024 * 1024:  # 10MB
        raise ValueError('File too large')
    
    # Generate safe filename
    safe_name = f"{uuid.uuid4().hex}.{ext}"
    file.save(f"/uploads/{safe_name}")
    
    return safe_name
```

### API Response Headers
- [ ] **Content-Security-Policy set**
  - Prevents inline JavaScript, external scripts
  - Header: `Content-Security-Policy: default-src 'self'`
  - Test: `curl -I API_URL | grep Content-Security-Policy`

- [ ] **X-Content-Type-Options: nosniff**
  - Prevents MIME type sniffing
  - Header: `X-Content-Type-Options: nosniff`

- [ ] **X-Frame-Options: DENY**
  - Prevents clickjacking
  - Header: `X-Frame-Options: DENY`

- [ ] **Strict-Transport-Security (HSTS)**
  - Forces HTTPS
  - Header: `Strict-Transport-Security: max-age=31536000`

**Django Middleware:**
```python
MIDDLEWARE = [
    # ...
    'django.middleware.security.SecurityMiddleware',
]

SECURE_CONTENT_SECURITY_POLICY = "default-src 'self'; script-src 'self' 'unsafe-inline'"
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
```

**Express Middleware:**
```typescript
import helmet from 'helmet';

app.use(helmet());  // Automatically sets all security headers
```

---

## Database Security (7 items)

### Connection Security
- [ ] **Database uses TLS/SSL** (encrypted connection)
  - Connection string includes `sslmode=require`
  - PostgreSQL: `postgresql://user:pass@host:5432/db?sslmode=require`
  - Test: Verify connection uses SSL/TLS

- [ ] **Database NOT exposed to internet**
  - Only accessible from app server (private subnet)
  - Security group allows only app server IP
  - Test: Try connecting from outside network → fails

- [ ] **Database password is strong**
  - Min 20 characters
  - Include: uppercase, lowercase, number, symbol
  - Not the same as other passwords

### Data Protection
- [ ] **Sensitive data encrypted at rest**
  - Passwords: always hashed (bcrypt/argon2)
  - API keys: encrypted (PostgreSQL pgcrypto)
  - PII: encrypted (name, address, SSN)
  - Test: Query database → see encrypted values

- [ ] **Sensitive data encrypted in transit**
  - All connections use HTTPS
  - Database connections use TLS/SSL
  - No plaintext data over network

**Encryption Implementation:**
```sql
-- PostgreSQL
CREATE EXTENSION pgcrypto;

-- Encrypt on insert
INSERT INTO users (email, encrypted_ssn)
VALUES ('user@test.com', pgp_sym_encrypt('123-45-6789', 'encryption_key'));

-- Decrypt on select
SELECT email, pgp_sym_decrypt(encrypted_ssn, 'encryption_key') as ssn
FROM users;
```

### Backups & Recovery
- [ ] **Backups automated** (daily minimum)
  - Set database backup schedule
  - Test: Run backup manually
  - Verify backup file created

- [ ] **Backups encrypted**
  - Backups stored with encryption
  - Not accessible without key
  - Test: Verify backup is encrypted

- [ ] **Restore tested**
  - Actually restore from backup
  - Not just "can backup"
  - Verify restored data integrity

---

## Deployment Security (8 items)

### Environment Variables
- [ ] **.env files git-ignored**
  - Check: `.gitignore` includes `.env*`
  - Test: `git log --all -- .env` → no .env in history

- [ ] **All secrets in environment** (not hardcoded)
  - Grep: `grep -r "password\|secret\|key" src/` → no matches
  - Should only see variable references: `${JWT_SECRET}`

- [ ] **Production secrets in platform vault**
  - Render UI, Vercel dashboard, AWS Secrets Manager
  - Not in GitHub (even private repo)
  - Not in local .env

- [ ] **Secrets never logged**
  - Test: Try operation with secret, check logs
  - Should NOT see JWT_SECRET, API_KEY, password in logs
  - Implement: `logging.mask_sensitive(data)`

### Application Configuration
- [ ] **DEBUG mode OFF in production**
  - Check: `DEBUG = False` in settings
  - Test: Trigger 500 error → should be generic error, not stack trace
  - Never expose stack traces in production

- [ ] **Allowed hosts configured**
  - Django: `ALLOWED_HOSTS = ['example.com', 'www.example.com']`
  - Test: Access with different domain → 400 Bad Request

- [ ] **Admin interface disabled or protected**
  - Django: `/admin/` behind authentication
  - Disable: remove admin URL if not needed
  - Change default URL: not `/admin/`

---

## Monitoring & Logging (6 items)

### Logging Setup
- [ ] **Error logs captured** (Sentry or platform logs)
  - Test: Trigger error, check Sentry
  - Should see error within 5 seconds
  - Stack trace, user info, browser info logged

- [ ] **No sensitive data in logs**
  - Passwords: never logged
  - Tokens: never logged (or masked)
  - PII: limited logging
  - Test: Search logs for "password\|token\|ssn" → no results

- [ ] **Log retention policy**
  - Keep logs 90 days
  - Delete old logs automatically
  - Check: log storage size not growing infinitely

### Alerting
- [ ] **Failed login attempts alerted**
  - Trigger: 5+ failed logins from same IP
  - Alert: Slack/email notification
  - Action: Investigate suspicious activity

- [ ] **Server errors alerted**
  - Trigger: 500 error
  - Alert: Slack/email notification
  - Action: Investigate and fix

- [ ] **Unusual activity detected**
  - Example: bulk download of users
  - Example: login from new country
  - Example: admin accessing user data
  - Alert: Log for review

**Sentry Setup:**
```python
import sentry_sdk

sentry_sdk.init(
    dsn="https://key@sentry.io/project",
    traces_sample_rate=0.1,
    environment="production",
)

# Error will be automatically reported
try:
    1 / 0
except ZeroDivisionError:
    sentry_sdk.capture_exception()
```

---

## Infrastructure Security (5 items)

### Container Security
- [ ] **Base image is official** (from official registry)
  - ✅ `FROM python:3.11-alpine`
  - ❌ `FROM ubuntu:latest`
  - Smaller, fewer vulnerabilities

- [ ] **No root user in container**
  - Create app user
  - Run container as non-root
  - Test: `docker run ps aux` → see appuser, not root

- [ ] **Image scanned for vulnerabilities**
  - Tool: Snyk, Trivy, Aqua
  - Test: `trivy image myapp:latest`
  - Fail if critical vulnerabilities

**Docker Security:**
```dockerfile
FROM python:3.11-alpine

RUN useradd -m appuser

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY --chown=appuser:appuser . .

USER appuser

EXPOSE 8000
CMD ["gunicorn", "config.wsgi"]
```

### Network Security
- [ ] **Firewall rules configured**
  - Inbound: only 80, 443 to web
  - Database: only from app server
  - Admin: only from VPN/bastion

- [ ] **DDoS protection enabled**
  - CloudFlare, AWS Shield, Azure DDoS
  - Test: Check platform dashboard

---

## Security Testing (Playwright)

```typescript
// tests/security.spec.ts

test('JWT validation required', async ({ page }) => {
  const response = await page.request.get(
    'http://localhost:3001/api/protected'
    // No Authorization header
  );
  expect(response.status()).toBe(401);
});

test('CORS blocks unauthorized origins', async ({ page }) => {
  const response = await page.request.get(
    'http://localhost:3001/api/users',
    {
      headers: { 'Origin': 'https://evil.com' }
    }
  );
  expect(response.status()).toBe(401 || 403);
});

test('Rate limiting enforced', async ({ page }) => {
  for (let i = 0; i < 150; i++) {
    const response = await page.request.post(
      'http://localhost:3001/api/auth/login',
      { data: { email: 'test@test.com', password: 'x' } }
    );
    if (i > 100) {
      expect(response.status()).toBe(429);
    }
  }
});

test('SQL injection prevented', async ({ page }) => {
  const response = await page.request.post(
    'http://localhost:3001/api/search',
    { data: { q: "'; DROP TABLE users; --" } }
  );
  expect(response.status()).toBe(400);
});
```

---

## Sign-Off Template

```
SECURITY AUDIT SIGN-OFF

Reviewed By: ________________________  Date: __________
Approved By: ________________________  Date: __________

Checklist Status:
[ ] All items reviewed
[ ] Failures documented
[ ] Fixes implemented
[ ] Tests passing (6/6 security tests)
[ ] Production deployment approved

Critical Issues Found: ________________
Resolution: ____________________________

Known Risks (accepted): _________________
Mitigation Plan: ________________________
```

---

**Questions:** Review items above or consult framework documentation for your stack.

---

*January 15, 2026*

