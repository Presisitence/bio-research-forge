# Verification report

Date: 2026-09-02

## Scope

Reviewed the vendor-neutral Agent Plugins 1.0 manifests, optional Codex marketplace adapter, twelve portable skill packages, three MCP servers, command-line bridge, privacy boundary, attribution, tests, local installation, and installed cache.

This report was produced in the same implementation task and is therefore a maintainer verification, not a blinded independent review. Objective validators and live endpoint tests provide the main evidence.

## Evidence matrix

| Requirement | Evidence | Status |
|---|---|---|
| Vendor-neutral package | Root `plugin.json` and `mcp.json` passed the official Agent Plugins 1.0 JSON Schemas | verified |
| Cross-agent access | Generic, Claude, Cursor, and VS Code MCP configuration generation passed; the shell bridge initialized MCP and returned a real tool result | verified by execution |
| Codex plugin structure | Official plugin validator passed | verified |
| Skill structure | Official skill validator passed for all twelve skills | verified |
| MCP protocol | Protocol smoke tests passed for the public API, RNA figure, and local-tool servers | verified |
| Public interfaces | Live checks passed for NCBI, UniProt, InterPro, Ensembl, AlphaFold DB, RCSB PDB, Europe PMC, STRING, JASPAR, and SGN public metadata | verified |
| Private-data exclusion | Static path/resource scan passed; a species-specific excluded query was blocked before network access | verified |
| Attribution | DAWN Science project, revision, license, and adapted material are identified in `ATTRIBUTION.md` | verified |
| Source-document privacy | No local presentation, thesis, manuscript, dataset, or copied passage is present | verified |
| RNA figure generation | Volcano, PCA, heatmap, expression boxplot, and enrichment dotplot each produced valid PNG/PDF/data outputs from synthetic temporary fixtures | verified by execution |
| Local tool discovery | PyMOL, SnapGene, Cytoscape, and Fiji were detected on the maintainer machine without stored absolute paths | verified by execution |
| PyMOL rendering | A synthetic minimal PDB produced a valid PNG through the fixed-preset headless bridge | verified by execution |
| Inline figure delivery | Figure skills require a final PNG preview in the conversation plus publication files | verified as instruction contract |
| Review capability | Review skill covers scientific claims, citations, numbers, figure-code-data consistency, reproducibility, and privacy | verified as instruction contract |
| Codex installation | Marketplace added; plugin reported `installed, enabled`, base version `0.1.0` with a local Codex cachebuster | verified |
| Cache integrity | Selected source/cache files had identical SHA-256 hashes; cached MCP and privacy tests passed | verified |

## Known limits

- Agent Plugins 1.0 and local MCP support vary by client version. A client with neither MCP nor shell execution can read the skills but cannot execute the bundled tools.
- A newly installed skill/MCP becomes available to Codex in a new task; the active task does not hot-reload its own tool catalog.
- The SGN connector is intentionally limited to a verified unauthenticated generic metadata endpoint. It does not scrape the site or expose pepper-specific operations.
- Public APIs can change availability, schema, terms, or rate limits. The live smoke test should run before release.
- The conversation-preview rule controls plugin behavior but does not modify Codex application UI code.
- SnapGene, Cytoscape, and Fiji were detected but deliberately not launched during verification; opening a desktop application requires an explicit user request and a compatible existing file.
- Local R and desktop-tool availability is machine-dependent. Runtime detection reports missing dependencies and never installs them silently.

## Verdict

`PASS`

The repository is suitable for cross-agent local use and public distribution. The optional Codex packaging is only one adapter over the same portable skills and MCP services.
