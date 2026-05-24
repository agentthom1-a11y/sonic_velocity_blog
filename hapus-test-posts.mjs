#!/usr/bin/env node
/**
 * Script untuk menghapus semua test posts
 */

import Database from 'better-sqlite3';
import { existsSync } from 'fs';

const DB_PATH = './data/cms.db';

if (!existsSync(DB_PATH)) {
  console.error('❌ Database tidak ditemukan:', DB_PATH);
  process.exit(1);
}

const db = new Database(DB_PATH);

console.log('🗑️  Menghapus semua test posts...\n');

try {
  // Ambil semua posts
  const posts = db.prepare('SELECT id, title, slug, status FROM posts ORDER BY id').all();
  
  console.log('📋 Daftar semua posts:');
  posts.forEach(post => {
    console.log(`   [${post.id}] ${post.title} (${post.status})`);
  });
  
  console.log(`\n📊 Total posts: ${posts.length}\n`);
  
  // Hapus semua posts
  const deletePostTags = db.prepare('DELETE FROM post_tags');
  const deletePosts = db.prepare('DELETE FROM posts');
  
  const deletedTags = deletePostTags.run();
  const deletedPosts = deletePosts.run();
  
  console.log('✅ Berhasil menghapus:');
  console.log(`   - ${deletedPosts.changes} posts`);
  console.log(`   - ${deletedTags.changes} post-tag relationships`);
  
  // Reset auto-increment
  db.prepare('DELETE FROM sqlite_sequence WHERE name = "posts"').run();
  
  console.log('\n🔄 Auto-increment ID direset ke 1');
  console.log('\n✅ Semua test posts berhasil dihapus!');
  console.log('📝 Database siap untuk production\n');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} finally {
  db.close();
}
