# Sonic Velocity CMS & AI Publishing Guide

Welcome to the Sonic Velocity Editorial System. This guide covers how to manage content, integrate AI agents, and use the automated publishing features.

---

## 1. Setup & Access

### Environment Variables
Ensure your `.env.local` has the following configured:
- `ADMIN_EMAIL`: Your login email.
- `ADMIN_PASSWORD`: Your login password.
- `SESSION_SECRET`: A secure 32-character string for signing tokens.
- `DATABASE_URL`: `file:./data/cms.db` (The system will create this automatically).

### Logging In
1. Navigate to `/admin/login`.
2. Enter your credentials.
3. You will be redirected to the **Dashboard**, where you can see live stats on your transmissions.

---

## 2. Editorial Workflow

Content follows a strict status lifecycle to ensure quality:

1.  **Draft**: Initial stage. Visible only in Admin.
2.  **Review**: Content marked for editorial check.
3.  **Scheduled**: Published automatically at a specific time.
4.  **Published**: Live on the public `/transmissions` site.
5.  **Archived**: Removed from public view but kept in database.

### Creating a Transmission
- Go to **Posts** > **+ New**.
- Use the **Markdown Editor** for the content.
- Set a **Category** (Engineering, Product, Culture, Scene Radar, or Archive).
- Add **Tags** (comma-separated).
- Configure **SEO** (Title and Meta Description) for search engines.

---

## 3. AI Agent Integration

The system provides a secure API for programmatic publishing.

### API Endpoint
`POST /api/internal/ai/transmissions`

### Authentication
All requests require a **Bearer Token** in the `Authorization` header.
`Authorization: Bearer svk_YOUR_API_KEY`

### The "Trusted Source" Feature (Auto-Publish)
When creating an API key in **Settings > API Keys**, you can grant the **Auto Publish ★** scope.
- **Regular Keys**: Submissions are saved as `draft` or `review` for manual approval.
- **Trusted Keys**: Submissions are published **immediately** to the live site, bypassing the review queue.

### Payload Format (JSON)
```json
{
  "title": "New Hipdut Signal",
  "excerpt": "A brief summary for cards...",
  "content_markdown": "## Full Content\n\nSupports markdown formatting.",
  "category": "Culture",
  "tags": ["trend", "indonesia"],
  "cover_image_url": "https://...",
  "status": "published", 
  "source_type": "ai_agent"
}
```
*Note: If the key doesn't have `auto_publish`, the status will be downgraded to `review` even if you send `published`.*

---

## 4. Bulk Import

If you have a collection of articles (e.g., from an AI research run):
1. Go to **Import** in the Admin sidebar.
2. Provide your API Key.
3. Paste a JSON object with a `posts` array.
4. The system will validate each record individually and report successes/failures.

---

## 5. Maintenance

- **Database**: The SQLite database is stored in `/data/cms.db`. It is ignored by git to protect production data.
- **Media**: All images should be hosted externally or placed in `/public/uploads`.
- **Scheduled Posts**: The system checks for due scheduled posts on every page load and publishes them automatically.

---

## 6. SEO & Social

- **JSON-LD**: Every article automatically generates `BlogPosting` schema for Google.
- **Sitemap**: `/sitemap.xml` is updated dynamically to include new transmissions.
- **OG Tags**: OpenGraph and Twitter cards are auto-generated from your post's SEO settings and cover image.
