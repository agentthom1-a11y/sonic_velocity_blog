#!/usr/bin/env node
/**
 * Test Hostinger API directly
 */

import { readFileSync } from 'fs';

const envPath = './agents/deploy/api_key.env';
const content = readFileSync(envPath, 'utf8');
const env = {};

for (const line of content.split(/\r?\n/)) {
  const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
  if (!match) continue;
  env[match[1]] = match[2].replace(/^['"]|['"]$/g, '').trim();
}

const API_TOKEN = env.api_key_hostinger || env.API_TOKEN;

console.log('🌐 Testing Hostinger API');
console.log('🔑 API Token:', API_TOKEN.substring(0, 15) + '...\n');

// Test different endpoints
const endpoints = [
  { name: 'Domains', url: 'https://api.hostinger.com/v1/domains' },
  { name: 'Websites', url: 'https://api.hostinger.com/v1/websites' },
  { name: 'Hosting', url: 'https://api.hostinger.com/v1/hosting' },
];

for (const endpoint of endpoints) {
  console.log(`📍 Testing ${endpoint.name}: ${endpoint.url}`);
  
  try {
    const response = await fetch(endpoint.url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Accept': 'application/json',
      },
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Content-Type: ${response.headers.get('content-type')}`);
    
    const text = await response.text();
    
    if (response.ok) {
      try {
        const data = JSON.parse(text);
        console.log(`   ✅ Success:`, JSON.stringify(data, null, 2).substring(0, 300));
      } catch {
        console.log(`   Response:`, text.substring(0, 200));
      }
    } else {
      console.log(`   ❌ Error:`, text.substring(0, 200));
    }
  } catch (err) {
    console.log(`   ❌ Exception:`, err.message);
  }
  
  console.log('');
}
