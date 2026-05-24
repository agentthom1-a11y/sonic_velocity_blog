#!/usr/bin/env node
/**
 * Deploy SonicVelo Blog to Hostinger
 * 
 * This script:
 * 1. Builds the Next.js production bundle
 * 2. Creates a deployment package
 * 3. Uploads to Hostinger (when API is available)
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const log = (emoji, ...args) => console.log(emoji, ...args);
const error = (emoji, ...args) => console.error(emoji, ...args);

// ── Configuration ─────────────────────────────────────────────────────────────

const CONFIG = {
  buildDir: '.next',
  outputDir: 'dist-hostinger',
  zipFile: 'agents/deploy/sonicvelo-hostinger-deploy.zip',
  requiredFiles: [
    'package.json',
    'server.js',
    '.env.local',
    'data/cms.db',
  ],
  requiredDirs: [
    '.next',
    'public',
    'app',
    'lib',
  ],
};

// ── Step 1: Pre-deployment Checks ─────────────────────────────────────────────

function preDeploymentChecks() {
  log('🔍', 'Running pre-deployment checks...\n');

  // Check Node.js version
  const nodeVersion = process.version;
  log('📦', 'Node.js version:', nodeVersion);

  // Check if database exists
  if (!existsSync('data/cms.db')) {
    error('❌', 'Database not found: data/cms.db');
    error('💡', 'Run the app first to initialize the database');
    return false;
  }
  log('✅', 'Database found');

  // Check if .env.local exists
  if (!existsSync('.env.local')) {
    error('❌', 'Environment file not found: .env.local');
    return false;
  }
  log('✅', 'Environment file found');

  // Check if API key is configured
  const envContent = readFileSync('.env.local', 'utf8');
  if (!envContent.includes('ADMIN_EMAIL') || !envContent.includes('ADMIN_PASSWORD')) {
    error('❌', 'Admin credentials not configured in .env.local');
    return false;
  }
  log('✅', 'Admin credentials configured');

  log('');
  return true;
}

// ── Step 2: Build Production Bundle ──────────────────────────────────────────

function buildProduction() {
  log('🏗️', 'Building production bundle...\n');

  try {
    // Clean previous build
    log('🧹', 'Cleaning previous build...');
    if (existsSync('.next')) {
      execSync('rmdir /s /q .next', { stdio: 'inherit', shell: true });
    }

    // Run Next.js build
    log('⚙️', 'Running Next.js build...');
    execSync('npm run build', { stdio: 'inherit' });

    log('✅', 'Build completed successfully\n');
    return true;
  } catch (err) {
    error('❌', 'Build failed:', err.message);
    return false;
  }
}

// ── Step 3: Create Deployment Package ────────────────────────────────────────

async function createDeploymentPackage() {
  log('📦', 'Creating deployment package...\n');

  try {
    // Use PowerShell Compress-Archive on Windows
    log('📁', 'Compressing files...');
    
    // Create a temporary file list
    const filesToZip = [
      '.next',
      'app',
      'lib',
      'public',
      'data',
      'package.json',
      'server.js',
      '.env.local',
      'node_modules',
    ].filter(existsSync);

    log('   ', 'Files to include:');
    filesToZip.forEach(file => log('   ', '✓', file));

    // Create zip using PowerShell
    const zipPath = CONFIG.zipFile.replace(/\//g, '\\');
    
    // Remove old zip if exists
    if (existsSync(CONFIG.zipFile)) {
      execSync(`del "${zipPath}"`, { shell: true });
    }

    // Create zip
    execSync(`powershell Compress-Archive -Path ${filesToZip.join(',')} -DestinationPath "${zipPath}" -Force`, {
      stdio: 'inherit',
      shell: true,
    });

    log('✅', `Deployment package created: ${CONFIG.zipFile}\n`);
    return true;
  } catch (err) {
    error('❌', 'Failed to create package:', err.message);
    return false;
  }
}

// ── Step 4: Create Hostinger Deployment Instructions ─────────────────────────

function createDeploymentInstructions() {
  const instructions = `
# Hostinger Deployment Instructions

## 📦 Package Created
- File: ${CONFIG.zipFile}
- Date: ${new Date().toISOString()}

## 🚀 Deployment Steps

### Option 1: Manual Upload via File Manager

1. **Login to Hostinger Control Panel**
   - Go to https://hpanel.hostinger.com
   - Navigate to your hosting account

2. **Upload the Package**
   - Open File Manager
   - Navigate to public_html (or your app directory)
   - Upload: ${CONFIG.zipFile}
   - Extract the zip file

3. **Configure Environment**
   - Ensure .env.local has production values
   - Update NEXT_PUBLIC_SITE_URL to your domain
   - Update ALLOWED_ORIGIN to your domain

4. **Install Dependencies (if needed)**
   \`\`\`bash
   cd /home/your-username/public_html
   npm install --production
   \`\`\`

5. **Start the Application**
   \`\`\`bash
   npm start
   \`\`\`

6. **Setup Process Manager (PM2)**
   \`\`\`bash
   npm install -g pm2
   pm2 start server.js --name sonicvelo-blog
   pm2 save
   pm2 startup
   \`\`\`

### Option 2: Deploy via SSH

1. **Connect via SSH**
   \`\`\`bash
   ssh your-username@your-domain.com
   \`\`\`

2. **Upload and Extract**
   \`\`\`bash
   cd /home/your-username/public_html
   # Upload via SCP or FTP
   unzip sonicvelo-hostinger-deploy.zip
   \`\`\`

3. **Install and Start**
   \`\`\`bash
   npm install --production
   npm start
   \`\`\`

### Option 3: Deploy via Git

1. **Push to Git Repository**
   \`\`\`bash
   git add .
   git commit -m "Production build"
   git push origin main
   \`\`\`

2. **Pull on Hostinger**
   \`\`\`bash
   ssh your-username@your-domain.com
   cd /home/your-username/public_html
   git pull origin main
   npm install --production
   npm run build
   npm start
   \`\`\`

## 🔧 Post-Deployment Configuration

### 1. Database Setup
- Ensure data/cms.db is writable
- Run migrations if needed

### 2. Environment Variables
Update .env.local with production values:
\`\`\`env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
ALLOWED_ORIGIN=https://your-domain.com
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
\`\`\`

### 3. API Keys
- Create production API keys via /admin/settings/api-keys
- Update agents/deploy/api_key.env with production keys

### 4. SSL Certificate
- Enable SSL in Hostinger control panel
- Force HTTPS redirects

### 5. Performance Optimization
- Enable caching in Hostinger
- Configure CDN if available
- Set up compression

## 🧪 Testing Production Deployment

1. **Health Check**
   \`\`\`bash
   curl https://your-domain.com/api/health
   \`\`\`

2. **Create Test Post**
   \`\`\`bash
   curl -X POST https://your-domain.com/api/internal/ai/transmissions \\
     -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     -d '{"title":"Test Post","excerpt":"Test","content_markdown":"# Test"}'
   \`\`\`

3. **Access Admin Panel**
   - Visit: https://your-domain.com/en/admin/login
   - Login with admin credentials

## 📊 Monitoring

- Check logs: \`pm2 logs sonicvelo-blog\`
- Monitor status: \`pm2 status\`
- Restart if needed: \`pm2 restart sonicvelo-blog\`

## 🆘 Troubleshooting

### App Not Starting
- Check Node.js version (should be 18+)
- Verify all dependencies installed
- Check .env.local configuration

### Database Errors
- Ensure data/cms.db exists and is writable
- Check file permissions: \`chmod 644 data/cms.db\`

### API Errors
- Verify API keys are configured
- Check CORS settings in .env.local
- Review server logs

## 📞 Support
- Hostinger Support: https://www.hostinger.com/support
- Documentation: https://support.hostinger.com
`;

  const instructionsFile = 'DEPLOYMENT_INSTRUCTIONS.md';
  writeFileSync(instructionsFile, instructions.trim());
  log('📝', 'Deployment instructions created:', instructionsFile);
}

// ── Main Deployment Flow ──────────────────────────────────────────────────────

async function main() {
  log('🚀', 'SonicVelo Blog - Hostinger Deployment\n');
  log('='.repeat(60), '\n');

  // Step 1: Pre-deployment checks
  if (!preDeploymentChecks()) {
    error('❌', 'Pre-deployment checks failed');
    process.exit(1);
  }

  // Step 2: Build production bundle
  if (!buildProduction()) {
    error('❌', 'Production build failed');
    process.exit(1);
  }

  // Step 3: Create deployment package
  try {
    await createDeploymentPackage();
  } catch (err) {
    error('❌', 'Failed to create deployment package:', err.message);
    process.exit(1);
  }

  // Step 4: Create deployment instructions
  createDeploymentInstructions();

  // Summary
  log('\n' + '='.repeat(60));
  log('🎉', 'Deployment package ready!\n');
  log('📦', 'Package:', CONFIG.zipFile);
  log('📝', 'Instructions: DEPLOYMENT_INSTRUCTIONS.md');
  log('\n💡', 'Next steps:');
  log('   ', '1. Upload the package to Hostinger');
  log('   ', '2. Follow the deployment instructions');
  log('   ', '3. Test the production deployment');
  log('');
}

// Run deployment
main().catch(err => {
  error('💥', 'Fatal error:', err);
  process.exit(1);
});
