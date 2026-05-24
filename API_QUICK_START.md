# 🚀 SonicVelo Blog API - Quick Start Guide

## ✅ API is Now Accessible from ANY Server!

Your API is fully configured with CORS support and can accept requests from:
- ✅ Any domain
- ✅ Any server
- ✅ Browser JavaScript
- ✅ Mobile apps
- ✅ Desktop applications
- ✅ Command line tools

---

## 🔑 Get Your API Key

1. Visit: `https://yourdomain.com/en/admin/login`
2. Login with admin credentials
3. Go to: **Settings → API Keys**
4. Click **Create New API Key**
5. Select scopes: `write`, `publish`, `auto_publish`
6. Copy the key (shown only once!)

**Your current test key:** `svk_e13876d2b4f4c5e4dadc2cb4a06b6a6ef931d25f`

---

## 📡 Quick Test (30 seconds)

### Test 1: Health Check (No Auth Required)

```bash
curl https://yourdomain.com/api/health
```

Expected response:
```json
{"ok":true,"service":"sonicvelo-blog","time":"..."}
```

### Test 2: Create a Post

```bash
curl -X POST https://yourdomain.com/api/internal/ai/transmissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "title": "My First API Post",
    "excerpt": "This post was created via the API",
    "content_markdown": "# Hello World\n\nThis is my first post created via API!"
  }'
```

---

## 💻 Code Examples

### JavaScript (Browser or Node.js)

```javascript
const API_KEY = 'svk_your_api_key_here';
const API_BASE = 'https://yourdomain.com';

// Create a post
async function createPost() {
  const response = await fetch(`${API_BASE}/api/internal/ai/transmissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      title: 'My New Post',
      excerpt: 'A brief description of my post',
      content_markdown: '# My Content\n\nWrite your post here in **Markdown**!'
    })
  });
  
  const data = await response.json();
  console.log('Post created:', data);
  // Returns: { id, slug, status, preview_url, admin_url }
}

createPost();
```

### Python

```python
import requests

API_KEY = 'svk_your_api_key_here'
API_BASE = 'https://yourdomain.com'

def create_post():
    response = requests.post(
        f'{API_BASE}/api/internal/ai/transmissions',
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {API_KEY}'
        },
        json={
            'title': 'My New Post',
            'excerpt': 'A brief description of my post',
            'content_markdown': '# My Content\n\nWrite your post here!'
        }
    )
    
    data = response.json()
    print('Post created:', data)

create_post()
```

### PHP

```php
<?php
$apiKey = 'svk_your_api_key_here';
$apiBase = 'https://yourdomain.com';

$data = [
    'title' => 'My New Post',
    'excerpt' => 'A brief description of my post',
    'content_markdown' => '# My Content\n\nWrite your post here!'
];

$ch = curl_init("$apiBase/api/internal/ai/transmissions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    "Authorization: Bearer $apiKey"
]);

$response = curl_exec($ch);
$result = json_decode($response, true);

echo "Post created: " . print_r($result, true);
curl_close($ch);
?>
```

### Ruby

```ruby
require 'net/http'
require 'json'

api_key = 'svk_your_api_key_here'
api_base = 'https://yourdomain.com'

uri = URI("#{api_base}/api/internal/ai/transmissions")
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::Post.new(uri)
request['Content-Type'] = 'application/json'
request['Authorization'] = "Bearer #{api_key}"
request.body = {
  title: 'My New Post',
  excerpt: 'A brief description of my post',
  content_markdown: '# My Content\n\nWrite your post here!'
}.to_json

response = http.request(request)
puts "Post created: #{response.body}"
```

---

## 🌐 Test from Browser Console

Open any website, press F12 to open console, and paste:

```javascript
fetch('https://yourdomain.com/api/internal/ai/transmissions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer svk_your_api_key_here'
  },
  body: JSON.stringify({
    title: 'Test from Browser',
    excerpt: 'Testing API from browser console',
    content_markdown: '# Test\n\nThis works from any website!'
  })
})
.then(r => r.json())
.then(data => console.log('✅ Post created:', data))
.catch(err => console.error('❌ Error:', err));
```

---

## 📋 Required Fields

Minimum required to create a post:

```json
{
  "title": "Your Title (3-500 chars)",
  "excerpt": "Your excerpt (10-1000 chars)",
  "content_markdown": "Your content in Markdown (min 20 chars)"
}
```

## 🎨 Optional Fields

Add these for more control:

```json
{
  "category": "Technology",
  "tags": ["tag1", "tag2"],
  "cover_image_url": "https://example.com/image.jpg",
  "cover_image_alt": "Image description",
  "seo_title": "SEO title",
  "meta_description": "Meta description",
  "featured": false,
  "status": "draft",
  "author_name": "John Doe"
}
```

---

## 🔐 API Key Scopes

Your API key needs these scopes:

- **write** - Create and update posts (required)
- **publish** - Manually publish posts
- **auto_publish** - Posts are automatically published (recommended)
- **schedule** - Schedule posts for future
- **delete** - Delete posts

---

## ✅ CORS Test Results

All tests passed! ✅

- ✅ OPTIONS preflight: Working
- ✅ Health check with CORS: Working  
- ✅ POST from external origin: Working
- ✅ GET from external origin: Working

**CORS Headers:**
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With`

---

## 🎯 Common Use Cases

### 1. AI Agent Integration

```javascript
// AI agent posts content automatically
async function aiPublishPost(aiGeneratedContent) {
  const response = await fetch('https://yourdomain.com/api/internal/ai/transmissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer svk_your_api_key_here'
    },
    body: JSON.stringify({
      title: aiGeneratedContent.title,
      excerpt: aiGeneratedContent.summary,
      content_markdown: aiGeneratedContent.content,
      source_type: 'ai_agent',
      ai_summary: aiGeneratedContent.metadata.summary,
      ai_prompt_version: 'v1.0'
    })
  });
  
  return await response.json();
}
```

### 2. Content Import from External Source

```javascript
// Import posts from another CMS
async function importPost(externalPost) {
  const response = await fetch('https://yourdomain.com/api/internal/ai/transmissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer svk_your_api_key_here'
    },
    body: JSON.stringify({
      title: externalPost.title,
      excerpt: externalPost.excerpt,
      content_markdown: externalPost.content,
      source_type: 'import',
      source_reference: externalPost.original_url,
      canonical_url: externalPost.original_url
    })
  });
  
  return await response.json();
}
```

### 3. Scheduled Publishing

```javascript
// Schedule a post for future publication
async function schedulePost(post, publishDate) {
  const response = await fetch('https://yourdomain.com/api/internal/ai/transmissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer svk_your_api_key_here'
    },
    body: JSON.stringify({
      ...post,
      status: 'scheduled',
      scheduled_at: publishDate.toISOString()
    })
  });
  
  return await response.json();
}
```

---

## 🐛 Troubleshooting

### CORS Error
**Problem:** Browser shows CORS error  
**Solution:** Ensure `ALLOWED_ORIGIN=*` in `.env.local` on server

### 401 Unauthorized
**Problem:** API returns 401  
**Solution:** Check API key is correct and in format: `Bearer svk_...`

### 422 Validation Error
**Problem:** API returns 422  
**Solution:** Check required fields (title, excerpt, content_markdown)

### Network Error
**Problem:** Cannot connect to API  
**Solution:** Verify server is running and URL is correct

---

## 📚 Full Documentation

For complete API documentation, see: **API_DOCUMENTATION.md**

---

## 🎉 You're Ready!

Your API is now:
- ✅ Fully functional
- ✅ CORS-enabled
- ✅ Accessible from any server
- ✅ Production-ready

**Start creating posts from anywhere!** 🚀

---

**API Base URL:** `https://yourdomain.com`  
**Test API Key:** `svk_e13876d2b4f4c5e4dadc2cb4a06b6a6ef931d25f`  
**Status:** 🟢 LIVE
