# loomi-product-view

## Stack
- Next.js 15 (App Router)
- TypeScript strict mode
- Tailwind CSS v3
- TanStack Query v5 (React Query)

## Project structure
- `src/app/` — App Router pages and layouts
- `src/components/ui/` — reusable primitive components (no business logic)
- `src/features/` — domain-scoped modules; each feature owns its components and hooks
- `src/lib/` — API client, shared utilities
- `src/types/` — shared TypeScript types
- `src/styles/` — global CSS

## Commands
```bash
npm run dev        # local dev server
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint via next lint
```

## Conventions
- Features are self-contained under `src/features/<domain>/`
- All data fetching goes through React Query hooks in `src/features/<domain>/hooks/`
- UI primitives live in `src/components/ui/` — keep them generic and reusable
- No `any` types
- No `console.log` in production code
- Currency formatted with `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- Images via Next.js `<Image>` — always include `alt` and `sizes`

## Custom Slash Commands
- `/frontend <task>` — two-mode frontend workflow (scaffold or feature/fix/refactor). See `.claude/commands/frontend.md`.

## Onboarding
See `ONBOARDING.md` for team guidance on using Claude Code in this repo.
