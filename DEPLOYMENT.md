# Deployment Guide

This guide covers deploying the AI Document Generator to production environments.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Backend Deployment](#backend-deployment)
  - [Vercel Deployment](#vercel-backend-deployment)
  - [Railway Deployment](#railway-deployment)
  - [Docker Deployment](#docker-deployment)
- [Frontend Deployment](#frontend-deployment)
  - [Vercel Deployment](#vercel-frontend-deployment)
  - [Netlify Deployment](#netlify-deployment)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The application consists of two main components:
- **Backend**: FastAPI application (currently deployed on Vercel)
- **Frontend**: Next.js application (to be deployed)

**Current Production URLs:**
- Backend: `https://backend-hackaton-v2.vercel.app`
- Frontend: To be deployed

## ✅ Prerequisites

### Required Accounts
- [ ] GitHub account (for code repository)
- [ ] Vercel account (recommended for both backend and frontend)
- [ ] PostgreSQL database (Vercel Postgres, Supabase, or Railway)
- [ ] OpenAI account (or compatible AI provider)

### Required Tools
- [ ] Git
- [ ] Node.js 18+ (for frontend)
- [ ] Python 3.9+ (for backend)
- [ ] PostgreSQL client (for database setup)

## 🔧 Backend Deployment

### Vercel Backend Deployment

The backend is already deployed on Vercel. To redeploy or deploy to a new instance:

#### 1. Prepare Repository

```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### 2. Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select the `backend` directory as the root directory
5. Framework Preset: "Other"

#### 3. Configure Build Settings

```
Build Command: pip install -r requirements.txt
Output Directory: (leave empty)
Install Command: pip install -r requirements.txt
```

#### 4. Set Environment Variables

Add the following in Vercel project settings:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Security
SECRET_KEY=your-generated-secret-key

# AI Provider
OPENAI_API_KEY=your-openai-api-key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Python Version (if needed)
PYTHON_VERSION=3.9
```

#### 5. Deploy

Click "Deploy" and wait for the build to complete.

#### 6. Verify Deployment

```bash
# Test health endpoint
curl https://your-backend.vercel.app/health

# Test API docs
open https://your-backend.vercel.app/docs
```

### Railway Deployment

Railway provides excellent PostgreSQL support and easy Python deployments.

#### 1. Install Railway CLI

```bash
npm install -g @railway/cli
railway login
```

#### 2. Initialize Project

```bash
cd backend
railway init
```

#### 3. Add PostgreSQL

```bash
railway add postgresql
```

Railway will automatically set `DATABASE_URL`.

#### 4. Set Environment Variables

```bash
railway variables set SECRET_KEY="your-secret-key"
railway variables set OPENAI_API_KEY="your-api-key"
railway variables set OPENAI_BASE_URL="https://api.openai.com/v1"
railway variables set OPENAI_MODEL="gpt-4"
railway variables set OPENAI_EMBEDDING_MODEL="text-embedding-3-small"
```

#### 5. Deploy

```bash
railway up
```

#### 6. Get Deployment URL

```bash
railway domain
```

### Docker Deployment

For self-hosted or cloud VM deployments.

#### 1. Create Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 2. Create docker-compose.yml

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/doc_generator_db
      - SECRET_KEY=${SECRET_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OPENAI_BASE_URL=${OPENAI_BASE_URL}
      - OPENAI_MODEL=${OPENAI_MODEL}
      - OPENAI_EMBEDDING_MODEL=${OPENAI_EMBEDDING_MODEL}
    depends_on:
      - db

  db:
    image: pgvector/pgvector:pg14
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=doc_generator_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### 3. Deploy

```bash
# Create .env file with secrets
cp backend/.env.example .env
# Edit .env with your values

# Build and run
docker-compose up -d

# Check logs
docker-compose logs -f backend
```

## 🎨 Frontend Deployment

### Vercel Frontend Deployment

Recommended for Next.js applications.

#### 1. Prepare Repository

Ensure frontend code is in the `frontend` directory and pushed to GitHub.

#### 2. Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select the `frontend` directory as the root directory
5. Framework Preset: "Next.js"

#### 3. Configure Build Settings

Vercel auto-detects Next.js settings:

```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

#### 4. Set Environment Variables

Add in Vercel project settings:

```env
NEXT_PUBLIC_API_BASE_URL=https://backend-hackaton-v2.vercel.app
```

Or your custom backend URL:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend.vercel.app
```

#### 5. Deploy

Click "Deploy" and wait for the build to complete.

#### 6. Verify Deployment

1. Visit your deployment URL
2. Test registration and login
3. Create a project and upload documents
4. Verify all features work

### Netlify Deployment

Alternative to Vercel for frontend hosting.

#### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
netlify login
```

#### 2. Initialize Project

```bash
cd frontend
netlify init
```

#### 3. Configure Build Settings

When prompted:
- Build command: `npm run build`
- Publish directory: `.next`

#### 4. Set Environment Variables

```bash
netlify env:set NEXT_PUBLIC_API_BASE_URL "https://backend-hackaton-v2.vercel.app"
```

#### 5. Deploy

```bash
netlify deploy --prod
```

## 🗄 Database Setup

### Option 1: Vercel Postgres

1. Go to your Vercel project
2. Navigate to "Storage" tab
3. Click "Create Database" → "Postgres"
4. Copy the connection string
5. Run schema:

```bash
# Install psql if needed
brew install postgresql  # macOS
apt-get install postgresql-client  # Linux

# Connect and run schema
psql "your-connection-string" -f backend/schema.sql
```

### Option 2: Supabase

1. Create account at [Supabase](https://supabase.com)
2. Create new project
3. Go to "Database" → "Connection string"
4. Copy connection string
5. Enable pgvector:

```sql
-- In Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS vector;
```

6. Run schema:

```bash
psql "your-supabase-connection-string" -f backend/schema.sql
```

### Option 3: Railway

1. Add PostgreSQL to Railway project (see Railway deployment above)
2. Get connection string from Railway dashboard
3. Connect and run schema:

```bash
railway run psql -f schema.sql
```

### Option 4: Self-Hosted PostgreSQL

```bash
# Install PostgreSQL with pgvector
# Ubuntu/Debian
sudo apt-get install postgresql-14 postgresql-14-pgvector

# macOS
brew install postgresql@14
brew install pgvector

# Create database
createdb doc_generator_db

# Run schema
psql -d doc_generator_db -f backend/schema.sql
```

## 🔐 Environment Variables

### Backend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@host:5432/db` |
| `SECRET_KEY` | JWT secret key | Yes | Generate with `python generate_secret_key.py` |
| `OPENAI_API_KEY` | OpenAI API key | Yes | `sk-...` |
| `OPENAI_BASE_URL` | API endpoint | No | `https://api.openai.com/v1` |
| `OPENAI_MODEL` | Chat model | No | `gpt-4` |
| `OPENAI_EMBEDDING_MODEL` | Embedding model | No | `text-embedding-3-small` |

### Frontend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | Yes | `https://backend-hackaton-v2.vercel.app` |

### Generating Secret Key

```bash
cd backend
python generate_secret_key.py
```

Copy the output and use it as `SECRET_KEY`.

## ✅ Post-Deployment

### 1. Verify Backend Health

```bash
curl https://your-backend-url.vercel.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-05-16T10:00:00Z"
}
```

### 2. Test API Endpoints

```bash
# Register user
curl -X POST https://your-backend-url.vercel.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","full_name":"Test User"}'

# Login
curl -X POST https://your-backend-url.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

### 3. Test Frontend

1. Visit your frontend URL
2. Register a new account
3. Create a project
4. Upload a document
5. Process through the pipeline
6. Verify diagrams and proposal generation
7. Test chat functionality

### 4. Update CORS Settings

If frontend and backend are on different domains, ensure CORS is configured:

In `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.vercel.app",
        "http://localhost:3000"  # For development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Redeploy backend after changes.

## 📊 Monitoring

### Vercel Analytics

1. Enable Vercel Analytics in project settings
2. Monitor:
   - Request counts
   - Response times
   - Error rates
   - Geographic distribution

### Application Logs

**Vercel:**
```bash
vercel logs your-project-name
```

**Railway:**
```bash
railway logs
```

**Docker:**
```bash
docker-compose logs -f backend
```

### Database Monitoring

Monitor:
- Connection pool usage
- Query performance
- Storage usage
- Backup status

### Error Tracking

Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay
- [Datadog](https://www.datadoghq.com) for APM

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Errors**
```
Error: could not connect to server
```
Solution:
- Verify `DATABASE_URL` is correct
- Check database is running
- Verify network connectivity
- Check firewall rules

**OpenAI API Errors**
```
Error: 401 Unauthorized
```
Solution:
- Verify `OPENAI_API_KEY` is valid
- Check API key has sufficient credits
- Verify `OPENAI_BASE_URL` is correct

**Import Errors**
```
ModuleNotFoundError: No module named 'fastapi'
```
Solution:
- Ensure `requirements.txt` is complete
- Verify build command installs dependencies
- Check Python version compatibility

### Frontend Issues

**API Connection Errors**
```
Failed to fetch
```
Solution:
- Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- Check backend is running
- Verify CORS settings
- Check network connectivity

**Build Errors**
```
Error: Cannot find module
```
Solution:
- Run `npm install` locally
- Verify `package.json` is complete
- Check Node.js version compatibility
- Clear `.next` cache

**Environment Variables Not Loading**
```
undefined
```
Solution:
- Ensure variable starts with `NEXT_PUBLIC_`
- Redeploy after adding variables
- Check variable is set in deployment platform
- Clear browser cache

### Database Issues

**pgvector Extension Missing**
```
ERROR: type "vector" does not exist
```
Solution:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

**Schema Not Applied**
```
ERROR: relation "users" does not exist
```
Solution:
```bash
psql "your-connection-string" -f backend/schema.sql
```

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./backend

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_FRONTEND }}
          working-directory: ./frontend
```

## 📝 Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] Database schema applied
- [ ] pgvector extension enabled
- [ ] Secret key generated and set
- [ ] OpenAI API key valid and funded
- [ ] CORS settings configured
- [ ] Frontend points to correct backend URL
- [ ] SSL/TLS certificates configured
- [ ] Error tracking setup
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Test user account created
- [ ] All features tested in production

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Netlify Documentation](https://docs.netlify.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgvector Documentation](https://github.com/pgvector/pgvector)

---

**Need Help?**

1. Check the troubleshooting section above
2. Review platform-specific documentation
3. Check application logs
4. Verify environment variables
5. Test locally first

**Deployment Support:**
- Backend: Already deployed at `https://backend-hackaton-v2.vercel.app`
- Frontend: Follow Vercel deployment steps above
- Database: Use Vercel Postgres or Supabase for easiest setup