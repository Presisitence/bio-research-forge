#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SERVER_DIR = path.join(ROOT, 'plugins', 'bio-research-forge', 'mcp');
const definitions = {
  'public-bio-api': path.join(SERVER_DIR, 'public-bio-api.mjs'),
  'rna-figure': path.join(SERVER_DIR, 'rna-figure.mjs'),
  'local-bio-tools': path.join(SERVER_DIR, 'local-bio-tools.mjs'),
};

function arg(name) {
  const prefix = `--${name}=`;
  const inline = process.argv.slice(2).find((value) => value.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const client = arg('client') || 'generic';
const selected = arg('server');
if (!['generic', 'claude', 'cursor', 'vscode'].includes(client)) {
  throw new Error('client must be generic, claude, cursor, or vscode');
}
if (selected && !definitions[selected]) throw new Error(`unknown server: ${selected}`);
const entries = Object.entries(definitions).filter(([name]) => !selected || name === selected);

const standard = Object.fromEntries(entries.map(([name, serverPath]) => [name, {
  command: 'node', args: [serverPath], cwd: path.dirname(SERVER_DIR),
}]));
const vscode = Object.fromEntries(entries.map(([name, serverPath]) => [name, {
  type: 'stdio', command: 'node', args: [serverPath], cwd: path.dirname(SERVER_DIR),
}]));

const output = client === 'vscode' ? { servers: vscode } : { mcpServers: standard };
process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
