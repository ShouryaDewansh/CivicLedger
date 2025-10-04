# CivicLedger Deployment Guide

## 🚀 Quick Start (Both Servers)

### Automatic Startup
```bash
./start-fullstack.sh
```

### Manual Startup

**Backend (Terminal 1):**
```bash
cd CivicLedger
npm install
npm run dev
# Runs on http://localhost:4000
```

**Frontend (Terminal 2):**
```bash
cd ledger-witness-hub
npm install  
npm run dev
# Runs on http://localhost:8080
```

---

## 🐳 Docker Deployment

### Build and Run
```bash
docker compose up -d
```

### Stop
```bash
docker compose down
```

### View Logs
```bash
docker compose logs -f
```

---

## ☁️ Cloud Deployment

### Backend (Railway / Render / Heroku)

1. Create new project
2. Connect GitHub repository
3. Set environment variables:
   ```
   PORT=4000
   NODE_ENV=production
   ```
4. Deploy!

### Frontend (Vercel / Netlify)

1. Create new project
2. Connect GitHub repository  
3. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   ```
5. Deploy!

---

## 🔧 Environment Variables

### Backend `.env`
```bash
PORT=4000
DB_PATH=./civicledger.db
NODE_ENV=production
IPFS_URL=https://ipfs.infura.io:5001/api/v0  # Optional
```

### Frontend
Update `src/utils/api.ts`:
```typescript
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
```

---

## 📊 Production Checklist

### Backend
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper database path
- [ ] Set up persistent key storage
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Set up monitoring
- [ ] Configure backups

### Frontend
- [ ] Update API_BASE_URL to production backend
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Add analytics (optional)
- [ ] Test on multiple browsers
- [ ] Optimize bundle size

---

## 🔒 Security Hardening

### Backend
1. Add authentication:
   ```bash
   npm install jsonwebtoken bcrypt
   ```

2. Add rate limiting:
   ```bash
   npm install express-rate-limit
   ```

3. Add helmet for security headers:
   ```bash
   npm install helmet
   ```

### Frontend
1. Implement user authentication
2. Add CAPTCHA for vote submission
3. Validate all user inputs
4. Use HTTPS only

---

## 📈 Monitoring

### Backend Health Check
```bash
curl https://your-backend.com/api/health
```

### Frontend Health Check
```bash
curl https://your-frontend.com
```

---

## 🔄 Updates

### Update Backend
```bash
cd CivicLedger
git pull
npm install
npm start
```

### Update Frontend
```bash
cd ledger-witness-hub
git pull
npm install
npm run build
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port is in use
lsof -i :4000

# Kill process
kill -9 $(lsof -ti:4000)
```

### Frontend won't build
```bash
# Clear cache
rm -rf node_modules .vite
npm install
npm run dev
```

### Database errors
```bash
# Reset database (⚠️ deletes all data)
rm civicledger.db*
# Restart server (will recreate tables)
```

---

## 📞 Support

For issues, check:
1. README.md
2. _archive/ folder for detailed docs
3. GitHub Issues

