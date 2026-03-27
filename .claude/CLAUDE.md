# CostLens -- Agent Instructions

## Project Context

CostLens is a cloud cost intelligence platform built with React 19, TypeScript, and Cloudflare Workers. Users upload billing CSVs/JSON from AWS, GCP, or Azure and get instant analysis: waste detection, optimization recommendations, team attribution, RI planning, forecasts, and budget alerts.

## Architecture Principles

1. **Client-side processing**: All billing data analysis happens in the browser via Web Workers. No billing data is sent to any server.
2. **Upload-first UX**: No signup, no agents, no IAM roles. Upload a file, get value in < 60 seconds.
3. **IndexedDB persistence**: Normalized billing data and user preferences persist in IndexedDB across sessions.
4. **Progressive disclosure**: Dashboard summaries first, drill-down on demand.

## Key Conventions

- All monetary values are USD, formatted as `$X,XXX.XX`
- Web Workers for all parsing and analysis -- never block the main thread
- Recharts for data visualization
- CSS custom properties for theming
- Route-level code splitting with React.lazy + Suspense
- Tests next to source files (`*.test.tsx`)

## File Ownership

| Directory | Owner Agent |
|-----------|------------|
| `src/pages/` | frontend-dev |
| `src/components/` | frontend-dev |
| `src/lib/analysis/` | frontend-dev |
| `src/types/` | frontend-dev |
| `worker/` | backend-dev |
| `docs/` | content-writer (text), team-lead (structure) |
| Tests (`*.test.tsx`) | qa |
