/**
 * lib/cms/categories.ts
 * Category CRUD helpers.
 */
import { db, initDB } from '../db';
import { categories } from '../schema';
import { eq, or } from 'drizzle-orm';
import slugifyFn from 'slugify';

export function slugifyCategory(name: string): string {
  return slugifyFn(name, { lower: true, strict: true });
}

export function listCategories() {
  initDB();
  return db.select().from(categories).all();
}

export function getCategoryBySlug(slug: string) {
  initDB();
  return db.select().from(categories).where(eq(categories.slug, slug)).get();
}

export function getCategoryByNameOrSlug(nameOrSlug: string) {
  initDB();
  const slug = slugifyCategory(nameOrSlug);
  return db.select().from(categories)
    .where(or(eq(categories.slug, slug), eq(categories.name, nameOrSlug)))
    .get() ?? null;
}

export function upsertCategory(name: string, description?: string) {
  initDB();
  const slug = slugifyCategory(name);
  const existing = getCategoryBySlug(slug);
  if (existing) return existing;

  return db.insert(categories).values({ name, slug, description }).returning().get();
}

export function seedDefaultCategories() {
  initDB();
  const defaults = [
    { name: 'Engineering',  slug: 'engineering',  description: 'Inference, audio systems, model tuning, and production pipelines.' },
    { name: 'Product',      slug: 'product',      description: 'Features, workflows, creative tools, and new releases.' },
    { name: 'Culture',      slug: 'culture',      description: 'Music identity, internet-native genres, and evolving scenes.' },
    { name: 'Scene Radar',  slug: 'scene-radar',  description: 'Fast reads on hype, virality, creator behavior, and trend motion.' },
    { name: 'Archive',      slug: 'archive',      description: 'Origins, genre memory, and the sounds behind today\'s signals.' },
  ];

  for (const cat of defaults) {
    const exists = getCategoryBySlug(cat.slug);
    if (!exists) {
      db.insert(categories).values(cat).run();
    }
  }
}
