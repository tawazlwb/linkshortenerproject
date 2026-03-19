# UI Components

This document covers how to build and compose UI using shadcn/ui, Tailwind CSS v4, Class Variance Authority (CVA), and the `cn()` utility.

## Component Library — shadcn/ui

All UI primitives come from **shadcn/ui** installed into `components/ui/`. Before building a custom component, check whether a shadcn component already covers the need.

### Installing a New shadcn Component

```bash
npx shadcn add <component-name>
```

This writes the component file into `components/ui/`. Do not copy-paste from the shadcn docs — always use the CLI to ensure consistency with the project's style configuration (`radix-nova`).

### Using shadcn Components

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LinkForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shorten a link</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="https://example.com" />
        <Button type="submit">Shorten</Button>
      </CardContent>
    </Card>
  );
}
```

### The `asChild` Pattern

shadcn components expose an `asChild` prop (from Radix UI `Slot`) to replace the underlying DOM element with a child component:

```tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Renders a Next.js Link with Button styles — no extra DOM wrapper
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
```

## The `cn()` Helper

`cn()` lives in `lib/utils.ts` and combines `clsx` (conditional classes) with `tailwind-merge` (deduplication). Always use it when composing class names.

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Usage

```tsx
import { cn } from "@/lib/utils";

// Basic conditional classes
<div className={cn("rounded-lg p-4", isActive && "bg-primary text-primary-foreground")} />

// Overriding variant classes from a parent
<Button className={cn("w-full", className)} />
```

## Class Variance Authority (CVA)

Use CVA when building a custom component that needs multiple variants. Mirror the pattern used in `components/ui/button.tsx`.

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
```

## Tailwind CSS v4

Tailwind v4 has **no `tailwind.config.js`**. All configuration is done in `app/globals.css` using CSS `@theme` directives and `@import "tailwindcss"`.

### Design Tokens

CSS variables (design tokens) are defined in `app/globals.css`. Reference them in components using Tailwind utilities that map to `--variable-name`:

```css
/* app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";

@theme {
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.145 0 0);
  --color-primary: oklch(0.205 0 0);
  --color-primary-foreground: oklch(0.985 0 0);
  /* ... */
}
```

```tsx
// Use design token utilities in components
<div className="bg-background text-foreground" />
<button className="bg-primary text-primary-foreground" />
```

### Rules

- **No inline styles.** Use Tailwind utilities and CSS variables.
- **No custom CSS class names** (no `.my-button`). Define styles via Tailwind utilities or extend `@theme` in `globals.css`.
- **No `@apply` in component files.** `@apply` is only acceptable in `globals.css` for base/reset layers.
- Use **responsive prefixes** (`sm:`, `md:`, `lg:`) for layout breakpoints, not JS media query listeners.
- Use **dark mode utilities** (`dark:`) for theme-aware styles. The app uses CSS variable-based dark mode.

## Icons

Icons come from **Lucide React**. Import individual icons by name — never import the entire library.

```tsx
import { Link2, Trash2, Copy, ExternalLink } from "lucide-react";

// Icons sized via Tailwind; the default size from button.tsx is 1rem (size-4)
<Link2 className="size-4" />
```

## Accessibility

- All interactive components from shadcn/ui are accessible by default (keyboard navigation, ARIA attributes).
- When building custom interactive elements, ensure they have a visible focus ring (`focus-visible:ring-3 focus-visible:ring-ring/50` from the Button pattern).
- Images must always have a descriptive `alt` attribute.
- Form inputs must always have an associated `<label>` or `aria-label`.
