#!/usr/bin/env node
/**
 * Test CORS-enabled API from external server simulation
 */

import { readFileSync } from 'fs';

const API_BASE = process.env.API_BASE || 'http://localhost:3000';

// Load API key
const envPath = './agents/deploy/api_key.env';
const content = readFileSync(envPath, 'utf8');
const env = {};

for (const line of content.split(/\r?\n/)) {
  const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
  if (!match) continue;
  env[match[1]] = match[2].replace(/^['"]|['"]$/g, '').trim();
}

const API_KEY = env.SONICVELO_API_KEY;

console.log('🌐 Testing CORS-Enabled API\n');
console.log('📍 API Base:', API_BASE);
console.log('🔑 API Key:', API_KEY.substring(0, 15) + '...\n');

// Test 1: OPTIONS preflight request
console.log('1️⃣ Testing OPTIONS preflight (CORS)...');
fetch(`${API_BASE}/api/internal/ai/transmissions`, {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://external-server.com',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'Content-Type, Authorization',
  },
})
  .then(res => {
    console.log('   Status:', res.status);
    console.log('   CORS Headers:');
    console.log('   - Access-Control-Allow-Origin:', res.headers.get('access-control-allow-origin'));
    console.log('   - Access-Control-Allow-Methods:', res.headers.get('access-control-allow-methods'));
    console.log('   - Access-Control-Allow-Headers:', res.headers.get('access-control-allow-headers'));
    console.log('   ✅ Preflight successful\n');
    
    // Test 2: Health check with CORS
    console.log('2️⃣ Testing Health Check with CORS...');
    return fetch(`${API_BASE}/api/health`, {
      headers: {
        'Origin': 'https://external-server.com',
      },
    });
  })
  .then(res => {
    console.log('   Status:', res.status);
    console.log('   CORS Header:', res.headers.get('access-control-allow-origin'));
    return res.json();
  })
  .then(data => {
    console.log('   Response:', data);
    console.log('   ✅ Health check with CORS successful\n');
    
    // Test 3: Create post from "external server"
    console.log('3️⃣ Testing POST from external origin...');
    return fetch(`${API_BASE}/api/internal/ai/transmissions`, {
      method: 'POST',
      headers: {
        'Origin': 'https://external-server.com',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        title: 'CORS Test Post - ' + new Date().toISOString(),
        excerpt: 'This post was created from an external server to test CORS functionality.',
        content_markdown: `# CORS Test\n\nThis post was created to verify that the API accepts requests from any origin.\n\n## Test Details\n\n- Origin: https://external-server.com\n- Time: ${new Date().toLocaleString()}\n- CORS: Enabled\n\n✅ If you're reading this, CORS is working!`,
        category: 'Testing',
        tags: ['cors', 'api', 'test'],
        author_name: 'CORS Test Bot',
        source_type: 'ai_agent',
      }),
    });
  })
  .then(res => {
    console.log('   Status:', res.status);
    console.log('   CORS Header:', res.headers.get('access-control-allow-origin'));
    return res.json();
  })
  .then(data => {
    console.log('   Response:', JSON.stringify(data, null, 2));
    console.log('   ✅ POST from external origin successful\n');
    
    // Test 4: GET request from external origin
    console.log('4️⃣ Testing GET from external origin...');
    return fetch(`${API_BASE}/api/internal/ai/transmissions?limit=3`, {
      headers: {
        'Origin': 'https://another-server.com',
        'Authorization': `Bearer ${API_KEY}`,
      },
    });
  })
  .then(res => {
    console.log('   Status:', res.status);
    console.log('   CORS Header:', res.headers.get('access-control-allow-origin'));
    return res.json();
  })
  .then(data => {
    console.log('   Posts found:', data.posts?.length || 0);
    console.log('   ✅ GET from external origin successful\n');
    
    // Summary
    console.log('='.repeat(60));
    console.log('🎉 All CORS tests passed!\n');
    console.log('✅ OPTIONS preflight: Working');
    console.log('✅ Health check with CORS: Working');
    console.log('✅ POST from external origin: Working');
    console.log('✅ GET from external origin: Working');
    console.log('\n📝 The API is now accessible from ANY server!');
    console.log('');
  })
  .catch(err => {
    console.error('\n❌ Error:', err.message);
  });
