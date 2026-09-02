import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { startServer, toolText } from './mcp-client.mjs';

const tmp = mkdtempSync(path.join(os.tmpdir(), 'rna-figure-test-'));
const files = {
  de: path.join(tmp, 'de.csv'), matrix: path.join(tmp, 'matrix.csv'), meta: path.join(tmp, 'meta.csv'),
  box: path.join(tmp, 'box.csv'), enrich: path.join(tmp, 'enrich.csv'),
};
writeFileSync(files.de, 'gene,log2FoldChange,padj\nA,3,0.0001\nB,-2.5,0.002\nC,0.2,0.8\nD,1.5,0.02\nE,-0.3,0.4\nF,2.2,0.01\n');
writeFileSync(files.matrix, 'gene,S1,S2,S3,S4\nA,10,12,80,90\nB,2,4,20,18\nC,50,47,5,7\nD,8,9,10,11\nE,100,110,120,140\nF,5,30,6,35\n');
writeFileSync(files.meta, 'sample,group\nS1,Control\nS2,Control\nS3,Treatment\nS4,Treatment\n');
writeFileSync(files.box, 'gene,group,value\nA,Control,1\nA,Control,1.2\nA,Treatment,3\nA,Treatment,3.4\nB,Control,2\nB,Control,2.1\nB,Treatment,1\nB,Treatment,0.8\n');
writeFileSync(files.enrich, 'Description,GeneRatio,Count,padj,Category\nDefense response,5/40,5,0.001,BP\nMAPK signaling,4/40,4,0.006,Pathway\nCell wall,3/40,3,0.02,BP\nHormone signaling,6/40,6,0.0005,Pathway\n');

const jobs = [
  { plot_type: 'volcano', input_path: files.de, output_name: 'volcano' },
  { plot_type: 'pca', input_path: files.matrix, metadata_path: files.meta, output_name: 'pca', options: { top_n: 6 } },
  { plot_type: 'heatmap', input_path: files.matrix, output_name: 'heatmap', options: { top_n: 6 } },
  { plot_type: 'expression-boxplot', input_path: files.box, output_name: 'boxplot' },
  { plot_type: 'enrichment-dotplot', input_path: files.enrich, output_name: 'enrichment' },
];
const server = startServer('./mcp/rna-figure.mjs');
try {
  const status = JSON.parse(toolText(await server.request('tools/call', { name: 'rna_figure_status', arguments: {} })));
  if (!status.ready) { console.log('rna-figure-render-smoke: skipped (R runtime unavailable)'); process.exitCode = 0; }
  else {
    for (const job of jobs) {
      const message = await server.request('tools/call', { name: 'rna_figure_create', arguments: { ...job, output_dir: tmp } });
      assert.notEqual(message.result.isError, true, toolText(message));
      const result = JSON.parse(toolText(message));
      for (const key of ['png', 'pdf', 'plot_data']) assert(existsSync(result[key]), `${key} missing for ${job.plot_type}`);
      assert.deepEqual([...readFileSync(result.png).subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    }
    console.log('rna-figure-render-smoke: ok (5 plot types)');
  }
} finally { server.close(); rmSync(tmp, { recursive: true, force: true }); }
