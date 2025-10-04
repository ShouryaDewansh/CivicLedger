# 🚀 CivicLedger Deployment Guide

Complete guide to deploy CivicLedger to production for **FREE**!

---

## 📋 Deployment Overview

- **Backend**: Railway.app (Free tier - $5/month credit)
- **Frontend**: Vercel (Free forever for personal projects)
- **Total Cost**: $0/month

---

## 🔧 Step 1: Deploy Backend to Railway

### Prerequisites
- GitHub account (you already have this!)
- Railway account (sign up with GitHub)

### Steps:

1. **Go to Railway.app**
   - Visit: https://railway.app
   - Click "Login with GitHub"
   - Authorize Railway

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose: `ShouryaDewansh/CivicLedger`
   - Railway will auto-detect Node.js

3. **Configure Settings**
   - Root directory: `/` (leave as default)
   - Build command: `npm install`
   - Start command: `npm start` (already in package.json)

4. **Add Environment Variables**
   Click "Variables" tab and add:
   ```
   PORT=4000
   NODE_ENV=production
   DB_PATH=./civicledger.db
   ```

5. **Generate Domain**
   - Go to "Settings" tab
   - Click "Generate Domain"
   - Copy the URL (e.g., `civicledger-production.up.railway.app`)
   - **Save this URL!** You'll need it for frontend

6. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Check logs for "🚀 CivicLedger API running"

7. **Test Backend**
   ```bash
   curl https://your-railway-url.up.railway.app/api/health
   # Should return: {"status":"ok","uptime":123}
   ```

✅ **Backend deployed!**

---

## 🎨 Step 2: Deploy Frontend to Vercel

### Prerequisites
- GitHub account ✅
- Vercel account (sign up with GitHub)

### Steps:

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Click "Sign Up" → "Continue with GitHub"

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import `ShouryaDewansh/CivicLedger`
   - Click "Import"

3. **Configure Build Settings**
   - Framework Preset: `Vite`
   - Root Directory: Click "Edit" → Enter `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variable**
   Click "Environment Variables" and add:
   ```
   Name: VITE_API_BASE_URL
   Value: https://your-railway-url.up.railway.app/api
   ```
   (Use the Railway URL from Step 1.5)

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Vercel will show you the live URL

6. **Test Frontend**
   - Visit your Vercel URL (e.g., `civicledger.vercel.app`)
   - You should see the CivicLedger home page
   - Try creating a poll and voting!

✅ **Frontend deployed!**

---

## 🔗 Step 3: Update Frontend API URL

The frontend needs to know where the backend is. Update this file:

**File**: `frontend/src/utils/api.ts`

Change:
```typescript
const API_BASE_URL = 'http://localhost:4000/api';
```

To:
```typescript
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://your-railway-url.up.railway.app/api';
```

Then commit and push:
```bash
git add frontend/src/utils/api.ts
git commit -m "Update API URL for production"
git push origin main
```

Vercel will auto-deploy the update!

---

## 🔐 Step 4: Configure CORS (Backend)

The backend needs to allow requests from your Vercel domain.

**File**: `src/server.js`

Find the CORS section and update:
```javascript
app.use(cors({
  origin: [
    'http://localhost:8080',
    'https://civicledger.vercel.app',  // Your Vercel URL
    'https://your-custom-domain.com'    // If you have one
  ]
}));
```

Commit and push:
```bash
git add src/server.js
git commit -m "Configure CORS for production frontend"
git push origin main
```

Railway will auto-deploy!

---

## ✅ Verification Checklist

### Backend (Railway)
- [ ] Deployed successfully
- [ ] Domain generated
- [ ] Environment variables set
- [ ] Health check works: `curl https://your-url.railway.app/api/health`
- [ ] Can create poll via Postman/curl

### Frontend (Vercel)
- [ ] Deployed successfully
- [ ] Domain generated (e.g., `civicledger.vercel.app`)
- [ ] Environment variable `VITE_API_BASE_URL` set
- [ ] Home page loads
- [ ] Can create poll
- [ ] Can cast vote
- [ ] Receipts verify correctly

### Integration
- [ ] Frontend can reach backend
- [ ] No CORS errors in console
- [ ] Votes work end-to-end
- [ ] Receipts show "✅ Verified"

---

## 🎯 Your Live URLs

Once deployed, you'll have:

```
Frontend: https://civicledger.vercel.app
Backend:  https://civicledger-production.up.railway.app/api
```

Add these to your README.md!

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Railway build fails
```
Solution:
1. Check logs in Railway dashboard
2. Ensure package.json has "start": "node src/server.js"
3. Check Node version matches (18+)
```

**Problem**: Database not persisting
```
Solution:
1. Railway uses ephemeral storage
2. For production, use PostgreSQL or external DB
3. Or accept that DB resets on deploy
```

**Problem**: Port already in use
```
Solution:
Railway sets PORT automatically, your code already handles this:
process.env.PORT || 4000
```

### Frontend Issues

**Problem**: Vercel build fails
```
Solution:
1. Ensure Root Directory is set to "frontend"
2. Check build logs
3. Make sure all dependencies are in package.json
```

**Problem**: API calls fail (CORS error)
```
Solution:
1. Check backend CORS settings
2. Ensure VITE_API_BASE_URL is set correctly
3. Check browser console for exact error
```

**Problem**: Environment variable not working
```
Solution:
1. Vercel env vars need VITE_ prefix
2. Redeploy after adding env vars
3. Check it's using production value: console.log(process.env.VITE_API_BASE_URL)
```

---

## 🚀 Advanced: Custom Domains

### Frontend (Vercel)
1. Go to Project Settings → Domains
2. Add your domain (e.g., `vote.yourdomain.com`)
3. Update DNS records as instructed
4. Vercel auto-configures HTTPS

### Backend (Railway)
1. Go to Settings → Domains
2. Add custom domain
3. Update DNS CNAME record
4. Update frontend to use new backend URL

---

## 💰 Cost Breakdown

### Free Tier Limits

**Railway:**
- $5/month credit (free)
- ~500 hours/month runtime
- 100 GB bandwidth
- 1 GB RAM
- Perfect for hackathons/demos

**Vercel:**
- Unlimited deployments
- 100 GB bandwidth/month
- Auto HTTPS
- Global CDN
- Free forever for personal projects

**Total**: $0/month for demo/hackathon use! 🎉

---

## 📈 Monitoring

### Railway Dashboard
- View logs: Click "Logs" tab
- Monitor resources: Click "Metrics"
- Set up alerts: Settings → Notifications

### Vercel Analytics
- Free analytics included
- View traffic: Project → Analytics
- See deployment status: Deployments tab

---

## 🔄 Auto-Deployment

Both platforms auto-deploy on `git push`:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Railway auto-deploys backend (2-3 min)
# Vercel auto-deploys frontend (1-2 min)
```

---

## 🎓 Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Deploy frontend to Vercel
3. ✅ Test end-to-end
4. 📱 Share your live URLs
5. 🎉 Demo your app!

### Optional Enhancements:
- Add custom domain
- Set up monitoring
- Add error tracking (Sentry)
- Configure CI/CD
- Add authentication
- Set up database backups

---

## 📞 Support

If you run into issues:

1. Check logs in Railway/Vercel dashboards
2. Review this guide
3. Check GitHub Issues
4. Railway Discord: https://discord.gg/railway
5. Vercel Discord: https://discord.gg/vercel

---

## 🎉 You're Done!

Your CivicLedger app is now:
- ✅ On GitHub (version controlled)
- ✅ Deployed to production (live URL)
- ✅ Auto-deploying (on every push)
- ✅ Free to run (no monthly costs)
- ✅ Ready to demo! 🚀

**Share your URLs with friends and start voting!** 🗳️

