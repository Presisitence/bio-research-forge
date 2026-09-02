import assert from 'node:assert/strict';
import { startServer, toolText } from './mcp-client.mjs';

const sources = ['ncbi', 'uniprot', 'interpro', 'ensembl', 'alphafold', 'rcsb', 'europepmc', 'string', 'jaspar', 'sgn'];
const server = startServer();
try {
  for (const source of sources) {
    const message = await server.request('tools/call', { name: 'bio_api_health', arguments: { live: true, source } });
    assert.notEqual(message.result.isError, true, `${source}: ${toolText(message)}`);
    const result = JSON.parse(toolText(message));
    assert.equal(result.live.ok, true);
    assert(result.live.sourceUrl.startsWith('https://'));
    console.log(`live-api-smoke: ${source} ok`);
  }
} finally {
  server.close();
}
