# Bio Research Forge marketplace

[中文详细说明](README.zh-CN.md) | English

This repository contains the Codex marketplace and source for [Bio Research Forge](plugins/bio-research-forge/README.md), an evidence-first life-science research plugin.

The plugin provides twelve classified skills plus public-API, local-RNA-figure, and selective local-tool MCP servers. It deliberately excludes private datasets, private genome/transcriptome databases, dedicated pepper resources, credentials, and local reference documents.

## Install locally

```powershell
codex plugin marketplace add "<this-repository>"
codex plugin add bio-research-forge@bio-research-forge
```

Start a new Codex task after installation.

## Verify

```powershell
cd plugins/bio-research-forge
node tests/protocol-smoke.mjs
node tests/rna-figure-protocol-smoke.mjs
node tests/local-tools-protocol-smoke.mjs
node tests/rna-figure-render-smoke.mjs
node tests/pymol-render-smoke.mjs
node tests/privacy-boundary.mjs
node tests/skill-structure.mjs
node tests/live-api-smoke.mjs
```

See [attribution](plugins/bio-research-forge/ATTRIBUTION.md), [privacy policy](plugins/bio-research-forge/PRIVACY.md), and the latest [verification report](plugins/bio-research-forge/REVIEW_REPORT.md).
