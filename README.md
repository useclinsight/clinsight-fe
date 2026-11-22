# Clinsight frontend

This pnpm workspace contains the Clinsight marketing site and the doctor, patient, and admin Next.js apps.

## Apps

| App | Package | Local port |
| --- | --- | --- |
| Marketing | `@clinsight/web` | 3000 |
| Doctor | `@clinsight/doctor` | 3001 |
| Patient | `@clinsight/user` | 3002 |
| Admin | `@clinsight/admin` | 3003 |

## Local setup

Install dependencies with `pnpm install`. Copy the relevant app's `.env.example` to `.env.local` and set its values. Next.js loads env files from each app directory.

Set `NEXT_PUBLIC_API_BASE_URL` to the backend origin, such as `https://api.useclinsight.com`, without a trailing `/api/v1`. Frontend calls append the paths in the [backend API documentation](https://api.useclinsight.com/docs). This is the only backend API URL variable.

Set `NEXT_PUBLIC_DOCTOR_APP_URL` in the marketing app to the doctor app's origin so the homepage signup button works outside local development.

PostHog runs only in the marketing app. Set `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` in `apps/web/.env.local` for browser analytics. The doctor app does not use PostHog.

Start an app with `pnpm --filter @clinsight/doctor dev`, `pnpm --filter @clinsight/web dev`, or the corresponding patient/admin package. Run `pnpm typecheck` and `pnpm lint` to check the workspace.

If Turbopack fails to compile the doctor app locally, run `pnpm --filter @clinsight/doctor exec next dev --webpack -p 3001` instead.
