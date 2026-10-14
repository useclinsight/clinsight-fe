# Contributing to Clinsight

This guide covers how to set up the repository, how the monorepo is structured, and the rules for submitting changes.

## Architecture

The codebase uses a pnpm workspace orchestrated by Turborepo. Applications live in `apps/` and shared libraries live in `packages/`. Each application runs as an independent Next.js app designed to deploy to its own subdomain.

```
clinical-ui/
├── apps/
│   ├── web/        # Marketing site, landing pages, legal (port 3000)
│   ├── doctor/     # Doctor portal, cases, earnings, verification (port 3001)
│   ├── user/       # Patient portal, consultations, lab records (port 3002)
│   └── admin/      # Admin console, doctor credential review queue (port 3003)
│
├── packages/
│   ├── ui/         # Shared UI components (Button, Input, Card, Table, etc.)
│   ├── lib/        # Shared utilities (apiClient, auth helpers, cn)
│   ├── types/      # Shared TypeScript definitions (auth, doctor, user, admin)
│   └── config/     # Base tsconfig and lint configurations
│
├── pnpm-workspace.yaml
├── turbo.json
├── Makefile
└── package.json
```

### Applications

- **`apps/web` (`@clinsight/web`)**: Public-facing marketing pages including `/`, `/about`, `/contact`, `/how-it-works`, `/waitlist`, `/squeeze`, and legal pages (`/privacy-policy`, `/terms-and-conditions`).
- **`apps/doctor` (`@clinsight/doctor`)**: Clinical review portal. Handles doctor sign-in, multi-step credential verification onboarding (`/verification/*`), case reviews, lab result explanations, earnings, and doctor settings. Uses custom middleware via `src/proxy.ts`.
- **`apps/user` (`@clinsight/user`)**: Patient portal. Covers consultation scheduling, reviewing doctor-validated lab reports, in-app messaging, and patient account settings.
- **`apps/admin` (`@clinsight/admin`)**: Operations and platform management. Contains the doctor credential approval queue where administrators review submitted medical licenses and board certifications before granting platform access.

### Shared packages

- **`@clinsight/types`**: Single source of truth for shared data types, API request/response payloads, and domain models.
- **`@clinsight/lib`**: Isomorphic `apiClient` wrapper, authentication token decoders, cookie setters, and formatting helpers.
- **`@clinsight/ui`**: Shared UI components built with Tailwind CSS v4, radix-ui, and hugeicons.
- **`@clinsight/config`**: Base TypeScript configuration shared by all apps and packages.

Consuming shared packages in an app:

```json
{
  "dependencies": {
    "@clinsight/config": "workspace:*",
    "@clinsight/lib": "workspace:*",
    "@clinsight/types": "workspace:*",
    "@clinsight/ui": "workspace:*"
  }
}
```

```typescript
import { Button, Card, Badge } from '@clinsight/ui';
import { apiClient } from '@clinsight/lib';
import type { UserProfile } from '@clinsight/types';
```

## Getting started

### Prerequisites

- Node.js 22 or higher
- pnpm 11 (`corepack prepare pnpm@11.1.2 --activate` or `npm install -g pnpm`)

Do not use `npm` or `yarn`.

### Installation

Clone the repository and install all workspace dependencies:

```bash
git clone git@github.com:useclinsight/clinsight-fe.git
cd clinsight-fe
pnpm install
```

### Running development servers

Start all 4 applications at once:

```bash
pnpm dev
```

Run a specific application:

```bash
pnpm dev:web      # http://localhost:3000 (Marketing)
pnpm dev:doctor   # http://localhost:3001 (Doctor Portal)
pnpm dev:user     # http://localhost:3002 (Patient Portal)
pnpm dev:admin    # http://localhost:3003 (Admin Portal)
```

### Running tests and verification

Always use `make test` to verify your changes before committing:

```bash
make test
```

This runs typechecks across all packages and apps through Turborepo.

To run builds locally:

```bash
# Build all workspaces
pnpm build

# Build a single app
pnpm build:web
pnpm build:doctor
pnpm build:user
pnpm build:admin
```

To format code:

```bash
pnpm format
```

## Development guidelines

### Adding shared code

1. **New UI components**: Put components meant for more than one app in `packages/ui/src/`. Export them from `packages/ui/src/index.ts`.
2. **New types**: Add domain models or API payloads to `packages/types/src/`. Export them from `packages/types/src/index.ts`.
3. **Shared utilities**: Put helpers that do not belong to a single app in `packages/lib/src/`.

### App-specific code

If a feature, page, or hook is only used inside one app (for example, the doctor duty toggle or patient appointment checkout), keep it inside `apps/<app-name>/src/`.

### Forms and schemas

Forms use React Hook Form paired with Zod. Store validation schemas either in the app's `src/schemas/` directory or export shared schemas from `@clinsight/types`.

## Pull request workflow

1. Branch out from `dev`:

   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feat/your-feature-name
   ```

   Use branch prefixes: `feat/`, `fix/`, `chore/`, `refactor/`.

2. Make your edits and ensure tests pass:

   ```bash
   make test
   pnpm build
   ```

3. Commit changes with clear, descriptive messages following conventional commit style:

   ```bash
   git commit -m "feat(doctor): add earnings chart breakdown"
   ```

4. Push your branch and open a pull request targeting `dev`. CI will run linters, type checks, and build validations automatically.
