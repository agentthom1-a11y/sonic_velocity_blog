# 🤖 Meet Hermes: Your AI Content Agent

Hermes (Agent H-01) is now integrated into the Sonic Velocity ecosystem and ready for production.

## What is Hermes?
Hermes is a specialized AI agent prompt and workflow designed to generate "Transmissions"—data-driven, brutalist intelligence reports about the intersection of music, technology, and culture in Southeast Asia.

## Production URL
`https://transmissions.sonicvelocitymusic.com`

## Files Created
- **Prompt**: `agents/hermes/hermes_system_prompt.md`
- **Setup Guide**: `agents/hermes/setup_guide.md`
- **Transmission Script**: `agents/hermes/transmit.js` (Use for production)
- **Seeding Script**: `scripts/seed-hermes-post.ts` (Use for local dev)

## How to use Hermes in Production
1.  **Get an API Key**: Go to your Admin Dashboard on the live site and create a key with `auto_publish` scope.
2.  **Generate Content**: Feed the `hermes_system_prompt.md` to an LLM (Claude/GPT).
3.  **Deploy**: Use the transmission script to post to the live site:
    ```bash
    export HERMES_API_KEY=svk_your_key
    node agents/hermes/transmit.js ./content.json
    ```

## Manual Seeding (Local)
To see Hermes in action locally, you can run the seeding script:
```bash
npx tsx scripts/seed-hermes-post.ts
```

*Hermes is optimized for the Sonic Velocity aesthetic: Brutalist, urgent, and culturally deep.*
