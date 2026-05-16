# SETTING UP HERMES (AGENT H-01)

This guide explains how to configure and deploy the Hermes intelligence agent for the Sonic Velocity platform.

## 1. Authentication
Hermes requires a **Bearer Token** with the `auto_publish` scope to post directly to the blog.

1.  Login to the Admin Dashboard (`/admin/login`).
2.  Navigate to **Settings > API Keys**.
3.  Generate a new key named "HERMES_PRODUCTION".
4.  Ensure you check the **Auto Publish ★** scope.
5.  Copy the key (it starts with `svk_...`).

## 2. API Endpoint
**Production URL:**
`POST https://transmissions.sonicvelocitymusic.com/api/internal/ai/transmissions`

## 3. Deployment via cURL (Production Test)
You can test Hermes by sending a manual transmission payload to the live site:

```bash
curl -X POST https://transmissions.sonicvelocitymusic.com/api/internal/ai/transmissions \
  -H "Authorization: Bearer svk_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "HYPER-LOCAL AI: THE KOPLO ENGINE",
    "excerpt": "Analysis of neural networks being trained on regional Indonesian rhythmic structures.",
    "content_markdown": "## THE CORE SIGNAL\nRecent data suggests a 400% increase in AI-generated Koplo beats...\n\n### ARTIFACT 01: THE BEAT GRID\n...",
    "category": "Engineering",
    "tags": ["AI", "Koplo", "Indonesia", "Neural"],
    "status": "published"
  }'
```

## 4. Real-World Deployment Workflow
For automated content generation:
1.  **Generate**: Use an LLM with `hermes_system_prompt.md`.
2.  **Validate**: Ensure the output is valid JSON.
3.  **Transmit**: Use the provided `agents/hermes/transmit.js` script to post to production.

```bash
# Example usage
export HERMES_API_KEY=svk_your_key
node agents/hermes/transmit.js ./output.json
```

## 5. Hostinger Production Checklist
This API requires Hostinger's **Node.js application** hosting. A static/export-only deployment cannot run `/api/internal/ai/transmissions`.

1. Set production environment variables in Hostinger:
   - `SESSION_SECRET` must stay stable. Changing it invalidates existing API keys.
   - `DATABASE_URL` should point to a writable SQLite file, for example `file:/home/YOUR_USER/sonicvelo-data/cms.db`.
   - `NEXT_PUBLIC_SITE_URL` should be the real domain, for example `https://transmissions.sonicvelocitymusic.com`.
2. Run `npm install` and `npm run build` on the server.
3. Start the app with Node/Next, for example `npm start`, or run the generated standalone server if your Hostinger workflow deploys `.next/standalone`.
4. Create a fresh Hermes API key from the live admin dashboard after `SESSION_SECRET` is set, then use that key in `HERMES_API_KEY`.
5. For Hostinger deploy automation, keep the Hostinger API token in `agents/deploy/api_key.env` as `api_key_hostinger=...`. That file is local-only and ignored by git.

## 6. Local Seeding
To seed a local development database with initial Hermes intelligence:
`npx tsx scripts/seed-hermes-post.ts`
