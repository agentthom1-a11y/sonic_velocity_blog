/**
 * lib/cms/api-keys.ts
 * API key hashing, validation, and scope checking.
 * Keys are stored as HMAC-SHA256 hashes — raw key is shown only once.
 */
import { createHmac, randomBytes } from 'crypto';
import { db, initDB } from '../db';
import { apiKeys } from '../schema';
import { eq } from 'drizzle-orm';

const KEY_SECRET = process.env.SESSION_SECRET ?? 'dev-secret-change-in-production';

export type ApiScope = 'write' | 'publish' | 'auto_publish' | 'schedule' | 'delete';

/** Hash a raw key for storage. */
export function hashApiKey(rawKey: string): string {
  return createHmac('sha256', KEY_SECRET).update(rawKey).digest('hex');
}

/** Generate a new random API key (prefix + 40 hex chars). */
export function generateRawKey(): string {
  return `svk_${randomBytes(20).toString('hex')}`;
}

/** Look up an active API key by its raw value. Returns the row or null. */
export function validateApiKey(rawKey: string) {
  initDB();
  const hash = hashApiKey(rawKey);
  const row = db.select().from(apiKeys)
    .where(eq(apiKeys.keyHash, hash))
    .get();

  if (!row) return null;
  if (row.status !== 'active') return null;

  // Check expiry
  if (row.expiresAt && new Date(row.expiresAt) < new Date()) return null;

  // Update last_used_at (fire-and-forget)
  db.update(apiKeys)
    .set({ lastUsedAt: new Date().toISOString() })
    .where(eq(apiKeys.id, row.id))
    .run();

  return row;
}

/** Check if a key row has a specific scope. */
export function hasScope(keyRow: { scopes: string }, scope: ApiScope): boolean {
  try {
    const scopes: string[] = JSON.parse(keyRow.scopes);
    return scopes.includes(scope);
  } catch {
    return false;
  }
}

/** Create a new API key. Returns { raw, row } — raw is shown ONCE. */
export function createApiKey(name: string, scopes: ApiScope[], expiresAt?: string) {
  initDB();
  const raw  = generateRawKey();
  const hash = hashApiKey(raw);

  const row = db.insert(apiKeys).values({
    name,
    keyHash:   hash,
    scopes:    JSON.stringify(scopes),
    expiresAt: expiresAt ?? null,
  }).returning().get();

  return { raw, row };
}

/** List all API keys (redacted). */
export function listApiKeys() {
  initDB();
  return db.select({
    id:         apiKeys.id,
    name:       apiKeys.name,
    status:     apiKeys.status,
    scopes:     apiKeys.scopes,
    lastUsedAt: apiKeys.lastUsedAt,
    createdAt:  apiKeys.createdAt,
    expiresAt:  apiKeys.expiresAt,
  }).from(apiKeys).all();
}

/** Revoke a key by id. */
export function revokeApiKey(id: number) {
  initDB();
  db.update(apiKeys).set({ status: 'revoked' }).where(eq(apiKeys.id, id)).run();
}
