# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev          # start dev server
pnpm build        # production build
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm format       # prettier --write src/
```

Package manager is **pnpm** (v11). Do not use npm or yarn.

## Next.js Version Warning

This project uses **Next.js 16.2.6** with React 19. APIs differ from Next.js 13–15 in breaking ways. Key differences observed in this codebase:

- Middleware is implemented via `src/proxy.ts` exporting a `NextProxy` (imported from `next/server`) — **not** the conventional `middleware.ts` with `NextRequest/NextResponse` pattern.
- Before adding any Next.js-specific code (middleware, route handlers, metadata, caching), read the relevant guide in `node_modules/next/dist/docs/`.

## Architecture

### Route Groups

`src/app/` uses Next.js route groups to segment layouts:

| Group        | Path prefix                                                                                   | Purpose                              |
| ------------ | --------------------------------------------------------------------------------------------- | ------------------------------------ |
| `(external)` | `/`, `/about`, `/contact`, `/how-it-works`, `/waitlist`                                       | Public marketing pages               |
| `(auth)`     | `/signin`, `/signup`, `/verify-otp`, `/forgot-password`, `/reset-password`, `/verification/*` | Authentication and doctor onboarding |
| `(legal)`    | `/privacy-policy`, `/terms-and-conditions`                                                    | Legal content pages                  |

The **root layout** (`src/app/layout.tsx`) wraps all groups with `<Header>`, `<Footer>`, and `<Toaster>`. Auth pages use fixed/absolute positioning to create full-screen layouts on top of this.

The `(auth)/verification/` sub-group has its own layout that adds `<VerificationNavbar>` and a stepped onboarding UI (professional-info → credentials-verification → verification-complete).

### Server Actions vs API Routes

Backend communication is split:

- **`src/actions/`** — Server Actions (`'use server'`) for auth flows (signup, signin, verify OTP, resend OTP, password reset). These call the external staging API directly: `https://api.staging.useclinsight.com/api/v1/`.
- **`src/app/api/`** — Next.js Route Handlers used for internal/proxy endpoints (health check, waitlist, auth sub-routes like `/api/auth/verify-otp`).

### Form Pattern

All forms use **React Hook Form** + **Zod** via `@hookform/resolvers/zod`. Schemas are colocated in `src/schemas/` or inline in the component file. Server Actions are called from `onSubmit` handlers; results surface via `sonner` toasts.

### Styling

Tailwind CSS v4 with a custom theme defined in `src/app/globals.css` under `@theme`. Key custom tokens: `--color-primary-blue: #1565c0`, `--color-brand-blue: #1565c0`. Use the `cn()` helper from `src/lib/utils.ts` (clsx + tailwind-merge) for conditional classes.

Icons come from `@hugeicons/react` (`HugeiconsIcon`) with icon definitions imported from `@hugeicons/core-free-icons`.

UI primitives are shadcn/ui components in `src/components/ui/`.

All API URLs fall back to `https://api.staging.useclinsight.com/api/v1/auth/*` if unset.
