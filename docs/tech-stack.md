# Tech Stack

This document lists every dependency used in the project, its version, and its role. Do not introduce dependencies outside this list without explicit justification.

## Runtime Dependencies

| Package | Version | Role |
|---------|---------|------|
| `next` | 16.1.7 | Full-stack React framework (App Router). Handles routing, SSR, RSC, API routes, and middleware. |
| `react` | 19.2.3 | UI rendering library. Use React 19 APIs (`use`, `useOptimistic`, `useActionState`) where appropriate. |
| `react-dom` | 19.2.3 | DOM renderer for React. |
| `@clerk/nextjs` | ^7.0.5 | Authentication provider. Wraps the app in `<ClerkProvider>`, exposes `auth()`, `currentUser()`, and UI components. |
| `drizzle-orm` | ^0.45.1 | Type-safe ORM for all database access. Schema is defined in `db/schema.ts`. |
| `@neondatabase/serverless` | ^1.0.2 | Neon PostgreSQL serverless driver. Used as the underlying transport for Drizzle. |
| `radix-ui` | ^1.4.3 | Headless accessible UI primitives consumed by shadcn components. |
| `class-variance-authority` | ^0.7.1 | CVA — builds variant-aware class strings for component APIs. |
| `clsx` | ^2.1.1 | Conditional class name helper. Always combined with `tailwind-merge` via `cn()`. |
| `tailwind-merge` | ^3.5.0 | Deduplicates conflicting Tailwind utility classes. Used exclusively through `cn()`. |
| `lucide-react` | ^0.577.0 | Icon library. The only approved icon set; import individual icons, never the full bundle. |
| `tw-animate-css` | ^1.4.0 | Tailwind-compatible animation utilities. |
| `dotenv` | ^17.3.1 | Loads `.env.local` during Drizzle Kit CLI commands (not used in application code). |

## Dev Dependencies

| Package | Version | Role |
|---------|---------|------|
| `typescript` | ^5 | Language. Strict mode is enforced via `tsconfig.json`. |
| `drizzle-kit` | ^0.31.10 | CLI tool for generating and running Drizzle migrations. |
| `tailwindcss` | ^4 | Utility-first CSS framework. v4 configuration lives entirely in `app/globals.css`. |
| `@tailwindcss/postcss` | ^4 | PostCSS plugin for Tailwind CSS v4. |
| `eslint` | ^9 | Linter. Configuration in `eslint.config.mjs`. |
| `eslint-config-next` | 16.1.7 | Next.js ESLint rule set. |
| `tsx` | ^4.21.0 | TypeScript executor used for running Drizzle Kit and seed scripts. |
| `@types/node` | ^20 | Node.js type definitions. |
| `@types/react` | ^19 | React type definitions. |
| `@types/react-dom` | ^19 | React DOM type definitions. |

## shadcn/ui Configuration

shadcn components are installed via the `shadcn` CLI into `components/ui/`. The project configuration (`components.json`) is:

```json
{
  "style": "radix-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

> **Do not** manually edit files inside `components/ui/` unless patching a bug that cannot be fixed via composition. Re-running the shadcn CLI will overwrite manual edits.
