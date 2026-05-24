#!/usr/bin/env node
/**
 * Simple test - just test creating a post via API
 */

const API_KEY = 'svk_e13876d2b4f4c5e4dadc2cb4a06b6a6ef931d25f';
const API_BASE = 'http://localhost:3000';

const testPost = {
  title: 'Test Post - ' + new Date().toISOString(),
  excerpt: 'This is a test post created via API.',
  content_markdown: `# Test Post\n\nThis is a test post.\n\nCreated at ${new Date().toLocaleString()}.`,
  category: 'Technology',
  tags: ['test', 'api'],
  status: 'draft',
  author_name: 'API Test',
  source_type: 'ai_agent',
};

console.log('🚀 Testing SonicVelo API...\n');
console.log('📍 API Base:', API_BASE);
console.log('🔑 API Key:', API_KEY.substring(0, 15) + '...\n');

// Test 1: Health check
console.log('1️⃣ Testing /api/health...');
fetch(`${API_BASE}/api/health`)
  .then(res => {
    console.log('   Status:', res.status);
    console.log('   Content-Type:', res.headers.get('content-type'));
    return res.text();
  })
  .then(text => {
    console.log('   Response:', text.substring(0, 200));
    console.log('');
    
    // Test 2: Create post
    console.log('2️⃣ Testing POST /api/internal/ai/transmissions...');
    return fetch(`${API_BASE}/api/internal/ai/transmissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPost),
    });
  })
  .then(res => {
    console.log('   Status:', res.status);
    console.log('   Content-Type:', res.headers.get('content-type'));
    return res.text();
  })
  .then(text => {
    console.log('   Response:', text.substring(0, 500));
    
    try {
      const data = JSON.parse(text);
      console.log('\n✅ Success! Post created:');
      console.log('   ID:', data.id);
      console.log('   Slug:', data.slug);
      console.log('   Status:', data.status);
      console.log('   Preview URL:', data.preview_url);
    } catch (e) {
      console.log('\n❌ Response is not JSON');
    }
  })
  .catch(err => {
    console.error('\n❌ Error:', err.message);
  });
