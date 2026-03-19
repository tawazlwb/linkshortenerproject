# Database

All database logic uses **Drizzle ORM** with **Neon PostgreSQL** (serverless). Raw SQL strings are forbidden.

## Client Setup

The Drizzle client is a singleton exported from `db/index.ts`:

```ts
import { drizzle } from "drizzle-orm/neon-http";

const db = drizzle(process.env.DATABASE_URL!);

export { db };
```

- The `DATABASE_URL` environment variable must be set in `.env.local`.
- Import `db` exclusively from `@/db` — never instantiate Drizzle elsewhere.

## Schema

All table definitions live in `db/schema.ts`. Use Drizzle's `pgTable` builder with Neon-compatible column types.

### Conventions

- Table variable names: `camelCase` (e.g., `links`, `users`)
- Table names in the database: `snake_case` (e.g., `"links"`, `"users"`)
- Column names: `snake_case` in the DB, `camelCase` in the schema object via `.notNull()`, `.default()`, etc.
- Always define a primary key using `uuid('id').primaryKey().defaultRandom()` or `serial('id').primaryKey()`.
- Timestamps: use `timestamp('created_at').notNull().defaultNow()` and `timestamp('updated_at').notNull().defaultNow()`.

### Example Schema

```ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),       // Clerk user ID
  slug: text("slug").notNull().unique(),   // the short code
  url: text("url").notNull(),              // destination URL
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
```

- **Always export `$inferSelect` and `$inferInsert` types** alongside each table.
- Never duplicate these types manually — always derive them from the schema.

## Drizzle Kit (Migrations)

Migrations are managed by `drizzle-kit`. The configuration is in `drizzle.config.ts`:

```ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Migration Workflow

```bash
# Generate a new migration after schema changes
npx drizzle-kit generate

# Apply pending migrations to the database
npx drizzle-kit migrate

# Open Drizzle Studio (visual DB browser)
npx drizzle-kit studio
```

- **Never edit files in the `drizzle/` folder manually.** They are auto-generated.
- Commit generated migration files — they are the source of truth for schema history.

## Query Patterns

Use Drizzle's query builder API. All queries are fully typed from the schema.

### Select

```ts
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

// All links for a user
const userLinks = await db
  .select()
  .from(links)
  .where(eq(links.userId, userId));

// Single link by slug
const [link] = await db
  .select()
  .from(links)
  .where(eq(links.slug, slug))
  .limit(1);
```

### Insert

```ts
const [newLink] = await db
  .insert(links)
  .values({ userId, slug, url })
  .returning();
```

### Update

```ts
await db
  .update(links)
  .set({ url, updatedAt: new Date() })
  .where(eq(links.id, id));
```

### Delete

```ts
await db
  .delete(links)
  .where(eq(links.id, id));
```

### Rules

- **Always destructure the first element** when `RETURNING` a single row (`const [row] = await db.insert(...).returning()`).
- Use `eq`, `and`, `or`, `not`, `like`, `gte`, `lte` from `drizzle-orm` — never string conditions.
- Never run queries in Client Components. Queries belong in Server Components, Server Actions, or Route Handlers.
