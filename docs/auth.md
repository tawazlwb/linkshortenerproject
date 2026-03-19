# Authentication

Authentication is handled exclusively by **Clerk** (`@clerk/nextjs` v7). Do not implement custom session management, JWT handling, or auth middleware outside of Clerk.

## ClerkProvider

The root layout wraps the entire app in `<ClerkProvider>`. This is already configured in `app/layout.tsx` and must never be removed.

```tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
```

## Middleware

Clerk middleware is configured in `proxy.ts` (effectively `middleware.ts`) at the project root. It protects routes by intercepting every request.

```ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

> **Note:** If Next.js does not pick up `proxy.ts`, rename it to `middleware.ts`.

### Protecting Routes with `createRouteMatcher`

Use `createRouteMatcher` to define which routes require authentication:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api/links(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});
```

## Reading Auth State

### In Server Components and Server Actions

Use the async `auth()` helper from `@clerk/nextjs/server`:

```ts
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // userId is now guaranteed to be a string
}
```

Use `currentUser()` when you need the full user object (name, email, image):

```ts
import { currentUser } from "@clerk/nextjs/server";

const user = await currentUser();
// user.firstName, user.emailAddresses, etc.
```

### In Client Components

Use the `useAuth()` and `useUser()` hooks:

```tsx
"use client";

import { useAuth, useUser } from "@clerk/nextjs";

export function ProfileButton() {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  ...
}
```

## UI Components

Use the Clerk-provided UI components for sign-in/sign-up flows. Do not build custom auth forms.

```tsx
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

// Header example
<header>
  <SignedOut>
    <SignInButton />
    <SignUpButton />
  </SignedOut>
  <SignedIn>
    <UserButton />
  </SignedIn>
</header>
```

> In Clerk v7, `Show` can be used instead of `SignedIn`/`SignedOut` (as seen in `layout.tsx`). Both patterns are acceptable.

### Dedicated Auth Pages

Host Clerk's pre-built pages at the standard paths:

```
app/
└── (auth)/
    ├── sign-in/
    │   └── [[...sign-in]]/
    │       └── page.tsx
    └── sign-up/
        └── [[...sign-up]]/
            └── page.tsx
```

```tsx
// app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return <SignIn />;
}
```

## Security Rules

- **Never trust `userId` from the client.** Always obtain it server-side via `auth()`.
- **Always call `auth.protect()` or check `userId` before any database query** in a Server Action or Route Handler that accesses user-specific data.
- Do not pass the Clerk secret key (`CLERK_SECRET_KEY`) to the client. It must not appear in any `NEXT_PUBLIC_` variable.

## Required Environment Variables

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

These must be defined in `.env.local` and never committed to version control.
