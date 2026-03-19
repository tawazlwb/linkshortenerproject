# Authentication — Clerk

All authentication in this project is handled exclusively by **Clerk**. No other auth library, custom session logic, or JWT handling is permitted.

## Rules

- `<ClerkProvider>` must wrap the entire app in `app/layout.tsx`.
- Never implement custom sign-in/sign-up forms. Always delegate to Clerk components.
- Never read or set auth cookies manually. Use Clerk's helpers (`auth()`, `currentUser()`, `useAuth()`, `useUser()`).
- Server-side auth checks use `auth()` from `@clerk/nextjs/server` inside Server Components and Route Handlers.
- Client-side auth state uses `useAuth()` or `useUser()` from `@clerk/nextjs` (requires `"use client"`).

## Route Protection

- `/dashboard` is a **protected route**. Access requires an authenticated session.
- Protection is enforced via `clerkMiddleware` in `proxy.ts` (Next.js 16 uses `proxy.ts` instead of `middleware.ts`), using `createRouteMatcher`:

```ts
// proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

> **Never use `auth.protect()`** — it redirects to Clerk's hosted sign-in page. Always redirect to `/` instead so that sign-in opens as a modal.

## Redirects

- If a **signed-in** user visits `/`, they must be redirected to `/dashboard`.
- Use `auth()` in the `/` page Server Component to check auth state and call `redirect("/dashboard")`.

```ts
// app/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");
  // render landing page...
}
```

## Modal Sign-In / Sign-Up

- Sign-in and sign-up must always open as a **modal**, never on a separate page.
- Use `<SignInButton mode="modal">` and `<SignUpButton mode="modal">` from `@clerk/nextjs`.
- Do **not** create `/sign-in` or `/sign-up` route pages.

```tsx
<SignInButton mode="modal" forceRedirectUrl="/dashboard">
  <Button>Sign In</Button>
</SignInButton>

<SignUpButton mode="modal" forceRedirectUrl="/dashboard">
  <Button>Sign Up</Button>
</SignUpButton>
```

## User Button

- Use `<UserButton />` from `@clerk/nextjs` for the signed-in user menu. Do not build a custom one.

## Environment Variables

The following variables are required in `.env.local` (never hard-coded):

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```
