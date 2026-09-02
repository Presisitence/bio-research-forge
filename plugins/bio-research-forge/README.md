# Bio Research Forge

[中文详细说明](README.zh-CN.md) | English

Bio Research Forge is a Codex plugin for evidence-first life-science research. It combines research design, omics, quantitative analysis, public biological databases, local RNA plotting, selective molecular tools, manuscript argument design, publication figures, reproducibility, and independent review.

## What is included

| Category | Skill | Main job |
|---|---|---|
| Coordination | `bio-research-orchestrator` | Route a complex request across bounded specialist roles and merge only verified outputs |
| Public sources | `public-bio-databases` | Query an allowlist of public biological APIs with source URLs and retrieval metadata |
| Study design | `experimental-design-gate` | Test question-data-design fit and issue Go, revise-and-Go, or No-Go |
| Omics | `omics-workflow` | Plan and audit sequencing and omics workflows without hiding design defects |
| RNA figures | `rna-figure-workflow` | Create volcano, PCA, heatmap, expression boxplot, and enrichment dotplot outputs as PNG/PDF plus plotted data |
| Statistics | `quantitative-research` | Select estimands, models, diagnostics, sensitivity analyses, and reportable quantities |
| Local tools | `local-bio-toolkit` | Detect installed PyMOL, SnapGene, Cytoscape, or Fiji and expose only bounded local actions |
| Compute | `secure-compute-routing` | Keep private data local or on controlled HPC; gate any external cloud transfer |
| Writing | `manuscript-argument` | Build Introduction and Discussion logic without inventing claims or citations |
| Figures | `scientific-figure-delivery` | Produce publication outputs plus a PNG preview rendered directly in the conversation |
| Reproducibility | `reproducible-analysis` | Preserve parameters, environments, provenance, and clean rerun evidence |
| Review | `evidence-review` | Independently audit claims, citations, numbers, figures, code, and source data |

## Privacy boundary

This repository contains no private experimental dataset, private genome or transcriptome database, private paths, private credentials, or organism-specific private portal. It contains no bundled user thesis or presentation. See [PRIVACY.md](PRIVACY.md).

The Sol Genomics Network is represented only as a general public Solanaceae resource. Species-specific private resources and dedicated pepper portals are deliberately excluded. The public API server enforces this boundary.

## Public API tools

The bundled dependency-free MCP server exposes:

- `bio_api_catalog`: list the supported public sources and their limits;
- `bio_api_query`: run one bounded query against NCBI, UniProt, InterPro, Ensembl, AlphaFold DB, RCSB PDB, Europe PMC, STRING, JASPAR, or the verified public SGN BrAPI metadata endpoint;
- `bio_api_health`: verify server and optional live-source reachability.

All responses include the source URL and retrieval time. Network calls are read-only. Results are capped, arbitrary URLs are rejected, and local files are never uploaded.

## Local RNA figures and molecular tools

The local RNA MCP produces volcano plots, PCA, clustered heatmaps, expression boxplots, and enrichment dotplots. Each successful call returns a PNG for direct conversation preview, a PDF, and the exact plotted-data CSV. R and required packages are detected at runtime; the plugin does not contain a private expression dataset or contributor-specific R path.

The local biology-tool MCP detects PyMOL, SnapGene, Cytoscape, and Fiji at runtime. PyMOL accepts only fixed, headless rendering presets. The other applications can only open an existing compatible file after an explicit request. The bridge cannot install software or execute arbitrary tool commands.

## Local development

Requirements: Codex and Node.js 18 or newer.

```powershell
node tests/protocol-smoke.mjs
node tests/rna-figure-protocol-smoke.mjs
node tests/local-tools-protocol-smoke.mjs
node tests/rna-figure-render-smoke.mjs
node tests/pymol-render-smoke.mjs
node tests/privacy-boundary.mjs
node tests/skill-structure.mjs
node tests/live-api-smoke.mjs
```

To install this repository marketplace in Codex:

```powershell
codex plugin marketplace add "<repository-root>"
codex plugin add bio-research-forge@bio-research-forge
```

Start a new Codex task after installation so the skills and MCP tools are discovered.

## Attribution and license

The plugin is licensed under AGPL-3.0-or-later because parts of its role architecture and research-workbench discipline were adapted from DAWN Science. See [ATTRIBUTION.md](ATTRIBUTION.md) for exact provenance and boundaries.
