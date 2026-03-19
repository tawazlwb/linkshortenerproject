# UI Components — shadcn/ui

All UI elements in this project must use **shadcn/ui** components. Creating custom components is forbidden when a shadcn equivalent exists.

## Rules

- Always import UI components from `@/components/ui`. Never recreate what shadcn already provides.
- If a required component is not yet installed, add it with the CLI — do **not** build it manually.
- Prefer composition of existing shadcn primitives over writing new JSX from scratch.
- Icons must come from **lucide-react** (configured as the icon library in `components.json`).

## Configuration

| Setting | Value |
|---------|-------|
| Style | `radix-nova` |
| Base color | `neutral` |
| CSS variables | enabled |
| RSC | enabled |
| TSX | enabled |
| Icons | `lucide` |

Config lives in `components.json` at the project root. Do not modify it manually.

## Adding a New Component

Use the shadcn CLI to install components:

```bash
npx shadcn@latest add <component-name>
```

The component will be placed in `components/ui/` automatically.

## Usage Pattern

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Input placeholder="Enter a URL" />
        <Button>Shorten</Button>
      </CardContent>
    </Card>
  );
}
```

## Styling

- Use **Tailwind CSS utility classes** to extend or override component styles via `className`.
- Do not override shadcn CSS variables globally. Customise via `className` props or local wrappers.
- Dark mode and theming are handled through the CSS variable system defined in `app/globals.css`.
