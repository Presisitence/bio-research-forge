import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { startServer, toolText } from './mcp-client.mjs';

const tmp = mkdtempSync(path.join(os.tmpdir(), 'pymol-render-test-'));
const pdb = path.join(tmp, 'tiny.pdb'); const png = path.join(tmp, 'tiny.png');
writeFileSync(pdb, 'ATOM      1  N   ALA A   1      -1.200   0.000   0.000  1.00 20.00           N\nATOM      2  CA  ALA A   1       0.000   0.000   0.000  1.00 20.00           C\nATOM      3  C   ALA A   1       1.300   0.700   0.000  1.00 20.00           C\nATOM      4  O   ALA A   1       2.300   0.100   0.000  1.00 20.00           O\nATOM      5  CB  ALA A   1       0.000  -1.500   0.800  1.00 20.00           C\nEND\n');
const server = startServer('./mcp/local-bio-tools.mjs');
try {
  const status = JSON.parse(toolText(await server.request('tools/call', { name: 'local_bio_tool_status', arguments: { tool: 'pymol' } })));
  if (!status.tools[0].installed) { console.log('pymol-render-smoke: skipped (PyMOL unavailable)'); process.exitCode = 0; }
  else {
    const message = await server.request('tools/call', { name: 'pymol_render', arguments: { input_path: pdb, output_path: png, representation: 'sticks', width: 800, height: 600 } });
    assert.notEqual(message.result.isError, true, toolText(message));
    assert(existsSync(png));
    assert.deepEqual([...readFileSync(png).subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    console.log('pymol-render-smoke: ok');
  }
} finally { server.close(); rmSync(tmp, { recursive: true, force: true }); }
