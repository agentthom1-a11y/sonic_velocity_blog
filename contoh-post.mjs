#!/usr/bin/env node
/**
 * Contoh Script untuk Post Blog via API
 * Jalankan: node contoh-post.mjs
 */

// API Key Anda
const API_KEY = 'svk_e13876d2b4f4c5e4dadc2cb4a06b6a6ef931d25f';

// URL API (ganti dengan domain Anda setelah deploy)
const API_URL = 'http://localhost:3000/api/internal/ai/transmissions';

// Data post yang akan dibuat
const postData = {
  title: 'Contoh Post dari API - ' + new Date().toLocaleString('id-ID'),
  excerpt: 'Ini adalah contoh post yang dibuat menggunakan API. Post ini dibuat secara otomatis menggunakan script.',
  content_markdown: `# Contoh Post dari API

Selamat datang! Post ini dibuat menggunakan API SonicVelo Blog.

## Fitur-fitur

- ✅ Buat post otomatis
- ✅ Support Markdown
- ✅ Auto-publish
- ✅ Kategori dan tags
- ✅ SEO friendly

## Cara Pakai

\`\`\`javascript
const response = await fetch(API_URL, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(postData)
});
\`\`\`

## Kesimpulan

Dengan API ini, Anda bisa membuat post dari mana saja!

---

**Dibuat pada:** ${new Date().toLocaleString('id-ID')}  
**Via:** API Script
`,
  category: 'Tutorial',
  tags: ['api', 'tutorial', 'automation'],
  author_name: 'API Bot',
  source_type: 'ai_agent',
  featured: false
};

// Fungsi untuk membuat post
async function buatPost() {
  console.log('🚀 Membuat post via API...\n');
  console.log('📍 URL:', API_URL);
  console.log('🔑 API Key:', API_KEY.substring(0, 15) + '...\n');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(postData)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ POST BERHASIL DIBUAT!\n');
      console.log('📊 Detail Post:');
      console.log('   ID:', data.id);
      console.log('   Slug:', data.slug);
      console.log('   Status:', data.status);
      console.log('   Auto-published:', data.auto_published);
      console.log('   Published at:', data.published_at);
      console.log('\n🔗 URL:');
      console.log('   Preview:', data.preview_url);
      console.log('   Admin:', data.admin_url);
      console.log('\n🎉 Silakan buka URL di atas untuk melihat post Anda!');
    } else {
      console.error('❌ GAGAL MEMBUAT POST\n');
      console.error('Status:', response.status);
      console.error('Error:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

// Jalankan
buatPost();
