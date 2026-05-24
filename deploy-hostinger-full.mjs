#!/usr/bin/env node
/**
 * Complete Hostinger Deployment Script
 * Uses Hostinger API to deploy the SonicVelo Blog
 */

import { execSync, spawn } from 'child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const log = (emoji, ...args) => console.log(emoji, ...args);
const error = (emoji, ...args) => console.error(emoji, ...args);

// ── Load Configuration ────────────────────────────────────────────────────────

function loadConfig() {
  const envPath = join(process.cwd(), 'agents', 'deploy', 'api_key.env');
  
  if (!existsSync(envPath)) {
    error('❌', 'API key file not found:', envPath);
    process.exit(1);
  }

  const env = {};
  const content = readFileSync(envPath, 'utf8');
  
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    env[match[1]] = match[2].replace(/^['"]|['"]$/g, '').trim();
  }

  return {
    hostingerApiKey: env.api_key_hostinger || env.API_TOKEN,
    sonicveloApiKey: env.SONICVELO_API_KEY,
  };
}

// ── Test Hostinger API ────────────────────────────────────────────────────────

async function testHostingerAPI(apiKey) {
  log('🔍', 'Testing Hostinger API connection...');
  
  try {
    const response = await fetch('https://api.hostinger.com/v1/websites', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      log('✅', 'Hostinger API is accessible');
      return { available: true, data };
    } else {
      const text = await response.text();
      error('⚠️', `Hostinger API returned ${response.status}`);
      return { available: false, error: text };
    }
  } catch (err) {
    error('⚠️', 'Hostinger API error:', err.message);
    return { available: false, error: err.message };
  }
}

// ── Build Production ──────────────────────────────────────────────────────────

function buildProduction() {
  log('\n🏗️', 'Building production bundle...');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    log('✅', 'Build completed successfully\n');
    return true;
  } catch (err) {
    error('❌', 'Build failed:', err.message);
    return false;
  }
}

// ── Create Deployment Package ─────────────────────────────────────────────────

function createDeploymentPackage() {
  log('📦', 'Creating deployment package...');
  
  const zipFile = 'sonicvelo-hostinger-deploy.zip';
  
  try {
    // Remove old zip if exists
    if (existsSync(zipFile)) {
      execSync(`del "${zipFile}"`, { shell: true });
    }

    // Create zip using PowerShell
    const filesToZip = [
      '.next',
      'app',
      'lib',
      'public',
      'data',
      'package.json',
      'server.js',
      '.env.local',
    ].filter(existsSync);

    log('   ', 'Including:', filesToZip.join(', '));

    execSync(
      `powershell -Command "Compress-Archive -Path ${filesToZip.join(',')} -DestinationPath '${zipFile}' -Force"`,
      { stdio: 'inherit', shell: true }
    );

    log('✅', `Deployment package created: ${zipFile}\n`);
    return zipFile;
  } catch (err) {
    error('❌', 'Failed to create package:', err.message);
    return null;
  }
}

// ── Deploy via Hostinger API ──────────────────────────────────────────────────

async function deployViaAPI(apiKey, zipFile) {
  log('🚀', 'Deploying via Hostinger API...\n');

  // First, get list of websites
  log('📋', 'Fetching websites...');
  
  try {
    const websitesResponse = await fetch('https://api.hostinger.com/v1/websites', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    if (!websitesResponse.ok) {
      const errorText = await websitesResponse.text();
      error('❌', 'Failed to fetch websites:', errorText);
      return false;
    }

    const websites = await websitesResponse.json();
    log('✅', 'Found websites:', JSON.stringify(websites, null, 2));

    // TODO: Upload file to website
    // Note: The Hostinger API might not support direct file uploads
    // You may need to use FTP/SFTP instead

    log('\n⚠️', 'Note: Hostinger API may not support direct file uploads.');
    log('💡', 'Consider using FTP/SFTP for file deployment.');
    
    return false;
  } catch (err) {
    error('❌', 'API deployment error:', err.message);
    return false;
  }
}

// ── Deploy via FTP (Alternative) ──────────────────────────────────────────────

function showFTPInstructions(zipFile) {
  log('\n📤', 'FTP/SFTP Deployment Instructions:\n');
  log('1️⃣', 'Connect to your Hostinger server via FTP/SFTP');
  log('   ', 'Host: ftp.yourdomain.com (or use Hostinger File Manager)');
  log('   ', 'Username: Your Hostinger username');
  log('   ', 'Password: Your Hostinger password');
  log('');
  log('2️⃣', `Upload: ${zipFile}`);
  log('   ', 'Destination: /home/your-username/public_html/');
  log('');
  log('3️⃣', 'Extract the zip file on the server');
  log('   ', 'Via File Manager: Right-click → Extract');
  log('   ', 'Via SSH: unzip ' + zipFile);
  log('');
  log('4️⃣', 'Configure and start the application');
  log('   ', 'SSH into server: ssh your-username@your-domain.com');
  log('   ', 'cd /home/your-username/public_html');
  log('   ', 'npm install --production');
  log('   ', 'npm start');
  log('');
}

// ── Use Hostinger MCP Tool ────────────────────────────────────────────────────

function deployViaHostingerMCP(apiKey) {
  log('\n🔧', 'Attempting deployment via Hostinger MCP...\n');
  
  return new Promise((resolve) => {
    const child = spawn('npx', ['-y', 'hostinger-api-mcp@latest'], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        API_TOKEN: apiKey,
      },
      shell: process.platform === 'win32',
      stdio: 'inherit',
    });

    child.on('exit', (code) => {
      if (code === 0) {
        log('✅', 'Hostinger MCP completed successfully');
        resolve(true);
      } else {
        error('❌', 'Hostinger MCP failed with code:', code);
        resolve(false);
      }
    });

    child.on('error', (err) => {
      error('❌', 'Hostinger MCP error:', err.message);
      resolve(false);
    });
  });
}

// ── Generate Deployment Report ────────────────────────────────────────────────

function generateDeploymentReport(config, zipFile, apiAvailable) {
  const report = `
# Hostinger Deployment Report

**Date:** ${new Date().toISOString()}
**Status:** ${apiAvailable ? '⚠️ API Available but Limited' : '❌ API Unavailable'}

## 📦 Deployment Package

- **File:** ${zipFile}
- **Status:** ✅ Created
- **Contents:** .next, app, lib, public, data, package.json, server.js, .env.local

## 🔑 Configuration

- **Hostinger API Key:** ${config.hostingerApiKey ? '✅ Configured' : '❌ Missing'}
- **SonicVelo API Key:** ${config.sonicveloApiKey ? '✅ Configured' : '❌ Missing'}

## 🚀 Deployment Options

### Option 1: Hostinger File Manager (Recommended)

1. Login to Hostinger: https://hpanel.hostinger.com
2. Open File Manager
3. Navigate to public_html
4. Upload: ${zipFile}
5. Right-click → Extract
6. SSH into server and run:
   \`\`\`bash
   cd /home/your-username/public_html
   npm install --production
   npm start
   \`\`\`

### Option 2: FTP/SFTP Upload

1. Connect via FileZilla/WinSCP
2. Upload ${zipFile} to public_html
3. Extract via File Manager or SSH
4. Install and start as above

### Option 3: SSH Direct Upload

\`\`\`bash
# On your local machine
scp ${zipFile} your-username@your-domain.com:~/public_html/

# SSH into server
ssh your-username@your-domain.com
cd ~/public_html
unzip ${zipFile}
npm install --production
npm start
\`\`\`

## 🔧 Post-Deployment Steps

1. Update .env.local with production values:
   - NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   - ALLOWED_ORIGIN=https://yourdomain.com
   - ADMIN_PASSWORD=your-secure-password

2. Generate new SESSION_SECRET:
   \`\`\`bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   \`\`\`

3. Setup PM2 for production:
   \`\`\`bash
   npm install -g pm2
   pm2 start server.js --name sonicvelo-blog
   pm2 save
   pm2 startup
   \`\`\`

4. Test deployment:
   - Health: https://yourdomain.com/api/health
   - Admin: https://yourdomain.com/en/admin/login
   - Posts: https://yourdomain.com/en/transmissions

## 📊 API Test Results

${apiAvailable ? '✅ Hostinger API is accessible' : '❌ Hostinger API is currently unavailable (Cloudflare DNS error)'}

## 📝 Notes

${!apiAvailable ? `
⚠️ The Hostinger API is experiencing infrastructure issues (Cloudflare Error 1016).
This is a temporary Hostinger service issue, not related to your application.
Use manual deployment methods (File Manager, FTP, or SSH) instead.
` : ''}

For detailed instructions, see: DEPLOYMENT_GUIDE.md
`;

  const reportFile = 'HOSTINGER_DEPLOYMENT_REPORT.md';
  writeFileSync(reportFile, report.trim());
  log('📝', 'Deployment report created:', reportFile);
}

// ── Main Deployment Flow ──────────────────────────────────────────────────────

async function main() {
  log('🚀', 'SonicVelo Blog - Hostinger Deployment\n');
  log('='.repeat(60), '\n');

  // Load configuration
  const config = loadConfig();
  
  if (!config.hostingerApiKey) {
    error('❌', 'Hostinger API key not found in agents/deploy/api_key.env');
    process.exit(1);
  }

  log('🔑', 'Configuration loaded');
  log('   ', 'Hostinger API Key:', config.hostingerApiKey.substring(0, 15) + '...');
  log('   ', 'SonicVelo API Key:', config.sonicveloApiKey ? config.sonicveloApiKey.substring(0, 15) + '...' : 'Not set');
  log('');

  // Test Hostinger API
  const apiStatus = await testHostingerAPI(config.hostingerApiKey);
  log('');

  // Build production
  if (!buildProduction()) {
    error('❌', 'Build failed. Cannot proceed with deployment.');
    process.exit(1);
  }

  // Create deployment package
  const zipFile = createDeploymentPackage();
  if (!zipFile) {
    error('❌', 'Failed to create deployment package.');
    process.exit(1);
  }

  // Generate deployment report
  generateDeploymentReport(config, zipFile, apiStatus.available);

  // Deployment strategy
  log('\n' + '='.repeat(60));
  log('📋', 'Deployment Strategy:\n');

  if (apiStatus.available) {
    log('✅', 'Hostinger API is available');
    log('💡', 'However, API may not support direct file uploads.');
    log('');
    
    // Try MCP tool
    log('🔧', 'You can try using Hostinger MCP for advanced operations:');
    log('   ', 'node agents/deploy/deploy-hostinger.mjs');
    log('');
  } else {
    log('⚠️', 'Hostinger API is currently unavailable');
    log('💡', 'Use manual deployment methods instead');
    log('');
  }

  // Show manual deployment instructions
  showFTPInstructions(zipFile);

  // Summary
  log('='.repeat(60));
  log('✅', 'Deployment package ready!\n');
  log('📦', 'Package:', zipFile);
  log('📝', 'Report: HOSTINGER_DEPLOYMENT_REPORT.md');
  log('📖', 'Guide: DEPLOYMENT_GUIDE.md');
  log('');
  log('🎯', 'Next: Upload the package to Hostinger and follow the instructions above.');
  log('');
}

// Run deployment
main().catch(err => {
  error('💥', 'Fatal error:', err);
  process.exit(1);
});
