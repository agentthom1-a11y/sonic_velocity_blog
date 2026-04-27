/**
 * lib/db.ts
 * Drizzle ORM singleton backed by better-sqlite3.
 * NODE.JS RUNTIME ONLY — never import in Edge middleware.
 */
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_URL?.replace('file:', '')
  ?? path.join(process.cwd(), 'data', 'cms.db');

// Ensure the data directory exists
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const sqlite = new Database(DB_PATH);

// Performance tuning for SQLite
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });

/** Run schema creation on cold start */
export function initDB() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL,
      slug       TEXT    NOT NULL UNIQUE,
      description TEXT,
      created_at TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS authors (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      name         TEXT    NOT NULL,
      slug         TEXT    NOT NULL UNIQUE,
      bio          TEXT,
      avatar_url   TEXT,
      role         TEXT    DEFAULT 'contributor',
      social_links TEXT,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      title               TEXT    NOT NULL,
      slug                TEXT    NOT NULL UNIQUE,
      excerpt             TEXT,
      content_markdown    TEXT,
      cover_image_url     TEXT,
      cover_image_alt     TEXT,
      category_id         INTEGER REFERENCES categories(id),
      status              TEXT    NOT NULL DEFAULT 'draft'
                          CHECK(status IN ('draft','review','scheduled','published','archived')),
      featured            INTEGER NOT NULL DEFAULT 0,
      reading_time        TEXT,
      author_id           INTEGER REFERENCES authors(id),
      seo_title           TEXT,
      meta_description    TEXT,
      canonical_url       TEXT,
      og_image_url        TEXT,
      published_at        TEXT,
      scheduled_at        TEXT,
      created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at          TEXT    NOT NULL DEFAULT (datetime('now')),
      deleted_at          TEXT,
      source_type         TEXT    NOT NULL DEFAULT 'manual'
                          CHECK(source_type IN ('manual','ai_agent','import')),
      source_reference    TEXT,
      ai_summary          TEXT,
      ai_prompt_version   TEXT,
      locale              TEXT    NOT NULL DEFAULT 'en'
    );

    CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
    CREATE INDEX IF NOT EXISTS idx_posts_slug   ON posts(slug);
    CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);

    CREATE TABLE IF NOT EXISTS tags (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL,
      slug       TEXT    NOT NULL UNIQUE,
      created_at TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS post_tags (
      post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      tag_id  INTEGER NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
      PRIMARY KEY (post_id, tag_id)
    );

    CREATE TABLE IF NOT EXISTS media_assets (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      file_name   TEXT    NOT NULL,
      file_url    TEXT    NOT NULL,
      mime_type   TEXT,
      alt_text    TEXT,
      width       INTEGER,
      height      INTEGER,
      uploaded_by TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT    NOT NULL,
      entity_id   TEXT,
      action      TEXT    NOT NULL,
      actor_type  TEXT    NOT NULL DEFAULT 'system'
                  CHECK(actor_type IN ('admin_user','ai_agent','system')),
      actor_id    TEXT,
      before_json TEXT,
      after_json  TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS api_keys (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      key_hash    TEXT    NOT NULL UNIQUE,
      status      TEXT    NOT NULL DEFAULT 'active'
                  CHECK(status IN ('active','revoked')),
      scopes      TEXT    NOT NULL DEFAULT '["write"]',
      last_used_at TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      expires_at  TEXT
    );
  `);
}
