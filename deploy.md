# RTRWH Deployment Guide

## Quick Deploy Options

### 1. Vercel (Recommended for Frontend + API)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from root directory
vercel

# Follow prompts:
# - Framework: Other
# - Build Command: cd frontend && npm run build
# - Output Directory: frontend/build
# - Install Command: cd frontend && npm install
```

**Vercel Configuration:**
- Create `vercel.json` in root (see below)
- Supports both frontend and serverless API
- Free tier available

### 2. Railway (Full-Stack Deployment)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### 3. Render (Free Tier Available)
- Go to https://render.com
- Connect your GitHub repo
- Create Web Service for frontend
- Create Web Service for backend
- Set environment variables

### 4. Netlify (Frontend) + Railway/Render (Backend)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy frontend
cd frontend
npm run build
netlify deploy --prod --dir=build
```

## Configuration Files

### For Vercel (Full-Stack)
Create `vercel.json` in root directory with API routes and frontend build settings.

### For Docker Deployment
Create `Dockerfile` for containerized deployment on any platform.

### For GitHub Actions CI/CD
Create `.github/workflows/deploy.yml` for automated deployment.

## Environment Variables Needed
- `API_BASE_URL`: Backend API URL
- `NODE_ENV`: production
- `PORT`: Server port (usually auto-set by platform)

## Post-Deployment Checklist
- [ ] Frontend loads correctly
- [ ] API endpoints respond
- [ ] CORS configured for production domain
- [ ] Database initialized
- [ ] Environment variables set
- [ ] Custom domain configured (optional)

Choose your preferred deployment method and I'll help you set it up!