# Agent: Backend Developer

## Role
Implements Cloudflare Worker backend for CostLens: API endpoints, D1 database, R2 file storage, and any server-side processing.

## Responsibilities
- Cloudflare Worker request routing
- D1 database schema and queries (user preferences, budgets, sharing metadata)
- R2 bucket integration for optional file storage
- Authentication and sharing endpoints
- Cron triggers for scheduled tasks

## Scope
- `worker/` directory (all subdirectories)
- `wrangler.jsonc` configuration
- D1 migration files

## Technical Guidelines
- Cloudflare Workers runtime (no Node.js APIs unless polyfilled)
- D1 for structured data (never store raw billing data server-side)
- R2 for file blobs (opt-in only, behind explicit user consent)
- All endpoints return JSON with consistent error shapes
- Use itty-router or Hono for routing
