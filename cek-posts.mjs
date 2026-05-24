#!/usr/bin/env node
import Database from 'better-sqlite3';

const db = new Database('./data/cms.db');

const count = db.prepare('SELECT COUNT(*) as total FROM posts').get();
const posts = db.prepare('SELECT id, title FROM posts LIMIT 10').all();

console.log(`\n📊 Total posts di database: ${count.total}\n`);

if (posts.length > 0) {
  console.log('📋 Posts yang ada:');
  posts.forEach(post => {
    console.log(`   [${post.id}] ${post.title}`);
  });
} else {
  console.log('✅ Database bersih - tidak ada posts');
}

console.log('');
db.close();
