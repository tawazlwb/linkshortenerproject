# Coding Standards

Coding conventions for TypeScript, React, and Next.js across the entire codebase.

## TypeScript

- **Strict mode** is enforced (`"strict": true` in `tsconfig.json`). Every file must compile without errors.
- **No `any`.** Use `unknown` and narrow the type, or define a proper interface/type.
- **No `@ts-ignore` or `@ts-expect-error`** unless absolutely unavoidable and accompanied by a comment explaining why.
- **Prefer `type` over `interface`** for object shapes that will not be extended. Use `interface` only when declaration merging is intentionally needed.
- **Explicit return types on exported functions.** Internal/private helpers can rely on inference.
- **Use `satisfies`** to validate a literal against a type without widening it.

```ts
// ✅ Good
type Link = {
  id: string;
  slug: string;
  url: string;
  userId: string;
  createdAt: Date;
};

export async function getLink(slug: string): Promise<Link | null> { ... }

// ❌ Bad
export async function getLink(slug: any) { ... }
```

### Environment Variables

Always assert environment variables at the point of use with a non-null assertion (`!`) **only when the variable is guaranteed to exist at runtime** (i.e., validated in CI/deployment). For optional variables, perform an explicit check first.

```ts
// ✅ Guaranteed at runtime
const db = drizzle(process.env.DATABASE_URL!);

// ✅ Optional — check first
const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID ?? null;
```

## React

### Server vs Client Components

- **Default to Server Components.** Do not add `"use client"` unless the component:
  - Uses React hooks (`useState`, `useEffect`, `useRef`, etc.)
  - Attaches browser event listeners
  - Accesses browser-only APIs (`window`, `document`, `localStorage`)
  - Uses a third-party library that requires client context
- Place `"use client"` at the very top of the file, before all imports.
- **Never `await` inside a Client Component.** Move async logic to a Server Component or a Server Action.

### Component Authorship

- All components are **function declarations** (not arrow function expressions assigned to a variable) for the default export.

```ts
// ✅ Good
export default function LinkCard({ link }: { link: Link }) { ... }

// ❌ Bad
const LinkCard = ({ link }: { link: Link }) => { ... };
export default LinkCard;
```

- **Props** must be typed inline or via a named `type`/`interface` — never left untyped.
- **Children** must be typed as `React.ReactNode`.
- Avoid spreading `...props` onto DOM elements unless the component is explicitly a pass-through wrapper.

### Async Server Components

```ts
// ✅ Correct pattern for data-fetching Server Components
export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const userLinks = await db.select().from(links).where(eq(links.userId, userId));

  return <LinkList links={userLinks} />;
}
```

### Key Rules

- **No inline styles.** Use Tailwind utility classes exclusively.
- **No hardcoded colors, sizes, or spacing.** Reference design tokens via CSS variables or Tailwind utilities.
- **Avoid `useEffect` for data fetching.** Fetch in Server Components, Server Actions, or via `use()`.
- Use `React.Suspense` with a `fallback` around any client-side async boundary.

## Next.js

### Routing

- Use the **App Router** exclusively. Do not add anything inside `pages/`.
- Prefer `redirect()` from `next/navigation` over `router.push()` inside Server Components.
- Use `notFound()` from `next/navigation` to trigger the `not-found.tsx` boundary.

### Metadata

Define metadata in `layout.tsx` or `page.tsx` using the `Metadata` type:

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Shortener",
  description: "Shorten and manage your links.",
};
```

### Images

Always use `next/image` (`<Image />`). Never use a plain `<img>` tag unless the source is a user-supplied URL that cannot be statically optimized (in which case, set `unoptimized`).

### Links

Always use `next/link` (`<Link />`). Never use a plain `<a>` tag for internal navigation.

## General Style Rules

- **No magic numbers.** Extract named constants for any value with semantic meaning.
- **No console.log in committed code.** Use proper error handling or logging utilities.
- **Imports order:** built-in Node modules → external packages → internal `@/` aliases → relative imports. A blank line separates each group.
- **Async/await over `.then()/.catch()`** for all promise handling.
- **Error handling:** wrap top-level Server Action and Route Handler bodies in `try/catch`. Never swallow errors silently.
