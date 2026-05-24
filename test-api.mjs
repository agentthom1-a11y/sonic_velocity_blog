#!/usr/bin/env node
/**
 * Test script for SonicVelo Blog API
 * Tests posting blog content and checks Hostinger API responses
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const API_BASE = process.env.API_BASE || 'http://localhost:3000';
const HOSTINGER_API_BASE = 'https://api.hostinger.com/v1';

// ── Helper Functions ──────────────────────────────────────────────────────────

function log(emoji, ...args) {
  console.log(emoji, ...args);
}

function error(emoji, ...args) {
  console.error(emoji, ...args);
}

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();
  return { response, data };
}

// ── Load API Key ──────────────────────────────────────────────────────────────

function loadApiKey() {
  const envPath = join(process.cwd(), 'agents', 'deploy', 'api_key.env');
  
  if (!existsSync(envPath)) {
    error('❌', 'API key file not found:', envPath);
    error('💡', 'Create agents/deploy/api_key.env with:');
    error('   ', 'SONICVELO_API_KEY=svk_your_key_here');
    error('   ', 'api_key_hostinger=your_hostinger_token');
    process.exit(1);
  }

  const env = {};
  const content = readFileSync(envPath, 'utf8');
  
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }

  return {
    sonicvelo: env.SONICVELO_API_KEY || env.sonicvelo_api_key,
    hostinger: env.api_key_hostinger || env.API_TOKEN,
  };
}

// ── Test Functions ────────────────────────────────────────────────────────────

async function testHealthCheck() {
  log('🏥', 'Testing health check endpoint...');
  
  try {
    const { response, data } = await fetchJSON(`${API_BASE}/api/health`);
    
    if (response.ok) {
      log('✅', 'Health check passed:', data);
      return true;
    } else {
      error('❌', 'Health check failed:', response.status, data);
      return false;
    }
  } catch (err) {
    error('❌', 'Health check error:', err.message);
    return false;
  }
}

async function testCreatePost(apiKey) {
  log('\n📝', 'Testing blog post creation...');
  
  const testPost = {
    title: 'Test Post - ' + new Date().toISOString(),
    slug: 'test-post-' + Date.now(),
    excerpt: 'This is a test post created via API to verify the blog posting functionality.',
    content_markdown: `# Test Post

This is a **test post** created via the API.

## Features Tested

- API authentication
- Post creation
- Markdown content
- Metadata handling

## Code Example

\`\`\`javascript
console.log('Hello from SonicVelo!');
\`\`\`

This post was created at ${new Date().toLocaleString()}.
`,
    category: 'Technology',
    tags: ['test', 'api', 'automation'],
    cover_image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    cover_image_alt: 'Test cover image',
    seo_title: 'Test Post - API Testing',
    meta_description: 'A test post to verify API functionality',
    featured: false,
    status: 'draft',
    author_name: 'API Test Bot',
    source_type: 'ai_agent',
    source_reference: 'test-script-v1',
  };

  try {
    const { response, data } = await fetchJSON(
      `${API_BASE}/api/internal/ai/transmissions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(testPost),
      }
    );

    if (response.ok) {
      log('✅', 'Post created successfully!');
      log('📊', 'Response:', JSON.stringify(data, null, 2));
      return data;
    } else {
      error('❌', 'Post creation failed:', response.status);
      error('📊', 'Error:', JSON.stringify(data, null, 2));
      return null;
    }
  } catch (err) {
    error('❌', 'Post creation error:', err.message);
    return null;
  }
}

async function testListPosts(apiKey) {
  log('\n📋', 'Testing post listing...');
  
  try {
    const { response, data } = await fetchJSON(
      `${API_BASE}/api/internal/ai/transmissions?status=draft&limit=5`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (response.ok) {
      log('✅', 'Posts retrieved successfully!');
      log('📊', `Found ${data.posts?.length || 0} posts`);
      if (data.posts?.length > 0) {
        log('📄', 'Latest posts:');
        data.posts.slice(0, 3).forEach(post => {
          log('   ', `- ${post.title} (${post.status})`);
        });
      }
      return data;
    } else {
      error('❌', 'Post listing failed:', response.status, data);
      return null;
    }
  } catch (err) {
    error('❌', 'Post listing error:', err.message);
    return null;
  }
}

async function testHostingerAPI(apiToken) {
  log('\n🌐', 'Testing Hostinger API...');
  
  if (!apiToken) {
    error('⚠️', 'Hostinger API token not found, skipping Hostinger tests');
    return null;
  }

  try {
    // Test 1: Get domains
    log('🔍', 'Fetching domains...');
    const domainsResponse = await fetch(`${HOSTINGER_API_BASE}/domains`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (domainsResponse.ok) {
      const domainsData = await domainsResponse.json();
      log('✅', 'Hostinger API - Domains retrieved');
      log('📊', 'Domains:', JSON.stringify(domainsData, null, 2));
    } else {
      const errorData = await domainsResponse.json().catch(() => ({}));
      error('❌', 'Hostinger API - Domains failed:', domainsResponse.status);
      error('📊', 'Error:', JSON.stringify(errorData, null, 2));
    }

    // Test 2: Get websites
    log('\n🔍', 'Fetching websites...');
    const websitesResponse = await fetch(`${HOSTINGER_API_BASE}/websites`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (websitesResponse.ok) {
      const websitesData = await websitesResponse.json();
      log('✅', 'Hostinger API - Websites retrieved');
      log('📊', 'Websites:', JSON.stringify(websitesData, null, 2));
      return websitesData;
    } else {
      const errorData = await websitesResponse.json().catch(() => ({}));
      error('❌', 'Hostinger API - Websites failed:', websitesResponse.status);
      error('📊', 'Error:', JSON.stringify(errorData, null, 2));
      return null;
    }
  } catch (err) {
    error('❌', 'Hostinger API error:', err.message);
    return null;
  }
}

// ── Main Test Runner ──────────────────────────────────────────────────────────

async function main() {
  log('🚀', 'SonicVelo Blog API Test Suite');
  log('=' .repeat(60));
  
  // Load API keys
  const apiKeys = loadApiKey();
  
  if (!apiKeys.sonicvelo) {
    error('❌', 'SonicVelo API key not found in agents/deploy/api_key.env');
    error('💡', 'Add: SONICVELO_API_KEY=svk_your_key_here');
    process.exit(1);
  }

  log('🔑', 'API keys loaded');
  log('   ', '- SonicVelo:', apiKeys.sonicvelo.substring(0, 10) + '...');
  log('   ', '- Hostinger:', apiKeys.hostinger ? apiKeys.hostinger.substring(0, 10) + '...' : 'Not configured');

  // Run tests
  const results = {
    health: false,
    createPost: false,
    listPosts: false,
    hostinger: false,
  };

  // 1. Health check
  results.health = await testHealthCheck();

  // 2. Create post
  const createdPost = await testCreatePost(apiKeys.sonicvelo);
  results.createPost = !!createdPost;

  // 3. List posts
  const posts = await testListPosts(apiKeys.sonicvelo);
  results.listPosts = !!posts;

  // 4. Hostinger API
  const hostingerData = await testHostingerAPI(apiKeys.hostinger);
  results.hostinger = !!hostingerData;

  // Summary
  log('\n' + '='.repeat(60));
  log('📊', 'Test Summary:');
  log('   ', `Health Check: ${results.health ? '✅' : '❌'}`);
  log('   ', `Create Post: ${results.createPost ? '✅' : '❌'}`);
  log('   ', `List Posts: ${results.listPosts ? '✅' : '❌'}`);
  log('   ', `Hostinger API: ${results.hostinger ? '✅' : apiKeys.hostinger ? '❌' : '⏭️  Skipped'}`);
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = apiKeys.hostinger ? 4 : 3;
  
  log('\n🎯', `Tests passed: ${passed}/${total}`);
  
  if (passed === total) {
    log('🎉', 'All tests passed!');
    process.exit(0);
  } else {
    error('⚠️', 'Some tests failed');
    process.exit(1);
  }
}

// Run tests
main().catch(err => {
  error('💥', 'Fatal error:', err);
  process.exit(1);
});
