#!/usr/bin/env node

import { spawn } from 'node:child_process';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SERVER_ROOT = path.join(ROOT, 'plugins', 'bio-research-forge');
const SERVERS = {
  'public-bio-api': path.join(SERVER_ROOT, 'mcp', 'public-bio-api.mjs'),
  'rna-figure': path.join(SERVER_ROOT, 'mcp', 'rna-figure.mjs'),
  'local-bio-tools': path.join(SERVER_ROOT, 'mcp', 'local-bio-tools.mjs'),
};

function usage() {
  return [
    'Usage:',
    '  node scripts/call-tool.mjs list-servers',
    '  node scripts/call-tool.mjs list-tools <server>',
    "  node scripts/call-tool.mjs call <server> <tool> '<json-arguments>'",
  ].join('\n');
}

const [operation, serverName, toolName, rawArgs = '{}'] = process.argv.slice(2);
if (operation === 'list-servers') {
  process.stdout.write(`${JSON.stringify(Object.keys(SERVERS), null, 2)}\n`);
  process.exit(0);
}
if (!['list-tools', 'call'].includes(operation) || !SERVERS[serverName] || (operation === 'call' && !toolName)) {
  process.stderr.write(`${usage()}\n`);
  process.exit(2);
}

let toolArgs = {};
if (operation === 'call') {
  try { toolArgs = JSON.parse(rawArgs); }
  catch { process.stderr.write('json-arguments must be valid JSON\n'); process.exit(2); }
}

const child = spawn(process.execPath, [SERVERS[serverName]], { cwd: SERVER_ROOT, stdio: ['pipe', 'pipe', 'inherit'] });
const lines = readline.createInterface({ input: child.stdout, crlfDelay: Infinity });
const pending = new Map();
let nextId = 1;
lines.on('line', (line) => {
  const message = JSON.parse(line);
  const handler = pending.get(message.id);
  if (handler) { pending.delete(message.id); handler(message); }
});
function request(method, params = {}) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out waiting for ${method}`)); }, 60000);
    pending.set(id, (message) => { clearTimeout(timer); resolve(message); });
    child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
  });
}

try {
  await request('initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'bio-research-forge-cli', version: '0.1.0' } });
  const response = operation === 'list-tools'
    ? await request('tools/list')
    : await request('tools/call', { name: toolName, arguments: toolArgs });
  if (response.error) throw new Error(response.error.message || JSON.stringify(response.error));
  process.stdout.write(`${JSON.stringify(response.result, null, 2)}\n`);
} finally {
  child.stdin.end();
  child.kill();
}
