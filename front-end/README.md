# Loomi Immersion — Front-end

Next.js 15 web app for the Loomi Immersion project. Provides authentication
(sign-up / sign-in / sign-out), account management (view, edit, delete) and a
built-in onboarding guide for Claude Code.

The app talks to the [NestJS back-end](../back-end) for user and auth APIs.

## Routes

| Path | Description |
|---|---|
| `/` | Redirects to `/login` |
| `/login` | Sign in with email + password |
| `/sign-up` | Create a new account (auto-logs in on success) |
| `/account` | View, edit and delete the current user. Hosts the sign-out action. Protected — redirects to `/login` if unauthenticated. |
| `/claude-guide` | Embedded onboarding guide for Claude Code |
| `/claude-guide/setup` … `/claude-guide/checklist` | Subsections of the guide |

## Stack

| Tool | Version | Role |
|---|---|---|
| Next.js | 15 | App Router |
| React | 19 | UI |
| TypeScript | 5 (strict) | Types |
| Tailwind CSS | 4 | Styling |
| TanStack Query | 5 | Data fetching + caching |
| Framer Motion | 12 | Animations |
| shadcn/ui + Base UI | latest | UI primitives |
| lucide-react | latest | Icons |

## Project structure

```
src/
├── app/
│   ├── layout.tsx               # Root layout — fonts + QueryProvider
│   ├── page.tsx                 # Redirects to /login
│   ├── (auth)/                  # Unauthenticated layout (centered card)
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── sign-up/page.tsx
│   ├── (app)/                   # Authenticated layout (topbar + RequireAuth)
│   │   ├── layout.tsx
│   │   ├── _components/AccountTopbar.tsx
│   │   └── account/page.tsx
│   └── claude-guide/            # Onboarding guide pages (with Sidebar)
│       ├── layout.tsx
│       ├── page.tsx
│       └── setup, basics, capabilities, commands,
│           claude-md, team, checklist/
├── components/
│   ├── QueryProvider.tsx        # TanStack Query client provider
│   ├── LayoutShell.tsx          # Sidebar shell for the guide
│   └── ui/                      # Generic primitives (Button, Card, Input, …)
├── features/
│   ├── auth/
│   │   ├── api.ts               # login, register, me, logout
│   │   ├── keys.ts              # query keys
│   │   ├── hooks/               # useLogin, useRegister, useCurrentUser, useLogout
│   │   └── components/RequireAuth.tsx
│   └── users/
│       ├── api.ts               # getOne, update, remove
│       ├── keys.ts
│       └── hooks/               # useUserProfile, useUpdateUser, useDeleteUser
├── lib/
│   ├── api.ts                   # fetch wrapper, envelope unwrap, refresh-token interceptor
│   ├── token-store.ts           # localStorage token store
│   ├── sections.ts              # guide nav metadata
│   └── utils.ts
├── types/
│   ├── auth.ts
│   └── user.ts
└── styles/globals.css
```

## Architecture notes

- **Routing groups** — `(auth)` and `(app)` are Next.js route groups: they
  carry their own `layout.tsx` without affecting the URL. `(auth)` renders a
  minimal centered card; `(app)` renders an authenticated topbar and gates
  children with a `<RequireAuth>` client component.
- **API client** (`src/lib/api.ts`) — typed `fetch` wrapper that:
  - Automatically unwraps the back-end response envelope (`{ success, data }`).
  - Surfaces a typed `ApiError` with the back-end's `message` and HTTP status.
  - Attaches `Authorization: Bearer <accessToken>` when available.
  - Single-flight refresh: on a 401, all in-flight requests `await` one shared
    refresh promise, then retry once. If refresh fails, tokens are cleared.
- **Tokens** — kept in `localStorage` via `tokenStore`. For production you'd
  move them to httpOnly cookies set by a Next.js Route Handler proxy; the
  current setup is intentionally minimal for local development.
- **Sign-up flow** — `useRegister` chains `POST /users` → `POST /auth/login`
  so the user lands authenticated, no extra step.
- **Logout flow** — `useLogout` reads the refresh token first, calls
  `POST /auth/logout` (best-effort), then clears storage and the React Query
  cache before redirecting.

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure env (see below)
cp .env.example .env.local       # then edit if needed

# 3. Start the back-end (separate terminal, see ../back-end/README.md)
#    Default API URL is http://localhost:3001/api

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app redirects to
`/login`.

> The first time, click **Criar conta** to register a user via the sign-up
> page. The back-end exposes `POST /api/users` for unauthenticated registration.

## Environment variables

Create `.env.local` in this folder:

```env
# Base URL of the back-end API (must include the /api prefix)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

If `NEXT_PUBLIC_API_URL` is not set, the client falls back to
`http://localhost:3001/api`.

## Scripts

```bash
npm run dev        # local dev server (localhost:3000)
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

## Conventions

- Features are self-contained under `src/features/<domain>/` — each owns its
  components and hooks.
- All data fetching goes through React Query hooks in
  `src/features/<domain>/hooks/`. Hooks own query keys and invalidations.
- UI primitives live in `src/components/ui/` — keep them generic and reusable.
- No `any`. No `console.log` in production code.
- Currency formatted with
  `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
- Images via Next.js `<Image>` — always include `alt` and `sizes`.

## Talking to the back-end

The back-end wraps every successful response as
`{ success: true, data, timestamp }` and every error as
`{ statusCode, error, message, path, timestamp }`. The `api.ts` client handles
both — feature code only sees `data` on success and a thrown `ApiError` on
failure.

Endpoints used:

| Method | Path | Used by |
|---|---|---|
| `POST` | `/auth/login` | `useLogin`, `useRegister` |
| `GET` | `/auth/me` | `useCurrentUser` |
| `POST` | `/auth/refresh-token` | `api.ts` interceptor |
| `POST` | `/auth/logout` | `useLogout`, `useDeleteUser` |
| `POST` | `/users` | `useRegister` (unauthenticated) |
| `GET` | `/users/:id` | `useUserProfile` |
| `PATCH` | `/users/:id` | `useUpdateUser` |
| `DELETE` | `/users/:id` | `useDeleteUser` |

## Claude Code integration

This repo ships with first-class Claude Code support:

- **`CLAUDE.md`** — read by Claude at the start of every session; contains
  stack, conventions, and commands.
- **`ONBOARDING.md`** — team guide to installing and using Claude Code.
- **`.claude/commands/frontend.md`** — the `/frontend` slash command for
  scaffolding and feature work.

### Key slash commands

| Command | What it does |
|---|---|
| `/frontend <task>` | Scaffold a new layout or implement a feature/fix/refactor following Loomi conventions |
| `/init` | Generate or regenerate `CLAUDE.md` from the current repo state |
| `/review` | Multi-agent code review before opening a PR |
| `/security-review` | Security audit of pending changes |

## Related docs

- [`ONBOARDING.md`](./ONBOARDING.md) — Claude Code onboarding for the team
- [`CLAUDE.md`](./CLAUDE.md) — project context for Claude Code
- [`../back-end/README.md`](../back-end/README.md) — API setup
