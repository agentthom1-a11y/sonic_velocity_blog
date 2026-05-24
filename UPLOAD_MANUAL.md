# 🚀 Upload Manual ke Hostinger (Cara Tercepat)

**Kenapa Manual?**
- Hostinger API sedang down (Error 530)
- Disk space terbatas untuk MCP
- Upload manual lebih reliable dan cepat

---

## 📦 File yang Sudah Siap

**File:** `sonicvelo-hostinger-deploy.zip`  
**Ukuran:** 358.45 MB  
**Lokasi:** `D:\saas\sonicvelo\blog\`

---

## 🚀 Langkah Upload (5 Menit)

### 1. Login ke Hostinger (1 menit)

1. Buka browser
2. Ke: **https://hpanel.hostinger.com**
3. Login dengan akun Anda
4. Pilih hosting account Anda

### 2. Buka File Manager (30 detik)

1. Di dashboard, cari **"File Manager"**
2. Klik untuk membuka
3. Navigate ke folder **`public_html`**
   - Atau folder domain Anda: `domains/yourdomain.com/public_html`

### 3. Upload File (2-3 menit)

1. Klik tombol **"Upload"** di toolbar atas
2. Klik **"Select Files"** atau drag & drop
3. Pilih file: `sonicvelo-hostinger-deploy.zip`
4. Tunggu progress bar sampai 100%
   - 358 MB akan memakan waktu 2-3 menit tergantung koneksi
5. Setelah selesai, klik **"Back to ..."** untuk kembali ke File Manager

### 4. Extract File (1 menit)

1. Cari file `sonicvelo-hostinger-deploy.zip` di File Manager
2. **Klik kanan** pada file tersebut
3. Pilih **"Extract"**
4. Pilih destination (biasanya current folder)
5. Klik **"Extract"**
6. Tunggu sampai selesai
7. Setelah selesai, Anda akan melihat folder: `.next`, `app`, `lib`, `public`, `data`, dll

### 5. Setup via SSH (1 menit)

1. Di Hostinger dashboard, cari **"SSH Access"**
2. Klik **"Open SSH Terminal"** (browser-based)
3. Jalankan commands berikut:

```bash
# Navigate ke folder
cd public_html

# Cek file
ls -la

# Update .env.local
nano .env.local
```

**Edit baris berikut di .env.local:**
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
ADMIN_PASSWORD=your-secure-password
```

**Simpan:** `Ctrl+X`, lalu `Y`, lalu `Enter`

```bash
# Generate secret baru
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy hasil dan paste ke `SESSION_SECRET` di `.env.local`

```bash
# Install dependencies
npm install --production

# Start dengan PM2
npm install -g pm2
pm2 start server.js --name sonicvelo-blog
pm2 save
pm2 startup
```

Copy dan jalankan command yang muncul setelah `pm2 startup`

---

## ✅ Verifikasi

### Test 1: Cek Status
```bash
pm2 status
```
Harus muncul: **online** ✅

### Test 2: Health Check
```bash
curl https://yourdomain.com/api/health
```

### Test 3: Admin Login
Buka browser: `https://yourdomain.com/en/admin/login`

### Test 4: Blog
Buka: `https://yourdomain.com/en/transmissions`

---

## 🎯 Selesai!

Aplikasi Anda sekarang:
- ✅ Running di production
- ✅ Accessible dari internet
- ✅ API working
- ✅ Auto-restart enabled

---

## 📞 Jika Ada Masalah

**Cek logs:**
```bash
pm2 logs sonicvelo-blog
```

**Restart:**
```bash
pm2 restart sonicvelo-blog
```

**Stop:**
```bash
pm2 stop sonicvelo-blog
```

---

## 🔑 API Key Anda

```
svk_e13876d2b4f4c5e4dadc2cb4a06b6a6ef931d25f
```

Gunakan untuk post via API setelah deploy!

---

**Total Waktu:** ~5-7 menit  
**Kesulitan:** ⭐⭐ (Mudah)  
**Status:** ✅ Ready to Upload

**Good luck! 🚀**
