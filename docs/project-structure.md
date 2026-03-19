# Project Structure

This document describes the folder layout, file placement rules, and naming conventions for the project. Follow this structure exactly when creating or moving files.

## Top-Level Layout

```
linkshortenerproject/
├── app/                    # Next.js App Router — routes, layouts, pages, and global styles
├── components/
│   └── ui/                 # shadcn/ui generated components (do not edit manually)
├── db/
│   ├── index.ts            # Drizzle client singleton
│   └── schema.ts           # Database schema definitions
├── docs/                   # LLM agent instruction files (this directory)
├── drizzle/                # Auto-generated migration files (drizzle-kit output, do not edit manually)
├── lib/
│   └── utils.ts            # Shared utilities (cn() helper lives here)
├── public/                 # Static assets served at /
├── AGENTS.md               # Agent entry point
├── components.json         # shadcn/ui CLI configuration
├── drizzle.config.ts       # Drizzle Kit configuration
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js configuration
├── package.json
├── postcss.config.mjs
├── proxy.ts                # Clerk middleware (rename to middleware.ts if needed)
└── tsconfig.json
```

## App Router Conventions

The `app/` directory follows Next.js App Router file-system routing.

```
app/
├── globals.css             # Tailwind CSS v4 directives and CSS variables (design tokens)
├── layout.tsx              # Root layout — wraps the entire app in ClerkProvider
├── page.tsx                # Home page (/)
├── (auth)/                 # Route group for Clerk sign-in/sign-up pages (no layout nesting)
│   ├── sign-in/[[...sign-in]]/page.tsx
│   └── sign-up/[[...sign-up]]/page.tsx
├── dashboard/              # Protected dashboard routes
│   ├── layout.tsx          # Dashboard layout (applies auth guard)
│   └── page.tsx
└── [slug]/                 # Dynamic redirect route — resolves short codes to destination URLs
    └── page.tsx
```

### Special Files

| File | Purpose |
|------|---------|
| `layout.tsx` | Shared UI shell for a segment and all its children |
| `page.tsx` | Leaf UI for a route segment; makes the route publicly accessible |
| `loading.tsx` | Suspense boundary skeleton shown while a segment loads |
| `error.tsx` | Error boundary for a segment |
| `not-found.tsx` | Renders when `notFound()` is thrown in a Server Component |
| `route.ts` | API Route Handler (replaces `pages/api/`) |

## Server Actions

Server Actions live in `app/actions/` (or co-located with the component that exclusively uses them as `actions.ts`). They are **never** exported from a `route.ts` file.

```
app/
└── actions/
    └── links.ts        # Server Actions for creating, updating, and deleting links
```

## Components

```
components/
├── ui/                 # shadcn/ui primitives — installed via CLI, treat as read-only
└── <feature>/          # Feature-level components grouped by domain
    └── link-card.tsx
```

- **Naming:** PascalCase for component files and their default export (`LinkCard.tsx` / `export default function LinkCard`).
- **Barrel files:** Avoid `index.ts` barrel re-exports inside `components/`; import directly from the source file.

## Naming Conventions

| Artifact | Convention | Example |
|----------|-----------|---------|
| React component file | `kebab-case.tsx` | `link-card.tsx` |
| React component export | `PascalCase` | `export default function LinkCard` |
| Server Action file | `kebab-case.ts` | `links.ts` |
| Server Action function | `camelCase` | `createLink`, `deleteLink` |
| Route Handler file | `route.ts` | `app/api/links/route.ts` |
| Drizzle table variable | `camelCase` | `links`, `users` |
| Drizzle table name (DB) | `snake_case` | `links`, `users` |
| CSS class names | Tailwind utilities only | no custom class names |
| Hook file | `use-<name>.ts` | `use-links.ts` |
| Hook export | `camelCase` | `export function useLinks` |

## Path Aliases

All imports use the `@/` alias which resolves to the project root:

```ts
import { db } from "@/db";
import { links } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
```

Never use relative paths that traverse up more than one level (`../../`).
