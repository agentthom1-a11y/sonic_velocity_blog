import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const envPath = path.join(root, 'agents', 'deploy', 'api_key.env');

function readEnvFile(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing deploy env file: ${filePath}`);
  }

  const env = {};
  for (const line of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
  return env;
}

const deployEnv = readEnvFile(envPath);
const apiToken = deployEnv.api_key_hostinger || deployEnv.API_TOKEN;

if (!apiToken) {
  throw new Error('api_key_hostinger is required in agents/deploy/api_key.env');
}

const args = process.argv.slice(2);
const child = spawn('npx', ['-y', 'hostinger-api-mcp@latest', ...args], {
  cwd: root,
  env: {
    ...process.env,
    API_TOKEN: apiToken,
  },
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
