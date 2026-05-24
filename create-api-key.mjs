#!/usr/bin/env node
/**
 * Create an API key for testing
 * This script creates a new API key with all necessary scopes
 */

import Database from 'better-sqlite3';
import { createHmac, randomBytes } from 'crypto';
import { existsSync } from 'fs';

const DB_PATH = './data/cms.db';
const KEY_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-in-production';

function hashApiKey(rawKey) {
  return createHmac('sha256', KEY_SECRET).update(rawKey).digest('hex');
}

function generateRawKey() {
  return `svk_${randomBytes(20).toString('hex')}`;
}

function createApiKey() {
  if (!existsSync(DB_PATH)) {
    console.error('❌ Database not found:', DB_PATH);
    console.error('💡 Run the app first to initialize the database');
    process.exit(1);
  }

  const db = new Database(DB_PATH);
  
  // Check if api_keys table exists
  const tableExists = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='api_keys'
  `).get();

  if (!tableExists) {
    console.error('❌ api_keys table not found');
    console.error('💡 Run the app first to initialize the database schema');
    process.exit(1);
  }

  // Generate new key
  const raw = generateRawKey();
  const hash = hashApiKey(raw);
  const scopes = JSON.stringify(['write', 'publish', 'auto_publish', 'schedule', 'delete']);
  const name = 'Test API Key - ' + new Date().toISOString();

  try {
    const result = db.prepare(`
      INSERT INTO api_keys (name, key_hash, scopes, status, created_at)
      VALUES (?, ?, ?, 'active', datetime('now'))
    `).run(name, hash, scopes);

    console.log('✅ API Key created successfully!');
    console.log('');
    console.log('🔑 API Key:', raw);
    console.log('📝 Name:', name);
    console.log('🎯 Scopes:', scopes);
    console.log('🆔 ID:', result.lastInsertRowid);
    console.log('');
    console.log('⚠️  IMPORTANT: Save this key now! It will not be shown again.');
    console.log('');
    console.log('💡 Add this to agents/deploy/api_key.env:');
    console.log(`SONICVELO_API_KEY=${raw}`);
    console.log('');

    db.close();
    return raw;
  } catch (err) {
    console.error('❌ Error creating API key:', err.message);
    db.close();
    process.exit(1);
  }
}

createApiKey();
