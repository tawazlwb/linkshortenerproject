import { pgTable, text, varchar, timestamp, index, integer } from 'drizzle-orm/pg-core';

export const shortenedLinks = pgTable(
  'links',
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: text('user_id').notNull(),
    originalUrl: text('original_url').notNull(),
    shortCode: varchar('short_code', { length: 20 }).notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_short_code').on(table.shortCode),
    index('idx_user_id').on(table.userId),
  ]
);

// Inferred types
export type ShortenedLink = typeof shortenedLinks.$inferSelect;
export type NewShortenedLink = typeof shortenedLinks.$inferInsert;
