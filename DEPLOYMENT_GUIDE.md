# 🚀 SonicVelo Blog - Hostinger Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] Local API tests passed
- [x] Production build successful
- [x] Database initialized with test data
- [x] API keys configured
- [x] Environment variables set

## 📊 Test Results Summary

### Local Tests - ALL PASSED ✅
- Health Check API: ✅ Working
- Create Post API: ✅ Working (Post ID: 18 created)
- List Posts API: ✅ Working
- Authentication: ✅ Working
- Auto-publish: ✅ Working

### Build Status
- Next.js Build: ✅ Success (Turbopack)
- TypeScript: ✅ Compiled (13.2s)
- Static Pages: ✅ Generated (260 pages)
- API Routes: ✅ All routes registered

## 🎯 Deployment Options

### Option 1: Quick Deploy (Recommended for Testing)

1. **Create deployment package:**
   ```bash
   # Build production
   npm run build
   
   # Create zip manually or use PowerShell
   Compress-Archive -Path .next,app,lib,public,data,package.json,server.js,.env.local,node_modules -DestinationPath sonicvelo-deploy.zip
   ```

2. **Upload to Hostinger:**
   - Login to Hostinger File Manager
   - Navigate to `public_html` or your app directory
   - Upload `sonicvelo-deploy.zip`
   - Extract the zip file

3. **Configure on Hostinger:**
   ```bash
   # SSH into Hostinger
   ssh your-username@your-domain.com
   
   # Navigate to app directory
   cd /home/your-username/public_html
   
   # Install production dependencies (if needed)
   npm install --production
   
   # Start the app
   npm start
   ```

### Option 2: Git Deployment (Recommended for Production)

1. **Initialize Git (if not already):**
   ```bash
   git init
   git add .
   git commit -m "Production ready build"
   ```

2. **Push to repository:**
   ```bash
   git remote add origin your-git-repo-url
   git push -u origin main
   ```

3. **Deploy on Hostinger:**
   ```bash
   # SSH into Hostinger
   ssh your-username@your-domain.com
   
   # Clone or pull
   cd /home/your-username/public_html
   git clone your-git-repo-url .
   # OR if already cloned:
   git pull origin main
   
   # Install and build
   npm install --production
   npm run build
   
   # Start with PM2
   npm install -g pm2
   pm2 start server.js --name sonicvelo-blog
   pm2 save
   pm2 startup
   ```

### Option 3: FTP/SFTP Upload

1. **Use FTP client (FileZilla, WinSCP, etc.)**
2. **Upload these directories:**
   - `.next/` (production build)
   - `app/` (application code)
   - `lib/` (libraries)
   - `public/` (static assets)
   - `data/` (database)
   - `package.json`
   - `server.js`
   - `.env.local`

3. **Connect via SSH and start:**
   ```bash
   cd /home/your-username/public_html
   npm install --production
   npm start
   ```

## 🔧 Production Configuration

### 1. Update Environment Variables

Edit `.env.local` on Hostinger with production values:

```env
# Admin Credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-production-password

# Session Secret (generate new one for production)
SESSION_SECRET=your-production-secret-key-here

# Database
DATABASE_URL=file:./data/cms.db

# Site URL (IMPORTANT: Update to your domain)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# CORS
ALLOWED_ORIGIN=https://yourdomain.com

# SMTP (if using email)
SMTP_HOST=your-smtp-host
SMTP_PORT=465
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-email-password
```

### 2. Generate Production Session Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Create Production API Keys

After deployment, visit:
```
https://yourdomain.com/en/admin/login
```

Login and go to:
```
https://yourdomain.com/en/admin/settings/api-keys
```

Create new API keys with appropriate scopes.

### 4. Database Permissions

```bash
# Ensure database is writable
chmod 644 data/cms.db
chmod 755 data
```

### 5. Setup Process Manager (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Start app
pm2 start server.js --name sonicvelo-blog

# Save PM2 configuration
pm2 save

# Setup auto-restart on reboot
pm2 startup

# Monitor
pm2 status
pm2 logs sonicvelo-blog
```

## 🧪 Post-Deployment Testing

### 1. Health Check
```bash
curl https://yourdomain.com/api/health
```

Expected response:
```json
{
  "ok": true,
  "service": "sonicvelo-blog",
  "time": "2026-05-16T..."
}
```

### 2. Test Post Creation
```bash
curl -X POST https://yourdomain.com/api/internal/ai/transmissions \
  -H "Authorization: Bearer YOUR_PRODUCTION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Production Test Post",
    "excerpt": "Testing production deployment",
    "content_markdown": "# Test\n\nThis is a test post.",
    "category": "Technology",
    "tags": ["test"],
    "status": "draft"
  }'
```

### 3. Access Admin Panel
```
https://yourdomain.com/en/admin/login
```

### 4. View Published Posts
```
https://yourdomain.com/en/transmissions
```

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Generate new SESSION_SECRET for production
- [ ] Enable HTTPS/SSL in Hostinger
- [ ] Configure firewall rules
- [ ] Set proper file permissions (644 for files, 755 for directories)
- [ ] Disable directory listing
- [ ] Keep API keys secure (never commit to git)
- [ ] Regular database backups

## 📈 Performance Optimization

### 1. Enable Caching
In Hostinger control panel:
- Enable browser caching
- Enable server-side caching
- Configure CDN if available

### 2. Optimize Images
- Use WebP format
- Implement lazy loading
- Use Next.js Image optimization

### 3. Database Optimization
```bash
# Vacuum database periodically
sqlite3 data/cms.db "VACUUM;"
```

## 🐛 Troubleshooting

### App Not Starting
```bash
# Check Node.js version
node --version  # Should be 18+

# Check logs
pm2 logs sonicvelo-blog

# Restart app
pm2 restart sonicvelo-blog
```

### Database Errors
```bash
# Check database exists
ls -la data/cms.db

# Check permissions
chmod 644 data/cms.db

# Check database integrity
sqlite3 data/cms.db "PRAGMA integrity_check;"
```

### API 404 Errors
- Ensure `.next` directory exists
- Verify `npm run build` completed successfully
- Check server.js is running
- Verify environment variables are set

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 PID
```

## 📞 Support Resources

- **Hostinger Support:** https://www.hostinger.com/support
- **Next.js Docs:** https://nextjs.org/docs
- **PM2 Docs:** https://pm2.keymetrics.io/docs

## 📝 Maintenance Tasks

### Daily
- Monitor PM2 status: `pm2 status`
- Check logs: `pm2 logs sonicvelo-blog --lines 100`

### Weekly
- Backup database: `cp data/cms.db data/cms.db.backup.$(date +%Y%m%d)`
- Review error logs
- Check disk space: `df -h`

### Monthly
- Update dependencies: `npm update`
- Vacuum database: `sqlite3 data/cms.db "VACUUM;"`
- Review and rotate API keys
- Security audit

## 🎉 Deployment Complete!

Your SonicVelo Blog is now ready for production on Hostinger!

**Next Steps:**
1. Test all functionality on production
2. Configure domain DNS if needed
3. Set up monitoring and alerts
4. Create content and publish posts
5. Share your blog with the world!

---

**Deployment Date:** 2026-05-16  
**Version:** 1.0.0  
**Status:** ✅ Ready for Production
