# 🚀 Quick Start - Deploy to Hostinger

## ⚡ Fast Track Deployment (5 Minutes)

### Step 1: Create Deployment Package
```bash
deploy.bat
```

This will:
- ✅ Build production bundle
- ✅ Create `sonicvelo-deploy.zip`
- ✅ Show next steps

### Step 2: Upload to Hostinger

**Via File Manager:**
1. Login to Hostinger: https://hpanel.hostinger.com
2. Open File Manager
3. Navigate to `public_html`
4. Upload `sonicvelo-deploy.zip`
5. Right-click → Extract

**Via FTP:**
1. Connect with FileZilla/WinSCP
2. Upload `sonicvelo-deploy.zip`
3. Extract via File Manager

### Step 3: Configure & Start

**SSH into Hostinger:**
```bash
ssh your-username@your-domain.com
cd /home/your-username/public_html

# Update environment
nano .env.local
# Change:
# - NEXT_PUBLIC_SITE_URL=https://yourdomain.com
# - ALLOWED_ORIGIN=https://yourdomain.com
# - ADMIN_PASSWORD=your-secure-password

# Install dependencies (if needed)
npm install --production

# Start the app
npm start

# OR use PM2 for production
npm install -g pm2
pm2 start server.js --name sonicvelo-blog
pm2 save
pm2 startup
```

### Step 4: Test

```bash
# Health check
curl https://yourdomain.com/api/health

# Visit admin
https://yourdomain.com/en/admin/login

# View posts
https://yourdomain.com/en/transmissions
```

---

## 🎯 That's It!

Your blog is now live on Hostinger!

**For detailed instructions, see:** `DEPLOYMENT_GUIDE.md`  
**For test results, see:** `TEST_RESULTS.md`  
**For complete summary, see:** `DEPLOYMENT_SUMMARY.md`

---

## 🆘 Quick Troubleshooting

**App not starting?**
```bash
pm2 logs sonicvelo-blog
```

**Database errors?**
```bash
chmod 644 data/cms.db
```

**Port in use?**
```bash
pm2 restart sonicvelo-blog
```

---

**Need help?** Check `DEPLOYMENT_GUIDE.md` for detailed troubleshooting.
