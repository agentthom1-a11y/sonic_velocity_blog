# 🔑 Cara Pakai API Key untuk Post Blog

## API Key Anda

**Lokasi File:** `D:\saas\sonicvelo\blog\agents\deploy\api_key.env`

```
SONICVELO_API_KEY=svk_e13876d2b4f4c5e4dadc2cb4a06b6a6ef931d25f
```

**Scopes (Izin):**
- ✅ write - Buat dan edit post
- ✅ publish - Publish post manual
- ✅ auto_publish - Post otomatis published
- ✅ schedule - Jadwalkan post
- ✅ delete - Hapus post

---

## 🚀 Cara Pakai (Contoh Lengkap)

### 1. Pakai cURL (Command Line)

```bash
curl -X POST http://localhost:3000/api/internal/ai/transmissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer svk_e13876d2b4f4c5e4dadc2cb4a06b6a6ef931d25f" \
  -d '{
    "title": "Judul Post Saya",
    "excerpt": "Ringkasan singkat tentang post ini",
    "content_markdown": "# Konten Post\n\nIsi konten dalam **Markdown**"
  }'
```

### 2. Pakai JavaScript (Browser atau Node.js)

```javascript
const API_KEY = 'svk_e13876d2b4f4c5e4dadc2cb4a06b6a6ef931d25f';
const API_URL = 'http://localhost:3000/api/internal/ai/transmissions';

async function buatPost() {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      title: 'Judul Post Saya',
      excerpt: 'Ringkasan singkat tentang post ini',
      content_markdown: '# Konten Post\n\nIsi konten dalam **Markdown**',
      category: 'Technology',
      tags: ['javascript', 'api']
    })
  });
  
  const data = await response.json();
  console.log('Post berhasil dibuat:', data);
  console.log('URL Preview:', data.preview_url);
}

buatPost();
```

### 3. Pakai Python

```python
import requests

API_KEY = 'svk_e13876d2b4f4c5e4dadc2cb4a06b6a6ef931d25f'
API_URL = 'http://localhost:3000/api/internal/ai/transmissions'

def buat_post():
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {API_KEY}'
    }
    
    data = {
        'title': 'Judul Post Saya',
        'excerpt': 'Ringkasan singkat tentang post ini',
        'content_markdown': '# Konten Post\n\nIsi konten dalam **Markdown**',
        'category': 'Technology',
        'tags': ['python', 'api']
    }
    
    response = requests.post(API_URL, json=data, headers=headers)
    result = response.json()
    
    print('Post berhasil dibuat:', result)
    print('URL Preview:', result['preview_url'])

buat_post()
```

### 4. Pakai PowerShell

```powershell
$API_KEY = "svk_e13876d2b4f4c5e4dadc2cb4a06b6a6ef931d25f"
$API_URL = "http://localhost:3000/api/internal/ai/transmissions"

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $API_KEY"
}

$body = @{
    title = "Judul Post Saya"
    excerpt = "Ringkasan singkat tentang post ini"
    content_markdown = "# Konten Post`n`nIsi konten dalam **Markdown**"
    category = "Technology"
    tags = @("powershell", "api")
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri $API_URL -Method Post -Headers $headers -Body $body

Write-Host "Post berhasil dibuat!"
Write-Host "ID: $($response.id)"
Write-Host "URL Preview: $($response.preview_url)"
```

---

## 📋 Field yang Wajib Diisi

Minimal 3 field ini harus ada:

```json
{
  "title": "Judul post (3-500 karakter)",
  "excerpt": "Ringkasan (10-1000 karakter)",
  "content_markdown": "Konten dalam Markdown (min 20 karakter)"
}
```

## 🎨 Field Opsional (Tambahan)

```json
{
  "category": "Nama kategori",
  "tags": ["tag1", "tag2"],
  "cover_image_url": "https://example.com/gambar.jpg",
  "cover_image_alt": "Deskripsi gambar",
  "seo_title": "Judul SEO",
  "meta_description": "Deskripsi meta untuk SEO",
  "featured": false,
  "status": "draft",
  "author_name": "Nama Penulis"
}
```

---

## 🧪 Test Cepat (Copy-Paste)

### Test 1: Health Check (Tanpa API Key)

```bash
curl http://localhost:3000/api/health
```

**Hasil yang diharapkan:**
```json
{"ok":true,"service":"sonicvelo-blog","time":"..."}
```

### Test 2: Buat Post Sederhana

```bash
curl -X POST http://localhost:3000/api/internal/ai/transmissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer svk_e13876d2b4f4c5e4dadc2cb4a06b6a6ef931d25f" \
  -d '{
    "title": "Test Post dari API",
    "excerpt": "Ini adalah test post untuk mencoba API",
    "content_markdown": "# Hello World\n\nIni adalah post pertama saya via API!"
  }'
```

**Hasil yang diharapkan:**
```json
{
  "id": 23,
  "slug": "test-post-dari-api",
  "status": "published",
  "auto_published": true,
  "preview_url": "http://localhost:3000/en/transmissions/test-post-dari-api",
  "admin_url": "http://localhost:3000/en/admin/transmissions/23"
}
```

---

## 🌐 Untuk Production (Hostinger)

Setelah deploy ke Hostinger, ganti URL:

```javascript
// Development (Local)
const API_URL = 'http://localhost:3000/api/internal/ai/transmissions';

// Production (Hostinger)
const API_URL = 'https://yourdomain.com/api/internal/ai/transmissions';
```

**API Key tetap sama!**

---

## 📱 Contoh Lengkap dengan Semua Field

```javascript
const response = await fetch('http://localhost:3000/api/internal/ai/transmissions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer svk_e13876d2b4f4c5e4dadc2cb4a06b6a6ef931d25f'
  },
  body: JSON.stringify({
    // WAJIB
    title: 'Panduan Lengkap Belajar JavaScript',
    excerpt: 'Pelajari JavaScript dari dasar hingga mahir dengan panduan lengkap ini',
    content_markdown: `# Panduan Lengkap JavaScript

## Pengenalan

JavaScript adalah bahasa pemrograman yang powerful...

## Dasar-dasar

### Variabel
\`\`\`javascript
let nama = "John";
const umur = 25;
\`\`\`

### Function
\`\`\`javascript
function sapa(nama) {
  return \`Halo, \${nama}!\`;
}
\`\`\`

## Kesimpulan

JavaScript adalah bahasa yang wajib dipelajari untuk web development.`,

    // OPSIONAL
    category: 'Programming',
    tags: ['javascript', 'tutorial', 'web-development'],
    cover_image_url: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a',
    cover_image_alt: 'JavaScript code on screen',
    seo_title: 'Panduan Lengkap Belajar JavaScript untuk Pemula',
    meta_description: 'Tutorial JavaScript lengkap dari dasar hingga mahir. Pelajari variabel, function, dan konsep penting lainnya.',
    featured: true,
    author_name: 'John Doe',
    source_type: 'manual'
  })
});

const data = await response.json();
console.log('✅ Post berhasil dibuat!');
console.log('📝 ID:', data.id);
console.log('🔗 URL:', data.preview_url);
```

---

## 🔒 Keamanan API Key

**PENTING:**
- ❌ Jangan commit API key ke Git
- ❌ Jangan share API key di public
- ✅ Simpan di environment variable
- ✅ Gunakan file `.env` yang di-gitignore
- ✅ Buat API key berbeda untuk production

---

## 🆘 Troubleshooting

### Error 401 Unauthorized
**Masalah:** API key salah atau tidak ada  
**Solusi:** Pastikan format: `Authorization: Bearer svk_...`

### Error 422 Validation Failed
**Masalah:** Field wajib tidak lengkap  
**Solusi:** Pastikan ada `title`, `excerpt`, dan `content_markdown`

### Error CORS
**Masalah:** Request dari origin yang tidak diizinkan  
**Solusi:** API sudah support CORS untuk semua origin (*)

---

## 📞 Bantuan

- **Dokumentasi Lengkap:** `API_DOCUMENTATION.md`
- **Quick Start:** `API_QUICK_START.md`
- **Test Page:** Buka `test-real-world.html` di browser

---

## ✅ Ringkasan

**API Key Anda:**
```
svk_e13876d2b4f4c5e4dadc2cb4a06b6a6ef931d25f
```

**Endpoint:**
```
POST http://localhost:3000/api/internal/ai/transmissions
```

**Header:**
```
Content-Type: application/json
Authorization: Bearer svk_e13876d2b4f4c5e4dadc2cb4a06b6a6ef931d25f
```

**Minimal Body:**
```json
{
  "title": "Judul",
  "excerpt": "Ringkasan",
  "content_markdown": "# Konten"
}
```

**Selamat mencoba! 🚀**
