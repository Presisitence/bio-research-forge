# Bio Research Forge

[中文详细说明](README.zh-CN.md) | English

Bio Research Forge is a vendor-neutral life-science agent package. Its portable core follows [Agent Plugins 1.0](https://agent-plugins.org/) and the Model Context Protocol (MCP), so it is not tied to Codex or to one model vendor.

It can be used in three ways:

1. Agent Plugins 1.0 clients discover the root `plugin.json`, `skills/`, and `mcp.json`;
2. any MCP client that supports local stdio servers can launch the three bundled MCP servers;
3. an agent with shell access but no MCP client can call the same tools through `scripts/call-tool.mjs`.

The optional `.agents/` marketplace file and the nested `plugins/bio-research-forge/.codex-plugin/` manifest are a Codex adapter. They do not define or own the portable core.

## Portable package

| Path | Purpose |
|---|---|
| `plugin.json` | Vendor-neutral Agent Plugins 1.0 manifest |
| `skills/` | Twelve portable Agent Skills |
| `mcp.json` | Portable definitions for three stdio MCP servers |
| `scripts/print-mcp-config.mjs` | Generates configuration for generic MCP, Claude, Cursor, or VS Code |
| `scripts/call-tool.mjs` | Lets any shell-capable agent list or call tools without a native MCP client |
| `plugins/bio-research-forge/` | Self-contained implementation and optional Codex package |
| `.agents/plugins/marketplace.json` | Optional Codex Marketplace adapter only |

## Quick start for any agent

Clone the repository, then generate the configuration format required by your client:

```powershell
node scripts/print-mcp-config.mjs --client generic
node scripts/print-mcp-config.mjs --client claude
node scripts/print-mcp-config.mjs --client cursor
node scripts/print-mcp-config.mjs --client vscode
```

Copy the generated JSON into the client's MCP configuration. The generator resolves the repository's absolute path at runtime, including paths containing spaces.

For an agent without MCP support but with shell access:

```powershell
node scripts/call-tool.mjs list-servers
node scripts/call-tool.mjs list-tools public-bio-api
node scripts/call-tool.mjs call public-bio-api bio_api_catalog "{}"
```

See the [detailed cross-agent integration guide](docs/AGENT-INTEGRATION.md).

## Included capabilities

- public biological APIs with provenance and evidence limits;
- local RNA volcano, PCA, heatmap, expression-boxplot, and enrichment-dotplot generation;
- safe PyMOL rendering and explicit opening of compatible files in SnapGene, Cytoscape, or Fiji;
- research design, omics, statistics, secure compute routing, manuscript argument, figure delivery, reproducibility, and independent review.

## Optional Codex adapter

Codex users can additionally install the repository marketplace:

```powershell
codex plugin marketplace add "<repository-root>"
codex plugin add bio-research-forge@bio-research-forge
```

This adapter is optional. Removing it would not change the MCP wire protocol or the portable Agent Skills.

## Verify

```powershell
npm test
npm run test:render
npm run test:live
```

The repository excludes private datasets, private genome/transcriptome databases, dedicated pepper resources, credentials, and local reference documents. See [privacy](plugins/bio-research-forge/PRIVACY.md), [attribution](plugins/bio-research-forge/ATTRIBUTION.md), and the [verification report](plugins/bio-research-forge/REVIEW_REPORT.md).
