# SonicVelo Blog - API Documentation

**Base URL:** `https://yourdomain.com` (or `http://localhost:3000` for local)  
**Version:** 1.0.0  
**Authentication:** Bearer Token (API Key)

---

## 🔐 Authentication

All API endpoints (except health check) require authentication using an API key.

### Getting an API Key

1. Login to admin panel: `https://yourdomain.com/en/admin/login`
2. Navigate to: **Settings → API Keys**
3. Click **Create New API Key**
4. Select scopes (permissions)
5. Copy the key (shown only once!)

### Using the API Key

Include the API key in the `Authorization` header:

```bash
Authorization: Bearer svk_your_api_key_here
```

### API Key Scopes

- **write** - Create and update posts
- **publish** - Publish posts manually
- **auto_publish** - Posts are automatically published on creation
- **schedule** - Schedule posts for future publication
- **delete** - Delete posts

---

## 🌐 CORS Configuration

The API supports **Cross-Origin Resource Sharing (CORS)** and can be accessed from any server.

### CORS Headers

All API endpoints include:
- `Access-Control-Allow-Origin: *` (or specific origin)
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With`

### Preflight Requests

The API handles OPTIONS preflight requests automatically.

---

## 📡 API Endpoints

### 1. Health Check

Check if the API is running.

**Endpoint:** `GET /api/health`  
**Authentication:** None required  
**CORS:** Enabled

#### Request

```bash
curl https://yourdomain.com/api/health
```

#### Response

```json
{
  "ok": true,
  "service": "sonicvelo-blog",
  "time": "2026-05-16T12:00:00.000Z"
}
```

---

### 2. Create Post

Create a new blog post (transmission).

**Endpoint:** `POST /api/internal/ai/transmissions`  
**Authentication:** Required (Bearer token)  
**Required Scopes:** `write`  
**CORS:** Enabled

#### Request Headers

```
Content-Type: application/json
Authorization: Bearer svk_your_api_key_here
```

#### Request Body

```json
{
  "title": "Your Post Title",
  "excerpt": "A brief summary of your post (min 10 chars)",
  "content_markdown": "# Your Content\n\nWrite your post content in **Markdown**.",
  "category": "Technology",
  "tags": ["tag1", "tag2"],
  "cover_image_url": "https://example.com/image.jpg",
  "cover_image_alt": "Image description",
  "seo_title": "SEO optimized title",
  "meta_description": "Meta description for SEO",
  "canonical_url": "https://example.com/original-post",
  "og_image_url": "https://example.com/og-image.jpg",
  "featured": false,
  "status": "draft",
  "scheduled_at": "2026-05-20T10:00:00Z",
  "author_name": "John Doe",
  "source_type": "ai_agent",
  "source_reference": "agent-v1",
  "ai_summary": "AI generated summary",
  "ai_prompt_version": "v1.0"
}
```

#### Required Fields

- `title` (string, 3-500 chars)
- `excerpt` (string, 10-1000 chars)
- `content_markdown` (string, min 20 chars)

#### Optional Fields

- `slug` (string, lowercase alphanumeric with dashes)
- `category` (string)
- `tags` (array of strings)
- `cover_image_url` (string, URL)
- `cover_image_alt` (string)
- `seo_title` (string, max 200 chars)
- `meta_description` (string, max 400 chars)
- `canonical_url` (string, URL)
- `og_image_url` (string, URL)
- `featured` (boolean, default: false)
- `status` (enum: 'draft', 'review', 'scheduled', 'published', default: 'draft')
- `scheduled_at` (string, ISO 8601 datetime)
- `author_name` (string)
- `source_type` (enum: 'ai_agent', 'import', 'manual', default: 'ai_agent')
- `source_reference` (string)
- `ai_summary` (string)
- `ai_prompt_version` (string)

#### Response (201 Created)

```json
{
  "id": 123,
  "slug": "your-post-title",
  "status": "published",
  "auto_published": true,
  "published_at": "2026-05-16T12:00:00.000Z",
  "preview_url": "https://yourdomain.com/en/transmissions/your-post-title",
  "admin_url": "https://yourdomain.com/en/admin/transmissions/123"
}
```

#### Status Behavior

- If API key has `auto_publish` scope: Post is automatically published
- If API key has `publish` scope and status is 'published': Post is published
- Otherwise: Post status is set to 'draft' or 'review'

#### Error Responses

**401 Unauthorized**
```json
{
  "error": "Unauthorized",
  "code": "INVALID_API_KEY"
}
```

**403 Forbidden**
```json
{
  "error": "Forbidden",
  "code": "MISSING_SCOPE_WRITE"
}
```

**400 Bad Request**
```json
{
  "error": "Invalid JSON body"
}
```

**422 Unprocessable Entity**
```json
{
  "error": "Validation failed",
  "details": {
    "title": ["String must contain at least 3 character(s)"],
    "excerpt": ["String must contain at least 10 character(s)"]
  }
}
```

---

### 3. List Posts

Retrieve a list of posts.

**Endpoint:** `GET /api/internal/ai/transmissions`  
**Authentication:** Required (Bearer token)  
**Required Scopes:** `write`  
**CORS:** Enabled

#### Query Parameters

- `status` (optional) - Filter by status: 'draft', 'review', 'scheduled', 'published', 'archived'
- `limit` (optional, default: 20) - Number of posts to return
- `offset` (optional, default: 0) - Pagination offset

#### Request

```bash
curl -H "Authorization: Bearer svk_your_api_key_here" \
  "https://yourdomain.com/api/internal/ai/transmissions?status=draft&limit=10"
```

#### Response (200 OK)

```json
{
  "posts": [
    {
      "id": 123,
      "title": "Post Title",
      "slug": "post-title",
      "excerpt": "Post excerpt",
      "status": "draft",
      "featured": false,
      "publishedAt": null,
      "createdAt": "2026-05-16T12:00:00.000Z",
      "updatedAt": "2026-05-16T12:00:00.000Z"
    }
  ],
  "meta": {
    "limit": 10,
    "offset": 0,
    "count": 1
  }
}
```

---

## 🔧 Usage Examples

### JavaScript (Fetch API)

```javascript
// Create a post
const response = await fetch('https://yourdomain.com/api/internal/ai/transmissions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer svk_your_api_key_here'
  },
  body: JSON.stringify({
    title: 'My New Post',
    excerpt: 'This is a great post about technology',
    content_markdown: '# Hello World\n\nThis is my first post!'
  })
});

const data = await response.json();
console.log('Post created:', data);
```

### Node.js (with axios)

```javascript
const axios = require('axios');

async function createPost() {
  try {
    const response = await axios.post(
      'https://yourdomain.com/api/internal/ai/transmissions',
      {
        title: 'My New Post',
        excerpt: 'This is a great post about technology',
        content_markdown: '# Hello World\n\nThis is my first post!',
        category: 'Technology',
        tags: ['nodejs', 'api']
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer svk_your_api_key_here'
        }
      }
    );
    
    console.log('Post created:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

createPost();
```

### Python (with requests)

```python
import requests

url = 'https://yourdomain.com/api/internal/ai/transmissions'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer svk_your_api_key_here'
}
data = {
    'title': 'My New Post',
    'excerpt': 'This is a great post about technology',
    'content_markdown': '# Hello World\n\nThis is my first post!',
    'category': 'Technology',
    'tags': ['python', 'api']
}

response = requests.post(url, json=data, headers=headers)
print('Post created:', response.json())
```

### cURL

```bash
curl -X POST https://yourdomain.com/api/internal/ai/transmissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer svk_your_api_key_here" \
  -d '{
    "title": "My New Post",
    "excerpt": "This is a great post about technology",
    "content_markdown": "# Hello World\n\nThis is my first post!",
    "category": "Technology",
    "tags": ["curl", "api"]
  }'
```

---

## 🧪 Testing from Any Server

The API is configured to accept requests from any origin. You can test it from:

- **Local development** (localhost)
- **Remote servers** (any domain)
- **Browser console** (any website)
- **Postman / Insomnia**
- **Command line** (curl, httpie)

### Browser Console Test

Open any website, open browser console (F12), and run:

```javascript
fetch('https://yourdomain.com/api/health')
  .then(r => r.json())
  .then(data => console.log('API is working:', data));
```

### Test Post Creation

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
    content_markdown: '# Test\n\nThis works!'
  })
})
.then(r => r.json())
.then(data => console.log('Post created:', data))
.catch(err => console.error('Error:', err));
```

---

## 🔒 Security Best Practices

### API Key Management

1. **Never commit API keys to version control**
2. **Use environment variables** to store keys
3. **Rotate keys regularly** (monthly recommended)
4. **Use different keys** for different environments (dev, staging, prod)
5. **Revoke compromised keys** immediately

### Scope Management

- Use **minimal scopes** required for each use case
- Create **separate keys** for different applications
- Use **auto_publish** scope only for trusted sources

### Rate Limiting

Consider implementing rate limiting on your server:
- Limit requests per API key
- Monitor for unusual activity
- Set up alerts for high usage

---

## 📊 Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Preflight request successful |
| 400 | Bad Request | Invalid request body |
| 401 | Unauthorized | Invalid or missing API key |
| 403 | Forbidden | Insufficient permissions |
| 422 | Unprocessable Entity | Validation failed |
| 500 | Internal Server Error | Server error |

---

## 🐛 Troubleshooting

### CORS Errors

If you get CORS errors:
1. Check that `ALLOWED_ORIGIN=*` in `.env.local`
2. Ensure you're including proper headers
3. Check browser console for specific error

### Authentication Errors

If you get 401 Unauthorized:
1. Verify API key is correct
2. Check Authorization header format: `Bearer svk_...`
3. Ensure API key is active (not revoked)

### Validation Errors

If you get 422 Unprocessable Entity:
1. Check required fields are present
2. Verify field lengths and formats
3. Review the `details` object in response

---

## 📞 Support

- **Documentation:** This file
- **Admin Panel:** https://yourdomain.com/en/admin
- **API Health:** https://yourdomain.com/api/health

---

**Last Updated:** 2026-05-16  
**API Version:** 1.0.0  
**Status:** ✅ Production Ready
