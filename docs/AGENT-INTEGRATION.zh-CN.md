# 跨 Agent 接入指南

Bio Research Forge 的核心是三个本地 stdio MCP 服务。MCP 连接本身与模型厂商无关；客户端只需要能够启动本地 Node.js 进程，并通过标准输入输出交换 JSON-RPC 消息。

## Agent Plugins 1.0 通用包

仓库根目录已经提供：

- `plugin.json`：Agent Plugins 1.0 厂商无关清单；
- `skills/`：12 个可移植技能；
- `mcp.json`：3 个可移植 MCP 定义。

兼容 Agent Plugins 1.0 的客户端可以从这些固定位置发现技能和 MCP，不需要 Codex Marketplace。

## 自动生成客户端配置

在克隆后的仓库根目录运行：

```powershell
node scripts/print-mcp-config.mjs --client generic
```

也可以指定：

```powershell
node scripts/print-mcp-config.mjs --client claude
node scripts/print-mcp-config.mjs --client cursor
node scripts/print-mcp-config.mjs --client vscode
```

生成器会读取当前仓库位置，自动输出正确的绝对路径，因此仓库路径中包含空格也可以使用。它只打印配置，不会修改客户端设置。

## Claude Code

将 `--client claude` 的输出保存为目标项目根目录的 `.mcp.json`。Claude Code 会把它识别为项目级 MCP 配置，并在首次使用时要求用户确认信任。

也可以将单个服务器注册为用户级工具。三个服务器互相独立，因此用户可以只启用公共数据库、RNA 出图或本地软件桥中的一部分。

## Cursor

将 `--client cursor` 的输出放入：

- 项目级：`.cursor/mcp.json`；
- 全局级：用户目录下的 `.cursor/mcp.json`。

保存后重启或刷新 Cursor 的 MCP 列表。可以在 Cursor 的工具面板中分别启用或禁用服务器。

## VS Code / GitHub Copilot

将 `--client vscode` 的输出放入 `.vscode/mcp.json`。该格式使用顶层 `servers`，每个本地服务器声明 `type: stdio`、`command` 和 `args`。

支持 Agent Plugins 1.0 的新版客户端也可以直接读取仓库根目录的 `plugin.json`、`skills/` 和 `mcp.json`。

## OpenAI Agents SDK

使用 Python SDK 时，为每个服务器创建一个 `MCPServerStdio`，其 `params` 中填写配置生成器给出的 `command` 和 `args`，然后把服务器对象放入 `Agent(mcp_servers=[...])`。

这里使用的是本地 stdio，而不是远程托管 MCP；输入文件仍留在本机进程中。

## Codex

Codex 可以直接使用同样的三个 MCP。仓库中的 `.agents/plugins/marketplace.json` 和插件内的 `.codex-plugin/plugin.json` 只是 Codex 的可选安装适配器。

不使用 Codex 时可以完全忽略这两个文件。它们不会影响其他 Agent 加载根目录的通用清单。

## 没有 MCP 功能的 Agent

如果 Agent 可以运行 Shell 命令，可以使用命令行桥：

```powershell
node scripts/call-tool.mjs list-servers
node scripts/call-tool.mjs list-tools public-bio-api
node scripts/call-tool.mjs call public-bio-api bio_api_catalog "{}"
```

命令行桥会启动服务器、完成 MCP 初始化、执行操作、输出 JSON，然后关闭进程。Agent 可以读取 JSON 后继续推理。

如果客户端既不支持 MCP，也不能运行本地命令，它就无法执行本地工具；此时仍可以阅读技能说明，但需要换到具备工具执行能力的宿主才能真正运行分析。

## 三个服务器

| 服务器 | 主要工具 | 网络和本地边界 |
|---|---|---|
| `public-bio-api` | 公共数据库目录、查询、健康检查 | 只访问允许名单中的公共只读 API，不读取本地研究文件 |
| `rna-figure` | 环境检查、RNA 图生成 | 本机读取用户指定表格，输出 PNG/PDF/绘图数据，不上传文件 |
| `local-bio-tools` | 工具检测、PyMOL 渲染、显式打开文件 | 本机运行；不安装软件，不接受任意命令 |

## 官方规范参考

- [Agent Plugins 1.0](https://agent-plugins.org/)
- [Cursor MCP](https://cursor.com/docs/context/model-context-protocol)
- [VS Code MCP 配置](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)
- [Claude Code MCP](https://code.claude.com/docs/en/mcp)
- [OpenAI Agents SDK MCP](https://openai.github.io/openai-agents-python/mcp/)
