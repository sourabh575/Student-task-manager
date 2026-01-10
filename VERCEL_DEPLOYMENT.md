# Vercel Deployment Guide

## ✅ Steps to Deploy on Vercel

### 1. **Connect GitHub to Vercel**
- Go to https://vercel.com
- Click "Add New..." → "Project"
- Select your GitHub repository
- Click "Import"

### 2. **Configure Build Settings**
- **Framework Preset:** Vite ✅ (Auto-selected)
- **Build Command:** `npm run build` ✅ (Default)
- **Output Directory:** `dist` ✅ (Default)
- **Install Command:** `npm install` ✅ (Default)

### 3. **Set Environment Variables**
In Vercel Dashboard:
1. Go to **Project Settings** → **Environment Variables**
2. Add new variable:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://student-task-manager-backend-wcae.onrender.com/api`
   - **Environments:** Production, Preview, Development
3. Click "Save"

### 4. **Deploy**
- Click "Deploy"
- Wait for build to complete (2-3 minutes)
- Once done, you'll get a live URL

### 5. **Verify Deployment**
- Visit your Vercel URL
- Should see login page
- Test login/signup with your backend

## 🔧 What Was Fixed

✅ **Created vercel.json** - Build configuration for Vercel  
✅ **Updated vite.config.js** - Production build settings  
✅ **Created .env.production** - Production environment variables  
✅ **Backend URL** - Points to Render backend  

## 🚀 Your Deployment URLs

- **Frontend:** Your Vercel URL (will be generated)
- **Backend:** https://student-task-manager-backend-wcae.onrender.com
- **API:** https://student-task-manager-backend-wcae.onrender.com/api

## ❌ Common Issues Fixed

1. **"Just loading" page** → Missing vercel.json configuration
2. **API not working** → Environment variables not set
3. **Build failing** → Vite config needed proper output settings
4. **Slow deployment** → Build optimization added

## 📞 If Still Having Issues

1. Check Vercel Build Logs
2. Verify environment variable is set correctly
3. Test backend is accessible: https://student-task-manager-backend-wcae.onrender.com/api
4. Check browser console for errors (F12)

---

**Your app is now production-ready!** 🎉
