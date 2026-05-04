# ▲ / next-forge

**Production-grade Turborepo template for Next.js apps.**

<div>
  <img src="https://img.shields.io/npm/dy/next-forge" alt="" />
  <img src="https://img.shields.io/npm/v/next-forge" alt="" />
  <img src="https://img.shields.io/github/license/vercel/next-forge" alt="" />
</div>

## Overview

[next-forge](https://github.com/vercel/next-forge) is a production-grade [Turborepo](https://turborepo.com) template for [Next.js](https://nextjs.org/) apps. It's designed to be a comprehensive starting point for building SaaS applications, providing a solid, opinionated foundation with minimal configuration required.

Built on a decade of experience building web applications, next-forge balances speed and quality to help you ship thoroughly-built products faster.

### Philosophy

next-forge is built around five core principles:

- **Fast** — Quick to build, run, deploy, and iterate on
- **Cheap** — Free to start with services that scale with you
- **Opinionated** — Integrated tooling designed to work together
- **Modern** — Latest stable features with healthy community support
- **Safe** — End-to-end type safety and robust security posture

## Demo

Experience next-forge in action:

- [Web](https://demo.next-forge.com) — Marketing website
- [App](https://app.demo.next-forge.com) — Main application
- [Storybook](https://storybook.demo.next-forge.com) — Component library
- [API](https://api.demo.next-forge.com/health) — API health check

## Features

next-forge comes with batteries included:

### Apps

- **Web** — Marketing site built with Tailwind CSS and TWBlocks
- **App** — Main application with authentication and database integration
- **API** — RESTful API with health checks and monitoring
- **Docs** — Documentation site powered by Mintlify
- **Email** — Email templates with React Email
- **Storybook** — Component development environment

### Packages

- **Authentication** — Powered by [Clerk](https://clerk.com)
- **Database** — Type-safe ORM with migrations
- **Design System** — Comprehensive component library with dark mode
- **Payments** — Subscription management via [Stripe](https://stripe.com)
- **Email** — Transactional emails via [Resend](https://resend.com)
- **Analytics** — Web ([Google Analytics](https://developers.google.com/analytics)) and product ([Posthog](https://posthog.com))
- **Observability** — Error tracking ([Sentry](https://sentry.io)), logging, and uptime monitoring ([BetterStack](https://betterstack.com))
- **Security** — Application security ([Arcjet](https://arcjet.com)), rate limiting, and secure headers
- **CMS** — Type-safe content management for blogs and documentation
- **SEO** — Metadata management, sitemaps, and JSON-LD
- **AI** — AI integration utilities
- **Webhooks** — Inbound and outbound webhook handling
- **Collaboration** — Real-time features with avatars and live cursors
- **Feature Flags** — Feature flag management
- **Cron** — Scheduled job management
- **Storage** — File upload and management
- **Internationalization** — Multi-language support
- **Notifications** — In-app notification system

## Getting Started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io) (or npm/yarn/bun)
- [Stripe CLI](https://docs.stripe.com/stripe-cli) for local webhook testing

### Installation

Create a new next-forge project:

```sh
npx next-forge@latest init
```

### Setup

1. Configure your environment variables
2. Set up required service accounts (Clerk, Stripe, Resend, etc.)
3. Run the development server

For detailed setup instructions, read the [documentation](https://www.next-forge.com/docs).

## Structure

next-forge uses a monorepo structure managed by Turborepo:

```
next-forge/
├── apps/           # Deployable applications
│   ├── web/        # Marketing website (port 3001)
│   ├── app/        # Main application (port 3025; see below)
│   ├── api/        # API server
│   ├── docs/       # Documentation
│   ├── email/      # Email templates
│   └── storybook/  # Component library
└── packages/       # Shared packages
    ├── design-system/
    ├── database/
    ├── auth/
    └── ...
```

Each app is self-contained and independently deployable. Packages are shared across apps for consistency and maintainability.

## How `apps/app` works

`apps/app` is the main **Next.js** product UI: import GitHub repositories into **Neon Postgres**, list and open them, browse a simplified file tree and README, and edit portfolio-style metadata (titles, summaries, talking points, tags, and more—see `apps/app/lib/db/schema.ts`).

### Run it locally

From `apps/app`:

```sh
pnpm dev
```

That starts Next.js with **HTTPS on port 3025** (`next dev --experimental-https -p 3025`). Neon Auth uses **Secure** cookies, so local sign-in expects HTTPS at that origin. The repo’s `apps/app/.env.example` notes that `pnpm dev:http` alone can break sessions; use `pnpm dev` for auth testing and point OAuth redirect URLs at `https://localhost:3025` when needed.

Database CLI helpers live in the same package: `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:push`, `pnpm db:studio`.

### Stack (at a glance)

| Area | Choice |
| --- | --- |
| Framework | Next.js App Router (see `apps/app/src/app/`) |
| UI | `@repo/design-system` (layout, sidebar, components) |
| Auth | Neon Auth (`@neondatabase/auth`) — server helpers in `apps/app/lib/auth/server.ts`, client provider in `apps/app/src/providers/neon-auth-provider.tsx` |
| Data | Drizzle ORM + `@neondatabase/serverless` (`apps/app/lib/db/`) |
| Client fetching | TanStack Query (`apps/app/src/providers/query-provider.tsx`) |

### Routes and layout

- **`apps/app/src/app/layout.tsx`** — Root HTML shell: theme provider, Neon Auth provider, React Query, Sonner toaster.
- **`apps/app/src/app/(dashboard)/`** — “Public” app chrome: **`AppShell`** wraps pages with **`PublicAppSidebar`** (e.g. `/repos`, `/settings`). The dashboard home **`/`** redirects to **`/repos`**.
- **`apps/app/src/app/(admin)/admin/`** — Admin UI reuses **`AppShell`** but swaps in **`AdminAppSidebar`** and shows the add-repo control in the header when the path is under `/admin`. **`apps/app/src/app/(admin)/admin/layout.tsx`** is a server layout that loads the session with `auth.getSession()` and **`redirect("/auth/sign-in")`** if the user is missing.
- **`apps/app/src/middleware.ts`** — Neon Auth middleware, matcher **`/admin/:path*`** (cookie/session handling for admin routes).
- **`apps/app/src/app/auth/[path]/page.tsx`** — Neon **`AuthView`** for sign-in and other auth screens (`generateStaticParams` from `authViewPaths`).

Sidebar and header behavior are centralized in **`apps/app/src/app/(dashboard)/app-shell.tsx`**: it uses `usePathname()` so URLs containing **`/admin`** get the admin sidebar and label; everything else uses the public sidebar.

### Data and APIs

- **Schema** — `apps/app/lib/db/schema.ts` defines tables such as **`projects`** (GitHub coordinates, README, languages, branches, filtered repo tree JSON, and editorial fields) and **`notes`**.
- **Feature code** — `apps/app/src/features/projects/` holds components, GitHub client, import/sync helpers, and repo-tree utilities used by the UI and route handlers.
- **Route handlers** — Under `apps/app/src/app/api/` (for example **`api/repos`** for list/import/sync and project CRUD, **`api/auth`** for Neon Auth, **`api/db/health`** for a DB check). GitHub calls use **`GITHUB_TOKEN`** (or **`GITHUB_ACCESS_TOKEN`**) from env.

### Environment

Copy **`apps/app/.env.example`** to **`apps/app/.env`**. You need at least **`DATABASE_URL`**, **`NEON_AUTH_BASE_URL`**, **`NEON_AUTH_COOKIE_SECRET`** (32+ characters), and a **`GITHUB_TOKEN`** if you use import or GitHub-backed features.

## Documentation

Full documentation is available at [next-forge.com/docs](https://www.next-forge.com/docs), including:

- Detailed setup guides
- Package documentation
- Migration guides for swapping providers
- Deployment instructions
- Examples and recipes

## Contributing

We welcome contributions! See the [contributing guide](https://github.com/vercel/next-forge/blob/main/.github/CONTRIBUTING.md) for details.

## Contributors

<a href="https://github.com/vercel/next-forge/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=vercel/next-forge" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

## License

MIT
