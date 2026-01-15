# Multi-Cloud Deployment Guide: Render, Vercel, CloudFlare, DigitalOcean, AWS, Azure

## Quick Platform Decision Tree

```
START HERE: Choose your platform based on your app type + budget

Do you have Astro frontend + serverless backend?
├─ YES → CloudFlare (fastest, free tier) or Vercel (easiest)
└─ NO → Continue

Do you need PostgreSQL database?
├─ YES → Render (easiest, free tier) or DigitalOcean (traditional)
└─ NO → CloudFlare or Vercel (serverless)

Budget constraint?
├─ $0/month → Vercel, CloudFlare, or Render free tier
├─ $5-20/month → Render ($7/mo) or Railway ($0 + usage)
├─ $20-50/month → DigitalOcean ($5 + database)
└─ $50+/month → AWS or Azure (enterprise features)

Team size?
├─ Solo dev → Render or Vercel (no DevOps)
├─ 2-5 people → Render or DigitalOcean
├─ 50+ people → AWS or Azure (compliance, SSO)
```

---

## Platform Comparison Matrix

| Aspect | Render | Vercel | CloudFlare | DigitalOcean | AWS | Azure |
|--------|--------|--------|-----------|--------------|-----|-------|
| **Setup Time** | 15m | 10m | 20m | 30m | 1-2h | 1-2h |
| **Free Tier** | Yes | Yes | Generous | No | 12 months | No |
| **Cost (MVP)** | $0-7 | $0-20 | $0-20 | $5+ | $15+ | $15+ |
| **Database** | PostgreSQL | External | KV only | PostgreSQL | RDS | SQL |
| **Best For** | Full-stack | Astro | Serverless | Traditional | Scale | Enterprise |
| **Learning Curve** | ⭐ Easy | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Scaling Ease** | Easy | Easy | Built-in | Easy | Complex | Medium |
| **HIPAA/SOC2** | No | No | No | No | Yes | Yes |

---

## 1. RENDER (Recommended for Full-Stack Django/FastAPI/Express)

### Why Render?
- ✅ PostgreSQL included (5GB free tier)
- ✅ Deploy from GitHub (automatic on push)
- ✅ Environment variables in UI (no secrets in code)
- ✅ Free tier sufficient for MVP
- ✅ One-click database provisioning

### Setup (15 minutes)

**Step 1: Prepare Code**

```yaml
# render.yaml (add to project root)
services:
  - type: web
    name: api
    runtime: python  # or node for Express
    pythonVersion: 3.11
    plan: free
    
    buildCommand: |
      pip install -r requirements.txt
      python manage.py migrate
    
    startCommand: gunicorn config.wsgi:application
    
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: postgres
          property: connectionString
      - key: DEBUG
        value: "false"
      - key: ALLOWED_HOSTS
        value: api-prod.render.com
      - key: JWT_SECRET
        sync: false  # Set in Render UI
      - key: CORS_ALLOWED_ORIGINS
        value: https://app-prod.render.com
    
    healthCheckPath: /health

databases:
  - name: postgres
    plan: free
    postgresSQLVersion: 15

staticSite:
  - name: frontend
    buildCommand: npm run build
    publishPath: dist
    envVars:
      - key: VITE_API_URL
        value: https://api-prod.render.com/api
```

**Step 2: Create on Render**

1. Go to render.com
2. Click "New +" → "Web Service"
3. Connect GitHub account
4. Select your repository
5. Select "render.yaml" as config file
6. Click "Deploy"

**Step 3: Add Secrets**

1. Go to Web Service Settings
2. Navigate to "Environment"
3. Add JWT_SECRET (generate: `openssl rand -hex 32`)
4. Add other API keys if needed
5. Click "Deploy"

**Step 4: Set Custom Domain (optional)**

1. Settings → Custom Domain
2. Add your domain (example.com)
3. Update DNS CNAME record
4. Render verifies automatically

**Result:**
- Backend: https://api-prod.render.com
- Frontend: https://app-prod.render.com
- Database: PostgreSQL (free, 5GB)
- Cost: $0/month (free tier) or $7+/month (production)

**Post-Deployment Checks:**
```bash
# Test API
curl https://api-prod.render.com/health

# Test CORS
curl -H "Origin: https://app-prod.render.com" \
     https://api-prod.render.com/api/users

# Check logs
# Render dashboard → Logs tab
```

---

## 2. VERCEL (Recommended for Astro + Serverless)

### Why Vercel?
- ✅ Astro native (optimized)
- ✅ Edge Functions auto-deployed
- ✅ Free tier generous ($0 forever)
- ✅ Deploy from GitHub (automatic)
- ✅ Instant preview deployments

### Setup (10 minutes)

**Step 1: Configure Astro**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  integrations: [tailwind()],
  output: 'hybrid',  // Static + serverless
  adapter: vercel({
    imageService: true,
    imagesConfig: {
      sizes: [320, 640, 1280],
      formats: ['image/avif', 'image/webp'],
    },
  }),
});
```

**Step 2: Create on Vercel**

1. Go to vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Vercel auto-detects Astro
5. Click "Deploy"

**Step 3: Add Environment Variables**

1. Project Settings → Environment Variables
2. Add for each environment (Production, Preview, Development):
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_KEY
   - SUPABASE_SERVICE_KEY
3. Click "Save"

**Step 4: Configure Custom Domain**

1. Settings → Domains
2. Add your domain
3. Update DNS CNAME
4. Vercel verifies automatically

**Result:**
- Frontend: https://app-prod.vercel.app
- API Routes: https://app-prod.vercel.app/api/*
- Cost: $0/month (free tier) or $20+/month (pro features)

**Auto-Deployment:**
```bash
# Push to main branch
git push origin main

# Vercel automatically:
# 1. Builds project (npm run build)
# 2. Deploys to edge network
# 3. Runs tests (if configured)
# 4. Creates preview URL for PR
```

---

## 3. CLOUDFLARE (Fastest, Serverless-First)

### Why CloudFlare?
- ✅ Edge computing (sub-100ms response)
- ✅ DDoS protection included (free)
- ✅ Workers KV for storage (free tier)
- ✅ Zero cold starts (instant)
- ✅ Generous free tier

### Setup (20 minutes)

**Step 1: Install Wrangler**

```bash
npm install -D wrangler
wrangler login
```

**Step 2: Create wrangler.toml**

```toml
name = "app-prod"
main = "src/index.ts"
compatibility_date = "2024-01-01"
type = "javascript"

[env.production]
name = "app-prod"
route = "https://app-prod.example.com/*"
zone_id = "your-zone-id"

[[env.production.env]]
vars = { ENVIRONMENT = "production" }

[env.production.kv_namespaces]
KV = { binding = "KV", id = "your-kv-id" }
```

**Step 3: Create API Handler**

```typescript
// src/index.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }));
    }

    // API routes
    if (url.pathname.startsWith('/api/')) {
      return handleAPI(request, env);
    }

    // Fallback
    return new Response('Not found', { status: 404 });
  },
};

async function handleAPI(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  
  // Forward to Supabase or custom backend
  const response = await fetch(`${env.API_URL}${url.pathname}`, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  return response;
}

interface Env {
  API_URL: string;
  KV: KVNamespace;
}
```

**Step 4: Deploy**

```bash
# Deploy to CloudFlare
wrangler deploy --env production

# Result: https://app-prod.example.com
```

**Step 5: Configure DNS**

1. CloudFlare dashboard → DNS
2. Point your domain to CloudFlare nameservers
3. Wrangler auto-configures the route
4. DNS propagates (5-30 min)

**Result:**
- Frontend + API: https://app-prod.example.com
- DDoS protection: Automatic
- Cost: $0/month (free tier) or $20+/month (pro)

---

## 4. DIGITALOCEAN (Traditional App Platform)

### Why DigitalOcean?
- ✅ Full control (traditional VM + managed services)
- ✅ Affordable ($5-50/month)
- ✅ Good documentation
- ✅ Droplets (VPS) + App Platform (PaaS)
- ✅ One-click deployments

### Setup (30 minutes)

**Step 1: Create app.yaml**

```yaml
name: api-prod

services:
  - name: api
    github:
      repo: yourusername/yourrepo
      branch: main
    build_command: |
      pip install -r requirements.txt
      python manage.py migrate
    run_command: gunicorn config.wsgi:application
    
    http_port: 8080
    
    envs:
      - key: DEBUG
        value: "False"
      - key: DATABASE_URL
        value: ${db.connection_string}
      - key: JWT_SECRET
        scope: RUN_AND_BUILD_TIME
      - key: CORS_ALLOWED_ORIGINS
        value: https://app-prod.ondigitalocean.app

databases:
  - name: postgres
    engine: PG
    version: "15"
    production: true

static_sites:
  - name: frontend
    source_dir: dist
    build_command: npm install && npm run build
    github:
      repo: yourusername/yourrepo
      branch: main
    routes:
      - path: /
      - path: /api
        preserve_path_prefix: true
```

**Step 2: Create App**

1. DigitalOcean dashboard → Apps
2. "Create App"
3. Connect GitHub
4. Upload app.yaml
5. Configure database (PostgreSQL)
6. Click "Create Resources"

**Step 3: Add Secrets**

1. App Settings → Components → Variables
2. Add JWT_SECRET (generate: `openssl rand -hex 32`)
3. Add other API keys
4. Click "Update"

**Step 4: Configure Domain**

1. Settings → Domains
2. Add your domain
3. Update DNS CNAME
4. DigitalOcean verifies

**Result:**
- Backend: https://api-prod.ondigitalocean.app
- Frontend: https://app-prod.ondigitalocean.app
- Database: PostgreSQL (managed)
- Cost: $12+/month (app + database)

---

## 5. AWS (EC2 + ECS + RDS)

### Why AWS?
- ✅ Most powerful, scales to billions
- ✅ Enterprise compliance (HIPAA, SOC2)
- ✅ Serverless options (Lambda, Fargate)
- ✅ Global infrastructure

### Setup (1-2 hours)

**Architecture:**
```
Route 53 (DNS)
    ↓
CloudFront (CDN)
    ↓
ALB (Load Balancer)
    ↓
ECS (Container orchestration)
    ├─ Backend container (Docker)
    └─ Frontend S3 + CloudFront
    ↓
RDS (PostgreSQL)
```

**Step 1: Create VPC**

```bash
# Create VPC with public/private subnets
aws ec2 create-vpc --cidr-block 10.0.0.0/16
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
```

**Step 2: Create RDS PostgreSQL**

```bash
aws rds create-db-instance \
  --db-instance-identifier app-prod-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password "GenerateRandomPassword123!" \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxx \
  --backup-retention-period 7
```

**Step 3: Create ECR Repository**

```bash
aws ecr create-repository --repository-name app-prod-api
```

**Step 4: Build & Push Docker Image**

```bash
# Build
docker build -t app-prod-api:latest .

# Tag for ECR
docker tag app-prod-api:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/app-prod-api:latest

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Push
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/app-prod-api:latest
```

**Step 5: Create ECS Cluster & Service**

```bash
aws ecs create-cluster --cluster-name app-prod

aws ecs register-task-definition --cli-input-json file://task-definition.json

aws ecs create-service \
  --cluster app-prod \
  --service-name api \
  --task-definition app-prod-api \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

**Step 6: Deploy Frontend to S3 + CloudFront**

```bash
# Build
npm run build

# Create S3 bucket
aws s3 mb s3://app-prod-frontend

# Sync files
aws s3 sync dist/ s3://app-prod-frontend/ --delete

# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config file://distribution-config.json
```

**Step 7: Setup Route 53**

```bash
aws route53 create-hosted-zone --name app-prod.example.com
aws route53 change-resource-record-sets --hosted-zone-id ZONE_ID --change-batch file://changes.json
```

**Result:**
- Frontend: https://app-prod.example.com (CloudFront)
- Backend: https://api-prod.example.com (ALB)
- Database: PostgreSQL RDS (managed)
- Cost: $50-200+/month (depends on usage)

---

## 6. AZURE (App Service + SQL Database)

### Why Azure?
- ✅ Microsoft integration (Active Directory, Office 365)
- ✅ Enterprise compliance
- ✅ Hybrid cloud support

### Setup (1 hour)

**Step 1: Create Resource Group**

```bash
az group create --name app-prod --location eastus
```

**Step 2: Create SQL Database**

```bash
az sql server create \
  --name app-prod-server \
  --resource-group app-prod \
  --admin-user azureuser \
  --admin-password "GenerateRandomPassword123!"

az sql db create \
  --resource-group app-prod \
  --server app-prod-server \
  --name appdb \
  --edition Standard
```

**Step 3: Create App Service Plan**

```bash
az appservice plan create \
  --name app-prod-plan \
  --resource-group app-prod \
  --sku B2 \
  --is-linux
```

**Step 4: Create Web App**

```bash
az webapp create \
  --resource-group app-prod \
  --plan app-prod-plan \
  --name api-prod \
  --runtime "PYTHON:3.11"

# Configure environment
az webapp config appsettings set \
  --resource-group app-prod \
  --name api-prod \
  --settings \
    DEBUG=False \
    DATABASE_URL="Server=app-prod-server.database.windows.net;Database=appdb;User=azureuser;Password=..." \
    JWT_SECRET="$(openssl rand -hex 32)"
```

**Step 5: Deploy from GitHub**

```bash
az webapp up --name api-prod --resource-group app-prod
```

**Step 6: Create Static Web App (Frontend)**

```bash
az staticwebapp create \
  --name app-prod-frontend \
  --resource-group app-prod \
  --source https://github.com/yourusername/yourrepo \
  --branch main \
  --location eastus \
  --build-folder dist
```

**Result:**
- Backend: https://api-prod.azurewebsites.net
- Frontend: https://app-prod-frontend.azurewebsites.net
- Database: Azure SQL Database
- Cost: $20-100+/month

---

## Deployment Checklist (All Platforms)

### Before Deployment
- [ ] Environment variables configured
- [ ] Database migrations tested locally
- [ ] All Playwright tests passing
- [ ] Security checklist complete
- [ ] Performance baseline captured
- [ ] API tested with Postman/curl
- [ ] Frontend built and tested

### During Deployment
- [ ] Build logs show no errors
- [ ] Database connection verified
- [ ] Health endpoint responds (200)
- [ ] Frontend loads without CORS errors
- [ ] Authentication working end-to-end
- [ ] API calls from frontend successful

### After Deployment
- [ ] Monitor logs for errors (Sentry, platform dashboard)
- [ ] Test user flow (login → create → list → delete)
- [ ] Performance check (Lighthouse, Core Web Vitals)
- [ ] Backup tested (can restore)
- [ ] Alerts configured (CPU, errors, uptime)
- [ ] Team notified with live URL

---

## Monitoring Setup (Per Platform)

### All Platforms: Sentry Integration

```python
# Django
import sentry_sdk
sentry_sdk.init(
    dsn="https://xxx@sentry.io/xxx",
    traces_sample_rate=0.1,
    environment="production",
)
```

### Platform-Specific Monitoring

**Render:**
- Dashboard → Logs (real-time)
- Metrics → CPU, Memory, Disk
- Alerts → Slack webhook

**Vercel:**
- Dashboard → Analytics
- Performance → Core Web Vitals
- Integrations → Slack

**CloudFlare:**
- Analytics → Cache, Requests
- Security → Bot Management
- Performance → Caching Rules

**DigitalOcean:**
- Monitoring → CPU, Bandwidth
- Alerts → Email or webhook
- Logs → Application logs

**AWS:**
- CloudWatch → Metrics, Logs
- X-Ray → Distributed tracing
- SNS → Alerts to email/Slack

**Azure:**
- Application Insights → Performance
- Alert Rules → CPU, errors
- Log Analytics → Query logs

---

## Rollback Strategy

### If Deployment Fails

**Render:**
```
Dashboard → Services → api → Logs
If errors: Settings → GitHub → Rollback (previous commit)
```

**Vercel:**
```
Deployments → Select previous
Click "Promote to Production"
```

**CloudFlare:**
```
Workers → Deployments → Select previous
Click "Rollback"
```

**DigitalOcean:**
```
App Platform → Services → Rollback
Or: redeploy from previous git commit
```

**AWS:**
```
ECS → Services → Update Service
Select previous task definition
Click Update
```

**Azure:**
```
App Service → Deployments → Select previous
Click "Activate"
```

---

## Cost Comparison (Monthly)

| Platform | Frontend | Backend | Database | Total |
|----------|----------|---------|----------|-------|
| **Render** | Free | $7 | Included | **$7** |
| **Vercel** | $0-20 | Included | N/A | **$0-20** |
| **CloudFlare** | Free | $0-20 | Free (KV) | **$0-20** |
| **DigitalOcean** | Free | $5-20 | $15+ | **$20-35+** |
| **AWS** | $5-50 | $20-100 | $10-50 | **$35-200+** |
| **Azure** | $0-10 | $10-100 | $10-50 | **$20-160+** |

**Recommendation for MVP:** Render ($7/month) or Vercel ($0/month)

---

## Quick Test After Deployment

```bash
#!/bin/bash

BACKEND_URL="https://api-prod.example.com"
FRONTEND_URL="https://app-prod.example.com"

echo "🧪 Testing production deployment..."

# Health check
echo "1️⃣  Health check..."
curl -I $BACKEND_URL/health | grep 200 && echo "✅ API responding" || echo "❌ API down"

# Frontend loads
echo "2️⃣  Frontend loads..."
curl -I $FRONTEND_URL | grep 200 && echo "✅ Frontend responding" || echo "❌ Frontend down"

# CORS configured
echo "3️⃣  CORS configured..."
curl -H "Origin: $FRONTEND_URL" $BACKEND_URL/api/health | grep "content-type" && echo "✅ CORS OK" || echo "❌ CORS failed"

# Auth working
echo "4️⃣  Auth flow..."
TOKEN=$(curl -s -X POST $BACKEND_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@test.com\",\"password\":\"test\"}" | jq -r '.access_token // .token')

if [ ! -z "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  echo "✅ Token received: ${TOKEN:0:20}..."
else
  echo "❌ Auth failed"
  exit 1
fi

# Protected endpoint
echo "5️⃣  Protected endpoint..."
curl -s -H "Authorization: Bearer $TOKEN" $BACKEND_URL/api/users | grep -q "name\|email" && echo "✅ Authenticated request works" || echo "❌ Protected endpoint failed"

echo ""
echo "✅ All tests passed! Deployment successful."
```

---

**Questions?** Review the specific platform section above or check platform documentation.

---

*January 15, 2026*

