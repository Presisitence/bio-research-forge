# Bio Research Forge：通用 Agent 生命科学插件

[English](README.md) | 中文

Bio Research Forge 可按“**通用 Agent 核心 + 可选客户端适配器**”接入。

通用核心遵循 [Agent Plugins 1.0](https://agent-plugins.org/) 和 Model Context Protocol（MCP）。只要 Agent 客户端支持本地 MCP stdio，就能直接加载三个 MCP 服务；支持 Agent Plugins 1.0 的客户端还能自动发现 12 个技能。没有原生 MCP 功能、但能够运行本地命令的 Agent，也可以通过仓库提供的命令行桥调用同一组工具。

因此它可以服务于不同模型和客户端，比如：Codex、Claude、Cursor、VS Code/GitHub Copilot、OpenAI Agents SDK 都只是不同的接入方式。

## 仓库结构

| 路径 | 定位 |
|---|---|
| `plugin.json` |Agent Plugins |
| `skills/` | 12 个通用 Agent Skills |
| `mcp.json` | 3 个通用 stdio MCP 服务定义 |
| `scripts/print-mcp-config.mjs` | 为通用 MCP、Claude、Cursor、VS Code 生成本机配置 |
| `scripts/call-tool.mjs` | 没有 MCP 客户端时，通过命令行列出和调用工具 |
| `plugins/bio-research-forge/` | MCP 实现、R 绘图脚本、测试以及自包含的兼容包 |
| `.agents/plugins/marketplace.json` | **可选的 例如Codex 安装适配器**，不是通用核心入口 |
| `LICENSE` | GNU AGPL-3.0-or-later |

`.agents/plugins/marketplace.json` 被保留，只是为了让 Codex 用户可以一键安装。其他 Agent 不读取它，也不依赖它；真正跨 Agent 的入口是根目录的 `plugin.json`、`skills/` 和 `mcp.json`。

## 三种通用使用方式

### 方式一：Agent Plugins 1.0

支持 Agent Plugins 1.0 的客户端可以从仓库根目录发现：

- `plugin.json`：插件身份、版本、许可证和仓库信息；
- `skills/`：实验设计、组学、RNA 出图、统计、写作、Review 等技能；
- `mcp.json`：公共数据库、RNA 出图和本地生命科学工具服务。

这是首选的跨工具分发方式。

### 方式二：任何支持 MCP stdio 的 Agent

克隆仓库后运行：

```powershell
node scripts/print-mcp-config.mjs --client generic
```

脚本会输出包含三个 MCP 服务的 JSON，并自动填写当前仓库的绝对路径。把输出复制到 Agent 客户端的 MCP 配置即可。

客户端专用输出：

```powershell
node scripts/print-mcp-config.mjs --client claude
node scripts/print-mcp-config.mjs --client cursor
node scripts/print-mcp-config.mjs --client vscode
```

### 方式三：没有 MCP、但可以运行命令的 Agent

列出服务器：

```powershell
node scripts/call-tool.mjs list-servers
```

查看一个服务器提供的工具：

```powershell
node scripts/call-tool.mjs list-tools public-bio-api
```

调用具体工具：

```powershell
node scripts/call-tool.mjs call public-bio-api bio_api_catalog "{}"
```

这样 Agent 不需要实现 MCP 客户端，也能通过 Shell 读取结构化 JSON 结果。

## 能力范围

插件包括：

1. 公共生物数据库查询；
2. RNA-seq 火山图、PCA、热图、表达箱线图和富集气泡图；
3. PyMOL 安全渲染；
4. SnapGene、Cytoscape、Fiji 的受限本地打开；
5. 实验设计、组学、统计、计算环境、论文写作、科研作图、可复现性和独立审查。

详细的输入格式、证据边界和 Review 规则见[插件中文手册](plugins/bio-research-forge/README.zh-CN.md)，各客户端配置见[跨 Agent 接入指南](docs/AGENT-INTEGRATION.zh-CN.md)。

## 可选的 Codex 安装

只有使用 Codex 时才需要下面两条命令：

```powershell
codex plugin marketplace add "<仓库根目录>"
codex plugin add bio-research-forge@bio-research-forge
```

Claude、Cursor、VS Code、OpenAI Agents SDK 或其他 MCP Agent 不需要执行这些命令。

## 验证

```powershell
npm test
npm run test:render
npm run test:live
```

- `npm test`：Agent Plugins 1.0 结构、配置生成器、CLI 桥、MCP 协议、技能结构和隐私边界；
- `npm run test:render`：5 种 RNA 图和 PyMOL PNG 的真实渲染；
- `npm run test:live`：公共数据库接口连通性。

## 公开范围
第三方项目和软件的来源说明见 [ATTRIBUTION.md](plugins/bio-research-forge/ATTRIBUTION.md)。
