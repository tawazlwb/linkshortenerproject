# API Routes and Server Actions

Two mechanisms handle server-side logic: **Server Actions** (for UI-triggered mutations) and **Route Handlers** (for external HTTP API endpoints). Choose the right one for the use case.

## Decision Guide

| Use case | Mechanism |
|----------|-----------|
| Form submission from a Client Component | Server Action |
| Mutation triggered by a button click | Server Action |
| Redirect short URL (`/[slug]`) | Server Component with `redirect()` |
| Webhook receiver (e.g., Clerk, Stripe) | Route Handler (`route.ts`) |
| Third-party API integration | Route Handler |
| Public REST API consumed by external clients | Route Handler |

## Server Actions

Server Actions are async functions marked with `"use server"`. They run on the server and can be called directly from Client Components or Server Components.

### File Layout

```
app/
└── actions/
    └── links.ts    # All link-related mutations
```

Or co-located with a feature when used by only one component:

```
app/dashboard/
└── actions.ts
```

### Defining a Server Action

```ts
// app/actions/links.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createLink(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const url = formData.get("url") as string;
  const slug = formData.get("slug") as string;

  if (!url || !slug) throw new Error("Missing required fields");

  await db.insert(links).values({ userId, url, slug });

  redirect("/dashboard");
}

export async function deleteLink(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)));
}
```

### Calling a Server Action from a Client Component

```tsx
"use client";

import { useActionState } from "react";
import { createLink } from "@/app/actions/links";

export function CreateLinkForm() {
  const [state, action, isPending] = useActionState(createLink, null);

  return (
    <form action={action}>
      <input name="url" required />
      <input name="slug" required />
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
```

### Calling a Server Action from a Server Component

```tsx
// Server Component — pass the action directly to a form
import { createLink } from "@/app/actions/links";

export default function Page() {
  return (
    <form action={createLink}>
      <input name="url" />
      <button type="submit">Shorten</button>
    </form>
  );
}
```

### Server Action Rules

- **Always authenticate first.** Call `auth()` at the top; throw or redirect if `userId` is null.
- **Always scope DB mutations by `userId`.** Never allow a user to modify another user's data.
- **Validate all inputs** before hitting the database. Use `zod` if schema complexity warrants it.
- Server Actions must not return JSX or UI — return plain data or throw errors.
- Use `revalidatePath()` or `revalidateTag()` from `next/cache` to invalidate cached pages after a mutation.

```ts
import { revalidatePath } from "next/cache";

export async function deleteLink(id: string) {
  // ... auth + delete query
  revalidatePath("/dashboard");
}
```

## Route Handlers

Route Handlers live in `app/api/` and follow Next.js App Router file conventions (`route.ts`).

### File Layout

```
app/
└── api/
    └── links/
        └── route.ts        # GET /api/links, POST /api/links
    └── webhooks/
        └── clerk/
            └── route.ts    # POST /api/webhooks/clerk
```

### Defining a Route Handler

```ts
// app/api/links/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userLinks = await db
    .select()
    .from(links)
    .where(eq(links.userId, userId));

  return NextResponse.json(userLinks);
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { url, slug } = body as { url: string; slug: string };

  if (!url || !slug) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const [newLink] = await db
    .insert(links)
    .values({ userId, url, slug })
    .returning();

  return NextResponse.json(newLink, { status: 201 });
}
```

### Route Handler Rules

- **Always authenticate** before executing any logic. Return `401` for unauthenticated requests.
- **Always return `NextResponse.json()`** — never use `Response` directly unless you need a non-JSON response.
- **Always validate request body shape** before using the data.
- Catch errors and return appropriate HTTP status codes (`400`, `401`, `403`, `404`, `500`).
- Do not define Server Actions inside `route.ts` files.

## Short URL Redirect

The short URL redirect is handled by a dynamic Server Component page, not a Route Handler:

```ts
// app/[slug]/page.tsx
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.slug, slug))
    .limit(1);

  if (!link) notFound();

  redirect(link.url);
}
```

This approach allows Next.js to cache and statically optimize frequently accessed slugs via `generateStaticParams`.
