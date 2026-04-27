/**
 * lib/schema.ts
 * Drizzle schema definitions — mirrors the SQL in db.ts.
 * Used for type-safe query building.
 */
import { sqliteTable, integer, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const categories = sqliteTable('categories', {
  id:          integer('id').primaryKey({ autoIncrement: true }),
  name:        text('name').notNull(),
  slug:        text('slug').notNull().unique(),
  description: text('description'),
  createdAt:   text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt:   text('updated_at').notNull().default(sql`(datetime('now'))`),
});

export const authors = sqliteTable('authors', {
  id:          integer('id').primaryKey({ autoIncrement: true }),
  name:        text('name').notNull(),
  slug:        text('slug').notNull().unique(),
  bio:         text('bio'),
  avatarUrl:   text('avatar_url'),
  role:        text('role').default('contributor'),
  socialLinks: text('social_links'),
  createdAt:   text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt:   text('updated_at').notNull().default(sql`(datetime('now'))`),
});

export const posts = sqliteTable('posts', {
  id:               integer('id').primaryKey({ autoIncrement: true }),
  title:            text('title').notNull(),
  slug:             text('slug').notNull().unique(),
  excerpt:          text('excerpt'),
  contentMarkdown:  text('content_markdown'),
  coverImageUrl:    text('cover_image_url'),
  coverImageAlt:    text('cover_image_alt'),
  categoryId:       integer('category_id').references(() => categories.id),
  status:           text('status').notNull().default('draft'),
  featured:         integer('featured').notNull().default(0),
  readingTime:      text('reading_time'),
  authorId:         integer('author_id').references(() => authors.id),
  seoTitle:         text('seo_title'),
  metaDescription:  text('meta_description'),
  canonicalUrl:     text('canonical_url'),
  ogImageUrl:       text('og_image_url'),
  publishedAt:      text('published_at'),
  scheduledAt:      text('scheduled_at'),
  createdAt:        text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt:        text('updated_at').notNull().default(sql`(datetime('now'))`),
  deletedAt:        text('deleted_at'),
  sourceType:       text('source_type').notNull().default('manual'),
  sourceReference:  text('source_reference'),
  aiSummary:        text('ai_summary'),
  aiPromptVersion:  text('ai_prompt_version'),
});

export const tags = sqliteTable('tags', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  name:      text('name').notNull(),
  slug:      text('slug').notNull().unique(),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

export const postTags = sqliteTable('post_tags', {
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  tagId:  integer('tag_id').notNull().references(() => tags.id,  { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.postId, t.tagId] }),
}));

export const mediaAssets = sqliteTable('media_assets', {
  id:         integer('id').primaryKey({ autoIncrement: true }),
  fileName:   text('file_name').notNull(),
  fileUrl:    text('file_url').notNull(),
  mimeType:   text('mime_type'),
  altText:    text('alt_text'),
  width:      integer('width'),
  height:     integer('height'),
  uploadedBy: text('uploaded_by'),
  createdAt:  text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const auditLogs = sqliteTable('audit_logs', {
  id:         integer('id').primaryKey({ autoIncrement: true }),
  entityType: text('entity_type').notNull(),
  entityId:   text('entity_id'),
  action:     text('action').notNull(),
  actorType:  text('actor_type').notNull().default('system'),
  actorId:    text('actor_id'),
  beforeJson: text('before_json'),
  afterJson:  text('after_json'),
  createdAt:  text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const apiKeys = sqliteTable('api_keys', {
  id:         integer('id').primaryKey({ autoIncrement: true }),
  name:       text('name').notNull(),
  keyHash:    text('key_hash').notNull().unique(),
  status:     text('status').notNull().default('active'),
  scopes:     text('scopes').notNull().default('["write"]'),
  lastUsedAt: text('last_used_at'),
  createdAt:  text('created_at').notNull().default(sql`(datetime('now'))`),
  expiresAt:  text('expires_at'),
});

// Inferred types
export type Post         = typeof posts.$inferSelect;
export type NewPost      = typeof posts.$inferInsert;
export type Category     = typeof categories.$inferSelect;
export type NewCategory  = typeof categories.$inferInsert;
export type Tag          = typeof tags.$inferSelect;
export type Author       = typeof authors.$inferSelect;
export type MediaAsset   = typeof mediaAssets.$inferSelect;
export type AuditLog     = typeof auditLogs.$inferSelect;
export type ApiKey       = typeof apiKeys.$inferSelect;
