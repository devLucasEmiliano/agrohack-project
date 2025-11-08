# Copilot instructions for agrohack-project

Purpose: Help AI coding agents work productively in this Next.js 16 + App Router project using shadcn/ui, Radix UI, Tailwind v4.

## Architecture and routing

- App Router with RSC enabled. Global layout: `app/layout.tsx` wraps pages with `AuthProvider` and loads fonts and `app/globals.css`.
- Route groups:
  - Public: `app/(public)` contains marketing and unauthenticated flows (e.g., `auth/login`, `auth/signup`, public `register` wizard entry and `history`). Public routes must not redirect; authenticated users may be redirected from Home in `app/page.tsx`.
  - Private: `app/(private)/dashboard/**` with its own `layout.tsx` (guards via client hook or layout). Navigation is rendered by `components/sidebar.tsx` and `components/header.tsx`.
- Client guards: Two patterns exist
  - Page guard: many pages check `useAuth()` and call `router.push("/auth/login")` in `useEffect`.
  - HOC: `lib/with-auth.tsx` can wrap client components to enforce auth.
- Optional middleware-like proxy exists in `proxy.ts` (not wired as `middleware.ts`). If you create `middleware.ts`, consider importing `proxy` from there.

## UI system and patterns

- Design system uses shadcn/ui patterns implemented locally in `components/ui` with Radix primitives. Examples:
  - Button: `components/ui/button.tsx` using `class-variance-authority` with variants: `default|destructive|outline|secondary|ghost|link` and sizes `sm|default|lg|icon|icon-sm|icon-lg`.
  - Card: `components/ui/card.tsx` with slots `CardHeader|CardTitle|CardDescription|CardAction|CardContent|CardFooter`.
  - Input: `components/ui/input.tsx`. Compose controls with Tailwind and focus ring classes.
- Utility `cn()` lives in `lib/utils.ts`.
- Icons via `lucide-react`.
- Tailwind v4 is configured purely via `app/globals.css` with CSS variables for light/dark and `@theme inline`; no `tailwind.config.{js,ts}` is present. Use semantic color tokens (e.g., `bg-card`, `text-muted-foreground`).

## Key flows

- Landing: `app/page.tsx` redirects authenticated users to `/dashboard` (client-side effect). Public landing UI in `components/landing-page.tsx`.
- Auth: `app/(public)/auth/login/page.tsx` and `.../signup/page.tsx`. On success, set `localStorage.currentUser` and navigate to `/dashboard`.
- Private dashboard shell: `app/(private)/dashboard/layout.tsx` guards + renders `Sidebar` and `Header`.
- Register wizard: `app/(public)/register/page.tsx` mounts `components/chat-bot.tsx` (multi-step form) → `components/confirmation-page.tsx` for review → saves into localStorage.

## Conventions and decisions

- Public pages must not hard-redirect unauthenticated users; only private routes perform redirects to `/auth/login`. Home may navigate authenticated users to `/dashboard`.
- Prefer client components for anything touching `localStorage` (`"use client"` pragma at file top).
- Keep route prefixes consistent: dashboard subroutes use `/dashboard/...` and public pages use root paths (`/register`, `/history`, `/auth/*`). Sidebar links point to `/dashboard/*`.
- Fonts are loaded in `app/layout.tsx`; do not duplicate.
- Use path aliases from `components.json` and `tsconfig.json` (`@/components`, `@/lib`, `@/components/ui`, etc.).

## Developing and running

- Commands:
  - Dev: `npm run dev`
  - Build: `npm run build`
  - Start: `npm run start`
  - Lint: `npm run lint`
- Node/React/Next versions from `package.json`: Next 16, React 19, Tailwind v4. Avoid APIs incompatible with these versions.
- No tests configured. If adding tests, keep them optional and colocated; avoid blocking CI.

## Adding features safely

- Access control: For new private pages, either:
  - Add them under `app/(private)/...` and guard in the layout with `useAuth`, or
  - Wrap page/component with `withAuth`.
- Data access: Use helpers in `lib/*-data.ts` or create similar modules; persist in `localStorage` with consistent keys.
- UI: Reuse shadcn components from `components/ui`. Follow existing tone: semantic colors, outlined variants for secondary actions, `ghost` for icon-only.
- Routing: Keep public pages free of redirects. If adding middleware, ensure behavior matches this rule.

## Examples

- Guarding a page: see `app/(private)/dashboard/layout.tsx`.
- Styled primary action: `<Button className="bg-primary text-primary-foreground" />`.
- Card with action: see pattern in `app/(private)/dashboard/page.tsx` and `components/ui/card.tsx`.

Notes for agents

- Before refactors, search for duplicate localStorage keys (`workHoursRecords` vs `workRecords`) and standardize.
- If introducing real APIs, replace the localStorage logic but keep the UI contract intact.
