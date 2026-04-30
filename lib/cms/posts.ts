/**
 * lib/cms/posts.ts
 * Core post CRUD + workflow logic.
 */
import { db, initDB } from '../db';
import { posts, categories, authors } from '../schema';
import { eq, desc, and, lte, not, inArray, sql } from 'drizzle-orm';
import { setPostTags, getPostTagNames } from './tags';
import { getCategoryByNameOrSlug } from './categories';
import { writeAuditLog } from './audit';
import slugifyFn from 'slugify';

export function slugifyPost(title: string): string {
  return slugifyFn(title, { lower: true, strict: true });
}

/** Auto-calculate reading time from markdown word count. */
export function calcReadingTime(markdown: string): string {
  const words = markdown.trim().split(/\s+/).length;
  const mins  = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

/** Ensure a slug is unique by appending -2, -3 etc. */
export function uniqueSlug(base: string, excludeId?: number): string {
  initDB();
  let candidate = base;
  let n = 1;
  while (true) {
    const existing = db.select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, candidate))
      .get();
    if (!existing || (excludeId && existing.id === excludeId)) return candidate;
    n++;
    candidate = `${base}-${n}`;
  }
}

export type PostStatus = 'draft' | 'review' | 'scheduled' | 'published' | 'archived';
export type SourceType = 'manual' | 'ai_agent' | 'import';

export interface CreatePostInput {
  title:            string;
  slug?:            string;
  excerpt?:         string;
  contentMarkdown?: string;
  coverImageUrl?:   string;
  coverImageAlt?:   string;
  categoryName?:    string;
  tags?:            string[];
  status?:          PostStatus;
  featured?:        boolean;
  authorName?:      string;
  seoTitle?:        string;
  metaDescription?: string;
  canonicalUrl?:    string;
  ogImageUrl?:      string;
  publishedAt?:     string;
  scheduledAt?:     string;
  sourceType?:      SourceType;
  sourceReference?: string;
  aiSummary?:       string;
  aiPromptVersion?: string;
  locale?:          string;
}

/** Find or create a default author. */
function resolveAuthor(name: string): number {
  const slug = slugifyFn(name, { lower: true, strict: true });
  const existing = db.select({ id: authors.id }).from(authors).where(eq(authors.slug, slug)).get();
  if (existing) return existing.id;
  const row = db.insert(authors).values({ name, slug, role: 'contributor' }).returning({ id: authors.id }).get();
  return row.id;
}

/** Create a new post. */
export function createPost(input: CreatePostInput, actorType: 'admin_user' | 'ai_agent' | 'system' = 'system', actorId?: string) {
  initDB();

  const slug       = uniqueSlug(input.slug || slugifyPost(input.title));
  const readingTime = input.contentMarkdown ? calcReadingTime(input.contentMarkdown) : '1 min read';
  const authorId   = resolveAuthor(input.authorName || 'Sonic Velocity');

  let categoryId: number | undefined;
  if (input.categoryName) {
    const cat = getCategoryByNameOrSlug(input.categoryName);
    if (cat) categoryId = cat.id;
  }

  const now = new Date().toISOString();
  const status  = input.status || 'draft';
  const publishedAt = (status === 'published') ? (input.publishedAt || now) : input.publishedAt;

  const row = db.insert(posts).values({
    title:           input.title,
    slug,
    excerpt:         input.excerpt,
    contentMarkdown: input.contentMarkdown,
    coverImageUrl:   input.coverImageUrl,
    coverImageAlt:   input.coverImageAlt,
    categoryId,
    status,
    featured:        input.featured ? 1 : 0,
    readingTime,
    authorId,
    seoTitle:        input.seoTitle,
    metaDescription: input.metaDescription,
    canonicalUrl:    input.canonicalUrl,
    ogImageUrl:      input.ogImageUrl,
    publishedAt,
    scheduledAt:     input.scheduledAt,
    sourceType:      input.sourceType || 'manual',
    sourceReference: input.sourceReference,
    aiSummary:       input.aiSummary,
    aiPromptVersion: input.aiPromptVersion,
    locale:          input.locale || 'en',
  }).returning().get();

  // Assign tags
  if (input.tags?.length) setPostTags(row.id, input.tags);

  writeAuditLog({ entityType: 'post', entityId: row.id, action: 'create', actorType, actorId, after: row });
  return row;
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: number;
}

/** Update a post. */
export function updatePost(input: UpdatePostInput, actorType: 'admin_user' | 'ai_agent' | 'system' = 'admin_user', actorId?: string) {
  initDB();
  const { id, ...rest } = input;

  const before = db.select().from(posts).where(eq(posts.id, id)).get();
  if (!before) throw new Error(`Post ${id} not found`);

  const updates: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };

  if (rest.title !== undefined)            updates.title           = rest.title;
  if (rest.slug  !== undefined)            updates.slug            = uniqueSlug(rest.slug, id);
  if (rest.excerpt !== undefined)          updates.excerpt         = rest.excerpt;
  if (rest.contentMarkdown !== undefined) {
    updates.contentMarkdown = rest.contentMarkdown;
    updates.readingTime     = calcReadingTime(rest.contentMarkdown);
  }
  if (rest.coverImageUrl !== undefined)   updates.coverImageUrl   = rest.coverImageUrl;
  if (rest.coverImageAlt !== undefined)   updates.coverImageAlt   = rest.coverImageAlt;
  if (rest.status !== undefined) {
    updates.status = rest.status;
    if (rest.status === 'published' && !before.publishedAt) {
      updates.publishedAt = new Date().toISOString();
    }
  }
  if (rest.featured !== undefined)        updates.featured        = rest.featured ? 1 : 0;
  if (rest.seoTitle !== undefined)        updates.seoTitle        = rest.seoTitle;
  if (rest.metaDescription !== undefined) updates.metaDescription = rest.metaDescription;
  if (rest.canonicalUrl !== undefined)    updates.canonicalUrl    = rest.canonicalUrl;
  if (rest.scheduledAt !== undefined)     updates.scheduledAt     = rest.scheduledAt;
  if (rest.categoryName !== undefined) {
    const cat = getCategoryByNameOrSlug(rest.categoryName);
    if (cat) updates.categoryId = cat.id;
  }

  const row = db.update(posts).set(updates as any).where(eq(posts.id, id)).returning().get();

  if (rest.tags !== undefined) setPostTags(id, rest.tags);

  writeAuditLog({ entityType: 'post', entityId: id, action: 'update', actorType, actorId, before, after: row });
  return row;
}

/** Publish a post immediately. */
export function publishPost(id: number, actorType: 'admin_user' | 'ai_agent' | 'system' = 'admin_user', actorId?: string) {
  initDB();
  const now = new Date().toISOString();
  const row = db.update(posts).set({ status: 'published', publishedAt: now, updatedAt: now }).where(eq(posts.id, id)).returning().get();
  writeAuditLog({ entityType: 'post', entityId: id, action: 'publish', actorType, actorId, after: row });
  return row;
}

/** Auto-publish a post (trusted AI agent with auto_publish scope). */
export function autoPublishPost(id: number, actorId?: string) {
  initDB();
  const now = new Date().toISOString();
  const row = db.update(posts).set({ status: 'published', publishedAt: now, updatedAt: now }).where(eq(posts.id, id)).returning().get();
  writeAuditLog({ entityType: 'post', entityId: id, action: 'auto_published', actorType: 'ai_agent', actorId, after: row });
  return row;
}

/** Schedule a post. */
export function schedulePost(id: number, scheduledAt: string, actorType: 'admin_user' | 'ai_agent' = 'admin_user', actorId?: string) {
  initDB();
  const row = db.update(posts).set({ status: 'scheduled', scheduledAt, updatedAt: new Date().toISOString() }).where(eq(posts.id, id)).returning().get();
  writeAuditLog({ entityType: 'post', entityId: id, action: 'schedule', actorType, actorId, after: row });
  return row;
}

/** Archive a post. */
export function archivePost(id: number, actorType: 'admin_user' | 'ai_agent' | 'system' = 'admin_user') {
  initDB();
  db.update(posts).set({ status: 'archived', updatedAt: new Date().toISOString() }).where(eq(posts.id, id)).run();
  writeAuditLog({ entityType: 'post', entityId: id, action: 'archive', actorType });
}

/** Auto-publish any scheduled posts whose scheduledAt <= now. Called on every public page render. */
export function processScheduledPosts() {
  initDB();
  const now = new Date().toISOString();
  const due = db.select({ id: posts.id }).from(posts)
    .where(and(eq(posts.status, 'scheduled'), lte(posts.scheduledAt, now)))
    .all();
  for (const { id } of due) {
    db.update(posts).set({ status: 'published', publishedAt: now, updatedAt: now }).where(eq(posts.id, id)).run();
    writeAuditLog({ entityType: 'post', entityId: id, action: 'auto_scheduled_publish', actorType: 'system' });
  }
}

/** Get a post with its tags and category (public — only published). */
export function getPublishedPost(slug: string, locale?: string) {
  initDB();
  processScheduledPosts();
  const now = new Date().toISOString();
  
  const conditions = [eq(posts.slug, slug), eq(posts.status, 'published'), lte(posts.publishedAt!, now)];
  if (locale) conditions.push(eq(posts.locale, locale));

  const post = db.select().from(posts)
    .where(and(...conditions))
    .get();
  if (!post) return null;

  const tagNames = getPostTagNames(post.id);
  let category: { name: string; slug: string } | null = null;
  if (post.categoryId) {
    const cat = db.select({ name: categories.name, slug: categories.slug }).from(categories).where(eq(categories.id, post.categoryId)).get();
    if (cat) category = cat;
  }
  let author: { name: string } | null = null;
  if (post.authorId) {
    const a = db.select({ name: authors.name }).from(authors).where(eq(authors.id, post.authorId)).get();
    if (a) author = a;
  }
  return { ...post, tags: tagNames, category, author };
}

/** List published posts. */
export function listPublishedPosts(opts?: { categorySlug?: string; locale?: string; limit?: number; offset?: number; search?: string }) {
  initDB();
  processScheduledPosts();
  const now = new Date().toISOString();

  let catId: number | undefined;
  if (opts?.categorySlug) {
    const cat = db.select({ id: categories.id }).from(categories).where(eq(categories.slug, opts.categorySlug)).get();
    catId = cat?.id;
  }

  const conditions = [eq(posts.status, 'published'), lte(posts.publishedAt!, now)];
  if (catId !== undefined) conditions.push(eq(posts.categoryId!, catId));
  if (opts?.locale) conditions.push(eq(posts.locale, opts.locale));
  if (opts?.search) {
    const q = `%${opts.search}%`;
    conditions.push(sql`(${posts.title} LIKE ${q} OR ${posts.excerpt} LIKE ${q} OR ${posts.contentMarkdown} LIKE ${q})`);
  }

  const rows = db.select({
    id: posts.id, title: posts.title, slug: posts.slug, excerpt: posts.excerpt,
    coverImageUrl: posts.coverImageUrl, coverImageAlt: posts.coverImageAlt,
    featured: posts.featured, readingTime: posts.readingTime,
    publishedAt: posts.publishedAt, sourceType: posts.sourceType,
    categoryId: posts.categoryId,
    categoryName: categories.name, categorySlug: categories.slug,
    authorName: authors.name,
  })
  .from(posts)
  .leftJoin(categories, eq(posts.categoryId, categories.id))
  .leftJoin(authors, eq(posts.authorId, authors.id))
  .where(and(...conditions))
  .orderBy(desc(posts.featured), desc(posts.publishedAt))
  .limit(opts?.limit ?? 50)
  .offset(opts?.offset ?? 0)
  .all();

  return rows.map(r => ({
    ...r,
    tags: getPostTagNames(r.id),
    category: r.categoryName ? { name: r.categoryName, slug: r.categorySlug! } : null,
    author:   r.authorName ? { name: r.authorName } : null,
  }));
}

/** Admin: list all posts with filters. */
export function adminListPosts(opts?: { status?: string; limit?: number; offset?: number }) {
  initDB();
  const rows = db.select({
    id: posts.id, title: posts.title, slug: posts.slug,
    status: posts.status, featured: posts.featured,
    readingTime: posts.readingTime, publishedAt: posts.publishedAt,
    createdAt: posts.createdAt, updatedAt: posts.updatedAt,
    sourceType: posts.sourceType, sourceReference: posts.sourceReference,
    categoryId: posts.categoryId,
    categoryName: categories.name,
    authorName: authors.name,
  })
  .from(posts)
  .leftJoin(categories, eq(posts.categoryId, categories.id))
  .leftJoin(authors, eq(posts.authorId, authors.id))
  .where(opts?.status ? eq(posts.status, opts.status) : undefined)
  .orderBy(desc(posts.updatedAt))
  .limit(opts?.limit ?? 100)
  .offset(opts?.offset ?? 0)
  .all();

  return rows;
}

/** Admin: get full post by id. */
export function adminGetPost(id: number) {
  initDB();
  const post = db.select().from(posts).where(eq(posts.id, id)).get();
  if (!post) return null;
  return { ...post, tags: getPostTagNames(post.id) };
}

/** Admin stats. */
export function getPostStats() {
  initDB();
  const all = db.select({ status: posts.status, sourceType: posts.sourceType }).from(posts).all();
  const stats = { total: all.length, draft: 0, review: 0, scheduled: 0, published: 0, archived: 0, ai: 0 };
  for (const r of all) {
    if (r.status in stats) (stats as any)[r.status]++;
    if (r.sourceType === 'ai_agent') stats.ai++;
  }
  return stats;
}
