# GTM Play Router

From what your best rep does, to what every rep does. As a system.

An independent concept for Vercel's GTM Engineer role: GTM signals from Sales, Success, Marketing and Data land in one intake; a real AI SDK agent loop classifies each signal to a revenue motion with structured output; an observed top-performer behavior becomes a shipped, auditable play for the whole org.

## Built on the Vercel AI Cloud

- **Next.js (App Router)** - the application, server-rendered shell plus interactive router UI
- **AI SDK + Vercel AI Gateway** - `POST /api/route-signal` calls a model through the Vercel AI Gateway with `generateObject` and a Zod schema, so every routing decision is typed, logged and replayable. Falls back to a clearly-flagged deterministic router when no gateway key is set.
- **Vercel Analytics + Speed Insights** - mounted in the root layout
- **Preview deployments** - every push ships a preview; production is the main branch

Unofficial concept. Sample data throughout. Not affiliated with or endorsed by Vercel.

## Run locally

```
npm install
AI_GATEWAY_API_KEY=... npm run dev   # or omit the key to use the deterministic fallback
```

## The idea

A top performer's best practice lives in their head and their sent folder. The router observes what the best rep actually does when a signal fires, drafts the action from that behavior, and ships it as the org default - with the reasoning attached to every decision.
