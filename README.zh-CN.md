# Bio Research Forge 插件仓库

[English](README.md) | 中文

这是 Bio Research Forge 的 Codex 插件源码与本地 Marketplace。它面向生命科学研究，强调证据边界、可复现分析、科研出图、论文写作和独立 Review。

详细的功能、输入格式、隐私边界与使用示例见[插件中文说明](plugins/bio-research-forge/README.zh-CN.md)。

## 仓库内容

- `plugins/bio-research-forge/`：插件本体；
- `.agents/plugins/marketplace.json`：Codex Marketplace 入口；
- `.github/workflows/verify.yml`：GitHub Actions 自动验证；
- `LICENSE`：GNU AGPL-3.0-or-later。

插件目前包括 12 个分类技能和 3 个 MCP 服务：

1. 公共生物数据库查询；
2. RNA-seq 常用结果图；
3. PyMOL、SnapGene、Cytoscape、Fiji 的选择性本地桥接；
4. 实验设计、组学、统计、计算环境、论文写作、科研作图、可复现性和独立审查。

## 本地安装

克隆仓库后，在仓库根目录执行：

```powershell
codex plugin marketplace add "<仓库根目录>"
codex plugin add bio-research-forge@bio-research-forge
```

安装后新建一个 Codex 任务，使技能和 MCP 工具进入新任务的工具目录。

## 验证

```powershell
cd plugins/bio-research-forge
npm test
npm run test:render
npm run test:live
```

- `npm test`：MCP 协议、技能结构和隐私边界；
- `npm run test:render`：5 种 RNA 图和 PyMOL PNG 真实渲染；
- `npm run test:live`：公共数据库接口连通性。

## 公开范围

本仓库不包含任何个人实验数据、私有基因组或转录组数据库、辣椒专用数据门户、访问凭据、PPT、毕业论文或稿件原文。用户在任务中明确选择的文件可以在本机临时处理，但不会被写入插件源码或上传到公共 API。

第三方项目和软件的来源说明见[ATTRIBUTION.md](plugins/bio-research-forge/ATTRIBUTION.md)。
