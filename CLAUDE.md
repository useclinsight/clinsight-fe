# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Monorepo Architecture

This repository is organized as a Turborepo + pnpm workspaces monorepo:

### Applications (`apps/`)

| App           | Package Name        | Port | Description                                                                                                  |
| ------------- | ------------------- | ---- | ------------------------------------------------------------------------------------------------------------ |
| `apps/web`    | `@clinsight/web`    | 3000 | Public marketing & landing site (`/`, `/about`, `/contact`, `/waitlist`, `/how-it-works`, `/squeeze`, legal) |
| `apps/doctor` | `@clinsight/doctor` | 3001 | Doctor portal (`/user` dashboard, `/case` reviews, `/earnings`, `/messages`, `/verification`, auth)          |
| `apps/user`   | `@clinsight/user`   | 3002 | Patient / user dashboard (`/` overview, `/consultations`, `/records`, `/messages`, `/settings`, auth)        |
| `apps/admin`  | `@clinsight/admin`  | 3003 | Admin portal (`/` metrics, `/verifications` credential queue, `/doctors`, `/users`, `/settings`)             |

### Shared Packages (`packages/`)

| Package           | Name                | Description                                                                      |
| ----------------- | ------------------- | -------------------------------------------------------------------------------- |
| `packages/ui`     | `@clinsight/ui`     | Shared UI primitives (Button, Input, Card, Badge, Table, Avatar, Sonner toaster) |
| `packages/lib`    | `@clinsight/lib`    | Shared utilities (`cn`, isomorphic `apiClient`, auth & session helpers)          |
| `packages/types`  | `@clinsight/types`  | Shared TypeScript interfaces (Auth, Doctor, User, Admin, Editor)                 |
| `packages/config` | `@clinsight/config` | Shared TypeScript base configuration                                             |

## Commands

```bash
# Monorepo-wide commands (via Turborepo)
pnpm dev              # start all apps in development
pnpm build            # build all apps and packages
pnpm typecheck        # typecheck all apps and packages (or `make test`)
make test             # verify test/typecheck across repository
pnpm lint             # run linters across workspace
pnpm format           # prettier format across repository

# Run individual apps
pnpm dev:web          # run marketing website (port 3000)
pnpm dev:doctor       # run doctor portal (port 3001)
pnpm dev:user         # run patient portal (port 3002)
pnpm dev:admin        # run admin portal (port 3003)

# Build individual apps
pnpm build:web
pnpm build:doctor
pnpm build:user
pnpm build:admin
```

Package manager is **pnpm** (v11). Do not use npm or yarn.

## Next.js Version Warning

This project uses **Next.js 16.2.6** with React 19.

- In `apps/doctor`, middleware uses `src/proxy.ts` exporting a `NextProxy` (imported from `next/server`).
- Forms use React Hook Form + Zod via `@hookform/resolvers/zod`.
- Tailwind CSS v4 is configured across all apps.
