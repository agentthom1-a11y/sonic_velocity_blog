# 🚀 Langkah-Langkah Deploy ke Hostinger

**Package:** `sonicvelo-hostinger-deploy.zip` (358.45 MB)  
**Status:** ✅ Siap Upload

---

## 📋 Langkah 1: Upload ke Hostinger

### Via File Manager (Paling Mudah)

1. **Login ke Hostinger**
   - Buka: https://hpanel.hostinger.com
   - Login dengan akun Anda

2. **Buka File Manager**
   - Di dashboard, klik **File Manager**
   - Atau cari "File Manager" di menu

3. **Navigate ke Folder**
   - Masuk ke folder `public_html`
   - Atau folder tempat Anda ingin deploy

4. **Upload File**
   - Klik tombol **Upload** di toolbar
   - Pilih file: `sonicvelo-hostinger-deploy.zip`
   - Tunggu sampai upload selesai (358 MB)
   - Progress bar akan muncul

5. **Extract File**
   - Setelah upload selesai, klik kanan pada file zip
   - Pilih **Extract**
   - Pilih lokasi extract (biasanya current folder)
   - Klik **Extract**
   - Tunggu proses extract selesai

---

## 📋 Langkah 2: Konfigurasi di Server

### Via SSH Terminal (Di Hostinger)

1. **Buka SSH Terminal**
   - Di Hostinger dashboard, cari **SSH Access**
   - Atau buka **Advanced → SSH Access**
   - Klik **Open SSH Terminal** (browser-based)

2. **Navigate ke Folder**
   ```bash
   cd public_html
   # atau
   cd domains/yourdomain.com/public_html
   ```

3. **Cek File**
   ```bash
   ls -la
   ```
   Pastikan ada folder: `.next`, `app`, `lib`, `public`, `data`, dll

4. **Update Environment Variables**
   ```bash
   nano .env.local
   ```
   
   **Update baris berikut:**
   ```env
   # Ganti dengan domain Anda
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   
   # Biarkan * untuk allow all origins
   ALLOWED_ORIGIN=*
   
   # Ganti password admin
   ADMIN_PASSWORD=your-secure-password-here
   
   # Generate secret baru (lihat cara di bawah)
   SESSION_SECRET=paste-generated-secret-here
   ```
   
   **Simpan:** Tekan `Ctrl+X`, lalu `Y`, lalu `Enter`

5. **Generate Production Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy hasilnya dan paste ke `SESSION_SECRET` di `.env.local`

6. **Install Dependencies**
   ```bash
   npm install --production
   ```
   Tunggu sampai selesai (bisa 2-5 menit)

7. **Setup PM2 (Process Manager)**
   ```bash
   # Install PM2 global
   npm install -g pm2
   
   # Start aplikasi
   pm2 start server.js --name sonicvelo-blog
   
   # Save konfigurasi
   pm2 save
   
   # Setup auto-restart saat server reboot
   pm2 startup
   ```
   
   **PENTING:** Copy dan jalankan command yang muncul setelah `pm2 startup`

8. **Cek Status**
   ```bash
   pm2 status
   ```
   Pastikan status: **online** ✅

---

## 📋 Langkah 3: Test Deployment

### 1. Test Health Check

```bash
curl https://yourdomain.com/api/health
```

**Expected response:**
```json
{"ok":true,"service":"sonicvelo-blog","time":"..."}
```

### 2. Test Admin Login

Buka browser:
```
https://yourdomain.com/en/admin/login
```

Login dengan:
- Email: `admin@velocity.ai` (atau yang di .env.local)
- Password: Yang Anda set di `ADMIN_PASSWORD`

### 3. Test API

```bash
curl -X POST https://yourdomain.com/api/internal/ai/transmissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer svk_e13876d2b4f4c5e4dadc2cb4a06b6a6ef931d25f" \
  -d '{
    "title": "First Production Post",
    "excerpt": "This is my first post on production",
    "content_markdown": "# Hello Production!\n\nWelcome to my blog!"
  }'
```

### 4. View Blog

```
https://yourdomain.com/en/transmissions
```

---

## 🔧 Troubleshooting

### Aplikasi Tidak Jalan

**Cek logs:**
```bash
pm2 logs sonicvelo-blog
```

**Restart aplikasi:**
```bash
pm2 restart sonicvelo-blog
```

### Port Sudah Dipakai

**Cek proses yang pakai port 3000:**
```bash
lsof -i :3000
```

**Kill proses:**
```bash
kill -9 PID
```

### Database Error

**Cek permissions:**
```bash
chmod 644 data/cms.db
chmod 755 data
```

### Node.js Version

**Cek version:**
```bash
node --version
```

Harus **v18 atau lebih tinggi**

**Update Node.js (jika perlu):**
```bash
nvm install 18
nvm use 18
```

---

## 📊 Monitoring

### Cek Status Aplikasi

```bash
pm2 status
```

### Lihat Logs

```bash
# Semua logs
pm2 logs sonicvelo-blog

# 100 baris terakhir
pm2 logs sonicvelo-blog --lines 100

# Real-time logs
pm2 logs sonicvelo-blog --lines 0
```

### Restart Aplikasi

```bash
pm2 restart sonicvelo-blog
```

### Stop Aplikasi

```bash
pm2 stop sonicvelo-blog
```

### Start Aplikasi

```bash
pm2 start sonicvelo-blog
```

---

## 🔒 Security Checklist

Setelah deploy:

- [ ] Ganti `ADMIN_PASSWORD` di `.env.local`
- [ ] Generate `SESSION_SECRET` baru
- [ ] Enable HTTPS/SSL di Hostinger
- [ ] Force HTTPS redirect
- [ ] Backup database: `cp data/cms.db data/cms.db.backup`
- [ ] Setup cron job untuk backup otomatis
- [ ] Monitor logs secara berkala
- [ ] Update dependencies secara berkala

---

## 📞 Bantuan

### Jika Ada Masalah

1. **Cek logs:** `pm2 logs sonicvelo-blog`
2. **Cek status:** `pm2 status`
3. **Restart:** `pm2 restart sonicvelo-blog`
4. **Baca dokumentasi:** `DEPLOYMENT_GUIDE.md`

### Hostinger Support

- **Website:** https://www.hostinger.com/support
- **Live Chat:** Available 24/7
- **Knowledge Base:** https://support.hostinger.com

---

## ✅ Checklist Deployment

### Pre-Upload
- [x] Production build complete
- [x] Database cleaned
- [x] Deployment package created (358.45 MB)
- [x] Documentation ready

### Upload & Extract
- [ ] Login ke Hostinger
- [ ] Upload sonicvelo-hostinger-deploy.zip
- [ ] Extract file di public_html

### Configuration
- [ ] Update NEXT_PUBLIC_SITE_URL
- [ ] Update ADMIN_PASSWORD
- [ ] Generate & update SESSION_SECRET
- [ ] Install dependencies
- [ ] Setup PM2

### Testing
- [ ] Test health check
- [ ] Test admin login
- [ ] Test API post creation
- [ ] View blog posts
- [ ] Test from external server

### Post-Deployment
- [ ] Enable HTTPS
- [ ] Setup backups
- [ ] Monitor logs
- [ ] Create production API keys

---

## 🎉 Selesai!

Setelah semua langkah di atas, aplikasi Anda akan:
- ✅ Running di production
- ✅ Accessible dari internet
- ✅ API working dari any server
- ✅ Auto-restart jika server reboot
- ✅ Monitored by PM2

**Selamat! Blog Anda sudah live! 🚀**

---

**File Package:** `sonicvelo-hostinger-deploy.zip`  
**Ukuran:** 358.45 MB  
**Lokasi:** `D:\saas\sonicvelo\blog\`  
**Status:** ✅ Ready to Upload
