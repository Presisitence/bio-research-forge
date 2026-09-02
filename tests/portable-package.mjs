import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(readFileSync(path.join(ROOT, 'plugin.json'), 'utf8'));
const mcp = JSON.parse(readFileSync(path.join(ROOT, 'mcp.json'), 'utf8'));
assert.equal(manifest.$schema, 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
assert.equal(manifest.name, 'bio-research-forge');
assert.equal(mcp.$schema, 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json');
assert.deepEqual(Object.keys(mcp).sort(), ['$schema', 'mcpServers']);
assert.deepEqual(Object.keys(mcp.mcpServers), ['public-bio-api', 'rna-figure', 'local-bio-tools']);
for (const server of Object.values(mcp.mcpServers)) {
  assert.equal(server.type, 'stdio');
  assert.equal(server.command, 'node');
  const relative = server.args[0].replace('${PLUGIN_ROOT}/', '');
  assert(existsSync(path.join(ROOT, relative)), `missing MCP entrypoint: ${relative}`);
}

const skills = readdirSync(path.join(ROOT, 'skills'), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
assert.equal(skills.length, 12);
for (const skill of skills) assert(existsSync(path.join(ROOT, 'skills', skill, 'SKILL.md')));

for (const client of ['generic', 'claude', 'cursor', 'vscode']) {
  const generated = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'print-mcp-config.mjs'), '--client', client], { encoding: 'utf8' });
  assert.equal(generated.status, 0, generated.stderr);
  const config = JSON.parse(generated.stdout);
  assert.equal(Object.keys(config.mcpServers || config.servers).length, 3);
}

const cli = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'call-tool.mjs'), 'list-tools', 'public-bio-api'], { encoding: 'utf8', timeout: 30000 });
assert.equal(cli.status, 0, cli.stderr);
assert.match(cli.stdout, /bio_api_catalog/);
console.log('portable-package: ok');
