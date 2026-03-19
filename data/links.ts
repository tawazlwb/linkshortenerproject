import { eq } from "drizzle-orm";
import { db, shortenedLinks, type ShortenedLink } from "@/db";

export async function getUserLinks(userId: string): Promise<ShortenedLink[]> {
  const links = await db
    .select()
    .from(shortenedLinks)
    .where(eq(shortenedLinks.userId, userId))
    .orderBy(shortenedLinks.createdAt);

  return links;
}
