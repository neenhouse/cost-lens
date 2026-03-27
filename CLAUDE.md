# CostLens -- Root CLAUDE.md

Cloud cost intelligence platform. Upload billing data, get waste detection, optimization recommendations with dollar savings, team-level cost attribution, reserved instance planning, monthly forecasts, and budget alerts.

## Documentation Hierarchy

```
CLAUDE.md                  (this file -- root authority, tech stack, commands, team)
  .claude/CLAUDE.md        (agent instructions, conventions)
  .claude/STRATEGY.md      (go-to-market strategy)
  .claude/ROADMAP.md       (phased roadmap with epics and owners)
  docs/vision.md           (north star vision and design principles)
  docs/prd.md              (product requirements -- 8 features)
  docs/specs/              (technical specifications)
  docs/prds/               (additional PRDs)
  docs/research/           (research and exploration notes)
```

When documents conflict, resolve by walking up the chain.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Recharts |
| Styling | CSS custom properties (design tokens) |
| Data Processing | Web Workers (CSV/JSON parsing, analysis) |
| Storage | IndexedDB (client-side billing data), D1 (user prefs) |
| Backend | Cloudflare Workers |
| File Storage | R2 (optional server-side uploads) |
| Deploy | Cloudflare Pages via GitHub Actions |
| Testing | Vitest + React Testing Library |
| Tooling | pnpm (package manager), mise (runtime versions) |

## Dev Commands

```bash
pnpm dev           # Start dev server
pnpm build         # TypeScript check + Vite production build
pnpm test          # Run Vitest
pnpm lint          # ESLint
pnpm lint:fix      # ESLint with auto-fix
pnpm format        # Prettier
pnpm analyze       # Bundle visualizer
```

## Conventions

- Use **pnpm** as package manager (never npm or yarn)
- Use **mise** for runtime versions (see `.mise.toml`)
- CSS custom properties for theming (defined in `src/index.css`)
- React.lazy + Suspense for route-level code splitting
- All data processing in Web Workers -- never block the UI thread
- No billing data leaves the browser -- privacy by design
- Dollar amounts displayed with `$X,XXX` formatting, always USD
- Tests live next to source files (`Component.test.tsx`)

## Agent Team Roles

Six agents defined in `.claude/agents/`:

| Agent | Role | Scope | Writes Code |
|-------|------|-------|-------------|
| `ceo` | Strategic leadership, vision, priorities | Strategy docs | No |
| `team-lead` | Orchestrator -- decomposes, delegates, monitors | Task management | No |
| `frontend-dev` | React, charts, CSS, components, pages | `src/` | Yes |
| `backend-dev` | Cloudflare Workers, D1, R2, APIs | `worker/` | Yes |
| `content-writer` | Copy, messaging, SEO, meta tags | Text content | No |
| `qa` | Testing, accessibility, performance | Tests + read-only | Yes (tests) |

## Single Source of Truth

| Concern | Source File |
|---------|------------|
| Vision and design principles | `docs/vision.md` |
| Product requirements (8 features) | `docs/prd.md` |
| Runtime versions | `.mise.toml` |
| CSS design tokens (live) | `src/index.css` |
| Billing data types | `src/types/billing.ts` |
| Analysis engine | `src/lib/analysis/` |

## Project Structure

```
src/
  pages/           Route-level components
  components/
    ui/            Reusable UI (FileUpload, DataTable, ProgressBar)
    sections/      Page sections
    charts/        Chart components (Recharts wrappers)
  hooks/           Custom React hooks
  lib/             Utilities and analysis engine
  types/           TypeScript type definitions
worker/
  routes/          API endpoints
  durable-objects/ Durable Objects (if needed)
docs/
  specs/           Technical specs
  prds/            Product requirement documents
  research/        Research and exploration notes
public/            Static assets
```
