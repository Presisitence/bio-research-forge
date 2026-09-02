# Bio Research Forge

[中文](README.zh-CN.md) | English

A vendor-neutral life-science plugin for agents. It is not tied to Codex, a model vendor, or a single client. Any agent that supports Agent Plugins 1.0, MCP stdio, or local command execution can use it.

The plugin currently includes 12 classified skills and 3 MCP servers:

1. public biological database queries;
2. common RNA-seq result figures;
3. selective local bridges for PyMOL, SnapGene, Cytoscape, and Fiji;
4. experimental design, omics, statistics, compute routing, manuscript writing, scientific figures, reproducibility, and independent review.

The portable entry points are `plugin.json`, `skills/`, and `mcp.json` at the repository root. See the [cross-agent integration guide](docs/AGENT-INTEGRATION.md).

The repository contains only general capabilities and public API connectors. It excludes personal experimental data, private genome or transcriptome databases, dedicated pepper resources, credentials, presentations, theses, and manuscript source text.

See [attribution](plugins/bio-research-forge/ATTRIBUTION.md) and the [verification report](plugins/bio-research-forge/REVIEW_REPORT.md).
