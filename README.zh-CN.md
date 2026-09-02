# Bio Research Forge

[English](README.md) | 中文

面向生命科学研究的通用 Agent 插件，不绑定 Codex、模型厂商或单一客户端。支持 Agent Plugins 1.0、MCP stdio 或本地命令调用的 Agent 都可以使用。

插件目前包括 12 个分类技能和 3 个 MCP 服务：

1. 公共生物数据库查询；
2. RNA-seq 常用结果图；
3. PyMOL、SnapGene、Cytoscape、Fiji 的选择性本地桥接；
4. 实验设计、组学、统计、计算环境、论文写作、科研作图、可复现性和独立审查。

通用入口位于仓库根目录的 `plugin.json`、`skills/` 和 `mcp.json`。不同 Agent 的接入方法见[跨 Agent 接入指南](docs/AGENT-INTEGRATION.zh-CN.md)。

本仓库只包含通用能力和公共 API 接口，不包含个人实验数据、私有基因组或转录组数据库、辣椒专用资源、访问凭据、PPT、毕业论文或稿件原文。

第三方项目与软件来源见 [ATTRIBUTION.md](plugins/bio-research-forge/ATTRIBUTION.md)，验证结果见 [REVIEW_REPORT.md](plugins/bio-research-forge/REVIEW_REPORT.md)。
