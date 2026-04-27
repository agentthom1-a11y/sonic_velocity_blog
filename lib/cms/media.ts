/**
 * lib/cms/media.ts
 * Media asset helpers.
 */
import { db, initDB } from '../db';
import { mediaAssets } from '../schema';
import { eq, desc } from 'drizzle-orm';

export function listMedia(limit = 50) {
  initDB();
  return db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)).limit(limit).all();
}

export function registerMediaAsset(opts: {
  fileName: string;
  fileUrl: string;
  mimeType?: string;
  altText?: string;
  width?: number;
  height?: number;
  uploadedBy?: string;
}) {
  initDB();
  return db.insert(mediaAssets).values(opts).returning().get();
}

export function deleteMediaAsset(id: number) {
  initDB();
  db.delete(mediaAssets).where(eq(mediaAssets.id, id)).run();
}
