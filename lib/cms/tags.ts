/**
 * lib/cms/tags.ts
 * Tag CRUD helpers.
 */
import { db, initDB } from '../db';
import { tags, postTags } from '../schema';
import { eq, inArray } from 'drizzle-orm';
import slugifyFn from 'slugify';

export function slugifyTag(name: string): string {
  return slugifyFn(name, { lower: true, strict: true });
}

/** Find or create tags by name. Returns array of tag rows. */
export function upsertTags(names: string[]) {
  initDB();
  return names.map(name => {
    const slug = slugifyTag(name);
    const existing = db.select().from(tags).where(eq(tags.slug, slug)).get();
    if (existing) return existing;
    return db.insert(tags).values({ name: name.trim(), slug }).returning().get();
  });
}

/** Replace all tags on a post. */
export function setPostTags(postId: number, tagNames: string[]) {
  initDB();
  // Remove existing
  db.delete(postTags).where(eq(postTags.postId, postId)).run();
  if (!tagNames.length) return;
  // Upsert tags
  const tagRows = upsertTags(tagNames);
  // Insert junctions
  for (const tag of tagRows) {
    db.insert(postTags).values({ postId, tagId: tag.id }).run();
  }
}

/** Get tag names for a post. */
export function getPostTagNames(postId: number): string[] {
  initDB();
  const rows = db
    .select({ name: tags.name })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, postId))
    .all();
  return rows.map(r => r.name);
}

export function listTags() {
  initDB();
  return db.select().from(tags).all();
}
