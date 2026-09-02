# Cross-agent integration

Bio Research Forge exposes three local stdio MCP servers. The model provider is irrelevant to the MCP wire connection; the client must be able to spawn a local Node.js process and exchange JSON-RPC over stdin/stdout.

## Portable Agent Plugins 1.0

The repository root is an Agent Plugins 1.0 package with `plugin.json`, `skills/`, and `mcp.json`. A compatible client can discover the twelve skills and three MCP servers from those standard locations.

## Generate native MCP configuration

Run one of:

```text
node scripts/print-mcp-config.mjs --client generic
node scripts/print-mcp-config.mjs --client claude
node scripts/print-mcp-config.mjs --client cursor
node scripts/print-mcp-config.mjs --client vscode
```

The generic, Claude, and Cursor variants use the `mcpServers` form. The VS Code variant uses its `servers` form with `type: stdio`. Copy the JSON to the configuration location documented by the client.

## Client notes

- Claude Code accepts project-scoped stdio servers in `.mcp.json` and asks the user to approve project servers.
- Cursor reads project configuration from `.cursor/mcp.json` or global configuration from `~/.cursor/mcp.json`.
- VS Code uses `.vscode/mcp.json`; portable Agent Host configuration can also use workspace `.mcp.json`.
- OpenAI Agents SDK can spawn each entrypoint with `MCPServerStdio` and attach the resulting server object to an `Agent`.
- Codex may use the same MCP servers directly; its marketplace files in this repository are only an optional packaging adapter.

Official references: [Agent Plugins](https://agent-plugins.org/), [Cursor MCP](https://cursor.com/docs/context/model-context-protocol), [VS Code MCP configuration](https://code.visualstudio.com/docs/agents/reference/mcp-configuration), [Claude Code MCP](https://code.claude.com/docs/en/mcp), and [OpenAI Agents SDK MCP](https://openai.github.io/openai-agents-python/mcp/).

## Shell fallback

For agents that can run a local command but do not implement MCP:

```text
node scripts/call-tool.mjs list-servers
node scripts/call-tool.mjs list-tools rna-figure
node scripts/call-tool.mjs call public-bio-api bio_api_catalog "{}"
```

The bridge initializes the selected MCP server, performs the requested list/call operation, prints JSON, and exits.

An agent that supports neither MCP nor local command execution cannot invoke local tools. In that case the skills remain readable guidance, but tool execution needs a compatible host.
